import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ContractWizard, type ContractData, type Template } from "@/components/wizard/ContractWizard";
import { supabase } from "@/integrations/supabase/client";
import { defaultTemplates } from "@/constants/contractTemplates";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewContract() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState<boolean>(isEditing);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<ContractData | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Buscar contrato + template em paralelo
        const { data: contract, error: contractErr } = await supabase
          .from("contracts")
          .select("id, template_id, client_data, status")
          .eq("id", id)
          .maybeSingle();

        if (contractErr) throw contractErr;
        if (!contract) throw new Error("Contrato não encontrado");

        // Buscar o template no banco
        let template: Template | null = null;
        if (contract.template_id) {
          const { data: tpl } = await supabase
            .from("templates")
            .select("id, name, description, content, created_at")
            .eq("id", contract.template_id)
            .maybeSingle();

          if (tpl) {
            // Casa com defaultTemplates pra pegar o docxTemplate
            const matchDefault = defaultTemplates.find((d) => d.name === tpl.name);
            template = {
              id: tpl.id,
              name: tpl.name,
              description: tpl.description || "",
              createdAt: tpl.created_at,
              content: tpl.content,
              docxTemplate: matchDefault?.docxTemplate,
              category: matchDefault?.category,
            };
          }
        }

        if (!cancelled) {
          setInitialData({
            template,
            clientData: (contract.client_data as Record<string, string>) || {},
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erro ao carregar contrato");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-24 flex-col gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando contrato...</p>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-24 flex-col gap-3">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-foreground font-medium">{error}</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/history")}>
              Voltar ao Histórico
            </Button>
            <Button onClick={() => navigate("/contract/new")}>
              Criar novo do zero
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ContractWizard
        contractId={id}
        initialContractData={initialData || undefined}
      />
    </AppLayout>
  );
}
