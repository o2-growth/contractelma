-- ============================================================================
-- Seed do template "SaaS Oxy + Gênio (Modelo 1 - Oficial)" para super_admins.
--
-- Esta migration é ESTRITAMENTE ADITIVA:
--   - Apenas INSERT com WHERE NOT EXISTS.
--   - Não altera, não deleta e não sobrescreve nenhum dado existente.
--   - Idempotente: pode rodar múltiplas vezes sem efeito colateral.
--
-- Comportamento:
--   - Para cada usuário com role super_admin, insere o template caso ele ainda
--     não tenha um template com nome "SaaS Oxy + Gênio (Modelo 1 - Oficial)".
--   - O conteúdo markdown é IDÊNTICO ao modelo em
--     src/constants/contractTemplates.ts (id: saas-oxy-genio-modelo1) e
--     reflete fielmente o PDF original O2 Inc (12 páginas, 10 cláusulas).
--
-- Placeholders utilizados (20):
--   razao_social, cnpj, endereco, nome, cpf, email, servico,
--   valor_extenso_setup, parcelas_valor_extenso, data_setup, condicoes_especiais,
--   valor_plataforma, dias_primeiro_pagamento, condicoes_especiais_plataforma,
--   inicio_vigencia, prazo_vigencia, dias_rescisao, dia, mes, ano
-- ============================================================================

INSERT INTO public.templates (user_id, name, description, content, placeholders)
SELECT
  ur.user_id,
  'SaaS Oxy + Gênio (Modelo 1 - Oficial)' AS name,
  'Modelo 1 oficial O2 Inc - Prestação de Serviços SaaS Plataforma Oxy + Gênio com setup e licença mensal' AS description,
  $TEMPLATE$# CONTRATO DE PRESTAÇÃO DE SERVIÇOS

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
$TEMPLATE$ AS content,
  '["razao_social","cnpj","endereco","nome","cpf","email","servico","valor_extenso_setup","parcelas_valor_extenso","data_setup","condicoes_especiais","valor_plataforma","dias_primeiro_pagamento","condicoes_especiais_plataforma","inicio_vigencia","prazo_vigencia","dias_rescisao","dia","mes","ano"]'::jsonb AS placeholders
FROM public.user_roles ur
WHERE ur.role = 'super_admin'
  AND NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.user_id = ur.user_id
      AND t.name = 'SaaS Oxy + Gênio (Modelo 1 - Oficial)'
  );
