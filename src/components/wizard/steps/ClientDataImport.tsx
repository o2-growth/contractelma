import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, User, X, AlertCircle, RefreshCw, Building2, UserCircle, Phone, CreditCard, FileSignature, PenLine, Info, Eraser } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ClientData, Template } from "../ContractWizard";
import { availablePlaceholders } from "@/constants/contractTemplates";
import { cn } from "@/lib/utils";
import { ContractLivePreview } from "./ContractLivePreview";

interface ClientDataImportProps {
  clientData: ClientData;
  onChange: (data: ClientData) => void;
  selectedTemplate: Template | null;
}

// Variables that are auto-filled (not shown as fields)
const AUTO_FILLED_KEYS = new Set([
  "PRODUTOS",
]);

const CATEGORY_META: Record<string, { label: string; icon: React.ReactNode }> = {
  empresa: { label: "Empresa / Contratante", icon: <Building2 className="h-4 w-4" /> },
  representante: { label: "Representante Legal", icon: <UserCircle className="h-4 w-4" /> },
  contato: { label: "Contato", icon: <Phone className="h-4 w-4" /> },
  pagamento: { label: "Remuneração", icon: <CreditCard className="h-4 w-4" /> },
  contrato: { label: "Vigência e Termos", icon: <FileSignature className="h-4 w-4" /> },
  assinatura: { label: "Assinatura / Data", icon: <PenLine className="h-4 w-4" /> },
};

const CATEGORY_ORDER = ["empresa", "representante", "contato", "pagamento", "contrato", "assinatura"];

function extractTemplateVariables(templateContent: string | undefined): string[] {
  if (!templateContent) return [];
  const regex = /\{\{(\w+)\}\}/g;
  const keys = new Set<string>();
  let match;
  while ((match = regex.exec(templateContent)) !== null) {
    keys.add(match[1]);
  }
  return Array.from(keys);
}

// Valores padrão por template — preenche automaticamente campos comuns.
// O usuário pode sempre sobrescrever. Só aplica em campos vazios.
const MESES_PT = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

function getServicoDefault(templateId: string): string {
  const id = templateId.toLowerCase();
  if (id.includes("especialista")) return "Setup, licença de uso das plataformas Oxy e Gênio e atuação de Especialista O2 Inc.";
  if (id.includes("diagnostico")) return "Diagnóstico Estratégico";
  if (id.includes("cfo")) return "Setup e Assessoria de Gestão Financeira Recorrente, no modelo CFO AS A SERVICE";
  if (id.includes("saas-oxy-genio-modelo1") || id.includes("oxy-genio")) return "Setup e licença de uso das plataformas Oxy e Gênio";
  return "";
}

