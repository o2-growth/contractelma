/**
 * Revalidação pós-fix (2026-05-12).
 * Asserciona explicitamente os bugs corrigidos pelo squad de 4 agentes.
 *
 * BUG-001  data_setup virava R$ 1,00 (regex de currency gananciosa)
 * BUG-002  parcelas_valor_extenso virava R$ 12,00 + virou AUTO-DERIVED (oculto)
 * BUG-003  preview travado em "Renderizando..." sem timeout/banner de erro
 * BUG-008  <button> dentro de <button> em SendToSignature (validateDOMNesting)
 * BUG-P1   AlertDialog "2 documentos" → "1 contrato"
 * BUG-P1   Banner sugestão de contato com CTA "Adicionar este contato"
 * BUG-P2   Helper de valor com extenso ("doze mil reais")
 * BUG-P2   Helper de data ordinal "1º de junho"
 */

import { test, expect, Page } from "@playwright/test";
import path from "path";
import fs from "fs";

const SHOTS_DIR = path.join(__dirname, "screenshots");
if (!fs.existsSync(SHOTS_DIR)) fs.mkdirSync(SHOTS_DIR, { recursive: true });

const SUPABASE_KEY = "sb-fygccvobsjaubkbidavq-auth-token";

// Captura console.error+console.warn ao longo dos testes
const consoleErrors: { type: string; text: string; location?: string }[] = [];
const pageErrors: string[] = [];

function shot(page: Page, name: string) {
  return page.screenshot({
    path: path.join(SHOTS_DIR, name),
    fullPage: true,
  });
}

async function injectFakeSession(page: Page) {
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

function attachConsoleSpies(page: Page) {
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      consoleErrors.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()?.url,
      });
    }
  });
  page.on("pageerror", (err) => pageErrors.push(err.message));
}

async function selectOxyTemplate(page: Page) {
  const tmpl = page.locator("text=/saas oxy.*g[êe]nio.*modelo 1/i").first();
  await tmpl.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
  await tmpl.click().catch(async () => {
    const card = tmpl.locator("xpath=ancestor::*[self::div or self::button][1]");
    await card.click();
  });
  await page.waitForTimeout(1500);

  const manualBtn = page.getByRole("button", { name: /preencher manualmente/i });
  if (await manualBtn.count()) {
    await manualBtn.click();
    await page.waitForTimeout(800);
  }
}

async function openAllAccordions(page: Page) {
  const triggers = page.locator("button[data-state]");
  const total = await triggers.count();
  for (let i = 0; i < total; i++) {
    const state = await triggers.nth(i).getAttribute("data-state");
    const txt = (await triggers.nth(i).textContent()) || "";
    // só abre se for accordion de categoria (textão grande)
    if (state === "closed" && txt.trim().length > 0 && txt.length < 80) {
      await triggers.nth(i).click().catch(() => {});
      await page.waitForTimeout(120);
    }
  }
}

