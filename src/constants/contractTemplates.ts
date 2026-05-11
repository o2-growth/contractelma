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

## Contratada

O2 INC GESTÃO E TECNOLOGIA S.A., sociedade anônima, inscrita no CNPJ sob nº 23.813.779/0001-60, com sede na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, São Paulo/SP, endereço de e-mail cs@o2inc.com.br, doravante designada CONTRATADA.

---

## DESCRITIVO DO SERVIÇO

### Módulo: SETUP

**Duração:** até 90 dias após o kick-off

**Encontros:** Touch point semanal (reunião ou contato telefônico/WhatsApp)

**Encontros obrigatórios:** 4 encontros iniciais para entrevistas e compreensão dos processos

### Entregáveis do SETUP

- a) PLANO DE CONTAS — Análise do Plano de Contas atual, otimizações e suporte técnico para reformulação conforme boas práticas; sugestão de centros de custo/resultado e tags gerenciais; suporte na padronização de lançamentos contábeis recorrentes; revisão periódica com a contabilidade.
- b) DADOS — Checklist dos processos internos e financeiros; entrevistas de diagnóstico financeiro; identificação de gaps e melhorias imediatas; suporte técnico para adequação dos processos.
- c) ERP — Análise do sistema de gestão atual (ERP); levantamento de pré-requisitos de integração; identificação de subutilizações e recomendações de melhorias; apoio técnico na parametrização de relatórios financeiros.
- d) TECNOLOGIA — Integração ERP → Oxy; validação dos dados migrados; liberação de acessos ao ambiente da plataforma.

---

### Módulo: PLATAFORMA OXY + GÊNIO (IA)

- a) Aba DRE: análises vertical, horizontal e mensal; gráficos e comparação entre períodos
- b) Aba Fluxo de Caixa: análise mensal; curva ABC de entradas e saídas; projeções diárias
- c) Ciclo Financeiro: indicadores PMP, PME, PMR; análises por cliente/fornecedor
- d) Planejamento Orçamentário: projeções baseadas em histórico; orçado x realizado
- e) Agente de IA (Gênio): questionamentos em tempo real; insights instantâneos sobre dados financeiros

---

### Módulo: CFO AS A SERVICE

**Encontros:** 4 encontros por mês (semanais), virtuais, mediante agendamento

### Regras do CFO as a Service

- f) Encontros agendados pela CONTRATANTE conforme disponibilidade da agenda (via link)
- g) Assessoria financeira ocorre exclusivamente durante os encontros, com base nos dados da Oxy e Gênio
- h) Não inclui trabalhos manuais, materiais em ferramentas paralelas ou atividades fora dos encontros
- i) Encontros não comparecidos não são passíveis de reagendamento ou compensação
- j) Horas não utilizadas no mês não são cumulativas para meses seguintes

**Diretrizes:** A CONTRATADA não se responsabiliza por inconsistências nos dados ou atrasos decorrentes do não cumprimento das ações sugeridas. Recomenda-se dupla verificação dos insights gerados pela IA.

---

## MASTER SERVICE AGREEMENT

### 1. FORMA DE PAGAMENTO

1.1 O SETUP é exigível no ato da assinatura: (a) à vista via TED/boleto; ou (b) 12x cartão de crédito com tarifas inclusas.

1.2 A mensalidade (CFO as a Service) será paga via boleto bancário com vencimento recorrente.

1.3 Em caso de inadimplemento: multa de 2% + juros de 1% ao mês sobre o débito.

1.4 A inadimplência autoriza a suspensão do acesso à Plataforma e uso de medidas legais para recuperação.

1.5 Reajuste anual pelo IPCA ou índice substituto, na data de renovação.

### 2. OBRIGAÇÕES DA CONTRATADA

2.1 Realizar a entrega do escopo contratado do Setup, incluindo integração e parametrização da Plataforma Oxy + Gênio.

2.2 Disponibilizar 4 encontros mensais com CFO dedicado para esclarecimentos, orientações técnicas e análise financeira.

2.3 Assegurar funcionamento e manutenção da Plataforma, incluindo atualizações e correções.

### 3. OBRIGAÇÕES DA CONTRATANTE

3.1 Participar ativamente do Setup, cumprindo prazos, reuniões e atividades definidos no cronograma.

3.2 Seguir instruções, orientações técnicas e boas práticas para utilização da Plataforma.

3.3 Utilizar a plataforma de forma responsável, dentro dos limites contratuais e legais.

3.4 Efetuar os pagamentos nos prazos e condições estabelecidos neste contrato.

### 4. CONFIDENCIALIDADE E PROTEÇÃO DE DADOS

4.1 A CONTRATADA manterá sigilo absoluto sobre todas as informações confidenciais da CONTRATANTE.

4.2 Observância rigorosa da Lei nº 13.709/2018 (LGPD) em relação ao tratamento de dados pessoais.

### 5. RESCISÃO E CANCELAMENTO

5.1 O SETUP é irrevogável e irretratável, não sendo passível de reembolso após contratação.

5.2 Plataforma + CFO podem ser rescindidos mediante aviso prévio de {{PRAZO_RESCISAO}} dias via cs@o2inc.com.br.

5.3 Em qualquer rescisão, não haverá devolução de valores já pagos.

5.4 A rescisão não prejudica direitos legais cabíveis a qualquer das partes.

### 6. NÃO SOLICITAÇÃO

6.1 Durante a vigência e por 2 anos após o término, as PARTES não contratarão sócios, colaboradores ou prestadores da outra PARTE, direta ou indiretamente.

