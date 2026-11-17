/* MODELO DE SUPLEMENTO — copie para <id-do-suplemento>.js e liste o arquivo em indice.js.
   Regras: texto SEMPRE verbatim do PDF; ids em minúsculas sem acento (a-z, 0-9, hífen); nada de campos fora deste modelo.
   Detalhes e checklist: SUPLEMENTOS.md. Validar com:  node tools/validar.js */
SDL.registrarSuplemento({
  id: "exemplo",                 // único, minúsculo
  nome: "Nome Completo do Suplemento",
  abreviacao: "Exemplo",         // aparece como "Fonte" nos cartões
  versao: "1",

  ancestralidades: [
    // {id,nome,desc,atr:{forca,agilidade,intelecto,vontade},escolhaAtributo?:1,percepcao,vidaBonus,defesaFixa?,tamanho:["1"],velocidade,corrupcao,insanidade:0,
    //  idiomas,talentos:[{n,t,escolha?:{rotulo,opcoes:[]}}],nivel4:{car:{vida},escolha,talento:{n,t}}}
  ],
  trilhas: [
    // {id,nome,tier:"novato|especialista|mestre",desc,niv:{"3":{n:3,esc:2,car:{vida:4,poder:1},idi:"texto",tal:[{n,t}],mag?:{obrig,esc,restr?:[],solo?:bool,rel?:bool},feit?:"id-do-feitico-de-trilha"}}}
  ],
  tradicoesInfo: [ /* {nome:"Nome",atr:"intelecto|vontade",trevas:false} */ ],
  feiticos: [ /* {id:"trad-nome",nome,tipo:"Ataque|Utilitário",trad,grau:0..10,texto} */ ],
  feiticosTrilha: [ /* {id,nome,tipo,trad:"Trilha",grau,atr,origem,texto} */ ],
  armas: [ /* {id,nome,dano,maos,prop,preco,disp,cat,req,reqN,reqAtr} */ ],
  armaduras: [ /* {id,disp,nome,tipo,base:"agi",bonus|def,preco,req} */ ],
  itens: [ /* {nome,preco,disp,cat,desc?} */ ],
  profissoes: { /* "Categoria": ["Nome", ...] */ },
  religioes: [ /* ["Nome", ["Tradição 1","Tradição 2","Tradição 3"]] */ ],
  talentosEscolha: { /* tipo: [{n,t}] */ },
  efeitos: { /* "Nome do talento": [{quando:"ataque-arma|ataque|desafio|dano-arma",dadivas,extra,attr,auto,rotulo}] — só quando a inferência automática errar */ },
  aflicoes: [ /* nomes novos */ ],
});
