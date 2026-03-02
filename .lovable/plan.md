

# Corrigir Preview para parecer com o documento Word

## Problemas comparando Word vs Preview atual

1. **Conteúdo transborda a página** — texto e tabelas saem da área do documento, sem overflow controlado
2. **Títulos sem cor** — no Word, H2 ("Contratante", "Contratada", seções) são vermelho/rosa; no preview são apenas preto
3. **Tabela sem cabeçalho colorido** — no Word, "CONDIÇÕES DO CONTRATO" tem fundo azul/cinza; no preview é plain
4. **H1 precisa ser maior e mais destacado** — título principal ("O2 INC" / "SAAS OXY + GÊNIO") precisa de mais peso
5. **`---` (hr) não deveria aparecer como linha** — no Word são apenas espaçamentos entre seções

## Alterações

### `src/components/wizard/steps/ContractLivePreview.tsx`
- Adicionar `overflow-hidden` no container do documento A4 para impedir transbordamento
- Estilizar `prose-h2` com **cor vermelha/rosa** (como no Word: `text-rose-600`) e sublinhado
- Estilizar `prose-h1` com tamanho maior (`text-2xl`) e mais espaçamento
- Tabelas: `w-full table-fixed` para forçar caber na página
- `prose-hr` invisível ou apenas espaçamento (`opacity-0` ou `border-transparent`)
- Reduzir padding lateral para `px-[40px]` para dar mais espaço ao conteúdo
- Adicionar `word-break: break-word` para parágrafos longos não transbordarem

### `src/components/wizard/steps/ClientDataImport.tsx`
- Sem alterações estruturais (proporção 35/65 já está correta)

