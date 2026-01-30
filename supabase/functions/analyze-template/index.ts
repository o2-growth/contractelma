const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface DetectedField {
  key: string;
  originalValue: string;
  confidence: number;
}

interface AnalysisResult {
  content: string;
  detectedFields: DetectedField[];
  structureInfo: {
    paragraphs: number;
    clauses: number;
    hasSignatureBlock: boolean;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText, documentName } = await req.json();

    if (!documentText) {
      return new Response(
        JSON.stringify({ error: 'Texto do documento não fornecido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      throw new Error('LOVABLE_API_KEY não configurada');
    }

    const systemPrompt = `Você é um especialista em análise de contratos e documentos jurídicos brasileiros. Sua tarefa é:

1. Analisar o texto do documento fornecido
2. Identificar campos que devem ser substituídos por placeholders dinâmicos
3. Retornar o documento com os placeholders aplicados

## Regras para identificação de campos:

### Campos de Identificação de Pessoa/Empresa:
- Nomes de empresas (geralmente em CAIXA ALTA ou após "CONTRATANTE:", "CLIENTE:", "CONTRATADO:")
- CPF no formato XXX.XXX.XXX-XX
- CNPJ no formato XX.XXX.XXX/XXXX-XX
- RG com emissor
- Endereços completos (rua, número, bairro, cidade, estado, CEP)

### Campos de Contato:
- Telefones (fixo e celular)
- E-mails

### Campos Financeiros:
- Valores monetários (R$ X.XXX,XX)
- Percentuais (X%)
- Número de parcelas
- Datas de vencimento

### Campos de Data:
- Datas por extenso ("São Paulo, 15 de janeiro de 2024")
- Datas numéricas (15/01/2024)

## Placeholders Padrão a Usar:
- {{CLIENTE}} - Nome da empresa cliente
- {{CNPJ}} - CNPJ da empresa
- {{ENDERECO_EMPRESA}} - Endereço da empresa
- {{SOCIO}} - Nome do sócio/representante
- {{CPF}} - CPF do representante
- {{RG}} - RG do representante
- {{ENDERECO_SOCIO}} - Endereço do representante
- {{TELEFONE}} - Telefone de contato
- {{EMAIL}} - E-mail de contato
- {{VALOR_TOTAL}} - Valor total do contrato
- {{PARCELAS}} - Número de parcelas
- {{VALOR_PARCELA}} - Valor de cada parcela
- {{ENTRADA}} - Valor da entrada
- {{DATA}} - Data do contrato
- {{CIDADE}} - Cidade da assinatura
- {{PRODUTOS}} - Lista de produtos/serviços

## Instruções Importantes:
1. MANTENHA a estrutura original do documento (parágrafos, cláusulas, formatação)
2. NÃO altere textos que não são campos variáveis
3. Se um campo aparecer múltiplas vezes, use o MESMO placeholder
4. Retorne o JSON no formato especificado`;

    const userPrompt = `Analise o seguinte documento${documentName ? ` (${documentName})` : ''} e identifique os campos que devem ser convertidos em placeholders:

---
${documentText}
---

Retorne sua resposta APENAS como um JSON válido no seguinte formato (sem markdown, sem explicações):
{
  "content": "texto completo do documento com placeholders {{CAMPO}} aplicados",
  "detectedFields": [
    {"key": "CLIENTE", "originalValue": "valor original encontrado", "confidence": 0.95},
    {"key": "CNPJ", "originalValue": "valor original encontrado", "confidence": 0.90}
  ],
  "structureInfo": {
    "paragraphs": 15,
    "clauses": 8,
    "hasSignatureBlock": true
  }
}`;

    // Call Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', errorText);
      throw new Error('Erro ao chamar serviço de IA');
    }

    const aiResponse = await response.json();
    const textContent = aiResponse.choices?.[0]?.message?.content;
    
    if (!textContent) {
      throw new Error('Resposta da IA inválida');
    }

    // Parse the JSON response
    let analysisResult: AnalysisResult;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('JSON não encontrado na resposta');
      }
      analysisResult = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Error parsing AI response:', textContent);
      throw new Error('Erro ao processar resposta da IA');
    }

    // Validate the response structure
    if (!analysisResult.content || !Array.isArray(analysisResult.detectedFields)) {
      throw new Error('Estrutura de resposta inválida');
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-template:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro ao analisar template',
        details: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
