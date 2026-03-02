import type { Template } from "@/components/wizard/ContractWizard";

// All contract templates for O2 Inc products/services
export const defaultTemplates: Template[] = [
  {
    id: "cfo-enterprise",
    name: "CFO Enterprise",
    description: "Assessoria de Gestão Financeira Recorrente - CFO as a Service",
    createdAt: "Modelo do sistema",
    content: `# CFO AS A SERVICE

## Contratante

{{CLIENTE}}, pessoa jurídica de direito privado, inscrita no CNPJ sob nº {{CNPJ}}, com sede na {{ENDERECO_EMPRESA}}, neste ato representada por seu(ua) representante legal, {{SOCIO}}, brasileiro(a), inscrito(a) no CPF sob nº {{CPF}}, doravante designado CONTRATANTE.

## Contratada

O2 INC GESTÃO E TECNOLOGIA S.A., sociedade anônima, inscrita no CNPJ sob nº 23.813.779/0001-60, com sede na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, São Paulo/SP, endereço de e-mail cs@o2inc.com.br, doravante designada CONTRATADA.

---

## CONDIÇÕES DO CONTRATO CFO AS A SERVICE

| Item | Condição |
|------|----------|
| Valor do SETUP | R$ {{VALOR_SETUP}} em 12x de R$ {{VALOR_PARCELA_SETUP}} |
| Pagamento SETUP | Cartão de Crédito (link de pagamento) |
| Mensalidade CFO as a Service | R$ {{VALOR_MENSALIDADE}} /mês |
| Pagamento Mensalidade | Boleto Bancário |
| Primeiro pagamento mensalidade | 30 dias após assinatura |
| Vigência | 12 meses (renovação automática) |
| Aviso prévio para cancelamento | {{AVISO_PREVIO_DIAS}} dias |
| Data de início do projeto | {{DATA}} |

---

## DESCRITIVO DO SERVIÇO

### Módulo: SETUP

**Duração:** até 90 dias após o kick-off

**Encontros:** Touch point semanal (reunião ou contato telefônico/WhatsApp)

**Encontros obrigatórios:** 4 encontros iniciais para entrevistas e compreensão dos processos

### Entregáveis do SETUP

- a) PLANO DE CONTAS
  - Análise do Plano de Contas atual
  - Identificação de otimizações e melhorias
  - Sugestão de mudanças e suporte técnico ao time
- b) DADOS
  - Check list dos principais processos geradores de dados
  - Compreensão de Faturamento, Contas a Receber/Pagar, Conciliação bancária
  - Sugestão de mudanças e suporte técnico
- c) ERP
  - Análise do ERP e identificação de pré-requisitos
  - Identificação de pontos de atenção e sub-utilizações
  - Compreensão de possíveis melhorias
- d) TECNOLOGIA
  - Análise técnica e definição da modalidade de integração
  - Alinhamento Plano de Contas ERP → Plataforma Oxy
  - Integração, validação e liberação de acessos

**Diretrizes:** O prazo de 90 dias depende do engajamento da CONTRATANTE. Caso a implantação dependa de ERP ou outras ferramentas, o prazo será revisto em comum acordo.

---

### Módulo: CFO AS A SERVICE

**Periodicidade:** Mensal, com encontros semanais e Comitê Estratégico mensal

**Pré-requisito:** Conclusão do SETUP e acesso ao curso Business Class

### Serviços Inclusos

- a) Organização de processos financeiros: mapeamento, identificação de melhorias e direcionamento para implementação
- b) Organização da base de dados: garantia de dados sólidos por caixa e competência no ERP
- c) Plano de contas gerencial: revisão ou criação com base na realidade específica do negócio
- d) Construção e Análise do DRE: DRE Gerencial para análise de resultado mensal
- e) Construção e Análise do Fluxo de Caixa: projeção para previsibilidade de recursos
- f) Curva ABC de clientes e fornecedores: análise de representatividade (se aplicável)
- g) Interlocução com a Contabilidade: apoio nos ritos de fechamento mensal
- h) Planejamento orçamentário: elaboração de orçamento e acompanhamento vs realizado
- i) Acompanhamento Plataforma Oxy: informações de Lucro e Caixa otimizando a gestão
- j) Reunião semanal de alinhamento: pautas pertinentes e gestão financeira estratégica
- k) Comitê Estratégico Mensal: apresentação dos números e discussões estratégicas
- l) Orientação da Equipe Interna: direcionamento para seguir processos estabelecidos
- m) Suporte na Captação de Recursos: orientação para apresentação a bancos e investidores
- n) Suporte na Reestruturação de Passivos: análise de dívidas e estratégias de renegociação
- o) Construção e Análise do Ciclo Financeiro: otimização do capital de giro

**Diretrizes:** A CONTRATADA não gerencia colaboradores diariamente. Encontros presenciais, se aceitos, terão custos por conta da CONTRATANTE (solicitação com 60 dias de antecedência).

---

## MASTER SERVICE AGREEMENT

### 1. FORMA DE PAGAMENTO

1.1 O SETUP será pago via cartão de crédito, com tarifas já inclusas, por meio de link de pagamento enviado pela CONTRATADA.

1.2 A mensalidade será paga via boleto bancário, com primeiro pagamento 30 dias após assinatura.

1.3 Em caso de inadimplemento: multa de 2% + juros de 1% ao mês sobre o débito.

1.4 A inadimplência autoriza a suspensão dos serviços e uso de serviços de proteção ao crédito.

1.5 Reajuste anual pelo IPCA ou índice substituto, na data de renovação.

### 2. OBRIGAÇÕES DA CONTRATADA

2.1 Prestar os serviços com os mais altos padrões profissionais, de forma diligente e eficiente.

2.2 Manter sigilo absoluto sobre informações confidenciais, financeiras e estratégicas da CONTRATANTE.

2.3 Prestar suporte contínuo para esclarecimentos e orientações técnicas durante a vigência.

### 3. OBRIGAÇÕES DA CONTRATANTE

3.1 Disponibilizar tempestivamente todas as informações necessárias para execução dos serviços.

3.2 Efetuar os pagamentos nos prazos e condições estabelecidos.

3.3 Assistir integralmente os cursos e materiais formativos (Business Class).

3.4 Garantir presença de pelo menos um sócio nas reuniões semanais e Comitês Estratégicos.

3.5 Adotar as recomendações estratégicas, operacionais e financeiras propostas.

3.6 Utilizar sistemas adequados de gestão (ERP) para garantir a qualidade das entregas.

### 4. CONFIDENCIALIDADE E PROTEÇÃO DE DADOS

4.1 A CONTRATADA manterá sigilo absoluto sobre informações confidenciais, exceto as necessárias ao cumprimento do contrato.

4.2 A CONTRATADA observará rigorosamente a Lei nº 13.709/2018 (LGPD), assegurando proteção e confidencialidade dos dados.

### 5. RESCISÃO E CANCELAMENTO

5.1 O SETUP é irrevogável e irretratável após assinatura, salvo descumprimento contratual.

5.2 Em caso de descumprimento pela CONTRATANTE, a CONTRATADA terá direito ao valor integral do SETUP, disponibilizando as entregas desenvolvidas.

5.3 O CFO as a Service pode ser rescindido por qualquer parte mediante aviso prévio de {{AVISO_PREVIO_DIAS}} dias, formalizado por e-mail para cs@o2inc.com.br.

5.4 A rescisão não afeta direitos legais disponíveis nem obrigações devidas até a data, incluindo encargos pendentes.

### 6. NÃO SOLICITAÇÃO

6.1 Durante a vigência e por 2 anos após o término, as PARTES não contratarão ou tentarão atrair sócios, colaboradores ou prestadores da outra PARTE, salvo autorização por escrito.

### 7. DISPOSIÇÕES GERAIS

7.1 A invalidade de qualquer disposição não afeta as demais, que permanecerão válidas e exequíveis.

7.2 Alterações só serão válidas se aprovadas por ambas as PARTES, formalizadas por escrito e assinadas.

7.3 Notificações serão por: (i) Cartório de Títulos e Documentos; (ii) carta registrada; ou (iii) e-mail com comprovante de envio.

7.4 Este Contrato é de natureza estritamente civil, inexistindo vínculo empregatício entre as PARTES.

7.5 A prestação dos serviços configura obrigação de meio e não de resultado.

7.6 As PARTES comprometem-se a não oferecer, dar ou aceitar pagamentos, doações ou vantagens que constituam prática ilegal ou de corrupção.

7.7 Este Contrato é irrevogável, irretratável e representa o acordo completo entre as PARTES, substituindo entendimentos anteriores.

### 8. LEI APLICÁVEL E FORO

8.1 Este contrato será regido pelas leis da República Federativa do Brasil. Qualquer disputa será submetida ao Foro Central da Cidade de São Paulo - SP, com exclusão de qualquer outro.

---

São Paulo, {{DATA}}

| CONTRATANTE | CONTRATADA |
|-------------|------------|
| _______________________________ | _______________________________ |
| {{CLIENTE}} | O2 INC GESTÃO E TECNOLOGIA S.A. |

### TESTEMUNHAS:

| _______________________________ | _______________________________ |
|-------------|------------|
| Nome: | Nome: |
| CPF: | CPF: |
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
    content: `# SAAS OXY + GÊNIO

## Contratante

{{CLIENTE}}, pessoa jurídica de direito privado, inscrita no CNPJ sob nº {{CNPJ}}, com sede na {{ENDERECO_EMPRESA}}, neste ato representada por seu(ua) representante legal, {{SOCIO}}, brasileiro(a), inscrito(a) no CPF sob nº {{CPF}}, doravante designado CONTRATANTE.

## Contratada

O2 INC GESTÃO E TECNOLOGIA S.A., sociedade anônima, inscrita no CNPJ sob nº 23.813.779/0001-60, com sede na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, São Paulo/SP, endereço de e-mail cs@o2inc.com.br, doravante designada CONTRATADA.

---

## CONDIÇÕES DO CONTRATO SAAS OXY + GÊNIO

| Item | Condição |
|------|----------|
| Valor do SETUP | R$ {{VALOR_SETUP}} (à vista ou 12x cartão) |
| Pagamento SETUP | À vista (boleto/TED) ou 12x Cartão de Crédito |
| Mensalidade Plataforma Oxy + Gênio | R$ {{VALOR_MENSALIDADE}} /mês |
| Pagamento Mensalidade | Boleto Bancário (recorrente) |
| Vigência | 12 meses (renovação automática) |
| Aviso prévio para cancelamento | 30 dias (via e-mail cs@o2inc.com.br) |
| Data de início do projeto | {{DATA}} |

---

## DESCRITIVO DO SERVIÇO

### Módulo: SETUP

**Duração:** até 90 dias após o kick-off

**Encontros:** Touch point semanal (reunião ou contato telefônico/WhatsApp)

**Encontros obrigatórios:** 4 encontros iniciais para entrevistas e compreensão dos processos

### Entregáveis do SETUP

- a) PLANO DE CONTAS
  - Análise do Plano de Contas atual
  - Identificação de otimizações e melhorias
  - Sugestão de mudanças e suporte técnico ao time
- b) DADOS
  - Checklist dos processos geradores de dados
  - Entrevistas com áreas financeiras
  - Identificação de melhorias e suporte ao time
