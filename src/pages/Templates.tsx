import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { FileText, Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TemplateEditor } from "@/components/templates/TemplateEditor";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  placeholders: number;
  createdAt: string;
  usageCount: number;
}

const initialTemplates: Template[] = [
  {
    id: "1",
    name: "Contrato Padrão",
    description: "Contrato de prestação de serviços com cláusulas padrão para a maioria das situações",
    content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS

Pelo presente instrumento particular, {{nome}}, inscrito no CPF sob o nº {{cpf}}, residente e domiciliado em {{endereco}}, telefone {{telefone}}, e-mail {{email}}, doravante denominado CONTRATANTE, e de outro lado a empresa XYZ Ltda., doravante denominada CONTRATADA, têm entre si justo e acordado o seguinte:

CLÁUSULA 1ª - DO OBJETO
O presente contrato tem por objeto a prestação dos seguintes serviços:
{{produtos}}

CLÁUSULA 2ª - DO VALOR
O valor total deste contrato é de {{valor_total}}.

CLÁUSULA 3ª - DO PRAZO
Este contrato tem início na data de sua assinatura e vigorará pelo período acordado entre as partes.

Data: {{data}}`,
    placeholders: 8,
    createdAt: "10 dias atrás",
    usageCount: 24,
  },
  {
    id: "2",
    name: "Contrato Premium",
    description: "Contrato completo com termos avançados, garantias e cláusulas especiais",
    content: `CONTRATO PREMIUM DE PRESTAÇÃO DE SERVIÇOS

CONTRATANTE: {{nome}}
CPF: {{cpf}}
Endereço: {{endereco}}
Telefone: {{telefone}}
E-mail: {{email}}

CLÁUSULA 1ª - DO OBJETO
{{produtos}}

CLÁUSULA 2ª - DO VALOR E PAGAMENTO
Valor Total: {{valor_total}}

Data: {{data}}`,
    placeholders: 12,
    createdAt: "5 dias atrás",
    usageCount: 15,
  },
  {
    id: "3",
    name: "Contrato Simplificado",
    description: "Versão resumida para negociações rápidas e clientes recorrentes",
    content: `CONTRATO SIMPLIFICADO

Cliente: {{nome}} (CPF: {{cpf}})
Serviços: {{produtos}}
Valor: {{valor_total}}
Data: {{data}}`,
    placeholders: 5,
    createdAt: "3 dias atrás",
    usageCount: 8,
  },
];

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setIsEditing(true);
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setIsEditing(true);
  };

  const handleDelete = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    toast.success("Template excluído com sucesso");
  };

  const handleSave = (name: string, content: string) => {
    const placeholderCount = (content.match(/{{[^}]+}}/g) || []).length;
    
    if (editingTemplate) {
      // Update existing
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id 
          ? { 
              ...t, 
              name, 
              content, 
              placeholders: placeholderCount,
              description: `Template com ${placeholderCount} campos dinâmicos`
            }
          : t
      ));
      toast.success("Template atualizado com sucesso");
    } else {
      // Create new
      const newTemplate: Template = {
        id: Date.now().toString(),
        name,
        content,
        description: `Template com ${placeholderCount} campos dinâmicos`,
        placeholders: placeholderCount,
        createdAt: "Agora",
        usageCount: 0,
      };
      setTemplates([newTemplate, ...templates]);
      toast.success("Template criado com sucesso");
    }
    
    setIsEditing(false);
    setEditingTemplate(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingTemplate(null);
  };

  if (isEditing) {
    return (
      <AppLayout>
        <div className="animate-fade-in">
          <TemplateEditor
            initialName={editingTemplate?.name}
            initialContent={editingTemplate?.content}
            onSave={handleSave}
            onCancel={handleCancel}
          />
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
              Gerencie seus modelos de contrato
            </p>
          </div>
          <Button className="gap-2" onClick={handleCreateNew}>
            <Plus className="h-4 w-4" />
            Novo Template
          </Button>
        </div>

        {/* Template grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
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
                      onClick={() => handleDelete(template.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
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
                <span>•</span>
                <span>{template.usageCount} usos</span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">
                  Criado: {template.createdAt}
                </span>
                <Button variant="outline" size="sm" onClick={() => handleEdit(template)}>
                  Editar
                </Button>
              </div>
            </motion.div>
          ))}

          {/* Create new template card */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: templates.length * 0.1 }}
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
