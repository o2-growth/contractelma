import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { FileText, Search, Download, Eye, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Contract {
  id: string;
  client_data: unknown;
  status: string;
  created_at: string;
  template_id: string | null;
  total_value: number | null;
}

interface Template {
  id: string;
  name: string;
}

const statusConfig: Record<string, { label: string; variant: "default" | "success" | "warning" }> = {
  draft: { label: "Rascunho", variant: "default" },
  generated: { label: "Gerado", variant: "success" },
  sent: { label: "Enviado", variant: "warning" },
};

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsLoading(false);
        return;
      }

      const { data: contractsData } = await supabase
        .from("contracts")
        .select("id, client_data, status, created_at, template_id, total_value")
        .order("created_at", { ascending: false });

      const { data: templatesData } = await supabase
        .from("templates")
        .select("id, name");

      setContracts(contractsData || []);
      setTemplates(templatesData || []);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const getClientName = (clientData: unknown) => {
    const data = clientData as { nome?: string };
    return data?.nome || "Cliente";
  };

  const getClientCpf = (clientData: unknown) => {
    const data = clientData as { cpf?: string };
    return data?.cpf || "-";
  };

  const getTemplateName = (templateId: string | null) => {
    if (!templateId) return "Template padrão";
    const template = templates.find(t => t.id === templateId);
    return template?.name || "Template";
  };

  const filteredContracts = contracts.filter((contract) => {
    const clientName = getClientName(contract.client_data);
    const clientCpf = getClientCpf(contract.client_data);
    const matchesSearch = clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clientCpf.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number | null) => {
    if (!value) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Histórico de Contratos
          </h1>
          <p className="mt-1 text-muted-foreground">
            Todos os contratos gerados
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente ou CPF..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="generated">Gerado</SelectItem>
                <SelectItem value="sent">Enviado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card shadow-card overflow-hidden"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : contracts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Nenhum contrato gerado ainda</p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="grid grid-cols-12 gap-4 border-b border-border bg-muted px-6 py-3 text-sm font-medium text-muted-foreground">
                <div className="col-span-3">Cliente</div>
                <div className="col-span-2">CPF</div>
                <div className="col-span-2">Template</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1 text-center">Data</div>
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-1 text-right">Ações</div>
              </div>

              {/* Table body */}
              <div className="divide-y divide-border">
                {filteredContracts.map((contract, index) => {
                  const status = contract.status as keyof typeof statusConfig;
                  const config = statusConfig[status] || statusConfig.draft;
                  
                  return (
                    <motion.div
                      key={contract.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/50 transition-colors duration-fast"
                    >
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-foreground truncate">
                          {getClientName(contract.client_data)}
                        </span>
                      </div>
                      <div className="col-span-2 font-mono text-sm text-muted-foreground">
                        {getClientCpf(contract.client_data)}
                      </div>
                      <div className="col-span-2 text-sm text-muted-foreground truncate">
                        {getTemplateName(contract.template_id)}
                      </div>
                      <div className="col-span-2 text-right font-mono font-medium text-foreground">
                        {formatCurrency(contract.total_value)}
                      </div>
                      <div className="col-span-1 text-center text-sm text-muted-foreground">
                        {formatDate(contract.created_at)}
                      </div>
                      <div className="col-span-1 text-center">
                        <StatusBadge variant={config.variant} showIcon={false}>
                          {config.label}
                        </StatusBadge>
                      </div>
                      <div className="col-span-1 flex justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {filteredContracts.length === 0 && (
                <div className="px-6 py-12 text-center text-muted-foreground">
                  Nenhum contrato encontrado com os filtros selecionados.
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
