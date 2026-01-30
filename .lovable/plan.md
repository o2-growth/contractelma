
# Plano: Sistema Completo de Geração de Contratos

## Visao Geral

Implementar toda a logica funcional do sistema ContractFlow, incluindo:
1. Modelo de contrato padrao com placeholders que serao substituidos pelos dados extraidos
2. Extracao inteligente de dados de documentos do cliente (PDF/DOC/ficha cadastral) usando IA
3. Editor de produtos com calculos automaticos
4. Aba de condicoes de pagamento
5. Geracao real de documentos DOCX e PDF

---

## Arquitetura da Solucao

```text
+------------------+      +-------------------+      +------------------+
|   Upload Doc     | ---> |   Edge Function   | ---> |   Dados          |
|   Cliente        |      |   extract-data    |      |   Extraidos      |
+------------------+      |   (Lovable AI)    |      +------------------+
                          +-------------------+
                                   |
                                   v
+------------------+      +-------------------+      +------------------+
|   Template       | ---> |   Edge Function   | ---> |   Download       |
|   + Dados        |      |   generate-doc    |      |   DOCX/PDF       |
|   + Produtos     |      |   (docx-templater)|      +------------------+
|   + Pagamento    |      +-------------------+
+------------------+
```

---

## Fase 1: Banco de Dados

### Tabelas a criar:

**templates** - Armazena templates de contrato
- id, user_id, name, description, content (texto do template)
- placeholders (JSONB com campos disponiveis)
- created_at, updated_at

**contracts** - Contratos gerados
- id, user_id, template_id
- client_data (JSONB com dados do cliente)
- products (JSONB com lista de produtos)
- payment_terms, special_notes
- total_value
- generated_file_url
- status (draft, generated, sent)
- created_at

**extraction_logs** - Historico de extracoes
- id, contract_id
- original_file_url
- extracted_data (JSONB)
- confidence_score
- manual_corrections

### RLS Policies:
- Usuarios so podem ver/editar seus proprios templates e contratos

---

## Fase 2: Storage Bucket

Criar bucket `documents` para:
- Upload de documentos do cliente (PDFs, imagens, fichas)
- Armazenar contratos gerados (DOCX, PDF)

---

## Fase 3: Edge Function - Extracao de Dados

**Funcao:** `extract-client-data`

Usa Lovable AI (modelos suportados sem API key) para:
1. Receber documento uploadado (PDF, DOC, imagem)
2. Extrair texto do documento
3. Usar IA para identificar campos:
   - Nome completo
   - CPF
   - RG
   - Endereco completo
   - Telefone
   - Email
   - Data de nascimento
   - Estado civil
   - Profissao
4. Retornar dados estruturados com nivel de confianca

```text
Prompt de extracao:
"Analise o documento e extraia os seguintes campos:
- NOME, CPF, RG, ENDERECO, TELEFONE, EMAIL, NASCIMENTO, ESTADO_CIVIL, PROFISSAO
Retorne JSON com os dados encontrados e nivel de confianca (0-1)"
```

---

## Fase 4: Edge Function - Geracao de Documento

**Funcao:** `generate-contract`

1. Recebe dados do contrato (cliente, produtos, pagamento)
2. Busca template do banco
3. Substitui todos os placeholders:
   - `{{NOME}}` -> dados do cliente
   - `{{CPF}}` -> dados do cliente
   - `{{PRODUTOS}}` -> tabela formatada
   - `{{VALOR_TOTAL}}` -> soma calculada
   - `{{FORMA_PAGAMENTO}}` -> condicoes definidas
   - `{{DATA}}` -> data atual
4. Gera arquivo DOCX usando docx-templater
5. Converte para PDF (opcional)
6. Salva no Storage
7. Retorna URLs para download

---

## Fase 5: Interface do Wizard (Atualizacoes)

### Step 1: Selecao de Template
- Buscar templates do banco de dados
- Mostrar preview do template selecionado
- Destacar placeholders que serao preenchidos

### Step 2: Dados do Cliente (ClientDataImport)
- Upload de documento (drag-drop funcional)
- Chamar Edge Function para extracao com IA
- Mostrar dados extraidos com indicador de confianca
- Permitir edicao manual de cada campo
- Campos mapeados para os placeholders do template:
  - Nome, CPF, RG, Endereco, Telefone, Email
  - Data nascimento, Estado civil, Profissao

### Step 3: Produtos (ProductsEditor)
- Tabela editavel ja funcional
- Adicionar validacao de campos obrigatorios
- Calculos automaticos funcionando
- Formatacao de moeda BRL

### Step 4: Condicoes de Pagamento (PaymentTerms)
- Campo para forma de pagamento
- Sugestoes rapidas (a vista, parcelado, etc)
- Campo para observacoes especiais
- Preview de como ficara no contrato
- Adicionar parcelas customizadas:
  - Numero de parcelas
  - Valor de entrada
  - Datas de vencimento

### Step 5: Preview e Geracao (ContractPreview)
- Renderizar contrato completo com todos os dados
- Destacar campos preenchidos
- Botao "Gerar DOCX" -> chama Edge Function
- Botao "Gerar PDF" -> chama Edge Function
- Download direto do arquivo
- Salvar no historico

---

## Fase 6: Historico de Contratos

- Listar contratos do banco de dados
- Filtrar por status, data, cliente
- Botao para baixar novamente
- Botao para duplicar/editar

---

## Mapeamento de Placeholders do Template

Quando voce enviar o documento padrao, vou mapear os campos em CAPSLOCK:

| Campo no Template | Placeholder | Origem |
|-------------------|-------------|--------|
| NOME | `{{nome}}` | Extracao IA |
| CPF | `{{cpf}}` | Extracao IA |
| ENDERECO | `{{endereco}}` | Extracao IA |
| TELEFONE | `{{telefone}}` | Extracao IA |
| EMAIL | `{{email}}` | Extracao IA |
| PRODUTOS | `{{produtos}}` | Tabela de produtos |
| VALOR_TOTAL | `{{valor_total}}` | Calculo automatico |
| FORMA_PAGAMENTO | `{{forma_pagamento}}` | Aba de pagamento |
| DATA | `{{data}}` | Data atual |
| OBSERVACOES | `{{observacoes}}` | Campo especial |

---

## Detalhes Tecnicos

### Stack utilizada:
- **Frontend**: React + TypeScript + Tailwind (ja configurado)
- **Backend**: Lovable Cloud (Supabase)
- **IA**: Lovable AI (gemini-2.5-flash para extracao)
- **Geracao DOCX**: docx-templater via Edge Function
- **Storage**: Bucket privado para documentos

### Seguranca:
- RLS em todas as tabelas
- Autenticacao obrigatoria para usar o sistema
- URLs assinadas para download de arquivos
- Validacao de tipos de arquivo no upload

---

## Proximo Passo

Por favor, envie o documento de contrato padrao (Word ou texto) com os campos em CAPSLOCK marcados. Com ele eu poderei:

1. Identificar todos os placeholders necessarios
2. Criar o template no banco de dados
3. Configurar a extracao de IA para os campos corretos
4. Implementar a geracao do documento final

Apos aprovacao deste plano, implementarei:
1. Tabelas do banco de dados com RLS
2. Storage bucket para documentos
3. Edge Function de extracao com IA
4. Edge Function de geracao DOCX/PDF
5. Atualizacao dos componentes do wizard
6. Integracao completa end-to-end

