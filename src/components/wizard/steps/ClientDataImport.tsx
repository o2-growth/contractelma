import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, User, X, AlertCircle, RefreshCw, Building2, UserCircle, Phone, CreditCard, FileSignature, PenLine, Info, Eraser, CalendarClock } from "lucide-react";
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
import {
  formatCPF,
  formatCNPJ,
  formatCEP,
  formatTelefone,
  formatBRL,
  formatBRLComExtenso,
  dataPorExtenso,
  parseValorBR,
  parseDateBR,
  buscarCep,
  montarEnderecoCompleto,
  isCpfField,
  isCnpjField,
  isCepField,
  isPhoneField,
  isCurrencyField,
  isDateField,
} from "@/lib/formatters/contractFormatters";

interface ClientDataImportProps {
  clientData: ClientData;
  onChange: (data: ClientData) => void;
  selectedTemplate: Template | null;
}

// Variables that are auto-filled (not shown as fields — derived from other inputs)
const AUTO_FILLED_KEYS = new Set([
  "PRODUTOS",
  "valor_extenso_setup",
  "valor_plataforma_extenso",
  "parcelas_valor_extenso",
  "data_assinatura_extenso",
  "DATA_EXTENSO",
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

// Simple inline validations — leniente, pois as máscaras já formatam no blur
function validateField(key: string, value: string): string | null {
  if (!value) return null;
  if (isCnpjField(key)) {
    const digits = value.replace(/\D/g, "");
    if (digits.length > 0 && digits.length !== 14) return "CNPJ deve ter 14 dígitos";
  }
  if (isCpfField(key)) {
    const digits = value.replace(/\D/g, "");
    if (digits.length > 0 && digits.length !== 11) return "CPF deve ter 11 dígitos";
  }
  if (isCepField(key)) {
    const digits = value.replace(/\D/g, "");
    if (digits.length > 0 && digits.length !== 8) return "CEP deve ter 8 dígitos";
  }
  if (/EMAIL|email/.test(key) && value.length > 3 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "E-mail inválido";
  }
  return null;
}

// Acha a melhor chave de ENDERECO no clientData (UPPER, lower, mixed)
function findEnderecoKey(clientData: Record<string, string>): string {
  const candidates = Object.keys(clientData).filter((k) => /endereco|endereço/i.test(k));
  if (candidates.length) return candidates[0];
  // Default — usa a primeira convenção encontrada nas keys, ou cria ENDERECO
  return "ENDERECO";
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

      // Aplica máscaras automáticas em valores extraídos pela IA
      const maskValue = (k: string, v: string): string => {
        if (!v) return v;
        if (isCpfField(k)) return formatCPF(v);
        if (isCnpjField(k)) return formatCNPJ(v);
        if (isCepField(k)) return formatCEP(v);
        if (isPhoneField(k)) return formatTelefone(v);
        if (isCurrencyField(k)) {
          const num = parseValorBR(v);
          return num > 0 ? formatBRL(num) : v;
        }
        return v;
      };

      const newData: ClientData = { ...clientData };
      for (const [key, field] of Object.entries(extracted)) {
        if (!field.value) continue;
        const upperKey = key.toUpperCase();
        const maskedUpper = maskValue(upperKey, field.value);
        const maskedLower = maskValue(key, field.value);
        newData[upperKey] = maskedUpper;
        newData[key] = maskedLower;
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
    // Máscaras "leves" durante a digitação — não atrapalham o usuário
    let next = value;
    if (isCpfField(key)) next = formatCPF(value);
    else if (isCnpjField(key)) next = formatCNPJ(value);
    else if (isCepField(key)) next = formatCEP(value);
    else if (isPhoneField(key)) next = formatTelefone(value);
    onChange({ ...clientData, [key]: next });
  };

  // No blur: aplica máscara "pesada" (BRL) e dispara ações como busca de CEP
  const handleFieldBlur = useCallback(
    async (key: string, value: string) => {
      if (!value) return;

      // First-match-wins: data / documento / telefone NUNCA caem em currency
      if (isDateField(key) || isCpfField(key) || isCnpjField(key) || isPhoneField(key)) {
        // máscaras já aplicadas em onChange — nada a fazer no blur
        return;
      }

      // BRL: só formata no blur pra não atrapalhar digitação
      if (isCurrencyField(key)) {
        const num = parseValorBR(value);
        if (num > 0) {
          const formatted = formatBRL(num);
          if (formatted !== value) {
            onChange({ ...clientData, [key]: formatted });
          }
        }
        return;
      }

      // CEP: busca endereço via ViaCEP quando temos 8 dígitos
      if (isCepField(key)) {
        const digits = value.replace(/\D/g, "");
        if (digits.length === 8) {
          try {
            const via = await buscarCep(digits);
            if (via) {
              const enderecoKey = findEnderecoKey(clientData);
              const numero = clientData.NUMERO || clientData.numero || "";
              const complemento = clientData.COMPLEMENTO || clientData.complemento || "";
              const enderecoCompleto = montarEnderecoCompleto(via, numero, complemento);
              const updated: ClientData = { ...clientData, [key]: formatCEP(digits) };
              // Só preenche se o campo de endereço estiver vazio (não sobrescreve usuário)
              if (!updated[enderecoKey] || updated[enderecoKey].trim().length === 0) {
                updated[enderecoKey] = enderecoCompleto;
              }
              onChange(updated);
              toast.success("Endereço encontrado", { description: enderecoCompleto });
            }
          } catch (e) {
            // silencioso — usuário pode digitar manualmente
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clientData, onChange]
  );

  // Preenche dia/mes/ano com a data de hoje
  const usarDataDeHoje = useCallback(() => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mes = MESES_PT[now.getMonth()];
    const yyyy = String(now.getFullYear());
    const yy = yyyy.slice(-2);
    const updated: ClientData = { ...clientData };
    // Cobre tanto convenções minúsculas quanto maiúsculas
    if ("dia" in clientData || updated.dia !== undefined) updated.dia = dd;
    if ("DIA" in clientData) updated.DIA = dd;
    if ("mes" in clientData || updated.mes !== undefined) updated.mes = mes;
    if ("MES" in clientData) updated.MES = mes;
    if ("ano" in clientData || updated.ano !== undefined) updated.ano = yy;
    if ("ANO" in clientData) updated.ANO = yyyy;
    // Se nenhum campo existir ainda, cria os 3 lowercase
    if (
      updated.dia === undefined && updated.DIA === undefined &&
      updated.mes === undefined && updated.MES === undefined &&
      updated.ano === undefined && updated.ANO === undefined
    ) {
      updated.dia = dd;
      updated.mes = mes;
      updated.ano = yy;
    }
    onChange(updated);
    toast.success("Data de hoje preenchida");
  }, [clientData, onChange]);

  // Preview da data de assinatura (dia + mes + ano)
  const dataAssinaturaPreview = useMemo(() => {
    const dia = parseInt(clientData.dia || clientData.DIA || "", 10);
    const mes = (clientData.mes || clientData.MES || "").toLowerCase();
    const anoRaw = (clientData.ano || clientData.ANO || "").trim();
    if (!dia || !mes || !anoRaw) return null;
    let ano = parseInt(anoRaw, 10);
    if (!Number.isNaN(ano) && ano < 100) ano += 2000;
    const mesIdx = MESES_PT.indexOf(mes);
    if (mesIdx < 0 || Number.isNaN(ano)) return null;
    const diaStr = dia === 1 ? "1º" : String(dia);
    return `${diaStr} de ${MESES_PT[mesIdx]} de ${ano}`;
  }, [clientData]);

  // Warning: assinatura anterior ao início da vigência
  const assinaturaAnteriorVigencia = useMemo(() => {
    const dia = parseInt(clientData.dia || clientData.DIA || "", 10);
    const mes = (clientData.mes || clientData.MES || "").toLowerCase();
    const anoRaw = (clientData.ano || clientData.ANO || "").trim();
    if (!dia || !mes || !anoRaw) return false;
    let ano = parseInt(anoRaw, 10);
    if (!Number.isNaN(ano) && ano < 100) ano += 2000;
    const mesIdx = MESES_PT.indexOf(mes);
    if (mesIdx < 0 || Number.isNaN(ano)) return false;
    const dtAssinatura = new Date(ano, mesIdx, dia);
    const inicioVig = parseDateBR(clientData.inicio_vigencia || clientData.INICIO_VIGENCIA || "");
    if (!inicioVig) return false;
    return dtAssinatura.getTime() < inicioVig.getTime();
  }, [clientData]);

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
                  {category === "assinatura" && (
                    <>
                      <div className="mb-3 flex items-center justify-between gap-2 rounded-md bg-muted/40 px-3 py-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={usarDataDeHoje}
                          className="h-7 text-xs gap-1"
                        >
                          <CalendarClock className="h-3 w-3" />
                          Usar data de hoje
                        </Button>
                        {dataAssinaturaPreview && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                            {dataAssinaturaPreview}
                          </span>
                        )}
                      </div>
                      {assinaturaAnteriorVigencia && (
                        <div className="mb-3 flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <span className="text-[11px]">
                            ⚠ A data de assinatura é anterior ao início da vigência — confirme.
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2 pb-2">
                    {fields.map(({ key, label, tooltip }) => {
                      const val = clientData[key] || "";
                      const error = validateField(key, val);
                      const isCurrency = isCurrencyField(key);
                      const isDate = isDateField(key);
                      const currencyHelper = isCurrency && val ? formatBRLComExtenso(val) : "";
                      const dateExtenso = isDate && val ? dataPorExtenso(val) : "";
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
                            onBlur={(e) => handleFieldBlur(key, e.target.value)}
                            placeholder={tooltip || `Digite ${label.toLowerCase()}`}
                            className={cn(
                              "h-9 text-sm",
                              (isCpfField(key) || isCnpjField(key) || isCepField(key) || isPhoneField(key)) && "font-mono",
                              error && "border-destructive focus-visible:ring-destructive"
                            )}
                          />
                          {error && (
                            <p className="text-[11px] text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {error}
                            </p>
                          )}
                          {!error && currencyHelper && (
                            <p className="text-[11px] text-muted-foreground">{currencyHelper}</p>
                          )}
                          {!error && dateExtenso && (
                            <p className="text-[11px] text-muted-foreground">(por extenso: {dateExtenso})</p>
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
                    Voltar ao upload
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
