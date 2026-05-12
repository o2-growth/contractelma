// Portado do Python (gerador-contratos/app.py) — formatação BR
// Usado por: ClientDataImport (UX live), ContractPreview (geração) e templates

const MESES_PT = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const UNIDADES = [
  "",
  "um",
  "dois",
  "três",
  "quatro",
  "cinco",
  "seis",
  "sete",
  "oito",
  "nove",
  "dez",
  "onze",
  "doze",
  "treze",
  "quatorze",
  "quinze",
  "dezesseis",
  "dezessete",
  "dezoito",
  "dezenove",
];

const DEZENAS = [
  "",
  "",
  "vinte",
  "trinta",
  "quarenta",
  "cinquenta",
  "sessenta",
  "setenta",
  "oitenta",
  "noventa",
];

const CENTENAS = [
  "",
  "cento",
  "duzentos",
  "trezentos",
  "quatrocentos",
  "quinhentos",
  "seiscentos",
  "setecentos",
  "oitocentos",
  "novecentos",
];

function numeroExtensoAte999(n: number): string {
  if (n === 0) return "";
  if (n === 100) return "cem";
  if (n < 20) return UNIDADES[n];
  if (n < 100) {
    const dezena = DEZENAS[Math.floor(n / 10)];
    const unidade = UNIDADES[n % 10];
    return unidade ? `${dezena} e ${unidade}` : dezena;
  }
  const centena = CENTENAS[Math.floor(n / 100)];
  const resto = n % 100;
  if (resto === 0) return centena;
  return `${centena} e ${numeroExtensoAte999(resto)}`;
}

export function numeroPorExtenso(n: number): string {
  if (!Number.isFinite(n)) return "";
  if (n === 0) return "zero";
  if (n < 0) return `menos ${numeroPorExtenso(-n)}`;

  const partes: string[] = [];

  const bilhoes = Math.floor(n / 1_000_000_000);
  n %= 1_000_000_000;
  const milhoes = Math.floor(n / 1_000_000);
  n %= 1_000_000;
  const milhares = Math.floor(n / 1_000);
  const centenas = n % 1_000;

  if (bilhoes) {
    partes.push(bilhoes === 1 ? "um bilhão" : `${numeroExtensoAte999(bilhoes)} bilhões`);
  }
  if (milhoes) {
    partes.push(milhoes === 1 ? "um milhão" : `${numeroExtensoAte999(milhoes)} milhões`);
  }
  if (milhares) {
    partes.push(milhares === 1 ? "mil" : `${numeroExtensoAte999(milhares)} mil`);
  }
  if (centenas) {
    partes.push(numeroExtensoAte999(centenas));
  }

  if (partes.length <= 1) return partes[0] || "zero";

  if (centenas && centenas < 100) {
    return partes.join(" e ");
  }

  const fim = partes.pop() as string;
  return partes.length > 0 ? `${partes.join(", ")} e ${fim}` : fim;
}

// Aceita "1500", "1500,00", "1.500,00", "R$ 1.500,00", "1500.00"
export function parseValorBR(valor: string | number | null | undefined): number {
  if (valor == null) return 0;
  if (typeof valor === "number") return valor;
  let limpo = valor.trim().replace(/^[Rr]\$\s*/, "").trim();
  if (!limpo) return 0;

  let inteiroStr: string;
  let decimalStr = "00";

  if (limpo.includes(",")) {
    const parts = limpo.split(",");
    const tail = parts.pop() as string;
    inteiroStr = parts.join("").replace(/[.\s]/g, "");
    decimalStr = tail.padEnd(2, "0").slice(0, 2);
  } else if (/\.\d{1,2}$/.test(limpo) && !/\.\d{3}/.test(limpo)) {
    const parts = limpo.split(".");
    const tail = parts.pop() as string;
    inteiroStr = parts.join("");
    decimalStr = tail.padEnd(2, "0").slice(0, 2);
  } else {
    inteiroStr = limpo.replace(/[.\s]/g, "");
  }

  const inteiro = parseInt(inteiroStr || "0", 10);
  const centavos = parseInt(decimalStr || "0", 10);
  if (Number.isNaN(inteiro) || Number.isNaN(centavos)) return 0;
  return inteiro + centavos / 100;
}

// "1500" → "R$ 1.500,00"
export function formatBRL(valor: string | number | null | undefined): string {
  const num = typeof valor === "number" ? valor : parseValorBR(valor);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
}

