import { motion } from "framer-motion";
import { Upload, FileEdit, X, Sparkles, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplateCreationChoiceProps {
  onChooseUpload: () => void;
  onChooseCreate: () => void;
  onCancel: () => void;
}

export function TemplateCreationChoice({
  onChooseUpload,
  onChooseCreate,
  onCancel,
}: TemplateCreationChoiceProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Novo Template
          </h2>
          <p className="mt-1 text-muted-foreground">
            Escolha como deseja criar seu modelo de contrato
          </p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
      </div>

      {/* Options */}
      <div className="mx-auto max-w-3xl">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Upload option */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={onChooseUpload}
            className="group relative overflow-hidden rounded-xl border-2 border-border bg-card p-8 text-left transition-all duration-300 hover:border-primary hover:shadow-lg"
          >
            {/* Gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
            
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Upload className="h-7 w-7" />
              </div>

              <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                Upload de Modelo
              </h3>
              
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Envie um documento Word ou PDF existente e deixe a IA identificar 
                automaticamente os campos para placeholders.
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Análise inteligente por IA
              </div>

              {/* Supported formats */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {[".docx", ".doc", ".pdf", ".txt"].map((ext) => (
                  <span
                    key={ext}
                    className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </div>
          </motion.button>

          {/* Create from scratch option */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onChooseCreate}
            className="group relative overflow-hidden rounded-xl border-2 border-border bg-card p-8 text-left transition-all duration-300 hover:border-primary hover:shadow-lg"
          >
            {/* Gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
            
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <FileEdit className="h-7 w-7" />
              </div>

              <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                Criar do Zero
              </h3>
              
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Escreva seu modelo de contrato diretamente no editor, 
                inserindo os placeholders manualmente.
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs font-medium text-primary">
                <Pencil className="h-4 w-4" />
                Controle total do conteúdo
              </div>

              {/* Features */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["Editor visual", "Placeholders", "Preview"].map((feature) => (
                  <span
                    key={feature}
                    className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </motion.button>
        </div>

        {/* Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 rounded-lg border border-border bg-muted/30 p-4 text-center"
        >
          <p className="text-sm text-muted-foreground">
            💡 <strong>Dica:</strong> Se você já tem um contrato modelo, use o upload 
            para economizar tempo. A IA identificará os campos automaticamente!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
