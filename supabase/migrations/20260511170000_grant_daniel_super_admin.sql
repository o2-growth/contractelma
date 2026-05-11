-- ============================================================================
-- Adiciona daniel.trindade@o2inc.com.br à lista de auto-super_admins.
--
-- ESTRITAMENTE ADITIVA:
--   - Atualiza a função grant_super_admin_on_signup via CREATE OR REPLACE
--     para incluir mais um email na lista. NÃO remove os existentes (andrey
--     continua sendo promovido, joao.victor também).
--   - INSERT em user_roles caso Daniel já tenha conta (ON CONFLICT DO NOTHING).
-- ============================================================================

-- (1) Atualiza a trigger function pra promover daniel.trindade automaticamente
CREATE OR REPLACE FUNCTION public.grant_super_admin_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IN (
    'andrey.lopes@o2inc.com.br',
    'daniel.trindade@o2inc.com.br',
    'joao.victor@o2inc.com.br'
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'super_admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- (2) Se Daniel já tem conta, promove agora
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'::public.app_role
FROM auth.users
WHERE email = 'daniel.trindade@o2inc.com.br'
ON CONFLICT (user_id, role) DO NOTHING;
