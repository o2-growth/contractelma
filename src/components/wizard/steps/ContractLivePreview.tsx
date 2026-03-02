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
    <div className="flex h-full flex-col bg-muted/40">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3 bg-card">
        <FileText className="h-4 w-4 text-primary" />
        <span className="font-display text-sm font-semibold text-foreground">
          Preview ao Vivo
        </span>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex justify-center py-8 px-6">
          {/* A4-style document page */}
          <div className="w-full max-w-[210mm] bg-white dark:bg-card rounded shadow-lg border border-border/50
            px-[60px] py-[50px] min-h-[297mm]
            prose prose-sm max-w-none dark:prose-invert
            prose-headings:font-display prose-headings:text-foreground prose-headings:tracking-tight
            prose-h1:text-xl prose-h1:font-bold prose-h1:text-center prose-h1:uppercase prose-h1:mb-6
            prose-h2:text-lg prose-h2:font-semibold prose-h2:border-b prose-h2:border-border prose-h2:pb-1 prose-h2:mb-4
            prose-h3:text-base prose-h3:font-semibold
            prose-p:text-foreground prose-p:leading-relaxed prose-p:text-[13px] prose-p:mb-3
            prose-table:border prose-table:border-border prose-table:text-[12px]
            prose-thead:bg-muted/60
            prose-th:border prose-th:border-border prose-th:p-2 prose-th:text-left prose-th:font-semibold prose-th:text-foreground
            prose-td:border prose-td:border-border prose-td:p-2
            prose-hr:border-border prose-hr:my-6
            prose-strong:text-primary prose-strong:font-semibold
            prose-li:text-[13px] prose-li:text-foreground
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
        </div>
      </ScrollArea>
    </div>
  );
}
