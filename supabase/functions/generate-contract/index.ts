import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Product {
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

interface ClientData {
  nome: string;
  cpf: string;
  rg?: string;
  endereco: string;
  telefone: string;
  email: string;
  nascimento?: string;
  estado_civil?: string;
  profissao?: string;
}

interface ContractRequest {
  templateId?: string;
  templateContent?: string;
  clientData: ClientData;
  products: Product[];
  paymentTerms: string;
  specialNotes: string;
  format: "docx" | "pdf" | "both";
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function generateProductsTable(products: Product[]): string {
  if (products.length === 0) return "";
  
  let table = "\n| Item | Quantidade | Valor Unit. | Desconto | Total |\n";
  table += "|------|-----------|-------------|----------|-------|\n";
  
  products.forEach((product) => {
    table += `| ${product.name} | ${product.quantity} | ${formatCurrency(product.unitPrice)} | ${product.discount}% | ${formatCurrency(product.total)} |\n`;
  });
  
  const totalGeral = products.reduce((sum, p) => sum + p.total, 0);
  table += `| **TOTAL** | | | | **${formatCurrency(totalGeral)}** |\n`;
  
  return table;
}

function replacePlaceholders(
  template: string,
  clientData: ClientData,
  products: Product[],
  paymentTerms: string,
  specialNotes: string
): string {
  const totalValue = products.reduce((sum, p) => sum + p.total, 0);
  const productsTable = generateProductsTable(products);
  
  // List of all placeholders to replace
  const replacements: Record<string, string> = {
    // Client data placeholders (both cases)
    "{{nome}}": clientData.nome || "",
    "{{NOME}}": clientData.nome || "",
    "{{cpf}}": clientData.cpf || "",
    "{{CPF}}": clientData.cpf || "",
    "{{rg}}": clientData.rg || "",
    "{{RG}}": clientData.rg || "",
    "{{endereco}}": clientData.endereco || "",
    "{{ENDERECO}}": clientData.endereco || "",
    "{{telefone}}": clientData.telefone || "",
    "{{TELEFONE}}": clientData.telefone || "",
    "{{email}}": clientData.email || "",
    "{{EMAIL}}": clientData.email || "",
    "{{nascimento}}": clientData.nascimento || "",
    "{{NASCIMENTO}}": clientData.nascimento || "",
    "{{estado_civil}}": clientData.estado_civil || "",
    "{{ESTADO_CIVIL}}": clientData.estado_civil || "",
    "{{profissao}}": clientData.profissao || "",
    "{{PROFISSAO}}": clientData.profissao || "",
    
    // Products and payment
    "{{produtos}}": productsTable,
    "{{PRODUTOS}}": productsTable,
    "{{valor_total}}": formatCurrency(totalValue),
    "{{VALOR_TOTAL}}": formatCurrency(totalValue),
    "{{forma_pagamento}}": paymentTerms || "",
    "{{FORMA_PAGAMENTO}}": paymentTerms || "",
    "{{observacoes}}": specialNotes || "",
    "{{OBSERVACOES}}": specialNotes || "",
    
    // Date placeholders
    "{{data}}": formatDate(new Date()),
    "{{DATA}}": formatDate(new Date()),
    "{{data_atual}}": formatDate(new Date()),
    "{{DATA_ATUAL}}": formatDate(new Date()),
  };
  
  let result = template;
  for (const [placeholder, value] of Object.entries(replacements)) {
    result = result.replaceAll(placeholder, value);
  }
  
  return result;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Get user from token
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Invalid user token");
    }

    const body: ContractRequest = await req.json();
    const { templateId, templateContent, clientData, products, paymentTerms, specialNotes, format } = body;

    // Get template content
    let template = templateContent || "";
    
    if (templateId && !templateContent) {
      const { data: templateData, error: templateError } = await supabase
        .from("templates")
        .select("content")
        .eq("id", templateId)
        .single();
      
      if (templateError || !templateData) {
        throw new Error("Template not found");
      }
      template = templateData.content;
    }

    if (!template) {
      // Default template if none provided
      template = `
# CONTRATO DE PRESTAÇÃO DE SERVIÇOS

## CONTRATANTE
**Nome:** {{NOME}}
**CPF:** {{CPF}}
**Endereço:** {{ENDERECO}}
**Telefone:** {{TELEFONE}}
**E-mail:** {{EMAIL}}

---

## OBJETO DO CONTRATO

O presente contrato tem por objeto a prestação dos seguintes serviços/produtos:

{{PRODUTOS}}

---

## FORMA DE PAGAMENTO

{{FORMA_PAGAMENTO}}

**Valor Total:** {{VALOR_TOTAL}}

---

## OBSERVAÇÕES

{{OBSERVACOES}}

---

## DATA E ASSINATURA

{{DATA}}

_______________________________
**Contratante:** {{NOME}}
CPF: {{CPF}}

_______________________________
**Contratado**
`;
    }

    // Replace all placeholders
    const filledContract = replacePlaceholders(
      template,
      clientData,
      products,
      paymentTerms,
      specialNotes
    );

    // Calculate total value
    const totalValue = products.reduce((sum, p) => sum + p.total, 0);

    // Save contract to database
    const { data: contract, error: insertError } = await supabase
      .from("contracts")
      .insert({
        user_id: user.id,
        template_id: templateId || null,
        client_data: clientData,
        products: products,
        payment_terms: paymentTerms,
        special_notes: specialNotes,
        total_value: totalValue,
        status: "generated",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to save contract");
    }

    // For now, return the filled markdown content
    // In the future, we can generate actual DOCX/PDF files
    const fileName = `contrato_${clientData.nome.replace(/\s+/g, "_")}_${Date.now()}`;

    // Create a simple text file for download
    const textContent = filledContract;
    const encoder = new TextEncoder();
    const textBytes = encoder.encode(textContent);
    const base64Content = btoa(String.fromCharCode(...textBytes));

    // Store the content in the database for later download
    await supabase
      .from("contracts")
      .update({
        generated_file_url: `data:text/markdown;base64,${base64Content}`,
      })
      .eq("id", contract.id);

    return new Response(
      JSON.stringify({
        success: true,
        contractId: contract.id,
        content: filledContract,
        fileName: fileName,
        downloadUrl: `data:text/markdown;base64,${base64Content}`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Generate contract error:", error);
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
