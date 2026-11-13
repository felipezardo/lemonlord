window.SDL=window.SDL||{};
/* Efeitos mecânicos aplicados automaticamente nas rolagens.
   quando: 'ataque-arma' | 'ataque' | 'desafio' | 'dano'
   auto:true  => aplicado sempre; auto:false => aparece como opção marcável na janela de rolagem.
   dadivas: nº de dádivas; extra: dano extra (ex.: '1d6'); attr: restringe a um atributo (desafio). */
SDL.efeitos={
 "Treinamento com Armas":[{quando:"ataque-arma",dadivas:1,auto:true}],
 "Proeza em Combate":[{quando:"dano-arma",extra:"1d6",auto:true}],
 "Golpe Vigoroso":[{quando:"dano-arma",extra:"1d6",auto:false,rotulo:"Golpe Vigoroso (total ≥ 20 e 5+ acima do alvo)"}],
 "Especialista em Combate":[{quando:"dano-arma",extra:"1d6",auto:false,rotulo:"Especialista em Combate (ação de ataque)"}],
 "Maestria em Combate":[{quando:"dano-arma",extra:"1d6",auto:false,rotulo:"Maestria em Combate (ação de ataque)"}],
 "Trapaça":[{quando:"ataque",dadivas:1,extra:"1d6",auto:false,rotulo:"Trapaça (1×/rodada)"},{quando:"desafio",dadivas:1,auto:false,rotulo:"Trapaça (1×/rodada)"}],
 "Truques Sujos":[{quando:"dano-arma",extra:"1d6",auto:false,rotulo:"Truques Sujos (ataque com dádiva)"}],
 "Punhalada pelas Costas":[{quando:"dano-arma",extra:"1d6",auto:false,rotulo:"Punhalada pelas Costas (arma básica/rápida com dádiva)"}],
 "Inimigo Odiado":[{quando:"ataque-arma",dadivas:1,auto:false,rotulo:"Inimigo Odiado (criatura odiada)"}],
 "Fúria Crescente":[{quando:"ataque-arma",dadivas:1,auto:false,rotulo:"Fúria Crescente (sofreu dano)"}],
 "Constituição Robusta":[{quando:"desafio",dadivas:1,auto:false,rotulo:"Constituição Robusta (veneno)"}],
 "Sorrateiro":[{quando:"desafio",dadivas:1,attr:"agilidade",auto:false,rotulo:"Sorrateiro (esconder/silêncio)"}],
 "Grimório":[{quando:"desafio",dadivas:1,attr:"intelecto",auto:false,rotulo:"Grimório (lembrar sobre magia)"}]
};
SDL.tradicoes=["Adivinhação","Água","Alteração","Ar","Arcana","Batalha","Canção","Caos","Celestial","Conjuração","Destruição","Encantamento","Fogo","Ilusão","Maldição","Natureza","Necromancia","Primal","Proibida","Proteção","Runas","Sombras","Tecnomancia","Teletransporte","Tempestade","Tempo","Terra","Teurgia","Transformação","Vida"];
SDL.aflicoes=["Adormecido","Agarrado","Amedrontado","Atordoado","Aturdido","Cego","Compelido","Debilitado","Doente","Encantado","Envenenado","Fatigado","Imobilizado","Inconsciente","Indefeso","Lento","Prostrado","Surdo","Surpreendido"];
