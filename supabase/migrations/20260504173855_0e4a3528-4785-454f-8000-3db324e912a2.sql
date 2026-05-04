
-- Audit logs table
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create','update','delete','restore')),
  changed_fields JSONB DEFAULT '[]'::jsonb,
  old_values JSONB DEFAULT '{}'::jsonb,
  new_values JSONB DEFAULT '{}'::jsonb,
  entity_snapshot JSONB DEFAULT '{}'::jsonb,
  entity_owner_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id, created_at DESC);
CREATE INDEX idx_audit_logs_owner ON public.audit_logs(entity_owner_id, created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only owners can view their logs. No insert/update/delete from clients.
CREATE POLICY "Users can view audit logs of their entities"
ON public.audit_logs FOR SELECT
USING (auth.uid() = entity_owner_id);

-- Generic trigger function
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_entity_type TEXT := TG_ARGV[0];
  v_old JSONB;
  v_new JSONB;
  v_changed JSONB := '[]'::jsonb;
  v_old_diff JSONB := '{}'::jsonb;
  v_new_diff JSONB := '{}'::jsonb;
  v_owner UUID;
  v_entity_id UUID;
  v_key TEXT;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    v_old := to_jsonb(OLD);
    v_owner := OLD.user_id;
    v_entity_id := OLD.id;
    INSERT INTO public.audit_logs(user_id, entity_type, entity_id, action, entity_snapshot, entity_owner_id, old_values)
    VALUES (auth.uid(), v_entity_type, v_entity_id, 'delete', v_old, v_owner, v_old);
    RETURN OLD;

  ELSIF (TG_OP = 'INSERT') THEN
    v_new := to_jsonb(NEW);
    v_owner := NEW.user_id;
    v_entity_id := NEW.id;
    INSERT INTO public.audit_logs(user_id, entity_type, entity_id, action, entity_snapshot, entity_owner_id, new_values)
    VALUES (auth.uid(), v_entity_type, v_entity_id, 'create', v_new, v_owner, v_new);
    RETURN NEW;

  ELSIF (TG_OP = 'UPDATE') THEN
    v_old := to_jsonb(OLD);
    v_new := to_jsonb(NEW);
    v_owner := NEW.user_id;
    v_entity_id := NEW.id;

    FOR v_key IN SELECT jsonb_object_keys(v_new) LOOP
      IF v_key IN ('updated_at') THEN CONTINUE; END IF;
      IF (v_old->v_key) IS DISTINCT FROM (v_new->v_key) THEN
        v_changed := v_changed || to_jsonb(v_key);
        v_old_diff := v_old_diff || jsonb_build_object(v_key, v_old->v_key);
        v_new_diff := v_new_diff || jsonb_build_object(v_key, v_new->v_key);
      END IF;
    END LOOP;

    IF jsonb_array_length(v_changed) = 0 THEN
      RETURN NEW;
    END IF;

    INSERT INTO public.audit_logs(user_id, entity_type, entity_id, action, changed_fields, old_values, new_values, entity_snapshot, entity_owner_id)
    VALUES (auth.uid(), v_entity_type, v_entity_id, 'update', v_changed, v_old_diff, v_new_diff, v_old, v_owner);
    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$;

CREATE TRIGGER contracts_audit
AFTER INSERT OR UPDATE OR DELETE ON public.contracts
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event('contract');

CREATE TRIGGER templates_audit
AFTER INSERT OR UPDATE OR DELETE ON public.templates
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event('template');
