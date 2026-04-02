import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText, Plus, Check, Loader2, Search,
  Briefcase, Monitor, Handshake, TrendingUp, GraduationCap, BarChart3, File
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Template } from "../ContractWizard";
import { defaultTemplates, templateCategories } from "@/constants/contractTemplates";

interface TemplateSelectionProps {
  selectedTemplate: Template | null;
  onSelect: (template: Template) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  cfo: <Briefcase className="h-6 w-6" />,
  saas: <Monitor className="h-6 w-6" />,
  parceria: <Handshake className="h-6 w-6" />,
  ma: <TrendingUp className="h-6 w-6" />,
  consultoria: <BarChart3 className="h-6 w-6" />,
  educacional: <GraduationCap className="h-6 w-6" />,
  generico: <File className="h-6 w-6" />,
};

function countPlaceholders(content?: string): number {
  if (!content) return 0;
  const matches = new Set<string>();
  const regex = /\{\{(\w+)\}\}/g;
  let m;
  while ((m = regex.exec(content)) !== null) matches.add(m[1]);
  // Exclude auto-filled ones
  const autoFilled = new Set(["DATA", "PRODUTOS"]);
  return Array.from(matches).filter((k) => !autoFilled.has(k)).length;
}

export function TemplateSelection({ selectedTemplate, onSelect }: TemplateSelectionProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return templates;
    const q = searchQuery.toLowerCase();
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.category && t.category.toLowerCase().includes(q))
    );
  }, [templates, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Selecione o Template do Contrato
          </h2>
          <p className="mt-1 text-muted-foreground">
            Escolha um modelo base para o seu contrato
          </p>
        </div>
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar template..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredTemplates.length === 0 && searchQuery && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">Nenhum template encontrado para "{searchQuery}"</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template, index) => {
          const isSelected = selectedTemplate?.id === template.id;
          const cat = template.category || "generico";
          const catMeta = templateCategories[cat];
          const icon = categoryIcons[cat] || <FileText className="h-6 w-6" />;
          const fieldCount = countPlaceholders(template.content);

          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => onSelect(template)}
                className={cn(
                  "group relative w-full rounded-xl border-2 bg-card p-5 text-left shadow-card transition-all duration-normal hover:shadow-card-hover",
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

                <div className="flex items-start justify-between gap-3">
                  {/* Icon */}
                  <div className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors duration-normal",
                    isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  )}>
                    {icon}
                  </div>

                  {/* Category badge */}
                  {catMeta && (
                    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider", catMeta.color)}>
                      {catMeta.label}
                    </span>
                  )}
                </div>

                {/* Content */}
                <h3 className="mt-3 font-display text-base font-semibold text-card-foreground leading-tight">
                  {template.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {template.description}
                </p>

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{template.createdAt}</span>
                  {fieldCount > 0 && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {fieldCount} campos
                    </Badge>
                  )}
                </div>
              </button>
            </motion.div>
          );
        })}

        {/* Create new template card */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: filteredTemplates.length * 0.05 }}
          >
            <button className="group flex h-full min-h-[180px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 p-6 text-muted-foreground transition-all duration-normal hover:border-primary hover:bg-primary/5 hover:text-primary">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg border-2 border-current border-dashed transition-colors duration-normal group-hover:border-solid group-hover:bg-primary/10">
                <Plus className="h-5 w-5" />
              </div>
              <span className="font-medium text-sm">Novo Template</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
