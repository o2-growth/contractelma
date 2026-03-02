

# Plano: Preview ao vivo do contrato no Passo 2

## O que muda
No passo 2, em vez de mostrar apenas o formulário de dados, vamos criar um layout split-screen: formulário à esquerda e preview do contrato à direita, atualizando em tempo real conforme o usuário preenche os campos.

## Alterações

### 1. `src/components/wizard/steps/ClientDataImport.tsx`
- Usar `ResizablePanelGroup` com dois painéis lado a lado
- **Painel esquerdo**: formulário atual (upload + campos dinâmicos)
- **Painel direito**: preview do template com variáveis substituídas em tempo real
  - Usa `useMemo` para substituir `{{VAR}}` pelo valor de `clientData[VAR]` a cada mudança
  - Variáveis não preenchidas ficam destacadas (ex: fundo amarelo ou texto placeholder)
  - Conteúdo dentro de `ScrollArea` para navegar pelo contrato
  - Renderiza o texto do template com `whitespace-pre-wrap` para manter formatação

### 2. `src/components/wizard/ContractWizard.tsx`
- Aumentar `max-w` do container de `5xl` para `7xl` no passo 2, para acomodar os dois painéis

## Comportamento
- Quando o formulário ainda não está visível (tela de upload inicial), o preview aparece em largura total abaixo ou o painel direito mostra o template "vazio" (com todas as variáveis em destaque)
- Conforme o usuário digita, o painel direito atualiza instantaneamente via React state

