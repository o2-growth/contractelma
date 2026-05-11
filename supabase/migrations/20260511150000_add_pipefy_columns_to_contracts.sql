-- ============================================================================
-- Adiciona colunas pipefy_* à tabela contracts para integração com o Pipefy.
--
-- ESTRITAMENTE ADITIVA — apenas ADD COLUMN com valores opcionais.
-- Não altera, deleta ou sobrescreve nenhum dado existente.
-- Idempotente (IF NOT EXISTS).
--
-- Uso: a edge function pipefy-card-moved popula essas colunas quando o card
-- entra na fase "Contrato em elaboração" no Pipe 304018800.
-- ============================================================================

ALTER TABLE public.contracts
  ADD COLUMN IF NOT EXISTS pipefy_card_id TEXT;

ALTER TABLE public.contracts
  ADD COLUMN IF NOT EXISTS pipefy_phase_id TEXT;

ALTER TABLE public.contracts
  ADD COLUMN IF NOT EXISTS pipefy_data JSONB DEFAULT '{}'::jsonb;

-- Index para evitar duplicatas: o mesmo card só pode gerar 1 contrato
-- (a edge function checa antes de inserir e, mesmo assim, garantimos com UNIQUE parcial)
CREATE UNIQUE INDEX IF NOT EXISTS idx_contracts_pipefy_card_id
  ON public.contracts (pipefy_card_id)
  WHERE pipefy_card_id IS NOT NULL;

-- Index para queries rápidas por fase
CREATE INDEX IF NOT EXISTS idx_contracts_pipefy_phase_id
  ON public.contracts (pipefy_phase_id)
  WHERE pipefy_phase_id IS NOT NULL;
