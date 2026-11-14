window.SDL=window.SDL||{};
/* Efeitos de talentos aplicados automaticamente nas rolagens (apenas casos verificados no texto do livro).
   quando: 'ataque-arma' | 'ataque' | 'desafio' | 'dano'
   auto:true  => aplicado sempre; auto:false => aparece como opção marcável na janela de rolagem.
   dadivas: nº de dádivas; extra: dano extra (ex.: '1d6'); attr: restringe a um atributo (desafio). */
SDL.efeitos={
 "Treinamento com Armas":[{quando:"ataque-arma",dadivas:1,auto:true}],
 "Proeza em Combate":[{quando:"dano-arma",extra:"1d6",auto:true}],
 "Trapaça":[{quando:"ataque",dadivas:1,extra:"1d6",auto:false,rotulo:"Trapaça (ataque com a dádiva do talento: +1d6 de dano extra)"},{quando:"desafio",dadivas:1,auto:false,rotulo:"Trapaça (desafio)"}]
};
/* Os demais efeitos de talentos são inferidos do texto oficial (ver rolagens.js, S.efeitosDe). */
SDL.tradicoes=["Adivinhação","Água","Alteração","Ar","Arcana","Batalha","Canção","Caos","Celestial","Conjuração","Destruição","Encantamento","Fogo","Ilusão","Maldição","Natureza","Necromancia","Primal","Proibida","Proteção","Runas","Sombras","Tecnomancia","Teletransporte","Tempestade","Tempo","Terra","Teurgia","Transformação","Vida"];
SDL.aflicoes=["Adormecido","Agarrado","Amedrontado","Atordoado","Aturdido","Cego","Compelido","Debilitado","Doente","Encantado","Envenenado","Fatigado","Imobilizado","Inconsciente","Indefeso","Lento","Prostrado","Surdo","Surpreendido"];
