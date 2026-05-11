ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS pipefy_card_id TEXT;
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS pipefy_phase_id TEXT;
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS pipefy_data JSONB DEFAULT '{}'::jsonb;
CREATE UNIQUE INDEX IF NOT EXISTS idx_contracts_pipefy_card_id ON public.contracts (pipefy_card_id) WHERE pipefy_card_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contracts_pipefy_phase_id ON public.contracts (pipefy_phase_id) WHERE pipefy_phase_id IS NOT NULL;