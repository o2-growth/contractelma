import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText, documentType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!documentText) {
      throw new Error("No document text provided");
    }

    // Prompt otimizado para extração de dados de contratos O2 Inc
    const systemPrompt = `Você é um especialista em extração de dados de documentos empresariais brasileiros.

Analise o texto fornecido e extraia TODOS os dados que encontrar. O documento pode ser uma ficha cadastral, contrato, ou documento similar.

CAMPOS PARA EXTRAIR:

**DADOS DA EMPRESA (CONTRATANTE):**
- cliente: Razão social ou nome da empresa (busque por "CLIENTE", "CONTRATANTE", "Razão Social", nome da empresa)
- cnpj: CNPJ da empresa (formato: XX.XXX.XXX/XXXX-XX)
- endereco_empresa: Endereço completo da empresa

**DADOS DO REPRESENTANTE/SÓCIO:**
- socio: Nome do sócio ou representante legal (busque por "SÓCIO", "Representante", "Representado por")
- cpf: CPF do representante (formato: XXX.XXX.XXX-XX)
- rg: RG do representante com órgão emissor
- endereco_socio: Endereço residencial do sócio

**DADOS DE CONTATO:**
- telefone: Telefone de contato (formato: (XX) XXXXX-XXXX)
- email: E-mail de contato

**DADOS PESSOAIS (se pessoa física):**
- nome: Nome completo (se diferente de cliente/socio)
- endereco: Endereço (se diferente dos anteriores)
- nascimento: Data de nascimento no formato DD/MM/AAAA
- estado_civil: Estado civil (solteiro, casado, divorciado, viúvo)
- profissao: Profissão ou ocupação

Para cada campo, forneça também um nível de confiança:
- "high": Campo claramente identificado no documento
- "medium": Campo identificado mas pode conter erros
- "low": Campo inferido, parcialmente identificado ou não encontrado

Retorne APENAS um JSON válido no seguinte formato:
{
  "cliente": { "value": "...", "confidence": "high|medium|low" },
  "cnpj": { "value": "...", "confidence": "high|medium|low" },
  "endereco_empresa": { "value": "...", "confidence": "high|medium|low" },
  "socio": { "value": "...", "confidence": "high|medium|low" },
  "cpf": { "value": "...", "confidence": "high|medium|low" },
  "rg": { "value": "...", "confidence": "high|medium|low" },
  "endereco_socio": { "value": "...", "confidence": "high|medium|low" },
  "telefone": { "value": "...", "confidence": "high|medium|low" },
  "email": { "value": "...", "confidence": "high|medium|low" },
  "nome": { "value": "...", "confidence": "high|medium|low" },
  "endereco": { "value": "...", "confidence": "high|medium|low" },
  "nascimento": { "value": "...", "confidence": "high|medium|low" },
  "estado_civil": { "value": "...", "confidence": "high|medium|low" },
  "profissao": { "value": "...", "confidence": "high|medium|low" }
}

IMPORTANTE:
- Se um campo não for encontrado, deixe o value como string vazia e confidence como "low"
- Mantenha a formatação original dos dados (CPF com pontos, CNPJ formatado, etc)
- Priorize dados empresariais (CNPJ, razão social) sobre dados pessoais
- Use o campo "nome" como fallback para "socio" ou "cliente" se necessário`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Tipo de documento: ${documentType || "Ficha cadastral/Contrato"}\n\nConteúdo do documento:\n${documentText}` },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit excedido. Tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione créditos à sua conta." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from the response
    let extractedData;
    try {
      // Try to extract JSON from the response (it might have markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", content);
      throw new Error("Failed to parse AI response");
    }

    // Calculate overall confidence score
    const confidenceScores = { high: 1, medium: 0.7, low: 0.3 };
    const fields = Object.values(extractedData) as Array<{ value: string; confidence: string }>;
    const totalConfidence = fields.reduce((sum, field) => {
      return sum + (confidenceScores[field.confidence as keyof typeof confidenceScores] || 0);
    }, 0);
    const averageConfidence = totalConfidence / fields.length;

    // Create backward-compatible response
    // Map new fields to legacy format for existing components
    const mappedData = { ...extractedData };
    
    // Ensure legacy "nome" field has a value
    if (!mappedData.nome?.value && mappedData.socio?.value) {
      mappedData.nome = { ...mappedData.socio };
    }
    if (!mappedData.nome?.value && mappedData.cliente?.value) {
      mappedData.nome = { ...mappedData.cliente };
    }
    
    // Ensure legacy "endereco" field has a value
    if (!mappedData.endereco?.value && mappedData.endereco_socio?.value) {
      mappedData.endereco = { ...mappedData.endereco_socio };
    }
    if (!mappedData.endereco?.value && mappedData.endereco_empresa?.value) {
      mappedData.endereco = { ...mappedData.endereco_empresa };
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: mappedData,
        confidenceScore: averageConfidence,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Extract error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
