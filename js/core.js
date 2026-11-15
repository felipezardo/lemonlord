/* Núcleo do app: utilitários de DOM, modais, tema, armazenamento, cálculo de ficha e rolagem de dados. */
window.SDL = window.SDL || {};
(function (S) {
  "use strict";

  /* ---------- DOM ---------- */
  S.h = function (tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else if (k === "html") el.innerHTML = v;
      else if (k === "value") el.value = v;
      else if (v === true) el.setAttribute(k, "");
      else el.setAttribute(k, v);
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  };
  const h = S.h;
  S.icone = {
    x: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/></svg>',
    voltar: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  };
  S.$ = (s, r) => (r || document).querySelector(s);
  S.uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  S.byId = (arr, id) => arr.find((x) => x.id === id);
  S.sinal = (n) => (n >= 0 ? "+" + n : "−" + Math.abs(n));
  S.ATR = [
    ["forca", "Força"],
    ["agilidade", "Agilidade"],
    ["intelecto", "Intelecto"],
    ["vontade", "Vontade"],
  ];
  S.ATR_NOME = Object.fromEntries(S.ATR);

  /* ---------- Toast ---------- */
  S.toast = function (msg) {
    let box = S.$("#toasts");
    if (!box) { box = h("div", { id: "toasts", "aria-live": "polite" }); document.body.append(box); }
    const t = h("div", { class: "toast" }, msg);
    box.append(t);
    setTimeout(() => t.classList.add("sai"), 2600);
    setTimeout(() => t.remove(), 3100);
  };

  /* ---------- Modal ---------- */
  S.modal = function ({ titulo, corpo, acoes = [], largura = "md", aoFechar }) {
    const anterior = document.activeElement;
    const fundo = h("div", { class: "modal-fundo", role: "presentation" });
    const caixa = h("div", { class: "modal modal-" + largura, role: "dialog", "aria-modal": "true", "aria-label": titulo });
    const fechar = () => {
      fundo.classList.add("sai");
      document.removeEventListener("keydown", tecla);
      setTimeout(() => fundo.remove(), 160);
      if (aoFechar) aoFechar();
      if (anterior && anterior.focus) anterior.focus();
    };
    const tecla = (e) => { if (e.key === "Escape" && fundo === [...document.querySelectorAll(".modal-fundo")].pop()) fechar(); };
    document.addEventListener("keydown", tecla);
    caixa.append(
      h("header", { class: "modal-topo" }, h("h2", {}, titulo), h("button", { class: "btn-icone", "aria-label": "Fechar", onclick: fechar, html: S.icone.x })),
      h("div", { class: "modal-corpo" }, corpo)
    );
    if (acoes.length)
      caixa.append(h("footer", { class: "modal-rodape" }, acoes.map((a) =>
        h("button", { class: "btn " + (a.classe || ""), onclick: () => { const r = a.fn ? a.fn() : undefined; if (r !== false && !a.manter) fechar(); } }, a.texto))));
    fundo.addEventListener("mousedown", (e) => { if (e.target === fundo) fechar(); });
    fundo.append(caixa);
    document.body.append(fundo);
    const foco = caixa.querySelector("[autofocus], input, button.btn");
    if (foco) foco.focus();
    return fechar;
  };
  S.confirmar = (titulo, texto, ok = "Confirmar", perigo) =>
    new Promise((res) => {
      S.modal({ titulo, corpo: h("p", {}, texto), largura: "sm", aoFechar: () => res(false),
        acoes: [{ texto: "Cancelar" }, { texto: ok, classe: perigo ? "perigo" : "primario", fn: () => { res(true); } }] });
    });

  /* ---------- Tema (sol/lua) ---------- */
  const SOL = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="currentColor"/><g stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.9 1.9M16.8 16.8l1.9 1.9M5.3 18.7l1.9-1.9M16.8 7.2l1.9-1.9"/></g></svg>';
  const LUA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a.7.7 0 0 0-.9-.9A10 10 0 1 0 21.4 15.5a.7.7 0 0 0-.9-.9z"/></svg>';
  S.tema = {
    atual() { return document.documentElement.dataset.tema; },
    aplicar(t) { document.documentElement.dataset.tema = t; try { localStorage.setItem("sdl:tema", t); } catch (e) {} },
    iniciar() {
      let t; try { t = localStorage.getItem("sdl:tema"); } catch (e) {}
      if (!t) t = matchMedia("(prefers-color-scheme: light)").matches ? "claro" : "escuro";
      document.documentElement.dataset.tema = t;
    },
    botao() {
      const b = h("button", { class: "tema-switch", role: "switch", "aria-label": "Alternar tema claro/escuro", title: "Alternar tema" },
        h("span", { class: "ic ic-sol", html: SOL }), h("span", { class: "ic ic-lua", html: LUA }), h("span", { class: "bola" }));
      const sync = () => b.setAttribute("aria-checked", S.tema.atual() === "escuro");
      b.addEventListener("click", () => { S.tema.aplicar(S.tema.atual() === "escuro" ? "claro" : "escuro"); sync(); });
      sync(); return b;
    },
  };

  /* ---------- Armazenamento ---------- */
  const CHAVE = "sdl:fichas:v1";
  S.fichas = {
    lista() { try { return JSON.parse(localStorage.getItem(CHAVE) || "[]"); } catch (e) { return []; } },
    gravarTodas(l) {
      try { localStorage.setItem(CHAVE, JSON.stringify(l)); return true; }
      catch (e) { S.toast("Armazenamento cheio: exporte suas fichas e reduza o tamanho das imagens."); return false; }
    },
    obter(id) { return this.lista().find((f) => f.id === id); },
    salvar(f) {
      f.atualizado = Date.now();
      const l = this.lista(); const i = l.findIndex((x) => x.id === f.id);
      if (i >= 0) l[i] = f; else l.unshift(f);
      return this.gravarTodas(l);
    },
    excluir(id) { this.gravarTodas(this.lista().filter((f) => f.id !== id)); },
    nova() {
      return { id: S.uid(), v: 1, criado: Date.now(), atualizado: Date.now(), nome: "", descricao: "", retrato: "", nivel: 1, anc: "", ancEsc: {}, ajuste: { mais: "", menos: "" },
        trilhas: { novato: "", especialista: "", mestre: "" }, picks: {}, escolhas: {}, profissoes: [], talentosExtra: [], armas: [], armadura: "", escudo: "",
        equip: [], dinheiro: { co: 0, xp: 0, cc: 0 }, magias: [], tradicoes: [], talEsc: {}, efAtivos: {}, bonusAtivo: {}, religiao: "", conj: {}, notasTal: {}, dano: 0, insanidade: 0, corrupcao: 0, aflicoes: [], bonus: {}, notas: "", usados: {} };
    },
    exportar(fichas, nome) {
      const blob = new Blob([JSON.stringify({ app: "sdl-ficha", versao: 1, fichas }, null, 1)], { type: "application/json" });
      const a = h("a", { href: URL.createObjectURL(blob), download: nome }); document.body.append(a); a.click(); a.remove();
    },
    importar(texto) {
      const d = JSON.parse(texto); const arr = d.fichas || (Array.isArray(d) ? d : [d]);
      let n = 0; const l = this.lista();
      for (const f of arr) { if (!f || typeof f !== "object" || !("anc" in f)) continue; const g = Object.assign(this.nova(), f); if (l.some((x) => x.id === g.id)) g.id = S.uid(); l.unshift(g); n++; }
      this.gravarTodas(l); return n;
    },
  };

  /* ---------- Cálculo automático da ficha ---------- */
  S.calcular = function (c) {
    const anc = S.byId(S.ancestralidades, c.anc);
    const nivel = +c.nivel || 0;
    const TE = { "Talento Sagaz": ["sagaz", 1], "Talentos Gatunos": ["gatuno", 2], "Talento Gatuno": ["gatuno", 1], "Talento de Lutador": ["lutador", 1] };
    let poderExtra = 0, sagazMagia = 0; const grants = [];
    const r = { dups: [], escolhasTal: [], feitAuto: [], anc, nivel, atrs: {}, car: { vida: 0, defesa: 0, percepcao: 0, velocidade: 0, poder: 0, cura: 0, tamanho: 0, corrupcao: 0, insanidade: 0 }, ben: [], tal: [], pend: [], idiomas: [] };
    const ben = [];
    const trilhaDe = (tier) => S.byId(S.trilhas, c.trilhas[tier]);
    const sec9 = c.escolhas.sec9 === "secundaria";
    for (const tier of ["novato", "especialista", "mestre"]) {
      const t = trilhaDe(tier); if (!t) continue;
      const sec = tier === "mestre" && t.tier === "especialista";
      let entradas = sec ? [[7, 3], [10, 6]].concat(sec9 ? [[9, 9]] : []) : Object.keys(t.niv).map((k) => [+k, +k]);
      entradas.sort((a, b) => a[0] - b[0]);
      for (const [alvo, src] of entradas) {
        if (alvo > nivel) continue;
        if (tier === "especialista" && src === 9 && c.trilhas.mestre && S.byId(S.trilhas, c.trilhas.mestre) && S.byId(S.trilhas, c.trilhas.mestre).tier === "especialista" && sec9) continue;
        const lv = t.niv[src]; if (!lv) continue;
        ben.push({ chave: t.id + (sec ? ":sec" : "") + ":" + src, fonte: `${t.nome}${sec ? " (trilha secundária)" : ""} — nível ${src}`, trilha: t, nivel: src, esc: lv.esc, car: lv.car, idi: lv.idi, tal: lv.tal, mag: lv.mag, feit: lv.feit, sec });
      }
    }
    if (anc && nivel >= 4) {
      const n4 = anc.nivel4; const optou = c.escolhas["anc:4"] || "talento";
      ben.push({ chave: "anc:4", fonte: `${anc.nome} — nível 4`, esc: 0, car: n4.car, tal: optou === "talento" ? [n4.talento] : [], ancEscolha: n4.escolha });
    }
    r.ben = ben;
    // atributos
    const base = anc ? { ...anc.atr } : { forca: 10, agilidade: 10, intelecto: 10, vontade: 10 };
    if (anc && anc.escolhaAtributo && c.ancEsc.atributo) base[c.ancEsc.atributo] += 1;
    if (c.ajuste.mais && c.ajuste.menos && c.ajuste.mais !== c.ajuste.menos) { base[c.ajuste.mais] += 1; base[c.ajuste.menos] -= 1; }
    for (const b of ben) {
      const p = (c.picks[b.chave] || []).slice(0, b.esc);
      p.forEach((a) => { if (base[a] != null) base[a] += 1; });
      if (b.esc > p.length) r.pend.push({ chave: b.chave, falta: b.esc - p.length, fonte: b.fonte });
      for (const [k, v] of Object.entries(b.car || {})) r.car[k] += v;
      if (b.idi) r.idiomas.push({ fonte: b.fonte, texto: b.idi });
      (b.tal || []).forEach((t) => {
        const te = TE[t.n];
        if (b.sec && !te && t.n !== "Magia" && r.tal.some((x) => x.n === t.n)) {
          const ch = c.escolhas["dup:" + t.n], chave = "dup:" + t.n;
          r.dups.push({ nome: t.n, chave, fonte: b.fonte, escolha: ch });
          if (!ch) r.pend.push({ chave, falta: 1, fonte: `${b.fonte}: talento repetido (${t.n})` });
          if (ch === "atributo") { const p = (c.picks[chave] || [])[0]; if (p && base[p] != null) base[p] += 1; else if (!p) r.pend.push({ chave: chave + ":attr", falta: 1, fonte: `${t.n}: atributo +1` }); }
          if (ch === "tradicao") grants.push({ obrig: 1, fonte: `${t.n} (repetido): descobrir tradição` });
          if (ch === "feitico") grants.push({ esc: 1, solo: true, fonte: `${t.n} (repetido): aprender feitiço` });
          return;
        }
        if (te) {
          const chave = b.chave + ":" + t.n, esc = c.talEsc[chave] || [], falta = te[1] - esc.length;
          if (falta > 0) r.pend.push({ chave, falta, fonte: b.fonte + " — " + t.n, talento: te[0], max: te[1] });
          r.escolhasTal.push({ chave, kind: te[0], max: te[1], nome: t.n, fonte: b.fonte });
          esc.slice(0, te[1]).forEach((nm) => {
            const op = (S.talentosEscolha[te[0]] || []).find((o) => o.n === nm); if (!op) return;
            r.tal.push({ n: nm, t: op.t, fonte: b.fonte + " — " + t.n });
            if (te[0] === "sagaz" && nm === "Magia") { poderExtra += 1; sagazMagia++; grants.push(sagazMagia === 1 ? { obrig: 1, esc: 2, fonte: "Talento Sagaz: Magia" } : { esc: 1, fonte: "Talento Sagaz: Magia (2ª vez)" }); }
          });
        } else r.tal.push({ ...t, fonte: b.fonte });
      });
      if (b.mag) grants.push({ ...b.mag, fonte: b.fonte });
      if (b.feit) r.feitAuto.push(b.feit);
      if (b.chave === "anc:4" && (c.escolhas["anc:4"] || "talento") === "feitico") grants.push({ esc: 1, solo: true, fonte: b.fonte });
    }
    if (anc && anc.escolhaAtributo && !c.ancEsc.atributo) r.pend.push({ chave: "anc:attr", falta: 1, fonte: anc.nome + " (+1 em um atributo)" });
    const BK = { defesa: "defesa", "percepção": "percepcao", velocidade: "velocidade", vida: "vida", poder: "poder" };
    r.tal.forEach((t) => {
      t.bonus = []; for (const m of (t.t || "").matchAll(/\+(\d+)\s+(?:de\s+)?(?:em|na|no)\s+(Defesa|Percepção|Velocidade|Vida|Poder)\b/gi)) t.bonus.push({ k: BK[m[2].toLowerCase()], v: +m[1] });
      if (t.bonus.length && (c.bonusAtivo || {})[t.n]) t.bonus.forEach((b2) => (r.car[b2.k] += b2.v));
    });
    for (const [k] of S.ATR) { const v = base[k] + (c.bonus[k] || 0); r.atrs[k] = { v, m: v - 10 }; }
    if (anc) anc.talentos.forEach((t) => r.tal.unshift({ ...t, fonte: anc.nome }));
    (c.talentosExtra || []).forEach((t) => r.tal.push({ n: t.n, t: t.t, fonte: "Personalizado", custom: true }));
    // características
    const A = r.atrs, K = r.car, B = c.bonus;
    r.vida = A.forca.v + (anc ? anc.vidaBonus : 0) + K.vida + (B.vida || 0);
    r.cura = Math.floor(r.vida / 4) + K.cura + (B.cura || 0);
    r.percepcao = A.intelecto.v + (anc ? anc.percepcao : 0) + K.percepcao + (B.percepcao || 0);
    const arm = S.byId(S.armaduras, c.armadura);
    let defBase = anc && anc.defesaFixa ? anc.defesaFixa : A.agilidade.v;
    if (arm) defBase = arm.def != null ? arm.def : A.agilidade.v + arm.bonus;
    const esc = c.escudo ? S.byId(S.armas, c.escudo) : null;
    const defEsc = esc ? +((/Defensiva \+(\d)/.exec(esc.prop) || [0, 0])[1]) : 0;
    r.defesa = defBase + K.defesa + defEsc + (B.defesa || 0);
    r.defesaNota = arm ? arm.nome : "";
    r.armInsuf = !!(arm && arm.req && A.forca.v < arm.req);
    r.velocidade = (anc ? anc.velocidade : 10) + K.velocidade + (B.velocidade || 0) - (r.armInsuf ? 2 : 0);
    const tam = anc ? (c.ancEsc.tamanho || anc.tamanho[anc.tamanho.length - 1]) : "1";
    r.tamanho = tam;
    r.poder = K.poder + poderExtra + (B.poder || 0);
    r.insanidade = +c.insanidade || 0; r.corrupcao = +c.corrupcao || 0;
    r.dano = Math.min(+c.dano || 0, r.vida);
    r.estado = r.dano >= r.vida ? "incapacitado" : r.dano >= r.vida / 2 ? "ferido" : "";
    // magia: concessões viram "vagas"; descobrir uma tradição concede 1 feitiço de grau 0 (Truque: +1) fora das vagas (Cap. 5)
    const slots = [], religT = (S.religioes.find((x) => x[0] === c.religiao) || [0, null])[1];
    grants.forEach((g) => { for (let i = 0; i < (g.obrig || 0); i++) slots.push({ obrig: true, fonte: g.fonte, rel: g.rel, restr: g.restr });
      for (let i = 0; i < (g.esc || 0); i++) slots.push({ solo: !!g.solo, fonte: g.fonte, rel: g.rel, restr: g.restr }); });
    const mg = c.magias || [], truque = c.trilhas.novato === "magista" && nivel >= 1;
    const dadosSp = (m) => (m.id ? S.feiticos.find((x) => x.id === m.id) : m) || {};
    const livre = {}; c.tradicoes.forEach((t) => (livre[t] = (livre[t] || 0) + (truque ? 2 : 1)));
    const livreUids = new Set(), pagos = [];
    mg.forEach((m) => { const sp = dadosSp(m); if (sp.grau === 0 && livre[sp.trad] > 0) { livre[sp.trad]--; livreUids.add(m.uid); } else pagos.push(m); });
    const itens = c.tradicoes.map((n) => ({ t: "trad", trad: n, nome: n })).concat(pagos.map((m) => ({ t: "spell", trad: dadosSp(m).trad, nome: dadosSp(m).nome || m.nome })));
    const aceita = (s, it) => { if (s.obrig && it.t !== "trad") return false; if (s.solo && it.t !== "spell") return false; if (!it.trad || it.trad === "Personalizado") return true; if (s.restr && !s.restr.includes(it.trad)) return false; if (s.rel && religT && !religT.includes(it.trad)) return false; return true; };
    const casar = (its) => { const m = Array(slots.length).fill(-1); const tenta = (i, vis) => { for (let s = 0; s < slots.length; s++) { if (vis[s] || !aceita(slots[s], its[i])) continue; vis[s] = 1; if (m[s] < 0 || tenta(m[s], vis)) { m[s] = i; return true; } } return false; }; its.forEach((_, i) => tenta(i, [])); const usados = new Set(m.filter((x) => x >= 0)); return { ok: usados.size, fora: its.filter((_, i) => !usados.has(i)) }; };
    const base0 = casar(itens);
    const livresRestantes = Object.values(livre).reduce((a, b2) => a + b2, 0);
    const trevasN = mg.filter((m) => { const i = S.tradicoesInfo.find((t) => t.nome === dadosSp(m).trad); return i && i.trevas; }).length;
    r.mag = { grants, slots, total: slots.length, usado: base0.ok, fora: base0.fora, truque, livreUids, livresRestantes, livreDisp: (t) => livre[t] || 0, religT, trevasN,
      cabe: (it) => { const x = casar(itens.concat([it])); return x.fora.length === base0.fora.length; } };
    if (slots.length > base0.ok) r.pend.push({ chave: "magia", falta: slots.length - base0.ok, fonte: "Magia (tradições e feitiços)", magia: true });
    r.feiticos = mg.map((m) => ({ ...dadosSp(m), uid: m.uid, id: m.id, livre: livreUids.has(m.uid) })).filter((x) => x.nome);
    r.feitAuto.forEach((id) => { const f2 = S.feiticosTrilha.find((x) => x.id === id); if (f2 && !r.feiticos.some((x) => x.id === id)) r.feiticos.push({ ...f2, uid: "auto-" + id, auto: true }); });
    r.casts = (grau) => (grau <= r.poder ? (S.conjuracoes[Math.min(r.poder, 10)] || [])[grau] || 0 : 0);
    r.atrTrad = (t) => { const i = S.tradicoesInfo.find((x) => x.nome === t); return i ? i.atr : "intelecto"; };
    r.efAtivos = c.efAtivos || {};
    r.reqArma = (a) => { const b = (a && a.id && S.armas.find((x) => x.id === a.id)) || a; if (!b || !b.reqN) return true; return b.reqAtr === "ambos" ? Math.max(A.forca.v, A.agilidade.v) >= b.reqN : A.forca.v >= b.reqN; };
    r.mod = (k) => (k === "percepcao" ? r.percepcao - 10 : A[k] ? A[k].m : 0);
    // ---- avisos e notas (nenhuma regra bloqueia o jogador; o app apenas sinaliza) ----
    const av = []; const A2 = (n, t) => av.push({ n, t });
    r.pend.forEach((p) => A2("pendente", `${p.fonte}: faltam ${p.falta} escolha(s).`));
    if (r.mag.fora.length) A2("alerta", `Fora das concessões de magia: ${r.mag.fora.map((x) => x.nome).join(", ")}. Verifique as restrições (tradição fixa da trilha, religião, "só feitiço") ou troque/remova.`);
    r.feiticos.filter((x) => !x.auto && x.grau > r.poder).forEach((x) => A2("alerta", `${x.nome} (grau ${x.grau}) excede o seu Poder (${r.poder}): só é possível aprender feitiços de grau igual ou inferior ao Poder, e ele não tem conjurações.`));
    if (r.mag.livresRestantes > 0) A2("nota", `Descobrir uma tradição concede um feitiço de grau 0 dela${truque ? " (e o Truque, mais um)" : ""}: ainda há ${r.mag.livresRestantes} feitiço(s) de grau 0 gratuito(s) a aprender.`);
    if (r.mag.grants.some((g) => g.rel) && !c.religiao) A2("nota", "Há concessões de magia ligadas à religião: escolha a religião na janela de Magia para filtrar as tradições.");
    if (r.mag.trevasN) A2("nota", `Magia das trevas: ${r.mag.trevasN} feitiço(s) aprendido(s). Cada um concede 1 dádiva em rolagens de desafio para evitar Insanidade; confira se a Corrupção foi atualizada.`);
    if (r.armInsuf) A2("alerta", `Armadura (${arm.nome}) exige Força ${arm.req}: você sofre 1 revés em rolagens de Força e Agilidade e −2 de Velocidade.`);
    (c.armas || []).forEach((a) => { if (!r.reqArma(a)) A2("alerta", `${a.nome}: requisito de Força/Agilidade não cumprido (1 revés nos ataques).`); });
    if (c.escudo) { const e2 = S.byId(S.armas, c.escudo); if (e2 && !r.reqArma(e2)) A2("alerta", `${e2.nome}: requisito de Força não cumprido.`); }
    for (const b of r.ben) { const n = (c.picks[b.chave] || []).length; if (b.esc && n > b.esc) A2("alerta", `${b.fonte}: ${n} atributos marcados, mas só ${b.esc} contam; os demais são ignorados.`); }
    for (const e of r.escolhasTal) { const n = (c.talEsc[e.chave] || []).length; if (n > e.max) A2("alerta", `${e.nome} (${e.fonte}): ${n} escolhas marcadas, mas o limite é ${e.max}; as extras são ignoradas.`); }
    [["novato", 1, "Novato"], ["especialista", 3, "Especialista"], ["mestre", 7, "Mestre"]].forEach(([tier, min, nm]) => { if (c.trilhas[tier] && nivel < min) A2("nota", `Trilha de ${nm} escolhida: os benefícios começam no nível ${min} (o nível atual é ${nivel}).`); });
    if (nivel >= 3 && !c.trilhas.especialista) A2("nota", "Nível 3 ou superior sem trilha de Especialista escolhida.");
    if (nivel >= 7 && !c.trilhas.mestre) A2("nota", "Nível 7 ou superior sem trilha de Mestre (ou especialista secundária) escolhida.");
    if (nivel >= 1 && !c.trilhas.novato) A2("nota", "Sem trilha de Novato escolhida.");
    if (!c.anc) A2("nota", "Ancestralidade não escolhida.");
    r.avisos = av;
    return r;
  };

  /* ---------- Dados ---------- */
  const d = (n) => 1 + Math.floor(Math.random() * n);
  S.dados = {
    d, // rolagem simples
    expr(txt) {
      const t = txt.replace(/\s+/g, "").toLowerCase().replace(/−/g, "-");
      if (!/^[+-]?(\d*d\d+|\d+)([+-](\d*d\d+|\d+))*$/.test(t)) return null;
      const partes = t.match(/[+-]?(\d*d\d+|\d+)/g); let total = 0; const det = []; const dados = [];
      for (const p of partes) {
        const s = p.startsWith("-") ? -1 : 1; const q = p.replace(/^[+-]/, "");
        if (q.includes("d")) {
          const [nn, ff] = q.split("d"); const n = +nn || 1, f = +ff; if (n > 100 || f > 1000) return null;
          const rs = Array.from({ length: n }, () => d(f)); const sub = rs.reduce((a, b) => a + b, 0); total += s * sub; rs.forEach((v) => dados.push({ f, v, s }));
          det.push(`${s < 0 ? "−" : ""}${n}d${f} [${rs.join(", ")}]`);
        } else { total += s * +q; det.push((s < 0 ? "−" : "") + q); }
      }
      return { total, det: det.join(" + "), dados };
    },
    /* Rolagem de d20 com dádivas/reveses (regra: d6 por dádiva/revés, usa o maior; se anulam 1 a 1). */
    d20({ mod = 0, dadivas = 0, reveses = 0, alvo = null, rotulo = "" }) {
      const liq = dadivas - reveses; const n = Math.abs(liq);
      const base = d(20); const extra = Array.from({ length: n }, () => d(6)); const maior = n ? Math.max(...extra) : 0;
      const total = base + mod + (liq > 0 ? maior : liq < 0 ? -maior : 0);
      return { tipo: "d20", rotulo, base, mod, liq, extra, maior, total, alvo, sucesso: alvo == null ? null : total >= alvo, critico: base === 20, falha: base === 1, quando: Date.now() };
    },
  };
  S.historico = [];
  S.registrar = (r) => { S.historico.unshift(r); S.historico.length = Math.min(S.historico.length, 40); document.dispatchEvent(new CustomEvent("sdl:rolagem", { detail: r })); };
  S.descrever = (r) => {
    if (r.tipo === "expr") return `${r.rotulo ? r.rotulo + ": " : ""}${r.det} = ${r.total}`;
    const ex = r.liq ? ` ${r.liq > 0 ? "+" : "−"} ${r.maior} (${r.liq > 0 ? "dádiva" : "revés"}${Math.abs(r.liq) > 1 ? "s" : ""}: ${r.extra.join(",")})` : "";
    return `${r.rotulo ? r.rotulo + ": " : ""}d20 (${r.base})${r.mod ? " " + S.sinal(r.mod) : ""}${ex} = ${r.total}${r.alvo != null ? ` vs ${r.alvo} → ${r.sucesso ? "SUCESSO" : "FRACASSO"}` : ""}`;
  };
})(window.SDL);
