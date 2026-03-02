import { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";
import type { ClientData, Template } from "../ContractWizard";

interface ContractLivePreviewProps {
  template: Template | null;
  clientData: ClientData;
}

export function ContractLivePreview({ template, clientData }: ContractLivePreviewProps) {
  const renderedContent = useMemo(() => {
    if (!template?.content) return null;

    // Replace {{VAR}} with clientData values or highlight placeholder
    return template.content.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
      const value = clientData[key] || clientData[key.toLowerCase()];
      if (value) return value;
      return `{{${key}}}`;
    });
  }, [template, clientData]);

  if (!template?.content) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 opacity-40" />
          <p className="mt-2 text-sm">Nenhum template selecionado</p>
        </div>
      </div>
    );
  }

  // Split content into parts: filled text vs unfilled placeholders
  const parts = renderedContent!.split(/(\{\{\w+\}\})/g);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <FileText className="h-4 w-4 text-primary" />
        <span className="font-display text-sm font-semibold text-foreground">
          Preview ao Vivo
        </span>
      </div>
      <ScrollArea className="flex-1 p-6">
        <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
          {parts.map((part, i) => {
            const placeholderMatch = part.match(/^\{\{(\w+)\}\}$/);
            if (placeholderMatch) {
              return (
                <span
                  key={i}
                  className="inline-block rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-xs text-amber-700 dark:text-amber-400"
                >
                  {placeholderMatch[1]}
                </span>
              );
            }
            return <span key={i}>{part}</span>;
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
