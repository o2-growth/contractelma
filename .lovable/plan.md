## Criar conta para lucas.ilha@o2inc.com.br

Passos:

1. Inserir usuário diretamente em `auth.users` via migração SQL, com:
   - email: `lucas.ilha@o2inc.com.br`
   - senha: `Alterar@01` (hash bcrypt via `crypt()`)
   - `email_confirmed_at = now()` (já confirmado, pode logar direto)
   - `aud = 'authenticated'`, `role = 'authenticated'`
   - identidade correspondente em `auth.identities`

2. Não atribuir nenhum papel especial (usuário comum). Caso queira super_admin, me avise.

### Detalhes técnicos
Usarei `supabase--migration` com `INSERT INTO auth.users ... crypt('Alterar@01', gen_salt('bf'))` e o `INSERT` correspondente em `auth.identities` com `provider='email'`.