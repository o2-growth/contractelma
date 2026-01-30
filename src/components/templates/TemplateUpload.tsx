import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  X,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import * as mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface DetectedField {
  key: string;
  originalValue: string;
  confidence: number;
}

interface AnalysisResult {
  content: string;
  detectedFields: DetectedField[];
  structureInfo: {
    paragraphs: number;
    clauses: number;
    hasSignatureBlock: boolean;
  };
}

interface TemplateUploadProps {
  onAnalysisComplete: (result: AnalysisResult, fileName: string) => void;
  onCancel: () => void;
}

type UploadState = "idle" | "uploading" | "extracting" | "analyzing" | "complete" | "error";

export function TemplateUpload({ onAnalysisComplete, onCancel }: TemplateUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const extractTextFromFile = async (file: File): Promise<string> => {
    // For text files, read directly
    if (file.type === "text/plain") {
      return await file.text();
    }

    const arrayBuffer = await file.arrayBuffer();

    // For DOCX, use mammoth
    if (file.type.includes("word") || file.name.endsWith(".docx") || file.name.endsWith(".doc")) {
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    }

    // For PDF, use pdf.js
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n\n";
      }
      
      return fullText;
    }

    throw new Error("Formato de arquivo não suportado");
  };

  const analyzeTemplate = async (text: string, name: string): Promise<AnalysisResult> => {
    const { data, error } = await supabase.functions.invoke("analyze-template", {
      body: {
        documentText: text,
        documentName: name,
      },
    });

    if (error) {
      throw new Error(error.message || "Erro ao analisar template");
    }

    if (data.error) {
      throw new Error(data.error);
    }

    return data as AnalysisResult;
  };

  const processFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setError(null);
    setUploadState("uploading");
    setProgress(10);

    try {
      // Step 1: Upload/read file
      setProgress(20);
      
      // Step 2: Extract text
      setUploadState("extracting");
      setProgress(40);
      const extractedText = await extractTextFromFile(file);
      
      if (!extractedText || extractedText.trim().length < 50) {
        throw new Error("Não foi possível extrair texto suficiente do documento");
      }
      
      setProgress(60);

      // Step 3: Analyze with AI
      setUploadState("analyzing");
      setProgress(75);
      const result = await analyzeTemplate(extractedText, file.name);
      
      setProgress(100);
      setAnalysisResult(result);
      setUploadState("complete");

    } catch (err) {
      console.error("Error processing file:", err);
      setError(err instanceof Error ? err.message : "Erro ao processar arquivo");
      setUploadState("error");
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleContinue = () => {
    if (analysisResult) {
      onAnalysisComplete(analysisResult, fileName);
    }
  };

  const handleRetry = () => {
    setUploadState("idle");
    setProgress(0);
    setError(null);
    setAnalysisResult(null);
    setFileName("");
  };

  const getStateMessage = () => {
    switch (uploadState) {
      case "uploading":
        return "Carregando arquivo...";
      case "extracting":
        return "Extraindo texto do documento...";
      case "analyzing":
        return "IA analisando estrutura e campos...";
      case "complete":
        return "Análise concluída!";
      case "error":
        return "Erro na análise";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Upload de Modelo
          </h2>
          <p className="mt-1 text-muted-foreground">
            Envie um documento para análise automática por IA
          </p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
      </div>

      <div className="mx-auto max-w-2xl">
        <AnimatePresence mode="wait">
          {uploadState === "idle" ? (
            <motion.div
              key="upload-zone"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  "relative rounded-xl border-2 border-dashed p-12 text-center transition-all duration-300",
                  dragActive
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-border bg-card hover:border-primary/50 hover:bg-muted/30"
                )}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileInput}
                  className="absolute inset-0 z-10 cursor-pointer opacity-0"
                />

                <div className="flex flex-col items-center gap-4">
                  <div className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full transition-colors",
                    dragActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    <Upload className="h-8 w-8" />
                  </div>

                  <div>
                    <p className="font-medium text-foreground">
                      {dragActive ? "Solte o arquivo aqui" : "Arraste seu modelo aqui"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      ou clique para selecionar
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2">
                    {[".docx", ".doc", ".pdf", ".txt"].map((ext) => (
                      <span
                        key={ext}
                        className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {ext}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info box */}
              <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex gap-3">
                  <Sparkles className="h-5 w-5 shrink-0 text-primary" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">
                      Análise inteligente por IA
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      A IA irá identificar automaticamente campos como CLIENTE, CNPJ, 
                      valores, datas e endereços, convertendo-os em placeholders dinâmicos.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-xl border border-border bg-card p-8"
            >
              {/* File info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{fileName}</p>
                  <p className="text-sm text-muted-foreground">{getStateMessage()}</p>
                </div>
                {uploadState === "complete" && (
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                )}
                {uploadState === "error" && (
                  <AlertCircle className="h-6 w-6 text-destructive" />
                )}
              </div>

              {/* Progress */}
              {(uploadState !== "complete" && uploadState !== "error") && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{getStateMessage()}</span>
                  </div>
                </div>
              )}

              {/* Error state */}
              {uploadState === "error" && (
                <div className="mt-4">
                  <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                    {error}
                  </div>
                  <Button className="mt-4 w-full" variant="outline" onClick={handleRetry}>
                    Tentar novamente
                  </Button>
                </div>
              )}

              {/* Success state */}
              {uploadState === "complete" && analysisResult && (
                <div className="mt-6 space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {analysisResult.detectedFields.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Campos detectados</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {analysisResult.structureInfo.paragraphs}
                      </p>
                      <p className="text-xs text-muted-foreground">Parágrafos</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {analysisResult.structureInfo.clauses}
                      </p>
                      <p className="text-xs text-muted-foreground">Cláusulas</p>
                    </div>
                  </div>

                  {/* Detected fields preview */}
                  {analysisResult.detectedFields.length > 0 && (
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <p className="text-sm font-medium text-foreground mb-3">
                        Campos identificados:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.detectedFields.slice(0, 8).map((field, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                          >
                            {`{{${field.key}}}`}
                          </span>
                        ))}
                        {analysisResult.detectedFields.length > 8 && (
                          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                            +{analysisResult.detectedFields.length - 8} mais
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={handleRetry}>
                      Enviar outro arquivo
                    </Button>
                    <Button className="flex-1 gap-2" onClick={handleContinue}>
                      Continuar para edição
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