function getTemplateDefaults(template: Template | null): ClientData {
  if (!template) return {};
  const now = new Date();
  const dia = String(now.getDate()).padStart(2, "0");
  const mes = MESES_PT[now.getMonth()];
  const ano = String(now.getFullYear()).slice(-2);
  const dataCompleta = `${dia}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;

  return {
    // Data e assinatura
    dia,
    mes,
    ano,
    data_setup: dataCompleta,
    // Vigência padrão
    inicio_vigencia: "A partir da assinatura do presente instrumento.",
    prazo_vigencia: "12 (doze) meses",
    dias_rescisao: "30 (trinta)",
    dias_primeiro_pagamento: "30 (trinta)",
    // Descrição do serviço por template
    servico: getServicoDefault(template.id),
  };
}

interface ExtractedField {
  value: string;
  confidence: "high" | "medium" | "low";
}

type ExtractedFields = Record<string, ExtractedField>;

// Simple inline validations
function validateField(key: string, value: string): string | null {
  if (!value) return null;
  if (key === "CNPJ" && !/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/.test(value.replace(/\s/g, ""))) {
    return "Formato: XX.XXX.XXX/XXXX-XX";
  }
  if ((key === "CPF_REPRESENTANTE" || key === "CPF") && !/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(value.replace(/\s/g, ""))) {
    return "Formato: XXX.XXX.XXX-XX";
  }
  if (key.includes("EMAIL") && value.length > 3 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "E-mail inválido";
  }
  return null;
}

export function ClientDataImport({ clientData, onChange, selectedTemplate }: ClientDataImportProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [extractedFields, setExtractedFields] = useState<ExtractedFields | null>(null);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Aplica defaults só uma vez por template (evita sobrescrever quando o usuário já alterou)
  const defaultsAppliedFor = useRef<string | null>(null);
  useEffect(() => {
    if (!selectedTemplate?.id) return;
    if (defaultsAppliedFor.current === selectedTemplate.id) return;

    const defaults = getTemplateDefaults(selectedTemplate);
    const newData: ClientData = { ...clientData };
    let hasChanges = false;
    for (const [key, defaultValue] of Object.entries(defaults)) {
      if (!defaultValue) continue;
      if (!newData[key] || newData[key].trim().length === 0) {
        newData[key] = defaultValue;
        hasChanges = true;
      }
    }
    defaultsAppliedFor.current = selectedTemplate.id;
    if (hasChanges) onChange(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate?.id]);

  // Derive dynamic fields from the selected template
  const dynamicFields = useMemo(() => {
    const templateKeys = extractTemplateVariables(selectedTemplate?.content);
    const filteredKeys = templateKeys.filter((k) => !AUTO_FILLED_KEYS.has(k));

    const placeholderMap = new Map(availablePlaceholders.map((p) => [p.key, p]));

    return filteredKeys.map((key) => {
      const ph = placeholderMap.get(key);
      return {
        key,
        label: ph?.label || key.replace(/_/g, " "),
        category: ph?.category || "contrato",
        tooltip: ph?.tooltip,
      };
    });
  }, [selectedTemplate]);

  // Group fields by category
  const groupedFields = useMemo(() => {
    const groups: Record<string, typeof dynamicFields> = {};
    for (const field of dynamicFields) {
      if (!groups[field.category]) groups[field.category] = [];
      groups[field.category].push(field);
    }
    return CATEGORY_ORDER
      .filter((cat) => groups[cat]?.length)
      .map((cat) => ({ category: cat, fields: groups[cat] }));
  }, [dynamicFields]);

  // Progress calculation
  const filledCount = useMemo(() => {
    return dynamicFields.filter((f) => (clientData[f.key] || "").length > 0).length;
  }, [dynamicFields, clientData]);
  const totalFields = dynamicFields.length;
  const progressPct = totalFields > 0 ? Math.round((filledCount / totalFields) * 100) : 0;

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const extractTextFromFile = async (file: File): Promise<string> => {
    return await file.text();
  };

  const handleFile = async (file: File) => {
    setUploadedFile(file);
    setExtractionError(null);
    setShowForm(true);
    await extractDataFromDocument(file);
  };

  const extractDataFromDocument = async (file: File) => {
    setIsExtracting(true);
    setExtractionError(null);

    try {
      const documentText = await extractTextFromFile(file);
      if (!documentText || documentText.length < 10) {
        throw new Error("Não foi possível extrair texto do documento. Tente outro arquivo ou preencha manualmente.");
      }

      const { data, error } = await supabase.functions.invoke("extract-client-data", {
        body: { documentText, documentType: file.type || file.name.split(".").pop() },
      });

      if (error) throw new Error(error.message || "Erro ao processar documento");
      if (!data.success) throw new Error(data.error || "Erro na extração de dados");

      const extracted = data.data as ExtractedFields;
      setExtractedFields(extracted);

      const newData: ClientData = { ...clientData };
      for (const [key, field] of Object.entries(extracted)) {
        const upperKey = key.toUpperCase();
        if (field.value) newData[upperKey] = field.value;
        if (field.value) newData[key] = field.value;
      }
      onChange(newData);

      toast.success("Dados extraídos com sucesso!", {
        description: `Confiança média: ${Math.round(data.confidenceScore * 100)}%`,
      });
    } catch (error) {
      console.error("Extraction error:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao extrair dados";
      setExtractionError(errorMessage);
      toast.error("Erro na extração", { description: errorMessage });
      setExtractedFields({} as ExtractedFields);
    } finally {
      setIsExtracting(false);
    }
  };

  const retryExtraction = () => {
    if (uploadedFile) extractDataFromDocument(uploadedFile);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setExtractedFields(null);
    setExtractionError(null);
    onChange({});
  };

  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...clientData, [key]: value });
  };

  const clearAllFields = () => {
    onChange({});
    toast.info("Campos limpos");
  };

  const getConfidenceBadge = (confidence: "high" | "medium" | "low") => {
    switch (confidence) {
      case "high": return <StatusBadge variant="success">Alta</StatusBadge>;
      case "medium": return <StatusBadge variant="warning">Média</StatusBadge>;
      case "low": return <StatusBadge variant="error">Baixa</StatusBadge>;
    }
  };

  const openManualEntry = () => {
    setShowForm(true);
    setExtractedFields({} as ExtractedFields);
  };

  const renderDynamicForm = () => {
    if (dynamicFields.length === 0) {
      return (
        <p className="text-muted-foreground text-sm py-4">
          Nenhum template selecionado ou o template não possui variáveis.
        </p>
      );
    }

    return (
      <TooltipProvider delayDuration={300}>
        <Accordion type="multiple" defaultValue={groupedFields.map((g) => g.category)} className="space-y-2">
          {groupedFields.map(({ category, fields }) => {
            const meta = CATEGORY_META[category] || { label: category, icon: null };
            const filledInCat = fields.filter((f) => (clientData[f.key] || "").length > 0).length;
            return (
              <AccordionItem key={category} value={category} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2 flex-1">
                    {meta.icon}
                    <span className="font-display font-semibold text-sm">{meta.label}</span>
                    <span className={cn(
                      "ml-auto mr-2 text-xs font-medium rounded-full px-2 py-0.5",
                      filledInCat === fields.length
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {filledInCat}/{fields.length}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3 sm:grid-cols-2 pb-2">
                    {fields.map(({ key, label, tooltip }) => {
                      const val = clientData[key] || "";
                      const error = validateField(key, val);
                      return (
                        <div key={key} className={cn("space-y-1.5", (key.includes("ENDERECO") || key === "RAZAO_SOCIAL" || key === "OBSERVACOES" || key === "DESCRICAO_SERVICOS") && "sm:col-span-2")}>
                          <div className="flex items-center gap-1.5">
                            <Label htmlFor={key} className="text-xs">{label}</Label>
                            {tooltip && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-[200px] text-xs">
                                  {tooltip}
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {extractedFields?.[key]?.confidence && getConfidenceBadge(extractedFields[key].confidence)}
                            {extractedFields?.[key.toLowerCase()]?.confidence && !extractedFields?.[key]?.confidence && getConfidenceBadge(extractedFields[key.toLowerCase()].confidence)}
                          </div>
                          <Input
                            id={key}
                            value={val}
                            onChange={(e) => handleFieldChange(key, e.target.value)}
                            placeholder={tooltip || `Digite ${label.toLowerCase()}`}
                            className={cn(
                              "h-9 text-sm",
                              (key === "CPF" || key.startsWith("CPF_") || key === "CNPJ") && "font-mono",
                              error && "border-destructive focus-visible:ring-destructive"
                            )}
                          />
                          {error && (
                            <p className="text-[11px] text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {error}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </TooltipProvider>
    );
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-xl border border-border">
      {/* Left panel: Form */}
      <ResizablePanel defaultSize={35} minSize={25}>
        <div className="h-full overflow-y-auto p-5">
          <div className="mb-4">
            <h2 className="font-display text-xl font-bold text-foreground">
              Dados do Contrato
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Preencha os campos ou faça upload de um documento
            </p>
          </div>

          {!showForm ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Upload area */}
              <div
                className={cn("upload-area", isDragOver && "dragover")}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-3 font-display text-base font-semibold text-foreground">
                  Arraste o documento do cliente
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  A IA extrai automaticamente os dados (PDF, DOCX, TXT, imagens)
                </p>
              </div>

              <div className="mt-5 text-center">
                <Button variant="outline" onClick={openManualEntry} className="gap-2">
                  <User className="h-4 w-4" />
                  Preencher Manualmente
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Progress bar */}
              {totalFields > 0 && (
                <div className="mb-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {filledCount} de {totalFields} campos preenchidos
                    </span>
                    <span className={cn(
                      "font-semibold",
                      progressPct === 100 ? "text-emerald-600" : "text-foreground"
                    )}>
                      {progressPct}%
                    </span>
                  </div>
                  <Progress value={progressPct} className="h-2" />
                </div>
              )}

              {/* File info bar */}
              {uploadedFile && (
                <div className="mb-4 rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-6 w-6 text-primary" />
                      <div>
                        <p className="truncate text-sm font-medium text-foreground">{uploadedFile.name}</p>
                        <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {extractionError && (
                        <Button variant="outline" size="sm" onClick={retryExtraction} className="gap-1 h-7 text-xs">
                          <RefreshCw className="h-3 w-3" />
                          Tentar
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={removeFile} className="h-7 w-7 p-0">
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  {extractionError && (
                    <div className="mt-2 flex items-start gap-1.5 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>{extractionError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Top actions */}
              <div className="mb-3 flex items-center justify-between">
                {!uploadedFile && (
                  <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setExtractedFields(null); }} className="h-7 text-xs gap-1">
                    <Upload className="h-3 w-3" />
                    Upload
                  </Button>
                )}
                {filledCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFields} className="h-7 text-xs gap-1 ml-auto text-muted-foreground hover:text-destructive">
                    <Eraser className="h-3 w-3" />
                    Limpar
                  </Button>
                )}
              </div>

              {/* Loading skeleton */}
              {isExtracting ? (
                <div className="space-y-3 rounded-lg border border-border bg-card p-5">
                  <h3 className="font-display text-sm font-semibold text-foreground">Analisando documento com IA...</h3>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="h-3 w-16 animate-shimmer rounded" />
                      <div className="h-9 w-full animate-shimmer rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                renderDynamicForm()
              )}
            </motion.div>
          )}
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Right panel: Live preview */}
      <ResizablePanel defaultSize={65} minSize={35}>
        <ContractLivePreview template={selectedTemplate} clientData={clientData} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
