import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  ShieldCheck, Loader2, FileText, FilePlus, Pencil, Trash2,
  RotateCcw, Search, Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/use-role";
import { ShieldAlert } from "lucide-react";

interface AuditLog {
  id: string;
  user_id: string | null;
  entity_type: string;
  entity_id: string;
  action: "create" | "update" | "delete" | "restore";
  changed_fields: string[];
  old_values: Record<string, unknown>;
  new_values: Record<string, unknown>;
  entity_snapshot: Record<string, unknown>;
  created_at: string;
}

const actionMeta: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  create:  { label: "Criação",   icon: <FilePlus className="h-4 w-4" />, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  update:  { label: "Edição",    icon: <Pencil className="h-4 w-4" />,   color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  delete:  { label: "Exclusão",  icon: <Trash2 className="h-4 w-4" />,   color: "bg-red-500/10 text-red-600 dark:text-red-400" },
  restore: { label: "Restauração", icon: <RotateCcw className="h-4 w-4" />, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
};

const entityLabel: Record<string, string> = {
  contract: "Contrato",
  template: "Template",
};

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v, null, 2);
  return String(v);
}

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const isSuperAdmin = useRole("super_admin");
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [selected, setSelected] = useState<AuditLog | null>(null);
  const [restoring, setRestoring] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setLoading(false); return; }
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      toast({ title: "Erro ao carregar auditoria", description: error.message, variant: "destructive" });
    } else {
      setLogs((data as unknown as AuditLog[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (isSuperAdmin === false) {
    return (
      <AppLayout>
        <div className="mx-auto flex max-w-xl flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Acesso restrito</h1>
          <p className="mt-2 text-muted-foreground">
            Esta área é exclusiva para super administradores. Caso precise de acesso, contate o responsável pela plataforma.
          </p>
        </div>
      </AppLayout>
    );
  }

  if (isSuperAdmin === null) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      if (entityFilter !== "all" && l.entity_type !== entityFilter) return false;
      if (actionFilter !== "all" && l.action !== actionFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = JSON.stringify(l).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [logs, search, entityFilter, actionFilter]);

  const handleRestore = async (log: AuditLog) => {
    setRestoring(true);
    try {
      const snapshot = log.entity_snapshot as Record<string, unknown>;
      if (!snapshot || Object.keys(snapshot).length === 0) {
        throw new Error("Snapshot indisponível para esta versão.");
      }
      const { id, created_at, updated_at, user_id, ...rest } = snapshot as Record<string, unknown>;
      const table = log.entity_type === "contract" ? "contracts" : "templates";

      if (log.action === "delete") {
        // Re-create the deleted record with the original snapshot
        const { error } = await supabase.from(table).insert({
          id: log.entity_id,
          ...rest,
          user_id,
        } as never);
        if (error) throw error;
      } else {
        // Apply snapshot back as an update
        const { error } = await supabase
          .from(table)
          .update(rest as never)
          .eq("id", log.entity_id);
        if (error) throw error;
      }

      toast({ title: "Versão restaurada", description: "O registro foi revertido para o estado anterior." });
      setSelected(null);
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Falha ao restaurar.";
      toast({ title: "Erro ao restaurar", description: msg, variant: "destructive" });
    } finally {
      setRestoring(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Auditoria de Alterações</h1>
            <p className="text-sm text-muted-foreground">
              Histórico completo de criações, edições e exclusões em contratos e templates.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por campo, valor ou id..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="contract">Contratos</SelectItem>
              <SelectItem value="template">Templates</SelectItem>
            </SelectContent>
          </Select>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Ação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as ações</SelectItem>
              <SelectItem value="create">Criação</SelectItem>
              <SelectItem value="update">Edição</SelectItem>
              <SelectItem value="delete">Exclusão</SelectItem>
              <SelectItem value="restore">Restauração</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 py-16 text-center">
            <FileText className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-muted-foreground">Nenhum registro de auditoria encontrado.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((log, idx) => {
              const meta = actionMeta[log.action];
              return (
                <motion.button
                  key={log.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                  onClick={() => setSelected(log)}
                  className="flex w-full items-center gap-4 rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-card-hover"
                >
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", meta.color)}>
                    {meta.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-card-foreground">
                        {meta.label} de {entityLabel[log.entity_type] || log.entity_type}
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        {log.entity_id.slice(0, 8)}
                      </Badge>
                      {log.action === "update" && log.changed_fields.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {log.changed_fields.length} campo{log.changed_fields.length > 1 ? "s" : ""} alterado{log.changed_fields.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    {log.action === "update" && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {log.changed_fields.slice(0, 5).map((f) => (
                          <span key={f} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    {format(new Date(log.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Diff Sheet */}
        <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
            {selected && (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    {actionMeta[selected.action].icon}
                    {actionMeta[selected.action].label} de {entityLabel[selected.entity_type]}
                  </SheetTitle>
                  <SheetDescription>
                    {format(new Date(selected.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm:ss", { locale: ptBR })}
                    {" · "}ID: {selected.entity_id.slice(0, 8)}
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  {selected.action === "update" && selected.changed_fields.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground">Campos alterados</h3>
                      {selected.changed_fields.map((field) => (
                        <div key={field} className="rounded-lg border border-border bg-card p-3">
                          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {field}
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            <div className="rounded bg-red-500/5 p-2">
                              <div className="mb-1 text-[10px] font-semibold uppercase text-red-600 dark:text-red-400">Antes</div>
                              <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words text-xs text-foreground">
                                {formatValue(selected.old_values[field])}
                              </pre>
                            </div>
                            <div className="rounded bg-emerald-500/5 p-2">
                              <div className="mb-1 text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">Depois</div>
                              <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words text-xs text-foreground">
                                {formatValue(selected.new_values[field])}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selected.action === "create" && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-foreground">Registro criado</h3>
                      <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-muted/30 p-3 text-xs">
                        {JSON.stringify(selected.new_values, null, 2)}
                      </pre>
                    </div>
                  )}

                  {selected.action === "delete" && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-foreground">Registro excluído (snapshot)</h3>
                      <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-muted/30 p-3 text-xs">
                        {JSON.stringify(selected.entity_snapshot, null, 2)}
                      </pre>
                    </div>
                  )}

                  {(selected.action === "update" || selected.action === "delete") && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="default" className="w-full" disabled={restoring}>
                          {restoring ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <RotateCcw className="mr-2 h-4 w-4" />
                          )}
                          {selected.action === "delete" ? "Recuperar registro excluído" : "Restaurar versão anterior"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar restauração?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {selected.action === "delete"
                              ? "O registro excluído será recriado com o conteúdo original. Esta ação ficará registrada na auditoria."
                              : "O registro voltará ao estado em que estava antes desta edição. Esta ação ficará registrada na auditoria."}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRestore(selected)}>
                            Restaurar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </AppLayout>
  );
}