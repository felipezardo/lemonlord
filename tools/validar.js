#!/usr/bin/env node
/* Validador dos dados do site (livro básico + suplementos). Uso:  node tools/validar.js
   Sai com código 1 se houver ERROS; AVISOS não bloqueiam. Veja SUPLEMENTOS.md. */
const fs = require("fs"), path = require("path"), vm = require("vm");
const raiz = path.join(__dirname, "..");
global.window = global; global.document = { addEventListener() {}, createElement() { return {}; } }; global.localStorage = { getItem() { return null; }, setItem() {} };
const carregar = (f) => vm.runInThisContext(fs.readFileSync(path.join(raiz, f), "utf8"), { filename: f });
["ancestralidades", "trilhas", "efeitos", "equipamento", "itens", "profissoes", "magias", "regras"].forEach((n) => carregar(`js/data/${n}.js`));
carregar("js/core.js");
carregar("js/data/suplementos/indice.js");
for (const f of SDL.suplementosIndice) carregar("js/data/suplementos/" + f);
const S = SDL; const erros = [], avisos = []; const E = (m) => erros.push(m), A = (m) => avisos.push(m);
const ATR = ["forca", "agilidade", "intelecto", "vontade"], CAR = ["vida", "defesa", "percepcao", "velocidade", "poder", "cura", "corrupcao", "insanidade", "tamanho"];
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const unicos = (lista, rot, chave = (x) => x.id) => { const v = new Set(); lista.forEach((x) => { const k = chave(x); if (v.has(k)) E(`${rot}: identificador repetido "${k}"`); v.add(k); }); };
const texto = (t, onde) => {
  if (typeof t !== "string" || !t.trim()) return E(`${onde}: texto vazio`);
  if (/\s{2,}/.test(t.replace(/\n/g, " "))) A(`${onde}: espaços duplos`);
  if (/[a-zà-ú]- [a-zà-ú]/.test(t)) A(`${onde}: possível hifenização não resolvida ("x- y")`);
  if (/(:\s*){2,}/.test(t)) E(`${onde}: ": :" duplicado`);
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffd]/.test(t)) E(`${onde}: caractere de controle/substituição`);
  if (t !== t.normalize("NFC")) A(`${onde}: texto não normalizado (NFC)`);
};
// ancestralidades
unicos(S.ancestralidades, "ancestralidades");
S.ancestralidades.forEach((a) => { const o = `ancestralidade ${a.id}`;
  if (!ID.test(a.id)) E(`${o}: id inválido`); ["nome", "desc", "idiomas"].forEach((k) => texto(a[k], `${o}.${k}`));
  ATR.forEach((k) => { if (!Number.isInteger(a.atr && a.atr[k])) E(`${o}: atr.${k} ausente`); });
  ["percepcao", "vidaBonus", "velocidade", "corrupcao", "insanidade"].forEach((k) => { if (!Number.isInteger(a[k])) E(`${o}: ${k} deve ser inteiro`); });
  if (!Array.isArray(a.tamanho) || !a.tamanho.length) E(`${o}: tamanho[]`);
  (a.talentos || []).forEach((t) => { texto(t.n, `${o} talento.n`); texto(t.t, `${o} talento ${t.n}`); if (t.escolha && !(t.escolha.opcoes || []).length) E(`${o} ${t.n}: escolha sem opções`); });
  const n4 = a.nivel4 || {}; if (!n4.car || !n4.talento) E(`${o}: nivel4 incompleto`); else { texto(n4.escolha, `${o} nivel4.escolha`); texto(n4.talento.t, `${o} nivel4 ${n4.talento.n}`); } });
// trilhas
unicos(S.trilhas, "trilhas");
const NIV = { novato: [1, 2, 5, 8], especialista: [3, 6, 9], mestre: [7, 10] }, nomesTrad = S.tradicoesInfo.map((t) => t.nome);
S.trilhas.forEach((t) => { const o = `trilha ${t.id}`;
  if (!ID.test(t.id)) E(`${o}: id inválido`); if (!NIV[t.tier]) E(`${o}: tier inválido`); texto(t.nome, `${o}.nome`); if (!t.desc) A(`${o}: sem descrição`);
  const ks = Object.keys(t.niv || {}).map(Number).sort((a, b) => a - b); if (!ks.length) E(`${o}: sem níveis`);
  if (NIV[t.tier] && ks.join() !== NIV[t.tier].join()) A(`${o}: níveis ${ks.join(",")} diferem do padrão ${NIV[t.tier].join(",")}`);
  ks.forEach((k) => { const l = t.niv[k], p = `${o} nível ${k}`;
    if (l.n !== k) E(`${p}: campo n difere da chave`); if (![0, 1, 2, 3].includes(l.esc)) E(`${p}: esc inválido`);
    Object.entries(l.car || {}).forEach(([c, v]) => { if (!CAR.includes(c) || !Number.isInteger(v)) E(`${p}: característica inválida ${c}`); });
    if (!(l.tal || []).length && !Object.keys(l.car || {}).length) A(`${p}: sem talentos nem características`);
    (l.tal || []).forEach((x) => { texto(x.n, `${p} talento.n`); texto(x.t, `${p} ${x.n}`); });
    if (l.mag) { const m = l.mag; ["obrig", "esc"].forEach((q) => { if (!Number.isInteger(m[q])) E(`${p}: mag.${q}`); }); (m.restr || []).forEach((r) => { if (!nomesTrad.includes(r)) E(`${p}: mag.restr refere tradição inexistente "${r}"`); }); }
    if (l.feit && !S.feiticosTrilha.some((x) => x.id === l.feit)) E(`${p}: feit "${l.feit}" não existe em feiticosTrilha`);
    if (!l.mag && !l.feit && (l.tal || []).some((x) => x.n === "Magia")) A(`${p}: talento "Magia" sem campo mag (concessão não automatizada)`); }); });
