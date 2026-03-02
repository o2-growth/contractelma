import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, User, X, AlertCircle, RefreshCw, Building2, UserCircle, Phone, CreditCard, FileSignature, PenLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
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
  "DATA", "PRODUTOS", "VALOR_TOTAL", "FORMA_PAGAMENTO", "OBSERVACOES", "PARCELAS",
]);

const CATEGORY_META: Record<string, { label: string; icon: React.ReactNode }> = {
  empresa: { label: "Empresa", icon: <Building2 className="h-4 w-4" /> },
  representante: { label: "Representante Legal", icon: <UserCircle className="h-4 w-4" /> },
  contato: { label: "Contato", icon: <Phone className="h-4 w-4" /> },
  pagamento: { label: "Pagamento", icon: <CreditCard className="h-4 w-4" /> },
  contrato: { label: "Contrato", icon: <FileSignature className="h-4 w-4" /> },
  assinatura: { label: "Assinatura / Testemunhas", icon: <PenLine className="h-4 w-4" /> },
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

interface ExtractedField {
  value: string;
  confidence: "high" | "medium" | "low";
}

type ExtractedFields = Record<string, ExtractedField>;

export function ClientDataImport({ clientData, onChange, selectedTemplate }: ClientDataImportProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [extractedFields, setExtractedFields] = useState<ExtractedFields | null>(null);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      return await file.text();
    }
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

      // Map extracted values to clientData
      const newData: ClientData = { ...clientData };
      for (const [key, field] of Object.entries(extracted)) {
        const upperKey = key.toUpperCase();
        if (field.value) newData[upperKey] = field.value;
        // Also set lowercase version for backwards compat
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

  // Render grouped fields form
  const renderDynamicForm = () => {
    if (dynamicFields.length === 0) {
      return (
        <p className="text-muted-foreground text-sm py-4">
          Nenhum template selecionado ou o template não possui variáveis.
        </p>
      );
    }

    return (
      <Accordion type="multiple" defaultValue={groupedFields.map((g) => g.category)} className="space-y-2">
        {groupedFields.map(({ category, fields }) => {
          const meta = CATEGORY_META[category] || { label: category, icon: null };
          return (
            <AccordionItem key={category} value={category} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  {meta.icon}
                  <span className="font-display font-semibold">{meta.label}</span>
                  <span className="text-xs text-muted-foreground">({fields.length})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 sm:grid-cols-2 pb-2">
                  {fields.map(({ key, label }) => (
                    <div key={key} className={cn("space-y-2", (key.includes("ENDERECO") || key === "CLIENTE") && "sm:col-span-2")}>
                      <div className="flex items-center justify-between">
                        <Label htmlFor={key}>{label}</Label>
                        {extractedFields?.[key]?.confidence && getConfidenceBadge(extractedFields[key].confidence)}
                        {extractedFields?.[key.toLowerCase()]?.confidence && !extractedFields?.[key]?.confidence && getConfidenceBadge(extractedFields[key.toLowerCase()].confidence)}
                      </div>
                      <Input
                        id={key}
                        value={clientData[key] || ""}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        placeholder={`Digite ${label.toLowerCase()}`}
                        className={cn((key === "CPF" || key.startsWith("CPF_")) && "font-mono")}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    );
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-xl border border-border">
      {/* Left panel: Form */}
      <ResizablePanel defaultSize={50} minSize={35}>
        <div className="h-full overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Dados do Contrato
            </h2>
            <p className="mt-1 text-muted-foreground">
              Preencha os campos necessários ou faça upload de um documento
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
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  Arraste o documento do cliente aqui
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  A IA vai extrair automaticamente os dados (PDF, DOCX, TXT, imagens)
                </p>
              </div>

              {/* Manual entry button */}
              <div className="mt-6 text-center">
                <Button variant="outline" onClick={openManualEntry} className="gap-2">
                  <User className="h-4 w-4" />
                  Preencher Manualmente
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* File info bar */}
              {uploadedFile && (
                <div className="mb-6 rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="truncate font-medium text-foreground">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {extractionError && (
                        <Button variant="outline" size="sm" onClick={retryExtraction} className="gap-2">
                          <RefreshCw className="h-4 w-4" />
                          Tentar Novamente
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={removeFile}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {extractionError && (
                    <div className="mt-3 flex items-start gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{extractionError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Back to upload */}
              {!uploadedFile && (
                <div className="mb-4 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setExtractedFields(null); }}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload de documento
                  </Button>
                </div>
              )}

              {/* Loading skeleton */}
              {isExtracting ? (
                <div className="space-y-4 rounded-xl border border-border bg-card p-6">
                  <h3 className="font-display font-semibold text-foreground">Analisando documento com IA...</h3>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-20 animate-shimmer rounded" />
                      <div className="h-10 w-full animate-shimmer rounded" />
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
      <ResizablePanel defaultSize={50} minSize={30}>
        <ContractLivePreview template={selectedTemplate} clientData={clientData} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
