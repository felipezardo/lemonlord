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
      h("header", { class: "modal-topo" }, h("h2", {}, titulo), h("button", { class: "btn-icone", "aria-label": "Fechar", onclick: fechar }, "✕")),
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
  const SOL = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></g></svg>';
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
        equip: [], dinheiro: { co: 0, xp: 0, cc: 0 }, magias: [], tradicoes: [], talEsc: {}, religiao: "", conj: {}, notasTal: {}, dano: 0, insanidade: 0, corrupcao: 0, aflicoes: [], bonus: {}, notas: "", usados: {} };
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
    const r = { escolhasTal: [], feitAuto: [], anc, nivel, atrs: {}, car: { vida: 0, defesa: 0, percepcao: 0, velocidade: 0, poder: 0, cura: 0, tamanho: 0, corrupcao: 0, insanidade: 0 }, ben: [], tal: [], pend: [], idiomas: [] };
    const ben = [];
    const trilhaDe = (tier) => S.byId(S.trilhas, c.trilhas[tier]);
    for (const tier of ["novato", "especialista", "mestre"]) {
      const t = trilhaDe(tier); if (!t) continue;
      for (const k of Object.keys(t.niv).map(Number).sort((a, b) => a - b)) {
        if (k > nivel) continue;
        const lv = t.niv[k]; ben.push({ chave: t.id + ":" + k, fonte: `${t.nome} — nível ${k}`, trilha: t, nivel: k, esc: lv.esc, car: lv.car, idi: lv.idi, tal: lv.tal, mag: lv.mag, feit: lv.feit });
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
    r.velocidade = (anc ? anc.velocidade : 10) + K.velocidade + (B.velocidade || 0);
    const tam = anc ? (c.ancEsc.tamanho || anc.tamanho[anc.tamanho.length - 1]) : "1";
    r.tamanho = tam;
    r.poder = K.poder + poderExtra + (B.poder || 0);
    r.insanidade = +c.insanidade || 0; r.corrupcao = +c.corrupcao || 0;
    r.dano = Math.min(+c.dano || 0, r.vida);
    r.estado = r.dano >= r.vida ? "incapacitado" : r.dano >= r.vida / 2 ? "ferido" : "";
    // magia
    const obrig = grants.reduce((a, g) => a + (g.obrig || 0), 0), escT = grants.reduce((a, g) => a + (g.esc || 0), 0), escNS = grants.reduce((a, g) => a + (g.solo ? 0 : g.esc || 0), 0);
    const mg = c.magias || [], truque = c.trilhas.novato === "magista" && nivel >= 1;
    r.mag = { grants, total: obrig + escT, maxTrad: obrig + escNS, usado: c.tradicoes.length + mg.filter((m) => !m.livre).length, truque, livresUsados: mg.filter((m) => m.livre).length, livres: truque ? c.tradicoes.length : 0 };
    if (r.mag.total > r.mag.usado) r.pend.push({ chave: "magia", falta: r.mag.total - r.mag.usado, fonte: "Magia (tradições e feitiços)", magia: true });
    r.feiticos = mg.map((m) => ({ ...(m.id ? (S.feiticos.find((x) => x.id === m.id) || {}) : m), uid: m.uid, livre: m.livre })).filter((x) => x.nome);
    r.feitAuto.forEach((id) => { const f2 = S.feiticosTrilha.find((x) => x.id === id); if (f2 && !r.feiticos.some((x) => x.id === id)) r.feiticos.push({ ...f2, uid: "auto-" + id, auto: true }); });
    r.casts = (grau) => (grau <= r.poder ? (S.conjuracoes[Math.min(r.poder, 10)] || [])[grau] || 0 : 0);
    r.atrTrad = (t) => { const i = S.tradicoesInfo.find((x) => x.nome === t); return i ? i.atr : "intelecto"; };
    r.mod = (k) => (k === "percepcao" ? r.percepcao - 10 : A[k] ? A[k].m : 0);
    return r;
  };

  /* ---------- Dados ---------- */
  const d = (n) => 1 + Math.floor(Math.random() * n);
  S.dados = {
    d, // rolagem simples
    expr(txt) {
      const t = txt.replace(/\s+/g, "").toLowerCase().replace(/−/g, "-");
      if (!/^[+-]?(\d*d\d+|\d+)([+-](\d*d\d+|\d+))*$/.test(t)) return null;
      const partes = t.match(/[+-]?(\d*d\d+|\d+)/g); let total = 0; const det = [];
      for (const p of partes) {
        const s = p.startsWith("-") ? -1 : 1; const q = p.replace(/^[+-]/, "");
        if (q.includes("d")) {
          const [nn, ff] = q.split("d"); const n = +nn || 1, f = +ff; if (n > 100 || f > 1000) return null;
          const rs = Array.from({ length: n }, () => d(f)); const sub = rs.reduce((a, b) => a + b, 0); total += s * sub;
          det.push(`${s < 0 ? "−" : ""}${n}d${f} [${rs.join(", ")}]`);
        } else { total += s * +q; det.push((s < 0 ? "−" : "") + q); }
      }
      return { total, det: det.join(" + ") };
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
