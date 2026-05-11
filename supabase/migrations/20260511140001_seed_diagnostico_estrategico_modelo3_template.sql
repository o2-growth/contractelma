-- ============================================================================
-- Seed do template "Diagnóstico Estratégico (Modelo 3 - Oficial)" para super_admins.
--
-- ESTRITAMENTE ADITIVA: apenas INSERT WHERE NOT EXISTS.
-- Não altera, deleta ou sobrescreve dados existentes. Idempotente.
--
-- DOCX oficial em: storage/documents/templates/base/diagnostico-estrategico-modelo3.docx
-- Total de placeholders: 17
-- ============================================================================

INSERT INTO public.templates (user_id, name, description, content, placeholders)
SELECT
  ur.user_id,
  'Diagnóstico Estratégico (Modelo 3 - Oficial)' AS name,
  'Modelo 3 oficial O2 Inc - Prestação de Serviços de Diagnóstico Estratégico (pagamento único parcelado, sem mensalidade)' AS description,
  $TEMPLATE$# CONTRATO DE PRESTAÇÃO DE SERVIÇOS — DIAGNÓSTICO ESTRATÉGICO

## QUADRO RESUMO

### CONTRATANTE

| Campo | Valor |
|-------|-------|
| **RAZÃO SOCIAL** | {{razao_social}} |
| **CNPJ** | {{cnpj}} |
| **ENDEREÇO** | {{endereco}} |

### REPRESENTANTE LEGAL DA CONTRATANTE

| NOME | CPF | E-MAIL |
|------|-----|--------|
| {{nome}} | {{cpf}} | {{email}} |

### SERVIÇOS CONTRATADOS

| Campo | Valor |
|-------|-------|
| **DESCRIÇÃO** | Prestação de Serviços de {{servico}} |

### REMUNERAÇÃO

| Campo | Valor |
|-------|-------|
| **VALOR** | {{valor_extenso_setup}} |
| **FORMA DE PAGAMENTO** | {{parcelas_valor_extenso}} via cartão de crédito, com tarifas já inclusas, iniciando em {{data_setup}}. |
| **CONDIÇÕES ESPECIAIS** | {{condicoes_especiais}} |

### VIGÊNCIA

| Campo | Valor |
|-------|-------|
| **INÍCIO DA VIGÊNCIA** | {{inicio_vigencia}} |
| **PRAZO DE VIGÊNCIA** | {{prazo_vigencia}} |
| **RESCISÃO** | Mediante aviso prévio de {{dias_rescisao}} dias. |

---

São Paulo/SP, {{dia}} de {{mes}} de 20{{ano}}.

| O2 INC GESTÃO E TECNOLOGIA S.A. | {{razao_social}} |
|---|---|
| CNPJ nº 23.813.779/0001-60 | CNPJ nº {{cnpj}} |
| [assinado digitalmente] | [assinado digitalmente] |
$TEMPLATE$ AS content,
  '["razao_social","cnpj","endereco","nome","cpf","email","servico","valor_extenso_setup","parcelas_valor_extenso","data_setup","condicoes_especiais","inicio_vigencia","prazo_vigencia","dias_rescisao","dia","mes","ano"]'::jsonb AS placeholders
FROM public.user_roles ur
WHERE ur.role = 'super_admin'
  AND NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.user_id = ur.user_id
      AND t.name = 'Diagnóstico Estratégico (Modelo 3 - Oficial)'
  );