- c) ERP
  - Análise do sistema e identificação de pré-requisitos
  - Verificação de subutilizações e possíveis melhorias
- d) TECNOLOGIA
  - Análise técnica e definição da modalidade de integração
  - Alinhamento Plano de Contas ERP → Plataforma Oxy
  - Integração, validação e liberação de acessos

**Diretrizes:** O prazo de 90 dias depende do engajamento da CONTRATANTE. Caso a implantação dependa de ERP ou outras ferramentas, o prazo será revisto em comum acordo.

---

### Módulo: PLATAFORMA OXY + GÊNIO (IA)

**Descrição:** Plataforma tecnológica para gestão estratégica e financeira com Agente de Inteligência Artificial especializado em finanças.

### Funcionalidades Inclusas

- a) Aba DRE (Demonstrativo de Resultado): análises vertical, horizontal e mensal; gráficos; comparação de períodos; detalhamento por categorias e fornecedores
- b) Aba Fluxo de Caixa: análise mensal; comparações de períodos; curva ABC; projeções de fluxo de caixa diário
- c) Análise do Ciclo Financeiro: indicadores PMP, PME, PMR, Ciclo Financeiro e Operacional; análises por cliente e fornecedor; gráficos de capital de giro
- d) Planejamento Orçamentário: projeções com base em histórico do ERP; análise orçado x realizado; cruzamento de dados
- e) Agente de IA (Gênio): questionamentos em tempo real com base nos dados do ERP; insights instantâneos; recomendações financeiras