// "1500,50" → "mil e quinhentos reais e cinquenta centavos"
export function valorPorExtensoReais(valor: string | number): string {
  const num = typeof valor === "number" ? valor : parseValorBR(valor);
  const inteiro = Math.floor(num);
  const centavos = Math.round((num - inteiro) * 100);

  const partes: string[] = [];
  if (inteiro > 0) {
    const extenso = numeroPorExtenso(inteiro);
    const moeda = inteiro === 1 ? "real" : "reais";
    partes.push(`${extenso} ${moeda}`);
  }
  if (centavos > 0) {
    const extenso = numeroPorExtenso(centavos);
    const moedaCent = centavos === 1 ? "centavo" : "centavos";
    partes.push(`${extenso} ${moedaCent}`);
  }
  if (partes.length === 0) return "zero reais";
  return partes.join(" e ");
}

// "1500" → "R$ 1.500,00 (mil e quinhentos reais)"
export function formatBRLComExtenso(valor: string | number | null | undefined): string {
  if (valor === "" || valor == null) return "";
  const num = typeof valor === "number" ? valor : parseValorBR(valor);
  if (num === 0 && (typeof valor === "string" ? !valor.trim() : true)) return "";
  return `${formatBRL(num)} (${valorPorExtensoReais(num)})`;
}

// Aceita Date | "YYYY-MM-DD" | "DD/MM/YYYY"
export function parseDateBR(input: string | Date | null | undefined): Date | null {
  if (!input) return null;
  if (input instanceof Date) return Number.isNaN(input.getTime()) ? null : input;
  const s = input.trim();
  if (!s) return null;

  const dmy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    const dt = new Date(Number(y), Number(m) - 1, Number(d));
    return Number.isNaN(dt.getTime()) ? null : dt;
  }
  const ymd = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymd) {
    const [, y, m, d] = ymd;
    const dt = new Date(Number(y), Number(m) - 1, Number(d));
    return Number.isNaN(dt.getTime()) ? null : dt;
  }
  const dt = new Date(s);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

// Date → "12 de maio de 2026" (dia 1 vira "1º")
export function dataPorExtenso(input: string | Date | null | undefined): string {
  const d = parseDateBR(input);
  if (!d) return "";
  const dia = d.getDate();
  const diaStr = dia === 1 ? "1º" : String(dia);
  return `${diaStr} de ${MESES_PT[d.getMonth()]} de ${d.getFullYear()}`;
}

// Date → "12/05/2026"
export function formatDataBR(input: string | Date | null | undefined): string {
  const d = parseDateBR(input);
  if (!d) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

// "00000000000" → "000.000.000-00"
export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

// "00000000000000" → "00.000.000/0000-00"
export function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2}\.\d{3})(\d)/, "$1.$2")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

// "00000000" → "00000-000"
export function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

// "(11) 99999-9999" — fixo (10) ou celular (11)
export function formatTelefone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// ViaCEP — busca endereço por CEP (8 dígitos)
export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export async function buscarCep(cep: string): Promise<ViaCepResponse | null> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return null;
  try {
    const r = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
    if (!r.ok) return null;
    const data = (await r.json()) as ViaCepResponse;
    if (data.erro) return null;
    return data;
  } catch {
    return null;
  }
}

export function montarEnderecoCompleto(
  via: ViaCepResponse,
  numero?: string,
  complemento?: string
): string {
  const partes: string[] = [];
  const logradouroComNumero = numero
    ? `${via.logradouro}, ${numero}`
    : via.logradouro;
  if (logradouroComNumero) partes.push(logradouroComNumero);
  if (complemento) partes.push(complemento);
  if (via.bairro) partes.push(via.bairro);
  if (via.localidade) {
    partes.push(via.uf ? `${via.localidade} - ${via.uf}` : via.localidade);
  }
  if (via.cep) partes.push(`CEP ${via.cep}`);
  return partes.join(", ");
}

// Heurísticas para decidir mascaramento automático no UI
// Whitelist: só é currency se a key combinar com padrões precisos de valor monetário,
// e NUNCA quando for uma variante derivada (_extenso, _brl) ou um campo de outra natureza
// (data_, condicoes_, parcelas_, prazo_, dias_, forma_pagamento_).
export function isCurrencyField(key: string): boolean {
  const lower = key.toLowerCase();

  // Exclusões explícitas — keys derivadas ou de outra natureza
  if (/_(extenso|brl|com_extenso|por_extenso)$/i.test(lower)) return false;
  if (/^data(_|$)|_data$/i.test(lower)) return false;
  if (/condicoes|condicao|forma_pagamento|parcelas|prazo|dias/i.test(lower)) return false;

  // Whitelist — começa com valor_ ou VALOR_
  if (/^valor_/i.test(lower)) return true;

  // Whitelist — keys exatas conhecidas
  const exact = new Set([
    "valor",
    "valor_plataforma",
    "valor_mensalidade",
    "valor_setup",
    "valor_cfo",
    "valor_total",
    "valor_mensal",
    "valor_anual",
  ]);
  return exact.has(lower);
}

export function isDateField(key: string): boolean {
  return /^data|_data$|data_/i.test(key) || /^inicio_|_inicio$/i.test(key);
}

