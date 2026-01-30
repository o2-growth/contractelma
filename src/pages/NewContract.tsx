import { AppLayout } from "@/components/layout/AppLayout";
import { ContractWizard } from "@/components/wizard/ContractWizard";

export default function NewContract() {
  return (
    <AppLayout>
      <ContractWizard />
    </AppLayout>
  );
}
