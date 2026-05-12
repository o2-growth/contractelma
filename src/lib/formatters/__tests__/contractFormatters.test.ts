import { describe, it, expect } from "vitest";
import {
  numeroPorExtenso,
  parseValorBR,
  formatBRL,
  valorPorExtensoReais,
  formatBRLComExtenso,
  dataPorExtenso,
  parseDateBR,
  formatCPF,
  formatCNPJ,
  formatCEP,
  formatTelefone,
  enrichClientDataForTemplate,
  isCurrencyField,
} from "../contractFormatters";

describe("numeroPorExtenso", () => {
  it("trata zero e negativo", () => {
    expect(numeroPorExtenso(0)).toBe("zero");
    expect(numeroPorExtenso(-5)).toBe("menos cinco");
  });

  it("trata unidades, dezenas e centenas", () => {
    expect(numeroPorExtenso(1)).toBe("um");
    expect(numeroPorExtenso(15)).toBe("quinze");
    expect(numeroPorExtenso(21)).toBe("vinte e um");
    expect(numeroPorExtenso(100)).toBe("cem");
    expect(numeroPorExtenso(101)).toBe("cento e um");
    expect(numeroPorExtenso(999)).toBe("novecentos e noventa e nove");
  });

  it("trata milhares e milhões", () => {
    expect(numeroPorExtenso(1000)).toBe("mil");
    expect(numeroPorExtenso(1500)).toBe("mil e quinhentos");
    expect(numeroPorExtenso(2024)).toBe("dois mil e vinte e quatro");
    expect(numeroPorExtenso(1_000_000)).toBe("um milhão");
    expect(numeroPorExtenso(2_500_000)).toBe("dois milhões e quinhentos mil");
  });
});

describe("parseValorBR", () => {
  it("aceita formatos BR e EN", () => {
    expect(parseValorBR("1500")).toBe(1500);
    expect(parseValorBR("1500,00")).toBe(1500);
    expect(parseValorBR("1.500,00")).toBe(1500);
    expect(parseValorBR("R$ 1.500,50")).toBe(1500.5);
    expect(parseValorBR("1500.50")).toBe(1500.5);
    expect(parseValorBR(1500)).toBe(1500);
    expect(parseValorBR("")).toBe(0);
    expect(parseValorBR(null)).toBe(0);
  });
});

describe("formatBRL", () => {
  it("formata como currency BR", () => {
    expect(formatBRL(1500)).toMatch(/R\$\s*1\.500,00/);
    expect(formatBRL("1500,50")).toMatch(/R\$\s*1\.500,50/);
    expect(formatBRL(0)).toMatch(/R\$\s*0,00/);
  });
});

describe("valorPorExtensoReais", () => {
  it("formata valor inteiro", () => {
    expect(valorPorExtensoReais(1500)).toBe("mil e quinhentos reais");
    expect(valorPorExtensoReais(1)).toBe("um real");
  });

  it("formata com centavos", () => {
    expect(valorPorExtensoReais(1500.5)).toBe(
      "mil e quinhentos reais e cinquenta centavos"
    );
    expect(valorPorExtensoReais("0,01")).toBe("um centavo");
  });

  it("zero retorna zero reais", () => {
    expect(valorPorExtensoReais(0)).toBe("zero reais");
  });
});

describe("formatBRLComExtenso", () => {
  it("monta texto completo", () => {
    expect(formatBRLComExtenso(1500)).toMatch(
      /R\$\s*1\.500,00 \(mil e quinhentos reais\)/
    );
  });

  it("retorna vazio pra entrada vazia", () => {
    expect(formatBRLComExtenso("")).toBe("");
    expect(formatBRLComExtenso(null)).toBe("");
  });
});

describe("dataPorExtenso", () => {
  it("formata data em ISO", () => {
    expect(dataPorExtenso("2026-05-12")).toBe("12 de maio de 2026");
  });

  it("formata data em DD/MM/YYYY", () => {
    expect(dataPorExtenso("12/05/2026")).toBe("12 de maio de 2026");
  });

  it("retorna vazio pra inválido", () => {
    expect(dataPorExtenso("")).toBe("");
    expect(dataPorExtenso("xxx")).toBe("");
  });
});

describe("parseDateBR", () => {
  it("aceita ISO e BR", () => {
    expect(parseDateBR("2026-05-12")?.getDate()).toBe(12);
    expect(parseDateBR("12/05/2026")?.getMonth()).toBe(4);
  });
});

describe("máscaras CPF/CNPJ/CEP/Telefone", () => {
  it("CPF", () => {
    expect(formatCPF("12345678901")).toBe("123.456.789-01");
    expect(formatCPF("123")).toBe("123");
    expect(formatCPF("123456")).toBe("123.456");
  });

  it("CNPJ", () => {
    expect(formatCNPJ("12345678000190")).toBe("12.345.678/0001-90");
    expect(formatCNPJ("23813779000160")).toBe("23.813.779/0001-60");
  });

  it("CEP", () => {
    expect(formatCEP("01452001")).toBe("01452-001");
    expect(formatCEP("014")).toBe("014");
  });

  it("Telefone celular e fixo", () => {
    expect(formatTelefone("11999999999")).toBe("(11) 99999-9999");
    expect(formatTelefone("1133334444")).toBe("(11) 3333-4444");
  });
});

describe("isCurrencyField (whitelist)", () => {
  it("aceita keys monetárias reais", () => {
    expect(isCurrencyField("VALOR_SETUP")).toBe(true);
    expect(isCurrencyField("valor_setup")).toBe(true);
    expect(isCurrencyField("valor_plataforma")).toBe(true);
    expect(isCurrencyField("valor_total")).toBe(true);
    expect(isCurrencyField("VALOR")).toBe(true);
  });

  it("rejeita campos de data e derivados", () => {
    expect(isCurrencyField("data_setup")).toBe(false);
    expect(isCurrencyField("data_assinatura")).toBe(false);
    expect(isCurrencyField("parcelas_valor_extenso")).toBe(false);
    expect(isCurrencyField("valor_setup_extenso")).toBe(false);
    expect(isCurrencyField("valor_plataforma_brl")).toBe(false);
    expect(isCurrencyField("condicoes_especiais")).toBe(false);
    expect(isCurrencyField("forma_pagamento_setup")).toBe(false);
    expect(isCurrencyField("prazo_vigencia")).toBe(false);
    expect(isCurrencyField("dias_rescisao")).toBe(false);
  });
});

describe("dataPorExtenso dia 1", () => {
  it("usa '1º' para o primeiro dia do mês", () => {
    expect(dataPorExtenso("2026-06-01")).toBe("1º de junho de 2026");
    expect(dataPorExtenso("01/06/2026")).toBe("1º de junho de 2026");
  });
});

describe("enrichClientDataForTemplate", () => {
  it("gera valor_setup_brl e _extenso a partir de número cru", () => {
    const out = enrichClientDataForTemplate({ valor_setup: "1500" });
    expect(out.valor_setup).toMatch(/R\$\s*1\.500,00/);
    expect(out.valor_setup_extenso).toContain("mil e quinhentos reais");
    expect(out.valor_extenso_setup).toMatch(
      /R\$\s*1\.500,00 \(mil e quinhentos reais\)/
    );
  });

  it("gera data_assinatura_extenso a partir de dia/mes/ano", () => {
    const out = enrichClientDataForTemplate({
      dia: "12",
      mes: "maio",
      ano: "26",
    });
    expect(out.data_assinatura_extenso).toBe("12 de maio de 2026");
  });
});
