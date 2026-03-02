

# Corrigir Layout e Preview do Contrato - Passo 2

## Problemas
1. **Preview não parece um documento Word** -- o markdown renderiza mas não tem aspecto de documento (falta fundo branco, bordas de página, tipografia de documento)
2. **Painel esquerdo (formulário) ocupa muito espaço** -- está 50/50, precisa ser menor para dar mais destaque ao documento

## Alterações

### 1. `src/components/wizard/steps/ClientDataImport.tsx`
- Mudar proporção dos painéis: formulário **35%**, preview **65%**
- Reduzir `minSize` do painel esquerdo para 25

### 2. `src/components/wizard/steps/ContractLivePreview.tsx`
- Estilizar o preview como uma **página de documento real** (estilo A4):
  - Fundo branco com sombra e bordas sutis (simula folha de papel)
  - Padding generoso (como margens de documento Word)
  - Tipografia serifada ou mais formal para o corpo do texto
  - Fundo cinza claro atrás da "folha" para criar contraste
- Melhorar estilos do prose: tamanho de fonte adequado, espaçamento entre parágrafos, tabelas com bordas completas
- Variáveis não preenchidas continuam com badge amarelo

### 3. `src/components/wizard/ContractWizard.tsx`
- Aumentar container para `max-w-[1400px]` no passo 2 para aproveitar melhor a tela

