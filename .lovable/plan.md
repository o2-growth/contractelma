

# Integração com Autentique — Envio de Contratos para Assinatura Digital

## O que é necessário

### 1. API Key da Autentique
- Você precisa gerar uma chave de API no painel da Autentique: [painel.autentique.com.br/perfil/api](https://painel.autentique.com.br/perfil/api)
- A API usa GraphQL no endpoint `https://api.autentique.com.br/v2/graphql`
- Rate limit: 60 requisições por minuto

### 2. Informações dos signatários
Para cada pessoa que precisa assinar, a Autentique aceita:
- **Email** — envia link de assinatura por email automaticamente
- **Nome** — retorna um link de assinatura que você pode compartilhar manualmente
- **Telefone** — envia por WhatsApp ou SMS

### 3. Arquivo do contrato
- A API aceita upload de arquivo (PDF, DOCX, etc.)
- O contrato gerado no sistema precisa ser convertido para PDF antes do envio

## Plano de implementação

### Etapa 1: Armazenar a API Key
- Usar o gerenciamento de secrets do projeto para guardar `AUTENTIQUE_API_KEY` de forma segura
- Acessível apenas pela edge function (nunca exposta no frontend)

### Etapa 2: Criar edge function `send-to-autentique`
- Recebe: conteúdo do contrato (markdown/texto), lista de signatários (nome, email, ação)
- Converte o conteúdo para PDF (usando uma lib como `jspdf` ou gerando HTML e convertendo)
- Envia para a API GraphQL da Autentique via mutation `createDocument` com upload multipart
- Retorna: ID do documento, links de assinatura de cada signatário

### Etapa 3: Adicionar passo no wizard (ou botão no preview)
- Após gerar o contrato, mostrar opção "Enviar para assinatura"
- Formulário para adicionar signatários (nome, email, ação: SIGN/APPROVE/WITNESS)
- Botão de envio que chama a edge function
- Exibir status e links de assinatura retornados

### Etapa 4: Acompanhamento de status (opcional/futuro)
- Consultar status do documento via API da Autentique
- Mostrar no histórico se o contrato foi assinado ou está pendente

## Detalhes técnicos

### Mutation GraphQL para criar documento na Autentique
```text
mutation CreateDocumentMutation(
  $document: DocumentInput!,
  $signers: [SignerInput!]!,
  $file: Upload!
) {
  createDocument(
    document: $document,
    signers: $signers,
    file: $file
  ) {
    id
    name
    signatures {
      public_id
      name
      email
      action { name }
      link { short_link }
    }
  }
}
```

A requisição usa multipart/form-data (padrão GraphQL Upload) com as variáveis:
- `document`: `{ "name": "Nome do contrato" }`
- `signers`: `[{ "email": "pessoa@email.com", "action": "SIGN" }]`
- `file`: arquivo PDF do contrato

### Ações de signatário suportadas
- `SIGN` — assinar
- `APPROVE` — aprovar
- `RECOGNIZE` — reconhecer/testemunhar
- `SIGN_AS_A_PARTY` — assinar como parte
- `RECEIPT` — acusar recebimento

## Próximo passo
Antes de implementar, preciso que você gere sua API Key no painel da Autentique para que eu possa armazená-la de forma segura no projeto.

