/* Editor de retrato: arquivo do dispositivo ou link; arrastar para enquadrar, zoom por controle, roda do mouse e pinça. Saída quadrada 480×480. */
(function (S) {
  "use strict";
  const h = S.h; const TAM = 320, SAIDA = 480;

  S.editarRetrato = function (atual, aoSalvar) {
    let img = null, esc = 1, escMin = 1, zoom = 1, ox = 0, oy = 0;
    const cv = h("canvas", { width: TAM, height: TAM, class: "crop-cv", "aria-label": "Área de enquadramento do retrato" });
    const ctx = cv.getContext("2d");
    const aviso = h("p", { class: "dica" }, "Escolha uma imagem do dispositivo ou cole um link. Arraste para enquadrar e use o zoom.");
    const slider = h("input", { type: "range", min: 1, max: 4, step: 0.01, value: 1, "aria-label": "Zoom", disabled: true });

    const limitar = () => {
      const w = img.width * esc, hh = img.height * esc;
      ox = Math.min(0, Math.max(TAM - w, ox)); oy = Math.min(0, Math.max(TAM - hh, oy));
    };
    const desenhar = () => {
      ctx.fillStyle = "#1a1210"; ctx.fillRect(0, 0, TAM, TAM);
      if (!img) { ctx.fillStyle = "#8a7a6a"; ctx.font = "16px serif"; ctx.textAlign = "center"; ctx.fillText("Sem imagem", TAM / 2, TAM / 2); return; }
      ctx.drawImage(img, ox, oy, img.width * esc, img.height * esc);
    };
    const aplicarZoom = (z, cx = TAM / 2, cy = TAM / 2) => {
      if (!img) return; z = Math.max(1, Math.min(4, z));
      const novo = escMin * z; const f = novo / esc;
      ox = cx - (cx - ox) * f; oy = cy - (cy - oy) * f; esc = novo; zoom = z; slider.value = z; limitar(); desenhar();
    };
    const carregar = (src, cors) => {
      const i = new Image(); if (cors) i.crossOrigin = "anonymous";
      i.onload = () => {
        img = i; escMin = Math.max(TAM / i.width, TAM / i.height); esc = escMin; zoom = 1; ox = (TAM - i.width * esc) / 2; oy = (TAM - i.height * esc) / 2;
        slider.disabled = false; slider.value = 1; aviso.textContent = "Arraste para enquadrar; use o zoom para aproximar ou afastar."; desenhar();
      };
      i.onerror = () => { aviso.textContent = cors ? "Não foi possível carregar essa imagem pelo link (o site de origem pode bloquear o uso). Baixe a imagem e envie o arquivo." : "Arquivo de imagem inválido."; };
      i.src = src;
    };
    if (atual) carregar(atual, false);

    /* arrastar + pinça */
    const ptrs = new Map(); let dist0 = 0, zoom0 = 1;
    cv.addEventListener("pointerdown", (e) => { cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]); if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; dist0 = Math.hypot(a[0] - b[0], a[1] - b[1]); zoom0 = zoom; } });
    cv.addEventListener("pointermove", (e) => {
      if (!img || !ptrs.has(e.pointerId)) return; const p = ptrs.get(e.pointerId);
      if (ptrs.size === 1) { const k = TAM / cv.getBoundingClientRect().width; ox += (e.clientX - p[0]) * k; oy += (e.clientY - p[1]) * k; limitar(); desenhar(); ptrs.set(e.pointerId, [e.clientX, e.clientY]); }
      else { ptrs.set(e.pointerId, [e.clientX, e.clientY]); const [a, b] = [...ptrs.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (dist0) aplicarZoom(zoom0 * (d / dist0)); }
    });
    const solta = (e) => ptrs.delete(e.pointerId); cv.addEventListener("pointerup", solta); cv.addEventListener("pointercancel", solta);
    cv.addEventListener("wheel", (e) => { e.preventDefault(); const r = cv.getBoundingClientRect(); const k = TAM / r.width; aplicarZoom(zoom * (e.deltaY < 0 ? 1.08 : 1 / 1.08), (e.clientX - r.left) * k, (e.clientY - r.top) * k); }, { passive: false });
    slider.addEventListener("input", () => aplicarZoom(+slider.value));

    const arq = h("input", { type: "file", accept: "image/*", class: "oculto", onchange: (e) => { const f = e.target.files[0]; if (!f) return; const fr = new FileReader(); fr.onload = () => carregar(fr.result, false); fr.readAsDataURL(f); } });
    const url = h("input", { type: "url", placeholder: "https://exemplo.com/imagem.jpg", "aria-label": "Link da imagem", onkeydown: (e) => { if (e.key === "Enter") carregar(url.value.trim(), true); } });
    const corpo = h("div", { class: "retrato-ed" }, aviso,
      h("div", { class: "crop-moldura" }, cv, h("div", { class: "crop-grade", "aria-hidden": "true" })),
      h("div", { class: "zoom-linha" }, h("button", { class: "btn-icone", "aria-label": "Diminuir zoom", onclick: () => aplicarZoom(zoom - 0.2) }, "−"), slider, h("button", { class: "btn-icone", "aria-label": "Aumentar zoom", onclick: () => aplicarZoom(zoom + 0.2) }, "+")),
      h("div", { class: "linha" }, h("button", { class: "btn", onclick: () => arq.click() }, "Escolher arquivo…"), arq),
      h("div", { class: "linha" }, url, h("button", { class: "btn", onclick: () => url.value.trim() && carregar(url.value.trim(), true) }, "Carregar link")));
    desenhar();
    S.modal({ titulo: "Retrato do personagem", corpo, largura: "md", acoes: [
      atual ? { texto: "Remover", classe: "perigo", fn: () => aoSalvar("") } : null,
      { texto: "Cancelar" },
      { texto: "Usar retrato", classe: "primario", fn: () => {
        if (!img) { S.toast("Escolha uma imagem primeiro."); return false; }
        const o = document.createElement("canvas"); o.width = o.height = SAIDA; const k = SAIDA / TAM;
        o.getContext("2d").drawImage(img, ox * k, oy * k, img.width * esc * k, img.height * esc * k);
        try { aoSalvar(o.toDataURL("image/jpeg", 0.86)); } catch (e) { S.toast("Imagem bloqueada pelo site de origem. Baixe-a e envie o arquivo."); return false; }
      } }].filter(Boolean) });
  };
})(window.SDL);
