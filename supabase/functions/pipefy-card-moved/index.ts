import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

/*
 * Edge function chamada pelo webhook do Pipefy quando um card é movido.
 *
 * Trigger: card.move action no Pipe 304018800 ("2. Funil de Vendas - CFOaaS")
 * Comportamento:
 *   - Só age quando o card entra na fase "Contrato em elaboração" (id 324457386).
 *   - Busca os dados completos do card via API GraphQL do Pipefy.
 *   - Mapeia os campos do Pipefy para os placeholders dos templates internos.
 *   - Escolhe o template (M1/M2/M3/M4) com base no campo "produtos" do card.
 *   - Cria 1 contrato no banco em status "draft", vinculado ao card via pipefy_card_id.
 *   - Idempotente: se o card já tem um contrato, atualiza o existente.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TARGET_PHASE_ID = "324457386"; // Contrato em elaboração
const PIPEFY_API = "https://api.pipefy.com/graphql";

// IDs dos 4 templates oficiais (devem existir na tabela templates antes de chegar webhook)
const TEMPLATE_NAMES = {
  M1: "SaaS Oxy + Gênio (Modelo 1 - Oficial)",
  M2: "SaaS Oxy + Gênio + Especialista (Modelo 2 - Oficial)",
  M3: "Diagnóstico Estratégico (Modelo 3 - Oficial)",
  M4: "CFO as a Service (Modelo 4 - Oficial, revisado março)",
};

interface PipefyField {
  name?: string;
  value?: string;
  array_value?: string[];
  field: { id: string; label?: string; type?: string };
}

interface PipefyAttachment {
  url: string;
  path?: string;
  field: { id: string; label?: string };
}

interface PipefyCard {
  id: string;
  title?: string;
  current_phase?: { id: string; name?: string };
  fields: PipefyField[];
  attachments?: PipefyAttachment[];
}

function findField(fields: PipefyField[], fieldId: string): string {
  const f = fields.find((x) => x.field?.id === fieldId);
  if (!f) return "";
  if (f.array_value && f.array_value.length > 0) return f.array_value.join(", ");
  return (f.value || "").trim();
}

function getProdutos(fields: PipefyField[]): string[] {
  const f = fields.find((x) => x.field?.id === "produtos");
  if (!f) return [];
  // Pode vir como JSON string ou array
  if (f.array_value && Array.isArray(f.array_value)) return f.array_value;
  if (f.value) {
    try {
      const parsed = JSON.parse(f.value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // value normal, pode ter vírgula
    }
    return [f.value];
  }
  return [];
}

function pickTemplateName(produtos: string[], allFields: PipefyField[]): string {
  // Lower-case pra comparação tolerante
  const produtosLower = produtos.map((p) => (p || "").toLowerCase());
  const has = (needle: string) => produtosLower.some((p) => p.includes(needle));

  // Pelo campo "plano_cfoaas" também:
  const planoCfo = findField(allFields, "plano_cfoaas").toLowerCase();

  if (has("diagnóstico") || has("diagnostico")) return TEMPLATE_NAMES.M3;
  if (has("cfo") || has("caas") || planoCfo) return TEMPLATE_NAMES.M4;
  if (has("especialista")) return TEMPLATE_NAMES.M2;
  if (has("oxy") || has("gênio") || has("genio") || has("saas")) return TEMPLATE_NAMES.M1;
  // Fallback: M1 (mais comum)
  return TEMPLATE_NAMES.M1;
}

// ============================================================================
// Extração de CPF (CNH) e endereço (Contrato Social) via Gemini multimodal
// ============================================================================

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

async function downloadAsBase64(url: string): Promise<{ base64: string; mimeType: string } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Falha ao baixar ${url}: HTTP ${res.status}`);
      return null;
    }
    const arrayBuf = await res.arrayBuffer();
    const bytes = new Uint8Array(arrayBuf);
    const mimeType = res.headers.get("content-type")?.split(";")[0]?.trim() || "application/pdf";
    return { base64: bytesToBase64(bytes), mimeType };
  } catch (e) {
    console.error("downloadAsBase64 error:", e);
    return null;
  }
}

/**
 * Usa o Lovable AI Gateway (Gemini 2.5 Flash, multimodal) para extrair
 * dados estruturados de um documento (PDF/imagem) anexado no Pipefy.
 *
 * @param prompt Instrução do que extrair (em PT-BR)
 * @param fileBase64 Documento em base64
 * @param mimeType Mime type (application/pdf, image/jpeg, etc)
 * @returns String JSON com os dados extraídos, ou null em erro
 */
