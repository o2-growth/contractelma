import { Link, useLocation } from "react-router-dom";
import { 
  FilePlus, 
  FileText, 
  Clock, 
  Settings,
  FileCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Novo Contrato", href: "/contract/new", icon: FilePlus },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Histórico", href: "/history", icon: Clock },
  { name: "Configurações", href: "/settings", icon: Settings },
];

const recentContracts = [
  { id: "127", name: "Contrato #127", date: "Hoje" },
  { id: "126", name: "Contrato #126", date: "Ontem" },
  { id: "125", name: "Contrato #125", date: "2 dias" },
];

export function Sidebar() {
  const location = useLocation();

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
            const isActive = location.pathname === item.href || 
              (item.href !== "/" && location.pathname.startsWith(item.href));
            
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
                <span>{contract.name}</span>
                <span className="text-xs text-muted-foreground">{contract.date}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