export function isCpfField(key: string): boolean {
  return /^cpf($|_)/i.test(key);
}

export function isCnpjField(key: string): boolean {
  return /^cnpj($|_)/i.test(key);
}

export function isCepField(key: string): boolean {
  return /^cep($|_)|_cep$/i.test(key);
}

export function isPhoneField(key: string): boolean {
  return /telefone|celular|whatsapp/i.test(key);
}

export function isEmailField(key: string): boolean {
  return /email|e-?mail/i.test(key);
}

// Recebe o map de clientData e injeta as variáveis derivadas (extenso) usadas pelos templates
export function enrichClientDataForTemplate(
  clientData: Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = { ...clientData };

  for (const [key, raw] of Object.entries(clientData)) {
    if (!raw || typeof raw !== "string") continue;

    // Valores monetários → versão com extenso (formato "R$ X,XX (extenso reais)")
    if (isCurrencyField(key)) {
      const num = parseValorBR(raw);
      if (num > 0) {
        // Sempre injeta a versão com R$ e a versão por extenso, em ambas as caixas
        const comExtenso = formatBRLComExtenso(num);
        const soExtenso = valorPorExtensoReais(num);
        const soBRL = formatBRL(num);

        // Se o usuário ainda não setou explicitamente uma variante derivada, preenchemos:
        const variants = [
          `${key}_extenso`,
          `${key}_com_extenso`,
          `${key}_brl`,
        ];
        variants.forEach((vKey) => {
          if (out[vKey]) return;
          if (vKey.endsWith("_brl")) out[vKey] = soBRL;
          else if (vKey.endsWith("_com_extenso")) out[vKey] = comExtenso;
          else if (vKey.endsWith("_extenso")) out[vKey] = soExtenso;
        });

        // Caso especial: templates Oxy usam "valor_extenso_setup" (palavra "extenso" no meio)
        // → também populamos automaticamente quando o campo for VALOR_SETUP/valor_setup
        if (/^valor_setup$/i.test(key) && !out.valor_extenso_setup) {
          out.valor_extenso_setup = comExtenso;
        }
        if (/^valor_plataforma$/i.test(key) && !out.valor_plataforma_extenso) {
          out.valor_plataforma_extenso = comExtenso;
        }

        // Substitui o próprio campo pelo valor já formatado em BRL (o usuário pode ter digitado "1500")
        if (!/^R\$\s/.test(raw)) {
          out[key] = soBRL;
        }
      }
    }

    // Datas → versão por extenso
    if (isDateField(key)) {
      const d = parseDateBR(raw);
      if (d) {
        const extenso = dataPorExtenso(d);
        const variant = `${key}_extenso`;
        if (!out[variant]) out[variant] = extenso;
      }
    }
  }

  // Parcelas do setup → "{N} ({N por extenso}) parcelas de R$ X,XX ({valor por extenso})"
  // Usa valor_setup + qtd_parcelas_setup. Se qtd não preenchida, assume parcela única.
  if (!out.parcelas_valor_extenso) {
    const valorSetupRaw = out.valor_setup || out.VALOR_SETUP || "";
    if (valorSetupRaw) {
      const totalSetup = parseValorBR(valorSetupRaw);
      if (totalSetup > 0) {
        const qtdRaw = (out.qtd_parcelas_setup || "").toString().trim();
        const qtd = parseInt(qtdRaw, 10);
        if (!Number.isNaN(qtd) && qtd > 1) {
          const valorParcela = totalSetup / qtd;
          const qtdExtenso = numeroPorExtenso(qtd);
          const palavraParcelas = qtd === 1 ? "parcela" : "parcelas";
          out.parcelas_valor_extenso = `${qtd} (${qtdExtenso}) ${palavraParcelas} de ${formatBRLComExtenso(
            valorParcela
          )}`;
        } else {
          out.parcelas_valor_extenso = `1 (uma) parcela de ${formatBRLComExtenso(totalSetup)}`;
        }
      }
    }
  }

  // Data de assinatura: se temos dia/mes/ano, geramos data_assinatura_extenso
  const dia = parseInt(out.dia || out.DIA || "", 10);
  const mesStr = (out.mes || out.MES || "").toLowerCase();
  const anoRaw = (out.ano || out.ANO || "").trim();
  if (dia && mesStr && anoRaw && !out.data_assinatura_extenso) {
    let ano = parseInt(anoRaw, 10);
    if (!Number.isNaN(ano) && ano < 100) ano += 2000;
    const mesIdx = MESES_PT.indexOf(mesStr);
    if (mesIdx >= 0 && !Number.isNaN(ano)) {
      const diaStr = dia === 1 ? "1º" : String(dia);
      out.data_assinatura_extenso = `${diaStr} de ${MESES_PT[mesIdx]} de ${ano}`;
    }
  }

  return out;
}
