import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, User, X, AlertCircle, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ClientData } from "../ContractWizard";
import { cn } from "@/lib/utils";

interface ClientDataImportProps {
  clientData: ClientData;
  onChange: (data: ClientData) => void;
}

interface ExtractedField {
  value: string;
  confidence: "high" | "medium" | "low";
}

type ExtractedFields = Record<string, ExtractedField>;

export function ClientDataImport({ clientData, onChange }: ClientDataImportProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [extractedFields, setExtractedFields] = useState<ExtractedFields | null>(null);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, []);

  const extractTextFromFile = async (file: File): Promise<string> => {
    // For text-based files, read directly
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      return await file.text();
    }
    
    // For PDFs and other files, we'll use a simple text extraction
    // In production, you'd want to use a proper PDF parser
    const text = await file.text();
    return text;
  };

  const handleFile = async (file: File) => {
    setUploadedFile(file);
    setExtractionError(null);
    await extractDataFromDocument(file);
  };

  const extractDataFromDocument = async (file: File) => {
    setIsExtracting(true);
    setExtractionError(null);

    try {
      // Extract text from the file
      const documentText = await extractTextFromFile(file);
      
      if (!documentText || documentText.length < 10) {
        throw new Error("Não foi possível extrair texto do documento. Tente outro arquivo ou preencha manualmente.");
      }

      // Call the edge function
      const { data, error } = await supabase.functions.invoke("extract-client-data", {
        body: {
          documentText,
          documentType: file.type || file.name.split(".").pop(),
        },
      });

      if (error) {
        throw new Error(error.message || "Erro ao processar documento");
      }

      if (!data.success) {
        throw new Error(data.error || "Erro na extração de dados");
      }

      const extracted = data.data as ExtractedFields;
      setExtractedFields(extracted);
      
      // Update client data with extracted values
      onChange({
        nome: extracted.nome?.value || "",
        cpf: extracted.cpf?.value || "",
        endereco: extracted.endereco?.value || "",
        telefone: extracted.telefone?.value || "",
        email: extracted.email?.value || "",
      });

      toast.success("Dados extraídos com sucesso!", {
        description: `Confiança média: ${Math.round(data.confidenceScore * 100)}%`,
      });
    } catch (error) {
      console.error("Extraction error:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao extrair dados";
      setExtractionError(errorMessage);
      toast.error("Erro na extração", { description: errorMessage });
      
      // Allow manual entry even after error
      setExtractedFields({} as ExtractedFields);
    } finally {
      setIsExtracting(false);
    }
  };

  const retryExtraction = () => {
    if (uploadedFile) {
      extractDataFromDocument(uploadedFile);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setExtractedFields(null);
    setExtractionError(null);
    onChange({
      nome: "",
      cpf: "",
      endereco: "",
      telefone: "",
      email: "",
    });
  };

  const handleFieldChange = (field: keyof ClientData, value: string) => {
    onChange({ ...clientData, [field]: value });
  };

  const getConfidenceBadge = (confidence: "high" | "medium" | "low") => {
    switch (confidence) {
      case "high":
        return <StatusBadge variant="success">Alta</StatusBadge>;
      case "medium":
        return <StatusBadge variant="warning">Média</StatusBadge>;
      case "low":
        return <StatusBadge variant="error">Baixa</StatusBadge>;
    }
  };

  const openManualEntry = () => {
    setExtractedFields({} as ExtractedFields);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Dados do Cliente
        </h2>
        <p className="mt-1 text-muted-foreground">
          Faça upload de um documento para extração automática com IA ou preencha manualmente
        </p>
      </div>

      {!uploadedFile && extractedFields === null ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Upload area */}
          <div
            className={cn(
              "upload-area",
              isDragOver && "dragover"
            )}
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
            <Button 
              variant="outline" 
              onClick={openManualEntry}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              Preencher Manualmente
            </Button>
          </div>
        </motion.div>
      ) : uploadedFile ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-8 lg:grid-cols-2"
        >
          {/* Document preview */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display font-semibold text-foreground">Documento</h3>
              <Button variant="ghost" size="sm" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
              <FileText className="h-10 w-10 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-foreground">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            {/* Error state */}
            {extractionError && (
              <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-destructive font-medium">Erro na extração</p>
                    <p className="text-sm text-muted-foreground mt-1">{extractionError}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={retryExtraction}
                      className="mt-2 gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Tentar Novamente
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Extracted data form */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-display font-semibold text-foreground">
              {isExtracting ? "Analisando documento com IA..." : "Dados Extraídos"}
            </h3>

            {isExtracting ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-20 animate-shimmer rounded" />
                    <div className="h-10 w-full animate-shimmer rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { key: "nome", label: "Nome Completo" },
                  { key: "cpf", label: "CPF" },
                  { key: "endereco", label: "Endereço" },
                  { key: "telefone", label: "Telefone" },
                  { key: "email", label: "E-mail" },
                ].map(({ key, label }) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Label htmlFor={key}>{label}</Label>
                      {extractedFields?.[key] && extractedFields[key].confidence && 
                        getConfidenceBadge(extractedFields[key].confidence)
                      }
                    </div>
                    <Input
                      id={key}
                      value={clientData[key as keyof ClientData]}
                      onChange={(e) => handleFieldChange(key as keyof ClientData, e.target.value)}
                      placeholder={`Digite o ${label.toLowerCase()}`}
                      className={cn(key === "cpf" && "font-mono")}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ) : null}

      {/* Manual form (when no file uploaded but button clicked) */}
      {!uploadedFile && extractedFields !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground">
              Preencha os dados do cliente
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setExtractedFields(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: "nome", label: "Nome Completo", span: true },
              { key: "cpf", label: "CPF" },
              { key: "telefone", label: "Telefone" },
              { key: "endereco", label: "Endereço", span: true },
              { key: "email", label: "E-mail", span: true },
            ].map(({ key, label, span }) => (
              <div key={key} className={cn("space-y-2", span && "sm:col-span-2")}>
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  value={clientData[key as keyof ClientData]}
                  onChange={(e) => handleFieldChange(key as keyof ClientData, e.target.value)}
                  placeholder={`Digite o ${label.toLowerCase()}`}
                  className={cn(key === "cpf" && "font-mono")}
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
