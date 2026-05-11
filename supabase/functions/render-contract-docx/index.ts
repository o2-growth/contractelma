import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import JSZip from "https://esm.sh/jszip@3.10.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface RequestBody {
  docxTemplate: string;
  clientData: Record<string, string | undefined>;
  contractName?: string;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json();
    const { docxTemplate, clientData, contractName } = body;

    if (!docxTemplate) {
      throw new Error("docxTemplate é obrigatório (path no Storage)");
    }
    if (!clientData) {
      throw new Error("clientData é obrigatório");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: fileData, error: dlError } = await supabase.storage
      .from("documents")
      .download(docxTemplate);

    if (dlError || !fileData) {
      throw new Error(
        `Erro ao baixar template do storage: ${dlError?.message || "arquivo não encontrado"}`
      );
    }

    const zip = await JSZip.loadAsync(await fileData.arrayBuffer());
    const docFile = zip.file("word/document.xml");
    if (!docFile) {
      throw new Error("word/document.xml não encontrado no DOCX");
    }
    let docXml = await docFile.async("string");

    // Substituir placeholders em 3 cases (snake_case, UPPER, lower)
    for (const [key, value] of Object.entries(clientData)) {
      if (value === undefined || value === null || value === "") continue;
      const safe = escapeXml(String(value));
      const variants = new Set([key, key.toUpperCase(), key.toLowerCase()]);
      for (const variant of variants) {
        docXml = docXml.split(`{{${variant}}}`).join(safe);
      }
    }

    // Data automática (caso template tenha {{DATA}} ou {{data}})
    const today = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    docXml = docXml
      .split("{{DATA}}").join(today)
      .split("{{data}}").join(today)
      .split("{{DATA_ATUAL}}").join(today)
      .split("{{data_atual}}").join(today);

    zip.file("word/document.xml", docXml);
    const docxBytes = await zip.generateAsync({ type: "uint8array" });

    const base64 = uint8ToBase64(docxBytes);

    const safeFileName = (contractName || "contrato")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 100);

    return new Response(
      JSON.stringify({
        success: true,
        fileName: `${safeFileName}.docx`,
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        base64,
        sizeBytes: docxBytes.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Render contract docx error:", error);
    const message =
      error instanceof Error ? error.message : "Erro desconhecido ao renderizar DOCX";
    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
