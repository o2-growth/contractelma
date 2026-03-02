import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Plus, Trash2, Loader2, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Signer {
  name: string;
  email: string;
  action: "SIGN" | "APPROVE" | "RECOGNIZE" | "SIGN_AS_A_PARTY" | "RECEIPT";
}

interface SignatureResult {
  public_id: string;
  name: string;
  email: string;
  action: { name: string };
  link: { short_link: string };
}

interface DocumentResult {
  id: string;
  name: string;
  signatures: SignatureResult[];
}

interface SendToSignatureProps {
  contractName: string;
  contractContent: string;
}

const ACTION_LABELS: Record<string, string> = {
  SIGN: "Assinar",
  APPROVE: "Aprovar",
  RECOGNIZE: "Testemunhar",
  SIGN_AS_A_PARTY: "Assinar como parte",
  RECEIPT: "Acusar recebimento",
};

export function SendToSignature({ contractName, contractContent }: SendToSignatureProps) {
  const [signers, setSigners] = useState<Signer[]>([
    { name: "", email: "", action: "SIGN" },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<DocumentResult | null>(null);

  const addSigner = () => {
    setSigners((prev) => [...prev, { name: "", email: "", action: "SIGN" }]);
  };

  const removeSigner = (index: number) => {
    if (signers.length <= 1) return;
    setSigners((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSigner = (index: number, field: keyof Signer, value: string) => {
    setSigners((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const canSend = signers.every((s) => s.email.includes("@"));

  const handleSend = async () => {
    if (!canSend) return;
    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-to-autentique", {
        body: {
          contractName,
          contractContent,
          signers,
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Erro desconhecido");

      setResult(data.document);
      toast.success("Contrato enviado para assinatura!", {
        description: `${data.document.signatures.length} signatário(s) notificado(s)`,
      });
    } catch (err) {
      console.error("Send error:", err);
      toast.error("Erro ao enviar para assinatura", {
        description: err instanceof Error ? err.message : "Tente novamente",
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copiado!");
  };

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-success/30 bg-success/5 p-6 space-y-4"
      >
        <div className="flex items-center gap-2 text-success">
          <CheckCircle2 className="h-5 w-5" />
          <h3 className="font-display font-semibold">Enviado para assinatura!</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Documento: <span className="font-medium text-foreground">{result.name}</span>
        </p>

        <div className="space-y-2">
          {result.signatures.map((sig) => (
            <div
              key={sig.public_id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
            >
              <div className="text-sm">
                <p className="font-medium">{sig.name || sig.email}</p>
                <p className="text-muted-foreground text-xs">
                  {sig.email} — {sig.action?.name}
                </p>
              </div>
              <div className="flex gap-1">
                {sig.link?.short_link && (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => copyLink(sig.link.short_link)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      asChild
                    >
                      <a href={sig.link.short_link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
        <Send className="h-4 w-4 text-primary" />
        Enviar para Assinatura
      </h3>
      <p className="text-sm text-muted-foreground">
        Adicione os signatários que receberão o contrato por email para assinar digitalmente via Autentique.
      </p>

      <div className="space-y-3">
        <AnimatePresence>
          {signers.map((signer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-end gap-2"
            >
              <div className="flex-1 space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Nome</label>
                <Input
                  placeholder="Nome do signatário"
                  value={signer.name}
                  onChange={(e) => updateSigner(index, "name", e.target.value)}
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Email *</label>
                <Input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={signer.email}
                  onChange={(e) => updateSigner(index, "email", e.target.value)}
                />
              </div>
              <div className="w-[160px] space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Ação</label>
                <Select
                  value={signer.action}
                  onValueChange={(val) => updateSigner(index, "action", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ACTION_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 text-muted-foreground hover:text-destructive"
                onClick={() => removeSigner(index)}
                disabled={signers.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Button variant="outline" size="sm" onClick={addSigner} className="gap-1">
        <Plus className="h-3.5 w-3.5" />
        Adicionar signatário
      </Button>

      <div className="pt-2">
        <Button
          onClick={handleSend}
          disabled={!canSend || isSending}
          className="w-full gap-2"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {isSending ? "Enviando..." : "Enviar para Assinatura Digital"}
        </Button>
      </div>
    </div>
  );
}
