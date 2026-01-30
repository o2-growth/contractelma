import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PaymentTermsProps {
  paymentTerms: string;
  specialNotes: string;
  onChange: (paymentTerms: string, specialNotes: string) => void;
}

const suggestions = [
  { label: "À vista -5%", text: "Pagamento à vista com 5% de desconto" },
  { label: "2x cartão", text: "Pagamento em 2 parcelas iguais no cartão de crédito" },
  { label: "30/60/90", text: "Pagamento em 3 parcelas via boleto, vencimentos em 30, 60 e 90 dias" },
  { label: "Entrada + 12x", text: "Entrada de 30% + 12 parcelas mensais" },
];

export function PaymentTerms({ paymentTerms, specialNotes, onChange }: PaymentTermsProps) {
  const insertSuggestion = (text: string) => {
    const newTerms = paymentTerms ? `${paymentTerms}\n${text}` : text;
    onChange(newTerms, specialNotes);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Condições de Pagamento
        </h2>
        <p className="mt-1 text-muted-foreground">
          Defina como o pagamento será realizado
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Payment terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="payment-terms">Forma de Pagamento</Label>
            <Textarea
              id="payment-terms"
              value={paymentTerms}
              onChange={(e) => onChange(e.target.value, specialNotes)}
              placeholder="Descreva as condições de pagamento..."
              className="min-h-[150px] resize-none"
            />
          </div>

          {/* Suggestions */}
          <div className="space-y-2">
            <Label>Sugestões rápidas:</Label>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.label}
                  onClick={() => insertSuggestion(suggestion.text)}
                  className={cn(
                    "rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground",
                    "transition-all duration-fast hover:border-primary hover:bg-primary/5 hover:text-primary",
                    "active:scale-95"
                  )}
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Special notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="special-notes">Observações Especiais</Label>
            <Textarea
              id="special-notes"
              value={specialNotes}
              onChange={(e) => onChange(paymentTerms, e.target.value)}
              placeholder="Adicione observações que devem constar no contrato..."
              className="min-h-[150px] resize-none"
            />
            <p className="text-sm text-muted-foreground">
              Informações adicionais como garantias, prazos de entrega, etc.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Preview */}
      {(paymentTerms || specialNotes) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 font-display font-semibold text-foreground">
            Preview no Contrato
          </h3>
          <div className="prose prose-sm max-w-none text-foreground">
            {paymentTerms && (
              <div className="mb-4">
                <strong>Forma de Pagamento:</strong>
                <p className="mt-1 whitespace-pre-wrap rounded bg-highlight/50 p-2">
                  {paymentTerms}
                </p>
              </div>
            )}
            {specialNotes && (
              <div>
                <strong>Observações:</strong>
                <p className="mt-1 whitespace-pre-wrap rounded bg-highlight/50 p-2">
                  {specialNotes}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