**Diretrizes:** A CONTRATADA não se responsabiliza por inconsistências nos dados ou atrasos decorrentes do não cumprimento das ações sugeridas. Recomenda-se dupla verificação dos insights do Gênio.

---

## MASTER SERVICE AGREEMENT

### 1. FORMA DE PAGAMENTO

1.1 O SETUP é exigível no ato da assinatura, podendo ser: (a) à vista via TED/boleto; ou (b) parcelado em 12x no cartão de crédito com tarifas inclusas.

1.2 A mensalidade da Plataforma Oxy + Gênio será paga via boleto bancário com vencimento recorrente.

1.3 Em caso de inadimplemento: multa de 2% + juros de 1% ao mês sobre o débito.

1.4 A inadimplência autoriza a suspensão do acesso à Plataforma e uso de medidas legais para recuperação de valores.

1.5 Reajuste anual pelo IPCA ou índice substituto, na data de renovação.

### 2. OBRIGAÇÕES DA CONTRATADA

2.1 Realizar a entrega do escopo contratado do serviço de Setup da Plataforma Oxy + Gênio.

2.2 Assegurar o funcionamento e manutenção da Plataforma durante a vigência, incluindo atualizações e correções necessárias.

### 3. OBRIGAÇÕES DA CONTRATANTE

