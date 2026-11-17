(function (S) {
  S.tema.iniciar();
  const root = document.getElementById("app");
  function rota() {
    const m = /^#\/ficha\/(.+)$/.exec(location.hash);
    document.querySelectorAll(".modal-fundo").forEach((e) => e.remove());
    scrollTo(0, 0);
    if (m) S.telaFicha(root, m[1]); else S.telaInicial(root);
  }
  /* carrega os suplementos listados em js/data/suplementos/indice.js (um a um, em ordem) antes de iniciar */
  function carregar(lista, i, fim) {
    if (i >= lista.length) return fim();
    const s = document.createElement("script"); s.src = "js/data/suplementos/" + lista[i];
    s.onload = s.onerror = (ev) => { if (ev.type === "error") console.warn("Suplemento não encontrado:", lista[i]); carregar(lista, i + 1, fim); };
    document.head.append(s);
  }
  carregar(S.suplementosIndice || [], 0, () => { addEventListener("hashchange", rota); rota(); });
})(window.SDL);
