import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
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

    // Replace filled variables with their values, keep unfilled as styled markers
    return template.content.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
      const value = clientData[key] || clientData[key.toLowerCase()];
      if (value) return `**${value}**`;
      // Use a special marker that survives markdown rendering
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
            components={{
              // Render <var> tags as highlighted placeholder badges
              p: ({ children, ...props }) => {
                return <p {...props}>{processChildren(children)}</p>;
              },
              li: ({ children, ...props }) => {
                return <li {...props}>{processChildren(children)}</li>;
              },
              td: ({ children, ...props }) => {
                return <td {...props}>{processChildren(children)}</td>;
              },
              th: ({ children, ...props }) => {
                return <th {...props}>{processChildren(children)}</th>;
              },
              h1: ({ children, ...props }) => {
                return <h1 {...props}>{processChildren(children)}</h1>;
              },
              h2: ({ children, ...props }) => {
                return <h2 {...props}>{processChildren(children)}</h2>;
              },
              h3: ({ children, ...props }) => {
                return <h3 {...props}>{processChildren(children)}</h3>;
              },
            }}
          >
            {renderedContent!}
          </ReactMarkdown>
        </div>
      </ScrollArea>
    </div>
  );
}

// Process children to find <var>KEY</var> patterns in text nodes and render as badges
function processChildren(children: React.ReactNode): React.ReactNode {
  if (!children) return children;

  if (typeof children === "string") {
    return renderVarTags(children);
  }

  if (Array.isArray(children)) {
    return children.map((child, i) => {
      if (typeof child === "string") {
        return <span key={i}>{renderVarTags(child)}</span>;
      }
      return child;
    });
  }

  return children;
}

function renderVarTags(text: string): React.ReactNode {
  const parts = text.split(/(<var>\w+<\/var>)/g);
  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    const match = part.match(/^<var>(\w+)<\/var>$/);
    if (match) {
      return (
        <span
          key={i}
          className="inline-block rounded-md bg-amber-100 px-1.5 py-0.5 font-mono text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
        >
          {match[1]}
        </span>
      );
    }
    return part;
  });
}
