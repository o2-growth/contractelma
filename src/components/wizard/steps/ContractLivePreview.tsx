import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
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

    return template.content.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
      const value = clientData[key] || clientData[key.toLowerCase()];
      if (value) return `**${value}**`;
      return `<var>${key}</var>`;
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

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <FileText className="h-4 w-4 text-primary" />
        <span className="font-display text-sm font-semibold text-foreground">
          Preview ao Vivo
        </span>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-6 prose prose-sm max-w-none dark:prose-invert
          prose-headings:font-display prose-headings:text-foreground
          prose-p:text-foreground prose-p:leading-relaxed
          prose-table:border-border prose-td:border-border prose-th:border-border
          prose-td:p-2 prose-th:p-2 prose-th:text-left prose-th:font-semibold
          prose-hr:border-border
          prose-strong:text-primary prose-strong:font-semibold
        ">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              var: ({ children }) => (
                <span className="inline-block rounded-md bg-amber-100 px-1.5 py-0.5 font-mono text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  {children}
                </span>
              ),
            }}
          >
            {renderedContent!}
          </ReactMarkdown>
        </div>
      </ScrollArea>
    </div>
  );
}
