## Situação atual

A edge function `render-contract-docx` **já existe** no código (`supabase/functions/render-contract-docx/index.ts`), mas:
- Não está declarada no `supabase/config.toml` com `verify_jwt = false` (por isso pode estar exigindo JWT no invoke)
- Pode não ter sido deployada ainda

## Plano

1. **Adicionar bloco no `supabase/config.toml`:**
   ```toml
   [functions.render-contract-docx]
   verify_jwt = false
   ```
   Isso alinha ao padrão das outras functions (`generate-contract`, `analyze-template`, etc.) e permite invocar sem token.

2. **Fazer deploy da function** `render-contract-docx` para garantir que está publicada e atualizada com o código atual (download do template do bucket `documents`, substituição de placeholders `{{...}}` em snake_case/UPPER/lower, retorno em base64).

3. **Testar via curl** com o payload exato que você forneceu (`templates/base/saas-oxy-genio-modelo1.docx` + `clientData`), validar:
   - HTTP 200 + `success: true`
   - `fileName`, `mimeType` e `base64` presentes
   - Conferir logs caso retorne erro (ex.: arquivo não existe no Storage no path indicado)

4. **Reportar o resultado** com `sizeBytes` e qualquer ajuste necessário (ex.: caminho do template no bucket).

## Observação

Não há necessidade de criar arquivos novos — só adicionar a configuração do `verify_jwt`, deployar e testar.
