window.SDL=window.SDL||{};
/* Equipamento — Cap. 6 (Armas, Vestimenta e Armaduras, Equipamentos Pessoais). Preços: cc = cobre, xp = prata, co = ouro. */
(function(){
const W=(cat,req,list)=>list.map(a=>({id:(cat+"-"+a[0]).toLowerCase().replace(/[^a-z0-9]+/g,"-"),nome:a[0],dano:a[1],maos:a[2],prop:a[3],preco:a[4],disp:a[5],cat,req}));
SDL.armas=[].concat(
W("Básica Corpo a Corpo","",[["Adaga ou faca","1d3","Inábil","Acuidade, alcance (curto), arremesso","5 cc","C"],["Azagaia","1d3","Uma","Acuidade, alcance (médio), arremesso","1 xp","C"],["Cajado","1d6+1","Duas","Acuidade","5 cc","C"],["Clava","1d6","Uma","—","5 cc","C"],["Dardo","1","Inábil","Acuidade, alcance (curto), arremesso","1 cc","C"],["Desarmado","1","Inábil","Acuidade","—","—"],["Foice ou lança","1d6","Uma","Acuidade","1 xp","C"],["Machado","1d6+1","Uma","—","1 xp","C"],["Martelo ou machadinha","1d3","Inábil","Alcance (curto), arremesso","1 xp","C"]]),
W("À Distância","",[["Arco","1d6","Duas","Alcance (médio), usa flechas","5 xp","C"],["Arco longo (requer Força 9+)","1d6+1","Duas","Tamanho 1, alcance (longo), recarregar, usa flechas","1 co","I"],["Besta","2d6","Duas","Alcance (longo), recarga, usa virotes","1 co","C"],["Besta de mão","1d6","Inábil","Alcance (curto), recarga, usa virotes","2 co","R"],["Funda","1d3","Inábil","Alcance (médio), usa pedras","5 cc","C"],["Pistola","2d6","Inábil","Alcance (médio), pane, recarga, usa projéteis","5 co","E"],["Rifle","3d6","Duas","Alcance (longo), pane, recarga, usa projéteis","10 co","E"],["Zarabatana","1d3","Uma","Alcance (médio), usa agulhas","1 xp","I"]]),
W("Escudo","Força 9",[["Escudo pequeno","1","Inábil","Defensiva +1","5 cc","C"],["Escudo grande (requer Força 11+)","1d3","Inábil","Tamanho 1, Defensiva +2","1 xp","C"]]),
W("Militar Corpo a Corpo","Força 11",[["Espada bastarda ou martelo de guerra","2d6","Duas","Incômoda","1 co","R"],["Glaive, alabarda ou acha de armas","1d6+2","Duas","Alcance +1","1 co","I"],["Lança","1d6","Uma","Acuidade, alcance (curto), arremesso","1 xp","C"],["Lança de cavalaria","1d6+1","Duas","Uma mão enquanto montado, alcance +2","5 xp","I"],["Maça","1d6","Inábil","—","5 xp","C"],["Machado de batalha, mangual, maça-estrela, picareta ou espada.","1d6+2","Uma","—","5 xp","I"],["Pique","1d6","Duas","Tamanho 1, alcance +2","5 xp","I"],["Tridente","1d6","Uma","Alcance (curto), arremesso","5 xp","I"]]),
W("Versátil Corpo a Corpo","Força ou Agilidade 11",[["Chicote","1d3","Inábil","Acuidade, alcance +1","5 xp","I"],["Corrente, alfange, faca longa, flagelo ou espada curta","1d6","Inábil","Acuidade","5 xp","I"],["Rapieira, sabre ou cimitarra","1d6+1","Uma","Acuidade","1 co","I"]]),
W("Pesada Corpo a Corpo","Força 13",[["Espada bastarda ou martelo de guerra","2d6","Uma","Incômoda","1 co","R"],["Machado grande, montante ou malho","3d6","Duas","Incômoda","2 co","R"]])
);
/* Armaduras: base:"agi"+bonus => Defesa = Agilidade + bônus; def => Defesa fixa. req = Força exigida. */
SDL.armaduras=[
{id:"vestimenta",disp:"C",nome:"Vestimenta",tipo:"Vestimenta",base:"agi",bonus:0,preco:"variável",req:0},
{id:"couro-macio",disp:"C",nome:"Couro macio",tipo:"Vestimenta",base:"agi",bonus:1,preco:"2 xp",req:0},
{id:"couro-reforcado",disp:"C",nome:"Couro reforçado",tipo:"Armadura leve",base:"agi",bonus:2,preco:"5 xp",req:11},
{id:"brigandina",disp:"C",nome:"Brigandina",tipo:"Armadura leve",def:13,preco:"5 xp",req:11},
{id:"cota-de-malha",disp:"I",nome:"Cota de malha",tipo:"Armadura média",def:15,preco:"1 co",req:13},
{id:"escamas",disp:"I",nome:"Escamas",tipo:"Armadura média",def:16,preco:"2 co",req:13},
{id:"panoplia",disp:"R",nome:"Panóplia",tipo:"Armadura pesada",def:17,preco:"5 co",req:15},
{id:"placas",disp:"E",nome:"Armadura de placas completa",tipo:"Armadura pesada",def:18,preco:"25 co",req:15}];
SDL.armas.forEach(a=>{const r={"Básica Corpo a Corpo":0,"À Distância":0,"Escudo":9,"Militar Corpo a Corpo":11,"Versátil Corpo a Corpo":11,"Pesada Corpo a Corpo":13};a.reqN=r[a.cat];a.reqAtr=a.cat==="Versátil Corpo a Corpo"?"ambos":"forca";if(/Arco longo/.test(a.nome))a.reqN=9;if(/Escudo grande/.test(a.nome))a.reqN=11;});
})();
