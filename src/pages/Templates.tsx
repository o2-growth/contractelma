import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { FileText, Plus, MoreVertical, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TemplateEditor } from "@/components/templates/TemplateEditor";
import { TemplateUpload } from "@/components/templates/TemplateUpload";
import { TemplateCreationChoice } from "@/components/templates/TemplateCreationChoice";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { defaultTemplates } from "@/constants/contractTemplates";

interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  placeholders: number;
  createdAt: string;
  usageCount: number;
  isSystem?: boolean;
}

interface AnalysisResult {
  content: string;
  detectedFields: Array<{ key: string; originalValue: string; confidence: number }>;
  structureInfo: {
    paragraphs: number;
    clauses: number;
    hasSignatureBlock: boolean;
  };
}

// Convert system templates to display format
const systemTemplates: Template[] = defaultTemplates.map((t) => ({
  id: t.id,
  name: t.name,
  description: t.description,
  content: t.content || "",
  placeholders: (t.content?.match(/{{[^}]+}}/g) || []).length,
  createdAt: t.createdAt,
  usageCount: 0,
  isSystem: true,
}));

type ViewMode = "list" | "choice" | "upload" | "editor";

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>(systemTemplates);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [preloadedContent, setPreloadedContent] = useState<string>("");
  const [preloadedName, setPreloadedName] = useState<string>("");
  const [detectedFields, setDetectedFields] = useState<AnalysisResult["detectedFields"]>([]);

  useEffect(() => {
    loadUserTemplates();
  }, []);

  const loadUserTemplates = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data, error } = await supabase
          .from("templates")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          const userTemplates: Template[] = data.map((t) => ({
            id: t.id,
            name: t.name,
            description: t.description || "",
            content: t.content,
            placeholders: (t.content?.match(/{{[^}]+}}/g) || []).length,
            createdAt: new Date(t.created_at).toLocaleDateString("pt-BR"),
            usageCount: 0,
            isSystem: false,
          }));
          // User templates first, then system templates
          setTemplates([...userTemplates, ...systemTemplates]);
        }
      }
    } catch (error) {
      console.error("Error loading templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setPreloadedContent("");
    setPreloadedName("");
    setDetectedFields([]);
    setViewMode("choice");
  };

  const handleChooseUpload = () => {
    setViewMode("upload");
  };

  const handleChooseCreate = () => {
    setViewMode("editor");
  };

  const handleUploadComplete = (result: AnalysisResult, fileName: string) => {
    // Extract base name from file
    const baseName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    const capitalizedName = baseName.charAt(0).toUpperCase() + baseName.slice(1);
    
    setPreloadedContent(result.content);
    setPreloadedName(capitalizedName);
    setDetectedFields(result.detectedFields);
    setViewMode("editor");
    
    toast.success(`${result.detectedFields.length} campos identificados pela IA`);
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setPreloadedContent(template.content);
    setPreloadedName(template.name);
    setDetectedFields([]);
    setViewMode("editor");
  };

  const handleDelete = async (template: Template) => {
    if (template.isSystem) {
      toast.error("Templates do sistema não podem ser excluídos");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("templates")
        .delete()
        .eq("id", template.id);

      if (error) throw error;
      
      setTemplates(templates.filter(t => t.id !== template.id));
      toast.success("Template excluído com sucesso");
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Erro ao excluir template");
    }
  };

  const handleSave = async (name: string, content: string) => {
    const placeholderCount = (content.match(/{{[^}]+}}/g) || []).length;
    const description = `Template com ${placeholderCount} campos dinâmicos`;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (editingTemplate && !editingTemplate.isSystem) {
        // Update existing user template
        const { error } = await supabase
          .from("templates")
          .update({
            name,
            content,
            description,
          })
          .eq("id", editingTemplate.id);

        if (error) throw error;

        setTemplates(templates.map(t => 
          t.id === editingTemplate.id 
            ? { ...t, name, content, placeholders: placeholderCount, description }
            : t
        ));
        toast.success("Template atualizado com sucesso");
      } else if (session) {
        // Create new template in database
        const { data, error } = await supabase
          .from("templates")
          .insert({
            name,
            content,
            description,
            user_id: session.user.id,
          })
          .select()
          .single();

        if (error) throw error;

        const newTemplate: Template = {
          id: data.id,
          name: data.name,
          content: data.content,
          description: data.description || "",
          placeholders: placeholderCount,
          createdAt: new Date(data.created_at).toLocaleDateString("pt-BR"),
          usageCount: 0,
          isSystem: false,
        };
        setTemplates([newTemplate, ...templates]);
        toast.success("Template criado com sucesso");
      } else {
        // Create local template (not logged in)
        const newTemplate: Template = {
          id: Date.now().toString(),
          name,
          content,
          description,
          placeholders: placeholderCount,
          createdAt: "Agora",
          usageCount: 0,
        };
        setTemplates([newTemplate, ...templates]);
        toast.success("Template criado com sucesso (local)");
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Erro ao salvar template");
    }
    
    setViewMode("list");
    setEditingTemplate(null);
    setPreloadedContent("");
    setPreloadedName("");
    setDetectedFields([]);
  };

  const handleCancel = () => {
    setViewMode("list");
    setEditingTemplate(null);
    setPreloadedContent("");
    setPreloadedName("");
    setDetectedFields([]);
  };

  // Render based on view mode
  if (viewMode === "choice") {
    return (
      <AppLayout>
        <div className="animate-fade-in">
          <TemplateCreationChoice
            onChooseUpload={handleChooseUpload}
            onChooseCreate={handleChooseCreate}
            onCancel={handleCancel}
          />
        </div>
      </AppLayout>
    );
  }

  if (viewMode === "upload") {
    return (
      <AppLayout>
        <div className="animate-fade-in">
          <TemplateUpload
            onAnalysisComplete={handleUploadComplete}
            onCancel={handleCancel}
          />
        </div>
      </AppLayout>
    );
  }

  if (viewMode === "editor") {
    return (
      <AppLayout>
        <div className="animate-fade-in">
          <TemplateEditor
            initialName={preloadedName || editingTemplate?.name}
            initialContent={preloadedContent || editingTemplate?.content}
            detectedFields={detectedFields}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Templates
            </h1>
            <p className="mt-1 text-muted-foreground">
              {templates.length} modelos disponíveis ({systemTemplates.length} do sistema)
            </p>
          </div>
          <Button className="gap-2" onClick={handleCreateNew}>
            <Plus className="h-4 w-4" />
            Novo Template
          </Button>
        </div>

        {/* Template grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.filter(Boolean).map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.5) }}
              className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-normal hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(template)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDelete(template)}
                      disabled={template.isSystem}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {template.isSystem ? "Modelo do sistema" : "Excluir"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3 className="mt-4 font-display text-lg font-semibold text-card-foreground">
                {template.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {template.description}
              </p>

              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span>{template.placeholders} campos</span>
                {template.isSystem && (
                  <>
                    <span>•</span>
                    <span className="text-primary font-medium">Sistema</span>
                  </>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">
                  {template.createdAt}
                </span>
                <Button variant="outline" size="sm" onClick={() => handleEdit(template)}>
                  {template.isSystem ? "Visualizar" : "Editar"}
                </Button>
              </div>
            </motion.div>
          ))}

          {/* Create new template card */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(templates.length * 0.05, 0.5) }}
            onClick={handleCreateNew}
            className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 p-6 text-muted-foreground transition-all duration-normal hover:border-primary hover:bg-primary/5 hover:text-primary"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-current border-dashed">
              <Plus className="h-6 w-6" />
            </div>
            <span className="font-medium">Criar Template</span>
            <span className="mt-1 text-sm">Com placeholders dinâmicos</span>
          </motion.button>
        </div>
      </div>
    </AppLayout>
  );
}
