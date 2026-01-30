import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, User, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
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

export function ClientDataImport({ clientData, onChange }: ClientDataImportProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [extractedFields, setExtractedFields] = useState<Record<string, ExtractedField> | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, []);

  const handleFile = (file: File) => {
    setUploadedFile(file);
    simulateExtraction();
  };

  const simulateExtraction = () => {
    setIsExtracting(true);
    
    // Simulate AI extraction
    setTimeout(() => {
      const mockExtracted: Record<string, ExtractedField> = {
        nome: { value: "João da Silva Santos", confidence: "high" },
        cpf: { value: "123.456.789-00", confidence: "high" },
        endereco: { value: "Rua das Flores, 123 - Centro", confidence: "medium" },
        telefone: { value: "(51) 99999-9999", confidence: "high" },
        email: { value: "joao.silva@email.com", confidence: "high" },
      };
      
      setExtractedFields(mockExtracted);
      onChange({
        nome: mockExtracted.nome.value,
        cpf: mockExtracted.cpf.value,
        endereco: mockExtracted.endereco.value,
        telefone: mockExtracted.telefone.value,
        email: mockExtracted.email.value,
      });
      setIsExtracting(false);
    }, 2000);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setExtractedFields(null);
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

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Dados do Cliente
        </h2>
        <p className="mt-1 text-muted-foreground">
          Faça upload de um documento ou preencha manualmente
        </p>
      </div>

      {!uploadedFile ? (
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
              accept=".pdf,.docx,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
              Arraste o documento aqui
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              ou clique para selecionar (PDF, DOCX, JPG, PNG)
            </p>
          </div>

          {/* Manual entry button */}
          <div className="mt-6 text-center">
            <Button 
              variant="outline" 
              onClick={() => setExtractedFields({} as Record<string, ExtractedField>)}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              Preencher Manualmente
            </Button>
          </div>
        </motion.div>
      ) : (
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
          </div>

          {/* Extracted data form */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-display font-semibold text-foreground">
              {isExtracting ? "Analisando documento..." : "Dados Extraídos"}
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
                      {extractedFields?.[key] && getConfidenceBadge(extractedFields[key].confidence)}
                    </div>
                    <Input
                      id={key}
                      value={clientData[key as keyof ClientData]}
                      onChange={(e) => handleFieldChange(key as keyof ClientData, e.target.value)}
                      className={cn(
                        key === "cpf" && "font-mono"
                      )}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Manual form (when no file uploaded but button clicked) */}
      {!uploadedFile && extractedFields !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 font-display font-semibold text-foreground">
            Preencha os dados do cliente
          </h3>
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
