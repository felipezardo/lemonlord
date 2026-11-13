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
    function modalAncestralidade() {
      const fecha = S.modal({ titulo: "Ancestralidade", largura: "lg", corpo: h("div", { class: "cards" }, S.ancestralidades.map((a) =>
        h("button", { class: "card-op" + (f.anc === a.id ? " sel" : ""), onclick: () => { mut(() => { f.anc = a.id; f.ancEsc = {}; f.corrupcao = a.corrupcao; f.insanidade = a.insanidade; }); fecha(); setTimeout(modalEscolhas, 200); } },
          h("strong", {}, a.nome), h("span", {}, a.desc),
          h("small", {}, `For ${a.atr.forca} · Agi ${a.atr.agilidade} · Int ${a.atr.intelecto} · Von ${a.atr.vontade} · Vel ${a.velocidade}`),
          h("small", {}, a.talentos.map((t) => t.n).join(" · "))))) });
    }

    function modalTrilha(tier, rotulo) {
      let busca = "";
      const lista = h("div", { class: "cards" });
      const fecha = S.modal({ titulo: "Trilha de " + rotulo, largura: "lg", corpo: h("div", {},
        h("input", { type: "search", class: "busca", placeholder: "Buscar trilha…", "aria-label": "Buscar trilha", oninput: (e) => { busca = e.target.value.toLowerCase(); desenha(); } }), lista),
        acoes: f.trilhas[tier] ? [{ texto: "Remover trilha", classe: "perigo", fn: () => mut(() => (f.trilhas[tier] = "")) }, { texto: "Fechar" }] : [{ texto: "Fechar" }] });
      function desenha() {
        lista.replaceChildren(...S.trilhas.filter((t) => t.tier === tier && t.nome.toLowerCase().includes(busca)).map((t) => {
          const niveis = Object.values(t.niv).sort((a, b) => a.n - b.n);
          return h("div", { class: "card-op" + (f.trilhas[tier] === t.id ? " sel" : "") },
            h("strong", {}, t.nome), h("span", { class: "peq" }, t.desc || ""),
            h("details", {}, h("summary", {}, "Benefícios por nível"), niveis.map((n) => h("div", { class: "nv" },
              h("b", {}, `Nível ${n.n}`), h("small", {}, Object.entries(n.car).map(([k, v]) => `${k} ${S.sinal(v)}`).join(", ") + (n.esc ? ` · atributos: +1 em ${n.esc}` : "")),
              n.tal.map((x) => h("p", {}, h("b", {}, x.n + ". "), x.t))))),
            h("button", { class: "btn primario", onclick: () => { mut(() => (f.trilhas[tier] = t.id)); fecha(); setTimeout(modalEscolhas, 200); } }, "Escolher"));
        }));
      }
      desenha();
    }

    function modalEscolhas() {
      const c = S.calcular(f); const box = h("div", { class: "escolhas" });
      const botoesAtr = (sel, max, fn) => h("div", { class: "grupo-btn" }, S.ATR.map(([k, n]) => h("button", { class: "btn peq" + (sel.includes(k) ? " primario" : ""), "aria-pressed": sel.includes(k), onclick: () => { let s = sel.slice(); if (s.includes(k)) s = s.filter((x) => x !== k); else { if (s.length >= max) s.shift(); s.push(k); } fn(s); redraw(); } }, n)));
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
          if (b.esc) box.append(h("section", {}, h("h3", {}, b.fonte), h("p", { class: "dica" }, `Aumente ${b.esc} atributo${b.esc > 1 ? "s" : ""} em 1 (escolha ${b.esc} diferentes).`), botoesAtr(f.picks[b.chave] || [], b.esc, (s) => (f.picks[b.chave] = s))));
          if (b.chave === "anc:4") box.append(h("section", {}, h("h3", {}, b.fonte), h("p", { class: "dica" }, b.ancEscolha), h("div", { class: "grupo-btn" },
            [["talento", "Ganhar o talento"], ["feitico", "Aprender um feitiço"]].map(([v, n]) => h("button", { class: "btn peq" + ((f.escolhas["anc:4"] || "talento") === v ? " primario" : ""), onclick: () => { f.escolhas["anc:4"] = v; redraw(); } }, n)))));
        }
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
        lista.replaceChildren(...S.profissoes[cat].filter((p) => p.toLowerCase().includes(busca)).map((p) => h("button", { class: "card-op", onclick: () => { if (/\(escolha/.test(p)) { livre.value = p.replace(/\s*\(.*\)/, "") + ": "; livre.focus(); } else add(p); } }, p)));
      }
      S.modal({ titulo: "Adicionar profissão", largura: "lg", corpo: h("div", {},
        h("div", { class: "grupo-btn" }, Object.keys(S.profissoes).map((k) => h("button", { class: "btn peq", onclick: (e) => { cat = k; [...e.target.parentNode.children].forEach((b) => b.classList.toggle("primario", b === e.target)); desenha(); } }, k))),
        h("input", { type: "search", class: "busca", placeholder: "Buscar…", oninput: (e) => { busca = e.target.value.toLowerCase(); desenha(); } }), lista,
        h("div", { class: "linha" }, livre, h("button", { class: "btn primario", onclick: () => livre.value.trim() && add(livre.value.trim()) }, "Adicionar"))) });
      desenha();
    }

    function modalEquip(aba = "Armas") {
      const corpo = h("div", {}); const abas = ["Armas", "Armaduras", "Escudos", "Itens", "Personalizado"]; let busca = "";
      const fecha = S.modal({ titulo: "Equipamento", corpo, largura: "lg" });
      const aviso = (req) => { const m = /(\d+)/.exec(req || ""); if (m && calc.atrs.forca.v < +m[1] && !/Agilidade/.test(req)) S.toast(`Atenção: requer Força ${m[1]}+ (você tem ${calc.atrs.forca.v}).`); };
      const linha = (titulo, sub, botao) => h("div", { class: "item-cat" }, h("div", {}, h("strong", {}, titulo), h("small", {}, sub)), botao);
      function desenha() {
        const q = busca.toLowerCase(); let lista = [];
        if (aba === "Armas") lista = S.armas.filter((a) => a.cat !== "Escudo" && a.nome.toLowerCase().includes(q)).map((a) => linha(a.nome, `${a.dano} · ${a.maos} · ${a.prop} · ${a.preco} · ${a.cat}${a.req ? " · req. " + a.req : ""}`, h("button", { class: "btn peq", onclick: () => { aviso(a.req); mut(() => f.armas.push({ uid: S.uid(), id: a.id, nome: a.nome, dano: a.dano, prop: a.prop, cat: a.cat })); S.toast("Arma adicionada"); } }, "Adicionar")));
        if (aba === "Armaduras") lista = S.armaduras.map((a) => linha(a.nome, `${a.tipo} · Defesa ${a.def != null ? a.def : "Agilidade" + (a.bonus ? " +" + a.bonus : "")} · ${a.preco}${a.req ? " · Força " + a.req + "+" : ""}`, h("button", { class: "btn peq" + (f.armadura === a.id ? " primario" : ""), onclick: () => { aviso("Força " + a.req); mut(() => (f.armadura = a.id)); } }, f.armadura === a.id ? "Vestindo" : "Vestir")));
        if (aba === "Escudos") lista = [linha("Sem escudo", "", h("button", { class: "btn peq", onclick: () => mut(() => (f.escudo = "")) }, "Remover"))].concat(S.armas.filter((a) => a.cat === "Escudo").map((a) => linha(a.nome, `${a.prop} · ${a.preco}`, h("button", { class: "btn peq" + (f.escudo === a.id ? " primario" : ""), onclick: () => { mut(() => (f.escudo = a.id)); } }, f.escudo === a.id ? "Equipado" : "Equipar"))));
        if (aba === "Itens") lista = S.itens.filter((i) => i.nome.toLowerCase().includes(q)).map((i) => linha(i.nome, i.preco + (i.desc ? " · " + i.desc : ""), h("button", { class: "btn peq", onclick: () => { mut(() => { const e = f.equip.find((x) => x.nome === i.nome); if (e) e.qtd++; else f.equip.push({ uid: S.uid(), nome: i.nome, qtd: 1 }); }); S.toast("Item adicionado"); } }, "Adicionar")));
        if (aba === "Personalizado") {
          const n = h("input", { type: "text", placeholder: "Nome" }), d = h("input", { type: "text", placeholder: "Dano (ex.: 1d6+1) — vazio para item comum" });
          lista = [h("div", { class: "form-col" }, n, d, h("button", { class: "btn primario", onclick: () => { if (!n.value.trim()) return; const dm = d.value.trim(); if (dm && !S.dados.expr(dm)) return S.toast("Dano inválido"); mut(() => (dm ? f.armas.push({ uid: S.uid(), nome: n.value.trim(), dano: dm, prop: "", cat: "Personalizada" }) : f.equip.push({ uid: S.uid(), nome: n.value.trim(), qtd: 1 }))); n.value = d.value = ""; } }, "Adicionar"))];
        }
        corpo.replaceChildren(h("div", { class: "grupo-btn" }, abas.map((a) => h("button", { class: "btn peq" + (a === aba ? " primario" : ""), onclick: () => { aba = a; desenha(); } }, a))),
          ["Armas", "Itens"].includes(aba) ? h("input", { type: "search", class: "busca", placeholder: "Buscar…", value: busca, oninput: (e) => { busca = e.target.value; desenha(); document.querySelector(".busca").focus(); } }) : null, h("div", { class: "lista-cat" }, lista));
      }
      desenha();
    }

    function modalTalento(t) {
      S.modal({ titulo: t.n, largura: "md", corpo: h("div", {}, h("p", { class: "dica" }, t.fonte), h("p", {}, t.t)), acoes: t.custom ? [{ texto: "Remover", classe: "perigo", fn: () => mut(() => (f.talentosExtra = f.talentosExtra.filter((x) => x.n !== t.n))) }, { texto: "Fechar" }] : [{ texto: "Fechar" }] });
    }
    function modalNovoTalento() {
      const n = h("input", { type: "text", placeholder: "Nome do talento" }), t = h("textarea", { rows: 4, placeholder: "Descrição" });
      S.modal({ titulo: "Talento personalizado", corpo: h("div", { class: "form-col" }, n, t), acoes: [{ texto: "Cancelar" }, { texto: "Adicionar", classe: "primario", fn: () => { if (!n.value.trim()) return false; mut(() => f.talentosExtra.push({ n: n.value.trim(), t: t.value.trim() })); } }] });
    }

    function modalMagia() {
      const trad = h("select", {}, h("option", { value: "" }, "Tradição…"), S.tradicoes.map((t) => h("option", {}, t)));
      const nome = h("input", { type: "text", placeholder: "Nome do feitiço" }), grau = h("input", { type: "number", min: 0, max: 10, value: 0, class: "num-in" });
      S.modal({ titulo: "Magia", largura: "md", corpo: h("div", { class: "form-col" },
        h("h3", {}, "Descobrir tradição"), h("div", { class: "linha" }, trad, h("button", { class: "btn", onclick: () => { if (!trad.value) return; mut(() => { if (!f.tradicoes.includes(trad.value)) f.tradicoes.push(trad.value); }); } }, "Descobrir")),
        h("h3", {}, "Aprender feitiço"), nome, h("div", { class: "linha" }, h("label", {}, "Grau", grau)),
        h("p", { class: "dica" }, "A lista completa de feitiços por tradição será adicionada em uma versão futura; por ora, registre o nome e o grau.")),
        acoes: [{ texto: "Fechar" }, { texto: "Aprender feitiço", classe: "primario", fn: () => { if (!nome.value.trim()) return false; mut(() => f.magias.push({ uid: S.uid(), nome: nome.value.trim(), grau: +grau.value || 0, trad: trad.value })); } }] });
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
      const aplicar = (x) => mut(() => { f.dano = Math.max(0, f.dano - calc.cura * x); f.usados = {}; S.toast(`Descanso concluído: ${calc.cura * x} de dano curado.`); });
      S.modal({ titulo: "Descanso", largura: "sm", corpo: h("p", {}, `Um descanso (cerca de 8 horas) cura dano igual à taxa de cura (${calc.cura}); 24 horas completas curam o dobro (${calc.cura * 2}). Talentos de uso limitado são restaurados.`),
        acoes: [{ texto: "Cancelar" }, { texto: "8 horas", classe: "primario", fn: () => aplicar(1) }, { texto: "24 horas", classe: "primario", fn: () => aplicar(2) }] });
    }

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

      const nomeTal = (t) => { const lim = /descanso/i.test(t.t); const usado = f.usados[t.n];
        return h("li", { class: "tal" + (usado ? " usado" : "") }, h("button", { class: "tal-n", onclick: () => modalTalento(t) }, t.n),
          lim ? h("button", { class: "tal-u", "aria-pressed": !!usado, title: "Marcar como usado (restaura no descanso)", onclick: () => mut(() => (f.usados[t.n] = !f.usados[t.n])) }, usado ? "usado" : "◯") : null); };
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
          h("button", { class: "retrato", "aria-label": "Editar retrato", onclick: () => S.editarRetrato(f.retrato, (d) => mut(() => (f.retrato = d))) }, f.retrato ? h("img", { src: f.retrato, alt: "Retrato de " + (f.nome || "personagem") }) : h("span", {}, "＋ Retrato"))),
        h("div", { class: "p", style: pct(150, 108, 312, 300) }, h("textarea", { class: "campo-area", placeholder: "Aparência, personalidade, história…", "aria-label": "Descrição", oninput: salvarTxt("descricao") }, f.descricao)),
        h("div", { class: "p", style: pct(340, 38, 545, 68) }, h("button", { class: "btn-campo" + (anc ? "" : " sem-valor"), onclick: modalAncestralidade }, anc ? anc.nome : "Escolher ancestralidade")),
        TIERS.map(([t, r, m]) => trilhaBtn(t, r, m)),
        painel("p-prof", "", pct(620, 40, 925, 300), h("ul", { class: "chips" }, f.profissoes.map((p, i) => h("li", { class: "chip" }, p, h("button", { "aria-label": "Remover " + p, onclick: () => mut(() => f.profissoes.splice(i, 1)) }, "×")))),
          h("button", { class: "btn peq", onclick: modalProfissao }, "＋ Profissão"), anc ? h("p", { class: "idi" }, anc.idiomas) : null, c.idiomas.map((i) => h("p", { class: "idi" }, h("b", {}, i.fonte + ": "), i.texto))),
        painel("p-tal", "", pct(12, 345, 200, 940),
          c.pend.length ? h("button", { class: "alerta", onclick: modalEscolhas }, `⚠ ${c.pend.reduce((a, p) => a + p.falta, 0)} escolha(s) pendente(s)`) : h("button", { class: "btn peq", onclick: modalEscolhas }, "Escolhas de nível"),
          Object.entries(grupos).map(([g, l]) => h("div", { class: "grupo" }, h("h3", {}, g), h("ul", {}, l.map(nomeTal)))),
          h("button", { class: "btn peq", onclick: modalNovoTalento }, "＋ Talento")),
        painel("p-mag", "", pct(705, 345, 922, 915),
          h("ul", { class: "chips" }, f.tradicoes.map((t, i) => h("li", { class: "chip" }, t, h("button", { "aria-label": "Remover " + t, onclick: () => mut(() => f.tradicoes.splice(i, 1)) }, "×")))),
          h("ul", { class: "lista-mag" }, f.magias.map((m, i) => h("li", {}, h("span", {}, h("b", {}, m.nome), ` (grau ${m.grau}${m.trad ? ", " + m.trad : ""})`), h("button", { "aria-label": "Remover " + m.nome, onclick: () => mut(() => f.magias.splice(i, 1)) }, "×")))),
          h("button", { class: "btn peq", onclick: modalMagia }, "＋ Magia"),
          c.tal.filter((t) => t.n === "Magia").map((t) => h("details", { class: "dica-mag" }, h("summary", {}, "Magia — " + t.fonte), h("p", {}, t.t)))),
        painel("p-est", "", pct(240, 868, 690, 975), h("div", { class: "linha-est" },
          h("button", { class: "btn peq", onclick: modalAflicoes }, "Aflições"), f.aflicoes.length ? f.aflicoes.map((a) => h("span", { class: "chip aflicao" }, a)) : h("small", {}, "nenhuma"))),
        painel("p-arm", "", pct(15, 985, 235, 1165), h("ul", { class: "armas" }, f.armas.map((a, i) => h("li", {}, h("div", {}, h("b", {}, a.nome), h("small", {}, a.dano + (a.prop ? " · " + a.prop : ""))),
          h("div", { class: "arma-bt" }, h("button", { class: "btn peq primario", onclick: () => atacar(a) }, "Atacar"), h("button", { class: "btn-icone", "aria-label": "Remover " + a.nome, onclick: () => mut(() => f.armas.splice(i, 1)) }, "×"))))),
          h("button", { class: "btn peq", onclick: () => modalEquip("Armas") }, "＋ Arma")),
        painel("p-eq", "", pct(245, 985, 925, 1165),
          h("div", { class: "eq-topo" }, h("span", {}, h("b", {}, "Armadura: "), arm ? arm.nome : "—", " · ", h("b", {}, "Escudo: "), esc ? esc.nome : "—"), dinheiro),
          h("ul", { class: "itens" }, f.equip.map((e, i) => h("li", {}, numIn(e.qtd, (v) => mut(() => { e.qtd = v; if (v <= 0) f.equip.splice(i, 1); }), { min: 0, rotulo: "Quantidade de " + e.nome }), h("span", {}, e.nome)))),
          h("button", { class: "btn peq", onclick: () => modalEquip("Itens") }, "＋ Equipamento")));

      const rots = [[".p-nome", "Nome"], [".p-retrato", "Retrato"], ["textarea.campo-area", "Descrição"], [".p-prof", "Profissões"], [".p-tal", "Talentos"], [".p-mag", "Magia"], [".p-est", "Estado"], [".p-arm", "Armas"], [".p-eq", "Equipamento"]];
      rots.forEach(([sel, r]) => { const el = ficha.querySelector(sel); const alvo = el && (el.classList.contains("p") ? el : el.closest(".p")); if (alvo) alvo.dataset.rot = r; });
      const bs = ficha.querySelectorAll(".btn-campo"); ["Ancestralidade", "Novato", "Especialista", "Mestre"].forEach((r, i) => bs[i] && (bs[i].closest(".p").dataset.rot = r));
      ficha.querySelector(".btn-campo").closest(".p").append(h("label", { class: "so-mobile" }, "Nível ", numIn(f.nivel, (v) => mut(() => (f.nivel = Math.max(0, Math.min(10, v)))), { min: 0, max: 10, rotulo: "Nível do personagem" })));
      const barra = h("header", { class: "barra" },
        h("a", { class: "voltar", href: "#/" }, "← Fichas"), h("div", { class: "barra-acoes" },
          h("button", { class: "btn peq", onclick: () => S.painelDados() }, "🎲 Dados"), h("button", { class: "btn peq", onclick: modalDescanso }, "Descanso"), h("button", { class: "btn peq", onclick: modalAjustes }, "Ajustes"),
          h("button", { class: "btn peq", onclick: modalNotas }, "Notas"), h("button", { class: "btn peq", onclick: () => S.fichas.exportar([f], (f.nome || "ficha") + ".sdl.json") }, "Exportar"),
          h("button", { class: "btn peq", onclick: () => print() }, "Imprimir"), S.tema.botao()));
      const frag = document.createDocumentFragment();
      frag.append(barra, h("main", { class: "ficha-wrap" }, ficha, h("p", { class: "rodape-ficha" }, "Layout inspirado na ficha do Livro Básico de Shadow of the Demon Lord. Clique nos círculos de atributos para rolar desafios.")));
      return frag;
    }
    render();
  };
})(window.SDL);
