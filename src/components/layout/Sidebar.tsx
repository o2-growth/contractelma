import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  FilePlus, 
  FileText, 
  Clock, 
  Settings,
  FileCheck,
  Home,
  ShieldCheck,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRole } from "@/hooks/use-role";

const baseNavigation = [
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
  const navigate = useNavigate();
  const [recentContracts, setRecentContracts] = useState<RecentContract[]>([]);
  const isSuperAdmin = useRole("super_admin");

  const navigation = isSuperAdmin
    ? [
        ...baseNavigation.slice(0, 4),
        { name: "Auditoria", href: "/auditoria", icon: ShieldCheck },
        ...baseNavigation.slice(4),
      ]
    : baseNavigation;

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
        {/* Logo O2 Inc */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
          <img
            src="/o2/logo-black.png"
            alt="O2 Inc"
            className="h-8 w-auto object-contain dark:hidden"
          />
          <img
            src="/o2/logo-white.png"
            alt="O2 Inc"
            className="h-8 w-auto object-contain hidden dark:block"
          />
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

        {/* Logout */}
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/auth", { replace: true });
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
}
