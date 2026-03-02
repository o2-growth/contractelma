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
 * Map common UTF-8 characters to WinAnsiEncoding octal codes for PDF text strings.
 */
const WIN_ANSI_MAP: Record<string, string> = {
  "À": "\\300", "Á": "\\301", "Â": "\\302", "Ã": "\\303", "Ä": "\\304",
  "Å": "\\305", "Æ": "\\306", "Ç": "\\307", "È": "\\310", "É": "\\311",
  "Ê": "\\312", "Ë": "\\313", "Ì": "\\314", "Í": "\\315", "Î": "\\316",
  "Ï": "\\317", "Ñ": "\\321", "Ò": "\\322", "Ó": "\\323", "Ô": "\\324",
  "Õ": "\\325", "Ö": "\\326", "Ù": "\\331", "Ú": "\\332", "Û": "\\333",
  "Ü": "\\334", "Ý": "\\335",
  "à": "\\340", "á": "\\341", "â": "\\342", "ã": "\\343", "ä": "\\344",
  "å": "\\345", "æ": "\\346", "ç": "\\347", "è": "\\350", "é": "\\351",
  "ê": "\\352", "ë": "\\353", "ì": "\\354", "í": "\\355", "î": "\\356",
  "ï": "\\357", "ñ": "\\361", "ò": "\\362", "ó": "\\363", "ô": "\\364",
  "õ": "\\365", "ö": "\\366", "ù": "\\371", "ú": "\\372", "û": "\\373",
  "ü": "\\374", "ý": "\\375",
  "\u2013": "\\226", "\u2014": "\\227", "\u2018": "\\221", "\u2019": "\\222",
  "\u201C": "\\223", "\u201D": "\\224", "\u2022": "\\225", "\u2026": "\\205",
  "ª": "\\252", "º": "\\272", "°": "\\260",
};

function escapePdfText(text: string): string {
  let out = "";
  for (const ch of text) {
    if (ch === "(" || ch === ")" || ch === "\\") {
      out += "\\" + ch;
    } else if (WIN_ANSI_MAP[ch]) {
      out += WIN_ANSI_MAP[ch];
    } else {
      const code = ch.charCodeAt(0);
      if (code >= 32 && code <= 126) {
        out += ch;
      } else if (code >= 128 && code <= 255) {
        out += "\\" + code.toString(8).padStart(3, "0");
      } else if (code > 255) {
        out += "?"; // unsupported glyph fallback
      } else {
        out += ch;
      }
    }
  }
  return out;
}

function stripMarkdown(line: string): string {
  return line
    .replace(/^#{1,6}\s+/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^[-*]\s+/g, "  \u2022 ")
    .replace(/^\d+\.\s+/g, (m) => "  " + m);
}

function wordWrap(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (current.length + word.length + 1 > maxChars && current.length > 0) {
      lines.push(current);
      current = word;
    } else {
      current = current.length === 0 ? word : current + " " + word;
    }
  }
  if (current.length > 0) lines.push(current);
  return lines.length > 0 ? lines : [""];
}

/**
 * Minimal PDF generator — produces a valid PDF with text lines from the contract content.
 */
function generateSimplePdf(text: string): Uint8Array {
  const rawLines = text.split("\n");
  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 50;
  const fontSize = 10;
  const lineHeight = 14;
  const usableWidth = pageWidth - 2 * margin;
  const maxCharsPerLine = Math.floor(usableWidth / (fontSize * 0.5));
  const maxLinesPerPage = Math.floor((pageHeight - 2 * margin) / lineHeight);

  // Process lines: strip markdown, word-wrap
  const allLines: string[] = [];
  for (const raw of rawLines) {
    const clean = stripMarkdown(raw);
    if (clean.trim() === "") {
      allLines.push("");
    } else {
      allLines.push(...wordWrap(clean, maxCharsPerLine));
    }
  }

  // Split into pages
  const pages: string[][] = [];
  for (let i = 0; i < allLines.length; i += maxLinesPerPage) {
    pages.push(allLines.slice(i, i + maxLinesPerPage));
  }
  if (pages.length === 0) pages.push([""]);

  // Build PDF objects
  const objects: string[] = [];
  let objectCount = 0;
  const offsets: number[] = [];

  const addObj = (content: string) => {
    objectCount++;
    offsets.push(-1);
    objects.push(`${objectCount} 0 obj\n${content}\nendobj\n`);
    return objectCount;
  };

  const catalogId = addObj(`<< /Type /Catalog /Pages 2 0 R >>`);
  const pagesId = addObj(`PAGES_PLACEHOLDER`);
  const fontId = addObj(
    `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`
  );

  const pageIds: number[] = [];
  for (const pageLines of pages) {
    // Each line is positioned absolutely using BT/ET per line
    let stream = "";
    for (let i = 0; i < pageLines.length; i++) {
      const x = margin;
      const y = pageHeight - margin - i * lineHeight;
      const escaped = escapePdfText(pageLines[i]);
      stream += `BT\n/F1 ${fontSize} Tf\n${x} ${y} Td\n(${escaped}) Tj\nET\n`;
    }

    const streamId = addObj(
      `<< /Length ${stream.length} >>\nstream\n${stream}endstream`
    );

    const pageId = addObj(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${streamId} 0 R /Resources << /Font << /F1 ${fontId} 0 R >> >> >>`
    );
    pageIds.push(pageId);
  }

  const kidsStr = pageIds.map((id) => `${id} 0 R`).join(" ");
  objects[1] = `${pagesId} 0 obj\n<< /Type /Pages /Kids [${kidsStr}] /Count ${pageIds.length} >>\nendobj\n`;

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
