import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { FileText, Search, Download, Eye, Filter } from "lucide-react";
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

const contracts = [
  {
    id: "127",
    client: "João da Silva Santos",
    cpf: "123.456.789-00",
    template: "Contrato Padrão",
    total: 6500,
    date: "30/01/2026",
    status: "generated" as const,
  },
  {
    id: "126",
    client: "Maria Santos Oliveira",
    cpf: "987.654.321-00",
    template: "Contrato Premium",
    total: 12800,
    date: "29/01/2026",
    status: "sent" as const,
  },
  {
    id: "125",
    client: "Pedro Costa Lima",
    cpf: "456.789.123-00",
    template: "Contrato Simplificado",
    total: 3200,
    date: "28/01/2026",
    status: "draft" as const,
  },
  {
    id: "124",
    client: "Ana Paula Ferreira",
    cpf: "321.654.987-00",
    template: "Contrato Padrão",
    total: 8900,
    date: "27/01/2026",
    status: "generated" as const,
  },
  {
    id: "123",
    client: "Carlos Eduardo Souza",
    cpf: "654.321.987-00",
    template: "Contrato Premium",
    total: 15600,
    date: "26/01/2026",
    status: "sent" as const,
  },
];

const statusConfig = {
  draft: { label: "Rascunho", variant: "default" as const },
  generated: { label: "Gerado", variant: "success" as const },
  sent: { label: "Enviado", variant: "warning" as const },
};

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch = contract.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.cpf.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
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
            {filteredContracts.map((contract, index) => (
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
                    {contract.client}
                  </span>
                </div>
                <div className="col-span-2 font-mono text-sm text-muted-foreground">
                  {contract.cpf}
                </div>
                <div className="col-span-2 text-sm text-muted-foreground truncate">
                  {contract.template}
                </div>
                <div className="col-span-2 text-right font-mono font-medium text-foreground">
                  {formatCurrency(contract.total)}
                </div>
                <div className="col-span-1 text-center text-sm text-muted-foreground">
                  {contract.date}
                </div>
                <div className="col-span-1 text-center">
                  <StatusBadge variant={statusConfig[contract.status].variant} showIcon={false}>
                    {statusConfig[contract.status].label}
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
            ))}
          </div>

          {filteredContracts.length === 0 && (
            <div className="px-6 py-12 text-center text-muted-foreground">
              Nenhum contrato encontrado.
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
