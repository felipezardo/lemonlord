window.SDL=window.SDL||{};
/* Gerado por tools/build_anc.py a partir do Livro Básico (Cap. 1). Para adicionar ancestralidades de suplementos, use SDL.ancestralidades.push({...}) em outro arquivo. */
SDL.ancestralidades=[
 {
  "id": "humano",
  "nome": "Humano",
  "desc": "Determinação, engenhosidade e superioridade numérica ajudaram a humanidade a ascender de suas origens humildes e primitivas para se tornar o povo mais numeroso e comum do mundo. Poucos lugares escaparam da expansão humana, com assentamentos encontrados desde montanhas e pântanos até desertos desolados e planícies verdejantes. A civilização humana definiu os últimos mil anos da história e continua a fazê-lo mesmo com a aproximação da sombra.",
  "atr": {
   "forca": 10,
   "agilidade": 10,
   "intelecto": 10,
   "vontade": 10
  },
  "escolhaAtributo": 1,
  "percepcao": 0,
  "vidaBonus": 0,
  "tamanho": [
   "1/2",
   "1"
  ],
  "velocidade": 10,
  "corrupcao": 0,
  "insanidade": 0,
  "idiomas": "Você fala a Língua Comum e pode optar por falar mais um idioma ou adicionar uma profissão aleatória.",
  "talentos": [],
  "nivel4": {
   "car": {
    "vida": 5
   },
   "escolha": "Você aprende um feitiço ou ganha Determinado.",
   "talento": {
    "n": "Determinado",
    "t": "Quando você rolar um 1 no dado de uma dádiva, você pode rolar o dado novamente e escolher usar o novo número."
   }
  }
 },
 {
  "id": "anao",
  "nome": "Anão",
  "desc": "Anões vivem sob as montanhas, em elaboradas cidades subterrâneas. A partir delas, organizam expedições às profundezas da terra para extrair ouro e prata da rocha inflexível. Acumulam seus tesouros em grandes cofres e encaram outros povos com desconfiança, suspeitando que todos cobiçam suas riquezas. Os anões têm poucos amigos e recebem pouca ajuda quando as forças das trevas invadem suas fortalezas para reivindicar seus cofres. Assim, muitos anões vagam pelas terras, sem lar e sem aliados, em busca de um novo lugar para chamar de seu.",
  "atr": {
   "forca": 10,
   "agilidade": 9,
   "intelecto": 10,
   "vontade": 10
  },
  "percepcao": 1,
  "vidaBonus": 4,
  "tamanho": [
   "1/2"
  ],
  "velocidade": 8,
  "corrupcao": 0,
  "insanidade": 0,
  "idiomas": "Você fala a Língua Comum e você fala, lê e escreve em Anânico.",
  "talentos": [
   {
    "n": "Visão no Escuro",
    "t": "Você enxerga em áreas obscurecidas por sombras ou escuridão a média distância como se estivessem iluminadas. Além dessa distância, trate a escuridão como sombras, e as sombras como áreas iluminadas."
   },
   {
    "n": "Inimigo Odiado",
    "t": "Escolha uma criatura da tabela Ódio. Seu ódio concede 1 dádiva em rolagens de ataque contra criaturas que você odeia.",
    "escolha": {
     "rotulo": "Criatura odiada",
     "opcoes": [
      "Ogros",
      "Trogloditas",
      "Homens-fera",
      "Orcs",
      "Goblins",
      "Elfos",
      "Trolls",
      "Gigantes",
      "Dragões",
      "Demônios"
     ]
    }
   },
   {
    "n": "Constituição Robusta",
    "t": "Você recebe metade do dano de veneno. Você faz rolagens de desafio com 1 dádiva para evitar ou remover a aflição envenenado."
   }
  ],
  "nivel4": {
   "car": {
    "vida": 6
   },
   "escolha": "Você aprende um feitiço ou ganha Sacode a Poeira.",
   "talento": {
    "n": "Sacode a Poeira",
    "t": "Você pode usar uma ação para curar dano igual à sua taxa de cura e remover uma das seguintes aflições: fatigado, debilitado ou envenenado. Após usar este talento, você não poderá usá-lo novamente até completar um período de descanso."
   }
  }
 },
 {
  "id": "automato",
  "nome": "Autômato",
  "desc": "Autômatos são seres mecânicos feitos de placas de metal, engrenagens, fios, molas e rodas dentadas, animados por uma alma arrancada do Submundo. A magia que vincula a alma a mantém presa ao autômato, mas permite que ela manipule o corpo apenas enquanto seus mecanismos internos estão em movimento. Todos os autômatos possuem uma chave em algum ponto do corpo e, enquanto estão carregados, movem-se, pensam e agem como criaturas vivas. Caso a chave parar de girar, o autômato entra em estado dormente — tornando-se um objeto inanimado.",
  "atr": {
   "forca": 9,
   "agilidade": 8,
   "intelecto": 9,
   "vontade": 9
  },
  "percepcao": 0,
  "vidaBonus": 0,
  "defesaFixa": 13,
  "tamanho": [
   "1"
  ],
  "velocidade": 8,
  "corrupcao": 0,
  "insanidade": 0,
  "idiomas": "Você fala a Língua Comum.",
  "talentos": [
   {
    "n": "Imune",
    "t": "Imune a dano causado por doenças ou veneno; adormecido, doente, fatigado, envenenado"
   },
   {
    "n": "Chave",
    "t": "Você possui uma chave em algum ponto do corpo que não consegue alcançar. A chave determina se você é uma criatura ou um objeto. Se ela estiver girando, você é considerado uma criatura e usa suas estatísticas normais. Se a chave não estiver girando, você é considerado um objeto e usa as estatísticas da descrição a seguir em vez das suas estatísticas normais (sua Vida se torna o número inicial do objeto). Sua chave para de girar quando você fica incapacitado ou ao final de qualquer rodada na qual você obtiver 0 ou menos em uma rolagem de ataque ou de desafio. Qualquer dano sofrido em excesso à sua Vida se aplica à sua Vida em forma de objeto; se sofrer dano igual à Vida da sua forma de objeto, você é destruído."
   },
   {
    "n": "Corpo Mecânico",
    "t": "Você não come, não bebe e não respira. Você não envelhece e não pode ser transformado em um morto-vivo. Devido ao seu corpo mecânico, você é incapaz de nadar e, ao ser imerso em um líquido, afunda imediatamente."
   },
   {
    "n": "Forma de Objeto",
    "t": "Tamanho conforme sua forma de criatura\nPercepção —; Defesa 5; Vida 15; Força 0 (+0); Agilidade 0 (+0); Intelecto —; Vontade —; Velocidade 0\nImune rolagens de ataque contra Intelecto, Vontade ou Percepção; ataques que permitem rolagens de desafio para resistir usando Intelecto, Vontade ou Percepção\nAflições Suprimidas Quaisquer aflições que você tinha quando se tornou um objeto são suprimidas e não têm efeito enquanto você permanecer como um objeto. Entretanto, rodadas que se passem enquanto você estiver em sua forma de objeto contam para a duração dessas aflições.\nObjeto Você não pode usar ações ou ações desencadeadas, nem pode se mover. Você é completamente inanimado.\nMagia Falha Se você se tornar um objeto por ficar incapacitado, a magia que prende sua alma ao seu corpo começa a falhar. Ao final de cada rodada, role um d6.\n6: Você mantém a magia falha, e não está mais incapacitado, mas permanece como um objeto até outra criatura usar uma ação para restaurar poder a você.\n2–5: Falha mágica. Se tirar esse resultado três vezes, sua alma escapa do seu corpo e você permanece como um objeto permanentemente.\n1: Explosão! Você explode em um raio de 1d6 metros a partir de um ponto no espaço que você ocupa. Você é destruído, e tudo na área sofre 2d6 de dano. Uma criatura que obtiver um sucesso em uma rolagem de desafio de Agilidade reduz o dano à metade."
   },
   {
    "n": "Dar Corda no Relógio",
    "t": "Enquanto você for um objeto, qualquer criatura que puder alcançá-lo pode usar uma ação para dar corda em você. Se você não estiver incapacitado, seus mecanismos começam a funcionar novamente, e você se torna uma criatura no final da rodada. Se você estiver incapacitado, role um d6. Em 3 ou menos, você permanece incapacitado. Em 4 ou mais, você cura 1 ponto de dano e se torna uma criatura no final da rodada."
   },
   {
    "n": "Reparar Dano",
    "t": "Uma criatura pode usar um conjunto de ferramentas para começar a reparar você. Se a criatura gastar um total de 4 horas trabalhando em você, ela pode fazer uma rolagem de desafio de Intelecto com 1 revés. Em caso de sucesso, sua forma de objeto cura 1d6+1 de dano."
   }
  ],
  "nivel4": {
   "car": {
    "vida": 5
   },
   "escolha": "Você aprende um feitiço ou ganha Ranger Engrenagens.",
   "talento": {
    "n": "Ranger Engrenagens",
    "t": "Você aumenta em um a quantidade de ações que pode usar em seu turno. Ao término de seu turno, role um d6. Se o resultado for um número ímpar, você se torna um objeto ao final da rodada."
   }
  }
 },
 {
  "id": "goblin",
  "nome": "Goblin",
  "desc": "A Rainha Fada exilou os goblins há muito tempo, por um crime que só ela recorda. Como parte desse exílio, privou-os da imortalidade e os condenou a viver o restante de seus dias no mundo mortal. Desde então, os goblins se infiltraram nas sociedades humanas, estabelecendo seus lares em lixões e esgotos onde, para surpresa de todos, parecem bastante satisfeitos em realizar os trabalhos que ninguém mais tem o menor interesse de fazer. Revirar o lixo em busca de tesouros valiosos ou vasculhar as águas fétidas que escorrem por túneis subterrâneos à procura de um pouco de ouro ou uma moeda perdida é tudo o que os goblins precisam para não causar problemas aos seus vizinhos.",
  "atr": {
   "forca": 8,
   "agilidade": 12,
   "intelecto": 10,
   "vontade": 9
  },
  "percepcao": 1,
  "vidaBonus": 0,
  "tamanho": [
   "1/2"
  ],
  "velocidade": 10,
  "corrupcao": 0,
  "insanidade": 0,
  "idiomas": "Você fala a Língua Comum e Élfico.",
  "talentos": [
   {
    "n": "Imune",
    "t": "Imune a dano causado por doenças; encantado, doente"
   },
   {
    "n": "Vulnerabilidade ao Ferro",
    "t": "Você fica debilitado enquanto estiver em contato com ferro. Se sofrer dano de uma arma de ferro, fica debilitado até o final do seu próximo turno."
   },
   {
    "n": "Visão nas Sombras",
    "t": "Você enxerga áreas obscurecidas por sombras como se essas áreas estivessem iluminadas."
   },
   {
    "n": "Sorrateiro",
    "t": "Quando você rolar para se esconder ou se mover silenciosamente, faça a rolagem de desafio de Agilidade com 1 dádiva."
   }
  ],
  "nivel4": {
   "car": {
    "vida": 4
   },
   "escolha": "Você aprende um feitiço ou ganha Saltar para Longe.",
   "talento": {
    "n": "Saltar para Longe",
    "t": "Quando uma criatura que você consegue ver obtém um fracasso em uma rolagem de ataque contra sua Defesa ou Agilidade, você pode usar uma ação desencadeada para recuar."
   }
  }
 },
 {
  "id": "orc",
  "nome": "Orc",
  "desc": "Considerados por muito tempo os soldados perfeitos, os orcs romperam os grilhões da escravidão e se rebelaram contra seus senhores imperiais em uma guerra que ameaça afogar o Império em sangue.",
  "atr": {
   "forca": 11,
   "agilidade": 10,
   "intelecto": 9,
   "vontade": 9
  },
  "percepcao": 1,
  "vidaBonus": 0,
  "tamanho": [
   "1"
  ],
  "velocidade": 12,
  "corrupcao": 1,
  "insanidade": 0,
  "idiomas": "Você fala a Língua Comum e Linguagem das Trevas.",
  "talentos": [
   {
    "n": "Visão nas Sombras",
    "t": "Você enxerga áreas obscurecidas por sombras como se essas áreas estivessem iluminadas."
   }
  ],
  "nivel4": {
   "car": {
    "vida": 6
   },
   "escolha": "Você aprende um feitiço ou ganha Fúria Crescente.",
   "talento": {
    "n": "Fúria Crescente",
    "t": "Ao sofrer dano, você faz sua próxima rolagem de ataque antes do final da próxima rodada com 1 dádiva."
   }
  }
 },
 {
  "id": "versipele",
  "nome": "Versipele",
  "desc": "Versipeles são criados para esconder a ausência das crianças que eles roubam. Um versipele é construído a partir de materiais naturais e usam magia para dar a ele a aparência da criança desaparecida. A magia geralmente desaparece após algumas semanas, mas às vezes persiste e permite que o versipele cresça e se torne uma pessoa de verdade.",
  "atr": {
   "forca": 9,
   "agilidade": 10,
   "intelecto": 10,
   "vontade": 10
  },
  "percepcao": 1,
  "vidaBonus": 0,
  "tamanho": [
   "1"
  ],
  "velocidade": 10,
  "corrupcao": 0,
  "insanidade": 0,
  "idiomas": "Você fala a Língua Comum.",
  "talentos": [
   {
    "n": "Imune",
    "t": "Imune a dano causado por doenças; encantado, doente"
   },
   {
    "n": "Vulnerabilidade ao Ferro",
    "t": "Você fica debilitado enquanto estiver em contato com ferro. Se sofrer dano de uma arma de ferro, fica debilitado até o final do seu próximo turno."
   },
   {
    "n": "Visão nas Sombras",
    "t": "Você enxerga áreas obscurecidas por sombras como se essas áreas estivessem iluminadas."
   },
   {
    "n": "Roubar Identidade",
    "t": "Você pode usar uma ação para alterar sua aparência e assumir a forma de uma criatura viva visível a curta distância. O alvo deve ser de Tamanho 1 ou 1/2 e ter uma forma humanoide de carne e osso. Seu corpo se transforma para que você fique parecido com o alvo, porém, suas roupas e pertences não se alteram. O efeito dura até que você use esse talento novamente. Se você ficar incapacitado ou tocar em um objeto feito de ferro, você retorna imediatamente à sua aparência normal."
   }
  ],
  "nivel4": {
   "car": {
    "vida": 4
   },
   "escolha": "Você aprende um feitiço ou ganha Vantagem do Sósia.",
   "talento": {
    "n": "Vantagem do Sósia",
    "t": "Você pode usar uma ação desencadeada no seu turno para Roubar Identidade. Além disso, quando você rouba a identidade de uma criatura, suas rolagens de ataque contra essa criatura são feitas com 1 dádiva enquanto você estiver com a aparência dela."
   }
  }
 }
];
