import { test, expect, Page } from "@playwright/test";
import path from "path";
import fs from "fs";

const SHOTS_DIR = path.join(__dirname, "screenshots");
if (!fs.existsSync(SHOTS_DIR)) fs.mkdirSync(SHOTS_DIR, { recursive: true });

const consoleMessages: { type: string; text: string; location?: string }[] = [];
const pageErrors: string[] = [];

function shot(page: Page, name: string) {
  return page.screenshot({
    path: path.join(SHOTS_DIR, name),
    fullPage: true,
  });
}

async function attachConsoleSpies(page: Page) {
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()?.url,
      });
    }
  });
  page.on("pageerror", (err) => pageErrors.push(err.message));
}

// Injeta uma "fake session" no localStorage para destravar o gate de auth.
// Não cria usuário no Supabase — apenas engana o RequireAuth do front.
async function injectFakeSession(page: Page) {
  const SUPABASE_KEY = "sb-fygccvobsjaubkbidavq-auth-token";
  const now = Math.floor(Date.now() / 1000);
  const fakeSession = {
    access_token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzbW9rZS10ZXN0IiwiZW1haWwiOiJzbW9rZUBleGFtcGxlLmNvbSIsImV4cCI6OTk5OTk5OTk5OX0.fakefakefakefakefakefakefakefakefakefakefake",
    token_type: "bearer",
    expires_in: 3600,
    expires_at: now + 3600,
    refresh_token: "fake-refresh-token",
    user: {
      id: "00000000-0000-0000-0000-000000000000",
      aud: "authenticated",
      role: "authenticated",
      email: "smoke@example.com",
      email_confirmed_at: new Date().toISOString(),
      app_metadata: { provider: "email" },
      user_metadata: {},
      created_at: new Date().toISOString(),
    },
  };
  await page.addInitScript(
    ([key, sess]) => {
      try {
        window.localStorage.setItem(key as string, JSON.stringify(sess));
      } catch {}
    },
    [SUPABASE_KEY, fakeSession]
  );
}

