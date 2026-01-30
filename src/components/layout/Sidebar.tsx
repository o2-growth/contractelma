import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  FilePlus, 
  FileText, 
  Clock, 
  Settings,
  FileCheck,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Novo Contrato", href: "/contract/new", icon: FilePlus },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Histórico", href: "/history", icon: Clock },
  { name: "Configurações", href: "/settings", icon: Settings },
];

interface RecentContract {
  id: string;
  client_data: unknown;
  created_at: string;
}

export function Sidebar() {
  const location = useLocation();
  const [recentContracts, setRecentContracts] = useState<RecentContract[]>([]);

  useEffect(() => {
    const fetchRecentContracts = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("contracts")
        .select("id, client_data, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

      setRecentContracts(data || []);
    };

    fetchRecentContracts();
  }, []);

  const getClientName = (clientData: unknown) => {
    const data = clientData as { nome?: string };
    return data?.nome || "Cliente";
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: false, 
      locale: ptBR 
    });
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[260px] border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <FileCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-sidebar-foreground">
            ContractFlow
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = item.href === "/" 
              ? location.pathname === "/"
              : location.pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-fast",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-sidebar-primary" : ""
                )} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Recent Contracts */}
        {recentContracts.length > 0 && (
          <div className="border-t border-sidebar-border px-3 py-4">
            <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Contratos Recentes
            </p>
            <div className="space-y-1">
              {recentContracts.map((contract) => (
                <Link
                  key={contract.id}
                  to={`/contract/${contract.id}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-all duration-fast hover:bg-sidebar-accent hover:text-sidebar-foreground"
                >
                  <span className="truncate">{getClientName(contract.client_data)}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(contract.created_at)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
