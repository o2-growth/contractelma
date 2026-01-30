import { useState } from "react";
import { motion } from "framer-motion";
import { Download, ArrowLeft, FileText, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ContractData } from "../ContractWizard";
import { cn } from "@/lib/utils";

interface ContractPreviewProps {
  contractData: ContractData;
}

export function ContractPreview({ contractData }: ContractPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const totalGeral = contractData.products.reduce((sum, p) => sum + p.total, 0);

  const handleGenerate = (format: "docx" | "pdf") => {
    setIsGenerating(true);
    
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 2000);
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

          {/* Download buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => handleGenerate("docx")}
              disabled={isGenerating}
              className={cn(
                "w-full gap-2",
                isGenerated && "bg-success hover:bg-success/90"
              )}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isGenerated ? (
                <Check className="h-4 w-4" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isGenerated ? "Contrato Gerado!" : "Baixar DOCX"}
            </Button>

            <Button
              onClick={() => handleGenerate("pdf")}
              disabled={isGenerating}
              variant="outline"
              className="w-full gap-2"
            >
              <Download className="h-4 w-4" />
              Baixar PDF
            </Button>
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
