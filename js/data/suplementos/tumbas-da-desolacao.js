/* Gerado por tools/ (ver SUPLEMENTOS.md). Não edite o texto de regras à mão: regenere a partir do PDF. */
SDL.registrarSuplemento({
 "id": "tumbas-da-desolacao",
 "nome": "Tumbas da Desolação",
 "abreviacao": "Tumbas da Desolação",
 "versao": "1",
 "ancestralidades": [
  {
   "id": "regresso",
   "nome": "Regresso",
   "tipo": "sobreposicao",
   "base": [
    "humano",
    "anao",
    "orc"
   ],
   "desc": "Às vezes, a morte chega cedo demais, reclamando a alma antes que um mortal possa cumprir seu destino, corrigir um erro ou pagar uma dívida. Quando o peso da responsabilidade é grande demais para ser deixado de lado, a morte pode conter sua mão e permitir que o mortal conclua essas tarefas inacabadas como um regresso.",
   "lore": [
    {
     "t": "Entre a Vida e a Morte",
     "x": "Regressos não estão completamente vivos nem completamente mortos. Eles contam como criaturas vivas, mas nunca sofrem os males que afligem os vivos, como os espasmos da febre ou a agonia do veneno. Ainda podem ser feridos e destruídos por armas. Porém, mesmo quando são abatidos, o chamado de suas obrigações arrasta os regressos para fora da sepultura mais uma vez, para terminarem o trabalho que começaram."
    },
    {
     "t": "Palidez Cadavérica",
     "x": "Os regressos têm mais ou menos a mesma aparência que tinham quando estavam plenamente vivos, mas olheiras escuras circundam seus olhos e eles tendem a ser esquálidos. Regressos recém-criados usam cosméticos e enchem o corpo com especiarias aromáticas para disfarçar o fedor da decomposição. Disfarces simples são insuficientes para ocultar a natureza de regressos mais antigos, que usam magia para esconder a verdade do que se tornaram."
    },
    {
     "t": "Determinados e Implacáveis",
     "x": "Juramentos poderosos, grandes injustiças e emoções intensas mantêm os regressos no mundo. Erguer-se da sepultura lhes incute um foco obstinado em alcançar seus objetivos. Nem todos emergem da transformação com as faculdades mentais intactas; muitos passam por oscilações emocionais que vão da euforia maníaca à mais profunda depressão."
    },
    {
     "t": "Ligados à Desolação",
     "x": "A Desolação é a fonte do poder que cria os regressos. Em tempos antigos, os Homens de Gog que viviam neste lugar tóxico usavam magia vil para prolongar sua vida ou escapar completamente da morte. Aqueles que não podiam pagar por esses feitiços barganhavam diretamente com Pai Morte para obter mais tempo. O deus taciturno recusa a maioria dos pedidos, mas mortais que sofreram injustiças e anseiam por vingança às vezes recebem sua bênção, escapando do Submundo até conseguirem pôr seus assuntos em ordem."
    },
    {
     "t": "Nomes Comuns",
     "x": "Os regressos usam os nomes que tinham em vida ou adotam nomes que resumem sua nova existência, como Corvo, Arlequim, Lágrimas ou Vingança."
    },
    {
     "t": "Regra Opcional: Retornando dos Mortos",
     "x": "O mestre pode permitir que um personagem morto volte como regresso, desde que ele cumpra os critérios e isso seja apropriado para a história. Por exemplo, uma personagem especialista pode ter sido morta antes de ter a chance de encontrar o assassino do marido, enquanto um personagem mestre pode retornar para encontrar a cura de um contágio vil que não apenas o destruiu, como também ameaça muitos outros. Se o mestre intervier dessa forma, o personagem normalmente retorna à vida no início da aventura seguinte, com todo o dano curado, e adquire todos os traços de regresso."
    },
    {
     "t": "Tabelas da Ancestralidade Regresso",
     "x": "Use as tabelas da ancestralidade-base de seu personagem para determinar o histórico dele antes de retornar dos mortos. Em seguida, escolha ou determine aleatoriamente as opções apresentadas nas tabelas a seguir para descrever como o personagem se tornou um regresso e os efeitos dessa transformação sobre sua personalidade e natureza."
    }
   ],
   "intro": "Primeiro, crie um personagem humano, anão ou orc. Outras ancestralidades podem estar disponíveis a critério do mestre, mas precisam ser vivas e mortais, ter alma e não ter sido criadas por magia — portanto, versipeles e autômatos não são permitidos. Em seguida, aplique os seguintes traços a esse personagem.",
   "atrDelta": {
    "forca": 1,
    "intelecto": -1
   },
   "carDelta": {
    "defesa": -1
   },
   "dados": {
    "insanidade": "1d3"
   },
   "talentos": [
    {
     "n": "Imune",
     "t": "a dano de doença e veneno; doente, fatigado, envenenado"
    },
    {
     "n": "Visão no Escuro",
     "t": "Você consegue enxergar em áreas obscurecidas por sombras e escuridão a média distância como se essas áreas estivessem iluminadas. Além dessa distância, você trata escuridão como sombras e sombras como áreas iluminadas."
    },
    {
     "n": "Retorno Eterno",
     "t": "Você morre instantaneamente quando fica incapacitado e permanece morto por 1d3 horas. Ao final desse tempo, se a sua cabeça ainda estiver presa ao corpo, você retorna à vida, cura uma quantidade de dano igual à sua taxa de cura e ganha 1d3 de Insanidade. Caso contrário, você é destruído."
    },
    {
     "n": "Com um Pé na Cova",
     "t": "Você cura apenas metade da quantidade normal de dano por meio de magia e poções."
    }
   ],
   "nivel4": {
    "car": {
     "vida": 6
    },
    "escolha": "Você aprende um feitiço, adquire Olhos do Submundo, ou adquire um traço de especialista de sua outra ancestralidade.",
    "opcoes": [
     "feitico",
     "talento",
     "base"
    ],
    "talento": {
     "n": "Olhos do Submundo",
     "t": "Você pode usar uma ação para fazer uma rolagem de ataque de Vontade contra a Vontade de uma criatura-alvo a curta distância que possa ver você. Em um sucesso, o alvo fica amedrontado por 1 minuto. Em um fracasso, o alvo fica imune ao uso deste talento por você até completar um descanso."
    }
   }
  },
  {
   "id": "vampiro",
   "nome": "Vampiro",
   "tipo": "sobreposicao",
   "base": [
    "humano"
   ],
   "desc": "Vampiros emergem de criptas e saem de sepulturas para caçar os vivos quando a noite cai. A maioria dos vampiros é composta de verdadeiros monstros, assassinos cruéis e indiscriminados, incapazes de sentir remorso devido à maldição profana que sustenta sua existência antinatural. Alguns poucos conseguem controlar os impulsos terríveis e conter seus apetites o bastante para se agarrar aos farrapos de sua humanidade perdida.",
   "lore": [
    {
     "t": "Vinculado ao Progenitor",
     "x": "Vampiros podem criar outros vampiros levando um humano à beira da morte e fazendo a vítima beber uma porção de seu sangue. Esse ato mata a vítima, que então se ergue na noite seguinte como um vampiro sob o controle de seu progenitor (veja “Criando Novos Vampiros”, na página seguinte). Como criar novos vampiros significa mais competição por sangue fresco e aumenta o risco de atrair a atenção de inquisidores e matadores de mortos-vivos, os vampiros geram descendentes com grande relutância."
    },
    {
     "t": "Sede Enlouquecedora",
     "x": "O sangue nunca está longe dos pensamentos de um vampiro, pois é necessário para sustentar sua existência imortal. A agonia dessa sede e o medo da impotência se combinam em um desejo implacável que se intensifica quanto mais tempo o vampiro passa sem beber."
    },
    {
     "t": "Ferozes e Monstruosos",
     "x": "Embora vestígios de humanidade permaneçam em seu estado de mortos-vivos, os vampiros têm a boca repleta de presas longas e afiadas, e a sede de sangue deixa seus traços encovados e pálidos. Quando um vampiro ataca, seu rosto se contorce em algo monstruoso, e sua fome exposta inspira medo e pânico."
    },
    {
     "t": "Maldição do Rei-Bruxo",
     "x": "O Rei-Bruxo criou os primeiros vampiros a partir de seus servos mais leais, transformando-os em súditos imortais dependentes dele para obter sangue. Os vampiros a seu serviço desfrutavam de força, rapidez, sentidos aguçados e resistência sobrenaturais, tornando-os úteis ao Senhor das Trevas e leais graças à sede incessante. Todos os vampiros descendem deles, e acredita-se que alguns desses ancestrais sobrevivam até hoje, selados nas tumbas negras da Desolação."
    },
    {
     "t": "Nomes Comuns",
     "x": "Vampiros podem usar seus nomes humanos ou adotar novos nomes. Muitos consideram a transformação um renascimento e assumem novas identidades adequadas à nova existência. Esses vampiros adotam títulos nobres ou alcunhas que refletem sua nova natureza, como Duquesa Vermelha, Vestígio, Desejo ou Ela."
    },
    {
     "t": "Criando Novos Vampiros",
     "x": "Para criar um “filho”, ou uma prole vampírica, você precisa drenar o sangue de um humano vivo até ele ficar incapacitado e então alimentá-lo com seu sangue, usando uma ação e gastando 1 ponto de sangue. A vítima morre no final da rodada. Se o cadáver for exposto à luz do sol, ele é imediatamente reduzido a cinzas. Porém, se o cadáver for sepultado em algum lugar onde a luz não alcance, como uma tumba ou cripta, ele se ergue como um novo vampiro quando o sol se põe da próxima vez."
    },
    {
     "t": "Tabelas da Ancestralidade Vampiro",
     "x": "Ao determinar o histórico e a descrição de seu personagem, comece com as tabelas da ancestralidade humana em Shadow of the Demon Lord para estabelecer sua identidade antes de se tornar um vampiro. Em seguida, escolha ou determine aleatoriamente as opções apresentadas nas tabelas a seguir para descrever como seu personagem se tornou um vampiro e como a experiência afetou você."
    }
   ],
   "intro": "Todos os vampiros começam como humanos; portanto, primeiro crie um personagem humano e depois aplique os seguintes traços a ele.",
   "atrDelta": {
    "forca": 1,
    "agilidade": 1,
    "intelecto": 1,
    "vontade": 1
   },
   "carDelta": {
    "percepcao": 1,
    "defesa": 1,
    "velocidade": 2
   },
   "dados": {
    "insanidade": "1d6",
    "corrupcao": "1d3"
   },
   "talentos": [
    {
     "n": "Imune",
     "t": "a dano de frio, doença e veneno; adormecido, doente, fatigado, imobilizado, envenenado e lento"
    },
    {
     "n": "Visão no Escuro",
     "t": "Você consegue enxergar em áreas obscurecidas por sombras e escuridão a média distância como se essas áreas estivessem iluminadas. Além dessa distância, você trata escuridão como sombras e sombras como áreas iluminadas."
    },
    {
     "n": "Vinculado ao Progenitor",
     "t": "Você fica vinculado ao vampiro que criou você até que ele use uma ação para libertá-lo ou seja destruído. Você não pode atacar o vampiro que criou você e fica compelido por ele enquanto estiver a curta distância dele."
    },
    {
     "n": "Aparência Aterradora",
     "t": "Quando atacar uma criatura viva que possa vê-lo, o alvo precisa fazer uma rolagem de desafio de Vontade. Em um fracasso, ele fica amedrontado por 1 minuto. Em um sucesso, ele fica imune à sua Aparência Aterradora até completar um descanso."
    },
    {
     "n": "Armas Naturais",
     "t": "Você tem presas longas, que contam como armas rápidas de acuidade que causam 1d6 de dano."
    },
    {
     "n": "Existência Antinatural",
     "t": "Sua taxa de cura é 0 e não pode ser aumentada acima de 0."
    },
    {
     "n": "Reserva de Sangue",
     "t": "Você precisa de sangue para sustentar sua existência. Você mede o sangue acumulado em uma reserva de pontos de sangue. Quando se tornar um vampiro pela primeira vez, você recebe 1 ponto de sangue do vampiro que criou você. Você acrescenta pontos de sangue à sua reserva usando o talento Beber Sangue (veja a seguir), até um máximo de 1 + o nível do grupo. Sempre que completar um descanso, você precisa gastar 1 ponto de sua reserva de sangue. Se não tiver pontos de sangue para gastar, você ganha 1 de Insanidade e sofre uma penalidade de –1d6 à Vida (mínimo 0; veja Torpor a seguir). A penalidade é cumulativa, e você fica debilitado enquanto a tiver. Você pode remover a penalidade acumulada à Vida usando uma ação para gastar 1 ponto de sangue."
    },
    {
     "n": "Cura pelo Sangue",
     "t": "Você pode usar uma ação ou uma ação desencadeada em seu turno para gastar 1 ponto de sangue e curar uma quantidade de dano igual a 1 + o nível do grupo."
    },
    {
     "n": "Torpor",
     "t": "Quando a penalidade à sua Vida causada pelo traço Reserva de Sangue reduzir sua Vida a 0, você fica inconsciente, parecendo um cadáver. Se sofrer qualquer dano enquanto estiver inconsciente, você é destruído instantaneamente. Como uma ação, outra criatura pode alimentar você com sangue fresco de uma criatura viva para remover a penalidade acumulada à sua Vida e encerrar esta aflição."
    },
    {
     "n": "Beber Sangue",
     "t": "Quando uma criatura viva agarrada por você sofre dano de um ataque feito com suas presas, ela sofre uma penalidade na Vida igual à taxa de cura dela por 1 hora, e você acrescenta 1 ponto à sua reserva de sangue. Enquanto tiver essa penalidade, a criatura fica fatigada."
    },
    {
     "n": "Superstição",
     "t": "Enquanto puder ver o objeto de seu medo supersticioso (veja a seguir), você faz rolagens de ataque e rolagens de desafio com 3 reveses."
    },
    {
     "n": "Queimado pela Luz Solar",
     "t": "Você sofre 2d6 de dano e reduz sua reserva de sangue em 1 ao final de cada rodada em que estiver em uma área iluminada pela luz do sol. Além disso, você sofre o dobro de dano de feitiços Celestiais e faz rolagens de desafio para resistir a eles com 1 revés."
    }
   ],
   "nivel4": {
    "car": {
     "vida": 6
    },
    "escolha": "",
    "opcoes": [
     "talento"
    ],
    "talento": {
     "n": "Passar por Humano",
     "t": "Você pode usar uma ação para alterar sua aparência e ficar como era no auge da vida. Você mantém essa aparência até sofrer dano, atacar ou usar uma ação para retomar sua aparência normal."
    }
   },
   "curaFixa": 0,
   "recursos": [
    {
     "id": "sangue",
     "nome": "Pontos de sangue",
     "max": "1+nivel",
     "inicio": 1
    }
   ]
  },
  {
   "id": "salamandra",
   "nome": "Salamandra",
   "desc": "Os gênios moldaram as primeiras salamandras a partir de chamas elementais para servirem como escravas desses seres selvagens e obstinados. Durante séculos, as salamandras e seus descendentes viveram afastados dos demais povos do mundo, livres de maquinações e intrigas, mas a ascensão de males terríveis as tirou do esconderijo para caminhar pelas terras em seus últimos dias.",
   "lore": [
    {
     "t": "Nascidas do Fogo",
     "x": "Os gênios formaram as salamandras imbuindo chamas elementais com sua própria essência, concedendo ao fogo solidez, forma humanoide e senciência. Sua herança ígnea ainda é evidente nos chifres altos e retorcidos que se erguem da testa das salamandras, nos esporões que crescem em seus braços e pernas e em sua pele carmesim. Com olhos brancos sem pupilas e dentes longos e afiados, os traços das salamandras variam do exótico ao diabólico. Uma salamandra típica tem entre 2,1 e 2,4 metros de altura e pode pesar até 200 quilos."
    },
    {
     "t": "Elementais",
     "x": "Como seres elementais, as salamandras desfrutam de vidas longas, mas, por não terem almas mortais, não podem retornar da morte. Quando uma salamandra morre, seu corpo é consumido por uma labareda repentina."
    },
    {
     "t": "Escravas dos Gênios",
     "x": "Os gênios criaram as salamandras para cumprir suas ordens, e as salamandras acreditam que eles também moldaram o mundo a partir do caos. Outros elementais foram criados para serem construtores e curandeiros, mas as salamandras foram concebidas como destruidoras. Elas combateram os inimigos dos gênios: as fadas, os trolls e todos os demais que tentavam aprisionar e controlar seus mestres. Assim, seus primeiros encontros com a humanidade ocorreram em batalha, o que deixou uma impressão negativa duradoura. À medida que a loucura infectava os gênios, o interesse deles pelo mundo diminuía, deixando as salamandras livres para encontrar seus próprios destinos. A maioria estabeleceu seu lar nas Criptas Ardentes, mas algumas sobreviveram na Desolação."
    },
    {
     "t": "Ferozes e Voláteis",
     "x": "Um povo de paixões intensas, as salamandras têm dificuldade para esconder suas emoções, especialmente a raiva. Ao lidar com os outros, podem ser agressivas a ponto de ofender e até ameaçar quando não conseguem o que querem. Esses arroubos emocionais nunca duram muito, porém, e elas logo esquecem o que despertou sua ira."
    },
    {
     "t": "Nomes Comuns",
     "x": "Azagad, Beruul, Dedan, Fereen, Heeseh, Ignez, Seekriz, Zeez."
    }
   ],
   "atr": {
    "forca": 10,
    "agilidade": 9,
    "intelecto": 9,
    "vontade": 11
   },
   "percepcao": 0,
   "vidaBonus": 0,
   "tamanho": [
    "1"
   ],
   "velocidade": 10,
   "corrupcao": 0,
   "insanidade": 0,
   "idiomas": "Você fala a Língua Comum e Fala Ígnea, o idioma sibilante e estalado dos elementais das chamas.",
   "talentos": [
    {
     "n": "Imune",
     "t": "a dano de doença, fogo e veneno; doente, envenenado"
    },
    {
     "n": "Intolerância ao Frio",
     "t": "Você sofre o dobro de dano de frio. Quando sofrer dano de frio, você também fica fatigado por 1 rodada."
    },
    {
     "n": "Calor",
     "t": "No final da rodada, cada criatura agarrada por você ou que esteja agarrando você precisa ser bem-sucedida em uma rolagem de desafio de Força para não sofrer 1d3 de dano devido ao calor intenso irradiado por seu corpo."
    },
    {
     "n": "Morte Ígnea",
     "t": "Quando você morrer, chamas irrompem de um ponto dentro de seu espaço até um número de metros igual ao nível do grupo. Tudo o que estiver na área sofre uma quantidade de dano igual a 1d6 + o nível do grupo. As criaturas que estiverem na área e forem bem-sucedidas em uma rolagem de desafio de Agilidade sofrem metade do dano."
    }
   ],
   "nivel4": {
    "car": {
     "vida": 5
    },
    "escolha": "Você aprende um feitiço ou adquire Represália Escaldante.",
    "talento": {
     "n": "Represália Escaldante",
     "t": "Quando ficar ferido, você pode usar uma ação desencadeada para liberar uma explosão de chamas em um raio de 2 metros a partir de um ponto dentro de seu espaço. Tudo na área sofre 1d6 de dano. Cada criatura na área que for bem-sucedida em uma rolagem de desafio de Agilidade não sofre dano."
    }
   }
  }
 ],
 "trilhas": [
  {
   "id": "principe-das-trevas",
   "nome": "Príncipe das Trevas",
   "tier": "especialista",
   "desc": "O vampirismo oferece grande poder a um preço terrível. Vampiros são mais rápidos e fortes que humanos comuns, mas sofrem de uma sede avassaladora por sangue. Incapazes de caminhar sob a luz do sol, tornam-se criaturas da noite, esgueirando-se pelas sombras para emboscar suas presas e fugir dos inquisidores que os entregariam às chamas purificadoras. A dependência de sangue fresco cria inimigos aonde quer que os vampiros vão. As comunidades logo percebem o predador em seu meio; o caçador se torna a presa quando as pessoas se reúnem em turbas sedentas de sangue decididas a destruí-lo. Assim, vampiros precisam de astúcia e controle sobre seus impulsos sombrios para sobreviver aos muitos perigos que se erguem contra eles. Príncipes das trevas encontram formas de controlar a sede por sangue e aprimorar seus talentos. Eles sofrem das mesmas fraquezas que seus semelhantes, mas desenvolvem técnicas para ajudar na caça, resistir aos ataques dos inimigos e evitar serem descobertos e capturados. Para escolher esta trilha de especialista, você precisa ser um vampiro.",
   "niv": {
    "3": {
     "n": 3,
     "esc": 2,
     "car": {
      "vida": 6,
      "corrupcao": 1
     },
     "idi": "Você pode falar outro idioma ou adicionar uma profissão.",
     "tal": [
      {
       "n": "Mordida Drenadora",
       "t": "Um alvo fatigado por um ataque de Beber Sangue fica lento enquanto permanecer fatigado pelo ataque."
      },
      {
       "n": "Fuga Nebulosa",
       "t": "Quando ficar incapacitado, você pode usar uma ação desencadeada para se transformar em uma nuvem ondulante de névoa, voar até sua Velocidade e então retomar sua forma normal. Enquanto estiver em forma enevoada, você fica imune a todo dano, pode se mover por espaços ocupados por outras criaturas e atravessar aberturas largas o bastante para permitir a passagem de ar. Esse movimento não desencadeia ataques livres. Depois de usar este talento, você só pode usá-lo outra vez após completar um descanso."
      }
     ]
    },
    "6": {
     "n": 6,
     "esc": 0,
     "car": {
      "percepcao": 1,
      "vida": 6,
      "corrupcao": 1
     },
     "idi": null,
     "tal": [
      {
       "n": "Mordida Encantadora",
       "t": "Uma criatura já fatigada por seu traço Beber Sangue que ficaria fatigada novamente dessa forma precisa ser bem-sucedida em uma rolagem de desafio de Vontade para não ficar encantada até deixar de estar fatigada."
      },
      {
       "n": "Tolerância à Luz Solar",
       "t": "Você sofre metade do dano de exposição à luz do sol."
      }
     ]
    },
    "9": {
     "n": 9,
     "esc": 0,
     "car": {
      "vida": 6,
      "velocidade": 2,
      "corrupcao": 1
     },
     "idi": null,
     "tal": [
      {
       "n": "Névoa Fluida",
       "t": "Você pode usar Fuga Nebulosa sempre que sofrer dano, e recupera a capacidade de usá-la após o final da rodada seguinte."
      },
      {
       "n": "Resiliência",
       "t": "Você sofre metade do dano de armas."
      }
     ]
    }
   },
   "requer": "Vampiro"
  },
  {
   "id": "andarilho-do-po",
   "nome": "Andarilho do Pó",
   "tier": "mestre",
   "desc": "Andarilhos do pó aprendem suas técnicas com os gênios enlouquecidos das profundezas da Desolação, descobrindo seus nomes e dominando seu poder. O conhecimento que adquirem desestabiliza a mente dos andarilhos do pó, tornando-os tão obstinados e destrutivos quanto seus patronos enlouquecidos. Alguns seguem esta trilha para curar a terra, enquanto outros a abraçam para aumentar o próprio poder.",
   "niv": {
    "7": {
     "n": 7,
     "esc": 3,
     "car": {
      "vida": 3,
      "poder": 1
     },
     "idi": "Você pode falar outro idioma ou adicionar uma profissão.",
     "tal": [
      {
       "n": "Magia",
       "t": "Você descobre a tradição do Ar ou da Terra, ou aprende um feitiço de uma dessas tradições."
      },
      {
       "n": "Passo Telúrico",
       "t": "Você se move com sua Velocidade total por terreno difícil composto de areia, poeira, terra ou rochas."
      },
      {
       "n": "Arremessar Poeira",
       "t": "Ao fazer um ataque corpo a corpo com uma arma, você pode usar uma ação desencadeada para arremessar poeira no alvo. O alvo precisa ser bem-sucedido em uma rolagem de desafio de Força para não ficar debilitado até o final da rodada."
      }
     ],
     "mag": {
      "obrig": 0,
      "esc": 1,
      "restr": [
       "Ar"
      ],
      "solo": false
     }
    },
    "10": {
     "n": 10,
     "esc": 0,
     "car": {
      "vida": 3
     },
     "idi": null,
     "tal": [
      {
       "n": "Magia",
       "t": "Você aprende um feitiço."
      },
      {
       "n": "Tempestade de Poeira",
       "t": "Você pode usar uma ação para se transformar em uma nuvem de poeira rodopiante e se mover até sua Velocidade. Enquanto estiver nessa forma, você fica imune a dano, pode se mover por espaços ocupados por outras criaturas e atravessar aberturas largas o bastante para permitir a passagem de ar. Esse movimento não desencadeia ataques livres. Quando terminar de se mover, você retoma sua forma normal, e cada criatura capaz de enxergar que esteja a até 2 metros de você precisa ser bem-sucedida em uma rolagem de desafio de Força para não ficar cega por 1 rodada. Você pode usar este talento uma quantidade de vezes igual a 1 + o seu valor de Poder. Você recupera os usos gastos quando completa um descanso."
      }
     ],
     "mag": {
      "obrig": 0,
      "esc": 1,
      "restr": null,
      "solo": true
     }
    }
   }
  },
  {
   "id": "assolador",
   "nome": "Assolador",
   "tier": "mestre",
   "desc": "Acredita-se que os assoladores sejam responsáveis pela forma atual da Desolação. Houve um tempo em que estes usuários de magia estavam entre os mais poderosos servos do Rei-Bruxo. Eles drenaram a vida da terra para erguer exércitos de mortos, construíram monumentos magníficos para si mesmos e seu mestre, e lançaram poder destrutivo contra os inimigos. As técnicas dos assoladores ainda aguardam as almas ambiciosas e resistentes dispostas e capazes de arrancá-las das ruínas da Desolação. Assoladores exploram os recursos do mundo, destruindo a vida para alimentar sua ambição. Por isso, esta trilha atrai estudiosos das artes das trevas, imprudentes e insanos.",
   "niv": {
    "7": {
     "n": 7,
     "esc": 3,
     "car": {
      "vida": 2,
      "poder": 1,
      "corrupcao": 1
     },
     "idi": "Você pode falar outro idioma ou adicionar uma profissão.",
     "tal": [
      {
       "n": "Magia",
       "t": "Você aprende o feitiço assolar."
      }
     ],
     "feit": "assolar"
    },
    "10": {
     "n": 10,
     "esc": 0,
     "car": {
      "vida": 2,
      "corrupcao": 1
     },
     "idi": null,
     "tal": [
      {
       "n": "Magia",
       "t": "Você aprende um feitiço."
      },
      {
       "n": "Devastação Fortalecedora",
       "t": "Quando conjurar o feitiço assolar, você faz rolagens de ataque e de desafio com 1 dádiva por 1 rodada."
      }
     ],
     "mag": {
      "obrig": 0,
      "esc": 1,
      "restr": null,
      "solo": true
     }
    }
   }
  },
  {
   "id": "matador-de-mortos",
   "nome": "Matador de Mortos",
   "tier": "mestre",
   "desc": "Mortos-vivos são abominações que ameaçam se espalhar pelo mundo se não forem detidos. Certos homens e mulheres dedicados pegam em armas para destruir os mortos ambulantes onde quer que os encontrem. A maioria dos matadores de mortos começou como cruzados, desenvolvendo seus talentos por necessidade e alimentando um ódio que os impele a perseguir o inimigo.",
   "niv": {
    "7": {
     "n": 7,
     "esc": 3,
     "car": {
      "vida": 5
     },
     "idi": "Você pode falar outro idioma ou adicionar uma profissão.",
     "tal": [
      {
       "n": "Antecipar Mortos-vivos",
       "t": "Mortos-vivos fazem rolagens de ataque contra você com 1 revés, e você faz rolagens de desafio com 1 dádiva para resistir aos ataques deles."
      },
      {
       "n": "Destemido",
       "t": "Você não pode ficar amedrontado. Ao fazer uma rolagem de desafio para resistir a ganhar Insanidade, você recebe 1 dádiva."
      }
     ]
    },
    "10": {
     "n": 10,
     "esc": 0,
     "car": {
      "vida": 5
     },
     "idi": null,
     "tal": [
      {
       "n": "Nunca se Render",
       "t": "Enquanto estiver ferido, você recebe +2 de bônus na Defesa."
      },
      {
       "n": "Flagelo dos Mortos-vivos",
       "t": "Ao atacar uma criatura morta- -viva, você faz a rolagem de ataque com 1 dádiva, e seu ataque causa 1d6 de dano extra."
      }
     ]
    }
   }
  }
 ],
 "tradicoesInfo": [
  {
   "nome": "Sangue",
   "atr": "ambos",
   "trevas": false,
   "menor": true,
   "grauMax": 3,
   "nota": "Alguns tipos de magia, porém, produzem uma variedade mais restrita de efeitos, como feitiços exclusivos de certas trilhas ou relacionados a determinadas ancestralidades ou terras. Os feitiços dessas tradições menores nunca têm grau superior a 3. A magia de Sangue tem um legado sombrio, concebida pelos vampiros a partir de sua obsessão pelo humor mais vital do corpo. Esses feitiços manipulam o sangue e o forçam a obedecer aos comandos do conjurador, muitas vezes com resultados alarmantes. Você pode usar Intelecto ou Vontade para conjurar feitiços de Sangue."
  }
 ],
 "feiticos": [
  {
   "id": "sangue-sangramento",
   "nome": "Sangramento",
   "tipo": "Ataque",
   "trad": "Sangue",
   "grau": 0,
   "texto": "Alvo: Uma criatura viva à curta distância Bolhas se formam na pele do alvo. Faça uma rolagem de ataque de Intelecto ou Vontade contra a Força do alvo. Em um sucesso, as bolhas estouram e o alvo sofre 1d3 de dano; ao final de cada rodada, o alvo precisa ser bem-sucedido em uma rolagem de desafio de Força para não sofrer 1 de dano. Obter três sucessos na rolagem de desafio ou curar qualquer quantidade de dano encerra este efeito. Rolagem de Ataque 20+ O alvo sofre 1d3 de dano extra."
  },
  {
   "id": "sangue-restaurar-humores",
   "nome": "Restaurar Humores",
   "tipo": "Utilitário",
   "trad": "Sangue",
   "grau": 0,
   "texto": "Alvo: Uma criatura viva ao seu alcance Você toca o alvo e faz uma rolagem de desafio de Intelecto ou Vontade. Em um sucesso, o alvo cura uma quantidade de dano igual à sua taxa de cura. Em um fracasso, o alvo sofre uma quantidade de dano igual à metade de sua taxa de cura."
  },
  {
   "id": "sangue-sangue-em-agua",
   "nome": "Sangue em Água",
   "tipo": "Ataque",
   "trad": "Sangue",
   "grau": 1,
   "texto": "Alvo: Uma criatura viva à curta distância Se o alvo tiver Vida 10 ou menos, ele morre instantaneamente, com sangue aguado vazando de seus orifícios. Caso contrário, faça uma rolagem de ataque de Intelecto ou Vontade contra a Força do alvo. Em um sucesso, o alvo sofre 1d3 de dano e fica aturdido e fatigado por 1 rodada."
  },
  {
   "id": "sangue-sangue-fervente",
   "nome": "Sangue Fervente",
   "tipo": "Ataque",
   "trad": "Sangue",
   "grau": 2,
   "texto": "Alvo: Uma criatura viva à curta distância O sangue ferve nas veias do alvo. Se o alvo tiver Vida 15 ou menos, ele morre instantaneamente, com o corpo inchado e enegrecido. Caso contrário, faça uma rolagem de ataque de Intelecto ou Vontade contra a Força do alvo. Em um sucesso, o alvo sofre 2d6+3 de dano. Alvos mortos por esse efeito explodem e borrifam sangue fervente em um raio de 3 metros centrado em um ponto dentro de seu espaço. Cada criatura na área precisa ser bem-sucedida em uma rolagem de desafio de Agilidade para não sofrer 1d6 de dano. Rolagem de Ataque 20+ O alvo sofre 1d6 de dano extra."
  },
  {
   "id": "sangue-transfusao",
   "nome": "Transfusão",
   "tipo": "Ataque",
   "trad": "Sangue",
   "grau": 1,
   "texto": "Alvo: Uma criatura viva à curta distância Um buraco se abre em algum ponto do corpo do alvo e então se fecha. Faça uma rolagem de ataque de Intelecto ou Vontade contra a Força do alvo. Em um sucesso, role 2d6. O total obtido é imposto como uma penalidade à Vida do alvo, e você recebe um bônus de Vida igual ao mesmo valor. Tanto a penalidade quanto o bônus duram 1 minuto. Especial: Se você for um vampiro, pode receber 1 ponto de sangue, em vez de o bônus de Vida."
  },
  {
   "id": "sangue-hemorragia",
   "nome": "Hemorragia",
   "tipo": "Ataque",
   "trad": "Sangue",
   "grau": 3,
   "texto": "Alvo: Uma criatura viva à média distância Se o alvo tiver Vida 20 ou menos, ele morre instantaneamente, com sangue jorrando de seus orifícios. Caso contrário, faça uma rolagem de ataque de Intelecto ou Vontade contra a Força do alvo. Em um sucesso, uma ferida hemorrágica horrível aparece em algum ponto do corpo do alvo; o alvo sofre 5d6 de dano e começa a sangrar. O sangramento dura até o alvo curar qualquer quantidade de dano ou até ele ou uma criatura adjacente ser bem-sucedida em uma rolagem de desafio de Intelecto para estancar a ferida. Enquanto estiver sangrando, o alvo sofre 1d6 de dano ao final de cada rodada. Rolagem de Ataque 20+ O alvo sofre 2d6 de dano extra."
  },
  {
   "id": "agua-dessecar",
   "nome": "Dessecar",
   "tipo": "Ataque",
   "trad": "Água",
   "grau": 2,
   "texto": "Alvo: Uma criatura viva à curta distância Um fino fluxo de névoa carmesim sobe do corpo do alvo enquanto você extrai seus fluidos vitais. Faça uma rolagem de ataque de Vontade contra a Força do alvo. Em um sucesso, o alvo sofre 2d6 de dano e fica fatigado por 1 hora. Se o alvo beber uma quantidade de litros de água igual a 4 vezes seu Tamanho, a aflição fatigado é removida. Se o alvo já estiver fatigado, em vez disso ele sofre 2d6 de dano extra."
  },
  {
   "id": "ar-onda-de-calor",
   "nome": "Onda de Calor",
   "tipo": "Ataque",
   "trad": "Ar",
   "grau": 1,
   "texto": "Área: Um cone de 3 metros de comprimento, originado de um ponto à curta distância Cada criatura viva na área precisa ser bem-sucedida em uma rolagem de desafio de Força para não ficar fatigada por 1 minuto. Enquanto fatigada dessa forma, a criatura sofre 1 de dano sempre que fizer uma rolagem de ataque ou de desafio."
  },
  {
   "id": "ar-muralha-cintilante",
   "nome": "Muralha Cintilante",
   "tipo": "Utilitário",
   "trad": "Ar",
   "grau": 1,
   "texto": "Área: Uma linha moldável de 5 metros de comprimento, 2 metros de altura e 1 metro de largura, originada de um ponto à curta distância Duração: 1 minuto Você eleva a temperatura do ar na área, fazendo-o tremeluzir enquanto este feitiço durar. Criaturas a mais de curta distância da borda da área fazem rolagens de ataque com 3 reveses contra criaturas que estejam atrás da área."
  },
  {
   "id": "ar-vincular-redemoinho-vivo",
   "nome": "Vincular Redemoinho Vivo",
   "tipo": "Utilitário",
   "trad": "Ar",
   "grau": 3,
   "texto": "Alvo: Um cubo de areia ou poeira, com 1 metro de lado, originado de um ponto à média distância Duração: 1 minuto Ao final da rodada em que você conjurar este feitiço, o alvo se torna um redemoinho vivo (veja o capítulo 3). Você não pode encerrar voluntariamente este feitiço. Quando o efeito se encerrar, o redemoinho vivo se dissipa, cobrindo de areia ou poeira o chão sob seu espaço. Quando o redemoinho vivo surgir, faça uma rolagem de ataque de Vontade contra a Vontade dele. Em um sucesso, o redemoinho vivo fica compelido durante a duração; em uma falha, fica hostil a você."
  },
  {
   "id": "celestial-martelo-solar",
   "nome": "Martelo Solar",
   "tipo": "Ataque",
   "trad": "Celestial",
   "grau": 4,
   "texto": "Área: Um cilindro vertical de 25 metros de altura e 2 metros de raio, centrado em um ponto no chão à distância extrema e que esteja iluminado pelo sol Um feixe de luz solar intensa causa 2d6+3 de dano a tudo que estiver na área. Cada criatura que sofrer dano dessa forma precisa fazer uma rolagem de desafio de Força. Em uma falha, ela fica prostrada e fatigada por 1 minuto; em um sucesso, sofre apenas metade do dano."
  },
  {
   "id": "maldicao-maldicao-dos-reis-das-tumbas",
   "nome": "Maldição dos Reis das Tumbas",
   "tipo": "Ataque",
   "trad": "Maldição",
   "grau": 3,
   "texto": "Alvo: Uma criatura viva em seu campo de visão à média distância Faça uma rolagem de ataque de Intelecto contra a Força do alvo e outra contra a Vontade dele. Em um sucesso contra a Força, o alvo sofre 2d6 de dano conforme uma dor intensa percorre seu corpo. Em um sucesso contra a Vontade, o alvo fica amedrontado por 1 minuto. Em um sucesso contra a Força e a Vontade, o alvo também fica amaldiçoado. Enquanto estiver amaldiçoado desta forma, o alvo fica fatigado e não pode curar dano."
  },
  {
   "id": "necromancia-liche",
   "nome": "Liche",
   "tipo": "Utilitário",
   "trad": "Necromancia",
   "grau": 6,
   "texto": "Requisitos: Você precisa ser mortal e não ter sido criado por magia. Antes de conjurar este feitiço, você precisa passar 8 horas por dia, durante 1 mês, 1 semana e 1 dia, criando um filactério para armazenar sua alma. Você decide qual é a aparência do filactério — como um amuleto, uma pequena caixa ou uma arma —, mas sua criação exige 100 co em materiais. Quando estiver pronto, o filactério será um objeto com Defesa 25 e Vida igual à sua Vida. Alvo: Uma dose de veneno ao seu alcance Duração: 1 hora O veneno se torna letal pela duração. Se o beber antes do fim da duração, você sofre uma quantidade de dano igual à sua Vida e morre instantaneamente. Sua alma fica aprisionada dentro do filactério até o objeto ser destruído; nesse momento, ela segue para o que quer que a aguarde no pós-vida. Oito horas depois de morrer por beber o veneno, você se torna uma criatura morta-viva até ser destruído. Sua condição de morto-vivo não detém a decomposição; portanto, a menos que tome medidas para preservar o corpo, sua carne apodrece até restar apenas o esqueleto. Como resultado da transformação, você adquire os seguintes traços: Valores de Atributo Força +1, Vontade +1 Características Defesa +1, Vida +20, Percepção +2, Corrupção +1d3 Imune a dano de frio, doença e veneno; adormecido, doente, fatigado, imobilizado, envenenado, lento Visão no Escuro Você consegue enxergar em áreas obscurecidas por sombras e escuridão à média distância como se estivessem iluminadas. Além dessa distância, você trata escuridão como sombras e sombras como áreas iluminadas. Filactério Enquanto seu filactério permanecer intacto, você cura dano normalmente ao final de um descanso. Se ficar incapacitado, seu corpo vira pó e se recompõe em um espaço aberto à curta distância de seu filactério 1d20 horas depois. Você retorna à vida com uma quantidade de dano igual à sua Vida –1. Se o seu filactério for destruído, você imediatamente sofre uma quantidade de dano igual à sua Vida e morre instantaneamente. Com um Pé na Cova Você cura apenas metade do dano por meio de magia e poções. Toque Sepulcral Seu toque desperta uma repulsa paralisante em criaturas vivas. Você pode usar uma ação para atacar uma criatura ao seu alcance. Faça uma rolagem de ataque de Intelecto ou Vontade com 1 dádiva contra a Defesa do alvo. Em um sucesso, o alvo sofre 4d6+3 de dano e precisa ser bem-sucedido em uma rolagem de desafio de Força para não ficar amedrontado por 1 minuto. Enquanto estiver amedrontado dessa forma, o alvo fica lento. Se o alvo já estiver lento, fica imobilizado; se já estiver imobilizado, em vez disso fica indefeso."
  },
  {
   "id": "protecao-adaptacao-elemental",
   "nome": "Adaptação Elemental",
   "tipo": "Utilitário",
   "trad": "Proteção",
   "grau": 1,
   "texto": "Alvo: Até cinco criaturas ao seu alcance Duração: 2 horas Você toca cada alvo. Enquanto este feitiço durar, cada alvo fica imune aos efeitos de privação e exposição."
  },
  {
   "id": "terra-areia-movedica",
   "nome": "Areia Movediça",
   "tipo": "Ataque",
   "trad": "Terra",
   "grau": 3,
   "texto": "Área: Um círculo no chão com raio de 4 metros, centrado em um ponto à curta distância Duração: 1 minuto O chão na área se torna terreno difícil enquanto este feitiço durar. Qualquer criatura que estiver na área quando você conjurar o feitiço, ou ao final de cada rodada enquanto este feitiço durar, precisa fazer uma rolagem de desafio de Força. Em uma falha, a criatura fica presa; em um sucesso, ela é movida para o espaço aberto mais próximo fora da área. Se uma criatura que já estiver presa falhar nessa rolagem, ela fica submersa e não consegue respirar. Criaturas presas ficam imobilizadas. Elas podem usar uma ação para fazer uma rolagem de desafio de Força, encerrando esta aflição em um sucesso. Criaturas submersas ficam cegas e imobilizadas. Elas podem usar uma ação para fazer uma rolagem de desafio de Força com 1 revés. Em um sucesso, ficam presas; em uma falha, sofrem 1d6 de dano. Quando este feitiço se encerrar, o chão retorna à consistência normal. Criaturas presas ou submersas podem continuar tentando se libertar conforme descrito anteriormente. Entretanto, se o chão for de pedra, cada criatura presa permanece imobilizada até ser libertada, e cada criatura submersa sofre uma quantidade de dano igual à própria Vida e morre instantaneamente. Libertar criaturas presas exige causar pelo menos 10 de dano ao chão da área usando armas ou ferramentas."
  }
 ],
 "feiticosTrilha": [
  {
   "id": "assolar",
   "nome": "Assolar",
   "tipo": "Ataque",
   "trad": "Trilha",
   "grau": 1,
   "atr": "vontade",
   "origem": "Assolador",
   "texto": "Requisitos: Você não pode estar em uma área devastada. Área: Uma esfera com raio de 5 metros centrada em um ponto ao seu alcance Duração: Veja o efeito A área fica devastada por 1d6 anos, período em que nenhuma planta pode crescer ali. Além disso, qualquer criatura que tentar conjurar um feitiço na área devastada precisa primeiro ser bem-sucedida em uma rolagem de desafio de Vontade. Em um fracasso, a conjuração não é gasta, mas a ação usada para conjurar o feitiço é desperdiçada. Quando você conjurar o feitiço, todas as plantas normais viram cinzas que rodopiam pela área, obscurecendo-a parcialmente por 1 rodada. Além disso, cada criatura viva na área precisa ser bem-sucedida em uma rolagem de desafio de Força para não ficar fatigada por 1 minuto e sofrer uma penalidade de –1d3 à Vida até completar um descanso. A penalidade de Vida é cumulativa com conjurações repetidas. Você aumenta em 1 o número de conjurações atuais de um feitiço que tenha aprendido e cujo grau seja igual ou menor que metade do seu Poder. Você mantém a conjuração adicional até gastá-la. Permanência: Se você conjurar este feitiço na mesma área todos os dias durante 8 dias, a área fica permanentemente devastada."
  }
 ],
 "itens": [
  {
   "nome": "Caldeirão da Morte",
   "preco": "—",
   "disp": "Relíquia",
   "cat": "Relíquia",
   "desc": "Crânios e figuras esqueléticas saltitantes cobrem a superfície deste caldeirão baixo, forjado em ferro negro. O interior exala um fedor de carne em decomposição e, quando o ar está parado, uma tênue névoa esverdeada sobe de dentro dele. O interior tem 1 metro de profundidade e 2 metros de diâmetro. Os trolls criaram este dispositivo vil, enchendo-o com cadáveres de elfos e outras fadas para criar lacaios mortos-vivos. O Rei-Bruxo possuiu o Caldeirão da Morte por algum tempo, mas ele se perdeu após sua queda.\nLevantar os Mortos. Qualquer criatura viva colocada dentro do Caldeirão sofre uma quantidade de dano igual à sua Vida e morre instantaneamente, erguendo-se como um cadáver animado 1d6 rodadas depois, sob o controle da criatura que a colocou dentro da relíquia. A nova criatura morta-viva se levanta e sai do caldeirão."
  },
  {
   "nome": "Cota de Sangue",
   "preco": "—",
   "disp": "Relíquia",
   "cat": "Relíquia",
   "desc": "Uma inspeção cuidadosa desta cota de malha enferrujada revela que o que parece ser corrosão é, na verdade, sangue antigo e ressecado. Esse resíduo vem dos usuários anteriores, que pagaram o alto preço da armadura em troca de seu poder. A Cota de Sangue foi forjada pelos trolls e mais tarde descoberta por alguns dos mais poderosos campeões de Gog, passando por muitas mãos antes de se perder na Desolação.\nArmadura Encantada. Enquanto estiver usando a armadura, você recebe +1 de bônus na Defesa.\nSorver Sangue. Enquanto estiver ferido e usando esta armadura, você faz rolagens de ataque com 1 dádiva. Porém, ao fim de cada rodada em que estiver ferido enquanto a estiver usando, você precisa ser bem-sucedido em uma rolagem de desafio de Força para não sofrer 1d3 de dano."
  },
  {
   "nome": "Flecha de Osso",
   "preco": "—",
   "disp": "Relíquia",
   "cat": "Relíquia",
   "desc": "A vitória das fadas sobre os trolls foi por pouco, conquistada apenas com o uso de magia das trevas. As fadas imortais fizeram muito para apagar esse período de suas memórias, mas algumas relíquias sobreviveram. A Flecha de Osso é uma delas, um item feito com os ossos do primeiro imortal assassinado. Uma fina haste de osso afilada até formar uma ponta em uma extremidade e entalhada na outra, a Flecha de Osso tem uma empenagem feita de fragmentos rígidos de osso. Embora tenha sido criada para ser usada com arcos e arcos longos, ela também pode ser disparada com bestas e bestas de mão. A flecha sempre pode ser recuperada do cadáver de uma criatura que atingir e nunca corre o risco de se perder (embora uma criatura na qual a flecha esteja cravada possa levá-la consigo).\nMunição Encantada. Você faz rolagens de ataque com 1 dádiva com uma arma que use esta munição.\nMunição Amaldiçoada. Quando o total de sua rolagem de ataque usando esta munição for 0 ou menos, a flecha faz uma curva de volta e atinge você automaticamente, causando 2d6 de dano e aplicando o efeito Flecha Assassina.\nFlecha Assassina. Criaturas vivas que sofrerem dano de Flecha de Osso precisam fazer uma rolagem de desafio de Força. Em uma falha, a criatura sofre 8d6 de dano extra; em um sucesso, sofre metade desse dano. Criaturas incapacitadas pelo dano morrem instantaneamente, e seu esqueleto explode para fora do corpo em uma torrente de sangue e vísceras. Qualquer personagem que presenciar isso precisa ser bem-sucedido em uma rolagem de desafio de Vontade para não ganhar 1 de Insanidade."
  },
  {
   "nome": "Manto do Atormentador",
   "preco": "—",
   "disp": "Relíquia",
   "cat": "Relíquia",
   "desc": "Uma veste macia e aveludada de um negro tão profundo que parece beber a luz, o Manto do Atormentador pende folgado do corpo de quem o usa, expandindo-se para acomodar qualquer compleição. Ele é sempre frio ao toque e não absorve umidade, mesmo quando submerso em água.\nVestes Mortais. O manto pertenceu ao principal rival do Rei-Bruxo, um bruxo desprezível chamado Atormentador, que ergueu um exército de mortos-vivos para tomar de seu tirano o controle de Gog. As duas forças entraram em confronto, e o Atormentador foi derrotado. Em vez de destruí-lo, o Rei-Bruxo selou seu inimigo no que se tornou a primeira tumba negra, confinando o rival e todos os seus lacaios naquele espaço apertado por toda a eternidade. Acredita-se que as vestes ainda estejam naquela tumba, embora viajantes sussurrem ter visto o tecido esvoaçante à deriva no vento, como se os conduzisse à prisão de seu dono.\nVisão no Escuro. Enquanto estiver usando o Manto, você consegue enxergar em áreas obscurecidas por sombras e escuridão à média distância como se essas áreas estivessem iluminadas. Além dessa distância, você trata escuridão como sombras e sombras como áreas iluminadas. Se já tiver Visão no Escuro, aumente a distância para longa distância.\nTrama Noturna. Você perde o traço Queimado pela Luz Solar, se o tiver, enquanto estiver usando o Manto. Além disso, criaturas que atacarem você com feitiços Celestiais fazem as rolagens de ataque com 1 revés, enquanto você faz rolagens de desafio com 1 dádiva para resistir a esses feitiços.\nPoder da Morte. Enquanto estiver usando o Manto, você aumenta em 1 a quantidade de conjurações de cada feitiço de Morte (veja Expansão do Lorde Demônio) e Necromancia que aprendeu."
  }
 ]
});