### 7. DISPOSIÇÕES GERAIS

7.1 A invalidade de qualquer disposição não afeta as demais cláusulas deste contrato.

7.2 Alterações só serão válidas se formalizadas por escrito e assinadas por ambas as partes.

7.3 Notificações por cartório, carta registrada ou e-mail com comprovante de recebimento.

7.4 Contrato de natureza civil, sem vínculo empregatício entre as partes.

7.5 Prestação de serviços configura obrigação de meio, não de resultado.

7.6 As PARTES não oferecerão ou aceitarão pagamentos ou vantagens que constituam prática ilegal.

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
    id: "saas-oxy-genio-modelo1",
    name: "SaaS Oxy + Gênio (Modelo 1 - Oficial)",
    description: "Modelo 1 oficial O2 Inc - Prestação de Serviços SaaS Plataforma Oxy + Gênio com setup e licença mensal",
    createdAt: "Modelo do sistema",
    category: "saas",
    docxTemplate: "templates/base/saas-oxy-genio-modelo1.docx",
    content: `# CONTRATO DE PRESTAÇÃO DE SERVIÇOS

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

### REMUNERAÇÃO DO SETUP

| Campo | Valor |
|-------|-------|
| **VALOR** | {{valor_extenso_setup}} |
| **FORMA DE PAGAMENTO** | {{parcelas_valor_extenso}} via cartão de crédito, com tarifas já inclusas, por meio de link de pagamento a ser enviado pela CONTRATADA, iniciando-se a partir de {{data_setup}}. |
| **CONDIÇÕES ESPECIAIS** | {{condicoes_especiais}} |

### REMUNERAÇÃO PELO USO DA PLATAFORMA OXY E GÊNIO

| Campo | Valor |
|-------|-------|
| **VALOR** | {{valor_plataforma}} |
| **FORMA DE PAGAMENTO** | De forma mensal por meio de boleto bancário. O primeiro pagamento deverá ser realizado exatamente {{dias_primeiro_pagamento}} dias após a data de assinatura deste Contrato, e os demais pagamentos serão efetuados mensalmente, no mesmo dia dos meses subsequentes. |
| **CONDIÇÕES ESPECIAIS** | {{condicoes_especiais_plataforma}} |

### VIGÊNCIA

| Campo | Valor |
|-------|-------|
| **INÍCIO DA VIGÊNCIA** | {{inicio_vigencia}} |
| **PRAZO DE VIGÊNCIA** | {{prazo_vigencia}} |
| **RENOVAÇÃO** | Automática por igual período, a menos que haja manifestação contrária de uma das Partes com antecedência mínima de 30 (trinta) dias do término deste Contrato. |
| **RESCISÃO** | Mediante aviso prévio de {{dias_rescisao}} dias. |

---

Pelo presente instrumento, as seguintes partes:

**CONTRATADA: O2 INC GESTÃO E TECNOLOGIA S.A.**, sociedade anônima, com sede na cidade de São Paulo, Estado de São Paulo, na Avenida Brigadeiro Faria Lima, 1811, bairro Jardim Paulista, CEP 01452-001, inscrita no Cadastro Nacional de Pessoa Jurídica – CNPJ sob o nº 23.813.779/0001-60, neste ato representada na forma de seu Estatuto Social, doravante denominada simplesmente "CONTRATADA";

**CONTRATANTE:** qualificada de acordo com os dados constantes do QUADRO RESUMO, neste ato representada na forma de seu Contrato Social, a partir de agora denominada "CONTRATANTE".

A CONTRATANTE e a CONTRATADA são, periódica e coletivamente, referidas neste instrumento como "Partes" e, individualmente, "Parte".

Resolvem as Partes, de comum acordo e na melhor forma de direito, celebrarem o presente instrumento particular de Contrato de Prestação de Serviços ("Contrato"), nos termos e condições a seguir estabelecidos:

---

## CLÁUSULA PRIMEIRA — DO OBJETO

**1.1** O presente instrumento tem como objeto a prestação de serviço de Setup somado a uma licença de uso da Plataforma Oxy e Gênio (Agente de Inteligência Artificial especializado em finanças) ("Plataforma") de forma remota para empresa CONTRATANTE ("Serviços"), seguindo estritamente os detalhes acordados e apresentados na Proposta Comercial disposta no ANEXO I.

**1.2** Os prazos para a prestação dos Serviços serão definidos conforme a disponibilidade de agenda da CONTRATADA e da CONTRATANTE. O prazo estimado para conclusão do SETUP dependerá fundamentalmente do engajamento e da participação dos sócios e da equipe da CONTRATANTE. Caso a conclusão do SETUP dependa ainda da implantação de sistema ERP e/ou de outras ferramentas, ou o ERP do cliente não forneça as condições adequadas para a implantação da Plataforma, o prazo deverá ser revisto em cronograma estabelecido de comum acordo entre as Partes.

**1.3** A CONTRATADA não se responsabiliza por inconsistências nos dados ou atrasos decorrentes do não cumprimento das ações sugeridas.

**1.4** Caso a CONTRATANTE opte por não utilizar um ERP ou ferramenta equivalente de gestão financeira, as entregas poderão ser comprometidas.

**1.5** A CONTRATANTE tem ciência de que os serviços e funcionalidades contratados são exatamente aqueles previstos neste instrumento e contidos na Plataforma, não estando a CONTRATADA obrigada a fornecer qualquer funcionalidade ou recurso futuro a ser incorporado à Plataforma.

---

## CLÁUSULA SEGUNDA — DA REMUNERAÇÃO

**2.1** A CONTRATADA, pelo produto referente ao objeto deste instrumento, fará jus à remuneração de SETUP, a qual será paga pela CONTRATANTE conforme valores, prazos e forma de pagamento dispostos na seção "REMUNERAÇÃO DE SETUP" do QUADRO RESUMO.

**2.2** Pela licença de uso da Plataforma (Tecnologia e Manutenção), composta pela Oxy e pelo Agente de IA especializado em finanças, a CONTRATANTE pagará à CONTRATADA a remuneração mensal conforme valores, prazos e forma de pagamento dispostos na seção "REMUNERAÇÃO PELO USO DA PLATAFORMA OXY E GÊNIO" constante no QUADRO RESUMO.

**2.3** O não pagamento até o prazo de vencimento acordado de qualquer valor devido à CONTRATADA, acarretará à CONTRATANTE o pagamento de multa de 2% (dois por cento), devida a partir do dia seguinte ao vencimento, e cobrada em uma única vez, além de correção monetária pelo IPCA/IBGE e juros de mora de 1% (um por cento) ao mês, calculados pro rata die, ambos sobre o valor da fatura em atraso.

**Parágrafo primeiro:** Caso o prazo de vencimento seja sábado, domingo ou feriado nacional, o vencimento será prorrogado para o primeiro dia útil subsequente ao vencimento.

**Parágrafo segundo:** Em caso de inadimplência por parte da CONTRATANTE, a CONTRATADA poderá suspender o acesso à Plataforma a partir do vencimento de qualquer parcela não quitada, até que os valores em aberto sejam regularizados.

---

## CLÁUSULA TERCEIRA — DO PRAZO

**3.1** O presente Contrato terá prazo de vigência conforme descrito na seção "VIGÊNCIA" do QUADRO RESUMO.

**3.2** O valor contratual será atualizado anualmente, na data da renovação, com base na variação acumulada do Índice Nacional de Preços ao Consumidor Amplo (IPCA), ou outro índice oficial que venha a substituí-lo, referente ao período de 12 (doze) meses imediatamente anteriores.

---

## CLÁUSULA QUARTA — DAS OBRIGAÇÕES DA CONTRATADA

**4.1** A CONTRATADA se compromete a prestar os serviços contratados com diligência, dentro dos padrões técnicos e operacionais acordados, e em conformidade com a legislação vigente. Nesse sentido, as obrigações da CONTRATADA incluem, mas não se limitam a:

**4.1.1** Realizar a entrega do escopo contratado do serviço de Setup da Plataforma, conforme definido entre as Partes no início da vigência contratual.

**4.1.2** Assegurar o funcionamento e a manutenção da Plataforma durante a vigência contratual, incluindo atualizações e correções necessárias para o bom desempenho da solução.

---

## CLÁUSULA QUINTA — DAS OBRIGAÇÕES DA CONTRATANTE

**5.1** Participar ativamente do processo de Setup, cumprindo os prazos, reuniões e atividades definidos pela CONTRATADA, a fim de garantir a correta implantação da plataforma, eximindo a CONTRATADA de qualquer atraso ocasionado no prazo, conforme Anexo I.

**5.2** Seguir as instruções, orientações técnicas e boas práticas recomendadas pela CONTRATADA para a melhor utilização da Plataforma.

**5.3** Utilizar a plataforma e seus recursos de forma responsável, dentro dos limites contratuais e em conformidade com a legislação vigente, sendo vedado qualquer uso indevido ou que comprometa a integridade da solução.

**5.4** Efetuar os pagamentos devidos à CONTRATADA nos prazos e condições ajustadas entre as Partes.

---

## CLÁUSULA SEXTA — DA CONFIDENCIALIDADE E PROTEÇÃO DE DADOS

**6.1** As Partes obrigam-se por si, por seus sócios, diretores, funcionários, prepostos e/ou pessoal contratado, a guardar o mais completo e absoluto sigilo em relação a todas e quaisquer informações relacionadas às atividades da outra Parte, das quais venham a ter conhecimento ou acesso em razão da prestação dos Serviços objeto do presente Contrato por 5 (cinco) anos após o término deste Contrato.

**6.2** As Partes concordam em manter sigilosas e não divulgar a terceiros, sem o prévio consentimento escrito da outra Parte, informações privilegiadas que digam respeito às atividades e aos negócios de ambas as Partes.

**6.3** As Informações Confidenciais incluem informações relacionadas aos produtos e serviços, operações, dados pessoais, clientes e prospects, banco de dados, tecnologia, know-how, pesquisa e desenvolvimento, estratégias comerciais e financeiras, direitos sobre desenhos, segredos de mercado, oportunidades de mercado ou relações comerciais, inclusive ferramentas de software, designs de hardware, algoritmos, design de interface de usuário, arquitetura, bibliotecas, objetos e documentação em qualquer formato, rede ou designs de soluções, segredos comerciais e quaisquer direitos sobre propriedade intelectual no mundo, incluindo derivativas, melhorias, aperfeiçoamentos ou extensões pertinentes, concebidas, reduzidas à prática ou desenvolvidas por uma das Partes.

**6.4** Não serão consideradas como Informações Confidenciais, conforme acima definido, aquelas que: (i) sejam de prévio conhecimento da outra Parte; (ii) pertenciam ao domínio público em data anterior à data da divulgação; (iii) tornaram-se parte do domínio público sem culpa comprovada da outra Parte; (iv) forem, a partir da assinatura deste Contrato, obtida pela outra parte de boa-fé de um terceiro que não tenha recebido tal informação de outro que sabidamente estava obrigado a manter segredo; ou (v) forem requisitadas através de ordem judicial por uma autoridade governamental competente, sendo neste caso necessário a notificação da Parte detentora da informação com antecedência.

**6.5** As Partes se comprometem, ainda, a manter sigilo sobre quaisquer informações referentes aos direitos autorais ou de propriedade intelectual mencionados neste Contrato, que serão considerados Informações Confidenciais para todos os fins deste Instrumento.

**6.6** Para os efeitos do disposto nesta Cláusula, as informações confidenciais não conterão ou virão acompanhadas necessariamente de qualquer tipo de advertência de confidencialidade, devendo tal característica ser sempre presumida pelas partes.

**6.7** As Partes declaram e concordam que toda e qualquer atividade de Tratamento deve atender às finalidades deste Contrato, e ser realizada em conformidade com a legislação aplicável, sobretudo, mas não se limitando, à Lei nº 13.709/2018 ("Lei Geral de Proteção de Dados").

**6.8** A CONTRATANTE, como controladora dos dados pessoais da CONTRATADA, ou de seu representante legal, executará os tratamentos a partir das premissas da LGPD, a fim de manter com eficiência e segurança suas relações contratuais, cadastros necessários e demais funções que contribuam com o bom funcionamento da CONTRATANTE.

**6.9** A CONTRATADA não está autorizada a transferir e/ou compartilhar com terceiros os Dados Pessoais tratados em razão da presente relação contratual, a menos que o compartilhamento seja orientado e/ou autorizado expressamente pela CONTRATANTE.

**6.10** A CONTRATADA está expressamente proibida de realizar cópia, download ou qualquer outra ação com o objetivo de armazenar para uso próprio e indevido quaisquer dados e/ou informações de posse da CONTRATANTE.

**6.11** A CONTRATADA é unicamente responsável pelo uso e compartilhamento com terceiros das suas credenciais de acessos a documentos, plataformas, informações, dispositivos, e outros acessos, disponibilizados pela CONTRATANTE para a devida realização de suas funções.

**6.12** Ao término da relação entre as Partes, a CONTRATADA se compromete a eliminar, corrigir, anonimizar, armazenar e/ou bloquear o acesso às informações, em caráter definitivo ou não, que tiverem sido tratadas em decorrência do Contrato, estendendo-se a eventuais cópias, de acordo com as recomendações da CONTRATANTE.

**6.13** Na ocorrência de qualquer incidente (como perda, deleção, destruição, alteração ou exposição indesejada ou não autorizada) que envolva as informações compartilhadas pela CONTRATANTE em razão da presente relação contratual, a CONTRATADA deverá:

**6.13.1** Comunicar sobre o ocorrido imediatamente e, quando não possível e desde que a demora seja justificada, no prazo máximo de 24 (vinte e quatro) horas, contado a partir da ciência do Incidente contendo, no mínimo, as seguintes informações: (i) data e hora do Incidente; (ii) data e hora da ciência; (iii) relação dos tipos de dados afetados pelo Incidente; (iv) relação de Titulares afetados pelo vazamento; e (v) indicação de medidas que estiverem sendo tomadas para reparar o dano e evitar novos Incidentes;

**6.13.2** Adotar as recomendações da CONTRATANTE sobre como proceder após o Incidente;

**6.13.3** Tomar todas as providências necessárias para recuperar e/ou reconstituir todas as informações prejudicadas.

**6.14** O tratamento de dados ilegal realizado de má-fé, com dolo ou culpa, por parte da CONTRATADA, ensejará na possibilidade de a CONTRATANTE rescindir por justa causa, unilateralmente, o presente Contrato, assim como, ajuizar ação regressiva contra a CONTRATADA na medida dos danos que tiver que suportar por conta das ilegalidades cometidas por esta.

---

## CLÁUSULA SÉTIMA — DA RESCISÃO CONTRATUAL

**7.1** O serviço de Setup é de caráter irrevogável e irretratável, não sendo passível de reembolso sob nenhuma hipótese após a assinatura do Contrato.

**7.2** Referente à Plataforma, a CONTRATANTE poderá solicitar a rescisão a qualquer momento, mediante aviso prévio no prazo previsto no item "RESCISÃO" do QUADRO RESUMO, por escrito, enviado ao e-mail cs@o2inc.com.br.

**7.3** Constituem, ainda, motivos para a rescisão motivada e imediata do presente Contrato, independentemente de notificação, e da indenização cabível à parte contrária, a parte que: (i) Praticar atos que atinjam a imagem comercial da outra parte; (ii) Deixar de fornecer as informações necessárias à prestação dos Serviços contratados; (iii) Deixar de cumprir as obrigações e quaisquer cláusulas estipuladas neste Contrato, no prazo de 15 (quinze) dias, contados a partir da comunicação do descumprimento; (iv) Tiver sua falência e/ou recuperação judicial ou extrajudicial requerida, homologada ou decretada; e (v) Sofrer reorganização societária que venha a comprometer a capacidade da Parte envolvida de cumprir as obrigações aqui avençadas.

**7.4** Na hipótese de rescisão do presente Contrato, a CONTRATANTE obriga-se a pagar as faturas já emitidas até a data da solicitação do cancelamento e eventuais débitos anteriores.

**7.5** Em caso de rescisão do presente Contrato, por qualquer motivo, as quantias já pagas pela CONTRATANTE não serão objeto de devolução, compensação ou restituição, ainda que correspondam a períodos vincendos de licença ou Serviços não utilizados, considerando a natureza dos Serviços disponibilizados e os custos fixos envolvidos na sua operacionalização.

**7.6** A rescisão do Contrato não prejudica o direito das Partes de buscar eventuais medidas legais cabíveis, nem exime a CONTRATANTE do cumprimento das obrigações assumidas até o término da vigência contratual.

**7.7** A rescisão deste Contrato por qualquer motivo não desobriga as Partes do cumprimento das obrigações que por sua natureza perdurem além da vigência do presente instrumento.

---

## CLÁUSULA OITAVA — DA NÃO SOLICITAÇÃO

**8.1** Durante a vigência deste Contrato e por um período de 2 (dois) anos após seu término, as Partes comprometem-se a não contratar, solicitar ou tentar atrair de forma direta ou indireta qualquer sócio, colaborador, funcionário ou prestador de serviços da outra PARTE, salvo mediante prévia autorização por escrito da PARTE prejudicada.

---

## CLÁUSULA NONA — DA PROPRIEDADE INTELECTUAL

**9.1** A CONTRATADA declara e a CONTRATANTE reconhece todos e quaisquer direitos autorais patrimoniais decorrentes de obras, softwares, projetos, invenções, marcas, patentes, melhorias, modelos de utilidade, algoritmos e desenhos industriais (os "Direitos de Propriedade Intelectual") contidos na prestação de Serviços ou site (https://www.o2inc.com.br/) são de propriedade exclusiva da CONTRATADA. A contratação dos Serviços objeto deste instrumento, confere à CONTRATANTE, de forma não exclusiva, apenas os direitos expressamente previstos neste Contrato, reservado à CONTRATADA todos os direitos, títulos e interesses relativos aos Serviços prestados, incluindo todos os direitos de propriedade intelectual inerentes.

**9.2** A inteligência artificial contida no Gênio é o resultado de esforços substanciais em pesquisa, desenvolvimento e treinamento, e é considerada um ativo de propriedade intelectual valioso da CONTRATADA. A CONTRATADA retém todos os direitos sobre o código-fonte, algoritmos, modelos de machine learning, conjuntos de dados e quaisquer outros elementos relacionados à inteligência artificial, independentemente de terem sido personalizados ou adaptados para atender às necessidades específicas da CONTRATANTE.

**9.3** A inteligência artificial foi treinada e desenvolvida para trabalhar com um conjunto limitado de informações, ou seja, um banco específico de dados. A leitura só será efetivamente feita quando os dados estiverem corretamente preenchidos.

**9.4** A inteligência artificial pode não compreender contextos mais amplos ou nuances de uma situação específica, já que sua compreensão é limitada ao que foi incluído no banco de dados específico. Além disso, ela não faz a leitura de dados que não estejam nas referidas tabelas, mesmo que existam ferramentas adicionais conectadas ao Gênio.

**9.5** Qualquer melhoria, customização ou adaptação realizada pela CONTRATADA na inteligência artificial, especificamente para atender às necessidades da CONTRATANTE, bem como, qualquer melhoria, customização ou adaptação confeccionada pela própria inteligência artificial, permanecerá de propriedade da CONTRATADA.

**9.6** Fica vedado à CONTRATANTE (i) criar trabalhos derivados baseados na Plataforma; (ii) copiar ou apresentar o conteúdo do site (https://www.o2inc.com.br/) ou da Plataforma, nem reproduzir qualquer parte do conteúdo da Plataforma, além da cópia ou enquadramento em suas próprias intranets, ou de outra forma para seus próprios fins comerciais internos; (iii) realizar engenharia reversa da Plataforma, nem (iv) acessar a Plataforma para: (a) criar um produto ou serviço que compita com o da CONTRATADA, ou (b) copiar qualquer recurso, função ou gráfico da Plataforma.

**9.7** Será de propriedade da CONTRATANTE os dados inseridos na Plataforma durante a constância deste instrumento, sendo esta a única responsável pelos mesmos, devendo observar os direitos de propriedade intelectual a eles inerentes.

**9.8** Qualquer outra tecnologia, código e/ou conteúdo criado pela CONTRATADA para execução do objeto do presente Contrato são e continuarão a ser de propriedade exclusiva da CONTRATADA, não sendo, em hipótese alguma, considerados como trabalho por encomenda, ainda que solicitado pela CONTRATANTE.

**9.9** Nenhuma das disposições do presente Contrato deverá ser interpretada como forma de cessão de direitos de propriedade intelectual por qualquer das Partes. Com efeito, cada uma das Partes permanecerá a única e exclusiva titular de seus respectivos direitos de propriedade intelectual.

**9.10** A CONTRATADA poderá fazer o uso do nome fantasia, razão social e marcas da CONTRATANTE, a título gratuito e durante a vigência do presente instrumento, para serem utilizadas em campanhas promocionais, institucionais e comerciais; em projetos e encontros acadêmicos, em território nacional ou internacional, mediante apresentação de cases; apresentações em geral (institucionais, propostas, etc.); folders de apresentação; anúncios em revistas e jornais de circulação acadêmica; home page; mídias sociais e outras plataformas digitais para divulgar os serviços da CONTRATADA; utilizando com parcimônia e com o devido decoro.

---

## CLÁUSULA DÉCIMA — DAS DISPOSIÇÕES GERAIS

**10.1 Irrevogabilidade.** O presente Contrato é celebrado de forma irrevogável e irretratável, e representa o completo e integral acordo entre a CONTRATADA e a CONTRATANTE com relação ao objeto em questão neste Contrato, substituindo eventuais entendimentos verbais ou por escrito, discussões e negociações entre as Partes, antecedentes ou contemporâneos à sua assinatura.

**10.2 Boa-fé.** As Partes declaram, guardando os princípios de probidade e boa-fé, que não conhecem qualquer fato ou qualidade que a outra parte não tenha conhecimento, e que se conhecido o negócio não se teria realizado.

**10.3 Independência das Disposições.** Se qualquer disposição deste Contrato for julgada nula, ilegal ou inexequível, por tribunal competente, tal nulidade, ilegalidade ou inexequibilidade não afetará qualquer outra disposição aqui contida, devendo tal disposição ser reajustada consoante a intenção das Partes extraída da interpretação geral deste Contrato.

**10.4 Cessão.** É vedado às Partes ceder ou transferir a terceiros a execução total ou parcial das obrigações e/ou direitos decorrentes do Contrato, sem a prévia autorização por escrito da outra Parte, sob pena de rescisão automática deste Contrato, sem que haja necessidade de prévia notificação. A CONTRATADA faz parte da estrutura do Grupo O2 Inc., o qual atua prestando serviços de assessoria financeira, CFO as a Service, entre outros. A fim de possibilitar o maior sucesso possível para a CONTRATANTE, o Grupo O2 Inc. poderá alterar a unidade de atendimento da CONTRATANTE. A medida terá ciência da empresa CONTRATANTE, a qual terá seu atendimento integralmente realizado durante a transição e, posteriormente, com a nova unidade.

**10.5 Obrigatoriedade.** Este Contrato e todas as obrigações e direitos por ele conferidos obriga as Partes, bem como seus respectivos herdeiros, sucessores e cessionários a qualquer título, a partir da data de sua assinatura.

**10.6 Alterações.** O Contrato só poderá ser alterado mediante a emissão de termo aditivo elaborado e assinado conjuntamente pelas Partes.

**10.7 Vinculação à Proposta Comercial.** A Proposta Comercial encaminhada à CONTRATANTE e assinada em anexo, é parte integrante e indissociável do presente Contrato, sendo que as obrigações nelas contida serão exigidas como se constasse neste Contrato, prevalecendo, inclusive em caso de divergência, ambiguidade, inconsistência, discrepância ou conflito, sobre o presente Contrato.

**10.8 Notificações.** Todas as notificações e demais comunicações a serem feitas com relação ao presente Contrato serão elaboradas por escrito e enviadas para os endereços constantes no QUADRO RESUMO (i) através de Cartório de Títulos e Documentos; ou (ii) através de carta registrada; ou (iii) e-mail para os signatários deste Contrato com comprovante de envio.

**10.9 Independência Entre as Partes.** A relação entre as Partes é de contratantes independentes, não podendo em nenhuma circunstância ser interpretada como relação de associação de pessoas jurídicas, de sociedade a qualquer título, de empregado-empregador, mandato, representação, agência, consórcio ou de qualquer outra forma que não a prevista no Contrato, respondendo cada uma, de per si, pelas suas obrigações perante terceiros.

**10.10 Liberalidade das Partes.** Qualquer tolerância ou silêncio das Partes em relação às obrigações aqui assumidas será considerada mera liberalidade, não gerando direito para as Partes e nem podendo ser interpretada como novação, aceitação, repactuação ou aditamento ao Contrato, de forma que o não exercício por qualquer das Partes de direito previsto neste Contrato ou dele decorrente não implicará renúncia ou novação, podendo a qualquer momento ser exigido seu cumprimento.

**10.11 Resultados econômicos.** Este Contrato não vincula nenhuma das Partes com relação à outra quanto aos resultados econômicos presentes ou futuros de seus respectivos negócios, não sendo, pois, nenhuma delas responsável com relação à outra, por tais resultados, seja durante a vigência deste Contrato ou mesmo após o seu término, a qualquer título, sendo certo que a prestação dos Serviços objeto do Contrato configura obrigação de meio e não de resultado.

**10.12 Concorrência desleal.** A eventual solicitação de documentos, protocolos, cópias de processos administrativos, ou quaisquer outras informações confidenciais que são de propriedade autoral e industrial da CONTRATANTE, exclusivamente para desenvolver as obrigações estipuladas neste Contrato, não importará em crime de concorrência desleal, conforme regrado pela Lei nº 9.279/96.

**10.13 Anticorrupção.** As Partes contratantes declaram que nenhuma das Partes poderá oferecer, dar ou se comprometer a dar a quem quer que seja, ou aceitar ou se comprometer a aceitar de quem quer que seja, tanto por conta própria quanto através de outrem, qualquer pagamento, doação, compensação, vantagens financeiras ou não financeiras ou benefícios de qualquer espécie que constituam prática ilegal ou de corrupção sob as leis de qualquer país, seja de forma direta ou indireta quanto ao objeto deste Contrato, ou de outra forma que não relacionada a este Contrato, devendo garantir, ainda, que seus prepostos e colaboradores ajam da mesma forma, sendo que a infração desta cláusula ensejará em motivo para rescisão imediata do presente Contrato sem necessidade de notificação à outra Parte.

**10.14 Execução específica.** Este Contrato garante às Partes o direito de buscar a execução específica de todas e quaisquer obrigações aqui previstas, sem prejuízo de pedido cumulativo de perdas e danos e do uso dos procedimentos de indenização expressamente previstos neste Contrato. Serve este Contrato como título executivo extrajudicial na forma da legislação processual civil para todos os efeitos legais.

**10.15 Foro.** Este Contrato será regido pelas leis da República Federativa do Brasil. Qualquer disputa relacionada a este Contrato será submetida ao Foro Central da Cidade de São Paulo - SP, com exclusão de qualquer outro, por mais privilegiado que seja.

**10.16 Assinatura Eletrônica.** As Partes envolvidas no presente Contrato afirmam e declaram que este poderá ser assinado por meio eletrônico, sendo consideradas válidas as referidas assinaturas. As Partes também declaram reconhecerem como válidas as assinaturas eletrônicas feitas através de qualquer plataforma de assinaturas digitais, desde que enviadas para os endereços de e-mail citados nas suas qualificações, nos termos do art. 10 parágrafo 2º da MP2200-2/2001.

E, por assim estarem justas e contratadas, assinam as Partes o presente instrumento eletronicamente, dispensada a presença de testemunhas para que produza efeitos de título executivo extrajudicial, na forma do art. 784, §4º do CPC.

---

São Paulo/SP, {{dia}} de {{mes}} de 20{{ano}}.

| O2 INC GESTÃO E TECNOLOGIA S.A. | {{razao_social}} |
|---|---|
| CNPJ nº 23.813.779/0001-60 | CNPJ nº {{cnpj}} |
| [assinado digitalmente] | [assinado digitalmente] |
`,
  },
  {
    id: "saas-oxy-genio-especialista-modelo2",
    name: "SaaS Oxy + Gênio + Especialista (Modelo 2 - Oficial)",
    description: "Modelo 2 oficial O2 Inc - SaaS Plataforma Oxy + Gênio com atuação de Especialista O2 dedicado",
    createdAt: "Modelo do sistema",
    category: "saas",
    docxTemplate: "templates/base/saas-oxy-genio-especialista-modelo2.docx",
    content: `# CONTRATO DE PRESTAÇÃO DE SERVIÇOS — SAAS OXY + GÊNIO + ESPECIALISTA

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

### REMUNERAÇÃO DO SETUP

| Campo | Valor |
|-------|-------|
| **VALOR** | {{valor_extenso_setup}} |
| **FORMA DE PAGAMENTO** | {{parcelas_valor_extenso}} via cartão de crédito, com tarifas já inclusas, iniciando em {{data_setup}}. |
| **CONDIÇÕES ESPECIAIS** | {{condicoes_especiais}} |

### REMUNERAÇÃO PELO USO DA PLATAFORMA E PRESTAÇÃO DE SERVIÇOS DO ESPECIALISTA

| Campo | Valor |
|-------|-------|
| **VALOR** | {{valor_plataforma}} |
| **FORMA DE PAGAMENTO** | Mensal via boleto bancário. Primeiro pagamento {{dias_primeiro_pagamento}} dias após assinatura. |
| **CONDIÇÕES ESPECIAIS** | {{condicoes_especiais_plataforma}} |

### VIGÊNCIA

| Campo | Valor |
|-------|-------|
| **INÍCIO DA VIGÊNCIA** | {{inicio_vigencia}} |
| **PRAZO DE VIGÊNCIA** | {{prazo_vigencia}} |
| **RESCISÃO** | Mediante aviso prévio de {{dias_rescisao}} dias. |

---

> ℹ️ O contrato completo (10 cláusulas) está em \`templates/base/saas-oxy-genio-especialista-modelo2.docx\` no Storage do Supabase. Use o fluxo de envio pelo Autentique para gerar o contrato final com design O2 Inc preservado.

São Paulo/SP, {{dia}} de {{mes}} de 20{{ano}}.

| O2 INC GESTÃO E TECNOLOGIA S.A. | {{razao_social}} |
|---|---|
| CNPJ nº 23.813.779/0001-60 | CNPJ nº {{cnpj}} |
| [assinado digitalmente] | [assinado digitalmente] |
`,
  },
  {
    id: "diagnostico-estrategico-modelo3",
    name: "Diagnóstico Estratégico (Modelo 3 - Oficial)",
    description: "Modelo 3 oficial O2 Inc - Prestação de Serviços de Diagnóstico Estratégico (pagamento único parcelado, sem mensalidade recorrente)",
    createdAt: "Modelo do sistema",
    category: "consultoria",
    docxTemplate: "templates/base/diagnostico-estrategico-modelo3.docx",
    content: `# CONTRATO DE PRESTAÇÃO DE SERVIÇOS — DIAGNÓSTICO ESTRATÉGICO

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

> ℹ️ O contrato completo está em \`templates/base/diagnostico-estrategico-modelo3.docx\` no Storage do Supabase. Use o fluxo de envio pelo Autentique para gerar o contrato final com design O2 Inc preservado.
>
> ⚠️ **Diferença chave**: este modelo NÃO possui REMUNERAÇÃO recorrente — apenas pagamento único parcelado pelo serviço de diagnóstico.

São Paulo/SP, {{dia}} de {{mes}} de 20{{ano}}.

| O2 INC GESTÃO E TECNOLOGIA S.A. | {{razao_social}} |
|---|---|
| CNPJ nº 23.813.779/0001-60 | CNPJ nº {{cnpj}} |
| [assinado digitalmente] | [assinado digitalmente] |
`,
  },
  {
    id: "cfo-as-a-service-modelo4",
    name: "CFO as a Service (Modelo 4 - Oficial, revisado março)",
    description: "Modelo 4 oficial O2 Inc - Setup + Assessoria de Gestão Financeira Recorrente no modelo CFO AS A SERVICE",
    createdAt: "Modelo do sistema",
    category: "cfo",
    docxTemplate: "templates/base/cfo-as-a-service-modelo4.docx",
    content: `# CONTRATO DE PRESTAÇÃO DE SERVIÇOS — CFO AS A SERVICE

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

### REMUNERAÇÃO DO SETUP

| Campo | Valor |
|-------|-------|
| **VALOR** | {{valor_extenso_setup}} |
| **FORMA DE PAGAMENTO** | {{parcelas_valor_extenso}} via cartão de crédito, com tarifas já inclusas, iniciando em {{data_setup}}. |
| **CONDIÇÕES ESPECIAIS** | {{condicoes_especiais}} |

### REMUNERAÇÃO DO CFO AS A SERVICE

| Campo | Valor |
|-------|-------|
| **VALOR** | {{valor_plataforma}} |
| **FORMA DE PAGAMENTO** | Mensal via boleto bancário. Primeiro pagamento {{dias_primeiro_pagamento}} dias após assinatura. |
| **CONDIÇÕES ESPECIAIS** | {{condicoes_especiais_plataforma}} |

### VIGÊNCIA

| Campo | Valor |
|-------|-------|
| **INÍCIO DA VIGÊNCIA** | {{inicio_vigencia}} |
| **PRAZO DE VIGÊNCIA** | {{prazo_vigencia}} |
| **RESCISÃO** | Mediante aviso prévio de {{dias_rescisao}} dias. |

---

> ℹ️ O contrato completo (10 cláusulas) está em \`templates/base/cfo-as-a-service-modelo4.docx\` no Storage do Supabase. Use o fluxo de envio pelo Autentique para gerar o contrato final com design O2 Inc preservado.

São Paulo/SP, {{dia}} de {{mes}} de 20{{ano}}.

| O2 INC GESTÃO E TECNOLOGIA S.A. | {{razao_social}} |
|---|---|
| CNPJ nº 23.813.779/0001-60 | CNPJ nº {{cnpj}} |
| [assinado digitalmente] | [assinado digitalmente] |
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
  // Modelo SaaS Oxy + Gênio (snake_case) — placeholders específicos do Modelo 1 oficial
  { key: "razao_social", label: "Razão Social (modelo Oxy)", category: "empresa", tooltip: "Razão social — variante snake_case do template SaaS Oxy + Gênio" },
  { key: "cnpj", label: "CNPJ (modelo Oxy)", category: "empresa", tooltip: "CNPJ — variante snake_case do template SaaS Oxy + Gênio" },
  { key: "endereco", label: "Endereço (modelo Oxy)", category: "empresa", tooltip: "Endereço — variante snake_case do template SaaS Oxy + Gênio" },
  { key: "nome", label: "Nome Representante (modelo Oxy)", category: "representante", tooltip: "Nome — variante snake_case do template SaaS Oxy + Gênio" },
  { key: "cpf", label: "CPF Representante (modelo Oxy)", category: "representante", tooltip: "CPF — variante snake_case do template SaaS Oxy + Gênio" },
  { key: "email", label: "E-mail (modelo Oxy)", category: "contato", tooltip: "E-mail — variante snake_case do template SaaS Oxy + Gênio" },
  { key: "servico", label: "Descrição do Serviço", category: "contrato", tooltip: "Ex: SaaS, Plataforma Oxy + Gênio, Consultoria" },
  { key: "valor_extenso_setup", label: "Valor do Setup (por extenso)", category: "pagamento", tooltip: "Ex: R$ 12.000,00 (doze mil reais)" },
  { key: "parcelas_valor_extenso", label: "Parcelas do Setup (por extenso)", category: "pagamento", tooltip: "Ex: 12 (doze) parcelas de R$ 1.000,00" },
  { key: "data_setup", label: "Data de Início do Setup", category: "pagamento", tooltip: "Ex: 01/06/2026" },
  { key: "condicoes_especiais", label: "Condições Especiais (Setup)", category: "pagamento", tooltip: "Condições especiais do pagamento do setup" },
  { key: "valor_plataforma", label: "Valor Mensal da Plataforma", category: "pagamento", tooltip: "Ex: R$ 2.500,00 (dois mil e quinhentos reais)" },
  { key: "dias_primeiro_pagamento", label: "Dias até 1º Pagamento", category: "pagamento", tooltip: "Quantos dias após a assinatura o primeiro boleto vence (número)" },
  { key: "condicoes_especiais_plataforma", label: "Condições Especiais (Plataforma)", category: "pagamento", tooltip: "Condições especiais da licença mensal" },
  { key: "inicio_vigencia", label: "Início da Vigência", category: "contrato", tooltip: "Data de início — Ex: 01/06/2026" },
  { key: "prazo_vigencia", label: "Prazo de Vigência (modelo Oxy)", category: "contrato", tooltip: "Ex: 12 (doze) meses" },
  { key: "dias_rescisao", label: "Dias de Aviso (Rescisão)", category: "contrato", tooltip: "Aviso prévio em dias para rescisão (número)" },
  { key: "dia", label: "Dia da Assinatura (modelo Oxy)", category: "assinatura", tooltip: "Dia — variante snake_case (número)" },
  { key: "mes", label: "Mês da Assinatura (modelo Oxy)", category: "assinatura", tooltip: "Mês — variante snake_case (por extenso)" },
  { key: "ano", label: "Ano da Assinatura (modelo Oxy)", category: "assinatura", tooltip: "Ano — variante snake_case (2 dígitos finais, ex: 26)" },
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
