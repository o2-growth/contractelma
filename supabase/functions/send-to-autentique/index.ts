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
  contractContent: string;
  signers: Signer[];
}

// ── PDF text encoding helpers ──────────────────────────────────────────

const WIN_ANSI_MAP: Record<string, string> = {
  "À":"\\300","Á":"\\301","Â":"\\302","Ã":"\\303","Ä":"\\304",
  "Å":"\\305","Æ":"\\306","Ç":"\\307","È":"\\310","É":"\\311",
  "Ê":"\\312","Ë":"\\313","Ì":"\\314","Í":"\\315","Î":"\\316",
  "Ï":"\\317","Ñ":"\\321","Ò":"\\322","Ó":"\\323","Ô":"\\324",
  "Õ":"\\325","Ö":"\\326","Ù":"\\331","Ú":"\\332","Û":"\\333",
  "Ü":"\\334","Ý":"\\335",
  "à":"\\340","á":"\\341","â":"\\342","ã":"\\343","ä":"\\344",
  "å":"\\345","æ":"\\346","ç":"\\347","è":"\\350","é":"\\351",
  "ê":"\\352","ë":"\\353","ì":"\\354","í":"\\355","î":"\\356",
  "ï":"\\357","ñ":"\\361","ò":"\\362","ó":"\\363","ô":"\\364",
  "õ":"\\365","ö":"\\366","ù":"\\371","ú":"\\372","û":"\\373",
  "ü":"\\374","ý":"\\375",
  "\u2013":"\\226","\u2014":"\\227","\u2018":"\\221","\u2019":"\\222",
  "\u201C":"\\223","\u201D":"\\224","\u2022":"\\225","\u2026":"\\205",
  "ª":"\\252","º":"\\272","°":"\\260",
};

function esc(text: string): string {
  let out = "";
  for (const ch of text) {
    if (ch === "(" || ch === ")" || ch === "\\") { out += "\\" + ch; }
    else if (WIN_ANSI_MAP[ch]) { out += WIN_ANSI_MAP[ch]; }
    else {
      const code = ch.charCodeAt(0);
      if (code >= 32 && code <= 126) out += ch;
      else if (code >= 128 && code <= 255) out += "\\" + code.toString(8).padStart(3, "0");
      else if (code > 255) out += "?";
      else out += ch;
    }
  }
  return out;
}

// ── Word wrap ──────────────────────────────────────────────────────────

function wordWrap(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (cur.length + w.length + 1 > maxChars && cur.length > 0) {
      lines.push(cur); cur = w;
    } else {
      cur = cur.length === 0 ? w : cur + " " + w;
    }
  }
  if (cur.length > 0) lines.push(cur);
  return lines.length > 0 ? lines : [""];
}

// ── Parsed line types ──────────────────────────────────────────────────

type PLine =
  | { type: "heading"; level: number; text: string }
  | { type: "hr" }
  | { type: "blank" }
  | { type: "table-row"; cells: string[] }
  | { type: "table-sep" }
  | { type: "bullet"; text: string }
  | { type: "text"; text: string };

function parseLines(raw: string): PLine[] {
  const lines = raw.split("\n");
  const out: PLine[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") { out.push({ type: "blank" }); continue; }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(trimmed) && !trimmed.includes("|")) {
      out.push({ type: "hr" }); continue;
    }

    // Heading
    const hMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (hMatch) {
      out.push({ type: "heading", level: hMatch[1].length, text: hMatch[2].replace(/\*\*/g, "") });
      continue;
    }

    // Table separator (|---|---|)
    if (/^\|?\s*[-:]+[-| :]+\s*\|?$/.test(trimmed)) {
      out.push({ type: "table-sep" }); continue;
    }

    // Table row
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const cells = trimmed.slice(1, -1).split("|").map(c => c.trim());
      out.push({ type: "table-row", cells }); continue;
    }

    // Bullet
    const bMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (bMatch) {
      out.push({ type: "bullet", text: bMatch[1] }); continue;
    }

    // Numbered list treated as text with indent
    out.push({ type: "text", text: trimmed });
  }
  return out;
}

// ── Inline bold segments ───────────────────────────────────────────────

interface TextSegment { text: string; bold: boolean; }

