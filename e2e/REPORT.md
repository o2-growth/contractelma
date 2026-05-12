# Contractelma — E2E Test Report

## Revalidação 2026-05-12

**Suite:** `e2e/smoke.spec.ts` (6 testes) + `e2e/regression.spec.ts` (3 testes)
**Resultado:** 9/9 passou (`bunx playwright test`) em ~1m18s
**App:** http://localhost:8081 — chromium headless, viewport 1440x900, locale pt-BR

### Status dos 14 bugs corrigidos

| # | Bug | Severidade | Status | Evidência |
|---|-----|-----------|--------|-----------|
| BUG-001 | data_setup virava R$ 1,00 (regex currency gananciosa) | P0 | RESOLVIDO | Input retém `01/06/2026` após blur |
| BUG-002 | parcelas_valor_extenso virava R$ 12,00 | P0 | RESOLVIDO | Campo AUTO-DERIVED (AUTO_FILLED_KEYS). count===0 em regression.spec.ts |
| BUG-003 | Preview travado em "Renderizando..." | P0 | RESOLVIDO | Spinner desaparece em <20s; banner "Tentar novamente" no código |
| BUG-008 | button dentro de button em SendToSignature | P0 | RESOLVIDO | Zero console.error com validateDOMNesting |
| BUG-P1  | AlertDialog "2 documentos" → "1 contrato" | P1 | RESOLVIDO | Texto exato: "enviar 1 contrato para 1 signatário(s) via Autentique" |
| BUG-P1  | Contador "18 de 20" formato N de Total | P1 | RESOLVIDO | UI mostra "16 de 18" |
| BUG-P1  | Banner CTA "+ Adicionar este contato →" | P1 | RESOLVIDO | Banner verde visível com botão correto |
| BUG-P1  | Warning data assinatura < vigência | P1 | RESOLVIDO (code-level) | Sem teste E2E dedicado |
| BUG-P2  | Dia "1º de junho" com ordinal | P2 | RESOLVIDO | Helper: "(por extenso: 1º de junho de 2026)" |
| BUG-P2  | Máscaras nos dados extraídos pela IA | P2 | RESOLVIDO (code-level) | Mesmo formatter aplicado |
| BUG-P2  | Placeholders vazios fora do preview | P2 | RESOLVIDO (code-level) | Preview limpo |
| BUG-P2  | Future flags React Router | P2 | RESOLVIDO | Zero warning do React Router |
| BUG-P2  | NotFound usa console.warn | P2 | RESOLVIDO | _console-errors.json mostra type:"warning" |
| BUG-P2  | Helper valor com extenso | P2 | RESOLVIDO | "R$ 2.500,00 (dois mil e quinhentos reais)" |

### Asserções adicionadas (regression.spec.ts)

1. BUG-001: inputValue("#data_setup") === "01/06/2026" (não pode conter R$)
2. BUG-002: page.locator("#parcelas_valor_extenso").count() === 0
3. P2: inputValue("#valor_plataforma") === "R$ 2.500,00" (normalizando NBSP)
4. P2: helper text /dois mil e quinhentos reais/i
5. P2: helper text /1º de junho de 2026/i
6. BUG-003: expect.poll spinner desaparece em <=20s
7. BUG-008: zero console.error com /validateDOMNesting|cannot be a descendant.*button/i
8. P1: AlertDialog body contém /1 contrato/i e NÃO contém /2 documentos/i
9. P1: Banner "+ Adicionar este contato" presente

### Screenshots-chave atualizados (substituiram os antigos)

- 11-wizard-step2-tudo-preenchido.png — formulário com máscaras
- 14-wizard-step3-gerar.png — passo 3 antes de gerar
- 15-wizard-step3-preview-renderizado.png — banner sugestão + "16 de 18" + "Contrato gerado com sucesso!"
- 16-send-to-signature-area.png — área SendToSignature
- 17-send-to-signature-preenchido.png — 1 signatário
- 18-alert-dialog-pre-envio.png — AlertDialog "1 contrato"
- _input-values-after-fill.json — snapshot pós-máscaras
- _helpers-extenso.txt — helpers de extenso
- _console-errors.json — só 401s Supabase + warning NotFound
- _console-errors-regression.json — idem; zero validateDOMNesting

### Bugs em aberto

Nenhum bug regredido detectado.

### Observações

1. Console 401s do Supabase: esperados (JWT fake). Não é regressão.
2. NBSP em valores monetários: Intl.NumberFormat('pt-BR') usa non-breaking-space. Asserções normalizam.
3. valor_setup sem input visível no template Oxy Modelo 1: template usa só {{valor_extenso_setup}} que está em AUTO_FILLED_KEYS. Não é regressão (já era assim antes). Vale revisar se user deveria conseguir informar o valor numérico do setup. Flag pro PM.

---

## Smoke inicial (antes dos fixes — 2026-05-12 manhã)

Suite original e2e/smoke.spec.ts identificou os 14 bugs catalogados acima.