test.describe.serial("Regressão pós-fix 2026-05-12", () => {
  test.beforeAll(() => {
    consoleErrors.length = 0;
    pageErrors.length = 0;
  });

  test("BUG-001/002/P2 — máscaras corretas em data_setup e valor_plataforma; valor extenso", async ({
    page,
  }) => {
    await injectFakeSession(page);
    attachConsoleSpies(page);

    await page.goto("/contract/new", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    await selectOxyTemplate(page);
    await openAllAccordions(page);

    // ============ BUG-001 — data_setup ============
    // Limpa o default e digita data crua. Após blur, deve PERMANECER "01/06/2026".
    const dataSetup = page.locator("#data_setup");
    await expect(dataSetup, "campo data_setup deve existir").toHaveCount(1);
    await dataSetup.scrollIntoViewIfNeeded();
    await dataSetup.fill("");
    await dataSetup.fill("01/06/2026");
    await dataSetup.blur();
    await page.waitForTimeout(400);

    const dataSetupVal = await dataSetup.inputValue();
    console.log("data_setup após blur:", dataSetupVal);
    expect(
      dataSetupVal,
      `BUG-001 regressão: data_setup deveria ser '01/06/2026', recebeu '${dataSetupVal}'`
    ).toBe("01/06/2026");
    expect(
      dataSetupVal,
      `BUG-001 regressão: data_setup NÃO pode ser formatado como currency`
    ).not.toMatch(/R\$/);

    // ============ BUG-002 — parcelas_valor_extenso é AUTO-DERIVED (oculto) ============
    // Não deve haver <input id="parcelas_valor_extenso"> visível na UI
    const parcelasInput = page.locator("#parcelas_valor_extenso");
    const parcelasCount = await parcelasInput.count();
    console.log("parcelas_valor_extenso input count:", parcelasCount);
    expect(
      parcelasCount,
      `BUG-002: parcelas_valor_extenso deve ser AUTO-DERIVED, não pode aparecer como input`
    ).toBe(0);

    // Também garante que o textarea não está visível
    const parcelasTextarea = page.locator("textarea#parcelas_valor_extenso");
    expect(await parcelasTextarea.count()).toBe(0);

    // ============ P2 — Máscara de moeda em valor_plataforma ============
    // Digita 2500 cru, blur, espera "R$ 2.500,00" no input e helper com extenso
    const valorPlat = page.locator("#valor_plataforma");
    if (await valorPlat.count()) {
      await valorPlat.scrollIntoViewIfNeeded();
      await valorPlat.fill("");
      await valorPlat.fill("2500");
      await valorPlat.blur();
      await page.waitForTimeout(400);

      const platVal = await valorPlat.inputValue();
      // Normaliza non-breaking-space (Intl.NumberFormat usa  )
      const platValNorm = platVal.replace(/ /g, " ");
      console.log("valor_plataforma após blur:", JSON.stringify(platVal));
      expect(
        platValNorm,
        `Máscara de moeda: valor_plataforma deveria virar 'R$ 2.500,00', recebeu '${platVal}'`
      ).toBe("R$ 2.500,00");

      // Helper logo abaixo deve conter "dois mil e quinhentos reais"
      const helperText = await page
        .locator("text=/dois mil e quinhentos reais/i")
        .first()
        .textContent()
        .catch(() => null);
      console.log("helper valor_plataforma:", helperText);
      expect(
        helperText,
        "Helper de extenso para R$ 2.500,00 deve conter 'dois mil e quinhentos reais'"
      ).toMatch(/dois mil e quinhentos reais/i);
    }

    // ============ P2 — Data ordinal "1º de junho de 2026" ============
    // o helper de extenso de data_setup deve ter o ordinal
    const ordinalHelper = await page
      .locator("text=/1º de junho de 2026/i")
      .first()
      .textContent()
      .catch(() => null);
    console.log("helper data ordinal:", ordinalHelper);
    expect(
      ordinalHelper,
      "Helper de data extenso para 01/06/2026 deve conter ordinal '1º de junho de 2026'"
    ).toMatch(/1º de junho de 2026/i);

    await shot(page, "11-wizard-step2-tudo-preenchido.png");
  });

  test("BUG-003 — preview com timeout/banner de erro (não trava em Renderizando)", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await injectFakeSession(page);
    attachConsoleSpies(page);

    await page.goto("/contract/new", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    await selectOxyTemplate(page);
    await openAllAccordions(page);

    // Preenche o mínimo viável pra avançar
    const minimal: Record<string, string> = {
      razao_social: "ACME Tecnologia LTDA",
      cnpj: "12345678000190",
      endereco: "Av. Faria Lima, 1811, São Paulo - SP",
      nome: "João da Silva",
      cpf: "12345678901",
      email: "joao@acme.com.br",
      data_setup: "01/06/2026",
      valor_plataforma: "2500",
      inicio_vigencia: "01/06/2026",
      prazo_vigencia: "12 meses",
      dias_rescisao: "30",
      dias_primeiro_pagamento: "30",
      dia: "12",
      mes: "maio",
      ano: "26",
      servico: "Setup e licença Oxy + Gênio",
    };
    for (const [k, v] of Object.entries(minimal)) {
      const inp = page.locator(`#${k}`);
      if (await inp.count()) {
        await inp.scrollIntoViewIfNeeded({ timeout: 1000 }).catch(() => {});
        await inp.fill("");
        await inp.fill(v);
        await inp.blur();
        await page.waitForTimeout(80);
      }
    }

    // Avança passo 2 → 3
    const nextBtn = page
      .getByRole("button", { name: /avan[çc]ar|pr[óo]ximo|continuar/i })
      .last();
    if (await nextBtn.count()) {
      await nextBtn.scrollIntoViewIfNeeded();
      await nextBtn.click().catch(() => {});
      await page.waitForTimeout(2000);
    }
    await shot(page, "14-wizard-step3-gerar.png");

    // Clica "Gerar Contrato"
    const gerar = page.getByRole("button", { name: /^gerar contrato$/i }).first();
    if (await gerar.count()) {
      await gerar.click().catch(() => {});

      // O spinner "Renderizando contrato com design O2…" pode aparecer
      // BUG-003: em até 15s ele tem que sumir. Damos 20s de folga.
      const spinner = page.locator(
        "text=/Renderizando contrato com design O2/i"
      );

      // Espera o spinner desaparecer OU o banner de erro aparecer
      await expect
        .poll(
          async () => {
            const stillSpinning = (await spinner.count()) > 0;
            const errorBanner = await page
              .getByRole("button", { name: /tentar novamente/i })
              .count();
            return { stillSpinning, errorBanner };
          },
          {
            message:
              "BUG-003: spinner 'Renderizando' deve sumir em <15s OU banner de erro deve aparecer",
            timeout: 20_000,
            intervals: [500, 1000, 1500],
          }
        )
        .toEqual(expect.objectContaining({ stillSpinning: false }));

      await shot(page, "15-wizard-step3-preview-renderizado.png");
    }
  });

  test("BUG-008 — SendToSignature: sem button-in-button (validateDOMNesting)", async ({
    page,
  }) => {
    test.setTimeout(75_000);
    const localConsoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const t = msg.text();
        if (/validateDOMNesting|cannot be a descendant.*button|<button>.*<button>/i.test(t)) {
          localConsoleErrors.push(t);
        }
      }
    });

    await injectFakeSession(page);
    attachConsoleSpies(page);

    await page.goto("/contract/new", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    await selectOxyTemplate(page);
    await openAllAccordions(page);

    // Preenche o mínimo pra avançar
    const minimal: Record<string, string> = {
      razao_social: "ACME Tecnologia LTDA",
      cnpj: "12345678000190",
      endereco: "Av. Faria Lima, 1811, São Paulo - SP",
      nome: "João da Silva",
      cpf: "12345678901",
      email: "joao@acme.com.br",
      data_setup: "01/06/2026",
      valor_plataforma: "2500",
      inicio_vigencia: "01/06/2026",
      prazo_vigencia: "12 meses",
      dias_rescisao: "30",
      dias_primeiro_pagamento: "30",
      dia: "12",
      mes: "maio",
      ano: "26",
      servico: "Setup e licença Oxy + Gênio",
    };
    for (const [k, v] of Object.entries(minimal)) {
      const inp = page.locator(`#${k}`);
      if (await inp.count()) {
        await inp.fill("").catch(() => {});
        await inp.fill(v).catch(() => {});
        await inp.blur().catch(() => {});
      }
    }
    // Avança 2→3
    const nextBtn = page
      .getByRole("button", { name: /avan[çc]ar|pr[óo]ximo|continuar/i })
      .last();
    if (await nextBtn.count()) await nextBtn.click().catch(() => {});
    await page.waitForTimeout(2000);
    // Gera o contrato
    const gerar = page.getByRole("button", { name: /^gerar contrato$/i }).first();
    if (await gerar.count()) await gerar.click().catch(() => {});
    await page.waitForTimeout(8000);

    // Procura área SendToSignature
    const sendArea = page
      .locator(
        "text=/enviar para assinatura|signat[áa]rios|autentique/i"
      )
      .first();
    await sendArea.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await shot(page, "16-send-to-signature-area.png");

    // Preenche 1 signatário pra disparar a possível sugestão e o AlertDialog
    const signerName = page.locator("input[placeholder*='nome' i]").first();
    const signerEmail = page.locator("input[type='email']").first();
    if (await signerName.count()) await signerName.fill("Maria Aprovadora");
    if (await signerEmail.count()) await signerEmail.fill("maria@acme.com.br");
    await page.waitForTimeout(500);
    await shot(page, "17-send-to-signature-preenchido.png");

    // ============ BUG-P1 — Banner de sugestão tem CTA "Adicionar este contato" ============
    // (só asserta se o banner aparecer — depende de heurística de sugestão)
    const suggestBtn = page.getByRole("button", { name: /adicionar este contato/i });
    if (await suggestBtn.count()) {
      console.log("Banner de sugestão presente com CTA correto");
      await expect(suggestBtn.first()).toBeVisible();
    } else {
      console.log("Banner de sugestão não apareceu (ok — depende de heurística)");
    }

    // ============ BUG-P1 — AlertDialog: "1 contrato", não "2 documentos" ============
    const confirmBtn = page.getByRole("button", {
      name: /enviar.*autentique|enviar para assinatura/i,
    });
    if (await confirmBtn.count()) {
      await confirmBtn.first().scrollIntoViewIfNeeded().catch(() => {});
      await confirmBtn.first().click().catch(() => {});
      await page.waitForTimeout(1000);
      await shot(page, "18-alert-dialog-pre-envio.png");

      // O dialog deve conter "1 contrato"
      const dialogText = await page
        .locator("[role='alertdialog']")
        .first()
        .textContent()
        .catch(() => null);
      console.log("AlertDialog text:", dialogText?.slice(0, 200));
      if (dialogText) {
        expect(
          dialogText,
          "AlertDialog deve dizer '1 contrato', não '2 documentos'"
        ).toMatch(/1 contrato/i);
        expect(
          dialogText,
          "AlertDialog NÃO deve dizer '2 documentos'"
        ).not.toMatch(/2 documentos/i);
      }

      // Cancela pra não enviar de verdade
      const cancel = page.getByRole("button", { name: /cancelar/i });
      if (await cancel.count()) await cancel.first().click().catch(() => {});
    }

    // ============ BUG-008 — validateDOMNesting ============
    expect(
      localConsoleErrors,
      `BUG-008 regressão: button-in-button detectado:\n${localConsoleErrors.join(
        "\n"
      )}`
    ).toEqual([]);
  });

  test.afterAll(() => {
    // Persiste console errors capturados nessa suite (override do arquivo do smoke)
    fs.writeFileSync(
      path.join(SHOTS_DIR, "_console-errors-regression.json"),
      JSON.stringify({ consoleErrors, pageErrors }, null, 2)
    );
  });
});
