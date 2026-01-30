import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const totalGeral = contractData.products.reduce((sum, p) => sum + p.total, 0);

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

  const formatCurrencyForTemplate = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const generateProductsTable = () => {
    if (contractData.products.length === 0) return "";
    
    let table = "\n| Item | Quantidade | Valor Unit. | Desconto | Total |\n";
    table += "|------|-----------|-------------|----------|-------|\n";
    
    contractData.products.forEach((product) => {
      table += `| ${product.name} | ${product.quantity} | ${formatCurrencyForTemplate(product.unitPrice)} | ${product.discount}% | ${formatCurrencyForTemplate(product.total)} |\n`;
    });
    
    const total = contractData.products.reduce((sum, p) => sum + p.total, 0);
    table += `| **TOTAL** | | | | **${formatCurrencyForTemplate(total)}** |\n`;
    
    return table;
  };

  const replacePlaceholders = (template: string, data: ContractData) => {
    const totalValue = data.products.reduce((sum, p) => sum + p.total, 0);
    const productsTable = generateProductsTable();
    
    const replacements: Record<string, string> = {
      "{{cliente}}": data.clientData.nome || "",
      "{{CLIENTE}}": data.clientData.nome || "",
      "{{nome}}": data.clientData.nome || "",
      "{{NOME}}": data.clientData.nome || "",
      "{{cpf}}": data.clientData.cpf || "",
      "{{CPF}}": data.clientData.cpf || "",
      "{{endereco}}": data.clientData.endereco || "",
      "{{ENDERECO}}": data.clientData.endereco || "",
      "{{telefone}}": data.clientData.telefone || "",
      "{{TELEFONE}}": data.clientData.telefone || "",
      "{{email}}": data.clientData.email || "",
      "{{EMAIL}}": data.clientData.email || "",
      "{{produtos}}": productsTable,
      "{{PRODUTOS}}": productsTable,
      "{{valor_total}}": formatCurrencyForTemplate(totalValue),
      "{{VALOR_TOTAL}}": formatCurrencyForTemplate(totalValue),
      "{{forma_pagamento}}": data.paymentTerms || "",
      "{{FORMA_PAGAMENTO}}": data.paymentTerms || "",
      "{{observacoes}}": data.specialNotes || "",
      "{{OBSERVACOES}}": data.specialNotes || "",
      "{{data}}": formatDate(new Date()),
      "{{DATA}}": formatDate(new Date()),
    };
    
    let result = template;
    for (const [placeholder, value] of Object.entries(replacements)) {
      result = result.split(placeholder).join(value);
    }
    
    return result;
  };

  const handleGenerate = async (_format: "docx" | "pdf" | "both") => {
    setIsGenerating(true);
    setError(null);

    try {
      // Generate contract locally - no auth required
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
    link.download = `contrato_${contractData.clientData.nome.replace(/\s+/g, "_")}_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Download iniciado!");
  };

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
        {/* Contract preview */}
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
                  {contractData.clientData.nome || "[NOME DO CLIENTE]"}
                </span>
                , inscrito no CPF sob o nº{" "}
                <span className="rounded bg-highlight px-1 font-mono">
                  {contractData.clientData.cpf || "[CPF]"}
                </span>
                , residente e domiciliado em{" "}
                <span className="rounded bg-highlight px-1">
                  {contractData.clientData.endereco || "[ENDEREÇO]"}
                </span>
                , telefone{" "}
                <span className="rounded bg-highlight px-1 font-mono">
                  {contractData.clientData.telefone || "[TELEFONE]"}
                </span>
                , e-mail{" "}
                <span className="rounded bg-highlight px-1">
                  {contractData.clientData.email || "[E-MAIL]"}
                </span>
                , doravante denominado CONTRATANTE...
              </p>

              <h2 className="mt-8 font-display text-lg font-semibold">
                Cláusula 2ª - Do Objeto
              </h2>

              {contractData.products.length > 0 && (
                <div className="my-4 rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium">Item</th>
                        <th className="px-4 py-2 text-center font-medium">Qtd</th>
                        <th className="px-4 py-2 text-right font-medium">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {contractData.products.map((product, i) => (
                        <tr key={product.id} className={i % 2 === 1 ? "bg-muted/30" : ""}>
                          <td className="px-4 py-2">{product.name}</td>
                          <td className="px-4 py-2 text-center">{product.quantity}</td>
                          <td className="px-4 py-2 text-right font-mono">
                            {formatCurrency(product.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t-2 border-border bg-muted">
                      <tr>
                        <td colSpan={2} className="px-4 py-2 font-semibold">Total</td>
                        <td className="px-4 py-2 text-right font-mono font-bold">
                          <span className="rounded bg-highlight px-1">
                            {formatCurrency(totalGeral)}
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              <h2 className="mt-8 font-display text-lg font-semibold">
                Cláusula 3ª - Do Pagamento
              </h2>
              
              {contractData.paymentTerms && (
                <p className="rounded bg-highlight/50 p-2">
                  {contractData.paymentTerms}
                </p>
              )}

              {contractData.specialNotes && (
                <>
                  <h2 className="mt-8 font-display text-lg font-semibold">
                    Observações
                  </h2>
                  <p className="rounded bg-highlight/50 p-2">
                    {contractData.specialNotes}
                  </p>
                </>
              )}
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
          {/* Summary card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">
              Resumo
            </h3>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-muted-foreground">Cliente:</span>
                <p className="font-medium text-foreground">
                  {contractData.clientData.nome || "-"}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground">Template:</span>
                <p className="font-medium text-foreground">
                  {contractData.template?.name || "-"}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground">Produtos:</span>
                <p className="font-medium text-foreground">
                  {contractData.products.length} itens
                </p>
              </div>

              <div className="border-t border-border pt-4">
                <span className="text-muted-foreground">Total:</span>
                <p className="font-mono text-2xl font-bold text-foreground">
                  {formatCurrency(totalGeral)}
                </p>
              </div>
            </div>
          </div>

          {/* Error state */}
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

          {/* Download buttons */}
          <div className="space-y-3">
            {!isGenerated ? (
              <Button
                onClick={() => handleGenerate("both")}
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
    </div>
  );
}
