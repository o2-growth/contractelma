import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { FileText, Search, Download, Eye, Filter, Loader2, FileType, ExternalLink } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Contract {
  id: string;
  client_data: unknown;
  status: string;
  created_at: string;
  template_id: string | null;
  total_value: number | null;
  pipefy_card_id?: string | null;
}

interface Template {
  id: string;
  name: string;
  docxTemplate?: string | null;
}

const statusConfig: Record<string, { label: string; variant: "default" | "success" | "warning" }> = {
  draft: { label: "Rascunho", variant: "default" },
  generated: { label: "Gerado", variant: "success" },
  sent: { label: "Enviado", variant: "warning" },
};

// Mapa dos docxTemplates conhecidos por nome (paths no Storage)
const DOCX_TEMPLATE_PATHS: Record<string, string> = {
  "SaaS Oxy + Gênio (Modelo 1 - Oficial)": "templates/base/saas-oxy-genio-modelo1.docx",
  "SaaS Oxy + Gênio + Especialista (Modelo 2 - Oficial)": "templates/base/saas-oxy-genio-especialista-modelo2.docx",
  "Diagnóstico Estratégico (Modelo 3 - Oficial)": "templates/base/diagnostico-estrategico-modelo3.docx",
  "CFO as a Service (Modelo 4 - Oficial, revisado março)": "templates/base/cfo-as-a-service-modelo4.docx",
};

export default function History() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewContract, setViewContract] = useState<Contract | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

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
        .select("id, client_data, status, created_at, template_id, total_value, pipefy_card_id")
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

  const handleView = (contract: Contract) => {
    setViewContract(contract);
  };

  const handleDownload = async (contract: Contract) => {
    const templateName = getTemplateName(contract.template_id);
    const docxPath = DOCX_TEMPLATE_PATHS[templateName];
    if (!docxPath) {
      toast.error("Template oficial não identificado", {
        description: "Este contrato não tem um DOCX oficial vinculado.",
      });
      return;
    }

    setDownloadingId(contract.id);
    try {
      const clientData = (contract.client_data as Record<string, string>) || {};
      const labelBase = clientData.razao_social || clientData.RAZAO_SOCIAL || clientData.nome || clientData.cliente || "contrato";
      const cleanLabel = labelBase.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60);

      const { data, error: fnError } = await supabase.functions.invoke(
        "render-contract-docx",
        {
          body: {
            docxTemplate: docxPath,
            clientData,
            contractName: `contrato_${cleanLabel}`,
          },
        }
      );

      if (fnError) throw new Error(fnError.message || "Falha na edge function");
      if (!data?.success) throw new Error(data?.error || "Falha ao renderizar DOCX");
      if (!data.base64) throw new Error("DOCX vazio retornado");

      const binary = atob(data.base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: data.mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = data.fileName || `contrato_${cleanLabel}_${Date.now()}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("DOCX baixado com design preservado!");
    } catch (err) {
      console.error("Erro ao baixar DOCX:", err);
      toast.error("Erro ao baixar DOCX", {
        description: err instanceof Error ? err.message : "tente novamente",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const goToWizardWithContract = (contract: Contract) => {
    // Navega pro wizard. Como o wizard cria novo do zero, isso é "abrir como rascunho"
    navigate("/contract/new", {
      state: {
        prefilledContract: contract,
      },
    });
  };

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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(contract)}
                          title="Visualizar detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(contract)}
                          disabled={downloadingId === contract.id}
                          title="Baixar DOCX"
                        >
                          {downloadingId === contract.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
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

        {/* Modal de visualização de detalhes */}
        <Dialog open={!!viewContract} onOpenChange={(open) => !open && setViewContract(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {viewContract && getClientName(viewContract.client_data)}
              </DialogTitle>
              <DialogDescription>
                {viewContract && getTemplateName(viewContract.template_id)}
                {viewContract?.pipefy_card_id && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded bg-primary/10 text-primary text-xs px-2 py-0.5 font-medium">
                    Origem: Pipefy #{viewContract.pipefy_card_id}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            {viewContract && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Status</p>
                    <p className="font-medium">{statusConfig[viewContract.status as keyof typeof statusConfig]?.label || viewContract.status}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Criado em</p>
                    <p className="font-medium">{formatDate(viewContract.created_at)}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-display font-semibold text-sm mb-2">Dados Preenchidos</h4>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-border">
                        {Object.entries((viewContract.client_data as Record<string, string>) || {})
                          .filter(([, v]) => v && String(v).trim().length > 0)
                          .map(([k, v], i) => (
                            <tr key={k} className={i % 2 === 1 ? "bg-muted/30" : ""}>
                              <td className="px-3 py-2 font-medium text-muted-foreground w-1/3">{k}</td>
                              <td className="px-3 py-2 break-words">{String(v)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2">
              {viewContract && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      goToWizardWithContract(viewContract);
                      setViewContract(null);
                    }}
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Abrir no Wizard
                  </Button>
                  <Button
                    onClick={() => {
                      handleDownload(viewContract);
                    }}
                    disabled={downloadingId === viewContract.id}
                    className="gap-2"
                  >
                    {downloadingId === viewContract.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileType className="h-4 w-4" />
                    )}
                    Baixar DOCX
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
