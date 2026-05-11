-- ============================================================================
-- (1) Promove joao.victor@o2inc.com.br a super_admin
-- (2) Adiciona policy ADITIVA para super_admins enxergarem TODOS os contratos
--     e templates (necessário pra ver os contratos gerados pelo webhook Pipefy)
--
-- ESTRITAMENTE ADITIVA:
--   - INSERT com ON CONFLICT DO NOTHING (não duplica)
--   - CREATE POLICY (apenas adiciona uma policy adicional — NÃO altera nem
--     remove a policy "Users can view their own contracts" existente)
--   - Resultado: cada user continua vendo os SEUS, e super_admins veem TUDO
-- ============================================================================

-- (1) Promove o user joao.victor@o2inc.com.br a super_admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'::public.app_role
FROM auth.users
WHERE email = 'joao.victor@o2inc.com.br'
ON CONFLICT (user_id, role) DO NOTHING;

-- (2) Policy ADITIVA: super_admins veem TODOS os contratos
-- (PostgreSQL avalia múltiplas policies SELECT como OR — qualquer uma que
-- retorne true permite leitura. A policy original "Users can view their own
-- contracts" continua intacta.)
DROP POLICY IF EXISTS "Super admins can view all contracts" ON public.contracts;
CREATE POLICY "Super admins can view all contracts"
ON public.contracts FOR SELECT
USING (public.has_role(auth.uid(), 'super_admin'));

-- (3) Policy ADITIVA: super_admins também veem TODOS os templates
-- (útil quando templates do sistema têm user_id do super_admin original)
DROP POLICY IF EXISTS "Super admins can view all templates" ON public.templates;
CREATE POLICY "Super admins can view all templates"
ON public.templates FOR SELECT
USING (public.has_role(auth.uid(), 'super_admin'));

-- (4) Policy ADITIVA: super_admins veem TODOS os extraction_logs
DROP POLICY IF EXISTS "Super admins can view all extraction_logs" ON public.extraction_logs;
CREATE POLICY "Super admins can view all extraction_logs"
ON public.extraction_logs FOR SELECT
USING (public.has_role(auth.uid(), 'super_admin'));
