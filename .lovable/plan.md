

# Corrigir Preview ao Vivo do Contrato

## Problemas Identificados
1. **Tabelas não renderizam** — `react-markdown` v10 não suporta tabelas GFM por padrão, precisa do plugin `remark-gfm`
2. **Tags `<var>` aparecem como texto** — `react-markdown` v10 não processa HTML inline sem o plugin `rehype-raw`
3. **Títulos e formatação não aparecem** — possivelmente relacionado à falta do `remark-gfm`

## Alterações

### 1. Instalar dependências
- `remark-gfm` — suporte a tabelas, strikethrough, etc.
- `rehype-raw` — permitir HTML inline (para as tags `<var>`)

### 2. `src/components/wizard/steps/ContractLivePreview.tsx`
- Importar e usar `remarkGfm` e `rehypeRaw` no `ReactMarkdown`
- Adicionar `rehypeRaw` para que as tags `<var>` sejam parseadas como HTML real
- Registrar componente customizado para `var` no ReactMarkdown para renderizar os badges amarelos
- Remover a lógica manual de `processChildren` / `renderVarTags` que tenta fazer parse de string (desnecessário com `rehypeRaw`)
- Simplificar os overrides dos componentes

