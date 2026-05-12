import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Loader2, AlertCircle, AlertTriangle, FileType, Eye, RefreshCw, Pencil, X } from "lucide-react";
import { SendToSignature } from "./SendToSignature";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { ContractData } from "../ContractWizard";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import mammoth from "mammoth";
import { enrichClientDataForTemplate, dataPorExtenso } from "@/lib/formatters/contractFormatters";

// Conjunto único de chaves auto-preenchidas (derivadas / formatadas).
// Mantido em sincronia com ClientDataImport.AUTO_FILLED_KEYS e enrichClientDataForTemplate.
const AUTO_FILLED = new Set([
  "PRODUTOS",
  "valor_extenso_setup",
  "valor_plataforma_extenso",
  "parcelas_valor_extenso",
  "data_assinatura_extenso",
  "DATA_EXTENSO",
]);

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
  const [docxRenderError, setDocxRenderError] = useState<string | null>(null);

  // Modo edição inline do contrato
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState<string | null>(null);

  // Watchdog: se isRenderingDocx ficar "true" por mais de 15s sem o handleGenerate
  // estar rodando, considera estado zumbi e força reset (defesa em profundidade
  // contra promises pendentes que não resolveram nem rejeitaram).
  useEffect(() => {
    if (!isRenderingDocx || isGenerating) return;
    const t = setTimeout(() => {
      setIsRenderingDocx(false);
      setDocxRenderError(
        "Renderização DOCX travou — usando markdown como fallback. Você ainda pode tentar gerar novamente."
      );
    }, 15000);
    return () => clearTimeout(t);
  }, [isRenderingDocx, isGenerating]);

  const hasDocxTemplate = Boolean(contractData.template?.docxTemplate);

  // Campos do template considerados "preenchíveis pelo usuário" (exclui auto-filled).
  const fillableTemplateKeys = useMemo(() => {
    const allVars = extractTemplateVars(contractData.template?.content);
    return allVars.filter((k) => !AUTO_FILLED.has(k));
  }, [contractData.template?.content]);

  // Calculate missing fields
  const missingFields = useMemo(() => {
    return fillableTemplateKeys.filter((k) => !(contractData.clientData[k] || "").trim());
  }, [fillableTemplateKeys, contractData.clientData]);

  const totalFields = fillableTemplateKeys.length;
  const filledFields = useMemo(() => {
    if (totalFields === 0) {
      // Sem template definido: caímos no comportamento legado (qualquer campo do clientData).
      return Object.values(contractData.clientData).filter((v) => v.length > 0).length;
    }
    return fillableTemplateKeys.filter((k) => (contractData.clientData[k] || "").trim().length > 0).length;
  }, [fillableTemplateKeys, contractData.clientData, totalFields]);
  const fillProgress = totalFields > 0 ? (filledFields / totalFields) * 100 : 0;

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
      DATA_EXTENSO: dataPorExtenso(new Date()),
    };

    // Enriquece o clientData com *_extenso, *_brl, valor_extenso_setup etc.
    const enriched = enrichClientDataForTemplate(data.clientData);

    let result = template;

    for (const [key, value] of Object.entries(autoReplacements)) {
      result = result.split(`{{${key}}}`).join(value);
      result = result.split(`{{${key.toLowerCase()}}}`).join(value);
    }

    for (const [key, value] of Object.entries(enriched)) {
      result = result.split(`{{${key}}}`).join(value);
      result = result.split(`{{${key.toUpperCase()}}}`).join(value);
      result = result.split(`{{${key.toLowerCase()}}}`).join(value);
    }

    // Sweep final: remove qualquer placeholder remanescente {{algo}} para não
    // vazar literais no contrato final quando o campo é opcional/vazio.
    result = result.replace(/\{\{(\w+)\}\}/g, "");

    return result;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setDocxRenderError(null);

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
          // Promise.race com timeout de 15s pra não travar o spinner indefinidamente.
          const invokePromise = supabase.functions.invoke("render-contract-docx", {
            body: {
              docxTemplate,
              clientData: contractData.clientData,
              contractName: `contrato_${getClientLabel()}`,
            },
          });
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(
              () =>
                reject(
                  new Error(
                    "Timeout ao renderizar DOCX — usando preview markdown como fallback"
                  )
                ),
              15000
            );
          });
          const { data, error: fnError } = (await Promise.race([
            invokePromise,
            timeoutPromise,
          ])) as Awaited<typeof invokePromise>;

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
          // Não bloqueia — markdown continua funcionando, mas limpamos qualquer
          // estado parcial pra não exibir preview corrompido.
          setDocxHtml(null);
          setDocxBytes(null);
          setDocxFileName(null);
          const msg = renderErr instanceof Error ? renderErr.message : "tente novamente";
          setDocxRenderError(
            "Renderização DOCX falhou — mostrando markdown. Você ainda pode tentar gerar novamente."
          );
          toast.warning("Preview com design indisponível — usando markdown", {
            description: msg,
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

  const handleDownloadTxt = () => {
    const content = editedContent ?? generatedContent;
    if (!content) return;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `contrato_${getClientLabel()}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("TXT baixado");
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
            {isGenerated && editedContent !== null && editedContent !== generatedContent && (
              <Badge variant="outline" className="ml-2 border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700 text-[10px] h-5 px-1.5">
                Editado
              </Badge>
            )}
            {isGenerated && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditMode((v) => !v)}
                className="ml-auto gap-1 h-7 px-2 text-xs"
              >
                {editMode ? (
                  <>
                    <X className="h-3 w-3" />
                    Cancelar edição
                  </>
                ) : (
                  <>
                    <Pencil className="h-3 w-3" />
                    Editar contrato
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="p-8 max-h-[800px] overflow-y-auto bg-muted/20">
            {editMode && isGenerated ? (
              <div className="flex flex-col h-full max-h-[750px]">
                <div className="mb-3 text-xs text-muted-foreground flex items-center gap-2 px-2">
                  <Pencil className="h-3 w-3" />
                  Edite o conteúdo do contrato. Suas alterações serão preservadas no envio.
                </div>
                <Textarea
                  value={editedContent ?? generatedContent ?? ""}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="flex-1 font-mono text-xs min-h-[600px] resize-none bg-white"
                  placeholder="Conteúdo do contrato..."
                />
                <div className="mt-3 flex gap-2 justify-end px-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditedContent(null);
                      setEditMode(false);
                      toast.info("Edições descartadas");
                    }}
                  >
                    Descartar alterações
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditMode(false);
                      toast.success("Alterações salvas — serão usadas no envio");
                    }}
                  >
                    Salvar alterações
                  </Button>
                </div>
              </div>
            ) : (
              <>
            {/* Banner de erro discreta quando o render DOCX falhou/timeout */}
            {isGenerated && !isRenderingDocx && docxRenderError && (
              <div className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    {docxRenderError}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setDocxRenderError(null);
                    handleGenerate();
                  }}
                  disabled={isGenerating || isRenderingDocx}
                  className="gap-1 h-7 px-2 text-xs"
                >
                  <RefreshCw className="h-3 w-3" />
                  Tentar novamente
                </Button>
              </div>
            )}

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
              </>
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
                  {totalFields > 0 ? `${filledFields} de ${totalFields}` : filledFields}
                </p>
                {totalFields > 0 && (
                  <Progress value={fillProgress} className="h-1.5 mt-1" />
                )}
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
                {docxBytes ? (
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
                ) : hasDocxTemplate ? (
                  <Button
                    onClick={() => {
                      setDocxRenderError(null);
                      handleGenerate();
                    }}
                    disabled={isGenerating || isRenderingDocx}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    {isRenderingDocx ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    {isRenderingDocx ? "Renderizando..." : "Tentar renderizar DOCX novamente"}
                  </Button>
                ) : null}
                <Button
                  onClick={handleDownloadMd}
                  variant={docxBytes ? "outline" : "default"}
                  className={cn(
                    "w-full gap-2",
                    !docxBytes && "bg-success hover:bg-success/90"
                  )}
                >
                  <Download className="h-4 w-4" />
                  {docxBytes ? "Baixar Contrato (.md)" : "Baixar Contrato"}
                </Button>
                <Button
                  onClick={handleDownloadTxt}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Download className="h-4 w-4" />
                  Baixar Contrato (.txt)
                </Button>
                <Button
                  onClick={() => {
                    setIsGenerated(false);
                    setGeneratedContent(null);
                    setDownloadUrl(null);
                    setDocxHtml(null);
                    setDocxBytes(null);
                    setDocxFileName(null);
                    setDocxRenderError(null);
                    setEditMode(false);
                    setEditedContent(null);
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
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-success"
            >
              🎉 Contrato gerado com sucesso!
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* SendToSignature full-width abaixo do preview — fica apertado demais dentro da sidebar 1/3 */}
      {isGenerated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 max-w-4xl mx-auto"
        >
          {!editMode && editedContent !== null && editedContent !== generatedContent && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-3">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 dark:text-amber-300">
                Você editou o contrato. A versão editada (não o template original) será enviada para a Autentique.
              </p>
            </div>
          )}
          <SendToSignature
            contractName={contractData.template?.name || "Contrato"}
            contractContent={editedContent ?? generatedContent ?? ""}
            clientData={contractData.clientData}
            docxTemplate={
              editedContent != null && editedContent !== generatedContent
                ? undefined
                : contractData.template?.docxTemplate
            }
          />
        </motion.div>
      )}
    </div>
  );
}
