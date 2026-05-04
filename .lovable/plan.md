# Sistema de Auditoria e Histórico de Edições

## Objetivo
Registrar todas as alterações feitas em **contratos** e **templates** (criação, edição, exclusão), permitindo:
- Visualizar quem alterou o quê e quando
- Ver o estado anterior de cada campo
- **Reverter** uma alteração específica (restaurar versão anterior)

## Sobre o GitHub
O GitHub conectado já versiona o **código** da plataforma — então alterações de código já têm histórico/rollback nativo (via aba History do Lovable ou git). Esta auditoria foca nos **dados** (contratos e templates editados pelos usuários dentro da plataforma), que o GitHub não cobre.

---

## Parte 1: Banco de Dados

Criar tabela `audit_logs`:

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid | quem fez a alteração |
| `entity_type` | text | `contract` ou `template` |
| `entity_id` | uuid | id do registro alterado |
| `action` | text | `create`, `update`, `delete` |
| `changed_fields` | jsonb | array de campos alterados (ex: `["status","client_data"]`) |
| `old_values` | jsonb | snapshot dos valores antigos (apenas dos campos alterados) |
| `new_values` | jsonb | snapshot dos novos valores |
| `entity_snapshot` | jsonb | snapshot completo do registro (para restaurar) |
| `created_at` | timestamptz | |

**RLS**: usuário só lê logs das próprias entidades. Inserção feita por triggers (bypass de RLS).

**Triggers automáticos** em `contracts` e `templates`:
- `AFTER INSERT` → registra `create` com `entity_snapshot`
- `AFTER UPDATE` → calcula campos alterados, registra `update` com `old_values`/`new_values`/`entity_snapshot` (do estado anterior)
- `AFTER DELETE` → registra `delete` com snapshot completo

Trigger usa `auth.uid()` para capturar o usuário automaticamente.

---

## Parte 2: Interface

### 2.1 Nova página `/auditoria` (Histórico de Alterações)
- Lista cronológica de todos os logs do usuário
- Filtros: tipo (contrato/template), ação (criar/editar/excluir), período
- Cada item mostra: ícone da ação, nome da entidade, campos alterados, data/hora
- Ao clicar → abre painel lateral com **diff** (antes vs depois) campo a campo

### 2.2 Botão "Restaurar esta versão"
- Disponível em logs de `update` e `delete`
- Confirmação antes de aplicar
- Restaura usando `entity_snapshot` (cria um novo log de `update` com a restauração)
- Para `delete`: re-cria o registro com mesmo id

### 2.3 Aba "Histórico" dentro do contrato/template
- Ao abrir um contrato existente, nova aba mostra apenas os logs daquela entidade
- Mesma funcionalidade de diff e restauração

### 2.4 Sidebar
- Adicionar item "Auditoria" no menu lateral (`Sidebar.tsx`)

---

## Arquivos a criar/editar

| Arquivo | Mudança |
|---|---|
| Migração SQL | nova tabela `audit_logs` + triggers |
| `src/pages/AuditLog.tsx` | nova página de auditoria |
| `src/components/audit/AuditDiffPanel.tsx` | painel de diff lateral |
| `src/components/audit/AuditList.tsx` | lista de eventos reutilizável |
| `src/components/audit/RestoreButton.tsx` | botão + confirmação de restauração |
| `src/components/layout/Sidebar.tsx` | item "Auditoria" |
| `src/App.tsx` | rota `/auditoria` |
| `src/integrations/supabase/types.ts` | regenera automaticamente |

---

## Notas técnicas
- Os triggers rodam com `SECURITY DEFINER` para conseguir inserir em `audit_logs` ignorando RLS
- `auth.uid()` dentro do trigger captura o usuário autenticado da sessão atual
- `entity_snapshot` guarda o registro **antes** da alteração, então restaurar = aplicar esse snapshot de volta
- Restauração feita via `UPDATE` normal do client (que por sua vez gera novo log) — mantém a trilha íntegra
- Não precisa de Edge Function: tudo via triggers + queries diretas com RLS
