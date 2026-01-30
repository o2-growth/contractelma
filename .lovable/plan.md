
# Plano: Upload de Templates com Análise por IA

## Objetivo
Adicionar na página de Templates a capacidade de fazer upload de um documento (Word/PDF) e ter a IA analisando automaticamente para extrair o conteúdo e identificar os campos/placeholders existentes, deixando pré-configurado para edição ou confirmação.

## Funcionalidades a Implementar

### 1. Interface de Criação de Template Atualizada
Quando o usuário clicar em "Novo Template", será exibida uma tela com duas opções:
- **Upload de Modelo Existente** - Enviar um arquivo DOCX/PDF para análise
- **Criar do Zero** - Abrir o editor vazio (comportamento atual)

### 2. Fluxo de Upload e Análise por IA

```text
+------------------+      +------------------+      +------------------+
|   Upload File    | ---> |  Análise por IA  | ---> |  Template Editor |
|   (DOCX/PDF)     |      |  (Edge Function) |      |  (Pré-populado)  |
+------------------+      +------------------+      +------------------+
```

**Passos:**
1. Usuário faz upload do arquivo
2. Texto é extraído do documento
3. IA analisa e identifica:
   - Estrutura do contrato (parágrafos, cláusulas)
   - Campos que podem ser placeholders (CLIENTE, CNPJ, etc.)
   - Sugere substituições automáticas
4. Editor abre pré-populado com o conteúdo e placeholders sugeridos
5. Usuário pode revisar, ajustar e salvar

### 3. Nova Edge Function: `analyze-template`
Função dedicada para análise de templates de contrato:
- Recebe o texto do documento
- Usa IA para identificar padrões de campos (CLIENTE, CNPJ, valores em reais, datas)
- Retorna o conteúdo convertido com placeholders no formato `{{CAMPO}}`
- Retorna lista de campos detectados para exibição

## Componentes a Criar/Modificar

### Arquivos Novos
| Arquivo | Descrição |
|---------|-----------|
| `supabase/functions/analyze-template/index.ts` | Edge Function para análise de templates com IA |
| `src/components/templates/TemplateUpload.tsx` | Componente de upload com drag & drop |

### Arquivos a Modificar
| Arquivo | Mudança |
|---------|---------|
| `src/pages/Templates.tsx` | Adicionar fluxo de seleção entre upload e criar do zero |
| `src/components/templates/TemplateEditor.tsx` | Receber campos detectados e exibir sugestões |
| `supabase/config.toml` | Registrar nova Edge Function |

### Correção: 12 Templates
Verificar o arquivo `contractTemplates.ts` e garantir que contenha exatamente os 12 modelos corretos.

## Detalhes Técnicos

### Edge Function `analyze-template`
```text
Input:
- documentText: string (texto extraído do arquivo)
- documentName: string (nome do arquivo para contexto)

Output:
- content: string (texto com placeholders aplicados)
- detectedFields: Array<{key, originalValue, confidence}>
- structureInfo: {paragraphs, clauses, hasSignatureBlock}
```

### Prompt da IA para Análise
A IA será instruída a:
1. Manter a estrutura original do documento
2. Identificar padrões como:
   - Nomes de empresas em CAPS LOCK ou após "CLIENTE:"
   - CNPJs no formato XX.XXX.XXX/XXXX-XX
   - Valores monetários (R$ X.XXX,XX)
   - Datas por extenso ou numéricas
   - Endereços completos
3. Substituir valores identificados por placeholders padrão (`{{CLIENTE}}`, `{{CNPJ}}`, etc.)
4. Retornar a lista de substituições feitas

### Interface de Upload
- Área de drag & drop similar ao `ClientDataImport`
- Suporte a .docx, .doc, .pdf, .txt
- Indicador de progresso durante análise
- Preview dos campos detectados antes de abrir o editor

## Estimativa de Implementação
- Nova Edge Function: `analyze-template`
- Componente de upload: `TemplateUpload.tsx`
- Atualização da página Templates
- Atualização do TemplateEditor para mostrar campos sugeridos
- Correção para exibir exatamente 12 templates do sistema
