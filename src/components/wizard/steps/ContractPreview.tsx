import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Loader2, AlertCircle, AlertTriangle, FileType, Eye } from "lucide-react";
import { SendToSignature } from "./SendToSignature";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ContractData } from "../ContractWizard";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import mammoth from "mammoth";

interface ContractPreviewProps {
  contractData: ContractData;
}

function extractTemplateVars(content: string | undefined): string[] {
  if (!content) return [];
  const regex = /\{\{(\w+)\}\}/g;
  const keys = new Set<string>();
  let m;
  while ((m = regex.exec(content)) !== null) keys.add(m[1]);
  return Array.from(keys);
}

export function ContractPreview({ contractData }: ContractPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Preview HTML do DOCX (renderizado via mammoth.js) e bytes pra reaproveitar no download
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const [docxBytes, setDocxBytes] = useState<Uint8Array | null>(null);
  const [docxFileName, setDocxFileName] = useState<string | null>(null);
  const [isRenderingDocx, setIsRenderingDocx] = useState(false);

  const hasDocxTemplate = Boolean(contractData.template?.docxTemplate);

  // Calculate missing fields
  const missingFields = useMemo(() => {
    const allVars = extractTemplateVars(contractData.template?.content);
    const autoFilled = new Set(["PRODUTOS"]);
    return allVars.filter((k) => !autoFilled.has(k) && !(contractData.clientData[k] || "").trim());
  }, [contractData]);

  const generateContractLocally = () => {
    const template = contractData.template?.content || getDefaultTemplate();
    return replacePlaceholders(template, contractData);
  };

  const getDefaultTemplate = () => `# CONTRATO DE PRESTAÇÃO DE SERVIÇOS

## CONTRATANTE
**Nome:** {{RAZAO_SOCIAL}}
**CNPJ:** {{CNPJ}}
**Endereço:** {{ENDERECO}}

---

São Paulo, {{DIA}} de {{MES}} de 20{{ANO}}

_______________________________
**Contratante:** {{RAZAO_SOCIAL}}
CNPJ: {{CNPJ}}

_______________________________
**Contratado**
`;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const replacePlaceholders = (template: string, data: ContractData) => {
    const autoReplacements: Record<string, string> = {
      DATA: formatDate(new Date()),
    };

    let result = template;

    for (const [key, value] of Object.entries(autoReplacements)) {
      result = result.split(`{{${key}}}`).join(value);
      result = result.split(`{{${key.toLowerCase()}}}`).join(value);
    }

    for (const [key, value] of Object.entries(data.clientData)) {
      result = result.split(`{{${key}}}`).join(value);
      result = result.split(`{{${key.toUpperCase()}}}`).join(value);
      result = result.split(`{{${key.toLowerCase()}}}`).join(value);
    }

    return result;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // 1. Geração local em markdown (rápida) sempre acontece
      const content = generateContractLocally();
      setGeneratedContent(content);
      setDownloadUrl("local");
      setIsGenerated(true);

      // 2. Se houver docxTemplate, também renderiza o DOCX preenchido pra preview e download
      const docxTemplate = contractData.template?.docxTemplate;
      if (docxTemplate) {
        setIsRenderingDocx(true);
        try {
          const { data, error: fnError } = await supabase.functions.invoke(
            "render-contract-docx",
            {
              body: {
                docxTemplate,
                clientData: contractData.clientData,
                contractName: `contrato_${getClientLabel()}`,
              },
            }
          );

          if (fnError) throw new Error(fnError.message || "Falha na edge function");
          if (!data?.success) throw new Error(data?.error || "Falha ao renderizar DOCX");
          if (!data.base64) throw new Error("DOCX vazio retornado");

          // Decode base64 → bytes
          const binaryStr = atob(data.base64);
          const bytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }
          setDocxBytes(bytes);
          setDocxFileName(data.fileName || `contrato_${getClientLabel()}_${Date.now()}.docx`);

          // Renderizar HTML via mammoth (para preview na tela)
          const arrayBuffer = bytes.buffer.slice(
            bytes.byteOffset,
            bytes.byteOffset + bytes.byteLength
          ) as ArrayBuffer;
          const result = await mammoth.convertToHtml(
            { arrayBuffer },
            {
              styleMap: [
                "p[style-name='Heading 1'] => h1.docx-h1:fresh",
                "p[style-name='Heading 2'] => h2.docx-h2:fresh",
                "p[style-name='Heading 3'] => h3.docx-h3:fresh",
              ],
            }
          );
          setDocxHtml(result.value);
        } catch (renderErr) {
          console.error("Erro ao renderizar preview DOCX:", renderErr);
          // Não bloqueia — markdown continua funcionando
          toast.warning("Preview com design indisponível — usando markdown", {
            description: renderErr instanceof Error ? renderErr.message : "tente novamente",
          });
        } finally {
          setIsRenderingDocx(false);
        }
      }

      toast.success("Contrato gerado com sucesso!", {
        description: "Use os botões para baixar o DOCX ou markdown.",
      });
    } catch (err) {
      console.error("Generate error:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      toast.error("Erro ao gerar contrato", { description: errorMessage });
    } finally {
      setIsGenerating(false);
    }
  };

  const getClientLabel = () =>
    (contractData.clientData.RAZAO_SOCIAL ||
      contractData.clientData.razao_social ||
      contractData.clientData.CLIENTE ||
      contractData.clientData.nome ||
      "cliente")
      .replace(/\s+/g, "_")
      .slice(0, 80);

  const handleDownloadMd = () => {
    if (!generatedContent) return;
    const blob = new Blob([generatedContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `contrato_${getClientLabel()}_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Markdown baixado");
  };

  const handleDownloadDocx = async () => {
    if (!docxBytes || !docxFileName) {
      toast.error("DOCX ainda não disponível — clique em Gerar Contrato primeiro");
      return;
    }

    setIsDownloadingDocx(true);
    try {
      const blob = new Blob([docxBytes as BlobPart], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = docxFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("DOCX baixado com design preservado!");
    } catch (err) {
      console.error("Erro ao baixar DOCX:", err);
      toast.error("Erro ao baixar DOCX", {
        description: err instanceof Error ? err.message : "tente novamente",
      });
    } finally {
      setIsDownloadingDocx(false);
    }
  };

  const clientName = contractData.clientData.RAZAO_SOCIAL || contractData.clientData.CLIENTE || contractData.clientData.nome || "[NOME DO CLIENTE]";
  const clientDoc = contractData.clientData.CNPJ || contractData.clientData.CPF_REPRESENTANTE || "[CNPJ/CPF]";

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Preview do Contrato
        </h2>
        <p className="mt-1 text-muted-foreground">
          Revise o contrato antes de gerar o documento final
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 rounded-xl border border-border bg-card shadow-card overflow-hidden"
        >
          <div className="border-b border-border bg-muted/50 px-6 py-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              {contractData.template?.name || "Contrato"}
            </span>
          </div>

          <div className="p-8 max-h-[800px] overflow-y-auto bg-muted/20">
            {/* Loading enquanto a edge function processa o DOCX */}
            {isRenderingDocx && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Renderizando contrato com design O2…
                </p>
              </div>
            )}

            {/* Preview com design (HTML do DOCX via mammoth) — só aparece após Gerar Contrato */}
            {!isRenderingDocx && docxHtml && (
              <div className="docx-preview mx-auto max-w-[210mm] bg-white rounded shadow-lg border border-border/50 p-12">
                <div
                  className="prose prose-sm max-w-none
                    [&_h1]:font-display [&_h1]:text-center [&_h1]:font-bold [&_h1]:uppercase [&_h1]:tracking-wide
                    [&_h2]:font-display [&_h2]:font-bold
                    [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
                    [&_table_td]:border [&_table_td]:border-gray-300 [&_table_td]:p-2 [&_table_td]:align-top
                    [&_table_th]:border [&_table_th]:border-gray-300 [&_table_th]:p-2 [&_table_th]:bg-gray-100 [&_table_th]:text-left
                    [&_img]:max-w-full [&_img]:h-auto
                    [&_p]:my-2 [&_p]:leading-relaxed [&_p]:text-[12px] [&_p]:text-gray-800
                    [&_strong]:font-semibold
                    [&_a]:text-blue-600 [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: docxHtml }}
                />
                <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-muted-foreground italic">
                  ⓘ Esta é uma renderização aproximada (HTML). Para fidelidade total ao design O2 INC (logo, marca d'água, fontes), baixe o DOCX usando o botão à direita.
                </div>
              </div>
            )}

            {/* Fallback: preview markdown simples quando não há docxTemplate ou ainda não gerou */}
            {!isRenderingDocx && !docxHtml && (
              <div className="prose prose-sm max-w-none">
                <h1 className="text-center font-display text-xl font-bold uppercase tracking-wide">
                  Contrato de Prestação de Serviços
                </h1>

                <p className="mt-6 text-justify leading-relaxed">
                  Pelo presente instrumento particular, de um lado{" "}
                  <span className="rounded bg-highlight px-1 font-semibold">
                    {clientName}
                  </span>
                  , inscrito no CNPJ/CPF sob o nº{" "}
                  <span className="rounded bg-highlight px-1 font-mono">
                    {clientDoc}
                  </span>
                  , doravante denominado CONTRATANTE.
                </p>

                <h2 className="mt-8 font-display text-lg font-semibold">
                  Dados Preenchidos
                </h2>
                <div className="my-4 rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium">Campo</th>
                        <th className="px-4 py-2 text-left font-medium">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {Object.entries(contractData.clientData)
                        .filter(([, value]) => value.length > 0)
                        .map(([key, value], i) => (
                          <tr key={key} className={i % 2 === 1 ? "bg-muted/30" : ""}>
                            <td className="px-4 py-2 font-medium">{key}</td>
                            <td className="px-4 py-2">{value}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {hasDocxTemplate && (
                  <div className="mt-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
                    <p className="text-sm flex items-start gap-2 text-foreground">
                      <Eye className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Clique em <strong>Gerar Contrato</strong> ao lado para ver o preview com o design O2 INC e baixar o DOCX final.</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Sidebar summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold text-foreground mb-3">
              Resumo
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Cliente</span>
                <p className="font-medium text-foreground mt-0.5">
                  {contractData.clientData.RAZAO_SOCIAL || contractData.clientData.CLIENTE || contractData.clientData.nome || "-"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Template</span>
                <p className="font-medium text-foreground mt-0.5">
                  {contractData.template?.name || "-"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Campos preenchidos</span>
                <p className="font-medium text-foreground mt-0.5">
                  {Object.values(contractData.clientData).filter(v => v.length > 0).length}
                </p>
              </div>
            </div>
          </div>

          {/* Missing fields warning */}
          {missingFields.length > 0 && (
            <div className="rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                    {missingFields.length} campo(s) não preenchido(s)
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                    {missingFields.slice(0, 4).join(", ")}
                    {missingFields.length > 4 && ` e mais ${missingFields.length - 4}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                <div>
                  <p className="text-sm font-medium text-destructive">Erro</p>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {!isGenerated ? (
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                {isGenerating ? "Gerando..." : "Gerar Contrato"}
              </Button>
            ) : (
              <>
                {hasDocxTemplate && (
                  <Button
                    onClick={handleDownloadDocx}
                    disabled={isDownloadingDocx}
                    className={cn("w-full gap-2", "bg-success hover:bg-success/90")}
                  >
                    {isDownloadingDocx ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileType className="h-4 w-4" />
                    )}
                    {isDownloadingDocx ? "Gerando DOCX..." : "Baixar DOCX (design preservado)"}
                  </Button>
                )}
                <Button
                  onClick={handleDownloadMd}
                  variant={hasDocxTemplate ? "outline" : "default"}
                  className={cn(
                    "w-full gap-2",
                    !hasDocxTemplate && "bg-success hover:bg-success/90"
                  )}
                >
                  <Download className="h-4 w-4" />
                  {hasDocxTemplate ? "Baixar Markdown (preview)" : "Baixar Contrato"}
                </Button>
                <Button
                  onClick={() => {
                    setIsGenerated(false);
                    setGeneratedContent(null);
                    setDownloadUrl(null);
                    setDocxHtml(null);
                    setDocxBytes(null);
                    setDocxFileName(null);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Gerar Novamente
                </Button>
              </>
            )}
          </div>

          {isGenerated && (
            <>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-success"
              >
                🎉 Contrato gerado com sucesso!
              </motion.p>
              <SendToSignature
                contractName={contractData.template?.name || "Contrato"}
                contractContent={generatedContent || ""}
                clientData={contractData.clientData}
                docxTemplate={contractData.template?.docxTemplate}
              />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
