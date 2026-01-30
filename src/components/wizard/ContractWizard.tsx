import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WizardStepper } from "./WizardStepper";
import { TemplateSelection } from "./steps/TemplateSelection";
import { ClientDataImport } from "./steps/ClientDataImport";
import { ProductsEditor } from "./steps/ProductsEditor";
import { PaymentTerms } from "./steps/PaymentTerms";
import { ContractPreview } from "./steps/ContractPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const steps = [
  { id: 1, name: "Template" },
  { id: 2, name: "Dados" },
  { id: 3, name: "Produtos" },
  { id: 4, name: "Pagamento" },
  { id: 5, name: "Gerar" },
];

export interface Template {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  content?: string;
}

export interface ClientData {
  nome: string;
  cpf: string;
  endereco: string;
  telefone: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface ContractData {
  template: Template | null;
  clientData: ClientData;
  products: Product[];
  paymentTerms: string;
  specialNotes: string;
}

const initialClientData: ClientData = {
  nome: "",
  cpf: "",
  endereco: "",
  telefone: "",
  email: "",
};

export function ContractWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [contractData, setContractData] = useState<ContractData>({
    template: null,
    clientData: initialClientData,
    products: [],
    paymentTerms: "",
    specialNotes: "",
  });

  const handleTemplateSelect = useCallback((template: Template) => {
    setContractData((prev) => ({ ...prev, template }));
    setCurrentStep(2);
  }, []);

  const handleClientDataChange = useCallback((clientData: ClientData) => {
    setContractData((prev) => ({ ...prev, clientData }));
  }, []);

  const handleProductsChange = useCallback((products: Product[]) => {
    setContractData((prev) => ({ ...prev, products }));
  }, []);

  const handlePaymentChange = useCallback((paymentTerms: string, specialNotes: string) => {
    setContractData((prev) => ({ ...prev, paymentTerms, specialNotes }));
  }, []);

  const goNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return contractData.template !== null;
      case 2:
        return contractData.clientData.nome.length > 0;
      case 3:
        return contractData.products.length > 0;
      case 4:
        return contractData.paymentTerms.length > 0;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TemplateSelection
            selectedTemplate={contractData.template}
            onSelect={handleTemplateSelect}
          />
        );
      case 2:
        return (
          <ClientDataImport
            clientData={contractData.clientData}
            onChange={handleClientDataChange}
          />
        );
      case 3:
        return (
          <ProductsEditor
            products={contractData.products}
            onChange={handleProductsChange}
          />
        );
      case 4:
        return (
          <PaymentTerms
            paymentTerms={contractData.paymentTerms}
            specialNotes={contractData.specialNotes}
            onChange={handlePaymentChange}
          />
        );
      case 5:
        return (
          <ContractPreview
            contractData={contractData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <WizardStepper steps={steps} currentStep={currentStep} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      {currentStep < 5 && (
        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={goBack}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <Button
            onClick={goNext}
            disabled={!canProceed()}
            className="gap-2"
          >
            Avançar
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
