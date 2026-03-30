import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import JSZip from "https://esm.sh/jszip@3.10.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Signer {
  name?: string;
  email: string;
  action: "SIGN" | "APPROVE" | "RECOGNIZE" | "SIGN_AS_A_PARTY" | "RECEIPT";
}

interface RequestBody {
  contractName: string;
  contractContent: string;
  signers: Signer[];
  clientData?: Record<string, string>;
  docxTemplate?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("AUTENTIQUE_API_KEY");
    if (!apiKey) throw new Error("AUTENTIQUE_API_KEY não configurada");

    const body: RequestBody = await req.json();
    const { contractName, signers, clientData, docxTemplate } = body;

    if (!signers || signers.length === 0) {
      throw new Error("signers são obrigatórios");
    }

    let fileBlob: Blob;
    let fileName: string;

    if (docxTemplate && clientData) {
      // DOCX template approach: download, replace placeholders, send
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: fileData, error: dlError } = await supabase.storage
        .from("documents")
        .download(docxTemplate);

      if (dlError || !fileData) {
        throw new Error(`Erro ao baixar template: ${dlError?.message || "arquivo não encontrado"}`);
      }

      const zip = await JSZip.loadAsync(await fileData.arrayBuffer());
      const docXml = await zip.file("word/document.xml")!.async("string");

      // Replace all {{PLACEHOLDER}} markers with actual values
      let modified = docXml;
      for (const [key, value] of Object.entries(clientData)) {
        const placeholder = `{{${key}}}`;
        // Replace all occurrences
        while (modified.includes(placeholder)) {
          modified = modified.replace(placeholder, escapeXml(value));
        }
      }

      zip.file("word/document.xml", modified);
      const docxBytes = await zip.generateAsync({ type: "uint8array" });
      fileBlob = new Blob([docxBytes], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      fileName = `${contractName || "contrato"}.docx`;
    } else {
      // Fallback: send contractContent as plain text PDF (legacy)
      const content = body.contractContent || "";
      fileBlob = new Blob([generateSimplePdf(content)], { type: "application/pdf" });
      fileName = `${contractName || "contrato"}.pdf`;
    }

    // Send to Autentique
    const operations = JSON.stringify({
      query: `mutation CreateDocumentMutation($document: DocumentInput!, $signers: [SignerInput!]!, $file: Upload!) {
        createDocument(document: $document, signers: $signers, file: $file) {
          id
          name
          signatures {
            public_id
            name
            email
            action { name }
            link { short_link }
          }
        }
      }`,
      variables: {
        document: { name: contractName || "Contrato" },
        signers: signers.map((s) => ({
          email: s.email,
          action: s.action || "SIGN",
          ...(s.name ? { name: s.name } : {}),
        })),
        file: null,
      },
    });

    const mapObj = JSON.stringify({ "0": ["variables.file"] });
    const formData = new FormData();
    formData.append("operations", operations);
    formData.append("map", mapObj);
    formData.append("0", fileBlob, fileName);

    const response = await fetch("https://api.autentique.com.br/v2/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    });

    const result = await response.json();

    if (result.errors) {
      console.error("Autentique API errors:", result.errors);
      throw new Error(
        result.errors.map((e: any) => e.message).join("; ") || "Erro na API da Autentique"
      );
    }

    const doc = result.data?.createDocument;
    return new Response(JSON.stringify({ success: true, document: doc }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Minimal PDF fallback for non-DOCX templates
function generateSimplePdf(text: string): Uint8Array {
  const lines = text.split("\n");
  const pageHeight = 842;
  const margin = 50;
  const lineHeight = 14;
  const maxY = pageHeight - margin;
  let y = maxY;
  let stream = "";

  for (const line of lines) {
    if (y < margin) { y = maxY; }
    const safe = line.replace(/[()\\]/g, (c) => "\\" + c);
    stream += `BT /F1 10 Tf ${margin} ${y} Td (${safe}) Tj ET\n`;
    y -= lineHeight;
  }

  const streamObj = `<< /Length ${stream.length} >>\nstream\n${stream}endstream`;
  const objects = [
    `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`,
    `2 0 obj\n<< /Type /Pages /Kids [4 0 R] /Count 1 >>\nendobj\n`,
    `3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`,
    `4 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 ${pageHeight}] /Contents 5 0 R /Resources << /Font << /F1 3 0 R >> >> >>\nendobj\n`,
    `5 0 obj\n${streamObj}\nendobj\n`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  for (const obj of objects) { offsets.push(pdf.length); pdf += obj; }
  const xref = pdf.length;
  pdf += `xref\n0 6\n0000000000 65535 f \n`;
  for (const o of offsets) pdf += `${String(o).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new TextEncoder().encode(pdf);
}
