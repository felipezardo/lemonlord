window.SDL=window.SDL||{};
/* Ancestralidades — Shadow of the Demon Lord, Livro Básico (Edição Revisada), Cap. 1.
   Para adicionar novas ancestralidades, acrescente objetos a SDL.ancestralidades (ver README). */
SDL.ancestralidades=[
{id:"humano",nome:"Humano",desc:"Determinação, engenhosidade e superioridade numérica ajudaram a humanidade a se tornar o povo mais numeroso do mundo.",
 atr:{forca:10,agilidade:10,intelecto:10,vontade:10},escolhaAtributo:1,percepcao:0,vidaBonus:0,tamanho:["1/2","1"],velocidade:10,corrupcao:0,insanidade:0,
 idiomas:"Você fala a Língua Comum e pode optar por falar mais um idioma ou adicionar uma profissão aleatória.",
 talentos:[],
 nivel4:{car:{vida:5},escolha:"Você aprende um feitiço ou ganha Determinado.",talento:{n:"Determinado",t:"Quando você rolar um 1 no dado de uma dádiva, você pode rolar o dado novamente e escolher usar o novo número."}}},
{id:"anao",nome:"Anão",desc:"Robustos, rudes e desconfiados, os anões são mestres da pedra e do ódio duradouro.",
 atr:{forca:10,agilidade:9,intelecto:10,vontade:10},percepcao:1,vidaBonus:4,tamanho:["1/2"],velocidade:8,corrupcao:0,insanidade:0,
 idiomas:"Você fala a Língua Comum e você fala, lê e escreve em Anânico.",
 talentos:[
 {n:"Visão no Escuro",t:"Você enxerga em áreas obscurecidas por sombras ou escuridão a média distância como se estivessem iluminadas. Além dessa distância, trate a escuridão como sombras, e as sombras como áreas iluminadas."},
 {n:"Inimigo Odiado",t:"Escolha uma criatura da tabela Ódio. Seu ódio concede 1 dádiva em rolagens de ataque contra criaturas que você odeia.",escolha:{rotulo:"Criatura odiada",opcoes:["Ogros","Trogloditas","Homens-fera","Goblins","Orcs","Demônios","Mortos-vivos"]}},
 {n:"Constituição Robusta",t:"Você recebe metade do dano de veneno. Você faz rolagens de desafio com 1 dádiva para evitar ou remover a aflição envenenado."}],
 nivel4:{car:{vida:6},escolha:"Você aprende um feitiço ou ganha Sacode a Poeira.",talento:{n:"Sacode a Poeira",t:"Você pode usar uma ação para curar dano igual à sua taxa de cura e remover uma das seguintes aflições: fatigado, debilitado ou envenenado. Após usar este talento, você não poderá usá-lo novamente até completar um período de descanso."}}},
{id:"automato",nome:"Autômato",desc:"Uma alma presa a um corpo mecânico, movido por uma chave que gira em suas costas.",
 atr:{forca:9,agilidade:8,intelecto:9,vontade:9},percepcao:0,vidaBonus:0,defesaFixa:13,tamanho:["1"],velocidade:8,corrupcao:0,insanidade:0,
 idiomas:"Você fala a Língua Comum.",
 talentos:[
 {n:"Imunidades",t:"Imune a dano causado por doenças ou veneno; adormecido, doente, fatigado, envenenado."},
 {n:"Chave",t:"Você possui uma chave em algum ponto do corpo que não consegue alcançar. A chave determina se você é uma criatura ou um objeto. Se ela estiver girando, você é considerado uma criatura e usa suas estatísticas normais. Se a chave não estiver girando, você é um objeto (Defesa 5, Vida 15, Força 0, Agilidade 0, Velocidade 0). Sua chave para de girar quando você fica incapacitado ou ao final de qualquer rodada na qual você obtiver 0 ou menos em uma rolagem de ataque ou de desafio."},
 {n:"Corpo Mecânico",t:"Você não come, não bebe e não respira. Você não envelhece e não pode ser transformado em um morto-vivo. Você é incapaz de nadar e, ao ser imerso em um líquido, afunda imediatamente."},
 {n:"Dar Corda no Relógio",t:"Enquanto você for um objeto, qualquer criatura que puder alcançá-lo pode usar uma ação para dar corda em você. Se não estiver incapacitado, você se torna uma criatura no final da rodada. Se estiver incapacitado, role um d6: com 3 ou menos permanece incapacitado; com 4 ou mais cura 1 ponto de dano e se torna uma criatura."},
 {n:"Reparar Dano",t:"Uma criatura pode usar um conjunto de ferramentas e gastar 4 horas trabalhando em você; ela faz uma rolagem de desafio de Intelecto com 1 revés. Em caso de sucesso, sua forma de objeto cura 1d6+1 de dano."}],
 nivel4:{car:{vida:5},escolha:"Você aprende um feitiço ou ganha Ranger Engrenagens.",talento:{n:"Ranger Engrenagens",t:"Você aumenta em um a quantidade de ações que pode usar em seu turno. Ao término de seu turno, role um d6. Se o resultado for ímpar, você se torna um objeto ao final da rodada."}}},
{id:"goblin",nome:"Goblin",desc:"Pequenos, bizarros e engenhosos, os goblins sobrevivem à margem da sociedade.",
 atr:{forca:8,agilidade:12,intelecto:10,vontade:9},percepcao:1,vidaBonus:0,tamanho:["1/2"],velocidade:10,corrupcao:0,insanidade:0,
 idiomas:"Você fala a Língua Comum e Élfico.",
 talentos:[
 {n:"Imunidades",t:"Imune a dano causado por doenças; encantado, doente."},
 {n:"Vulnerabilidade ao Ferro",t:"Você fica debilitado enquanto estiver em contato com ferro. Se sofrer dano de uma arma de ferro, fica debilitado até o final do seu próximo turno."},
 {n:"Visão nas Sombras",t:"Você enxerga áreas obscurecidas por sombras como se essas áreas estivessem iluminadas."},
 {n:"Sorrateiro",t:"Quando você rolar para se esconder ou se mover silenciosamente, faça a rolagem de desafio de Agilidade com 1 dádiva."}],
 nivel4:{car:{vida:4},escolha:"Você aprende um feitiço ou ganha Saltar para Longe.",talento:{n:"Saltar para Longe",t:"Quando uma criatura que você consegue ver obtém um fracasso em uma rolagem de ataque contra sua Defesa ou Agilidade, você pode usar uma ação desencadeada para recuar."}}},
{id:"orc",nome:"Orc",desc:"Criados para matar e libertos da escravidão, os orcs são temíveis e poderosos.",
 atr:{forca:11,agilidade:10,intelecto:9,vontade:9},percepcao:1,vidaBonus:0,tamanho:["1"],velocidade:12,corrupcao:1,insanidade:0,
 idiomas:"Você fala a Língua Comum e Linguagem das Trevas.",
 talentos:[{n:"Visão nas Sombras",t:"Você enxerga áreas obscurecidas por sombras como se essas áreas estivessem iluminadas."}],
 nivel4:{car:{vida:6},escolha:"Você aprende um feitiço ou ganha Fúria Crescente.",talento:{n:"Fúria Crescente",t:"Ao sofrer dano, você faz sua próxima rolagem de ataque antes do final da próxima rodada com 1 dádiva."}}},
{id:"versipele",nome:"Versipele",desc:"Seres mágicos capazes de roubar a aparência de outros.",
 atr:{forca:9,agilidade:10,intelecto:10,vontade:10},percepcao:1,vidaBonus:0,tamanho:["1"],velocidade:10,corrupcao:0,insanidade:0,
 idiomas:"Você fala a Língua Comum.",
 talentos:[
 {n:"Imunidades",t:"Imune a dano causado por doenças; encantado, doente."},
 {n:"Vulnerabilidade ao Ferro",t:"Você fica debilitado enquanto estiver em contato com ferro. Se sofrer dano de uma arma de ferro, fica debilitado até o final do seu próximo turno."},
 {n:"Visão nas Sombras",t:"Você enxerga áreas obscurecidas por sombras como se essas áreas estivessem iluminadas."},
 {n:"Roubar Identidade",t:"Você pode usar uma ação para alterar sua aparência e assumir a forma de uma criatura viva visível a curta distância. O alvo deve ser de Tamanho 1 ou 1/2 e ter forma humanoide de carne e osso. Suas roupas e pertences não se alteram. O efeito dura até que você use esse talento novamente. Se você ficar incapacitado ou tocar em ferro, retorna à aparência normal."}],
 nivel4:{car:{vida:4},escolha:"Você aprende um feitiço ou ganha Vantagem do Sósia.",talento:{n:"Vantagem do Sósia",t:"Você pode usar uma ação desencadeada no seu turno para Roubar Identidade. Além disso, quando você rouba a identidade de uma criatura, suas rolagens de ataque contra essa criatura são feitas com 1 dádiva enquanto você estiver com a aparência dela."}}}
];
