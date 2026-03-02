import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Loader2, AlertCircle, Send } from "lucide-react";
import { SendToSignature } from "./SendToSignature";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ContractData } from "../ContractWizard";
import { cn } from "@/lib/utils";

interface ContractPreviewProps {
  contractData: ContractData;
}

export function ContractPreview({ contractData }: ContractPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateContractLocally = () => {
    const template = contractData.template?.content || getDefaultTemplate();
    return replacePlaceholders(template, contractData);
  };

  const getDefaultTemplate = () => `# CONTRATO DE PRESTAÇÃO DE SERVIÇOS

## CONTRATANTE
**Nome:** {{NOME}}
**CPF:** {{CPF}}
**Endereço:** {{ENDERECO}}
**Telefone:** {{TELEFONE}}
**E-mail:** {{EMAIL}}

---

## DATA E ASSINATURA

{{DATA}}

_______________________________
**Contratante:** {{NOME}}
CPF: {{CPF}}

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
      const content = generateContractLocally();
      setGeneratedContent(content);
      setDownloadUrl("local");
      setIsGenerated(true);
      toast.success("Contrato gerado com sucesso!", {
        description: "Clique em baixar para salvar o arquivo.",
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

  const handleDownload = () => {
    if (!downloadUrl || !generatedContent) return;

    const blob = new Blob([generatedContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `contrato_${(contractData.clientData.CLIENTE || contractData.clientData.nome || "cliente").replace(/\s+/g, "_")}_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Download iniciado!");
  };

  const clientName = contractData.clientData.CLIENTE || contractData.clientData.nome || "[NOME DO CLIENTE]";
  const clientDoc = contractData.clientData.CNPJ || contractData.clientData.CPF || "[CNPJ/CPF]";
  const clientAddress = contractData.clientData.ENDERECO_COMPLETO || contractData.clientData.ENDERECO_EMPRESA || "[ENDEREÇO]";

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

          <div className="p-8 max-h-[600px] overflow-y-auto">
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
                , com sede/domicílio em{" "}
                <span className="rounded bg-highlight px-1">
                  {clientAddress}
                </span>
                , doravante denominado CONTRATANTE...
              </p>

              {/* Display all filled client data */}
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
            </div>
          </div>
        </motion.div>

        {/* Sidebar summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">
              Resumo
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-muted-foreground">Cliente:</span>
                <p className="font-medium text-foreground">
                  {contractData.clientData.CLIENTE || contractData.clientData.nome || "-"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Template:</span>
                <p className="font-medium text-foreground">
                  {contractData.template?.name || "-"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Campos preenchidos:</span>
                <p className="font-medium text-foreground">
                  {Object.values(contractData.clientData).filter(v => v.length > 0).length}
                </p>
              </div>
            </div>
          </div>

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

          <div className="space-y-3">
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
                <Button
                  onClick={handleDownload}
                  className={cn("w-full gap-2", "bg-success hover:bg-success/90")}
                >
                  <Download className="h-4 w-4" />
                  Baixar Contrato
                </Button>
                <Button
                  onClick={() => {
                    setIsGenerated(false);
                    setGeneratedContent(null);
                    setDownloadUrl(null);
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
              />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
