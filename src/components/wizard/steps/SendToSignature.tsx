import { useEffect, useId, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Mail,
  User,
  Clock,
  X,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type SignerAction =
  | "SIGN"
  | "APPROVE"
  | "RECOGNIZE"
  | "SIGN_AS_A_PARTY"
  | "RECEIPT";

interface Signer {
  name: string;
  email: string;
  action: SignerAction;
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
  clientData?: Record<string, string>;
  docxTemplate?: string;
}

const ACTION_META: Record<
  SignerAction,
  { label: string; description: string; badge: string }
> = {
  SIGN: {
    label: "Assinar",
    description: "Assinatura eletrônica padrão",
    badge: "bg-primary/10 text-primary border-primary/20",
  },
  APPROVE: {
    label: "Aprovar",
    description: "Aprovação sem assinar o documento",
    badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  RECOGNIZE: {
    label: "Testemunhar",
    description: "Reconhecer como testemunha",
    badge: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  SIGN_AS_A_PARTY: {
    label: "Assinar como parte",
    description: "Parte contratante do documento",
    badge: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  },
  RECEIPT: {
    label: "Acusar recebimento",
    description: "Apenas confirma o recebimento",
    badge: "bg-muted text-muted-foreground border-border",
  },
};

const LOADING_MESSAGES = [
  "Renderizando DOCX...",
  "Enviando para Autentique...",
  "Aguardando confirmação...",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email: string) => EMAIL_REGEX.test(email.trim());

const getInitial = (name: string, email: string) => {
  const source = (name || email || "?").trim();
  return source.charAt(0).toUpperCase() || "?";
};

export function SendToSignature({
  contractName,
  contractContent,
  clientData,
  docxTemplate,
}: SendToSignatureProps) {
  const navigate = useNavigate();
  const baseId = useId();

  const [signers, setSigners] = useState<Signer[]>([
    { name: "", email: "", action: "SIGN" },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [attemptedSend, setAttemptedSend] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [result, setResult] = useState<DocumentResult | null>(null);
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);

  // Suggested signer from clientData
  const suggestion = useMemo(() => {
    if (!clientData) return null;
    const name =
      clientData.NOME_REPRESENTANTE ||
      clientData.nome_representante ||
      clientData.nome ||
      clientData.NOME ||
      "";
    const email =
      clientData.EMAIL_REPRESENTANTE ||
      clientData.email_representante ||
      clientData.email ||
      clientData.EMAIL ||
      "";
    if (!name.trim() || !email.trim() || !isValidEmail(email)) return null;
    return { name: name.trim(), email: email.trim() };
  }, [clientData]);

  const suggestionAlreadyApplied = useMemo(() => {
    if (!suggestion) return false;
    return signers.some(
      (s) => s.email.trim().toLowerCase() === suggestion.email.toLowerCase(),
    );
  }, [signers, suggestion]);

  const showSuggestion =
    suggestion && !suggestionDismissed && !suggestionAlreadyApplied;

  // Rotating loading message
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!isSending) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setLoadingMsgIdx(0);
      return;
    }
    intervalRef.current = setInterval(() => {
      setLoadingMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1800);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSending]);

  const addSigner = () => {
    setSigners((prev) => [...prev, { name: "", email: "", action: "SIGN" }]);
  };

  const removeSigner = (index: number) => {
    if (signers.length <= 1) return;
    setSigners((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSigner = <K extends keyof Signer>(
    index: number,
    field: K,
    value: Signer[K],
  ) => {
    setSigners((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  const applySuggestion = () => {
    if (!suggestion) return;
    setSigners((prev) => {
      const next = [...prev];
      next[0] = {
        ...next[0],
        name: suggestion.name,
        email: suggestion.email,
      };
      return next;
    });
    setSuggestionDismissed(true);
    toast.success("Signatário adicionado");
  };

  const allValid = signers.every(
    (s) => isValidEmail(s.email) && s.name.trim().length > 0,
  );

  const handleConfirmSend = async () => {
    setAttemptedSend(true);
    if (!allValid) {
      toast.error("Verifique os dados dos signatários");
      return;
    }
    setConfirmOpen(false);
    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "send-to-autentique",
        {
          body: {
            contractName,
            contractContent,
            signers,
            clientData,
            docxTemplate,
          },
        },
      );

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

  // -------- Success state --------
  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-4"
      >
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                  delay: 0.1,
                }}
                className="rounded-full bg-emerald-500/15 p-2"
              >
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </motion.div>
              <div className="flex-1">
                <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400">
                  Enviado para assinatura!
                </CardTitle>
                <CardDescription className="mt-1">
                  Documento{" "}
                  <span className="font-medium text-foreground">
                    {result.name}
                  </span>{" "}
                  com {result.signatures.length} signatário(s) notificado(s) por
                  email.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Signatários</CardTitle>
            <CardDescription>
              Aguardando confirmação. Você pode copiar ou abrir o link de
              assinatura de cada um.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                    <th className="px-4 py-2 text-left font-medium">
                      Signatário
                    </th>
                    <th className="px-4 py-2 text-left font-medium">Ação</th>
                    <th className="px-4 py-2 text-right font-medium">Links</th>
                  </tr>
                </thead>
                <tbody>
                  {result.signatures.map((sig, idx) => (
                    <motion.tr
                      key={sig.public_id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + idx * 0.05 }}
                      className="border-t border-border"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-amber-600">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">Pendente</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-xs font-semibold text-primary-foreground">
                              {getInitial(sig.name, sig.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {sig.name || sig.email}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {sig.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="font-normal">
                          {sig.action?.name || "—"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          {sig.link?.short_link && (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => copyLink(sig.link.short_link)}
                                aria-label="Copiar link"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                asChild
                                aria-label="Abrir link"
                              >
                                <a
                                  href={sig.link.short_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                variant="outline"
                onClick={() => navigate("/history")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar à listagem de contratos
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // -------- Form state --------
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Send className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">Enviar para Assinatura</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Assinatura digital criptografada e com validade jurídica via{" "}
              <span className="font-medium text-foreground">Autentique</span>.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Suggestion banner */}
        <AnimatePresence>
          {showSuggestion && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex w-full items-center gap-3 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-3"
            >
              <Sparkles className="h-4 w-4 shrink-0 text-primary" />
              <div className="flex-1 text-sm">
                <span className="text-muted-foreground">
                  Quer adicionar{" "}
                </span>
                <span className="font-medium text-foreground">
                  {suggestion!.name}
                </span>{" "}
                <span className="text-muted-foreground">
                  ({suggestion!.email}) ao primeiro slot de signatário?
                </span>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={applySuggestion}
                className="shrink-0 gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Adicionar este contato
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <button
                type="button"
                onClick={() => setSuggestionDismissed(true)}
                className="rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground"
                aria-label="Dispensar sugestão"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Signers */}
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {signers.map((signer, index) => {
              const nameId = `${baseId}-name-${index}`;
              const emailId = `${baseId}-email-${index}`;
              const actionId = `${baseId}-action-${index}`;
              const emailValid = isValidEmail(signer.email);
              const emailEmpty = signer.email.trim().length === 0;
              const emailErrored =
                attemptedSend && (emailEmpty || !emailValid);
              const showInvalidIcon =
                !emailEmpty && !emailValid;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="group relative rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Card header */}
                  <div className="mb-3 flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-sm font-semibold text-primary-foreground">
                        {getInitial(signer.name, signer.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        Signatário {index + 1}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {signer.name || "Sem nome ainda"}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={ACTION_META[signer.action].badge}
                    >
                      {ACTION_META[signer.action].label}
                    </Badge>
                    {signers.length > 1 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 focus:opacity-100"
                        onClick={() => removeSigner(index)}
                        aria-label={`Remover signatário ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor={nameId}
                        className="flex items-center gap-1.5 text-xs"
                      >
                        <User className="h-3 w-3 text-muted-foreground" />
                        Nome
                      </Label>
                      <Input
                        id={nameId}
                        placeholder="Nome completo"
                        value={signer.name}
                        onChange={(e) =>
                          updateSigner(index, "name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor={emailId}
                        className="flex items-center gap-1.5 text-xs"
                      >
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        Email
                      </Label>
                      <div className="relative">
                        <Input
                          id={emailId}
                          type="email"
                          placeholder="email@exemplo.com"
                          value={signer.email}
                          aria-invalid={emailErrored || showInvalidIcon}
                          aria-describedby={
                            emailErrored ? `${emailId}-error` : undefined
                          }
                          onChange={(e) =>
                            updateSigner(index, "email", e.target.value)
                          }
                          className={
                            emailErrored
                              ? "border-destructive pr-9 focus-visible:ring-destructive"
                              : "pr-9"
                          }
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                          {emailEmpty && attemptedSend ? (
                            <X className="h-4 w-4 text-destructive" />
                          ) : emailValid ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : showInvalidIcon ? (
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                          ) : null}
                        </div>
                      </div>
                      {emailErrored && (
                        <p
                          id={`${emailId}-error`}
                          className="text-xs text-destructive"
                        >
                          {emailEmpty
                            ? "Email obrigatório"
                            : "Email inválido"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    <Label htmlFor={actionId} className="text-xs">
                      Ação no documento
                    </Label>
                    <Select
                      value={signer.action}
                      onValueChange={(val) =>
                        updateSigner(index, "action", val as SignerAction)
                      }
                    >
                      <SelectTrigger id={actionId}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(ACTION_META) as SignerAction[]).map(
                          (value) => (
                            <SelectItem key={value} value={value}>
                              <div className="flex flex-col py-0.5">
                                <span className="text-sm font-medium">
                                  {ACTION_META[value].label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {ACTION_META[value].description}
                                </span>
                              </div>
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={addSigner}
          className="gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Adicionar signatário
        </Button>

        {/* Submit + confirmation */}
        <div className="border-t border-border pt-4">
          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button
                disabled={isSending}
                onClick={(e) => {
                  setAttemptedSend(true);
                  if (!allValid) {
                    e.preventDefault();
                    toast.error("Preencha nome e email válidos para todos");
                    return;
                  }
                }}
                className="w-full gap-2"
                size="lg"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={loadingMsgIdx}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                      >
                        {LOADING_MESSAGES[loadingMsgIdx]}
                      </motion.span>
                    </AnimatePresence>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Enviar para Assinatura Digital
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Confirmar envio
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-3 pt-1">
                    <p>
                      Você está prestes a enviar{" "}
                      <span className="font-semibold text-foreground">
                        1 contrato
                      </span>{" "}
                      para{" "}
                      <span className="font-semibold text-foreground">
                        {signers.length} signatário(s)
                      </span>{" "}
                      via Autentique. Esta ação não pode ser desfeita.
                    </p>
                    <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-amber-700 dark:text-amber-400">
                      <p className="flex items-center gap-2 text-xs font-medium">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Esta ação não pode ser desfeita.
                      </p>
                    </div>
                    <ul className="space-y-1 text-xs">
                      {signers.map((s, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground" />
                          {s.name} &lt;{s.email}&gt; —{" "}
                          {ACTION_META[s.action].label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmSend}>
                  Sim, enviar agora
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
