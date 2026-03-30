

# Novo Modelo Padrão de Contrato baseado no DOCX

## Contexto
O documento DOCX enviado tem formatação profissional com logo O2 INC, QUADRO RESUMO em tabela, cláusulas detalhadas, e bloco de assinatura. A abordagem atual (gerar PDF do zero com operadores PDF) nunca vai reproduzir essa qualidade. A solução correta é usar o próprio DOCX como base.

## Estratégia
Armazenar o DOCX original como template base no Storage. Na hora de enviar para assinatura, o edge function abre o DOCX (que é um ZIP de XMLs), substitui os marcadores `[preencher]`, `[dia]`, `[mês]`, `[ano]` por valores reais, e envia o DOCX resultante direto para a Autentique -- preservando 100% da formatação original (logo, tabelas, fontes, layout).

## Mudanças

### 1. Upload do DOCX para o Storage
Salvar o template DOCX no bucket `documents` do Storage como template base reutilizável.

### 2. Atualizar `contractTemplates.ts` -- template CFO as a Service
Atualizar o conteúdo markdown do template "CFO Enterprise" para refletir a estrutura do novo DOCX (QUADRO RESUMO com os campos corretos). Os campos editáveis identificados no DOCX:
- `RAZAO_SOCIAL`, `CNPJ`, `ENDERECO` (contratante)
- `NOME_REPRESENTANTE`, `CPF_REPRESENTANTE`, `EMAIL_REPRESENTANTE`
- `DESCRICAO_SERVICOS`
- `VALOR_SETUP`, `FORMA_PAGAMENTO_SETUP`, `CONDICOES_SETUP`
- `VALOR_CFO`, `FORMA_PAGAMENTO_CFO`, `CONDICOES_CFO`
- `PRAZO_VIGENCIA`, `PRAZO_RESCISAO`
- `DIA`, `MES`, `ANO` (data da assinatura)

### 3. Reescrever o edge function `send-to-autentique`
Em vez de gerar PDF do zero:
1. Baixar o DOCX template do Storage
2. Descompactar (JSZip disponível no Deno)
3. No XML `word/document.xml`, substituir os marcadores `[preencher]`, `[dia]`, `[mês]`, `[ano]` pelos valores enviados pelo frontend
4. Recompactar como DOCX
5. Enviar o DOCX diretamente para a API da Autentique (ela aceita DOCX)

Isso elimina todo o código de geração de PDF manual e garante formatação idêntica ao original.

### 4. Atualizar `SendToSignature` e `ContractPreview`
Passar os dados do cliente como payload estruturado para o edge function, incluindo mapeamento dos campos do QUADRO RESUMO.

### 5. Atualizar o preview ao vivo (`ContractLivePreview`)
Adaptar o preview markdown para refletir a nova estrutura com QUADRO RESUMO.

## Detalhes Técnicos

- **JSZip no Deno**: `import JSZip from "https://esm.sh/jszip@3.10.1"` -- funciona no edge function
- **Substituição XML**: Os marcadores `[preencher]` no DOCX ficam como texto simples dentro de `<w:t>` tags, facilitando o find-and-replace
- **Autentique aceita DOCX**: Basta mudar o content-type do upload de `application/pdf` para `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- **Storage path**: `templates/base/cfo-as-a-service.docx`