async function extractDataFromFile(
  prompt: string,
  fileBase64: string,
  mimeType: string
): Promise<string | null> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) {
    console.warn("LOVABLE_API_KEY ausente — pulando extração via IA");
    return null;
  }

  try {
    const dataUri = `data:${mimeType};base64,${fileBase64}`;
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: dataUri } },
            ],
          },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errTxt = await response.text();
      console.error(`Gemini ${response.status}:`, errTxt.slice(0, 300));
      return null;
    }

    const json = await response.json();
    return json?.choices?.[0]?.message?.content || null;
  } catch (e) {
    console.error("extractDataFromFile error:", e);
    return null;
  }
}

async function extractCpfFromCnh(url: string): Promise<string | null> {
  console.log("Baixando CNH:", url.slice(0, 100));
  const file = await downloadAsBase64(url);
  if (!file) return null;

  const prompt = `Você é um extrator de dados de CNH (Carteira Nacional de Habilitação) brasileira.
Extraia APENAS o CPF do titular da CNH, no formato XXX.XXX.XXX-XX.
Responda em JSON estrito: {"cpf": "..."}.
Se não encontrar CPF, responda: {"cpf": ""}.
NÃO adicione texto fora do JSON.`;

  const content = await extractDataFromFile(prompt, file.base64, file.mimeType);
  if (!content) return null;

  try {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const obj = JSON.parse(match[0]);
    const cpf = (obj?.cpf || "").toString().trim();
    return cpf || null;
  } catch (e) {
    console.error("Erro parseando CPF:", e, "raw:", content.slice(0, 200));
    return null;
  }
}

async function extractEnderecoFromContratoSocial(url: string): Promise<string | null> {
  console.log("Baixando Contrato Social:", url.slice(0, 100));
  const file = await downloadAsBase64(url);
  if (!file) return null;

  const prompt = `Você é um extrator de dados de contratos sociais de empresas brasileiras.
Extraia APENAS o endereço completo da sede da empresa (rua/avenida, número, complemento, bairro, cidade, estado, CEP).
Responda em JSON estrito: {"endereco": "..."}.
Se não encontrar endereço, responda: {"endereco": ""}.
NÃO adicione texto fora do JSON.`;

  const content = await extractDataFromFile(prompt, file.base64, file.mimeType);
  if (!content) return null;

  try {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const obj = JSON.parse(match[0]);
    const end = (obj?.endereco || "").toString().trim();
    return end || null;
  } catch (e) {
    console.error("Erro parseando endereço:", e, "raw:", content.slice(0, 200));
    return null;
  }
}

function parseCurrencyToNumber(s: string): number {
  if (!s) return 0;
  // Aceita "R$ 1.234,56", "1234.56", "1234,56", "1234"
  const cleaned = s.replace(/[^\d,.-]/g, "");
  // Se tem vírgula como decimal (formato BR), troca por ponto
  const hasComma = cleaned.includes(",");
  const normalized = hasComma
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : cleaned;
  const n = parseFloat(normalized);
  return isFinite(n) ? n : 0;
}

function computeTotalValue(card: PipefyCard): number {
  const F = card.fields;
  const get = (id: string) => findField(F, id);

  const valorSetup = parseCurrencyToNumber(get("valor_setup_1"));
  const valorMrr = parseCurrencyToNumber(get("copy_of_valor_setup_1"));
  const valorOxy = parseCurrencyToNumber(get("valor"));
  const valorDiagnostico = parseCurrencyToNumber(get("valor_diagn_stico_estrat_gico"));

  // Duração do contrato em meses (default 12 se vazio)
  const duracaoRaw = parseCurrencyToNumber(get("dura_o_do_contrato"));
  const duracaoMeses = duracaoRaw > 0 ? duracaoRaw : 12;

  // Total = Setup + (Mensal × meses) + Oxy + Diagnostico
  const mensal = valorMrr || valorOxy;
  return valorSetup + (mensal * duracaoMeses) + valorDiagnostico;
}

