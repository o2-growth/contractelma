import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  DollarSign,
  FileText,
  Save,
  X,
  Eye,
  Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface PlaceholderConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const placeholders: PlaceholderConfig[] = [
  { key: "nome", label: "Nome", icon: User, description: "Nome completo do cliente" },
  { key: "cpf", label: "CPF", icon: CreditCard, description: "CPF do cliente" },
  { key: "endereco", label: "Endereço", icon: MapPin, description: "Endereço completo" },
  { key: "telefone", label: "Telefone", icon: Phone, description: "Telefone de contato" },
  { key: "email", label: "E-mail", icon: Mail, description: "E-mail do cliente" },
  { key: "data", label: "Data", icon: Calendar, description: "Data do contrato" },
  { key: "valor_total", label: "Valor Total", icon: DollarSign, description: "Valor total do contrato" },
  { key: "produtos", label: "Produtos", icon: FileText, description: "Lista de produtos/serviços" },
];

interface DetectedField {
  key: string;
  originalValue: string;
  confidence: number;
}

interface TemplateEditorProps {
  initialName?: string;
  initialContent?: string;
  detectedFields?: DetectedField[];
  onSave: (name: string, content: string) => void;
  onCancel: () => void;
}

export function TemplateEditor({
  initialName = "",
  initialContent = "",
  detectedFields = [],
  onSave,
  onCancel,
}: TemplateEditorProps) {
  const [name, setName] = useState(initialName);
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertPlaceholder = useCallback((key: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const placeholder = `{{${key}}}`;
    
    const newContent = 
      content.substring(0, start) + 
      placeholder + 
      content.substring(end);
    
    setContent(newContent);
    
    // Focus and set cursor position after placeholder
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + placeholder.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  }, [content]);

  const highlightPlaceholders = (text: string) => {
    const parts = text.split(/({{[^}]+}})/g);
    return parts.map((part, index) => {
      if (part.match(/^{{[^}]+}}$/)) {
        const key = part.slice(2, -2);
        const placeholder = placeholders.find(p => p.key === key);
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 rounded bg-primary/20 px-1.5 py-0.5 font-mono text-sm font-medium text-primary"
          >
            {placeholder && <placeholder.icon className="h-3 w-3" />}
            {key}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const getPlaceholderCount = () => {
    const matches = content.match(/{{[^}]+}}/g);
    return matches ? matches.length : 0;
  };

  const getUniqueFields = () => {
    const matches = content.match(/{{[^}]+}}/g);
    if (!matches) return [];
    return [...new Set(matches.map(m => m.slice(2, -2)))];
  };

  const handleSave = () => {
    if (name.trim() && content.trim()) {
      onSave(name, content);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Editor de Template
          </h2>
          <p className="mt-1 text-muted-foreground">
            Crie seu modelo de contrato com placeholders dinâmicos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || !content.trim()}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Template
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Placeholder sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-display font-semibold text-foreground mb-3">
              Campos Disponíveis
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Clique para inserir no texto
            </p>
            
            <div className="space-y-2">
              {placeholders.map((placeholder) => (
                <button
                  key={placeholder.key}
                  onClick={() => insertPlaceholder(placeholder.key)}
                  className="w-full flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-left transition-all hover:border-primary hover:bg-primary/5 group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <placeholder.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm font-medium text-foreground">
                      {`{{${placeholder.key}}}`}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {placeholder.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-6 border-t border-border pt-4">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Estatísticas
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Placeholders:</span>
                  <span className="font-mono font-medium text-foreground">
                    {getPlaceholderCount()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Campos únicos:</span>
                  <span className="font-mono font-medium text-foreground">
                    {getUniqueFields().length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Caracteres:</span>
                  <span className="font-mono font-medium text-foreground">
                    {content.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Editor area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Template name */}
            <div className="border-b border-border p-4">
              <Label htmlFor="template-name" className="text-sm font-medium">
                Nome do Template
              </Label>
              <Input
                id="template-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Contrato de Prestação de Serviços"
                className="mt-2"
              />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "edit" | "preview")}>
              <div className="border-b border-border bg-muted/30 px-4">
                <TabsList className="bg-transparent h-12">
                  <TabsTrigger 
                    value="edit" 
                    className="gap-2 data-[state=active]:bg-background"
                  >
                    <Code className="h-4 w-4" />
                    Editar
                  </TabsTrigger>
                  <TabsTrigger 
                    value="preview" 
                    className="gap-2 data-[state=active]:bg-background"
                  >
                    <Eye className="h-4 w-4" />
                    Visualizar
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="edit" className="m-0">
                <Textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`Digite o texto do seu contrato aqui...

Exemplo:
Pelo presente instrumento particular, {{nome}}, inscrito no CPF sob o nº {{cpf}}, residente em {{endereco}}, telefone {{telefone}}, e-mail {{email}}, doravante denominado CONTRATANTE...

O valor total deste contrato é de {{valor_total}}.

Data: {{data}}`}
                  className="min-h-[500px] rounded-none border-0 font-mono text-sm resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </TabsContent>

              <TabsContent value="preview" className="m-0">
                <div className="min-h-[500px] p-6 prose prose-sm max-w-none">
                  {content ? (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {highlightPlaceholders(content)}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      O preview do template aparecerá aqui...
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Used fields footer */}
            {getUniqueFields().length > 0 && (
              <div className="border-t border-border bg-muted/30 px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Campos utilizados:
                  </span>
                  {getUniqueFields().map((field) => {
                    const placeholder = placeholders.find(p => p.key === field);
                    return (
                      <span
                        key={field}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                          placeholder 
                            ? "bg-primary/10 text-primary" 
                            : "bg-warning/10 text-warning"
                        )}
                      >
                        {placeholder ? (
                          <placeholder.icon className="h-3 w-3" />
                        ) : null}
                        {field}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
