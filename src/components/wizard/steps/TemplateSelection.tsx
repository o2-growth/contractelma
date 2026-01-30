import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Plus, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import type { Template } from "../ContractWizard";
import { defaultTemplates } from "@/constants/contractTemplates";

interface TemplateSelectionProps {
  selectedTemplate: Template | null;
  onSelect: (template: Template) => void;
}

export function TemplateSelection({ selectedTemplate, onSelect }: TemplateSelectionProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data, error } = await supabase
          .from("templates")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error loading templates:", error);
          setTemplates(defaultTemplates);
        } else if (data && data.length > 0) {
          const mappedTemplates: Template[] = data.map((t) => ({
            id: t.id,
            name: t.name,
            description: t.description || "",
            createdAt: new Date(t.created_at).toLocaleDateString("pt-BR"),
            content: t.content,
          }));
          setTemplates(mappedTemplates);
        } else {
          setTemplates(defaultTemplates);
        }
      } else {
        setTemplates(defaultTemplates);
      }
    } catch (error) {
      console.error("Error:", error);
      setTemplates(defaultTemplates);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Selecione o Template do Contrato
        </h2>
        <p className="mt-1 text-muted-foreground">
          Escolha um modelo base para o seu contrato
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template, index) => {
          const isSelected = selectedTemplate?.id === template.id;
          
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => onSelect(template)}
                className={cn(
                  "group relative w-full rounded-xl border-2 bg-card p-6 text-left shadow-card transition-all duration-normal hover:shadow-card-hover",
                  isSelected
                    ? "border-primary ring-4 ring-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                )}

                {/* Icon */}
                <div className={cn(
                  "mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-normal",
                  isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                  <FileText className="h-6 w-6" />
                </div>

                {/* Content */}
                <h3 className="font-display text-lg font-semibold text-card-foreground">
                  {template.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {template.description}
                </p>

                {/* Footer */}
                <div className="mt-4 flex items-center text-xs text-muted-foreground">
                  <span>{template.createdAt}</span>
                </div>
              </button>
            </motion.div>
          );
        })}

        {/* Create new template card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: templates.length * 0.1 }}
        >
          <button className="group flex h-full min-h-[200px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 p-6 text-muted-foreground transition-all duration-normal hover:border-primary hover:bg-primary/5 hover:text-primary">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-current border-dashed transition-colors duration-normal group-hover:border-solid group-hover:bg-primary/10">
              <Plus className="h-6 w-6" />
            </div>
            <span className="font-medium">Novo Template</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
