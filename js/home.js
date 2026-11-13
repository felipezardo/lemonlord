/* Página inicial: gerenciar fichas (criar, abrir, duplicar, excluir, importar, exportar). */
(function (S) {
  "use strict";
  const h = S.h;
  S.telaInicial = function (root) {
    const render = () => root.replaceChildren(montar());
    function montar() {
      const fichas = S.fichas.lista();
      const arq = h("input", { type: "file", accept: ".json,application/json", multiple: true, class: "oculto", onchange: async (e) => {
        let total = 0; for (const f of e.target.files) { try { total += S.fichas.importar(await f.text()); } catch (x) { S.toast("Arquivo inválido: " + f.name); } }
        if (total) S.toast(total + " ficha(s) importada(s)"); render(); } });
      const card = (f) => {
        const a = S.byId(S.ancestralidades, f.anc);
        const trilhas = ["novato", "especialista", "mestre"].map((t) => (S.byId(S.trilhas, f.trilhas[t]) || {}).nome).filter(Boolean).join(" · ");
        return h("article", { class: "ficha-card" },
          h("a", { class: "fc-link", href: "#/ficha/" + f.id, "aria-label": "Abrir ficha de " + (f.nome || "personagem sem nome") },
            h("div", { class: "fc-foto" }, f.retrato ? h("img", { src: f.retrato, alt: "" }) : h("img", { src: "assets/icon.svg", alt: "", class: "fc-vazio" })),
            h("div", { class: "fc-info" }, h("h3", {}, f.nome || "Sem nome"), h("p", {}, [a ? a.nome : "Sem ancestralidade", "Nível " + f.nivel].join(" · ")), h("small", {}, trilhas || "Sem trilha"))),
          h("div", { class: "fc-acoes" },
            h("button", { class: "btn peq", onclick: () => { const c = JSON.parse(JSON.stringify(f)); c.id = S.uid(); c.nome = (f.nome || "Sem nome") + " (cópia)"; S.fichas.salvar(c); render(); } }, "Duplicar"),
            h("button", { class: "btn peq", onclick: () => S.fichas.exportar([f], (f.nome || "ficha") + ".sdl.json") }, "Exportar"),
            h("button", { class: "btn peq perigo", onclick: async () => { if (await S.confirmar("Excluir ficha", `Excluir "${f.nome || "Sem nome"}" permanentemente? Exporte antes se quiser guardar uma cópia.`, "Excluir", true)) { S.fichas.excluir(f.id); render(); } } }, "Excluir")));
      };
      return h("div", { class: "home" },
        h("header", { class: "barra" }, h("div", { class: "marca" }, h("img", { src: "assets/icon.svg", alt: "", class: "marca-ic" }), h("div", {}, h("h1", {}, "Shadow of the Demon Lord"), h("small", {}, "Fichas de personagem"))),
          h("div", { class: "barra-acoes" }, h("button", { class: "btn peq", onclick: () => S.painelDados() }, "🎲 Dados"), S.tema.botao())),
        h("main", { class: "home-corpo" },
          h("div", { class: "home-acoes" },
            h("button", { class: "btn primario grande", onclick: () => { const f = S.fichas.nova(); S.fichas.salvar(f); location.hash = "#/ficha/" + f.id; } }, "＋ Nova ficha"),
            h("button", { class: "btn", onclick: () => arq.click() }, "Importar"), arq,
            h("button", { class: "btn", disabled: !fichas.length, onclick: () => S.fichas.exportar(fichas, "fichas-sdl.json") }, "Exportar todas")),
          fichas.length ? h("div", { class: "grade-fichas" }, fichas.map(card)) : h("div", { class: "vazio" }, h("img", { src: "assets/icon.svg", alt: "" }), h("p", {}, "Nenhuma ficha ainda. Crie seu primeiro personagem ou importe um arquivo."))),
          h("footer", { class: "rod" }, "Fichas salvas apenas neste navegador. Exporte para fazer backup."));
    }
    render();
  };
})(window.SDL);