function parseInline(text: string): TextSegment[] {
  const segs: TextSegment[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) segs.push({ text: text.slice(last, m.index), bold: false });
    segs.push({ text: m[1], bold: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) segs.push({ text: text.slice(last), bold: false });
  return segs.length > 0 ? segs : [{ text, bold: false }];
}

// ── PDF stream helpers ─────────────────────────────────────────────────

function textLine(segs: TextSegment[], x: number, y: number, fontSize: number): string {
  let s = "";
  for (const seg of segs) {
    const font = seg.bold ? "/F2" : "/F1";
    s += `BT\n${font} ${fontSize} Tf\n${x} ${y} Td\n(${esc(seg.text)}) Tj\nET\n`;
    // Advance x by approximate width
    x += seg.text.length * fontSize * 0.52;
  }
  return s;
}

function simpleLine(text: string, x: number, y: number, fontSize: number, bold = false): string {
  const font = bold ? "/F2" : "/F1";
  return `BT\n${font} ${fontSize} Tf\n${x} ${y} Td\n(${esc(text)}) Tj\nET\n`;
}

function hRule(x: number, y: number, width: number): string {
  return `0.7 G\n0.5 w\n${x} ${y} m ${x + width} ${y} l S\n0 G\n`;
}

function rect(x: number, y: number, w: number, h: number): string {
  return `0.75 G\n0.4 w\n${x} ${y} ${w} ${h} re S\n0 G\n`;
}

function filledRect(x: number, y: number, w: number, h: number): string {
  return `0.93 g\n${x} ${y} ${w} ${h} re f\n0 g\n`;
}

// ── Main PDF generator ─────────────────────────────────────────────────

function generateSimplePdf(text: string): Uint8Array {
  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 50;
  const usableWidth = pageWidth - 2 * margin;
  const bodySize = 10;
  const bodyLH = 15;
  const maxChars = Math.floor(usableWidth / (bodySize * 0.52));

  const parsed = parseLines(text);

  // Flatten parsed lines into render instructions per page
  interface RenderCmd {
    exec: (stream: string[]) => void;
    height: number;
  }

  const commands: RenderCmd[] = [];

  let i = 0;
  while (i < parsed.length) {
    const p = parsed[i];

    if (p.type === "blank") {
      commands.push({ height: bodyLH * 0.6, exec: () => {} });
      i++; continue;
    }

    if (p.type === "hr") {
      commands.push({
        height: bodyLH,
        exec: (s) => { /* y filled at render */ }
      });
      // Tag it so we know it's an HR
      (commands[commands.length - 1] as any)._hr = true;
      i++; continue;
    }

    if (p.type === "heading") {
      const sz = p.level <= 1 ? 16 : p.level <= 2 ? 14 : 12;
      const lh = sz + 6;
      const wrapped = wordWrap(p.text, Math.floor(usableWidth / (sz * 0.52)));
      // Extra space before heading
      commands.push({ height: bodyLH * 0.5, exec: () => {} });
      for (const wl of wrapped) {
        const line = wl;
        commands.push({
          height: lh,
          exec: (s) => { /* filled at render */ },
        });
        (commands[commands.length - 1] as any)._heading = { text: line, size: sz };
      }
      // Space after heading
      commands.push({ height: bodyLH * 0.3, exec: () => {} });
      i++; continue;
    }

    if (p.type === "bullet") {
      const wrapped = wordWrap(p.text, maxChars - 6);
      for (let wi = 0; wi < wrapped.length; wi++) {
        const prefix = wi === 0 ? "  \u2022  " : "       ";
        const line = prefix + wrapped[wi];
        commands.push({
          height: bodyLH,
          exec: (s) => {},
        });
        (commands[commands.length - 1] as any)._text = line;
      }
      i++; continue;
    }

    if (p.type === "text") {
      const segs = parseInline(p.text);
      // Get full plain text for wrapping
      const plain = segs.map(s => s.text).join("");
      const wrapped = wordWrap(plain, maxChars);
      // For simplicity with bold: if single line, keep segments; otherwise flatten
      if (wrapped.length === 1) {
        commands.push({ height: bodyLH, exec: () => {} });
        (commands[commands.length - 1] as any)._segs = segs;
      } else {
        // Re-parse each wrapped line for bold
        for (const wl of wrapped) {
          commands.push({ height: bodyLH, exec: () => {} });
          (commands[commands.length - 1] as any)._segs = parseInline(wl);
        }
      }
      i++; continue;
    }

    // Table: collect consecutive table-row / table-sep
    if (p.type === "table-row" || p.type === "table-sep") {
      const tableRows: string[][] = [];
      let isHeader = true;
      while (i < parsed.length) {
        const cur = parsed[i];
        if (cur.type === "table-row") {
          tableRows.push(cur.cells);
          i++;
        } else if (cur.type === "table-sep") {
          i++; // skip separator line
        } else break;
      }
      if (tableRows.length === 0) continue;

      const numCols = Math.max(...tableRows.map(r => r.length));
      const colWidth = usableWidth / numCols;
      const rowH = bodyLH + 6;

      // Mark as table command
      commands.push({
        height: tableRows.length * rowH + 4,
        exec: () => {},
      });
      (commands[commands.length - 1] as any)._table = { rows: tableRows, numCols, colWidth, rowH };
      continue;
    }

    i++;
  }

  // ── Paginate & render ──────────────────────────────────────────────

  const maxY = pageHeight - margin;
  const minY = margin;

  interface PageStream { stream: string; }
  const pageStreams: PageStream[] = [];

  let curY = maxY;
  let curStream = "";

  const newPage = () => {
    if (curStream) pageStreams.push({ stream: curStream });
    curStream = "";
    curY = maxY;
  };

  for (const cmd of commands) {
    if (curY - cmd.height < minY) newPage();

    const y = curY - cmd.height;

    if ((cmd as any)._hr) {
      curStream += hRule(margin, y + cmd.height / 2, usableWidth);
    } else if ((cmd as any)._heading) {
      const h = (cmd as any)._heading;
      curStream += simpleLine(h.text, margin, y + 4, h.size, true);
    } else if ((cmd as any)._text) {
      const t = (cmd as any)._text;
      curStream += textLine(parseInline(t), margin, y + 4, bodySize);
    } else if ((cmd as any)._segs) {
      curStream += textLine((cmd as any)._segs, margin, y + 4, bodySize);
    } else if ((cmd as any)._table) {
      const tbl = (cmd as any)._table;
      const { rows, numCols, colWidth, rowH } = tbl;
      let ty = curY;
      for (let ri = 0; ri < rows.length; ri++) {
        ty -= rowH;
        const isFirst = ri === 0;
        for (let ci = 0; ci < numCols; ci++) {
          const cx = margin + ci * colWidth;
          // Background for header row
          if (isFirst) curStream += filledRect(cx, ty, colWidth, rowH);
          // Border
          curStream += rect(cx, ty, colWidth, rowH);
          // Text
          const cellText = (rows[ri][ci] || "").replace(/\*\*/g, "");
          const truncated = cellText.length > Math.floor(colWidth / (bodySize * 0.52) - 1)
            ? cellText.slice(0, Math.floor(colWidth / (bodySize * 0.52) - 2)) + "…"
            : cellText;
          curStream += simpleLine(truncated, cx + 4, ty + 5, bodySize - 1, isFirst);
        }
      }
    }

    curY -= cmd.height;
  }
  // Push last page
  if (curStream) pageStreams.push({ stream: curStream });
  if (pageStreams.length === 0) pageStreams.push({ stream: "" });

  // ── Build PDF objects ──────────────────────────────────────────────

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
  const f1Id = addObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`);
  const f2Id = addObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`);

  const pageIds: number[] = [];
  for (const ps of pageStreams) {
    const streamId = addObj(`<< /Length ${ps.stream.length} >>\nstream\n${ps.stream}endstream`);
    const pageId = addObj(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${streamId} 0 R /Resources << /Font << /F1 ${f1Id} 0 R /F2 ${f2Id} 0 R >> >> >>`
    );
    pageIds.push(pageId);
  }

  const kidsStr = pageIds.map(id => `${id} 0 R`).join(" ");
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

// ── Serve ──────────────────────────────────────────────────────────────

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

    const pdfBytes = generateSimplePdf(contractContent);
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

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
