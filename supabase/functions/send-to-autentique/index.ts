import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
  contractContent: string; // markdown/text content
  signers: Signer[];
}

/**
 * Minimal PDF generator — produces a valid PDF with text lines from the contract content.
 * No external dependencies needed.
 */
function generateSimplePdf(text: string): Uint8Array {
  const lines = text.split("\n");
  const pageWidth = 595; // A4
  const pageHeight = 842;
  const margin = 50;
  const lineHeight = 14;
  const maxLinesPerPage = Math.floor((pageHeight - 2 * margin) / lineHeight);

  // Split into pages
  const pages: string[][] = [];
  let current: string[] = [];
  for (const line of lines) {
    // Strip markdown formatting for PDF
    const clean = line
      .replace(/^#{1,6}\s+/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/`([^`]+)`/g, "$1");

    current.push(clean);
    if (current.length >= maxLinesPerPage) {
      pages.push(current);
      current = [];
    }
  }
  if (current.length > 0) pages.push(current);
  if (pages.length === 0) pages.push([""]);

  // Build PDF manually
  const objects: string[] = [];
  let objectCount = 0;
  const offsets: number[] = [];

  const addObj = (content: string) => {
    objectCount++;
    offsets.push(-1); // placeholder
    objects.push(`${objectCount} 0 obj\n${content}\nendobj\n`);
    return objectCount;
  };

  // 1: Catalog
  const catalogId = addObj(`<< /Type /Catalog /Pages 2 0 R >>`);

  // 2: Pages (placeholder, will be updated)
  const pagesId = addObj(`PAGES_PLACEHOLDER`);

  // Font
  const fontId = addObj(
    `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`
  );

  // Create page objects
  const pageIds: number[] = [];
  const streamIds: number[] = [];
  for (const pageLines of pages) {
    // Build content stream
    let stream = `BT\n/F1 10 Tf\n`;
    let y = pageHeight - margin;
    for (const line of pageLines) {
      // Escape special PDF chars
      const escaped = line
        .replace(/\\/g, "\\\\")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)")
        .substring(0, 100); // limit line length
      stream += `${margin} ${y} Td\n(${escaped}) Tj\n0 -${lineHeight} Td\n`;
      y -= lineHeight;
    }
    stream += `ET\n`;

    const streamId = addObj(
      `<< /Length ${stream.length} >>\nstream\n${stream}endstream`
    );
    streamIds.push(streamId);

    const pageId = addObj(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${streamId} 0 R /Resources << /Font << /F1 ${fontId} 0 R >> >> >>`
    );
    pageIds.push(pageId);
  }

  // Update pages object
  const kidsStr = pageIds.map((id) => `${id} 0 R`).join(" ");
  objects[1] = `${pagesId} 0 obj\n<< /Type /Pages /Kids [${kidsStr}] /Count ${pageIds.length} >>\nendobj\n`;

  // Build PDF file
  let pdf = `%PDF-1.4\n`;
  for (let i = 0; i < objects.length; i++) {
    offsets[i] = pdf.length;
    pdf += objects[i];
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objectCount + 1}\n`;
  pdf += `0000000000 65535 f \n`;
  for (let i = 0; i < objectCount; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objectCount + 1} /Root ${catalogId} 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF\n`;

  return new TextEncoder().encode(pdf);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("AUTENTIQUE_API_KEY");
    if (!apiKey) {
      throw new Error("AUTENTIQUE_API_KEY não configurada");
    }

    const body: RequestBody = await req.json();
    const { contractName, contractContent, signers } = body;

    if (!contractContent || !signers || signers.length === 0) {
      throw new Error("contractContent e signers são obrigatórios");
    }

    // Generate PDF from content
    const pdfBytes = generateSimplePdf(contractContent);
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

    // Build GraphQL multipart request (spec: https://github.com/jaydenseric/graphql-multipart-request-spec)
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
    formData.append("0", pdfBlob, `${contractName || "contrato"}.pdf`);

    const response = await fetch("https://api.autentique.com.br/v2/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (result.errors) {
      console.error("Autentique API errors:", result.errors);
      throw new Error(
        result.errors.map((e: any) => e.message).join("; ") ||
          "Erro na API da Autentique"
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
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
