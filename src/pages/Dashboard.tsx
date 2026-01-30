import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  FilePlus, 
  FileText, 
  Clock, 
  TrendingUp,
  ArrowUpRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Contract {
  id: string;
  client_data: unknown;
  status: string;
  created_at: string;
  template_id: string | null;
}

interface Template {
  id: string;
  name: string;
}

const statusConfig: Record<string, { label: string; variant: "default" | "success" | "warning" | "error" }> = {
  draft: { label: "Rascunho", variant: "default" },
  generated: { label: "Gerado", variant: "success" },
  sent: { label: "Enviado", variant: "warning" },
};

export default function Dashboard() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [contractsThisMonth, setContractsThisMonth] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      
      if (!session) {
        setIsLoading(false);
        return;
      }

      // Fetch recent contracts
      const { data: contractsData } = await supabase
        .from("contracts")
        .select("id, client_data, status, created_at, template_id")
        .order("created_at", { ascending: false })
        .limit(5);

      // Fetch templates count
      const { data: templatesData } = await supabase
        .from("templates")
        .select("id, name");

      // Count contracts this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { count } = await supabase
        .from("contracts")
        .select("id", { count: "exact", head: true })
        .gte("created_at", startOfMonth.toISOString());

      setContracts(contractsData || []);
      setTemplates(templatesData || []);
      setContractsThisMonth(count || 0);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true, 
      locale: ptBR 
    });
  };

  const getTemplateName = (templateId: string | null) => {
    if (!templateId) return "Template padrão";
    const template = templates.find(t => t.id === templateId);
    return template?.name || "Template";
  };

  const stats = [
    { 
      label: "Contratos este mês", 
      value: contractsThisMonth.toString(), 
      icon: FileText, 
      trend: null 
    },
    { 
      label: "Templates salvos", 
      value: templates.length.toString(), 
      icon: TrendingUp, 
      trend: null 
    },
  ];

  return (
    <AppLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Dashboard
            </h1>
            <p className="mt-1 text-muted-foreground">
              {isLoggedIn ? "Bem-vindo ao ContractFlow" : "Faça login para ver seus dados"}
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link to="/contract/new">
              <FilePlus className="h-4 w-4" />
              Novo Contrato
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 shadow-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
                {stat.trend && (
                  <span className="flex items-center text-sm font-medium text-success">
                    <ArrowUpRight className="h-4 w-4" />
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <p className="font-mono text-3xl font-bold text-foreground">
                  {isLoading ? "-" : stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          ))}

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/contract/new"
              className="flex h-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 p-6 text-center transition-all duration-normal hover:border-primary hover:bg-primary/5"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-current text-muted-foreground transition-colors duration-normal">
                <FilePlus className="h-6 w-6" />
              </div>
              <span className="font-medium text-foreground">Novo Contrato</span>
              <span className="mt-1 text-sm text-muted-foreground">Criar agora</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/templates"
              className="flex h-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 p-6 text-center transition-all duration-normal hover:border-primary hover:bg-primary/5"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-current text-muted-foreground transition-colors duration-normal">
                <FileText className="h-6 w-6" />
              </div>
              <span className="font-medium text-foreground">Templates</span>
              <span className="mt-1 text-sm text-muted-foreground">Gerenciar</span>
            </Link>
          </motion.div>
        </div>

        {/* Recent contracts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card shadow-card"
        >
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-display text-lg font-semibold text-foreground">
                Contratos Recentes
              </h2>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/history">Ver todos</Link>
            </Button>
          </div>

          <div className="divide-y divide-border">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !isLoggedIn ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Faça login para ver seus contratos</p>
              </div>
            ) : contracts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Nenhum contrato gerado ainda</p>
                <Button asChild className="mt-4">
                  <Link to="/contract/new">Criar primeiro contrato</Link>
                </Button>
              </div>
            ) : (
              contracts.map((contract) => {
                const clientName = (contract.client_data as { nome?: string })?.nome || "Cliente";
                const status = contract.status as keyof typeof statusConfig;
                const config = statusConfig[status] || statusConfig.draft;
                
                return (
                  <Link
                    key={contract.id}
                    to={`/contract/${contract.id}`}
                    className="flex items-center justify-between px-6 py-4 transition-colors duration-fast hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{clientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {getTemplateName(contract.template_id)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(contract.created_at)}
                      </span>
                      <StatusBadge variant={config.variant}>
                        {config.label}
                      </StatusBadge>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