// magia
unicos(S.tradicoesInfo, "tradicoesInfo", (x) => x.nome); S.tradicoesInfo.forEach((t) => { if (!["intelecto", "vontade"].includes(t.atr)) E(`tradição ${t.nome}: atr inválido`); });
unicos(S.feiticos, "feiticos"); S.feiticos.forEach((f) => { const o = `feitiço ${f.id}`; if (!nomesTrad.includes(f.trad)) E(`${o}: tradição inexistente "${f.trad}"`); if (!["Ataque", "Utilitário"].includes(f.tipo)) E(`${o}: tipo inválido`); if (!(f.grau >= 0 && f.grau <= 10)) E(`${o}: grau`); texto(f.texto, o); });
nomesTrad.forEach((t) => { const gs = new Set(S.feiticos.filter((f) => f.trad === t).map((f) => f.grau)); const mx = Math.max(...gs); const falta = [...Array(mx + 1).keys()].filter((g) => !gs.has(g)); if (falta.length) A(`tradição ${t}: lacuna de graus (faltam ${falta.join(", ")}; o livro básico traz graus 0 a ${mx})`); });
unicos(S.feiticosTrilha, "feiticosTrilha"); S.feiticosTrilha.forEach((f) => { if (!["intelecto", "vontade"].includes(f.atr)) E(`feitiço de trilha ${f.id}: atr`); texto(f.texto, `feitiço de trilha ${f.id}`); });
S.religioes.forEach((r) => r[1].forEach((t) => { if (!nomesTrad.includes(t)) E(`religião ${r[0]}: tradição inexistente "${t}"`); }));
// equipamento
unicos(S.armas, "armas"); S.armas.forEach((a) => { ["nome", "dano", "maos", "preco", "disp", "cat"].forEach((k) => { if (a[k] == null || a[k] === "") E(`arma ${a.id}: falta ${k}`); }); if (a.dano !== "—" && !S.dados.expr(String(a.dano).replace(/\s/g, ""))) E(`arma ${a.id}: dano "${a.dano}" não é uma expressão de dados`); if (typeof a.reqN !== "number") A(`arma ${a.id}: sem reqN`); });
unicos(S.armaduras, "armaduras"); S.armaduras.forEach((a) => { if (a.def == null && a.base !== "agi") E(`armadura ${a.id}: defina def ou base:"agi"+bonus`); });
unicos(S.itens, "itens", (x) => x.nome + "|" + x.preco); S.itens.forEach((i) => { if (!i.nome || !i.preco) E(`item ${i.nome}: nome/preço`); });
Object.entries(S.profissoes).forEach(([c, l]) => { if (!Array.isArray(l)) E(`profissões ${c}: lista`); });
Object.entries(S.talentosEscolha).forEach(([k, l]) => l.forEach((o) => texto(o.t, `talentosEscolha ${k} ${o.n}`)));
Object.entries(S.efeitos).forEach(([n, l]) => l.forEach((e) => { if (!["ataque-arma", "ataque", "desafio", "dano-arma"].includes(e.quando)) E(`efeito ${n}: quando inválido`); }));
console.log(`Suplementos carregados: ${S.suplementos.map((s) => s.abreviacao).join(", ") || "nenhum"}`);
console.log(`Ancestralidades ${S.ancestralidades.length} · trilhas ${S.trilhas.length} · feitiços ${S.feiticos.length}+${S.feiticosTrilha.length} · armas ${S.armas.length} · itens ${S.itens.length}`);
avisos.forEach((m) => console.log("AVISO:", m)); erros.forEach((m) => console.log("ERRO: ", m));
console.log(`\n${erros.length} erro(s), ${avisos.length} aviso(s)`); process.exit(erros.length ? 1 : 0);