3.1 Participar ativamente do processo de Setup, cumprindo prazos, reuniões e atividades definidos.

3.2 Seguir as instruções, orientações técnicas e boas práticas recomendadas para utilização da Plataforma.

3.3 Utilizar a plataforma de forma responsável, dentro dos limites contratuais e em conformidade com a legislação vigente.

3.4 Efetuar os pagamentos devidos nos prazos e condições estabelecidos.

### 4. CONFIDENCIALIDADE E PROTEÇÃO DE DADOS

4.1 A CONTRATADA manterá sigilo absoluto sobre informações confidenciais, exceto as necessárias ao cumprimento do contrato.

4.2 A CONTRATADA observará rigorosamente a Lei nº 13.709/2018 (LGPD), assegurando proteção e confidencialidade dos dados.

### 5. RESCISÃO E CANCELAMENTO

5.1 O SETUP é irrevogável e irretratável, não sendo passível de reembolso após assinatura.

5.2 A Plataforma Oxy + Gênio pode ser rescindida a qualquer momento mediante aviso prévio de 30 dias, por escrito, enviado a cs@o2inc.com.br.

5.3 Em qualquer hipótese de rescisão, não haverá devolução de valores já pagos.

5.4 A rescisão não prejudica o direito das partes de buscar medidas legais cabíveis.

### 6. NÃO SOLICITAÇÃO

6.1 Durante a vigência e por 2 anos após o término, as PARTES não contratarão ou tentarão atrair sócios, colaboradores ou prestadores da outra PARTE, salvo autorização por escrito.

### 7. DISPOSIÇÕES GERAIS

7.1 A invalidade de qualquer disposição não afeta as demais, que permanecerão válidas e exequíveis.

7.2 Alterações só serão válidas se aprovadas por ambas as PARTES, formalizadas por escrito e assinadas.

7.3 Notificações serão por: (i) Cartório de Títulos e Documentos; (ii) carta registrada; ou (iii) e-mail com comprovante de envio.

7.4 Este Contrato é de natureza estritamente civil, inexistindo vínculo empregatício entre as PARTES.

7.5 A prestação dos serviços configura obrigação de meio e não de resultado.

7.6 As PARTES comprometem-se a não oferecer, dar ou aceitar pagamentos, doações ou vantagens que constituam prática ilegal ou de corrupção.

7.7 Este Contrato é irrevogável, irretratável e representa o acordo completo entre as PARTES, substituindo entendimentos anteriores.

### 8. LEI APLICÁVEL E FORO

8.1 Este contrato será regido pelas leis da República Federativa do Brasil. Qualquer disputa será submetida ao Foro Central da Cidade de São Paulo - SP, com exclusão de qualquer outro.

---

São Paulo, {{DATA}}

| CONTRATANTE | CONTRATADA |
|-------------|------------|
| _______________________________ | _______________________________ |
| {{CLIENTE}} | O2 INC GESTÃO E TECNOLOGIA S.A. |

### TESTEMUNHAS:

| _______________________________ | _______________________________ |
|-------------|------------|
| Nome: | Nome: |
| CPF: | CPF: |
`,
  },
  {
    id: "saas-oxy-genio-especialista",
    name: "SaaS Oxy + Gênio + Especialista",
    description: "Plataforma Oxy com IA e acompanhamento de especialista O2",
    createdAt: "Modelo do sistema",
    content: `# SAAS OXY + GÊNIO + ESPECIALISTA

## Contratante