function buildClientDataFromCard(card: PipefyCard): Record<string, string> {
  const F = card.fields;
  const get = (id: string) => findField(F, id);

  // Datas: usa hoje se vazio (já que o user pode preencher no app)
  const now = new Date();
  const meses = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  const dia = get("dia") || String(now.getDate()).padStart(2, "0");
  const mes = get("m_s") || meses[now.getMonth()];
  const ano = get("ano") || String(now.getFullYear()).slice(-2);
  const dataSetup = get("data_de_pagamento_setup") || `${dia}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;

  // Formata número como "R$ 1.234,56" (formato BR)
  const fmtBRL = (n: number) =>
    n > 0
      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n)
      : "";

  // Valor por extenso prioritário; senão usa número formatado
  const valorSetupExtenso = get("valor_por_extenso_setup");
  const valorSetupN = parseCurrencyToNumber(get("valor_setup_1"));
  const valorExtensoSetup = valorSetupExtenso || fmtBRL(valorSetupN);

  const qtdParcelas = get("copy_of_valor_por_extenso_setup");
  const valorParcelasExtenso = get("valor_das_parcelas_por_extenso");
  const valorParcelasN = parseCurrencyToNumber(get("valor_das_parcelas"));
  const parcelasExtenso = (qtdParcelas && valorParcelasExtenso)
    ? `${qtdParcelas} parcelas de ${valorParcelasExtenso}`
    : (qtdParcelas && valorParcelasN > 0)
      ? `${qtdParcelas} parcelas de ${fmtBRL(valorParcelasN)}`
      : (valorParcelasExtenso || fmtBRL(valorParcelasN) || "");

  const valorMrrExtenso = get("valor_mrr_por_extenso");
  const valorMrrN = parseCurrencyToNumber(get("copy_of_valor_setup_1"));
  const valorPlataforma = valorMrrExtenso || (valorMrrN > 0 ? `${fmtBRL(valorMrrN)} mensais` : "");

  // Período de rescisão: "30 dias", "60 dias", "90 dias" → "30 (trinta)" etc
  const rescisaoLabel = get("data_de_aviso_pr_vio_para_rescis_o_contratual");
  const diasRescisao = rescisaoLabel.includes("30") ? "30 (trinta)"
    : rescisaoLabel.includes("60") ? "60 (sessenta)"
    : rescisaoLabel.includes("90") ? "90 (noventa)"
    : "30 (trinta)";

  // Duração do contrato
  const duracaoExtenso = get("dura_o_do_contrato_por_extenso");
  const duracaoNum = get("dura_o_do_contrato");
  const prazoVigencia = duracaoExtenso || (duracaoNum ? `${duracaoNum} meses` : "12 (doze) meses");

  return {
    // Empresa
    razao_social: get("raz_o_social_1") || get("nome_da_empresa_raz_o_social") || "",
    cnpj: get("cnpj_ein_1") || "",
    endereco: "", // Pipefy não tem endereço fixo aqui, fica pra preencher no app

    // Representante
    nome: get("quem_assina_o_contrato") || "",
    cpf: "", // não tem campo direto
    email: get("e_mail_de_quem_assina") || get("e_mail_respons_vel_financeiro") || get("e_mail_interlocu_o_o2") || "",

    // Pagamento Setup
    valor_extenso_setup: valorExtensoSetup,
    parcelas_valor_extenso: parcelasExtenso,
    data_setup: dataSetup,
    condicoes_especiais: get("observa_es_sobre_negocia_o") || "",

    // Pagamento mensal
    valor_plataforma: valorPlataforma,
    dias_primeiro_pagamento: "30 (trinta)",
    condicoes_especiais_plataforma: "",

    // Vigência
    inicio_vigencia: "A partir da assinatura do presente instrumento.",
    prazo_vigencia: prazoVigencia,
    dias_rescisao: diasRescisao,

    // Assinatura
    dia,
    mes,
    ano,

    // Serviço (string descritiva pro placeholder)
    servico: "", // será preenchido baseado no template escolhido (front aplica default)
  };
}

async function fetchCard(cardId: string, token: string): Promise<PipefyCard | null> {
  const query = `
    {
      card(id: ${cardId}) {
        id
        title
        current_phase { id name }
        fields {
          name
          value
          array_value
          field { id label type }
        }
        attachments {
          url
          path
          field { id label }
        }
      }
    }
  `;
  const res = await fetch(PIPEFY_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    throw new Error(`Pipefy API ${res.status}: ${await res.text()}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error(`Pipefy GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json?.data?.card || null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const pipefyToken = Deno.env.get("PIPEFY_API_KEY");
    if (!pipefyToken) {
      throw new Error("PIPEFY_API_KEY não configurada nas Edge Function secrets");
    }

    const payload = await req.json();

    // Pipefy envia { data: { action, card: { id, ... }, to: { id, ... }, ... } }
    const action = payload?.data?.action;
    const cardId = payload?.data?.card?.id || payload?.card?.id;
    const toPhaseId = String(payload?.data?.to?.id || payload?.data?.card?.current_phase?.id || "");

    console.log("Pipefy webhook recebido:", { action, cardId, toPhaseId });

    // 1. Filtrar: só processa card.move PARA "Contrato em elaboração"
    if (action !== "card.move") {
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: `action != card.move (${action})` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (toPhaseId !== TARGET_PHASE_ID) {
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: `phase != ${TARGET_PHASE_ID} (got ${toPhaseId})` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!cardId) {
      throw new Error("cardId ausente no payload");
    }

    // 2. Buscar card completo
    const card = await fetchCard(String(cardId), pipefyToken);
    if (!card) {
      throw new Error(`Card ${cardId} não encontrado no Pipefy`);
    }

    // 3. Decidir template baseado em "produtos"
    const produtos = getProdutos(card.fields);
    const templateName = pickTemplateName(produtos, card.fields);
    console.log(`Card ${cardId} produtos=${JSON.stringify(produtos)} → template=${templateName}`);

    const { data: templateRow, error: tplErr } = await supabase
      .from("templates")
      .select("id, user_id, name")
      .eq("name", templateName)
      .limit(1)
      .maybeSingle();
    if (tplErr) throw tplErr;
    if (!templateRow) {
      throw new Error(`Template "${templateName}" não encontrado no banco (rode as migrations primeiro)`);
    }

    // 4. Mapear campos do card → placeholders
    const clientData = buildClientDataFromCard(card);
    const totalValue = computeTotalValue(card);

    // 4.1 OCR via Gemini: extrair CPF da CNH e endereço do Contrato Social
    // Só roda se os campos estiverem vazios E houver attachment correspondente.
    const attachments = card.attachments || [];
    const cnhAtt = attachments.find((a) => a.field?.id === "cnh_de_quem_assina");
    const contratoAtt = attachments.find((a) => a.field?.id === "contrato_social_da_empresa");

    if (!clientData.cpf && cnhAtt?.url) {
      try {
        const cpf = await extractCpfFromCnh(cnhAtt.url);
        if (cpf) {
          console.log(`Card ${cardId}: CPF extraído da CNH via IA: ${cpf}`);
          clientData.cpf = cpf;
        }
      } catch (e) {
        console.error("Falha extraindo CPF da CNH:", e);
      }
    }

    if (!clientData.endereco && contratoAtt?.url) {
      try {
        const endereco = await extractEnderecoFromContratoSocial(contratoAtt.url);
        if (endereco) {
          console.log(`Card ${cardId}: endereço extraído do Contrato Social via IA`);
          clientData.endereco = endereco;
        }
      } catch (e) {
        console.error("Falha extraindo endereço do Contrato Social:", e);
      }
    }

    // 5. Idempotência — verifica se já existe contrato pra esse card
    const { data: existing } = await supabase
      .from("contracts")
      .select("id, status")
      .eq("pipefy_card_id", String(cardId))
      .maybeSingle();

    let contractId: string;
    let mode: "created" | "updated";

    if (existing) {
      // Atualiza dados (mas mantém status se já gerou/enviou)
      const { error: updErr } = await supabase
        .from("contracts")
        .update({
          template_id: templateRow.id,
          client_data: clientData,
          total_value: totalValue,
          pipefy_phase_id: TARGET_PHASE_ID,
          pipefy_data: card,
        })
        .eq("id", existing.id);
      if (updErr) throw updErr;
      contractId = existing.id;
      mode = "updated";
    } else {
      const { data: inserted, error: insErr } = await supabase
        .from("contracts")
        .insert({
          user_id: templateRow.user_id, // contrato é "do" mesmo dono do template (super_admin)
          template_id: templateRow.id,
          client_data: clientData,
          products: [],
          total_value: totalValue,
          status: "draft",
          pipefy_card_id: String(cardId),
          pipefy_phase_id: TARGET_PHASE_ID,
          pipefy_data: card,
        })
        .select("id")
        .single();
      if (insErr) throw insErr;
      contractId = inserted.id;
      mode = "created";
    }

    console.log(`Contrato ${mode}: ${contractId} (card ${cardId} → template ${templateRow.name})`);

    return new Response(
      JSON.stringify({
        success: true,
        mode,
        contractId,
        cardId: String(cardId),
        templateName,
        templateId: templateRow.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Pipefy webhook error:", error);
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