test.describe.serial("Contractelma — Smoke E2E", () => {
  test.beforeAll(() => {
    consoleMessages.length = 0;
    pageErrors.length = 0;
  });

  test("01 - Home (sem auth) → Auth gate", async ({ page }) => {
    await attachConsoleSpies(page);
    await page.goto("/", { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(1500);
    await shot(page, "01-home-no-auth.png");
    // Espera ter sido redirecionado para /auth
    const url = page.url();
    console.log("URL após /:", url);
    await shot(page, "02-auth-page.png");
  });

  test("02 - Templates (sem auth) → redireciona pro Auth", async ({ page }) => {
    await attachConsoleSpies(page);
    await page.goto("/templates", { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(1200);
    console.log("URL após /templates:", page.url());
    await shot(page, "03-templates-no-auth.png");
  });

  test("03 - NotFound", async ({ page }) => {
    await attachConsoleSpies(page);
    await page.goto("/rota-que-nao-existe-xyz", { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(800);
    console.log("URL após rota fake:", page.url());
    await shot(page, "04-notfound-or-redirect.png");
  });

  test("04 - Dashboard com sessão FAKE", async ({ page }) => {
    await injectFakeSession(page);
    await attachConsoleSpies(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2500);
    console.log("URL Dashboard:", page.url());
    await shot(page, "05-dashboard-fake-session.png");
  });

  test("05 - Wizard /contract/new — Passo 1 (Template)", async ({ page }) => {
    await injectFakeSession(page);
    await attachConsoleSpies(page);
    await page.goto("/contract/new", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2500);
    console.log("URL contract/new:", page.url());
    await shot(page, "06-wizard-step1-templates.png");

    // Procura o card "SaaS Oxy + Gênio" entre os defaults
    const candidate = page
      .locator(
        "text=/saas oxy.*g[êe]nio.*modelo 1/i"
      )
      .first();
    if (await candidate.count()) {
      await candidate.scrollIntoViewIfNeeded();
      await shot(page, "07-wizard-step1-template-found.png");
      await candidate.click({ trial: false }).catch(async () => {
        // Tenta clicar no card pai
        const card = candidate.locator("xpath=ancestor::*[self::div or self::button][1]");
        await card.click();
      });
      await page.waitForTimeout(1500);
      await shot(page, "08-wizard-step2-dados-inicial.png");
    } else {
      console.warn("Card SaaS Oxy + Gênio não encontrado");
      await shot(page, "07-wizard-step1-no-template.png");
    }
  });

  test("06 - Wizard Passo 2 — preencher dados completos", async ({ page }) => {
    await injectFakeSession(page);
    await attachConsoleSpies(page);
    await page.goto("/contract/new", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    // Selecionar template SaaS Oxy + Gênio
    const tmpl = page
      .locator("text=/saas oxy.*g[êe]nio.*modelo 1/i")
      .first();
    await tmpl.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await tmpl.click().catch(async () => {
      const card = tmpl.locator("xpath=ancestor::*[self::div or self::button][1]");
      await card.click();
    });
    await page.waitForTimeout(1500);

    // Clica em "Preencher Manualmente" se aparecer (upload area)
    const manualBtn = page.getByRole("button", { name: /preencher manualmente/i });
    if (await manualBtn.count()) {
      await manualBtn.click();
      await page.waitForTimeout(800);
    }
    await shot(page, "09-wizard-step2-form-aberto.png");

    // Lista de todos os accordion triggers — abrir todos
    const triggers = page.locator("button[data-state]:has-text('Empresa'), button[data-state]:has-text('Representante'), button[data-state]:has-text('Contato'), button[data-state]:has-text('Remunera'), button[data-state]:has-text('Vig'), button[data-state]:has-text('Assinatura')");
    const total = await triggers.count();
    for (let i = 0; i < total; i++) {
      const state = await triggers.nth(i).getAttribute("data-state");
      if (state === "closed") {
        await triggers.nth(i).click().catch(() => {});
        await page.waitForTimeout(150);
      }
    }
    await shot(page, "10-wizard-step2-todas-categorias.png");

    // ============ PREENCHIMENTO DE CAMPOS ============
    const fields: Record<string, string> = {
      razao_social: "ACME Tecnologia LTDA",
      RAZAO_SOCIAL: "ACME Tecnologia LTDA",
      cnpj: "12345678000190",
      CNPJ: "12345678000190",
      CEP: "01452001",
      cep: "01452001",
      endereco: "Av. Brigadeiro Faria Lima, 1811, Jardim Paulista, São Paulo - SP",
      ENDERECO: "Av. Brigadeiro Faria Lima, 1811, Jardim Paulista, São Paulo - SP",
      nome: "João da Silva Pereira",
      NOME_REPRESENTANTE: "João da Silva Pereira",
      cpf: "12345678901",
      CPF_REPRESENTANTE: "12345678901",
      email: "joao@acme.com.br",
      EMAIL_REPRESENTANTE: "joao@acme.com.br",
      EMAIL: "joao@acme.com.br",
      TELEFONE: "11999998888",
      telefone: "11999998888",
      valor_extenso_setup: "12000",
      VALOR_SETUP: "12000",
      valor_plataforma: "2500",
      VALOR_MENSALIDADE: "2500",
      VALOR_CFO: "5000",
      parcelas_valor_extenso: "12",
      data_setup: "01/06/2026",
      prazo_vigencia: "12 meses",
      PRAZO_VIGENCIA: "12 meses",
      dias_rescisao: "30",
      PRAZO_RESCISAO: "30",
      AVISO_DIAS: "30",
      dias_primeiro_pagamento: "30",
      inicio_vigencia: "01/06/2026",
      DIA: "12",
      dia: "12",
      MES: "maio",
      mes: "maio",
      ANO: "2026",
      ano: "26",
      DESCRICAO_SERVICOS: "Setup + licença mensal das plataformas Oxy e Gênio",
      servico: "Setup e licença de uso das plataformas Oxy e Gênio",
    };

    // Helper para escapar IDs para querySelector (sem CSS.escape em Node)
    const escapeCSS = (s: string) => s.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");

    for (const [key, value] of Object.entries(fields)) {
      const input = page.locator(`#${escapeCSS(key)}`);
      if (await input.count()) {
        try {
          await input.scrollIntoViewIfNeeded({ timeout: 1000 });
          await input.fill("");
          await input.fill(value);
          await input.blur();
          await page.waitForTimeout(120);
        } catch (e) {
          console.warn("Falha preencher", key, e);
        }
      }
    }
    await page.waitForTimeout(800);
    await shot(page, "11-wizard-step2-tudo-preenchido.png");

    // Screenshot focado no painel esquerdo (form), viewport only
    await page.screenshot({
      path: path.join(SHOTS_DIR, "11b-step2-form-viewport.png"),
      fullPage: false,
    });

    // Snapshot dos valores REAIS dos inputs por chave (útil pra detectar máscara errada)
    const valuesById = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll("input[id]"));
      const out: Record<string, string> = {};
      for (const inp of inputs) {
        const el = inp as HTMLInputElement;
        out[el.id] = el.value;
      }
      return out;
    });
    fs.writeFileSync(
      path.join(SHOTS_DIR, "_input-values-after-fill.json"),
      JSON.stringify(valuesById, null, 2)
    );

    // Tenta clicar em "Usar data de hoje"
    const todayBtn = page.getByRole("button", { name: /usar data de hoje/i });
    if (await todayBtn.count()) {
      await todayBtn.first().click().catch(() => {});
      await page.waitForTimeout(500);
      await shot(page, "12-wizard-step2-data-hoje.png");
    }

    // Live preview (lado direito)
    const previewPanel = page.locator("[class*='ResizablePanel'], [data-panel]").last();
    if (await previewPanel.count()) {
      await shot(page, "13-wizard-step2-preview-live.png");
    }

    // Capturar helpers de extenso/máscara
    const helpers = await page.locator("p.text-\\[11px\\]").allTextContents();
    fs.writeFileSync(
      path.join(SHOTS_DIR, "_helpers-extenso.txt"),
      helpers.join("\n")
    );

    // Avançar pro passo 3
    const nextBtn = page.getByRole("button", { name: /avan[çc]ar|pr[óo]ximo|gerar contrato|continuar/i }).last();
    if (await nextBtn.count()) {
      await nextBtn.scrollIntoViewIfNeeded();
      await nextBtn.click().catch(() => {});
      await page.waitForTimeout(2000);
      await shot(page, "14-wizard-step3-gerar.png");
    }

    // Botão "Gerar Contrato" no passo 3
    const gerarBtn = page.getByRole("button", { name: /^gerar contrato$|gerar pdf|gerar docx/i });
    if (await gerarBtn.count()) {
      await gerarBtn.first().click().catch(() => {});
      await page.waitForTimeout(2500);
      await shot(page, "15-wizard-step3-preview-renderizado.png");
    }

    // Procurar área SendToSignature
    const sendArea = page.locator("text=/enviar para assinatura|signat[áa]rios|autentique/i").first();
    if (await sendArea.count()) {
      await sendArea.scrollIntoViewIfNeeded().catch(() => {});
      await shot(page, "16-send-to-signature-area.png");

      // Preencher 1 signatário
      const signerName = page.locator("input[placeholder*='nome' i]").first();
      const signerEmail = page.locator("input[type='email']").first();
      if (await signerName.count()) await signerName.fill("Maria Aprovadora");
      if (await signerEmail.count()) await signerEmail.fill("maria@acme.com.br");
      await page.waitForTimeout(500);
      await shot(page, "17-send-to-signature-preenchido.png");

      // Tenta abrir o AlertDialog de confirmação (mas NÃO clica no envio final)
      const confirmBtn = page.getByRole("button", { name: /enviar.*autentique|enviar para assinatura/i });
      if (await confirmBtn.count()) {
        await confirmBtn.first().click().catch(() => {});
        await page.waitForTimeout(800);
        await shot(page, "18-alert-dialog-pre-envio.png");
        // Cancela
        const cancel = page.getByRole("button", { name: /cancelar/i });
        if (await cancel.count()) await cancel.first().click().catch(() => {});
      }
    }
  });

  test.afterAll(async () => {
    fs.writeFileSync(
      path.join(SHOTS_DIR, "_console-errors.json"),
      JSON.stringify({ consoleMessages, pageErrors }, null, 2)
    );
  });
});
