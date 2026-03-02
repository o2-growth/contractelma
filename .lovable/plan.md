

# Remover Passos 3 (Produtos) e 4 (Pagamento) do Wizard

## Alterações em `src/components/wizard/ContractWizard.tsx`
- Reduzir os steps para 3: Template → Dados → Gerar
- Remover imports de `ProductsEditor` e `PaymentTerms`
- Remover handlers `handleProductsChange` e `handlePaymentChange`
- Remover `products`, `paymentTerms` e `specialNotes` do state
- Atualizar `renderStep`: step 1 = Template, step 2 = Dados, step 3 = Preview
- Atualizar `canProceed`: remover cases 3 e 4
- Atualizar limites de navegação (max step = 3)

