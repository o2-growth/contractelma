

# Plano: Atualizar Templates com Contratos Reais da O2 Inc

## Resumo
Substituir o conteúdo dos 3 templates existentes (`cfo-enterprise`, `saas-oxy-genio`, `saas-oxy-genio-especialista`) no arquivo `src/constants/contractTemplates.ts` com o conteúdo completo dos documentos DOCX enviados, convertendo os marcadores originais (`[CLIENTE]`, `[CNPJ]`, etc.) para o formato de variáveis do sistema (`{{CLIENTE}}`, `{{CNPJ}}`, etc.).

## Mapeamento de Variáveis

| Original no documento | Variável no sistema | Descrição |
|---|---|---|
| `[CLIENTE]` | `{{CLIENTE}}` | Nome da empresa contratante |
| `[CNPJ]` | `{{CNPJ}}` | CNPJ da contratante |
| `[ENDEREÇO COMPLETO]` | `{{ENDERECO_EMPRESA}}` | Endereço completo da empresa |
| `[NOME DO SÓCIO]` | `{{SOCIO}}` | Nome do representante legal |
| `[CPF]` | `{{CPF}}` | CPF do representante |
| `[VALOR]` (setup) | `{{VALOR_SETUP}}` | Valor do setup |
| `[VALOR]` (mensalidade) | `{{VALOR_MENSALIDADE}}` | Valor da mensalidade |
| `[VALOR/12]` | `{{VALOR_PARCELA_SETUP}}` | Parcela do setup (CFO) |
| `[DATA]` | `{{DATA}}` | Data do contrato |
| `[X]` (dias aviso) | `{{AVISO_PREVIO_DIAS}}` | Dias de aviso prévio |

## O que muda

### Arquivo: `src/constants/contractTemplates.ts`
Atualizar o conteúdo dos 3 templates com o texto completo dos contratos reais, incluindo:
- **Página 1**: Qualificação das partes + tabela de condições (com variáveis)
- **Páginas 2-3**: Descritivo completo do serviço (Setup, módulos, entregáveis)
- **Páginas 3-5**: MSA completo (pagamento, obrigações, confidencialidade, rescisão, disposições gerais, foro)
- **Bloco de assinaturas**: Contratante, Contratada e Testemunhas

Os demais templates (Diagnóstico, Plano Anual, Parceria, etc.) permanecem inalterados.

