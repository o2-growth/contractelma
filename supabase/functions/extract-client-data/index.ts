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

    const systemPrompt = `Você é um especialista em extração de dados de documentos brasileiros. 
Analise o texto fornecido e extraia os seguintes campos do cliente:
- nome: Nome completo do cliente
- cpf: CPF no formato XXX.XXX.XXX-XX
- rg: RG com órgão emissor
- endereco: Endereço completo (rua, número, bairro, cidade, estado, CEP)
- telefone: Telefone no formato (XX) XXXXX-XXXX
- email: E-mail do cliente
- nascimento: Data de nascimento no formato DD/MM/AAAA
- estado_civil: Estado civil (solteiro, casado, divorciado, viúvo, etc.)
- profissao: Profissão ou ocupação

Para cada campo, forneça também um nível de confiança:
- "high": Campo claramente identificado no documento
- "medium": Campo identificado mas pode conter erros
- "low": Campo inferido ou parcialmente identificado

Retorne APENAS um JSON válido no seguinte formato:
{
  "nome": { "value": "...", "confidence": "high|medium|low" },
  "cpf": { "value": "...", "confidence": "high|medium|low" },
  "rg": { "value": "...", "confidence": "high|medium|low" },
  "endereco": { "value": "...", "confidence": "high|medium|low" },
  "telefone": { "value": "...", "confidence": "high|medium|low" },
  "email": { "value": "...", "confidence": "high|medium|low" },
  "nascimento": { "value": "...", "confidence": "high|medium|low" },
  "estado_civil": { "value": "...", "confidence": "high|medium|low" },
  "profissao": { "value": "...", "confidence": "high|medium|low" }
}

Se um campo não for encontrado, deixe o value como string vazia e confidence como "low".`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Tipo de documento: ${documentType || "Desconhecido"}\n\nConteúdo do documento:\n${documentText}` },
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

    return new Response(
      JSON.stringify({
        success: true,
        data: extractedData,
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
