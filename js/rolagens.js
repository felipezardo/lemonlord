/* Painel de dados e janelas de rolagem contextuais (desafio, ataque, dano). */
(function (S) {
  "use strict";
  const h = S.h;

  /* contador +/- reutilizável */
  function contador(rotulo, ini, min, max, aoMudar) {
    let v = ini; const out = h("output", { class: "cont-v" }, v);
    const set = (n) => { v = Math.max(min, Math.min(max, n)); out.textContent = v; aoMudar && aoMudar(v); };
    const el = h("div", { class: "contador" }, h("span", { class: "cont-r" }, rotulo),
      h("button", { type: "button", class: "btn-icone", "aria-label": "Diminuir " + rotulo, onclick: () => set(v - 1) }, "−"), out,
      h("button", { type: "button", class: "btn-icone", "aria-label": "Aumentar " + rotulo, onclick: () => set(v + 1) }, "+"));
    el.get = () => v; el.set = set; return el;
  }
  S.contador = contador;

  function resultado(r) {
    const cls = r.tipo === "expr" ? "" : r.critico ? "crit" : r.falha ? "falha1" : "";
    return h("div", { class: "resultado " + (r.sucesso === true ? "ok " : r.sucesso === false ? "ruim " : "") + cls },
      h("div", { class: "res-total" }, r.total),
      h("div", { class: "res-det" }, S.descrever(r)),
      r.tipo === "d20" && r.critico ? h("div", { class: "res-nota" }, "20 natural") : null,
      r.tipo === "d20" && r.falha ? h("div", { class: "res-nota" }, "1 natural") : null);
  }

  /* efeitos de talentos aplicáveis: tabela manual (SDL.efeitos) + inferência a partir do texto oficial */
  const NUMP = { um: 1, uma: 1, dois: 2, duas: 2 }, ATRN = { "força": "forca", agilidade: "agilidade", intelecto: "intelecto", vontade: "vontade", "percepção": "percepcao" };
  const cacheEf = new Map();
  function inferir(t) {
    const out = [];
    for (const s of (t.t || "").split(/(?<=[.!?])\s+/)) {
      if (/contra você|ataques? contra|rolagens? de ataque contra/i.test(s) && !/seus ataques/i.test(s)) continue;
      const dg = /(\d)\s*d[áa]divas?|\b(uma|duas)\s+d[áa]divas?/i.exec(s); const dad = dg ? +dg[1] || NUMP[dg[2].toLowerCase()] : 0;
      const temExtra = /dano extra/i.test(s); /* dádiva citada junto de dano extra é condição, não bônus */
      if (dad && !temExtra && /rolagens? de desafio/i.test(s)) { const a = /desafio de (Força|Agilidade|Intelecto|Vontade|Percepção)/i.exec(s); out.push({ quando: "desafio", dadivas: dad, attr: a ? ATRN[a[1].toLowerCase()] : undefined, auto: false, rotulo: t.n }); }
      else if (dad && !temExtra && /ataque/i.test(s) && !/rev[ée]s/i.test(s)) out.push({ quando: "ataque", dadivas: dad, auto: false, rotulo: t.n });
      const ex = /(\d+d\d+)\s+de\s+dano\s+extra|dano extra (?:de )?(\d+d\d+)/i.exec(s); if (ex) out.push({ quando: "dano-arma", extra: ex[1] || ex[2], auto: false, rotulo: t.n });
      else if (/dano extra igual ao seu Poder/i.test(s)) out.push({ quando: "dano-arma", extra: "@poder", auto: false, rotulo: t.n });
    }
    const vistos = new Set(); return out.filter((e) => { const k = e.quando + e.attr + e.extra + e.dadivas; if (vistos.has(k)) return false; vistos.add(k); return true; });
  }
  S.efeitosDe = (t) => { if (S.efeitos[t.n]) return S.efeitos[t.n]; const k = t.n + "|" + (t.t || "").length; if (!cacheEf.has(k)) cacheEf.set(k, inferir(t)); return cacheEf.get(k); };
  function efeitosAtivos(calc, quando, attr) {
    const lista = [];
    for (const t of calc.tal) for (const e of S.efeitosDe(t)) {
      if (e.quando !== quando) continue; if (e.attr && attr && e.attr !== attr) continue;
      lista.push({ ...e, auto: e.auto || !!(calc.efAtivos || {})[t.n], talento: t.n, texto: t.t });
    }
    return lista;
  }

  /* Janela de rolagem contextual */
  S.rolarContexto = function ({ calc, titulo, tipo, attr, arma, alvo, mod, feitico }) {
    const nomeMod = attr ? S.ATR_NOME[attr] || (attr === "percepcao" ? "Percepção" : attr) : "";
    let modBase = mod != null ? mod : attr ? calc.mod(attr) : 0;
    const quandoAtq = tipo === "ataque" ? (arma ? "ataque-arma" : "ataque") : "desafio";
    const efs = efeitosAtivos(calc, quandoAtq, attr).concat(tipo === "ataque" ? efeitosAtivos(calc, "ataque", attr).filter((e) => quandoAtq !== "ataque") : []);
    const dmgEfs = tipo === "ataque" && (arma || feitico) ? efeitosAtivos(calc, "dano-arma") : [];
    const danoFeit = feitico ? ((/(\d+d\d+(?:\s*\+\s*\d+)?)\s+de\s+dano/i.exec(feitico.texto) || [])[1] || "") : "";
    const arma0 = arma || (danoFeit ? { nome: feitico.nome, dano: danoFeit } : null);
    const marcados = new Set(); const autoDad = efs.filter((e) => e.auto).reduce((a, e) => a + (e.dadivas || 0), 0);
    const cDad = contador("Dádivas", 0, 0, 9), cRev = contador("Reveses", 0, 0, 9);
    const autoRev = []; if (calc.armInsuf && (attr === "forca" || attr === "agilidade")) autoRev.push("Armadura: Força insuficiente (1 revés em rolagens de Força e Agilidade)");
    if (tipo === "ataque" && arma && !calc.reqArma(arma)) autoRev.push("Arma: requisito de Força/Agilidade não cumprido (1 revés)");
    if (tipo === "ataque" && arma && /Incômoda/.test(arma.prop || "")) autoRev.push("Arma incômoda (1 revés)");
    const inBonus = h("input", { type: "number", value: 0, class: "num", "aria-label": "Bônus extra" });
    const inAlvo = h("input", { type: "number", value: alvo != null ? alvo : tipo === "desafio" ? 10 : "", class: "num", placeholder: "—", "aria-label": "Número-alvo" });
    const saida = h("div", { class: "saida", "aria-live": "polite" });
    const toggles = efs.filter((e) => !e.auto).concat(dmgEfs.filter((e) => !e.auto)).map((e, i) => {
      const id = "ef" + i; e._id = id;
      return h("label", { class: "check", title: e.texto || "" }, h("input", { type: "checkbox", onchange: (ev) => (ev.target.checked ? marcados.add(id) : marcados.delete(id)) }), e.rotulo || e.talento);
    });
    const autos = autoRev.map((t) => h("li", {}, t)).concat(efs.filter((e) => e.auto).concat(dmgEfs.filter((e) => e.auto)).map((e) => h("li", {}, `${e.talento}: ${e.dadivas ? e.dadivas + " dádiva" : ""}${e.extra ? "+" + e.extra + " dano" : ""}`)));
    let ultimo = null;

    const rolarAtq = () => {
      let dad = cDad.get() + autoDad, ext = [];
      for (const e of efs) if (!e.auto && marcados.has(e._id)) { dad += e.dadivas || 0; if (e.extra) ext.push(e.extra); }
      const r = S.dados.d20({ mod: modBase + (+inBonus.value || 0), dadivas: dad, reveses: cRev.get() + autoRev.length, alvo: inAlvo.value === "" ? null : +inAlvo.value, rotulo: titulo });
      r.extraAtq = ext; ultimo = r; S.registrar(r);
      saida.replaceChildren(resultado(r));
      if (tipo === "ataque" && arma0) saida.append(h("button", { class: "btn primario", onclick: rolarDano }, "Rolar dano"));
    };
    const rolarDano = () => {
      let partes = [arma0.dano.replace(/\s/g, "")]; const nomes = [];
      const ex1 = (e) => (e.extra === "@poder" ? String(calc.poder || 0) : e.extra);
      for (const e of dmgEfs) if (e.extra && (e.auto || marcados.has(e._id))) { partes.push(ex1(e)); nomes.push(e.talento); }
      for (const e of efs) if (!e.auto && marcados.has(e._id) && e.extra && e.quando.startsWith("ataque")) { partes.push(ex1(e)); nomes.push(e.talento); }
      const ex = S.dados.expr(partes.join("+")); if (!ex) return;
      const r = { tipo: "expr", rotulo: "Dano — " + arma0.nome, total: ex.total, det: ex.det, quando: Date.now() }; S.registrar(r);
      saida.append(h("div", { class: "dano-res" }, resultado(r), nomes.length ? h("small", {}, "Inclui: " + nomes.join(", ")) : null));
    };
    const corpo = h("div", { class: "rolagem" },
      h("p", { class: "dica" }, tipo === "ataque" ? "Rolagem de ataque (d20 + modificador contra a Defesa ou atributo do alvo)." : "Rolagem de desafio (d20 + modificador; número-alvo padrão 10)."),
      h("div", { class: "linha" }, h("label", {}, "Modificador" + (nomeMod ? " de " + nomeMod : ""), h("input", { type: "number", class: "num", value: modBase, onchange: (e) => (modBase = +e.target.value || 0) })),
        h("label", {}, "Bônus extra", inBonus), h("label", {}, "Número-alvo", inAlvo)),
      h("div", { class: "linha" }, cDad, cRev),
      autos.length ? h("div", { class: "auto-lista" }, h("strong", {}, "Aplicado automaticamente"), h("ul", {}, autos)) : null,
      toggles.length ? h("fieldset", { class: "condicoes" }, h("legend", {}, "Situações e talentos opcionais"), toggles) : null,
      saida);
    S.modal({ titulo, corpo, largura: "md", acoes: [{ texto: "Fechar" }, { texto: "Rolar d20", classe: "primario", manter: true, fn: rolarAtq }] });
  };

  /* Painel lateral de dados */
  S.painelDados = function () {
    const lista = h("ol", { class: "hist" });
    const atualizar = () => lista.replaceChildren(...S.historico.slice(0, 15).map((r) => h("li", { class: r.sucesso === true ? "ok" : r.sucesso === false ? "ruim" : "" }, h("b", {}, r.total), " ", h("span", {}, S.descrever(r)))));
    const saida = h("div", { class: "saida" });
    const mostrar = (r) => { S.registrar(r); saida.replaceChildren(resultado(r)); };
    const rapido = (txt) => { const ex = S.dados.expr(txt); mostrar({ tipo: "expr", rotulo: txt, ...ex, quando: Date.now() }); };
    const inExpr = h("input", { type: "text", class: "expr", placeholder: "ex.: 2d6+3", "aria-label": "Expressão de dados", autocomplete: "off",
      onkeydown: (e) => { if (e.key === "Enter") go(); } });
    const go = () => { const ex = S.dados.expr(inExpr.value); if (!ex) { S.toast("Expressão inválida. Use algo como 2d6+3 ou d20-1."); return; } mostrar({ tipo: "expr", rotulo: inExpr.value, ...ex, quando: Date.now() }); };
    const cD = contador("Dádivas", 0, 0, 9), cR = contador("Reveses", 0, 0, 9);
    const inMod = h("input", { type: "number", class: "num", value: 0, "aria-label": "Modificador" }), inAlvo = h("input", { type: "number", class: "num", placeholder: "—", "aria-label": "Número-alvo" });
    const corpo = h("div", { class: "painel-dados" },
      h("div", { class: "rapidos" }, ["d20", "d6", "2d6", "3d6", "d3"].map((t) => h("button", { class: "btn dado", onclick: () => rapido(t) }, t))),
      h("div", { class: "linha" }, inExpr, h("button", { class: "btn primario", onclick: go }, "Rolar")),
      h("fieldset", { class: "condicoes" }, h("legend", {}, "d20 com dádivas e reveses"),
        h("div", { class: "linha" }, h("label", {}, "Mod.", inMod), h("label", {}, "Alvo", inAlvo)), h("div", { class: "linha" }, cD, cR),
        h("button", { class: "btn primario", onclick: () => mostrar(S.dados.d20({ mod: +inMod.value || 0, dadivas: cD.get(), reveses: cR.get(), alvo: inAlvo.value === "" ? null : +inAlvo.value, rotulo: "d20" })) }, "Rolar d20")),
      saida, h("h3", {}, "Histórico"), lista);
    const sync = () => atualizar(); document.addEventListener("sdl:rolagem", sync); atualizar();
    S.modal({ titulo: "Dados", corpo, largura: "md", aoFechar: () => document.removeEventListener("sdl:rolagem", sync) });
  };
})(window.SDL);
