

# Plano: Mostrar Campos Dinâmicos do Template no Passo 2

## Problema
O passo 2 (Dados do Cliente) só mostra 5 campos fixos: Nome, CPF, Endereço, Telefone e E-mail. Mas os templates reais usam muitas outras variáveis como `{{CLIENTE}}`, `{{CNPJ}}`, `{{NOME_SOCIO}}`, `{{ENDERECO_COMPLETO}}`, `{{VALOR_SETUP}}`, `{{VALOR_MENSALIDADE}}`, `{{AVISO_DIAS}}`, `{{NOME_TESTEMUNHA1}}`, etc.

## Solução
Detectar automaticamente quais variáveis o template selecionado usa e gerar campos dinâmicos para todas elas no passo 2, agrupados por categoria.

## Alterações

### 1. `src/components/wizard/ContractWizard.tsx`
- Trocar `ClientData` de interface fixa para `Record<string, string>` (mapa chave-valor dinâmico)
- Remover a interface `ClientData` com campos fixos
- Ajustar `initialClientData` para `{}`
- Atualizar validação `canProceed` no passo 2 para verificar se pelo menos `CLIENTE` ou `nome` está preenchido

### 2. `src/components/wizard/steps/ClientDataImport.tsx`
- Receber `selectedTemplate` como prop para detectar quais variáveis o template usa
- Extrair variáveis do template com regex `{{(\w+)}}`
- Cruzar com `availablePlaceholders` para obter label e categoria
- Renderizar campos agrupados por categoria (empresa, representante, contato, pagamento, contrato, assinatura)
- Excluir variáveis auto-geradas como `DATA`, `PRODUTOS` (preenchidas automaticamente)
- Manter funcionalidade de upload/extração por IA

### 3. `src/components/wizard/steps/ContractPreview.tsx`
- Atualizar `replacePlaceholders` para iterar sobre todas as chaves do `clientData` dinâmico em vez de mapear campos fixos
- Para cada `{{KEY}}` no template, buscar `clientData[KEY]`

### 4. `src/components/wizard/steps/PaymentTerms.tsx`
- Mover campos de pagamento (VALOR_SETUP, VALOR_MENSALIDADE, AVISO_DIAS) para o passo 2 junto com os demais campos, ou mantê-los no passo 4 -- depende do fluxo. Como são variáveis do template, faz mais sentido ficarem no passo 2 junto com os outros campos dinâmicos.

## Variáveis auto-preenchidas (não mostrar como campo)
- `DATA` -- gerada automaticamente
- `PRODUTOS` -- vem do passo 3
- `VALOR_TOTAL` -- calculado dos produtos
- `FORMA_PAGAMENTO` -- vem do passo 4
- `OBSERVACOES` -- vem do passo 4

## Agrupamento visual dos campos
- **Empresa**: CLIENTE, CNPJ, ENDERECO_COMPLETO, ENDERECO_EMPRESA
- **Representante**: NOME_SOCIO, SOCIO, CPF, RG, ENDERECO_SOCIO
- **Contato**: EMAIL, TELEFONE
- **Pagamento**: VALOR_SETUP, VALOR_MENSALIDADE, VALOR_PARCELA_SETUP
- **Contrato**: AVISO_DIAS, AVISO_PREVIO_DIAS
- **Assinatura**: NOME_TESTEMUNHA1, CPF_TESTEMUNHA1, NOME_TESTEMUNHA2, CPF_TESTEMUNHA2

