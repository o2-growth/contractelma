import type { Template } from "@/components/wizard/ContractWizard";

// All contract templates for O2 Inc products/services
export const defaultTemplates: Template[] = [
  {
    id: "cfo-enterprise",
    name: "CFO as a Service",
    description: "Assessoria de Gestão Financeira Recorrente - CFO as a Service (modelo DOCX)",
    createdAt: "Modelo do sistema",
    category: "cfo",
    docxTemplate: "templates/base/cfo-as-a-service.docx",
    content: `# CONTRATO DE PRESTAÇÃO DE SERVIÇOS — CFO AS A SERVICE

## QUADRO RESUMO

| Campo | Valor |
|-------|-------|
| **CONTRATANTE** | |
| Razão Social | {{RAZAO_SOCIAL}} |
| CNPJ | {{CNPJ}} |
| Endereço | {{ENDERECO}} |
| **REPRESENTANTE LEGAL** | |
| Nome | {{NOME_REPRESENTANTE}} |
| CPF | {{CPF_REPRESENTANTE}} |
| E-mail | {{EMAIL_REPRESENTANTE}} |
| **REMUNERAÇÃO DO SETUP** | |
| Valor | {{VALOR_SETUP}} |
| Forma de Pagamento | {{FORMA_PAGAMENTO_SETUP}} |
| Condições Especiais | {{CONDICOES_SETUP}} |
| **REMUNERAÇÃO DO CFO AS A SERVICE** | |
| Valor | {{VALOR_CFO}} |
| Forma de Pagamento | {{FORMA_PAGAMENTO_CFO}} |
| Condições Especiais | {{CONDICOES_CFO}} |
| **VIGÊNCIA** | |
| Prazo | {{PRAZO_VIGENCIA}} |
| Rescisão (aviso prévio) | {{PRAZO_RESCISAO}} |

---

São Paulo, {{DIA}} de {{MES}} de 20{{ANO}}
`,
  },
  {
    id: "saas-oxy-genio-especialista",
    name: "SaaS Oxy + Gênio + Especialista",
    description: "Plataforma Oxy com IA e acompanhamento de especialista O2",
    createdAt: "Modelo do sistema",
    category: "saas",
    content: `# CONTRATO DE PRESTAÇÃO DE SERVIÇOS — SAAS OXY + GÊNIO + ESPECIALISTA

## QUADRO RESUMO

| Campo | Valor |
|-------|-------|
| **CONTRATANTE** | |
| Razão Social | {{RAZAO_SOCIAL}} |
| CNPJ | {{CNPJ}} |
| Endereço | {{ENDERECO}} |
| **REPRESENTANTE LEGAL** | |
| Nome | {{NOME_REPRESENTANTE}} |
| CPF | {{CPF_REPRESENTANTE}} |
| E-mail | {{EMAIL_REPRESENTANTE}} |
| **REMUNERAÇÃO** | |
| Valor do Setup | {{VALOR_SETUP}} |
| Mensalidade (Oxy + Gênio + Especialista) | {{VALOR_MENSALIDADE}} |
| Aviso prévio para cancelamento | {{AVISO_DIAS}} dias |
| **VIGÊNCIA** | |
| Prazo | {{PRAZO_VIGENCIA}} |
| Rescisão (aviso prévio) | {{PRAZO_RESCISAO}} |

---

## Contratada

O2 INC GESTÃO E TECNOLOGIA S.A., sociedade anônima, inscrita no CNPJ sob nº 23.813.779/0001-60, com sede na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, São Paulo/SP, endereço de e-mail cs@o2inc.com.br, doravante designada CONTRATADA.

---

## DESCRITIVO DO SERVIÇO

### Módulo: SETUP

**Duração:** até 90 dias após o kick-off

**Encontros:** Touch point semanal (reunião ou contato telefônico/WhatsApp)

**Encontros obrigatórios:** 4 encontros iniciais para entrevistas e compreensão dos processos

### Entregáveis do SETUP

- a) PLANO DE CONTAS — Análise do Plano de Contas atual, otimizações e suporte técnico
- b) DADOS — Checklist dos processos, entrevistas financeiras, identificação de melhorias
- c) ERP — Análise do sistema, pré-requisitos, subutilizações e melhorias
- d) TECNOLOGIA — Integração ERP → Oxy, validação e liberação de acessos

---

### Módulo: PLATAFORMA OXY + GÊNIO (IA)

- a) Aba DRE: análises vertical, horizontal e mensal; gráficos; comparação de períodos
- b) Aba Fluxo de Caixa: análise mensal; curva ABC; projeções diárias
- c) Ciclo Financeiro: indicadores PMP, PME, PMR; análises por cliente/fornecedor
- d) Planejamento Orçamentário: projeções com histórico; orçado x realizado
- e) Agente de IA (Gênio): questionamentos em tempo real; insights instantâneos

---

### Módulo: ESPECIALISTA O2 INC

**Encontros:** 4 encontros por mês (semanais), virtuais, mediante agendamento

### Regras do Especialista

- f) Encontros agendados pela CONTRATANTE conforme disponibilidade da agenda (via link)
- g) Assessoria financeira ocorre exclusivamente durante os encontros, com base na Oxy e Gênio
- h) Não inclui trabalhos manuais, materiais em ferramentas paralelas ou atividades fora dos encontros
- i) Encontros não comparecidos não são passíveis de reagendamento ou compensação
- j) Horas não utilizadas no mês não são cumulativas para meses seguintes

**Diretrizes:** A CONTRATADA não se responsabiliza por inconsistências nos dados ou atrasos decorrentes do não cumprimento das ações sugeridas. Recomenda-se dupla verificação dos insights.

---

## MASTER SERVICE AGREEMENT

### 1. FORMA DE PAGAMENTO

1.1 O SETUP é exigível no ato da assinatura: (a) à vista via TED/boleto; ou (b) 12x cartão de crédito com tarifas inclusas.

1.2 A mensalidade (Oxy + Gênio + Especialista) será paga via boleto bancário com vencimento recorrente.

1.3 Em caso de inadimplemento: multa de 2% + juros de 1% ao mês sobre o débito.

1.4 A inadimplência autoriza a suspensão do acesso à Plataforma e uso de medidas legais para recuperação.

1.5 Reajuste anual pelo IPCA ou índice substituto, na data de renovação.

### 2. OBRIGAÇÕES DA CONTRATADA

2.1 Realizar a entrega do escopo contratado do Setup da Plataforma Oxy + Gênio.

2.2 Disponibilizar 4 encontros mensais com especialista para esclarecimentos e orientações técnicas.

2.3 Assegurar funcionamento e manutenção da Plataforma, incluindo atualizações e correções.

### 3. OBRIGAÇÕES DA CONTRATANTE

3.1 Participar ativamente do Setup, cumprindo prazos, reuniões e atividades definidos.

3.2 Seguir instruções, orientações técnicas e boas práticas para utilização da Plataforma.

3.3 Utilizar a plataforma de forma responsável, dentro dos limites contratuais e legais.

3.4 Efetuar os pagamentos nos prazos e condições estabelecidos.

### 4. CONFIDENCIALIDADE E PROTEÇÃO DE DADOS

4.1 A CONTRATADA manterá sigilo absoluto sobre informações confidenciais.

4.2 Observância rigorosa da Lei nº 13.709/2018 (LGPD).

### 5. RESCISÃO E CANCELAMENTO

5.1 O SETUP é irrevogável e irretratável, não sendo passível de reembolso.

5.2 Plataforma + Especialista podem ser rescindidos mediante aviso prévio de {{AVISO_DIAS}} dias via cs@o2inc.com.br.

5.3 Em qualquer rescisão, não haverá devolução de valores já pagos.

5.4 A rescisão não prejudica direitos legais cabíveis.

### 6. NÃO SOLICITAÇÃO

6.1 Durante a vigência e por 2 anos após, as PARTES não contratarão sócios, colaboradores ou prestadores da outra PARTE.

### 7. DISPOSIÇÕES GERAIS

7.1 A invalidade de qualquer disposição não afeta as demais.

7.2 Alterações só serão válidas se formalizadas por escrito e assinadas.

7.3 Notificações por cartório, carta registrada ou e-mail com comprovante.

7.4 Contrato de natureza civil, sem vínculo empregatício.

7.5 Prestação de serviços configura obrigação de meio, não de resultado.

7.6 As PARTES não oferecerão ou aceitarão pagamentos/vantagens que constituam prática ilegal.

### 8. LEI APLICÁVEL E FORO

8.1 Regido pelas leis do Brasil. Foro: Cidade de São Paulo - SP.

---

São Paulo, {{DIA}} de {{MES}} de 20{{ANO}}

| CONTRATANTE | CONTRATADA |
|-------------|------------|
| _______________________________ | _______________________________ |
| {{RAZAO_SOCIAL}} | O2 INC GESTÃO E TECNOLOGIA S.A. |

### TESTEMUNHAS:

| _______________________________ | _______________________________ |
|-------------|------------|
| Nome: {{NOME_TESTEMUNHA1}} | Nome: {{NOME_TESTEMUNHA2}} |
| CPF: {{CPF_TESTEMUNHA1}} | CPF: {{CPF_TESTEMUNHA2}} |
`,
  },
  {
    id: "plano-anual-oxigenio",
    name: "Plano Anual Oxigênio Empresarial",
    description: "Programa Educacional Anual em Gestão Estratégica e Financeira",
    createdAt: "Modelo do sistema",
    category: "educacional",
    content: `# CONTRATO DE PRESTAÇÃO DE SERVIÇOS — PLANO ANUAL OXIGÊNIO EMPRESARIAL

## QUADRO RESUMO

| Campo | Valor |
|-------|-------|
| **CONTRATANTE** | |
| Razão Social | {{RAZAO_SOCIAL}} |
| CNPJ | {{CNPJ}} |
| Endereço | {{ENDERECO}} |
| **REPRESENTANTE LEGAL** | |
| Nome | {{NOME_REPRESENTANTE}} |
| CPF | {{CPF_REPRESENTANTE}} |
| E-mail | {{EMAIL_REPRESENTANTE}} |
| **REMUNERAÇÃO** | |
| Valor Total | {{VALOR_TOTAL}} |
| Forma de Pagamento | {{FORMA_PAGAMENTO}} |
| **VIGÊNCIA** | |
| Prazo | {{PRAZO_VIGENCIA}} |
| Rescisão (aviso prévio) | {{PRAZO_RESCISAO}} |

---

## Contratada

O2 INC GESTÃO E TECNOLOGIA S.A., sociedade anônima, com sede na cidade de São Paulo, Estado de São Paulo, na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, inscrita no Cadastro Nacional de Pessoa Jurídica – CNPJ sob o nº 23.813.779/0001-60, neste ato representada na forma de seu Estatuto Social, doravante denominada simplesmente "CONTRATADA".

---

## CLÁUSULA PRIMEIRA - DO OBJETO

### 1.1 Programa Contratado

A CONTRATADA disponibilizará à CONTRATANTE o produto **Oxigênio Empresarial**, que é um Programa Educacional Anual em Gestão Estratégica e Financeira, com duração de 12 (doze) meses, de caráter irrevogável e irretratável, estruturado em três eixos principais:

### 1.1.1 Módulo Inicial de Setup

Etapa de nivelamento destinada a capacitar a CONTRATANTE na organização e estruturação de suas rotinas financeiras.

**Atividades:**
- Encontros semanais de orientação (reunião virtual)
- Encontros obrigatórios iniciais (mínimo de 4)

**Entregáveis Instrutivos:**
- a) Plano de Contas
- b) Dados
- c) ERP
- d) Tecnologia

### 1.1.2 Ferramentas de Apoio

Acesso à ferramenta OXY com:
- Aba DRE
- Aba Fluxo de Caixa
- Análise do Ciclo Financeiro
- Planejamento Orçamentário
- Agente de IA (Gênio)

### 1.1.3 Acompanhamento por Especialista

Direito ao acompanhamento de um especialista financeiro da O2 Inc.

---

## CLÁUSULA SEGUNDA - DA REMUNERAÇÃO

{{OBSERVACOES}}

---

São Paulo, {{DIA}} de {{MES}} de 20{{ANO}}

_______________________________
**CONTRATANTE:** {{RAZAO_SOCIAL}}
CNPJ: {{CNPJ}}

_______________________________
**CONTRATADA**
O2 INC GESTÃO E TECNOLOGIA S.A.
`,
  },
  {
    id: "parceria-oxy-hacker",
    name: "Parceria Estratégica Oxy Hacker",
    description: "Contrato de parceria para oferta do produto CFO as a Service",
    createdAt: "Modelo do sistema",
    category: "parceria",
    content: `# CONTRATO DE PARCERIA ESTRATÉGICA — OXY HACKER

## QUADRO RESUMO

| Campo | Valor |
|-------|-------|
| **PARCEIRA ESTRATÉGICA** | |
| Razão Social | {{RAZAO_SOCIAL}} |
| CNPJ | {{CNPJ}} |
| Endereço | {{ENDERECO}} |
| **REPRESENTANTE LEGAL** | |
| Nome | {{NOME_REPRESENTANTE}} |
| CPF | {{CPF_REPRESENTANTE}} |
| E-mail | {{EMAIL_REPRESENTANTE}} |
| **REMUNERAÇÃO** | |
| Valor Total | {{VALOR_TOTAL}} |
| Forma de Pagamento | {{FORMA_PAGAMENTO}} |
| **VIGÊNCIA** | |
| Prazo | {{PRAZO_VIGENCIA}} |
| Rescisão (aviso prévio) | {{PRAZO_RESCISAO}} |

---

## Contratada

O2 INC GESTÃO E TECNOLOGIA S.A., sociedade anônima, com sede na cidade de São Paulo, Estado de São Paulo, na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, inscrita no Cadastro Nacional de Pessoa Jurídica – CNPJ sob o nº 23.813.779/0001-60, representada na forma de seu estatuto social, doravante denominada como "CONTRATADA".

Têm entre si justo e acordado o presente CONTRATO DE PARCERIA ESTRATÉGICA OXY HACKER, que se regerá pelas cláusulas e condições a seguir:

---

## CLÁUSULA PRIMEIRA - DO OBJETO

1.1. O presente contrato tem por objeto a formalização da parceria para oferta do produto **CFO as a Service – CaaS Enterprise**, cuja comercialização é realizada pela O2 INC.

1.2. O pagamento da primeira mensalidade será integralmente destinado à O2 INC.

1.3. O atendimento operacional e consultivo do CLIENTE será prestado diretamente pela PARCEIRA ESTRATÉGICA.

---

## CLÁUSULA SEGUNDA - DAS RESPONSABILIDADES

2.1. **O2 INC:** Responsável pela governança metodológica do Oxy Hacker e pela disponibilização do SaaS (Plataforma Oxy + Gênio).

2.2. **PARCEIRA ESTRATÉGICA:** Responsável integral pelo atendimento, execução e relacionamento com o CLIENTE durante a prestação do serviço de CFO as a Service.

---

## CLÁUSULA TERCEIRA - PROPRIEDADE INTELECTUAL

3.1. Todos os métodos, playbooks, materiais, plataformas e marcas relacionados ao programa Oxy Hacker são de propriedade exclusiva da O2 INC.

3.2. É vedado à PARCEIRA ESTRATÉGICA ou ao CLIENTE copiar, reproduzir ou utilizar tais ativos fora das condições aqui estabelecidas.

---

## CLÁUSULA QUARTA - DA CONFIDENCIALIDADE

4.1. As partes comprometem-se a manter sigilo sobre todas as informações estratégicas e a cumprir integralmente a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).

---

## CLÁUSULA QUINTA - DA RESILIÇÃO

5.1. O contrato poderá ser rescindido por inadimplemento de qualquer das partes ou por comum acordo, respeitando-se as obrigações já assumidas.

---

## CLÁUSULA SEXTA - DA LEI APLICÁVEL E FORO

6.1. Este contrato será regido pelas leis da República Federativa do Brasil. Qualquer disputa será submetida ao Foro Central da Cidade de São Paulo - SP.

---

São Paulo, {{DIA}} de {{MES}} de 20{{ANO}}

_______________________________
**PARCEIRA ESTRATÉGICA:** {{RAZAO_SOCIAL}}
CNPJ: {{CNPJ}}

_______________________________
**O2 INC GESTÃO E TECNOLOGIA S.A.**

### TESTEMUNHAS:

Nome: _______________ | Nome: _______________
CPF: _______________ | CPF: _______________
`,
  },
  {
    id: "pre-cof-parceria",
    name: "Pré-COF Parceria Oxy Hacker",
    description: "Contrato de parceria comercial prévio à COF para programa Oxy Hacker",
    createdAt: "Modelo do sistema",
    category: "parceria",
    content: `# CONTRATO DE PARCERIA COMERCIAL — PRÉ-COF OXY HACKER

## QUADRO RESUMO

| Campo | Valor |
|-------|-------|
| **PARCEIRO** | |
| Razão Social | {{RAZAO_SOCIAL}} |
| CNPJ | {{CNPJ}} |
| Endereço | {{ENDERECO}} |
| **REPRESENTANTE LEGAL** | |
| Nome | {{NOME_REPRESENTANTE}} |
| CPF | {{CPF_REPRESENTANTE}} |
| E-mail | {{EMAIL_REPRESENTANTE}} |
| **REMUNERAÇÃO** | |
| Valor Total | {{VALOR_TOTAL}} |
| Forma de Pagamento | {{FORMA_PAGAMENTO}} |
| **VIGÊNCIA** | |
| Prazo | {{PRAZO_VIGENCIA}} |
| Rescisão (aviso prévio) | {{PRAZO_RESCISAO}} |

---

## Partes

**O2 INC GESTÃO E TECNOLOGIA S.A.**, inscrita no CNPJ sob nº 23.813.779/0001-60, com sede em São Paulo/SP, doravante denominada simplesmente "O2 INC" ou "MATRIZ";

Têm entre si justo e acordado o presente CONTRATO DE PARCERIA COMERCIAL PRÉVIO À COF, que se regerá pelas seguintes cláusulas e condições:

---

## CLÁUSULA 1 – DO OBJETO

1.1. O presente contrato tem por objeto regular a parceria comercial inicial entre a O2 INC e o PARCEIRO, para participação no programa **Oxy Hacker**, até a formalização definitiva da relação por meio da Circular de Oferta de Franquia (COF).

1.2. O objeto desta parceria contempla:
- (i) Licença para revender a plataforma Oxy Finance e do Gênio AI
- (ii) Mentorias em grupo no formato comitê
- (iii) Acesso aos Playbooks responsáveis pelo crescimento da O2 INC
- (iv) 10 (dez) leads da base da MATRIZ
- (v) Acesso aos modelos/padrões da estrutura de gestão da MATRIZ
- (vi) Modelos de contratos
- (vii) Formações de hard e soft skills estruturadas no método Oxy Hacker

---

## CLÁUSULA 2 – DOS DIREITOS ECONÔMICOS

O pagamento constitui requisito essencial para a plena validade deste contrato e liberação de acessos.

---

## CLÁUSULA 3 – DA IDENTIDADE E COMUNICAÇÃO

3.1. O PARCEIRO poderá se apresentar ao mercado utilizando a identidade Oxy Hacker, qualificando-se como parceiro da O2 INC.

3.2. O uso de materiais visuais, templates, logos deverá se restringir aos materiais disponibilizados pela MATRIZ.

---

## CLÁUSULA 4 – DA CONFIDENCIALIDADE

4.1. O PARCEIRO compromete-se a manter sigilo absoluto sobre todas as informações estratégicas, técnicas e comerciais pelo prazo mínimo de 5 (cinco) anos após a rescisão.

---

## CLÁUSULA 5 – DA EXCLUSIVIDADE E ATUAÇÃO

5.1. Não exclusividade geral: o PARCEIRO poderá continuar operando sua própria empresa de consultoria financeira.

---

São Paulo, {{DIA}} de {{MES}} de 20{{ANO}}

_______________________________
**PARCEIRO:** {{RAZAO_SOCIAL}}
CNPJ: {{CNPJ}}

_______________________________
**O2 INC GESTÃO E TECNOLOGIA S.A.**
`,
  },
  {
    id: "assessoria-ma-sellside",
    name: "Assessoria M&A - Sell Side",
    description: "Serviços de assessoria para venda de empresa (Sell Side)",
    createdAt: "Modelo do sistema",
    category: "ma",
    content: `# CONTRATO DE PRESTAÇÃO DE SERVIÇOS — M&A SELL SIDE

## QUADRO RESUMO

| Campo | Valor |
|-------|-------|
| **CONTRATANTE** | |
| Razão Social | {{RAZAO_SOCIAL}} |
| CNPJ | {{CNPJ}} |
| Endereço | {{ENDERECO}} |
| **REPRESENTANTE LEGAL** | |
| Nome | {{NOME_REPRESENTANTE}} |
| CPF | {{CPF_REPRESENTANTE}} |
| E-mail | {{EMAIL_REPRESENTANTE}} |
| **REMUNERAÇÃO** | |
| Valor Total Mensal | {{VALOR_TOTAL}} |
| Comissão sobre transação | 3,5% do valor total da venda |
| Forma de Pagamento | {{FORMA_PAGAMENTO}} |
| **VIGÊNCIA** | |
| Prazo | {{PRAZO_VIGENCIA}} |
| Rescisão (aviso prévio) | {{PRAZO_RESCISAO}} |

---

## Contratada

O2 INC GESTÃO E TECNOLOGIA S.A., sociedade anônima, com sede na cidade de São Paulo, Estado de São Paulo, na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, inscrita no Cadastro Nacional de Pessoa Jurídica – CNPJ sob o nº 23.813.779/0001-60, representada na forma de seu estatuto social, doravante denominada como "CONTRATADA".

---

## CONSIDERANDO QUE

A CONTRATANTE deseja iniciar um processo de elaboração de Valuation da empresa;
A CONTRATADA tem capacitação e experiência na prestação do serviço acima mencionado;

Decidem as Partes celebrar este Contrato Particular de Prestação de Serviços.

---

## CLÁUSULA PRIMEIRA - DO OBJETO

1.1 – A CONTRATADA prestará à CONTRATANTE os serviços de **Sell Side**.

1.2 - O escopo do serviço inclui:
- a) Planejamento e definição de estratégia
- b) Criação de mapa de possíveis interessados
- c) Primeiros contatos com possíveis interessados
- d) Roadshow com interessados
- e) Condução de documentação básica (NDA, Teaser de investimento)
- f) Auxílio na negociação e condução dos fechamentos

**Parágrafo único:** Não consiste obrigação da CONTRATADA realizar due diligence, nem qualquer elaboração de documento jurídico de compra e venda.

---

## CLÁUSULA SEGUNDA - DA REMUNERAÇÃO

2.2 - Caso ocorra a venda da empresa durante a vigência deste contrato, a CONTRATANTE deverá pagar à CONTRATADA uma comissão correspondente a **3,5%** sobre o valor total da transação.

---

## CLÁUSULA TERCEIRA - DO PRAZO

3.1 – O presente contrato terá vigência de 12 (doze) meses.

---

São Paulo, {{DIA}} de {{MES}} de 20{{ANO}}

_______________________________
**CONTRATANTE:** {{RAZAO_SOCIAL}}
CNPJ: {{CNPJ}}

_______________________________
**CONTRATADA**
O2 INC GESTÃO E TECNOLOGIA S.A.
`,
  },
  {
    id: "financial-advisory",
    name: "Financial Advisory",
    description: "Serviços de consultoria financeira especializada",
    createdAt: "Modelo do sistema",
    category: "consultoria",
    content: `# CONTRATO DE PRESTAÇÃO DE SERVIÇOS — FINANCIAL ADVISORY

## QUADRO RESUMO

| Campo | Valor |
|-------|-------|
| **CONTRATANTE** | |
| Razão Social | {{RAZAO_SOCIAL}} |
| CNPJ | {{CNPJ}} |
| Endereço | {{ENDERECO}} |
| **REPRESENTANTE LEGAL** | |
| Nome | {{NOME_REPRESENTANTE}} |
| CPF | {{CPF_REPRESENTANTE}} |
| E-mail | {{EMAIL_REPRESENTANTE}} |
| **REMUNERAÇÃO** | |
| Valor Total | {{VALOR_TOTAL}} |
| Forma de Pagamento | {{FORMA_PAGAMENTO}} |
| **VIGÊNCIA** | |
| Prazo | {{PRAZO_VIGENCIA}} |
| Rescisão (aviso prévio) | {{PRAZO_RESCISAO}} |

---

## Contratada

O2 INC GESTÃO E TECNOLOGIA S.A., sociedade anônima, com sede na cidade de São Paulo, Estado de São Paulo, na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, inscrita no Cadastro Nacional de Pessoa Jurídica – CNPJ sob o nº 23.813.779/0001-60, neste ato representada na forma de seu Estatuto Social, doravante denominada simplesmente "CONTRATADA".

---

## CLÁUSULA PRIMEIRA - DO OBJETO

1.1 – A CONTRATADA prestará à CONTRATANTE os serviços de **Financial Advisory**, incluindo:

- Análise financeira detalhada
- Estruturação de operações financeiras
- Assessoria em captação de recursos
- Planejamento estratégico financeiro
- Modelagem financeira e projeções

---

## CLÁUSULA SEGUNDA - DA REMUNERAÇÃO

{{OBSERVACOES}}

---

## CLÁUSULA TERCEIRA - DO PRAZO

3.1 – O presente contrato terá vigência conforme acordo entre as partes.

---

São Paulo, {{DIA}} de {{MES}} de 20{{ANO}}

_______________________________
**CONTRATANTE:** {{RAZAO_SOCIAL}}
CNPJ: {{CNPJ}}

_______________________________
**CONTRATADA**
O2 INC GESTÃO E TECNOLOGIA S.A.
`,
  },
  {
    id: "cfo-enterprise-alternativo",
    name: "CFO Enterprise (Modelo A)",
    description: "Versão alternativa do contrato CFO Enterprise com estrutura simplificada",
    createdAt: "Modelo do sistema",
    category: "cfo",
    content: `# CONTRATO DE PRESTAÇÃO DE SERVIÇOS — CFO ENTERPRISE

## QUADRO RESUMO

| Campo | Valor |
|-------|-------|
| **CONTRATANTE** | |
| Razão Social | {{RAZAO_SOCIAL}} |
| CNPJ | {{CNPJ}} |
| Endereço | {{ENDERECO}} |
| **REPRESENTANTE LEGAL** | |
| Nome | {{NOME_REPRESENTANTE}} |
| CPF | {{CPF_REPRESENTANTE}} |
| E-mail | {{EMAIL_REPRESENTANTE}} |
| **REMUNERAÇÃO** | |
| Valor Total | {{VALOR_TOTAL}} |
| Forma de Pagamento | {{FORMA_PAGAMENTO}} |
| **VIGÊNCIA** | |
| Prazo | {{PRAZO_VIGENCIA}} |
| Rescisão (aviso prévio) | {{PRAZO_RESCISAO}} |

---

## Contratada

O2 INC GESTÃO E TECNOLOGIA S.A., sociedade anônima, com sede na cidade de São Paulo, Estado de São Paulo, na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, inscrita no Cadastro Nacional de Pessoa Jurídica – CNPJ sob o nº 23.813.779/0001-60, neste ato representada na forma de seu Estatuto Social, doravante denominada simplesmente "CONTRATADA".

---

## CLÁUSULA PRIMEIRA - DO OBJETO

1.1 – A CONTRATADA presta serviços de Assessoria de Gestão Financeira Recorrente, no modelo de **CFO AS A SERVICE**.

### Escopo dos Serviços:
- Gestão financeira estratégica
- Análise de indicadores e KPIs
- Planejamento orçamentário
- Relatórios gerenciais mensais
- Acompanhamento de fluxo de caixa

---

## CLÁUSULA SEGUNDA - DA REMUNERAÇÃO

{{OBSERVACOES}}

---

## CLÁUSULA TERCEIRA - DO PRAZO

3.1 – O presente contrato terá vigência de 12 (doze) meses.

---

São Paulo, {{DIA}} de {{MES}} de 20{{ANO}}

_______________________________
**CONTRATANTE:** {{RAZAO_SOCIAL}}
CNPJ: {{CNPJ}}

_______________________________
**CONTRATADA**
O2 INC GESTÃO E TECNOLOGIA S.A.
`,
  },
  {
    id: "russowski-modelo",
    name: "Contrato Russowski",
    description: "Modelo de contrato padrão Russowski para prestação de serviços",
    createdAt: "Modelo do sistema",
    category: "generico",
    content: `# CONTRATO DE PRESTAÇÃO DE SERVIÇOS — MODELO RUSSOWSKI

## QUADRO RESUMO

| Campo | Valor |
|-------|-------|
| **CONTRATANTE** | |
| Razão Social | {{RAZAO_SOCIAL}} |
| CNPJ | {{CNPJ}} |
| Endereço | {{ENDERECO}} |
| **REPRESENTANTE LEGAL** | |
| Nome | {{NOME_REPRESENTANTE}} |
| CPF | {{CPF_REPRESENTANTE}} |
| E-mail | {{EMAIL_REPRESENTANTE}} |
| **REMUNERAÇÃO** | |
| Valor Total | {{VALOR_TOTAL}} |
| Forma de Pagamento | {{FORMA_PAGAMENTO}} |
| **VIGÊNCIA** | |
| Prazo | {{PRAZO_VIGENCIA}} |
| Rescisão (aviso prévio) | {{PRAZO_RESCISAO}} |

---

## Contratada

O2 INC GESTÃO E TECNOLOGIA S.A., sociedade anônima, com sede na cidade de São Paulo, Estado de São Paulo, na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, inscrita no Cadastro Nacional de Pessoa Jurídica – CNPJ sob o nº 23.813.779/0001-60, neste ato representada na forma de seu Estatuto Social, doravante denominada simplesmente "CONTRATADA".

---

## CLÁUSULA PRIMEIRA - DO OBJETO

1.1 – A CONTRATADA prestará os serviços conforme especificado neste instrumento.

---

## CLÁUSULA SEGUNDA - DA REMUNERAÇÃO

{{OBSERVACOES}}

---

## CLÁUSULA TERCEIRA - DO PRAZO

3.1 – O presente contrato terá vigência conforme acordado entre as partes.

---

São Paulo, {{DIA}} de {{MES}} de 20{{ANO}}

_______________________________
**CONTRATANTE:** {{RAZAO_SOCIAL}}
CNPJ: {{CNPJ}}

_______________________________
**CONTRATADA**
O2 INC GESTÃO E TECNOLOGIA S.A.
`,
  },
  {
    id: "parceria-oxy-hacker-v2",
    name: "Parceria Oxy Hacker (Modelo 2)",
    description: "Segunda versão do contrato de parceria estratégica Oxy Hacker",
    createdAt: "Modelo do sistema",
    category: "parceria",
    content: `# CONTRATO DE PARCERIA ESTRATÉGICA — OXY HACKER V2

## QUADRO RESUMO

| Campo | Valor |
|-------|-------|
| **PARCEIRA** | |
| Razão Social | {{RAZAO_SOCIAL}} |
| CNPJ | {{CNPJ}} |
| Endereço | {{ENDERECO}} |
| **REPRESENTANTE LEGAL** | |
| Nome | {{NOME_REPRESENTANTE}} |
| CPF | {{CPF_REPRESENTANTE}} |
| E-mail | {{EMAIL_REPRESENTANTE}} |
| **REMUNERAÇÃO** | |
| Valor Total | {{VALOR_TOTAL}} |
| Forma de Pagamento | {{FORMA_PAGAMENTO}} |
| **VIGÊNCIA** | |
| Prazo | {{PRAZO_VIGENCIA}} |
| Rescisão (aviso prévio) | {{PRAZO_RESCISAO}} |

---

## Contratada

O2 INC GESTÃO E TECNOLOGIA S.A., sociedade anônima, com sede na cidade de São Paulo, Estado de São Paulo, na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, inscrita no Cadastro Nacional de Pessoa Jurídica – CNPJ sob o nº 23.813.779/0001-60, representada na forma de seu estatuto social, doravante denominada como "O2 INC".

---

## CLÁUSULA PRIMEIRA - DO OBJETO

1.1. O presente contrato tem por objeto a formalização da parceria estratégica para o programa **Oxy Hacker**.

1.2. A PARCEIRA terá direito a:
- Licença de uso da metodologia Oxy Hacker
- Acesso à plataforma Oxy Finance
- Treinamentos e certificações
- Suporte técnico e operacional

---

## CLÁUSULA SEGUNDA - DAS RESPONSABILIDADES

2.1. **O2 INC:** Fornecerá toda a estrutura metodológica e tecnológica.

2.2. **PARCEIRA:** Será responsável pela execução e atendimento aos clientes finais.

---

São Paulo, {{DIA}} de {{MES}} de 20{{ANO}}

_______________________________
**PARCEIRA:** {{RAZAO_SOCIAL}}
CNPJ: {{CNPJ}}

_______________________________
**O2 INC GESTÃO E TECNOLOGIA S.A.**
`,
  },
];

