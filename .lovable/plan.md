## Ativação da integração Pipefy

Verifiquei: o arquivo de migration e a edge function já estão no repo, mas as colunas `pipefy_*` ainda **não existem** na tabela `contracts` do banco, e o secret `PIPEFY_API_KEY` ainda não está configurado.

### Passos

1. **Aplicar migration no banco** (cria `pipefy_card_id`, `pipefy_phase_id`, `pipefy_data` + índices em `public.contracts`). Estritamente aditiva, sem risco para dados existentes.

2. **Configurar secret `PIPEFY_API_KEY`** via formulário seguro (você cola o token `eyJhbGci...` quando eu pedir).

3. **Deploy da edge function `pipefy-card-moved`** (já registrada em `supabase/config.toml` com `verify_jwt = false`).

4. **Verificação** via logs da function — peço pra você mover um card no Pipefy pra fase "Contrato em elaboração" e confirmo:
   - webhook respondeu 200
   - novo registro em `contracts` com `pipefy_card_id` preenchido e `status = 'draft'`
   - aparece em `/history`

### Observações

- Não vou recriar o webhook no Pipefy (id 300671623 já existe).
- Não vou alterar o código da function — só deploy.
- Ordem importa: secret antes do deploy, pra function já subir com a env var disponível.