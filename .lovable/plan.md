

# Melhorar UI/UX + Padronizar Todos os Templates no Novo Modelo

## Visão Geral

Duas frentes: (1) melhorias visuais e de fluxo em toda a plataforma, e (2) converter todos os 9 templates restantes para o formato QUADRO RESUMO do novo modelo DOCX, mantendo o conteúdo específico de cada contrato.

---

## Parte 1: Melhorias de UI/UX

### 1.1 Template Selection (Etapa 1 do Wizard)
- Adicionar ícones diferenciados por tipo de contrato (parceria, SaaS, M&A, etc.) em vez de todos terem o mesmo `FileText`
- Mostrar badge com a contagem de campos editáveis em cada card
- Adicionar busca/filtro rápido quando há muitos templates
- Melhorar espaçamento e hierarquia visual dos cards

### 1.2 Formulário de Dados (Etapa 2)
- Adicionar indicador de progresso (campos preenchidos / total) no topo do painel esquerdo
- Melhorar labels com tooltips explicativos nos campos mais complexos (ex: "PRAZO_RESCISAO" → tooltip "Prazo de aviso prévio para rescisão em dias")
- Adicionar validação visual inline (CNPJ, CPF, e-mail) com feedback em tempo real
- Botão "Limpar todos" para resetar o formulário

### 1.3 Preview e Geração (Etapa 3)
- Melhorar o layout do resumo lateral com cards mais claros
- Adicionar contagem de campos pendentes (não preenchidos) como alerta visual
- Melhorar os estados de loading e sucesso com animações mais suaves

### 1.4 Dashboard
- Adicionar empty state mais convidativo
- Melhorar responsividade dos stats cards

### 1.5 Navegação Global
- Adicionar breadcrumbs no wizard para orientação contextual
- Melhorar transições entre etapas

---

## Parte 2: Padronizar Templates no Novo Modelo

Cada template será convertido para usar a estrutura QUADRO RESUMO no topo, seguido do corpo do contrato. O padrão:

```text
# CONTRATO DE [TIPO] — [NOME DO SERVIÇO]

## QUADRO RESUMO

| Campo | Valor |
|-------|-------|
| **CONTRATANTE** | |
| Razão Social | {{RAZAO_SOCIAL}} |
| CNPJ | {{CNPJ}} |
| Endereço | {{ENDERECO}} |
| **REPRESENTANTE** | |
| Nome | {{NOME_REPRESENTANTE}} |
| CPF | {{CPF_REPRESENTANTE}} |
| E-mail | {{EMAIL_REPRESENTANTE}} |
| **REMUNERAÇÃO** | |
| [campos específicos do contrato] |
| **VIGÊNCIA** | |
| Prazo | {{PRAZO_VIGENCIA}} |
| Rescisão | {{PRAZO_RESCISAO}} |

---

[Corpo do contrato com cláusulas específicas mantidas]

---

São Paulo, {{DIA}} de {{MES}} de 20{{ANO}}
```

### Templates a converter (9 restantes):
1. **SaaS Oxy + Gênio + Especialista** — manter cláusulas de setup, plataforma e especialista; remuneração: VALOR_SETUP + VALOR_MENSALIDADE
2. **Plano Anual Oxigênio Empresarial** — manter cláusulas educacionais; remuneração: VALOR_TOTAL + FORMA_PAGAMENTO
3. **Parceria Oxy Hacker** — manter cláusulas de parceria; remuneração: VALOR_TOTAL
4. **Pré-COF Parceria** — manter cláusulas de parceria comercial; remuneração: VALOR_TOTAL
5. **M&A Sell Side** — manter escopo de venda; remuneração: VALOR_TOTAL + comissão 3.5%
6. **Financial Advisory** — manter escopo de consultoria; remuneração: VALOR_TOTAL
7. **CFO Enterprise (Modelo A)** — manter escopo simplificado; remuneração: VALOR_TOTAL
8. **Contrato Russowski** — manter genérico; remuneração: VALOR_TOTAL
9. **Parceria Oxy Hacker v2** — manter cláusulas de parceria; remuneração: VALOR_TOTAL

### Atualizar `availablePlaceholders`
Adicionar os novos campos padronizados ao array de placeholders:
- `RAZAO_SOCIAL`, `ENDERECO`, `NOME_REPRESENTANTE`, `CPF_REPRESENTANTE`, `EMAIL_REPRESENTANTE`
- `DIA`, `MES`, `ANO` (substituindo o `DATA` genérico)
- `PRAZO_VIGENCIA`, `PRAZO_RESCISAO`
- Manter campos específicos por template (ex: `VALOR_SETUP`, `VALOR_MENSALIDADE`)

---

## Arquivos Alterados

| Arquivo | Mudança |
|---------|---------|
| `src/constants/contractTemplates.ts` | Reescrever os 9 templates + atualizar `availablePlaceholders` |
| `src/components/wizard/steps/TemplateSelection.tsx` | Ícones diferenciados, badge de campos, filtro |
| `src/components/wizard/steps/ClientDataImport.tsx` | Barra de progresso, validação inline, tooltips |
| `src/components/wizard/steps/ContractPreview.tsx` | Layout do resumo, alertas de campos pendentes |
| `src/components/wizard/ContractWizard.tsx` | Breadcrumbs, transições |
| `src/pages/Dashboard.tsx` | Empty states, responsividade |

---

## Riscos e Mitigação

- **Risco**: Templates com campos diferentes quebrarem o formulário dinâmico → **Mitigação**: O sistema já detecta `{{VAR}}` dinamicamente, então novos campos são auto-descobertos
- **Risco**: Campos renomeados (ex: `CLIENTE` → `RAZAO_SOCIAL`) quebrarem dados existentes → **Mitigação**: Manter aliases no `availablePlaceholders` e no edge function de substituição