// Available placeholders for templates
export const availablePlaceholders = [
  // Empresa / Contratante
  { key: "RAZAO_SOCIAL", label: "Razão Social", category: "empresa", tooltip: "Nome empresarial completo conforme CNPJ" },
  { key: "CNPJ", label: "CNPJ", category: "empresa", tooltip: "XX.XXX.XXX/XXXX-XX" },
  { key: "ENDERECO", label: "Endereço Completo", category: "empresa", tooltip: "Rua, número, bairro, cidade, estado, CEP" },
  // Representante Legal
  { key: "NOME_REPRESENTANTE", label: "Nome do Representante", category: "representante", tooltip: "Nome completo do representante legal" },
  { key: "CPF_REPRESENTANTE", label: "CPF do Representante", category: "representante", tooltip: "XXX.XXX.XXX-XX" },
  { key: "EMAIL_REPRESENTANTE", label: "E-mail do Representante", category: "representante", tooltip: "E-mail principal de contato" },
  // Pagamento / Remuneração
  { key: "VALOR_TOTAL", label: "Valor Total", category: "pagamento", tooltip: "Valor total do contrato em R$" },
  { key: "VALOR_SETUP", label: "Valor do Setup", category: "pagamento", tooltip: "Valor cobrado pela etapa de setup" },
  { key: "VALOR_MENSALIDADE", label: "Valor da Mensalidade", category: "pagamento", tooltip: "Valor mensal recorrente" },
  { key: "VALOR_CFO", label: "Valor CFO as a Service", category: "pagamento", tooltip: "Valor mensal do serviço CFO" },
  { key: "FORMA_PAGAMENTO", label: "Forma de Pagamento", category: "pagamento", tooltip: "Ex: boleto, cartão, TED" },
  { key: "FORMA_PAGAMENTO_SETUP", label: "Forma Pgto. Setup", category: "pagamento", tooltip: "Forma de pagamento do setup" },
  { key: "FORMA_PAGAMENTO_CFO", label: "Forma Pgto. CFO", category: "pagamento", tooltip: "Forma de pagamento do CFO" },
  { key: "CONDICOES_SETUP", label: "Condições do Setup", category: "pagamento", tooltip: "Condições especiais de pagamento" },
  { key: "CONDICOES_CFO", label: "Condições do CFO", category: "pagamento", tooltip: "Condições especiais de pagamento" },
  // Vigência / Contrato
  { key: "PRAZO_VIGENCIA", label: "Prazo de Vigência", category: "contrato", tooltip: "Ex: 12 meses, 24 meses" },
  { key: "PRAZO_RESCISAO", label: "Prazo de Rescisão", category: "contrato", tooltip: "Dias de aviso prévio para rescisão" },
  { key: "AVISO_DIAS", label: "Dias de Aviso Prévio", category: "contrato", tooltip: "Número de dias para aviso prévio" },
  { key: "DESCRICAO_SERVICOS", label: "Descrição dos Serviços", category: "contrato", tooltip: "Detalhamento do escopo contratado" },
  { key: "OBSERVACOES", label: "Observações", category: "contrato", tooltip: "Observações adicionais ao contrato" },
  // Data de Assinatura
  { key: "DIA", label: "Dia", category: "assinatura", tooltip: "Dia da assinatura (número)" },
  { key: "MES", label: "Mês", category: "assinatura", tooltip: "Mês da assinatura (por extenso)" },
  { key: "ANO", label: "Ano", category: "assinatura", tooltip: "Ano da assinatura (2 dígitos)" },
  // Testemunhas
  { key: "NOME_TESTEMUNHA1", label: "Nome Testemunha 1", category: "assinatura", tooltip: "Nome completo da primeira testemunha" },
  { key: "CPF_TESTEMUNHA1", label: "CPF Testemunha 1", category: "assinatura", tooltip: "CPF da primeira testemunha" },
  { key: "NOME_TESTEMUNHA2", label: "Nome Testemunha 2", category: "assinatura", tooltip: "Nome completo da segunda testemunha" },
  { key: "CPF_TESTEMUNHA2", label: "CPF Testemunha 2", category: "assinatura", tooltip: "CPF da segunda testemunha" },
  // Legacy aliases (backwards compat)
  { key: "CLIENTE", label: "Nome da Empresa (legado)", category: "empresa", tooltip: "Use RAZAO_SOCIAL de preferência" },
  { key: "SOCIO", label: "Nome do Sócio (legado)", category: "representante", tooltip: "Use NOME_REPRESENTANTE de preferência" },
  { key: "NOME_SOCIO", label: "Nome do Sócio (alt)", category: "representante", tooltip: "Use NOME_REPRESENTANTE de preferência" },
  { key: "CPF", label: "CPF (legado)", category: "representante", tooltip: "Use CPF_REPRESENTANTE de preferência" },
  { key: "ENDERECO_EMPRESA", label: "Endereço Empresa (legado)", category: "empresa", tooltip: "Use ENDERECO de preferência" },
  { key: "ENDERECO_COMPLETO", label: "Endereço Completo (legado)", category: "empresa", tooltip: "Use ENDERECO de preferência" },
  { key: "ENDERECO_SOCIO", label: "Endereço do Sócio", category: "representante", tooltip: "Endereço residencial do sócio" },
  { key: "DATA", label: "Data de Assinatura (legado)", category: "contrato", tooltip: "Use DIA/MES/ANO de preferência" },
  { key: "EMAIL", label: "E-mail (legado)", category: "contato", tooltip: "Use EMAIL_REPRESENTANTE de preferência" },
  { key: "TELEFONE", label: "Telefone", category: "contato", tooltip: "Número de telefone para contato" },
  { key: "RG", label: "RG do Representante", category: "representante", tooltip: "Número do RG" },
];

// Template category metadata for UI
export const templateCategories: Record<string, { label: string; color: string }> = {
  cfo: { label: "CFO", color: "bg-primary/10 text-primary" },
  saas: { label: "SaaS", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
  parceria: { label: "Parceria", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  ma: { label: "M&A", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  consultoria: { label: "Consultoria", color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
  educacional: { label: "Educacional", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" },
  generico: { label: "Genérico", color: "bg-muted text-muted-foreground" },
};
