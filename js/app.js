(function (S) {
  S.tema.iniciar();
  const root = document.getElementById("app");
  function rota() {
    const m = /^#\/ficha\/(.+)$/.exec(location.hash);
    document.querySelectorAll(".modal-fundo").forEach((e) => e.remove());
    scrollTo(0, 0);
    if (m) S.telaFicha(root, m[1]); else S.telaInicial(root);
  }
  addEventListener("hashchange", rota); rota();
})(window.SDL);
