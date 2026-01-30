import type { Template } from "@/components/wizard/ContractWizard";

// All contract templates for O2 Inc products/services
export const defaultTemplates: Template[] = [
  {
    id: "cfo-enterprise",
    name: "CFO Enterprise",
    description: "Assessoria de Gestão Financeira Recorrente - CFO as a Service",
    createdAt: "Modelo do sistema",
    content: `# INSTRUMENTO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS

Pelo presente instrumento:

**{{CLIENTE}}**, sociedade empresária limitada, inscrita no CNPJ sob o nº **{{CNPJ}}**, com sede na **{{ENDERECO_EMPRESA}}** representada neste ato na forma de seu contrato social, por seu sócio **{{SOCIO}}**, brasileiro, empresário, inscrito no CPF sob número **{{CPF}}**, residente e domiciliado na **{{ENDERECO_SOCIO}}**, doravante referida simplesmente como "CONTRATANTE", e de outro lado;

**O2 INC GESTÃO E TECNOLOGIA S.A.**, sociedade anônima, com sede na cidade de São Paulo, Estado de São Paulo, na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, inscrita no Cadastro Nacional de Pessoa Jurídica – CNPJ sob o nº 23.813.779/0001-60, neste ato representada na forma de seu Estatuto Social, doravante denominada simplesmente "CONTRATADA".

As Partes acima qualificadas resolvem, de comum acordo, celebrar o presente INSTRUMENTO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS, conforme as cláusulas e condições abaixo previstas.

---

## CLÁUSULA PRIMEIRA - DO OBJETO

1.1 – A CONTRATADA presta serviços de Assessoria de Gestão Financeira Recorrente, no modelo de **CFO AS A SERVICE**, conforme detalhamento de escopo abaixo.

### 1.1.1 - Etapa de SETUP

**Duração:** até 90 dias após o kick-off

**Encontros:** Touch point semanal, podendo ser reunião ou contato telefônico/whatsapp

**Encontros obrigatórios:** 4 encontros iniciais para entrevistas, questionamentos e compreensão do funcionamento dos processos geradores de dados da empresa.

### Entregáveis

| Item | Descrição |
|------|-----------|
| a) PLANO DE CONTAS | Análise do Plano de Contas atual; Identificação de otimizações e melhorias; Sugestão de mudanças; Suporte técnico e instrutivo ao time do cliente |
| b) DADOS | Aplicação do check list dos principais processos geradores de dados da empresa; Compreensão e entrevista dos processos de Faturamento, Contas a Receber, Compras/Custos/Despesas, Contas a Pagar e Conciliação bancária |
| c) ERP | Análise do ERP; Identificação dos pré requisitos; Identificação de eventuais pontos de atenção; Análise de possíveis sub-utilizações do sistema |
| d) TECNOLOGIA | Análise técnica do sistema ERP do cliente; Definição da modalidade de integração; Alinhamento de Plano de contas ERP -> Oxy |

**Parágrafo Único:** Os prazos serão definidos conforme a disponibilidade de agenda da CONTRATADA e da CONTRATANTE. O prazo de 90 dias estimado para conclusão do SETUP dependerá fundamentalmente do engajamento e da participação dos sócios e da equipe da CONTRATANTE.

---

## CLÁUSULA SEGUNDA - DA REMUNERAÇÃO

2.1 – Pelos serviços ora contratados, será fixada a remuneração conforme abaixo:

{{FORMA_PAGAMENTO}}

**Valor Total:** {{VALOR_TOTAL}}

---

## CLÁUSULA TERCEIRA - DO PRAZO

3.1 – O presente contrato terá vigência de 12 (doze) meses, contados a partir da data de sua assinatura.

---

## OBSERVAÇÕES

{{OBSERVACOES}}

---

## DATA E ASSINATURA

**Local e Data:** São Paulo, {{DATA}}

_______________________________
**CONTRATANTE:** {{CLIENTE}}
CNPJ: {{CNPJ}}
Representado por: {{SOCIO}}
CPF: {{CPF}}

_______________________________
**CONTRATADA**
O2 INC GESTÃO E TECNOLOGIA S.A.
`,
  },
  {
    id: "diagnostico-estrategico",
    name: "Diagnóstico Estratégico",
    description: "Diagnóstico completo da empresa com análises financeiras e recomendações",
    createdAt: "Modelo do sistema",
    content: `# INSTRUMENTO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS

Pelo presente instrumento:

**{{CLIENTE}}**, sociedade empresária limitada, inscrita no CNPJ sob o nº **{{CNPJ}}**, com sede na **{{ENDERECO_EMPRESA}}** representada neste ato na forma de seu contrato social, por seu sócio **{{SOCIO}}**, brasileiro, empresário, inscrito no CPF sob número **{{CPF}}**, residente e domiciliado na **{{ENDERECO_SOCIO}}**, doravante referida simplesmente como "CONTRATANTE", e de outro lado;

**O2 INC GESTÃO E TECNOLOGIA S.A.**, sociedade anônima, com sede na cidade de São Paulo, Estado de São Paulo, na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, inscrita no Cadastro Nacional de Pessoa Jurídica – CNPJ sob o nº 23.813.779/0001-60, representada na forma de seu estatuto social, doravante denominada como "CONTRATADA".

---

## CONSIDERANDO QUE

A CONTRATANTE deseja iniciar um processo de elaboração de Diagnóstico da empresa;
A CONTRATADA tem capacitação e experiência na prestação do serviço acima mencionado;

Decidem as Partes celebrar este Contrato Particular de Prestação de Serviços.

---

## CLÁUSULA PRIMEIRA - DO OBJETO

1.1 – A CONTRATADA prestará à CONTRATANTE os serviços de **Diagnóstico Estratégico**.

1.2 – Para a devida consecução dos serviços objeto deste Contrato, a CONTRATADA desenvolverá, em favor da CONTRATANTE, em um período de até 90 (noventa) dias, as atividades cujo escopo segue abaixo discriminado:

- a) Análise do Contexto e Histórico Financeiro
- b) Análise de Desempenho Financeiro - Rentabilidade
  - i. Análise de Faturamento
  - ii. Análise de Custos
  - iii. Análise de Despesas
  - iv. Análise de Balanço Patrimonial
- c) Análise de Eficiência Operacional
- d) Análise de NCG (Necessidade de Capital de Giro)
- e) Análise de Ciclo Financeiro
- f) Análise do Endividamento (Financeiro, Tributário, Fornecedores)
- g) Projeções e Modelagem Financeira
- h) Identificação de Problemas e Oportunidades
- i) Recomendações e Plano de Ação

1.3 – Ao final dos 90 dias será apresentado o resultado final do trabalho.

---

## CLÁUSULA SEGUNDA - DA REMUNERAÇÃO

{{FORMA_PAGAMENTO}}

**Valor Total:** {{VALOR_TOTAL}}

---

## OBSERVAÇÕES

{{OBSERVACOES}}

---

## DATA E ASSINATURA

**Local e Data:** {{DATA}}

_______________________________
**CONTRATANTE:** {{CLIENTE}}
CNPJ: {{CNPJ}}

_______________________________
**CONTRATADA**
O2 INC GESTÃO E TECNOLOGIA S.A.
`,
  },
  {
    id: "saas-oxy-genio",
    name: "SaaS Oxy + Gênio",
    description: "Plataforma Oxy com Agente de IA especializado em finanças",
    createdAt: "Modelo do sistema",
    content: `# INSTRUMENTO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS

Pelo presente instrumento:

**{{CLIENTE}}**, sociedade empresária limitada, inscrita no CNPJ sob o nº **{{CNPJ}}**, com sede na **{{ENDERECO_EMPRESA}}** representada neste ato na forma de seu contrato social, por seu sócio **{{SOCIO}}**, brasileiro, empresário, inscrito no CPF sob número **{{CPF}}**, residente e domiciliado na **{{ENDERECO_SOCIO}}**, doravante referida simplesmente como "CONTRATANTE", e de outro lado;

**O2 INC GESTÃO E TECNOLOGIA S.A.**, sociedade anônima, com sede na cidade de São Paulo, Estado de São Paulo, na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, inscrita no Cadastro Nacional de Pessoa Jurídica – CNPJ sob o nº 23.813.779/0001-60, neste ato representada na forma de seu Estatuto Social, doravante denominada simplesmente "CONTRATADA".

---

## CLÁUSULA PRIMEIRA - DO OBJETO

1.1 - A CONTRATADA prestará à CONTRATANTE os seguintes serviços:

- 1.1.1 Setup
- 1.1.2 Plataforma Oxy + Gênio (Agente de Inteligência Artificial especializado em finanças)

### 1.2 - Setup

Duração: 90 dias após o kick-off

**Entregáveis:**
- a) Plano de Contas: análise do plano atual, identificação de otimizações e melhorias
- b) Dados: aplicação de checklist dos processos geradores de dados
- c) ERP: análise do sistema, identificação de pré-requisitos e pontos de atenção
- d) Tecnologia: análise técnica do ERP, definição de modalidade de integração

### 1.3 - Plataforma OXY + Gênio

A CONTRATANTE terá acesso à plataforma tecnológica OXY com as seguintes funcionalidades:

- **Aba DRE:** análises vertical, horizontal e mensal, gráficos, comparação de períodos
- **Aba Fluxo de Caixa:** análise mensal, curva ABC, projeções de fluxo de caixa diário
- **Análise do Ciclo Financeiro:** indicadores PMP, PME, PMR, Ciclo Financeiro e Operacional
- **Planejamento Orçamentário:** projeções com base em histórico do ERP
- **Agente de IA (Gênio):** questionamentos em tempo real com base nos dados do ERP

---

## CLÁUSULA SEGUNDA - DA REMUNERAÇÃO

{{FORMA_PAGAMENTO}}

**Valor Total:** {{VALOR_TOTAL}}

---

## OBSERVAÇÕES

{{OBSERVACOES}}

---

## DATA E ASSINATURA

**Local e Data:** {{DATA}}

_______________________________
**CONTRATANTE:** {{CLIENTE}}
CNPJ: {{CNPJ}}

_______________________________
**CONTRATADA**
O2 INC GESTÃO E TECNOLOGIA S.A.
`,
  },
  {
    id: "saas-oxy-genio-especialista",
    name: "SaaS Oxy + Gênio + Especialista",
    description: "Plataforma Oxy com IA e acompanhamento de especialista O2",
    createdAt: "Modelo do sistema",
    content: `# INSTRUMENTO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS

Pelo presente instrumento:

**{{CLIENTE}}**, sociedade empresária limitada, inscrita no CNPJ sob o nº **{{CNPJ}}**, com sede na **{{ENDERECO_EMPRESA}}** representada neste ato na forma de seu contrato social, por seu sócio **{{SOCIO}}**, brasileiro, empresário, inscrito no CPF sob número **{{CPF}}**, residente e domiciliado na **{{ENDERECO_SOCIO}}**, doravante referida simplesmente como "CONTRATANTE", e de outro lado;

**O2 INC GESTÃO E TECNOLOGIA S.A.**, sociedade anônima, com sede na cidade de São Paulo, Estado de São Paulo, na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, inscrita no Cadastro Nacional de Pessoa Jurídica – CNPJ sob o nº 23.813.779/0001-60, neste ato representada na forma de seu Estatuto Social, doravante denominada simplesmente "CONTRATADA".

---

## CLÁUSULA PRIMEIRA - DO OBJETO

1.1 - A CONTRATADA prestará à CONTRATANTE os seguintes serviços:

- 1.1.1 Setup
- 1.1.2 Plataforma Oxy + Gênio (Agente de Inteligência Artificial especializado em finanças)
- 1.1.3 Especialista O2 Inc.

### 1.2 - Setup

Duração: 90 dias após o kick-off

**Entregáveis:**
- a) Plano de Contas
- b) Dados
- c) ERP
- d) Tecnologia

### 1.3 - Plataforma OXY + Gênio

Funcionalidades inclusas:
- Aba DRE, Fluxo de Caixa, Análise do Ciclo Financeiro
- Planejamento Orçamentário
- Agente de IA (Gênio)

### 1.4 - Especialista O2 Inc.

Acompanhamento por especialista financeiro com reuniões mensais de análise e orientação estratégica.

---

## CLÁUSULA SEGUNDA - DA REMUNERAÇÃO

{{FORMA_PAGAMENTO}}

**Valor Total:** {{VALOR_TOTAL}}

---

## OBSERVAÇÕES

{{OBSERVACOES}}

---

## DATA E ASSINATURA

**Local e Data:** {{DATA}}

_______________________________
**CONTRATANTE:** {{CLIENTE}}
CNPJ: {{CNPJ}}

_______________________________
**CONTRATADA**
O2 INC GESTÃO E TECNOLOGIA S.A.
`,
  },
  {
    id: "plano-anual-oxigenio",
    name: "Plano Anual Oxigênio Empresarial",
    description: "Programa Educacional Anual em Gestão Estratégica e Financeira",
    createdAt: "Modelo do sistema",
    content: `# INSTRUMENTO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS

Pelo presente instrumento:

**{{CLIENTE}}**, sociedade empresária limitada, inscrita no CNPJ sob o nº **{{CNPJ}}**, com sede na **{{ENDERECO_EMPRESA}}** representada neste ato na forma de seu contrato social, por seu sócio **{{SOCIO}}**, brasileiro, empresário, inscrito no CPF sob número **{{CPF}}**, residente e domiciliado na **{{ENDERECO_SOCIO}}**, doravante referida simplesmente como "CONTRATANTE", e de outro lado;

**O2 INC GESTÃO E TECNOLOGIA S.A.**, sociedade anônima, com sede na cidade de São Paulo, Estado de São Paulo, na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, inscrita no Cadastro Nacional de Pessoa Jurídica – CNPJ sob o nº 23.813.779/0001-60, neste ato representada na forma de seu Estatuto Social, doravante denominada simplesmente "CONTRATADA".

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

{{FORMA_PAGAMENTO}}

**Valor Total:** {{VALOR_TOTAL}}

---

## OBSERVAÇÕES

{{OBSERVACOES}}

---

## DATA E ASSINATURA

**Local e Data:** {{DATA}}

_______________________________
**CONTRATANTE:** {{CLIENTE}}
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
    content: `# CONTRATO DE PARCERIA ESTRATÉGICA OXY HACKER

Pelo presente instrumento:

**O2 INC GESTÃO E TECNOLOGIA S.A.**, sociedade anônima, com sede na cidade de São Paulo, Estado de São Paulo, na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, inscrita no Cadastro Nacional de Pessoa Jurídica – CNPJ sob o nº 23.813.779/0001-60, representada na forma de seu estatuto social, doravante denominada como "CONTRATADA".

**{{CLIENTE}}**, inscrita no CNPJ sob nº **{{CNPJ}}**, com sede em **{{ENDERECO_EMPRESA}}**, representada neste ato por **{{SOCIO}}**, CPF nº **{{CPF}}**, doravante denominada simplesmente "PARCEIRA ESTRATÉGICA".

Têm entre si justo e acordado o presente CONTRATO DE PARCERIA ESTRATÉGICA OXY HACKER, que se regerá pelas cláusulas e condições a seguir:

---

## CLÁUSULA PRIMEIRA - DO OBJETO

1.1. O presente contrato tem por objeto a formalização da parceria para oferta do produto **CFO as a Service – CaaS Enterprise**, cuja comercialização é realizada pela O2 INC.

1.2. O pagamento da primeira mensalidade será integralmente destinado à O2 INC.

1.3. O atendimento operacional e consultivo do CLIENTE será prestado diretamente pela PARCEIRA ESTRATÉGICA.

---

## CLÁUSULA SEGUNDA - DO PAGAMENTO

{{FORMA_PAGAMENTO}}

**Valor Total:** {{VALOR_TOTAL}}

---

## CLÁUSULA TERCEIRA - DAS RESPONSABILIDADES

3.1. **O2 INC:** Responsável pela governança metodológica do Oxy Hacker e pela disponibilização do SaaS (Plataforma Oxy + Gênio).

3.2. **PARCEIRA ESTRATÉGICA:** Responsável integral pelo atendimento, execução e relacionamento com o CLIENTE durante a prestação do serviço de CFO as a Service.

---

## CLÁUSULA QUARTA - PROPRIEDADE INTELECTUAL

4.1. Todos os métodos, playbooks, materiais, plataformas e marcas relacionados ao programa Oxy Hacker são de propriedade exclusiva da O2 INC.

4.2. É vedado à PARCEIRA ESTRATÉGICA ou ao CLIENTE copiar, reproduzir ou utilizar tais ativos fora das condições aqui estabelecidas.

---

## CLÁUSULA QUINTA - DA CONFIDENCIALIDADE

5.1. As partes comprometem-se a manter sigilo sobre todas as informações estratégicas e a cumprir integralmente a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).

---

## CLÁUSULA SEXTA - DA RESILIÇÃO

6.1. O contrato poderá ser rescindido por inadimplemento de qualquer das partes ou por comum acordo, respeitando-se as obrigações já assumidas.

---

## CLÁUSULA SÉTIMA - DA LEI APLICÁVEL E FORO

7.1. Este contrato será regido pelas leis da República Federativa do Brasil. Qualquer disputa será submetida ao Foro Central da Cidade de São Paulo - SP.

---

## OBSERVAÇÕES

{{OBSERVACOES}}

---

## DATA E ASSINATURA

**Local e Data:** São Paulo, {{DATA}}

_______________________________
**PARCEIRA ESTRATÉGICA:** {{CLIENTE}}
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
    content: `# CONTRATO DE PARCERIA COMERCIAL PRÉVIO À COF

Pelo presente instrumento particular, as partes:

**O2 INC GESTÃO E TECNOLOGIA S.A.**, inscrita no CNPJ sob nº 23.813.779/0001-60, com sede em Porto Alegre/RS, doravante denominada simplesmente "O2 INC" ou "MATRIZ";

**{{CLIENTE}}**, inscrito no CNPJ sob nº **{{CNPJ}}**, com sede/endereço em **{{ENDERECO_EMPRESA}}**, representada neste ato na forma de seu contrato social, por seu sócio **{{SOCIO}}**, inscrito no CPF sob nº **{{CPF}}**, doravante denominado simplesmente "PARCEIRO";

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

{{FORMA_PAGAMENTO}}

**Valor Total:** {{VALOR_TOTAL}}

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

## OBSERVAÇÕES

{{OBSERVACOES}}

---

## DATA E ASSINATURA

**Local e Data:** {{DATA}}

_______________________________
**PARCEIRO:** {{CLIENTE}}
CNPJ: {{CNPJ}}
Representado por: {{SOCIO}}
CPF: {{CPF}}

_______________________________
**O2 INC GESTÃO E TECNOLOGIA S.A.**
`,
  },
  {
    id: "assessoria-ma-sellside",
    name: "Assessoria M&A - Sell Side",
    description: "Serviços de assessoria para venda de empresa (Sell Side)",
    createdAt: "Modelo do sistema",
    content: `# INSTRUMENTO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS

Pelo presente instrumento:

**{{CLIENTE}}**, sociedade empresária limitada, inscrita no CNPJ sob o nº **{{CNPJ}}**, com sede na **{{ENDERECO_EMPRESA}}** representada neste ato na forma de seu contrato social, por seu sócio **{{SOCIO}}**, brasileiro, empresário, inscrito no CPF sob número **{{CPF}}**, residente e domiciliado na **{{ENDERECO_SOCIO}}**, doravante referida simplesmente como "CONTRATANTE", e de outro lado;

**O2 INC GESTÃO E TECNOLOGIA S.A.**, sociedade anônima, com sede na cidade de São Paulo, Estado de São Paulo, na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, inscrita no Cadastro Nacional de Pessoa Jurídica – CNPJ sob o nº 23.813.779/0001-60, representada na forma de seu estatuto social, doravante denominada como "CONTRATADA".

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

{{FORMA_PAGAMENTO}}

**Valor Total Mensal:** {{VALOR_TOTAL}}

2.2 - Caso ocorra a venda da empresa durante a vigência deste contrato, a CONTRATANTE deverá pagar à CONTRATADA uma comissão correspondente a **3,5%** sobre o valor total da transação.

---

## CLÁUSULA TERCEIRA - DO PRAZO

3.1 – O presente contrato terá vigência de 12 (doze) meses.

---

## OBSERVAÇÕES

{{OBSERVACOES}}

---

## DATA E ASSINATURA

**Local e Data:** {{DATA}}

_______________________________
**CONTRATANTE:** {{CLIENTE}}
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
    content: `# INSTRUMENTO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS

Pelo presente instrumento:

**{{CLIENTE}}**, sociedade empresária limitada, inscrita no CNPJ sob o nº **{{CNPJ}}**, com sede na **{{ENDERECO_EMPRESA}}** representada neste ato na forma de seu contrato social, por seu sócio **{{SOCIO}}**, brasileiro, empresário, inscrito no CPF sob número **{{CPF}}**, residente e domiciliado na **{{ENDERECO_SOCIO}}**, doravante referida simplesmente como "CONTRATANTE", e de outro lado;

**O2 INC GESTÃO E TECNOLOGIA S.A.**, sociedade anônima, com sede na cidade de São Paulo, Estado de São Paulo, na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, inscrita no Cadastro Nacional de Pessoa Jurídica – CNPJ sob o nº 23.813.779/0001-60, neste ato representada na forma de seu Estatuto Social, doravante denominada simplesmente "CONTRATADA".

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

{{FORMA_PAGAMENTO}}

**Valor Total:** {{VALOR_TOTAL}}

---

## CLÁUSULA TERCEIRA - DO PRAZO

3.1 – O presente contrato terá vigência conforme acordo entre as partes.

---

## OBSERVAÇÕES

{{OBSERVACOES}}

---

## DATA E ASSINATURA

**Local e Data:** {{DATA}}

_______________________________
**CONTRATANTE:** {{CLIENTE}}
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
    content: `# INSTRUMENTO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS - CFO ENTERPRISE

Pelo presente instrumento:

**{{CLIENTE}}**, sociedade empresária limitada, inscrita no CNPJ sob o nº **{{CNPJ}}**, com sede na **{{ENDERECO_EMPRESA}}** representada neste ato na forma de seu contrato social, por seu sócio **{{SOCIO}}**, brasileiro, empresário, inscrito no CPF sob número **{{CPF}}**, residente e domiciliado na **{{ENDERECO_SOCIO}}**, doravante referida simplesmente como "CONTRATANTE", e de outro lado;

**O2 INC GESTÃO E TECNOLOGIA S.A.**, sociedade anônima, com sede na cidade de São Paulo, Estado de São Paulo, na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, inscrita no Cadastro Nacional de Pessoa Jurídica – CNPJ sob o nº 23.813.779/0001-60, neste ato representada na forma de seu Estatuto Social, doravante denominada simplesmente "CONTRATADA".

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

{{FORMA_PAGAMENTO}}

**Valor Total:** {{VALOR_TOTAL}}

---

## CLÁUSULA TERCEIRA - DO PRAZO

3.1 – O presente contrato terá vigência de 12 (doze) meses.

---

## OBSERVAÇÕES

{{OBSERVACOES}}

---

## DATA E ASSINATURA

**Local e Data:** São Paulo, {{DATA}}

_______________________________
**CONTRATANTE:** {{CLIENTE}}
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
    content: `# INSTRUMENTO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS

Pelo presente instrumento:

**{{CLIENTE}}**, sociedade empresária limitada, inscrita no CNPJ sob o nº **{{CNPJ}}**, com sede na **{{ENDERECO_EMPRESA}}** representada neste ato na forma de seu contrato social, por seu sócio **{{SOCIO}}**, brasileiro, empresário, inscrito no CPF sob número **{{CPF}}**, residente e domiciliado na **{{ENDERECO_SOCIO}}**, doravante referida simplesmente como "CONTRATANTE", e de outro lado;

**O2 INC GESTÃO E TECNOLOGIA S.A.**, sociedade anônima, com sede na cidade de São Paulo, Estado de São Paulo, na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, inscrita no Cadastro Nacional de Pessoa Jurídica – CNPJ sob o nº 23.813.779/0001-60, neste ato representada na forma de seu Estatuto Social, doravante denominada simplesmente "CONTRATADA".

---

## CLÁUSULA PRIMEIRA - DO OBJETO

1.1 – A CONTRATADA prestará os serviços conforme especificado neste instrumento.

---

## CLÁUSULA SEGUNDA - DA REMUNERAÇÃO

{{FORMA_PAGAMENTO}}

**Valor Total:** {{VALOR_TOTAL}}

---

## CLÁUSULA TERCEIRA - DO PRAZO

3.1 – O presente contrato terá vigência conforme acordado entre as partes.

---

## OBSERVAÇÕES

{{OBSERVACOES}}

---

## DATA E ASSINATURA

**Local e Data:** {{DATA}}

_______________________________
**CONTRATANTE:** {{CLIENTE}}
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
    content: `# CONTRATO DE PARCERIA ESTRATÉGICA OXY HACKER

Pelo presente instrumento:

**O2 INC GESTÃO E TECNOLOGIA S.A.**, sociedade anônima, com sede na cidade de São Paulo, Estado de São Paulo, na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, inscrita no Cadastro Nacional de Pessoa Jurídica – CNPJ sob o nº 23.813.779/0001-60, representada na forma de seu estatuto social, doravante denominada como "O2 INC".

**{{CLIENTE}}**, inscrita no CNPJ sob nº **{{CNPJ}}**, com sede em **{{ENDERECO_EMPRESA}}**, representada neste ato por **{{SOCIO}}**, CPF nº **{{CPF}}**, doravante denominada simplesmente "PARCEIRA".

---

## CLÁUSULA PRIMEIRA - DO OBJETO

1.1. O presente contrato tem por objeto a formalização da parceria estratégica para o programa **Oxy Hacker**.

1.2. A PARCEIRA terá direito a:
- Licença de uso da metodologia Oxy Hacker
- Acesso à plataforma Oxy Finance
- Treinamentos e certificações
- Suporte técnico e operacional

---

## CLÁUSULA SEGUNDA - DA REMUNERAÇÃO

{{FORMA_PAGAMENTO}}

**Valor Total:** {{VALOR_TOTAL}}

---

## CLÁUSULA TERCEIRA - DAS RESPONSABILIDADES

3.1. **O2 INC:** Fornecerá toda a estrutura metodológica e tecnológica.

3.2. **PARCEIRA:** Será responsável pela execução e atendimento aos clientes finais.

---

## OBSERVAÇÕES

{{OBSERVACOES}}

---

## DATA E ASSINATURA

**Local e Data:** São Paulo, {{DATA}}

_______________________________
**PARCEIRA:** {{CLIENTE}}
CNPJ: {{CNPJ}}

_______________________________
**O2 INC GESTÃO E TECNOLOGIA S.A.**
`,
  },
];
// Available placeholders for templates
export const availablePlaceholders = [
  { key: "CLIENTE", label: "Nome da Empresa", category: "empresa" },
  { key: "CNPJ", label: "CNPJ", category: "empresa" },
  { key: "ENDERECO_EMPRESA", label: "Endereço da Empresa", category: "empresa" },
  { key: "SOCIO", label: "Nome do Sócio/Representante", category: "representante" },
  { key: "CPF", label: "CPF do Representante", category: "representante" },
  { key: "ENDERECO_SOCIO", label: "Endereço do Sócio", category: "representante" },
  { key: "RG", label: "RG do Representante", category: "representante" },
  { key: "EMAIL", label: "E-mail", category: "contato" },
  { key: "TELEFONE", label: "Telefone", category: "contato" },
  { key: "VALOR_TOTAL", label: "Valor Total", category: "pagamento" },
  { key: "FORMA_PAGAMENTO", label: "Forma de Pagamento", category: "pagamento" },
  { key: "PARCELAS", label: "Parcelas", category: "pagamento" },
  { key: "DATA", label: "Data de Assinatura", category: "contrato" },
  { key: "OBSERVACOES", label: "Observações", category: "contrato" },
  { key: "PRODUTOS", label: "Tabela de Produtos", category: "contrato" },
];
