## Problema

Ao abrir um contrato existente (ex: `/contract/c4f1e778-...`), aparece o erro:

> Cannot read properties of undefined (reading 'name')

## Causa raiz

`src/constants/contractTemplates.ts` tem vírgulas duplicadas (`},,`) entre as entradas do array `defaultTemplates` (linhas 264, 331, 392, 459). Isso cria **sparse arrays** (arrays com "holes").

Em `src/pages/NewContract.tsx` linha 48:

```ts
const matchDefault = defaultTemplates.find((d) => d.name === tpl.name);
```

`Array.prototype.find` **não pula holes** (diferente de `map`/`forEach`/`filter`). Ele visita o hole como `undefined`, e o acesso a `d.name` lança o TypeError, que é capturado pelo bloco `catch` e exibido na tela com os botões "Criar novo do zero" e "Voltar ao Histórico".

## Correção

Trocar as 4 ocorrências de `},,` por `},` em `src/constants/contractTemplates.ts` (linhas 264, 331, 392, 459).

## Verificação

Recarregar a rota `/contract/c4f1e778-f434-4b3d-bc6e-a2484c985242` e confirmar que o wizard abre direto no passo 2 (Dados) com o template "CFO as a Service (Modelo 4)" carregado, sem o erro.
