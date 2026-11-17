/* Tela da ficha: reproduz o layout da p. 273 e aplica automaticamente ancestralidade, trilhas, equipamento e talentos. */
(function (S) {
  "use strict";
  const h = S.h, W = 935, H = 1210;
  const TIERS = [["novato", "Novato", 1], ["especialista", "Especialista", 3], ["mestre", "Mestre", 7]];
  const pct = (x0, y0, x1, y1) => ({ left: (x0 / W) * 100 + "%", top: (y0 / H) * 100 + "%", width: ((x1 - x0) / W) * 100 + "%", height: ((y1 - y0) / H) * 100 + "%" });
  const circ = (cx, cy, d, cls, ...k) => h("div", { class: "circ " + cls, style: { left: ((cx - d / 2) / W) * 100 + "%", top: ((cy - d / 2) / H) * 100 + "%", width: (d / W) * 100 + "%" } }, ...k);
  const numIn = (v, fn, o = {}) => h("input", { type: "number", class: "num-in", value: v, min: o.min, max: o.max, "aria-label": o.rotulo, onchange: (e) => fn(+e.target.value || 0) });

  S.telaFicha = function (root, id) {
    const f = S.fichas.obter(id);
    if (!f) { location.hash = "#/"; return; }
    let calc;
    const salvar = () => S.fichas.salvar(f);
    const render = () => { const y = scrollY; calc = S.calcular(f); root.replaceChildren(montar()); salvar(); scrollTo(0, y); };
    const mut = (fn) => { fn(); render(); };

    /* ---------- modais ---------- */
    const fonteTag = (x) => (x.fonte && x.fonte !== "Livro Básico" ? h("small", { class: "fonte" }, "Fonte: " + x.fonte) : null);
    const carTxt = (car) => Object.entries(car || {}).map(([k, v]) => `${({ vida: "Vida", defesa: "Defesa", percepcao: "Percepção", velocidade: "Velocidade", poder: "Poder", cura: "Taxa de Cura", corrupcao: "Corrupção", insanidade: "Insanidade", tamanho: "Tamanho" })[k] || k} ${S.sinal(v)}`).join(", ");

    function modalAncestralidade() {
      let fecha;
      const escolher = (a) => { mut(() => { f.anc = a.id; f.ancEsc = {}; f.corrupcao = a.corrupcao; f.insanidade = a.insanidade; }); fecha(); setTimeout(modalEscolhas, 200); };
      const detalhe = (a) => S.modal({ titulo: a.nome, largura: "md", corpo: h("div", {}, fonteTag(a), h("p", {}, a.desc),
        h("p", { class: "dica" }, `Força ${a.atr.forca} · Agilidade ${a.atr.agilidade} · Intelecto ${a.atr.intelecto} · Vontade ${a.atr.vontade} · Velocidade ${a.velocidade} · Tamanho ${a.tamanho.join(" ou ")}`),
        h("h3", {}, "Idiomas e profissões"), h("p", {}, a.idiomas), a.talentos.map((t) => h("div", {}, h("h3", {}, t.n), h("p", { class: "texto-feit" }, t.t))),
        h("h3", {}, "Nível 4 — " + carTxt(a.nivel4.car)), h("p", {}, a.nivel4.escolha), h("h3", {}, a.nivel4.talento.n), h("p", { class: "texto-feit" }, a.nivel4.talento.t)),
        acoes: [{ texto: "Fechar" }, { texto: "Escolher " + a.nome, classe: "primario", fn: () => escolher(a) }] });
      fecha = S.modal({ titulo: "Ancestralidade", largura: "lg", corpo: h("div", { class: "cards uniforme" }, S.ancestralidades.map((a) =>
        h("div", { class: "card-op card-uni" + (f.anc === a.id ? " sel" : ""), role: "button", tabindex: "0", "aria-label": "Ver detalhes de " + a.nome, onclick: () => detalhe(a), onkeydown: (e) => { if (e.key === "Enter" && e.target === e.currentTarget) detalhe(a); } }, h("strong", {}, a.nome), fonteTag(a), h("span", { class: "teaser" }, a.desc),
          h("small", {}, `For ${a.atr.forca} · Agi ${a.atr.agilidade} · Int ${a.atr.intelecto} · Von ${a.atr.vontade}`),
          h("div", { class: "card-acoes" }, h("button", { class: "btn peq", onclick: (e) => { e.stopPropagation(); detalhe(a); } }, "Detalhes"), h("button", { class: "btn peq primario", onclick: (e) => { e.stopPropagation(); escolher(a); } }, f.anc === a.id ? "Escolhida" : "Escolher"))))) });
    }

    /* Trilhas: lista de cartões uniformes (nome + resumo curto) e tela de detalhes com benefícios recolhíveis */
    function modalTrilha(tier, rotulo) {
      let busca = "", fonte = tier;
      const atual = S.byId(S.trilhas, f.trilhas[tier]);
      if (atual && tier === "mestre" && atual.tier === "especialista") fonte = "especialista";
      const listaV = h("div", { class: "vista-lista" }), detalheV = h("div", { class: "vista-detalhe", hidden: true });
      const grid = h("div", { class: "cards uniforme" });
      let fecha;
      const nota = h("details", { class: "op-tal" }, h("summary", {}, "Regra: trilha de especialista secundária (Cap. 4)"), h("p", { class: "texto-feit peq" }, S.regras.secundaria));
      const abas = tier === "mestre" ? h("div", { class: "grupo-btn" }, [["mestre", "Trilhas de Mestre"], ["especialista", "Especialista secundária"]].map(([v, n]) => h("button", { class: "btn peq" + (fonte === v ? " primario" : ""), "aria-pressed": fonte === v, onclick: (e) => { fonte = v; abas.querySelectorAll("button").forEach((b2) => { const ativo = b2 === e.currentTarget; b2.classList.toggle("primario", ativo); b2.setAttribute("aria-pressed", ativo); }); desenha(); } }, n))) : null;
      const campo = h("input", { type: "search", class: "busca", placeholder: "Buscar trilha…", "aria-label": "Buscar trilha", oninput: (e) => { busca = e.target.value.toLowerCase(); desenha(); } });
      listaV.append(...[abas, tier === "mestre" ? nota : null, campo, h("p", { class: "dica" }, "Toque em uma trilha para ver a descrição completa e os benefícios de cada nível."), grid].filter(Boolean));
      const meta = (t) => { const ks = Object.keys(t.niv).map(Number).sort((a2, b2) => a2 - b2); return `Níveis ${ks.join(" · ")}${ks.some((k) => t.niv[k].mag) ? " · Magia" : ""}`; };
      function desenha() {
        const itens = S.trilhas.filter((t) => t.tier === fonte && t.nome.toLowerCase().includes(busca) && !(fonte === "especialista" && tier === "mestre" && t.id === f.trilhas.especialista));
        grid.replaceChildren(...(itens.length ? itens.map((t) => h("button", { class: "card-op card-uni trilha-card" + (f.trilhas[tier] === t.id ? " sel" : ""), onclick: () => ver(t) },
          h("strong", {}, t.nome), h("small", { class: "meta" }, meta(t)), fonteTag(t), h("span", { class: "teaser" }, t.desc || ""), f.trilhas[tier] === t.id ? h("em", { class: "tag-sel" }, "Escolhida") : null)) : [h("p", { class: "dica" }, "Nenhuma trilha encontrada.")]));
      }
      function ver(t) {
        const niveis = Object.values(t.niv).sort((a2, b2) => a2.n - b2.n);
        const sec = tier === "mestre" && t.tier === "especialista";
        detalheV.replaceChildren(h("div", { class: "detalhe-int" },
          h("button", { class: "btn peq", onclick: () => { detalheV.hidden = true; listaV.hidden = false; } }, "Voltar à lista"),
          h("h3", { class: "det-nome" }, t.nome), fonteTag(t), sec ? h("p", { class: "dica" }, "Secundária: nível 7 = benefícios do nível 3; nível 10 = benefícios do nível 6.") : null,
          h("p", { class: "texto-feit" }, t.desc || ""),
          h("h3", {}, "Benefícios por nível"),
          niveis.map((n, i) => h("details", { class: "nv-det" }, h("summary", {}, h("b", {}, `Nível ${n.n}`), h("span", {}, [carTxt(n.car), n.esc ? `atributos: +1 em ${n.esc}` : "", n.tal.length ? n.tal.map((x) => x.n).join(", ") : ""].filter(Boolean).join(" · "))),
            n.tal.map((x) => h("p", {}, h("b", {}, x.n + ". "), x.t)), n.idi ? h("p", { class: "peq" }, n.idi) : null)),
          h("div", { class: "detalhe-acoes" }, h("button", { class: "btn", onclick: () => { detalheV.hidden = true; listaV.hidden = false; } }, "Voltar"),
            h("button", { class: "btn primario", onclick: () => { mut(() => (f.trilhas[tier] = t.id)); fecha(); setTimeout(modalEscolhas, 200); } }, f.trilhas[tier] === t.id ? "Manter esta trilha" : "Escolher esta trilha"))));
        listaV.hidden = true; detalheV.hidden = false; detalheV.closest(".modal-corpo").scrollTop = 0;
      }
      fecha = S.modal({ titulo: "Trilha de " + rotulo, largura: "lg", corpo: h("div", {}, listaV, detalheV),
        acoes: f.trilhas[tier] ? [{ texto: "Remover trilha", classe: "perigo", fn: () => mut(() => (f.trilhas[tier] = "")) }, { texto: "Fechar" }] : [{ texto: "Fechar" }] });
      desenha();
    }

    function modalEscolhas() {
      const c = S.calcular(f); const box = h("div", { class: "escolhas" });
      const botoesAtr = (sel, max, fn) => h("div", { class: "grupo-btn" }, S.ATR.map(([k, n]) => h("button", { class: "btn peq" + (sel.includes(k) ? " primario" : ""), "aria-pressed": sel.includes(k), onclick: () => { let s = sel.slice(); if (s.includes(k)) s = s.filter((x) => x !== k); else s.push(k); fn(s); redraw(); } }, n)));
      function redraw() {
        const cc = S.calcular(f); box.replaceChildren();
        const anc = cc.anc;
        if (anc && anc.escolhaAtributo) box.append(h("section", {}, h("h3", {}, anc.nome + ": +1 em um atributo"), botoesAtr(f.ancEsc.atributo ? [f.ancEsc.atributo] : [], 1, (s) => (f.ancEsc.atributo = s[0]))));
        if (anc && anc.tamanho.length > 1) box.append(h("section", {}, h("h3", {}, "Tamanho"), h("div", { class: "grupo-btn" }, anc.tamanho.map((t) => h("button", { class: "btn peq" + ((f.ancEsc.tamanho || anc.tamanho[anc.tamanho.length - 1]) === t ? " primario" : ""), onclick: () => { f.ancEsc.tamanho = t; redraw(); } }, t)))));
        const odio = anc && anc.talentos.find((t) => t.escolha);
        if (odio) box.append(h("section", {}, h("h3", {}, odio.escolha.rotulo), h("select", { onchange: (e) => (f.ancEsc.odio = e.target.value) }, h("option", { value: "" }, "—"), odio.escolha.opcoes.map((o) => h("option", { value: o, selected: f.ancEsc.odio === o }, o)))));
        const sel = (v) => h("select", { onchange: (e) => { f.ajuste[v] = e.target.value; redraw(); } }, h("option", { value: "" }, "—"), S.ATR.map(([k, n]) => h("option", { value: k, selected: f.ajuste[v] === k }, n)));
        box.append(h("section", {}, h("h3", {}, "Ajuste de atributos (uma vez)"), h("p", { class: "dica" }, "Aumente um valor em 1 diminuindo outro em 1."), h("div", { class: "linha" }, h("label", {}, "+1 em ", sel("mais")), h("label", {}, "−1 em ", sel("menos")))));
        for (const b of cc.ben) {
          if (b.esc) box.append(h("section", {}, h("h3", {}, b.fonte), h("p", { class: "dica" }, `Aumente ${b.esc} atributo${b.esc > 1 ? "s" : ""} em 1 (escolha ${b.esc} diferentes; se marcar mais, o site apenas avisa).`), botoesAtr(f.picks[b.chave] || [], b.esc, (s) => (f.picks[b.chave] = s))));
          if (b.chave === "anc:4") box.append(h("section", {}, h("h3", {}, b.fonte), h("p", { class: "dica" }, b.ancEscolha), h("div", { class: "grupo-btn" },
            [["talento", "Ganhar o talento"], ["feitico", "Aprender um feitiço"]].map(([v, n]) => h("button", { class: "btn peq" + ((f.escolhas["anc:4"] || "talento") === v ? " primario" : ""), onclick: () => { f.escolhas["anc:4"] = v; redraw(); } }, n)))));
        }
        const secT = S.byId(S.trilhas, f.trilhas.mestre);
        if (secT && secT.tier === "especialista" && f.trilhas.especialista) box.append(h("section", {}, h("h3", {}, "Nível 9 (trilha secundária)"), h("p", { class: "dica" }, "Você ganha os benefícios de nível 9 de uma das suas trilhas de especialista."),
          h("div", { class: "grupo-btn" }, [["primaria", S.byId(S.trilhas, f.trilhas.especialista).nome], ["secundaria", secT.nome]].map(([v, n]) => h("button", { class: "btn peq" + ((f.escolhas.sec9 || "primaria") === v ? " primario" : ""), onclick: () => { f.escolhas.sec9 = v; redraw(); } }, n)))));
        for (const d of cc.dups) box.append(h("section", {}, h("h3", {}, `Talento repetido: ${d.nome}`), h("p", { class: "dica" }, "Você já possui este talento (vindo da trilha secundária). Escolha uma opção:"),
          h("div", { class: "grupo-btn" }, [["atributo", "+1 em um atributo e uma profissão"], ["tradicao", "Descobrir uma tradição"], ["feitico", "Aprender um feitiço"]].map(([v, n]) => h("button", { class: "btn peq" + (d.escolha === v ? " primario" : ""), onclick: () => { f.escolhas[d.chave] = v; redraw(); } }, n))),
          d.escolha === "atributo" ? botoesAtr(f.picks[d.chave] || [], 1, (s2) => (f.picks[d.chave] = s2)) : null));
        for (const e of cc.escolhasTal) {
          const sel = f.talEsc[e.chave] || [];
          box.append(h("section", {}, h("h3", {}, `${e.nome} — ${e.fonte}`), h("p", { class: "dica" }, `Escolha ${e.max} (${sel.length}/${e.max}).`),
            S.talentosEscolha[e.kind].map((o) => h("details", { class: "op-tal" }, h("summary", {}, h("button", { class: "btn peq" + (sel.includes(o.n) ? " primario" : ""), "aria-pressed": sel.includes(o.n), onclick: (ev) => { ev.preventDefault(); let s2 = sel.slice(); if (s2.includes(o.n)) s2 = s2.filter((x) => x !== o.n); else s2.push(o.n); f.talEsc[e.chave] = s2; redraw(); } }, o.n)), h("p", { class: "peq" }, o.t)))));
        }
        if (cc.mag.total || cc.mag.usado) box.append(h("section", {}, h("h3", {}, "Magia"), h("p", { class: "dica" }, `Tradições e feitiços: ${cc.mag.usado}/${cc.mag.total} escolhas feitas.`), h("button", { class: "btn peq primario", onclick: () => modalMagia() }, "Abrir Magia")));
        if (!box.children.length) box.append(h("p", {}, "Nenhuma escolha disponível ainda."));
      }
      redraw();
      S.modal({ titulo: "Escolhas de personagem", corpo: box, largura: "lg", aoFechar: render, acoes: [{ texto: "Concluir", classe: "primario" }] });
    }

    function modalProfissao() {
      let cat = Object.keys(S.profissoes)[0], busca = ""; const lista = h("div", { class: "cards peq" });
      const add = (n) => { mut(() => f.profissoes.push(n)); S.toast("Profissão adicionada: " + n); };
      const livre = h("input", { type: "text", placeholder: "Profissão personalizada ou especialização", "aria-label": "Profissão personalizada" });
      function desenha() {
        lista.replaceChildren(...S.profissoes[cat].filter((p) => p.toLowerCase().includes(busca)).map((p) => { const tem = f.profissoes.includes(p); return h("button", { class: "card-op" + (tem ? " sel" : ""), "aria-pressed": tem, onclick: () => { if (/\(escolha/.test(p)) { livre.value = p.replace(/\s*\(.*\)/, "") + ": "; livre.focus(); } else if (tem) { mut(() => (f.profissoes = f.profissoes.filter((x) => x !== p))); desenha(); } else { add(p); desenha(); } } }, p, tem ? h("small", {}, "adicionada — clique para remover") : null); }));
      }
      S.modal({ titulo: "Adicionar profissão", largura: "lg", corpo: h("div", {},
        h("div", { class: "grupo-btn" }, Object.keys(S.profissoes).map((k) => h("button", { class: "btn peq", onclick: (e) => { cat = k; [...e.target.parentNode.children].forEach((b) => b.classList.toggle("primario", b === e.target)); desenha(); } }, k))),
        h("input", { type: "search", class: "busca", placeholder: "Buscar…", oninput: (e) => { busca = e.target.value.toLowerCase(); desenha(); } }), lista,
        h("div", { class: "linha" }, livre, h("button", { class: "btn primario", onclick: () => livre.value.trim() && add(livre.value.trim()) }, "Adicionar"))) });
      desenha();
    }

    function modalEquip(aba = "Armas") {
      const corpo = h("div", {}); const act = (fn) => { mut(fn); desenha(); }; const abas = ["Armas", "Armaduras", "Escudos", "Itens", "Personalizado"]; let busca = "";
      const fecha = S.modal({ titulo: "Equipamento", corpo, largura: "lg" });
      const aviso = (req) => { const m = /(\d+)/.exec(req || ""); if (m && calc.atrs.forca.v < +m[1] && !/Agilidade/.test(req)) S.toast(`Atenção: requer Força ${m[1]}+ (você tem ${calc.atrs.forca.v}).`); };
      const linha = (titulo, sub, botao) => h("div", { class: "item-cat" }, h("div", {}, h("strong", {}, titulo), h("small", {}, sub)), botao);
      function desenha() {
        const q = busca.toLowerCase(); let lista = [];
        if (aba === "Armas") lista = S.armas.filter((a) => a.cat !== "Escudo" && a.nome.toLowerCase().includes(q)).map((a) => linha(a.nome, `${a.dano} · ${a.maos} · ${a.prop} · ${a.preco} · disp. ${a.disp} · ${a.cat}${a.req ? " · requer " + a.req : ""}`, h("button", { class: "btn peq", onclick: () => { aviso(a.req); act(() => f.armas.push({ uid: S.uid(), id: a.id, nome: a.nome, dano: a.dano, prop: a.prop, cat: a.cat })); S.toast("Arma adicionada"); } }, "Adicionar")));
        if (aba === "Armaduras") lista = S.armaduras.map((a) => linha(a.nome, `${a.tipo} · Defesa ${a.def != null ? a.def : "Agilidade" + (a.bonus ? " +" + a.bonus : "")} · ${a.preco} · disp. ${a.disp}${a.req ? " · requer Força " + a.req + "+" : ""}`, h("button", { class: "btn peq" + (f.armadura === a.id ? " primario" : ""), onclick: () => { aviso("Força " + a.req); act(() => (f.armadura = f.armadura === a.id ? "" : a.id)); } }, f.armadura === a.id ? "Tirar" : "Vestir")));
        if (aba === "Escudos") lista = [linha("Sem escudo", f.escudo ? "" : "Nenhum escudo equipado", h("button", { class: "btn peq", disabled: !f.escudo, onclick: () => act(() => (f.escudo = "")) }, "Sem escudo"))].concat(S.armas.filter((a) => a.cat === "Escudo").map((a) => linha(a.nome, `${a.prop} · ${a.preco}`, h("button", { class: "btn peq" + (f.escudo === a.id ? " primario" : ""), onclick: () => { act(() => (f.escudo = f.escudo === a.id ? "" : a.id)); } }, f.escudo === a.id ? "Retirar" : "Equipar"))));
        if (aba === "Itens") lista = S.itens.filter((i) => i.nome.toLowerCase().includes(q)).map((i) => linha(i.nome, [i.cat, i.preco, i.disp].filter(Boolean).join(" · ") + (i.desc ? " — " + i.desc : ""), h("button", { class: "btn peq", onclick: () => { act(() => { const e = f.equip.find((x) => x.nome === i.nome); if (e) e.qtd++; else f.equip.push({ uid: S.uid(), nome: i.nome, qtd: 1 }); }); S.toast("Item adicionado"); } }, "Adicionar")));
        if (aba === "Personalizado") {
          const n = h("input", { type: "text", placeholder: "Nome" }), d = h("input", { type: "text", placeholder: "Dano (ex.: 1d6+1) — vazio para item comum" });
          lista = [h("div", { class: "form-col" }, n, d, h("button", { class: "btn primario", onclick: () => { if (!n.value.trim()) return; const dm = d.value.trim(); if (dm && !S.dados.expr(dm)) return S.toast("Dano inválido"); act(() => (dm ? f.armas.push({ uid: S.uid(), nome: n.value.trim(), dano: dm, prop: "", cat: "Personalizada" }) : f.equip.push({ uid: S.uid(), nome: n.value.trim(), qtd: 1 }))); n.value = d.value = ""; } }, "Adicionar"))];
        }
        corpo.replaceChildren(h("div", { class: "grupo-btn" }, abas.map((a) => h("button", { class: "btn peq" + (a === aba ? " primario" : ""), onclick: () => { aba = a; desenha(); } }, a))),
          ["Armas", "Itens"].includes(aba) ? h("input", { type: "search", class: "busca", placeholder: "Buscar…", value: busca, oninput: (e) => { busca = e.target.value; desenha(); document.querySelector(".busca").focus(); } }) : null, h("div", { class: "lista-cat" }, lista));
      }
      desenha();
    }

    function modalTalento(t) {
      S.modal({ titulo: t.n, largura: "md", aoFechar: salvar, corpo: h("div", {}, h("p", { class: "dica" }, t.fonte), h("p", { class: "texto-feit" }, t.t), /descanso/i.test(t.t) ? h("div", { class: "usos-linha" }, h("span", {}, "Usos (restaurados no descanso)"), marcasUso({ max: usosMax(t), obter: () => usosGet(t.n), definir: (v) => (f.usados[t.n] = v), rotulo: t.n })) : null, (() => { const ef = S.efeitosDe(t).filter((e) => !e.auto), bn = t.bonus || []; const bl = [];
          if (ef.length) bl.push(h("label", { class: "check" }, h("input", { type: "checkbox", checked: !!f.efAtivos[t.n], onchange: (e) => (f.efAtivos[t.n] = e.target.checked) }), `Aplicar sempre nas rolagens (${ef.map((e) => e.quando.replace("-arma", " com arma") + (e.dadivas ? " +" + e.dadivas + " dádiva" : "") + (e.extra ? " +" + e.extra.replace("@poder", "Poder") + " dano" : "")).join("; ")})`));
          if (bn.length) bl.push(h("label", { class: "check" }, h("input", { type: "checkbox", checked: !!f.bonusAtivo[t.n], onchange: (e) => (f.bonusAtivo[t.n] = e.target.checked) }), `Aplicar bônus à ficha: ${bn.map((b) => b.k + " +" + b.v).join(", ")}`));
          return bl.length ? h("fieldset", { class: "condicoes" }, h("legend", {}, "Automação opcional"), bl) : null; })(),
          h("label", { class: "form-col" }, "Anotações (escolhas, tradição do Ícone da Fé…)", h("textarea", { rows: 2, oninput: (e) => (f.notasTal[t.n] = e.target.value) }, f.notasTal[t.n] || ""))), acoes: t.custom ? [{ texto: "Remover", classe: "perigo", fn: () => mut(() => (f.talentosExtra = f.talentosExtra.filter((x) => x.n !== t.n))) }, { texto: "Fechar" }] : [{ texto: "Fechar" }] });
    }
    function modalNovoTalento() {
      const n = h("input", { type: "text", placeholder: "Nome do talento" }), t = h("textarea", { rows: 4, placeholder: "Descrição" });
      S.modal({ titulo: "Talento personalizado", corpo: h("div", { class: "form-col" }, n, t), acoes: [{ texto: "Cancelar" }, { texto: "Adicionar", classe: "primario", fn: () => { if (!n.value.trim()) return false; mut(() => f.talentosExtra.push({ n: n.value.trim(), t: t.value.trim() })); } }] });
    }

    /* ---------- Magia ---------- */
    function modalFeitico(sp, aoMudar) {
      const c = S.calcular(f), chave = sp.uid || sp.id, tot = c.casts(sp.grau), gasto = f.conj[chave] || 0;
      const atr = sp.atr || c.atrTrad(sp.trad), nomeAtr = S.ATR_NOME[atr];
      const info = h("p", { class: "dica" });
      const atualiza = () => { const g = f.conj[chave] || 0; info.textContent = `Conjurações restantes: ${Math.max(0, tot - g)} de ${tot} · ${sp.tipo || "Feitiço"} de ${sp.trad === "Trilha" ? "trilha (" + (sp.origem || "") + ")" : sp.trad} · grau ${sp.grau} · ${nomeAtr}`; };
      atualiza();
      S.modal({ titulo: sp.nome, largura: "md", aoFechar: () => { salvar(); aoMudar && aoMudar(); render(); }, corpo: h("div", {}, info, h("p", { class: "texto-feit" }, sp.texto || "(feitiço personalizado)")),
        acoes: [{ texto: "Fechar" },
          { texto: "Recuperar 1", manter: true, fn: () => { f.conj[chave] = Math.max(0, (f.conj[chave] || 0) - 1); atualiza(); } },
          { texto: "Gastar conjuração", manter: true, fn: () => { if ((f.conj[chave] || 0) >= tot) { S.toast("Sem conjurações restantes (Poder " + c.poder + ")."); return; } f.conj[chave] = (f.conj[chave] || 0) + 1; atualiza(); } },
          sp.tipo === "Ataque" ? { texto: "Rolar ataque", classe: "primario", manter: true, fn: () => S.rolarContexto({ calc: S.calcular(f), titulo: "Conjurar — " + sp.nome, tipo: "ataque", attr: atr, feitico: sp }) } : null].filter(Boolean) });
    }

    function listaAvisos(avs, vazio = "Nenhum aviso.") {
      const rot = { alerta: "Alerta", nota: "Nota", pendente: "Pendente" };
      return avs.length ? h("ul", { class: "avisos" }, avs.map((a) => h("li", { class: "aviso " + a.n }, h("b", {}, rot[a.n]), a.t))) : h("p", { class: "dica" }, vazio);
    }
    function modalAvisos() {
      S.modal({ titulo: "Avisos e notas", largura: "md", corpo: h("div", {}, h("p", { class: "dica" }, "O site não bloqueia nenhuma escolha: ele apenas avisa quando algo parece fora das regras do livro, para você (e o Mestre) decidirem."), listaAvisos(calc.avisos, "Tudo em ordem: nenhuma inconsistência encontrada.")) });
    }

    function modalMagia(aba = "Tradições") {
      const corpo = h("div", { class: "magia-ed" }); let busca = "", ftrad = "";
      S.modal({ titulo: "Magia", corpo, largura: "lg", aoFechar: render });
      function desenha() {
        const c = S.calcular(f), M = c.mag;
        const sum = h("div", { class: "mag-sum" }, h("strong", {}, `Poder ${c.poder}`), ` · vagas usadas: ${M.usado}/${M.total}`,
          h("ul", {}, M.grants.map((g) => h("li", {}, `${g.fonte}: ${g.obrig ? "descubra 1 tradição + " : ""}${g.esc ? g.esc + (g.solo ? " feitiço(s)" : " escolha(s) (tradição ou feitiço)") : ""}${g.restr ? " — apenas " + g.restr.join(", ") : ""}${g.rel ? " — tradição da sua religião" : ""}`))),
          h("p", { class: "dica" }, `Descobrir uma tradição concede, além disso, um feitiço de grau 0 dela${M.truque ? " (o Truque do Magista concede mais um)" : ""}. Trocar feitiços: ao aprender um feitiço novo, você pode trocar um já aprendido por outro de mesmo grau ou inferior.`));
        const av = calc ? S.calcular(f).avisos.filter((x) => /magia|feiti|religi|tradi|Poder/i.test(x.t)) : [];
        const rel = M.grants.some((g) => g.rel) ? h("label", { class: "linha-rel" }, "Religião: ", h("select", { onchange: (e) => { f.religiao = e.target.value; desenha(); } }, h("option", { value: "" }, "—"), S.religioes.map((r) => h("option", { value: r[0], selected: f.religiao === r[0] }, `${r[0]} (${r[1].join(", ")})`)))) : null;
        const abas = h("div", { class: "grupo-btn" }, ["Tradições", "Feitiços", "Meus feitiços"].map((a) => h("button", { class: "btn peq" + (a === aba ? " primario" : ""), "aria-pressed": a === aba, onclick: () => { aba = a; desenha(); } }, a)));
        let lista;
        if (aba === "Tradições") {
          lista = h("div", { class: "cards peq" }, S.tradicoesInfo.slice().sort((a, b) => a.nome.localeCompare(b.nome, "pt")).map((t) => {
            const tem = f.tradicoes.includes(t.nome), dela = M.religT && M.religT.includes(t.nome), fora = !tem && !M.cabe({ t: "trad", trad: t.nome, nome: t.nome });
            return h("div", { class: "card-op" + (tem ? " sel" : "") }, h("strong", {}, t.nome),
              h("small", {}, `${S.ATR_NOME[t.atr]}${t.trevas ? " · magia das trevas" : ""}${dela ? " · da sua religião" : ""}`),
              fora ? h("small", { class: "fora" }, "fora das concessões atuais") : null,
              h("button", { class: "btn peq" + (tem ? "" : " primario"), onclick: () => {
                if (tem) f.tradicoes = f.tradicoes.filter((x) => x !== t.nome);
                else { f.tradicoes.push(t.nome); if (t.trevas) { f.corrupcao = (+f.corrupcao || 0) + 1; S.toast("Magia das trevas: +1 Corrupção"); } S.toast("Tradição descoberta: você também aprende um feitiço de grau 0 dela."); }
                desenha(); } }, tem ? "Esquecer" : "Descobrir"));
          }));
        } else if (aba === "Feitiços") {
          const tr = f.tradicoes.slice().sort((a, b) => a.localeCompare(b, "pt")); const q = busca.toLowerCase();
          const itens = S.feiticos.filter((x) => tr.includes(x.trad) && (!ftrad || x.trad === ftrad) && x.nome.toLowerCase().includes(q) && !c.feiticos.some((y) => y.id === x.id));
          lista = h("div", {}, h("div", { class: "linha" }, h("select", { "aria-label": "Tradição", onchange: (e) => { ftrad = e.target.value; desenha(); } }, h("option", { value: "" }, "Todas as tradições descobertas"), tr.map((t) => h("option", { value: t, selected: ftrad === t }, t))),
            h("input", { type: "search", class: "busca", placeholder: "Buscar feitiço…", value: busca, oninput: (e) => { busca = e.target.value; desenha(); const i = document.querySelector(".magia-ed .busca"); i.focus(); i.setSelectionRange(99, 99); } })),
            tr.length ? null : h("p", { class: "dica" }, "Descubra uma tradição primeiro (ou use a aba Meus feitiços para um feitiço personalizado)."),
            h("div", { class: "lista-cat" }, itens.map((x) => {
              const gratis = x.grau === 0 && M.livreDisp(x.trad) > 0, alto = x.grau > c.poder, fora = !gratis && !M.cabe({ t: "spell", trad: x.trad, nome: x.nome });
              return h("div", { class: "item-cat" }, h("div", {}, h("button", { class: "tal-n", onclick: () => modalFeitico(x) }, x.nome),
                h("small", {}, `${x.tipo} · ${x.trad} · grau ${x.grau}`, gratis ? " · gratuito (descoberta da tradição)" : ""), alto ? h("small", { class: "fora" }, `grau acima do seu Poder (${c.poder})`) : null, fora ? h("small", { class: "fora" }, "fora das concessões atuais") : null),
                h("button", { class: "btn peq primario", onclick: () => {
                  f.magias.push({ uid: S.uid(), id: x.id });
                  const l = S.tradicoesInfo.find((t) => t.nome === x.trad);
                  if (l && l.trevas) { const n = f.magias.filter((m) => { const sp = S.feiticos.find((z) => z.id === m.id); return sp && S.tradicoesInfo.find((t) => t.nome === sp.trad).trevas; }).length; const d6 = S.dados.d(6); if (d6 < n) { f.corrupcao = (+f.corrupcao || 0) + 1; S.toast(`Magia das trevas: d6 = ${d6} (< ${n}) → +1 Corrupção`); } else S.toast(`Magia das trevas: d6 = ${d6}; sem Corrupção.`); }
                  desenha(); } }, "Aprender"));
            })));
        } else {
          lista = h("div", { class: "lista-cat" }, c.feiticos.length ? c.feiticos.map((x) => h("div", { class: "item-cat" }, h("div", {}, h("button", { class: "tal-n", onclick: () => modalFeitico(x) }, x.nome), h("small", {}, `${x.tipo || ""} · ${x.trad === "Trilha" ? "trilha" : x.trad} · grau ${x.grau}${x.livre ? " · gratuito (descoberta)" : ""}${x.auto ? " · concedido pela trilha" : ""}`),
            !x.auto && x.grau > c.poder ? h("small", { class: "fora" }, "grau acima do seu Poder") : null, !x.auto && M.fora.some((o) => o.nome === x.nome) ? h("small", { class: "fora" }, "fora das concessões atuais") : null),
            x.auto ? null : h("button", { class: "btn peq perigo", onclick: () => { f.magias = f.magias.filter((m) => m.uid !== x.uid); desenha(); } }, "Trocar / remover"))) : h("p", { class: "dica" }, "Nenhum feitiço aprendido."),
            h("details", {}, h("summary", {}, "Feitiço personalizado"), (() => { const n = h("input", { type: "text", placeholder: "Nome" }), g = h("input", { type: "number", min: 0, max: 10, value: 0 }), t = h("textarea", { rows: 3, placeholder: "Descrição" });
              return h("div", { class: "form-col" }, n, h("label", {}, "Grau", g), t, h("button", { class: "btn", onclick: () => { if (!n.value.trim()) return; f.magias.push({ uid: S.uid(), nome: n.value.trim(), grau: +g.value || 0, trad: "Personalizado", tipo: "Utilitário", texto: t.value }); desenha(); } }, "Adicionar")); })()));
        }
        corpo.replaceChildren(...[sum, av.length ? listaAvisos(av) : null, rel, abas, lista].filter(Boolean));
        salvar();
      }
      desenha();
    }

    function modalAflicoes() {
      S.modal({ titulo: "Aflições", largura: "md", aoFechar: render, corpo: h("div", { class: "checks" }, S.aflicoes.map((a) => h("label", { class: "check" }, h("input", { type: "checkbox", checked: f.aflicoes.includes(a), onchange: (e) => { f.aflicoes = e.target.checked ? f.aflicoes.concat(a) : f.aflicoes.filter((x) => x !== a); } }), a))) });
    }
    function modalAjustes() {
      const campos = [["forca", "Força"], ["agilidade", "Agilidade"], ["intelecto", "Intelecto"], ["vontade", "Vontade"], ["vida", "Vida"], ["defesa", "Defesa"], ["percepcao", "Percepção"], ["velocidade", "Velocidade"], ["poder", "Poder"], ["cura", "Taxa de Cura"]];
      S.modal({ titulo: "Ajustes manuais", largura: "md", aoFechar: render, corpo: h("div", {}, h("p", { class: "dica" }, "Bônus ou penalidades extras (itens mágicos, efeitos do Mestre…), somados ao valor calculado."),
        h("div", { class: "grade-aj" }, campos.map(([k, n]) => h("label", {}, n, h("input", { type: "number", class: "num-in", value: f.bonus[k] || 0, onchange: (e) => (f.bonus[k] = +e.target.value || 0) }))))) });
    }
    function modalNotas() {
      S.modal({ titulo: "Notas", largura: "md", aoFechar: salvar, corpo: h("textarea", { rows: 12, class: "notas", "aria-label": "Notas", oninput: (e) => (f.notas = e.target.value) }, f.notas) });
    }
    function modalDescanso() {
      const aplicar = (x) => mut(() => { f.dano = Math.max(0, f.dano - calc.cura * x); f.usados = {}; f.conj = {}; S.toast(`Descanso concluído: ${calc.cura * x} de dano curado.`); });
      S.modal({ titulo: "Descanso", largura: "sm", corpo: h("p", {}, `Um descanso (cerca de 8 horas) cura dano igual à taxa de cura (${calc.cura}); 24 horas completas curam o dobro (${calc.cura * 2}). Talentos de uso limitado e conjurações são restaurados (conjurações exigem ao menos 1 minuto de meditação, estudo ou ritual).`),
        acoes: [{ texto: "Cancelar" }, { texto: "8 horas", classe: "primario", fn: () => aplicar(1) }, { texto: "24 horas", classe: "primario", fn: () => aplicar(2) }] });
    }

    /* marcas de uso: caixinhas de tinta que se riscam com um X; atualizam no lugar, sem redesenhar a ficha */
    const X_SVG = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 4.5 L16 15.5"/><path d="M16 4 L4.5 16"/></svg>';
    function marcasUso({ max, obter, definir, rotulo, aoMudar }) {
      const bt = Array.from({ length: max }, (_, i) => h("button", { type: "button", class: "marca", html: X_SVG, onclick: () => { const u = obter(); definir(i < u ? u - 1 : Math.min(max, u + 1)); aplicar(); salvar(); } }));
      const el = h("span", { class: "marcas", role: "group", "aria-label": rotulo }, bt);
      function aplicar() { const u = obter(); bt.forEach((b, i) => { b.classList.toggle("usada", i < u); b.setAttribute("aria-pressed", i < u); b.setAttribute("aria-label", `${rotulo}: uso ${i + 1} ${i < u ? "gasto (clique para recuperar)" : "disponível (clique para marcar como usado)"}`); b.title = i < u ? "Usado — clique para recuperar" : "Disponível — clique para marcar como usado"; }); aoMudar && aoMudar(u); }
      aplicar(); return el;
    }
    const usosMax = (t) => (/(vezes igual ao seu Poder|vezes igual ao Poder)/i.test(t.t) ? Math.max(1, calc.poder) : 1);
    const usosGet = (n) => { const v = f.usados[n]; return v === true ? 1 : +v || 0; };

    /* ---------- rolagens ---------- */
    const rolar = (k) => S.rolarContexto({ calc, titulo: "Desafio de " + (S.ATR_NOME[k] || "Percepção"), tipo: "desafio", attr: k });
    const atacar = (a) => {
      const fm = calc.mod("forca"), am = calc.mod("agilidade");
      const attr = a.cat === "À Distância" ? "agilidade" : /Acuidade/.test(a.prop || "") ? (am > fm ? "agilidade" : "forca") : "forca";
      S.rolarContexto({ calc, titulo: "Ataque — " + a.nome, tipo: "ataque", attr, arma: a });
    };

    /* ---------- montagem ---------- */
    function montar() {
      const salvarTxt = (campo) => (e) => { f[campo] = e.target.value; salvar(); };
      const c = calc, anc = c.anc;
      const painel = (cls, titulo, box, ...k) => h("section", { class: "p " + cls, style: box, "aria-label": titulo }, h("h2", { class: "p-tit" }, titulo), ...k);
      const trilhaBtn = (tier, rot, min) => { const t = S.byId(S.trilhas, f.trilhas[tier]); const bloq = f.nivel < min;
        return h("div", { class: "p trilha", style: tier === "novato" ? pct(350, 106, 590, 136) : tier === "especialista" ? pct(350, 171, 590, 201) : pct(350, 244, 590, 274) },
          h("button", { class: "btn-campo" + (t ? "" : " sem-valor"), title: bloq ? `Benefícios a partir do nível ${min}` : "", onclick: () => modalTrilha(tier, rot) }, t ? t.nome : "Escolher" + (bloq ? ` (nível ${min})` : ""))); };

      const nomeTal = (t) => { const lim = /descanso/i.test(t.t); const max = usosMax(t);
        const li = h("li", { class: "tal" }, h("button", { class: "tal-n", onclick: () => modalTalento(t) }, t.n));
        if (lim) li.append(marcasUso({ max, obter: () => usosGet(t.n), definir: (v) => (f.usados[t.n] = v), rotulo: t.n, aoMudar: (u) => li.classList.toggle("usado", u >= max) }));
        return li; };
      const grupos = {}; c.tal.forEach((t) => (grupos[t.fonte] = grupos[t.fonte] || []).push(t));

      const dinheiro = h("div", { class: "dinheiro" }, [["co", "co"], ["xp", "xp"], ["cc", "cc"]].map(([k, n]) => h("label", {}, n, numIn(f.dinheiro[k], (v) => { f.dinheiro[k] = Math.max(0, v); salvar(); }, { min: 0, rotulo: "Moedas " + n }))));
      const esc = f.escudo ? S.byId(S.armas, f.escudo) : null, arm = S.byId(S.armaduras, f.armadura);

      const stats = h("div", { class: "stats" },
        circ(349, 443, 70, "atr", h("button", { class: "circ-b", "aria-label": `Força ${c.atrs.forca.v}, rolar desafio`, title: "Rolar desafio de Força", onclick: () => rolar("forca") }, c.atrs.forca.v)),
        circ(380, 490, 34, "mod", S.sinal(c.atrs.forca.m)),
        circ(580, 437, 70, "atr", h("button", { class: "circ-b", "aria-label": `Intelecto ${c.atrs.intelecto.v}, rolar desafio`, title: "Rolar desafio de Intelecto", onclick: () => rolar("intelecto") }, c.atrs.intelecto.v)),
        circ(546, 478, 32, "mod", S.sinal(c.atrs.intelecto.m)),
        circ(267, 631, 70, "atr", h("button", { class: "circ-b", "aria-label": `Agilidade ${c.atrs.agilidade.v}, rolar desafio`, title: "Rolar desafio de Agilidade", onclick: () => rolar("agilidade") }, c.atrs.agilidade.v)),
        circ(323, 628, 36, "mod", S.sinal(c.atrs.agilidade.m)),
        circ(663, 631, 70, "atr", h("button", { class: "circ-b", "aria-label": `Vontade ${c.atrs.vontade.v}, rolar desafio`, title: "Rolar desafio de Vontade", onclick: () => rolar("vontade") }, c.atrs.vontade.v)),
        circ(606, 630, 34, "mod", S.sinal(c.atrs.vontade.m)),
        circ(467, 803, 70, "atr", h("span", { class: "circ-v", title: "Vida" }, c.vida)),
        circ(467, 737, 40, "pq", h("button", { class: "circ-b", title: "Taxa de Cura: curar dano", "aria-label": "Curar dano igual à taxa de cura", onclick: () => mut(() => (f.dano = Math.max(0, f.dano - c.cura))) }, c.cura)),
        circ(305, 771, 50, "pq", h("span", { class: "circ-v", title: c.defesaNota ? "Defesa (" + c.defesaNota + ")" : "Defesa" }, c.defesa)),
        circ(624, 771, 50, "pq", numIn(c.corrupcao, (v) => mut(() => (f.corrupcao = Math.max(0, v))), { min: 0, rotulo: "Corrupção" })),
        circ(657, 553, 50, "pq", numIn(c.insanidade, (v) => mut(() => (f.insanidade = Math.max(0, v))), { min: 0, rotulo: "Insanidade" })),
        circ(653, 425, 50, "pq", h("button", { class: "circ-b", title: "Percepção: rolar desafio", "aria-label": `Percepção ${c.percepcao}, rolar desafio`, onclick: () => rolar("percepcao") }, c.percepcao)),
        circ(650, 334, 50, "pq", h("span", { class: "circ-v", title: "Poder" }, c.poder)),
        circ(272, 488, 50, "pq", h("span", { class: "circ-v", title: "Tamanho" }, c.tamanho)),
        circ(236, 538, 50, "pq", h("span", { class: "circ-v", title: "Velocidade" }, c.velocidade)),
        circ(572, 42, 50, "pq", numIn(f.nivel, (v) => mut(() => (f.nivel = Math.max(0, Math.min(10, v)))), { min: 0, max: 10, rotulo: "Nível" })),
        circ(461, 590, 150, "dano" + (c.estado ? " " + c.estado : ""),
          h("div", { class: "dano-in" }, numIn(c.dano, (v) => mut(() => (f.dano = Math.max(0, Math.min(c.vida, v)))), { min: 0, max: c.vida, rotulo: "Dano sofrido" }),
            h("div", { class: "dano-estado" }, c.estado === "incapacitado" ? "Incapacitado" : c.estado === "ferido" ? "Ferido" : "Dano"),
            h("div", { class: "dano-bt" }, h("button", { class: "btn-icone", "aria-label": "Sofrer 1 de dano", onclick: () => mut(() => (f.dano = Math.min(c.vida, f.dano + 1))) }, "+"), h("button", { class: "btn-icone", "aria-label": "Curar 1 de dano", onclick: () => mut(() => (f.dano = Math.max(0, f.dano - 1))) }, "−")))));

      const ficha = h("div", { class: "ficha" },
        h("div", { class: "medalhao" }, stats),
        h("div", { class: "p p-nome", style: pct(70, 12, 312, 44) }, h("input", { type: "text", class: "campo-nome", placeholder: "Nome do personagem", "aria-label": "Nome", value: f.nome, oninput: salvarTxt("nome") })),
        h("div", { class: "p p-retrato", style: { left: (22 / W) * 100 + "%", top: (112 / H) * 100 + "%", width: (122 / W) * 100 + "%" } },
          h("button", { class: "retrato", "aria-label": "Editar retrato", onclick: () => S.editarRetrato(f.retrato, (d) => mut(() => (f.retrato = d))) }, f.retrato ? h("img", { src: f.retrato, alt: "Retrato de " + (f.nome || "personagem") }) : h("span", {}, "Adicionar retrato"))),
        h("div", { class: "p", style: pct(150, 108, 312, 300) }, h("textarea", { class: "campo-area", placeholder: "Aparência, personalidade, história…", "aria-label": "Descrição", oninput: salvarTxt("descricao") }, f.descricao)),
        h("div", { class: "p", style: pct(340, 38, 545, 68) }, h("button", { class: "btn-campo" + (anc ? "" : " sem-valor"), onclick: modalAncestralidade }, anc ? anc.nome : "Escolher ancestralidade")),
        TIERS.map(([t, r, m]) => trilhaBtn(t, r, m)),
        painel("p-prof", "", pct(620, 40, 925, 300), h("ul", { class: "chips" }, f.profissoes.map((p, i) => h("li", { class: "chip" }, p, h("button", { "aria-label": "Remover " + p, onclick: () => mut(() => f.profissoes.splice(i, 1)), html: S.icone.x })))),
          h("button", { class: "btn peq", onclick: modalProfissao }, "Adicionar profissão"), anc ? h("p", { class: "idi" }, anc.idiomas) : null, c.idiomas.map((i) => h("p", { class: "idi" }, h("b", {}, i.fonte + ": "), i.texto))),
        painel("p-tal", "", pct(12, 345, 200, 940),
          c.pend.length ? h("button", { class: "alerta", onclick: modalEscolhas }, `Escolhas pendentes: ${c.pend.reduce((a, p) => a + p.falta, 0)}`) : h("button", { class: "btn peq", onclick: modalEscolhas }, "Escolhas de nível"),
          Object.entries(grupos).map(([g, l]) => h("div", { class: "grupo" }, h("h3", {}, g), h("ul", {}, l.map(nomeTal)))),
          h("button", { class: "btn peq", onclick: modalNovoTalento }, "Adicionar talento")),
        painel("p-mag", "", pct(705, 345, 922, 915),
          h("ul", { class: "chips" }, f.tradicoes.map((t) => h("li", { class: "chip" }, t))),
          h("ul", { class: "lista-mag" }, c.feiticos.slice().sort((a, b) => a.grau - b.grau).map((m) => { const tot = c.casts(m.grau), chave = m.uid || m.id;
            return h("li", {}, h("button", { class: "tal-n", title: "Abrir feitiço", onclick: () => modalFeitico(m) }, m.nome),
              tot ? marcasUso({ max: tot, obter: () => Math.min(tot, f.conj[chave] || 0), definir: (v) => (f.conj[chave] = v), rotulo: `Conjurações de ${m.nome}` }) : h("small", { class: "sem-conj" }, "sem conjurações"), h("small", { class: "grau" }, "grau " + m.grau)); })),
          h("button", { class: "btn peq", onclick: () => modalMagia() }, "Magia…")),
        painel("p-est", "", pct(240, 868, 690, 975), h("div", { class: "linha-est" },
          h("button", { class: "btn peq", onclick: modalAflicoes }, "Aflições"), h("button", { class: "btn peq" + (c.avisos.some((x) => x.n === "alerta") ? " perigo" : ""), onclick: modalAvisos }, `Avisos (${c.avisos.length})`), f.aflicoes.length ? f.aflicoes.map((a) => h("span", { class: "chip aflicao" }, a)) : h("small", {}, "nenhuma"))),
        painel("p-arm", "", pct(15, 985, 235, 1165), h("ul", { class: "armas" }, f.armas.map((a, i) => h("li", {}, h("div", {}, h("b", {}, a.nome), h("small", {}, a.dano + (a.prop ? " · " + a.prop : ""))),
          h("div", { class: "arma-bt" }, h("button", { class: "btn peq primario", onclick: () => atacar(a) }, "Atacar"), h("button", { class: "btn-icone", "aria-label": "Remover " + a.nome, onclick: () => mut(() => f.armas.splice(i, 1)), html: S.icone.x }))))),
          h("button", { class: "btn peq", onclick: () => modalEquip("Armas") }, "Adicionar arma")),
        painel("p-eq", "", pct(245, 985, 925, 1165),
          h("div", { class: "eq-topo" }, h("span", {}, h("b", {}, "Armadura: "), arm ? arm.nome : "—", " · ", h("b", {}, "Escudo: "), esc ? esc.nome : "—"), dinheiro),
          h("ul", { class: "itens" }, f.equip.map((e, i) => h("li", {}, numIn(e.qtd, (v) => mut(() => { e.qtd = v; if (v <= 0) f.equip.splice(i, 1); }), { min: 0, rotulo: "Quantidade de " + e.nome }), h("span", {}, e.nome)))),
          h("button", { class: "btn peq", onclick: () => modalEquip("Itens") }, "Adicionar equipamento")));

      const rots = [[".p-nome", "Nome"], [".p-retrato", "Retrato"], ["textarea.campo-area", "Descrição"], [".p-prof", "Profissões"], [".p-tal", "Talentos"], [".p-mag", "Magia"], [".p-est", "Estado"], [".p-arm", "Armas"], [".p-eq", "Equipamento"]];
      rots.forEach(([sel, r]) => { const el = ficha.querySelector(sel); const alvo = el && (el.classList.contains("p") ? el : el.closest(".p")); if (alvo) alvo.dataset.rot = r; });
      const bs = ficha.querySelectorAll(".btn-campo"); ["Ancestralidade", "Novato", "Especialista", "Mestre"].forEach((r, i) => bs[i] && (bs[i].closest(".p").dataset.rot = r));
      ficha.querySelector(".btn-campo").closest(".p").append(h("label", { class: "so-mobile" }, "Nível ", numIn(f.nivel, (v) => mut(() => (f.nivel = Math.max(0, Math.min(10, v)))), { min: 0, max: 10, rotulo: "Nível do personagem" })));
      const barra = h("header", { class: "barra" },
        h("div", { class: "barra-esq" }, h("a", { class: "voltar", href: "#/" }, h("span", { html: S.icone.voltar }), "Fichas"),
          h("div", { class: "marca-mini" }, h("img", { src: "assets/icon.svg", alt: "" }), h("span", {}, f.nome || "Personagem sem nome"))),
        h("nav", { class: "nav", "aria-label": "Ações da ficha" },
          h("button", { class: "nav-b", onclick: () => S.painelDados() }, "Dados"), h("button", { class: "nav-b", onclick: modalDescanso }, "Descanso"), h("button", { class: "nav-b", onclick: modalAjustes }, "Ajustes"),
          h("button", { class: "nav-b", onclick: modalNotas }, "Notas"), h("button", { class: "nav-b", onclick: () => S.fichas.exportar([f], (f.nome || "ficha") + ".sdl.json") }, "Exportar"), S.tema.botao()));
      const frag = document.createDocumentFragment();
      frag.append(barra, h("main", { class: "ficha-wrap" }, ficha, h("p", { class: "rodape-ficha" }, "Layout inspirado na ficha do Livro Básico de Shadow of the Demon Lord. Clique nos círculos de atributos para rolar desafios.")));
      return frag;
    }
    render();
  };
})(window.SDL);