{{CLIENTE}}, pessoa jurídica de direito privado, inscrita no CNPJ sob nº {{CNPJ}}, com sede na {{ENDERECO_COMPLETO}}, neste ato representada por seu(ua) representante legal, {{NOME_SOCIO}}, brasileiro(a), inscrito(a) no CPF sob nº {{CPF}}, doravante designado CONTRATANTE.

## Contratada

O2 INC GESTÃO E TECNOLOGIA S.A., sociedade anônima, inscrita no CNPJ sob nº 23.813.779/0001-60, com sede na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, São Paulo/SP, endereço de e-mail cs@o2inc.com.br, doravante designada CONTRATADA.

---

## CONDIÇÕES DO CONTRATO

| Item | Condição |
|------|----------|
| Valor do SETUP | R$ {{VALOR_SETUP}} (à vista ou 12x cartão) |
| Pagamento SETUP | À vista (boleto/TED) ou 12x Cartão de Crédito |
| Mensalidade (Oxy + Gênio + Especialista) | R$ {{VALOR_MENSALIDADE}} /mês |
| Pagamento Mensalidade | Boleto Bancário (recorrente) |
| Vigência | 12 meses (renovação automática) |
| Aviso prévio para cancelamento | {{AVISO_DIAS}} dias (via e-mail cs@o2inc.com.br) |
| Data de início do projeto | {{DATA}} |

---

## DESCRITIVO DO SERVIÇO

### Módulo: SETUP

**Duração:** até 90 dias após o kick-off

**Encontros:** Touch point semanal (reunião ou contato telefônico/WhatsApp)

**Encontros obrigatórios:** 4 encontros iniciais para entrevistas e compreensão dos processos

### Entregáveis do SETUP

- a) PLANO DE CONTAS
  - Análise do Plano de Contas atual, otimizações e suporte técnico
- b) DADOS
  - Checklist dos processos, entrevistas financeiras, identificação de melhorias
- c) ERP
  - Análise do sistema, pré-requisitos, subutilizações e melhorias
- d) TECNOLOGIA
  - Integração ERP → Oxy, validação e liberação de acessos

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

São Paulo, {{DATA}}

| CONTRATANTE | CONTRATADA |
|-------------|------------|
| _______________________________ | _______________________________ |
| {{CLIENTE}} | O2 INC GESTÃO E TECNOLOGIA S.A. |

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
  { key: "NOME_SOCIO", label: "Nome do Sócio (alternativo)", category: "representante" },
  { key: "CPF", label: "CPF do Representante", category: "representante" },
  { key: "ENDERECO_SOCIO", label: "Endereço do Sócio", category: "representante" },
  { key: "ENDERECO_COMPLETO", label: "Endereço Completo da Empresa", category: "empresa" },
  { key: "RG", label: "RG do Representante", category: "representante" },
  { key: "EMAIL", label: "E-mail", category: "contato" },
  { key: "TELEFONE", label: "Telefone", category: "contato" },
  { key: "VALOR_TOTAL", label: "Valor Total", category: "pagamento" },
  { key: "VALOR_SETUP", label: "Valor do Setup", category: "pagamento" },
  { key: "VALOR_MENSALIDADE", label: "Valor da Mensalidade", category: "pagamento" },
  { key: "VALOR_PARCELA_SETUP", label: "Parcela do Setup (12x)", category: "pagamento" },
  { key: "FORMA_PAGAMENTO", label: "Forma de Pagamento", category: "pagamento" },
  { key: "PARCELAS", label: "Parcelas", category: "pagamento" },
  { key: "DATA", label: "Data de Assinatura", category: "contrato" },
  { key: "AVISO_PREVIO_DIAS", label: "Dias de Aviso Prévio", category: "contrato" },
  { key: "AVISO_DIAS", label: "Dias de Aviso (alternativo)", category: "contrato" },
  { key: "OBSERVACOES", label: "Observações", category: "contrato" },
  { key: "PRODUTOS", label: "Tabela de Produtos", category: "contrato" },
  { key: "NOME_TESTEMUNHA1", label: "Nome Testemunha 1", category: "assinatura" },
  { key: "CPF_TESTEMUNHA1", label: "CPF Testemunha 1", category: "assinatura" },
  { key: "NOME_TESTEMUNHA2", label: "Nome Testemunha 2", category: "assinatura" },
  { key: "CPF_TESTEMUNHA2", label: "CPF Testemunha 2", category: "assinatura" },
];
