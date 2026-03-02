import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WizardStepper } from "./WizardStepper";
import { TemplateSelection } from "./steps/TemplateSelection";
import { ClientDataImport } from "./steps/ClientDataImport";
import { ContractPreview } from "./steps/ContractPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const steps = [
  { id: 1, name: "Template" },
  { id: 2, name: "Dados" },
  { id: 3, name: "Gerar" },
];

export interface Template {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  content?: string;
}

export type ClientData = Record<string, string>;

export interface ContractData {
  template: Template | null;
  clientData: ClientData;
}

export function ContractWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [contractData, setContractData] = useState<ContractData>({
    template: null,
    clientData: {},
  });

  const handleTemplateSelect = useCallback((template: Template) => {
    setContractData((prev) => ({ ...prev, template, clientData: {} }));
    setCurrentStep(2);
  }, []);

  const handleClientDataChange = useCallback((clientData: ClientData) => {
    setContractData((prev) => ({ ...prev, clientData }));
  }, []);

  const goNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return contractData.template !== null;
      case 2: {
        const cd = contractData.clientData;
        return (cd.CLIENTE || cd.nome || "").length > 0;
      }
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
            selectedTemplate={contractData.template}
          />
        );
      case 3:
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
    <div className={`mx-auto ${currentStep === 2 ? "max-w-[1400px]" : "max-w-5xl"}`}>
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
      {currentStep < 3 && (
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
