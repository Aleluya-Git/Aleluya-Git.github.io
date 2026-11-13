/* Aleluya-Git · portfolio
   Interactividad: navegación, carrusel, capturas, lightbox y cuatro demos. */
(() => {
"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

/* ---------------- navegación ---------------- */
const nav = $(".nav");
const onScroll = () => nav.classList.toggle("scrolled", scrollY > 40);
addEventListener("scroll", onScroll, { passive: true }); onScroll();
const toggle = $(".nav-toggle"), menu = $("#menu");
toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
$$("#menu a").forEach(a => a.addEventListener("click", () => { menu.classList.remove("open"); toggle.setAttribute("aria-expanded", false); }));
const links = $$('#menu a[href^="#"]');
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
$$("section.chapter").forEach(s => io.observe(s));

/* ---------------- idioma de la web ---------------- */
const TXT = {
  es: { title: "Aleluya-Git · Software libre para quien construye electrónica",
        start: "Iniciar", running: "Grabando…", again: "Repetir", ready: "; listo\n; pulse Iniciar",
        synced: "sincronizado", editing: "editando…", badLine: n => `revise la línea ${n}`,
        hint: "Pulsa los puntos para ver otras pantallas", zoom: "Ampliar captura",
        prev: "Pantalla anterior", next: "Pantalla siguiente", screen: "Pantalla", lang: "Idioma de la captura" },
  en: { title: "Aleluya-Git · Open software for people who build electronics",
        start: "Start", running: "Engraving…", again: "Run again", ready: "; ready\n; press Start",
        synced: "in sync", editing: "editing…", badLine: n => `check line ${n}`,
        hint: "Click the dots to see other screens", zoom: "Enlarge screenshot",
        prev: "Previous screen", next: "Next screen", screen: "Screen", lang: "Screenshot language" },
};
const lang = () => document.documentElement.lang === "en" ? "en" : "es";
const T = k => TXT[lang()][k];
function setLang(l, save = true) {
  document.documentElement.lang = l;
  if (save) try { localStorage.setItem("lang", l); } catch (e) {}
  $$("[data-setlang]").forEach(b => b.setAttribute("aria-pressed", b.dataset.setlang === l));
  for (const attr of ["aria", "title", "alt"]) {
    $$(`[data-${attr}-${l}]`).forEach(el => el.setAttribute(attr === "aria" ? "aria-label" : attr, el.dataset[attr + l[0].toUpperCase() + l[1]]));
  }
  document.title = T("title");
  document.dispatchEvent(new CustomEvent("langchange", { detail: l }));
}
$$("[data-setlang]").forEach(b => b.addEventListener("click", () => setLang(b.dataset.setlang)));

/* ---------------- pantallas de cada programa ---------------- */
const S = "assets/img/screens/";
const SCREENS = {
  openlaser: [
    { t: { es: "Ventana principal", en: "Main window" }, src: { es: S + "ol-principal.webp" },
      d: { es: "Lienzo con capas, movimiento manual, consola GRBL e iconos en color.", en: "Canvas with layers, manual jogging, GRBL console and colour icons." } },
    { t: { es: "Simulación", en: "Simulation" }, src: { es: S + "ol-simulacion.webp" },
      d: { es: "Reproduce el trabajo paso a paso con potencia, velocidad y diagnóstico.", en: "Plays the job back step by step with power, speed and diagnostics." } },
    { t: { es: "Biblioteca de materiales", en: "Material library" }, src: { es: S + "ol-materiales.webp" },
      d: { es: "Guarda y aplica a cada capa los ajustes de cada material.", en: "Stores per-material settings and applies them to each layer." } },
    { t: { es: "Capas e imágenes", en: "Layers and images" }, src: { es: S + "ol-capas.webp" },
      d: { es: "Capas de línea, relleno, corte e imagen con su modo, velocidad y potencia.", en: "Line, fill, cut and image layers, each with its mode, speed and power." } },
  ],
  openroute: [
    { t: { es: "Placa real ruteada", en: "Real routed board" }, src: { es: S + "or-placa.webp" },
      d: { es: "Proyecto de 42 huellas ruteado en 2 capas: pistas, vías, huellas y referencias, tal como queda en el .kicad_pcb.",
           en: "42-footprint project routed on 2 layers: tracks, vias, footprints and references, exactly as saved in the .kicad_pcb." } },
    { t: { es: "Microcontrolador", en: "Microcontroller" }, src: { es: S + "or-mcu.webp" },
      d: { es: "Placa de prueba con un QFP y conectores, ruteada en la cara superior (rojo) e inferior (azul).",
           en: "Test board with a QFP and connectors, routed on the top (red) and bottom (blue) layers." } },
    { t: { es: "Placa densa", en: "Dense board" }, src: { es: S + "or-densa.webp" },
      d: { es: "24 componentes SMD con 61 vías, validada con el DRC de KiCad.",
           en: "24 SMD parts with 61 vias, checked with KiCad's DRC." } },
  ],
  efpd: [
    { t: { es: "Ventana principal", en: "Main window" },
      src: { es: S + "efpd-principal-es.webp", en: S + "efpd-principal-en.webp", fr: S + "efpd-principal-fr.webp", de: S + "efpd-principal-de.webp" },
      d: { es: "Biblioteca, lienzo con cotas automáticas, propiedades y capas de fabricación.", en: "Library, canvas with automatic dimensions, properties and manufacturing layers." } },
    { t: { es: "Tema oscuro", en: "Dark theme" }, src: { es: S + "efpd-oscuro.webp" },
      d: { es: "Fuente de laboratorio con mandos, escalas, display y bornas.", en: "Bench power supply with knobs, scales, display and binding posts." } },
    { t: { es: "Generador de escalas", en: "Scale generator" }, src: { es: S + "efpd-escalas.webp" },
      d: { es: "Escalas de potenciómetro con vista previa en vivo y 11 plantillas.", en: "Potentiometer scales with live preview and 11 templates." } },
    { t: { es: "Cotas automáticas", en: "Automatic dimensions" }, src: { es: S + "efpd-cotas.webp" },
      d: { es: "Tamaño y posición de cada elemento acotados sobre el panel.", en: "Size and position of every element dimensioned on the panel." } },
    { t: { es: "Vista 3D", en: "3D view" }, src: { es: S + "efpd-3d.webp" },
      d: { es: "Extrusión con huecos, rebajes, grabado y serigrafía, sin OpenGL.", en: "Extrusion with holes, pockets, engraving and silkscreen, no OpenGL needed." } },
  ],
  lvgl: [
    { t: { es: "Editor", en: "Editor" },
      src: { es: S + "lvgl-principal-es.webp", en: S + "lvgl-principal-en.webp", fr: S + "lvgl-principal-fr.webp", de: S + "lvgl-principal-de.webp" },
      d: { es: "Paleta de widgets, árbol del proyecto, lienzo y propiedades por parte y estado.", en: "Widget palette, project tree, canvas and per-part, per-state properties." } },
    { t: { es: "Catálogo de widgets", en: "Widget catalogue" }, src: { es: S + "lvgl-widgets.webp" },
      d: { es: "Todos los widgets de LVGL que se pueden colocar y exportar.", en: "Every LVGL widget you can place and export." } },
    { t: { es: "Simulador", en: "Simulator" }, src: { es: S + "lvgl-simulador.webp" },
      d: { es: "Prueba la interfaz con gestos táctiles antes de flashear.", en: "Try the interface with touch gestures before flashing." } },
    { t: { es: "Página creada con IA", en: "Page made with AI" }, src: { es: S + "lvgl-ia.webp" },
      d: { es: "Página de luces de 1024 × 600 generada con las herramientas de IA (edición Enterprise).", en: "1024 × 600 lights page generated with the AI tools (Enterprise edition)." } },
    { t: { es: "Versiones", en: "Versions" }, src: { es: S + "lvgl-versiones.webp" },
      d: { es: "Compara visualmente una versión guardada con el proyecto actual.", en: "Visually compare a saved version with the current project." } },
    { t: { es: "Componentes", en: "Components" }, src: { es: S + "lvgl-componentes.webp" },
      d: { es: "Catálogo de componentes reutilizables listos para insertar.", en: "Catalogue of reusable components ready to insert." } },
    { t: { es: "Plugins", en: "Plugins" }, src: { es: S + "lvgl-plugins.webp" },
      d: { es: "Gestor de plugins: widgets, exportadores y reglas en Python.", en: "Plugin manager: widgets, exporters and rules in Python." } },
  ],
};
const LANG_NAMES = { es: "ES", en: "EN", fr: "FR", de: "DE" };
const lb = $("#lightbox"), lbImg = $("img", lb);

$$(".viewer").forEach(fig => {
  const list = SCREENS[fig.dataset.project]; if (!list) return;
  let i = 0, shotLang = null; // null = sigue el idioma de la web
  fig.innerHTML = `
    <div class="window-bar">
      <span class="dots" role="tablist"></span>
      <span class="window-title"><b></b><small></small></span>
      <div class="lang-tabs" role="group"></div>
    </div>
    <div class="viewer-stage">
      <button class="shot zoomable"><img alt="" decoding="async"></button>
      <button class="vnav prev">&#8592;</button><button class="vnav next">&#8594;</button>
    </div>
    <figcaption><span class="desc"></span><span class="hint"></span></figcaption>`;
  const dots = $(".dots", fig), title = $(".window-title b", fig), count = $(".window-title small", fig),
        tabs = $(".lang-tabs", fig), img = $(".shot img", fig), desc = $(".desc", fig), hint = $(".hint", fig);
  list.forEach((s, k) => {
    const b = document.createElement("button"); b.setAttribute("role", "tab");
    b.addEventListener("click", () => show(k)); dots.appendChild(b);
  });
  // precarga suave
  const pre = () => list.forEach(s => Object.values(s.src).forEach(u => { const im = new Image(); im.src = u; }));
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { pre(); o.disconnect(); } }, { rootMargin: "400px" }).observe(fig);

  function pick(s) {
    const l = shotLang && s.src[shotLang] ? shotLang : (s.src[lang()] ? lang() : "es");
    return [l, s.src[l]];
  }
  function show(k, keepLang) {
    i = (k + list.length) % list.length;
    if (!keepLang) shotLang = null;
    render();
  }
  function render() {
    const s = list[i], l = lang(), [cur, url] = pick(s);
    if (img.getAttribute("src") !== url) {
      img.style.opacity = .25;
      img.onload = () => img.style.opacity = 1;
      img.src = url;
    }
    img.alt = `${fig.dataset.name}: ${s.t[l]}`;
    title.textContent = `${fig.dataset.name} · ${s.t[l]}`;
    count.textContent = `${i + 1}/${list.length}`;
    desc.textContent = s.d[l];
    hint.textContent = T("hint");
    $$("button", dots).forEach((b, k) => {
      b.setAttribute("aria-current", k === i); b.setAttribute("aria-selected", k === i);
      b.setAttribute("aria-label", `${T("screen")} ${k + 1}: ${list[k].t[l]}`); b.title = list[k].t[l];
    });
    const langs = Object.keys(s.src);
    tabs.setAttribute("aria-label", T("lang"));
    tabs.innerHTML = langs.length > 1 ? langs.map(x => `<button data-l="${x}" aria-pressed="${x === cur}">${LANG_NAMES[x]}</button>`).join("") : "";
    $$("button", tabs).forEach(b => b.addEventListener("click", () => { shotLang = b.dataset.l; render(); }));
    $(".shot", fig).setAttribute("aria-label", T("zoom"));
    $(".vnav.prev", fig).setAttribute("aria-label", T("prev"));
    $(".vnav.next", fig).setAttribute("aria-label", T("next"));
  }
  $(".vnav.prev", fig).addEventListener("click", () => show(i - 1));
  $(".vnav.next", fig).addEventListener("click", () => show(i + 1));
  fig.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") { show(i + 1); e.preventDefault(); }
    if (e.key === "ArrowLeft") { show(i - 1); e.preventDefault(); }
  });
  $(".shot", fig).addEventListener("click", () => { lbImg.src = img.src; lbImg.alt = img.alt; lb.hidden = false; $(".lb-close", lb).focus(); });
  document.addEventListener("langchange", () => { shotLang = null; render(); });
  render();
});

/* lightbox */
const closeLb = () => { lb.hidden = true; };
lb.addEventListener("click", closeLb);
addEventListener("keydown", e => { if (e.key === "Escape" && !lb.hidden) closeLb(); });

/* carrusel */
const rail = $("#rail");
$$(".arrow").forEach(b => b.addEventListener("click", () => {
  const card = $(".card", rail);
  rail.scrollBy({ left: (card.offsetWidth + 22) * +b.dataset.dir, behavior: reduced ? "auto" : "smooth" });
}));

/* ======================================================================
   HERO · pistas de cobre que se rutean hacia el cursor
   ====================================================================== */
(function hero() {
  const cv = $("#heroCanvas"), ctx = cv.getContext("2d");
  const G = 22; let W, H, dpr, traces = [], mouse = null;
  const DIRS = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function spawn() {
    const x = Math.round(Math.random() * W / G) * G, y = Math.round(Math.random() * H / G) * G;
    const t = { x, y, d: (Math.random() * 8) | 0, left: 8 + (Math.random() * 30 | 0), w: Math.random() < .2 ? 4 : 2.2,
      col: Math.random() < .75 ? "224,164,88" : "63,191,127", a: .35 + Math.random() * .45 };
    pad(t.x, t.y, t); return t;
  }
  function pad(x, y, t) {
    ctx.fillStyle = `rgba(${t.col},${t.a})`;
    ctx.beginPath(); ctx.arc(x, y, t.w + 2.5, 0, 7); ctx.fill();
    ctx.fillStyle = "rgba(12,14,17,.9)";
    ctx.beginPath(); ctx.arc(x, y, t.w * .6, 0, 7); ctx.fill();
  }
  function step(t) {
    // gira como mucho 45° y tiende hacia el ratón
    let best = t.d;
    if (mouse && Math.random() < .7) {
      let bd = 1e9;
      for (const k of [t.d, (t.d + 1) % 8, (t.d + 7) % 8]) {
        const nx = t.x + DIRS[k][0] * G, ny = t.y + DIRS[k][1] * G;
        const dist = (nx - mouse.x) ** 2 + (ny - mouse.y) ** 2;
        if (dist < bd) { bd = dist; best = k; }
      }
    } else if (Math.random() < .18) best = (t.d + (Math.random() < .5 ? 1 : 7)) % 8;
    t.d = best;
    const nx = t.x + DIRS[t.d][0] * G, ny = t.y + DIRS[t.d][1] * G;
    ctx.strokeStyle = `rgba(${t.col},${t.a})`; ctx.lineWidth = t.w; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(t.x, t.y); ctx.lineTo(nx, ny); ctx.stroke();
    t.x = nx; t.y = ny; t.left--;
    const near = mouse && Math.hypot(nx - mouse.x, ny - mouse.y) < G;
    if (t.left <= 0 || near || nx < -G || ny < -G || nx > W + G || ny > H + G) { pad(nx, ny, t); return false; }
    return true;
  }
  size(); addEventListener("resize", () => { size(); });
  const heroEl = $(".hero");
  heroEl.addEventListener("pointermove", e => { const r = cv.getBoundingClientRect(); mouse = { x: e.clientX - r.left, y: e.clientY - r.top }; });
  heroEl.addEventListener("pointerleave", () => mouse = null);
  if (reduced) { for (let i = 0; i < 40; i++) { const t = spawn(); while (step(t)); } return; }
  for (let i = 0; i < 14; i++) traces.push(spawn());
  let last = 0, visible = true;
  new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(cv);
  (function loop(ts) {
    requestAnimationFrame(loop);
    if (!visible || ts - last < 45) return; last = ts;
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,.035)"; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";
    traces = traces.filter(step);
    while (traces.length < (mouse ? 22 : 14)) traces.push(spawn());
  })(0);
})();

/* ======================================================================
   OPENLASER · simulación de grabado
   ====================================================================== */
(function laser() {
  const cv = $("#laserCanvas"), ctx = cv.getContext("2d"), S = cv.width, k = S / 100;
  const gEl = $("#gcode");
  const burn = document.createElement("canvas"); burn.width = burn.height = S; const bctx = burn.getContext("2d");
  const wood = document.createElement("canvas"); wood.width = wood.height = S; const wctx = wood.getContext("2d");
  // contrachapado con veta
  wctx.fillStyle = "#c79c64"; wctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 90; i++) {
    const y = Math.random() * S, a = .04 + Math.random() * .08;
    wctx.strokeStyle = `rgba(110,70,30,${a})`; wctx.lineWidth = 1 + Math.random() * 3;
    wctx.beginPath(); wctx.moveTo(0, y);
    for (let x = 0; x <= S; x += 20) wctx.lineTo(x, y + Math.sin(x / 70 + i) * 6);
    wctx.stroke();
  }
  let shape = "star", job = null, head = { x: 5, y: 5 }, raf = 0;
  const pwr = $("#pwr"), spd = $("#spd");
  pwr.oninput = () => $("#pwrOut").textContent = pwr.value + " %";
  spd.oninput = () => $("#spdOut").textContent = spd.value + " mm/min";

  function shapes(name) {
    const P = [];
    if (name === "star") {
      const pts = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? 17 : 40, a = -Math.PI / 2 + i * Math.PI / 5; pts.push([50 + r * Math.cos(a), 52 + r * Math.sin(a)]); }
      pts.push(pts[0]); P.push(pts);
      const c = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 2; c.push([50 + 8 * Math.cos(a), 52 + 8 * Math.sin(a)]); } P.push(c);
      P.push([[8, 8], [92, 8], [92, 92], [8, 92], [8, 8]]);
    } else if (name === "gear") {
      const g = [], teeth = 14;
      for (let i = 0; i <= teeth * 4; i++) {
        const a = i / (teeth * 4) * Math.PI * 2, r = (i % 4 < 2) ? 40 : 33;
        g.push([50 + r * Math.cos(a), 50 + r * Math.sin(a)]);
      }
      P.push(g);
      const h = []; for (let i = 0; i <= 36; i++) { const a = i / 36 * Math.PI * 2; h.push([50 + 10 * Math.cos(a), 50 + 10 * Math.sin(a)]); } P.push(h);
      for (let j = 0; j < 6; j++) { const a0 = j / 6 * Math.PI * 2, o = []; for (let i = 0; i <= 12; i++) { const a = a0 + i / 12 * Math.PI * 2; o.push([50 + 21 * Math.cos(a0) + 4.5 * Math.cos(a), 50 + 21 * Math.sin(a0) + 4.5 * Math.sin(a)]); } P.push(o); }
    } else {
      // relleno por barrido (bidireccional) de un corazón
      const inside = (x, y) => { const X = (x - 50) / 32, Y = -(y - 46) / 32; return (X * X + Y * Y - 1) ** 3 - X * X * Y ** 3 <= 0; };
      let dir = 1;
      for (let y = 14; y <= 86; y += 1.6) {
        const xs = []; let prev = false;
        for (let x = 8; x <= 92; x += .4) { const i = inside(x, y); if (i !== prev) xs.push(x); prev = i; }
        if (prev) xs.push(92);
        for (let i = 0; i + 1 < xs.length; i += 2) {
          const seg = dir > 0 ? [[xs[i], y], [xs[i + 1], y]] : [[xs[i + 1], y], [xs[i], y]];
          P.push(seg);
        }
        dir = -dir;
      }
    }
    return P;
  }
  function buildJob(paths, frame) {
    const moves = [], g = ["G21 ; mm", "G90", "M4 S0 ; láser dinámico"];
    const S1000 = Math.round(pwr.value * 10), F = spd.value;
    for (const p of paths) {
      moves.push({ x: p[0][0], y: p[0][1], on: false }); g.push(`G0 X${p[0][0].toFixed(2)} Y${(100 - p[0][1]).toFixed(2)}`);
      for (let i = 1; i < p.length; i++) {
        moves.push({ x: p[i][0], y: p[i][1], on: !frame });
        g.push(frame ? `G1 X${p[i][0].toFixed(2)} Y${(100 - p[i][1]).toFixed(2)} S0 F3000`
                     : `G1 X${p[i][0].toFixed(2)} Y${(100 - p[i][1]).toFixed(2)} S${S1000} F${F}`);
      }
    }
    moves.push({ x: 5, y: 5, on: false }); g.push("G0 X5 Y95", "M5 ; láser apagado");
    // índice de línea de G-code por movimiento (3 de cabecera)
    moves.forEach((m, i) => m.line = i + 3);
    return { moves, g, i: 0, frame };
  }
  function bounds(paths) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    paths.flat().forEach(([x, y]) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); });
    return [[[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]];
  }
  function showG(line) {
    if (!job) { gEl.textContent = T("ready"); return; }
    const from = Math.max(0, line - 6), lines = job.g.slice(from, from + 22);
    gEl.innerHTML = lines.map((l, i) => from + i === line ? `<b>${l}</b>` : l).join("\n");
  }
  function draw() {
    ctx.drawImage(wood, 0, 0); ctx.drawImage(burn, 0, 0);
    // vista previa del trabajo
    ctx.strokeStyle = "rgba(31,111,235,.35)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    for (const p of shapes(shape)) { ctx.beginPath(); p.forEach(([x, y], i) => i ? ctx.lineTo(x * k, y * k) : ctx.moveTo(x * k, y * k)); ctx.stroke(); }
    ctx.setLineDash([]);
    // cabezal
    const hx = head.x * k, hy = head.y * k, on = job && job.cur && job.cur.on;
    if (on) {
      const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 26);
      g.addColorStop(0, "rgba(255,240,200,.95)"); g.addColorStop(.25, "rgba(255,106,43,.6)"); g.addColorStop(1, "rgba(255,106,43,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hx, hy, 26, 0, 7); ctx.fill();
    }
    ctx.strokeStyle = job && job.frame ? "#ff3b3b" : "#1b1f24"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(hx, hy, 9, 0, 7); ctx.moveTo(hx - 15, hy); ctx.lineTo(hx + 15, hy); ctx.moveTo(hx, hy - 15); ctx.lineTo(hx, hy + 15); ctx.stroke();
  }
  function run(frame) {
    cancelAnimationFrame(raf);
    const paths = shapes(shape);
    job = buildJob(frame ? bounds(paths) : paths, frame);
    let last = performance.now();
    const speed = () => (frame ? 3000 : +spd.value) / 60 * 6; // mm/s acelerado ×6 para la demo
    const alpha = () => .25 + pwr.value / 100 * .7;
    (function tick(now) {
      let budget = Math.min(.05, (now - last) / 1000) * speed(); last = now;
      while (budget > 0 && job.i < job.moves.length) {
        const m = job.moves[job.i]; job.cur = m;
        const dx = m.x - head.x, dy = m.y - head.y, d = Math.hypot(dx, dy);
        const travel = m.on ? budget : budget * 4; // desplazamientos rápidos
        const stepLen = Math.min(d, travel);
        const nx = head.x + (d ? dx / d * stepLen : 0), ny = head.y + (d ? dy / d * stepLen : 0);
        if (m.on) {
          bctx.strokeStyle = `rgba(40,18,6,${alpha()})`; bctx.lineWidth = shape === "wave" ? 2.2 : 2.6; bctx.lineCap = "round";
          bctx.beginPath(); bctx.moveTo(head.x * k, head.y * k); bctx.lineTo(nx * k, ny * k); bctx.stroke();
        }
        head = { x: nx, y: ny };
        budget -= m.on ? stepLen : stepLen / 4;
        if (stepLen >= d - 1e-6) job.i++;
      }
      showG(job.moves[Math.min(job.i, job.moves.length - 1)].line);
      draw();
      if (job.i < job.moves.length) raf = requestAnimationFrame(tick);
      else { job.cur = null; draw(); $("#laserGo").textContent = T("again"); }
    })(last);
    $("#laserGo").textContent = T("running");
  }
  $$(".seg [data-shape]").forEach(b => b.addEventListener("click", () => {
    $$(".seg [data-shape]").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-checked", x === b); });
    shape = b.dataset.shape; cancelAnimationFrame(raf); job = null; bctx.clearRect(0, 0, S, S);
    $("#laserGo").textContent = T("start"); showG(0); draw();
  }));
  $("#laserGo").onclick = () => { bctx.clearRect(0, 0, S, S); run(false); };
  $("#laserFrame").onclick = () => run(true);
  $("#laserClear").onclick = () => { cancelAnimationFrame(raf); job = null; bctx.clearRect(0, 0, S, S); head = { x: 5, y: 5 }; $("#laserGo").textContent = T("start"); showG(0); draw(); };
  $("#laserGo").textContent = T("start"); showG(0); draw();
  document.addEventListener("langchange", () => { if (!job || job.i >= job.moves.length) { $("#laserGo").textContent = job ? T("again") : T("start"); } if (!job) showG(0); });
})();

/* ======================================================================
   OPENROUTEAI · autorouter A* de dos capas
   ====================================================================== */
(function router() {
  const cv = $("#routeCanvas"), ctx = cv.getContext("2d");
  const C = 20, GW = cv.width / C | 0, GH = cv.height / C | 0, MM = .635;
  let comps = [], nets = [], routes = [], anim = 0, drag = null;
  const NETCOL = ["#e0a458", "#f0b46a", "#d18f45", "#e8c27e"];
  const rnd = n => Math.random() * n | 0;

  function makeComp(type) {
    if (type === "ic") { const n = 4 + rnd(4); return { type, w: n + 1, h: 4, pads: [...Array(n)].flatMap((_, i) => [[i + 1, 0], [i + 1, 4]]) }; }
    if (type === "conn") { const n = 3 + rnd(4); return { type, w: 2, h: n + 1, pads: [...Array(n)].map((_, i) => [1, i + 1]) }; }
    return { type, w: 3, h: 1, pads: [[0, 0], [3, 0]] }; // pasivo
  }
  function overlaps(a, list) {
    return list.some(b => a !== b && a.x - 2 < b.x + b.w + 2 && a.x + a.w + 2 > b.x - 2 && a.y - 2 < b.y + b.h + 2 && a.y + a.h + 2 > b.y - 2);
  }
  function newBoard() {
    comps = [];
    const types = ["ic", "ic", "ic", "conn", "conn", "pas", "pas", "pas", "pas", "pas"];
    for (const t of types) {
      for (let tries = 0; tries < 200; tries++) {
        const c = makeComp(t); c.x = 2 + rnd(GW - c.w - 4); c.y = 2 + rnd(GH - c.h - 4);
        if (!overlaps(c, comps)) { comps.push(c); break; }
      }
    }
    comps.forEach((c, i) => c.id = i);
    // redes: une pads de componentes distintos, sin repetir pads
    const all = comps.flatMap(c => c.pads.map((p, j) => ({ c: c.id, j })));
    for (let i = all.length - 1; i > 0; i--) { const j = rnd(i + 1); [all[i], all[j]] = [all[j], all[i]]; }
    nets = [];
    const used = new Set();
    for (let i = 0; i < all.length && nets.length < 16; i++) {
      const a = all[i]; if (used.has(a.c + ":" + a.j)) continue;
      const b = all.find(q => q.c !== a.c && !used.has(q.c + ":" + q.j));
      if (!b) break; used.add(a.c + ":" + a.j); used.add(b.c + ":" + b.j);
      nets.push({ a, b });
    }
    routes = []; stats(); draw();
  }
  const padPos = p => { const c = comps[p.c]; return [c.x + c.pads[p.j][0], c.y + c.pads[p.j][1]]; };

  function route() {
    cancelAnimationFrame(anim);
    // ocupación por capa: -1 libre, -2 cuerpo, >=0 red
    const occ = [new Int16Array(GW * GH).fill(-1), new Int16Array(GW * GH).fill(-1)];
    const id = (x, y) => y * GW + x;
    comps.forEach(c => { for (let y = c.y; y <= c.y + c.h; y++) for (let x = c.x; x <= c.x + c.w; x++) if (x >= 0 && y >= 0 && x < GW && y < GH) occ[0][id(x, y)] = -2; });
    nets.forEach((n, ni) => [n.a, n.b].forEach(p => { const [x, y] = padPos(p); occ[0][id(x, y)] = ni; occ[1][id(x, y)] = ni; }));
    // primero las redes más cortas
    const order = nets.map((n, i) => i).sort((i, j) => {
      const d = k => { const [a, b] = [padPos(nets[k].a), padPos(nets[k].b)]; return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]); };
      return d(i) - d(j);
    });
    routes = [];
    for (const ni of order) {
      const [s, t] = [padPos(nets[ni].a), padPos(nets[ni].b)];
      const path = astar(s, t, ni, occ, id);
      if (path) {
        path.forEach(([x, y, l]) => { occ[l][id(x, y)] = ni; });
        routes.push({ ni, path, shown: 0 });
      } else routes.push({ ni, path: null });
    }
    animate();
  }
  function astar(s, t, ni, occ, id) {
    const N = GW * GH * 2, g = new Float32Array(N).fill(Infinity), from = new Int32Array(N).fill(-1), closed = new Uint8Array(N);
    const key = (x, y, l) => l * GW * GH + id(x, y);
    const h = (x, y) => { const dx = Math.abs(x - t[0]), dy = Math.abs(y - t[1]); return Math.max(dx, dy) + .414 * Math.min(dx, dy); };
    const heap = []; // montículo binario simple
    const push = n => { heap.push(n); let i = heap.length - 1; while (i) { const p = i - 1 >> 1; if (heap[p].f <= heap[i].f) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
    const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && heap[l].f < heap[m].f) m = l; if (r < heap.length && heap[r].f < heap[m].f) m = r; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return top; };
    const free = (x, y, l) => x >= 0 && y >= 0 && x < GW && y < GH && (occ[l][id(x, y)] === -1 || occ[l][id(x, y)] === ni);
    const k0 = key(s[0], s[1], 0); g[k0] = 0; push({ x: s[0], y: s[1], l: 0, f: h(...s) });
    const D = [[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.414],[1,-1,1.414],[-1,1,1.414],[-1,-1,1.414]];
    let guard = 0;
    while (heap.length && guard++ < 60000) {
      const c = pop(), ck = key(c.x, c.y, c.l);
      if (closed[ck]) continue; closed[ck] = 1;
      if (c.x === t[0] && c.y === t[1]) {
        const out = []; let k = ck;
        while (k !== -1) { const l = k >= GW * GH ? 1 : 0, r = k - l * GW * GH; out.push([r % GW, r / GW | 0, l]); k = from[k]; }
        return out.reverse();
      }
            for (const [dx, dy, w] of D) {
        const nx = c.x + dx, ny = c.y + dy;
        if (!free(nx, ny, c.l)) continue;
        if (dx && dy && (!free(c.x + dx, c.y, c.l) || !free(c.x, c.y + dy, c.l))) continue;
        const nk = key(nx, ny, c.l), ng = g[ck] + w;
        if (ng < g[nk]) { g[nk] = ng; from[nk] = ck; push({ x: nx, y: ny, l: c.l, f: ng + h(nx, ny) }); }
      }
      // vía
      const ol = 1 - c.l;
      if (free(c.x, c.y, ol)) { const nk = key(c.x, c.y, ol), ng = g[ck] + 6; if (ng < g[nk]) { g[nk] = ng; from[nk] = ck; push({ x: c.x, y: c.y, l: ol, f: ng + h(c.x, c.y) }); } }
    }
    return null;
  }
  function animate() {
    let ri = 0;
    const tick = () => {
      if (ri >= routes.length) { stats(); draw(); return; }
      const r = routes[ri];
      if (!r.path) { ri++; } else { r.shown += reduced ? 999 : 2; if (r.shown >= r.path.length) ri++; }
      stats(); draw();
      anim = requestAnimationFrame(tick);
    };
    tick();
  }
  function stats() {
    const ok = routes.filter(r => r.path && r.shown >= r.path.length);
    let len = 0, vias = 0;
    ok.forEach(r => { for (let i = 1; i < r.path.length; i++) { const [a, b] = [r.path[i - 1], r.path[i]]; if (a[2] !== b[2]) vias++; else len += Math.hypot(a[0] - b[0], a[1] - b[1]); } });
    $("#rNets").textContent = `${ok.length} / ${nets.length}`;
    $("#rLen").textContent = Math.round(len * MM * C / C * 1) + " mm";
    $("#rVias").textContent = vias;
  }
  function draw() {
    ctx.fillStyle = "#0a2016"; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = "#14382a";
    for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) ctx.fillRect(x * C + C / 2 - 1, y * C + C / 2 - 1, 2, 2);
    const P = (x, y) => [x * C + C / 2, y * C + C / 2];
    const routedNets = new Set();
    // pistas: capa inferior primero
    for (const layer of [1, 0]) {
      for (const r of routes) {
        if (!r.path) continue;
        const pts = r.path.slice(0, r.shown);
        if (r.shown >= r.path.length) routedNets.add(r.ni);
        ctx.strokeStyle = layer ? "rgba(90,150,255,.75)" : NETCOL[r.ni % NETCOL.length];
        ctx.lineWidth = 7; ctx.lineCap = ctx.lineJoin = "round";
        ctx.beginPath(); let pen = false;
        for (let i = 0; i < pts.length; i++) {
          const [x, y, l] = pts[i], [px, py] = P(x, y);
          if (l !== layer) { pen = false; continue; }
          if (!pen) { ctx.moveTo(px, py); pen = true; } else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
    }
    // vías
    for (const r of routes) if (r.path) for (let i = 1; i < r.shown && i < r.path.length; i++) if (r.path[i][2] !== r.path[i - 1][2]) {
      const [px, py] = P(r.path[i][0], r.path[i][1]);
      ctx.fillStyle = "#d9dde2"; ctx.beginPath(); ctx.arc(px, py, 7, 0, 7); ctx.fill();
      ctx.fillStyle = "#0a2016"; ctx.beginPath(); ctx.arc(px, py, 3, 0, 7); ctx.fill();
    }
    // componentes
    for (const c of comps) {
      const [x0, y0] = P(c.x, c.y), [x1, y1] = P(c.x + c.w, c.y + c.h);
      ctx.fillStyle = c.type === "pas" ? "rgba(30,34,38,.0)" : "#15191c";
      ctx.strokeStyle = "#e9ecef"; ctx.lineWidth = 1.5;
      if (c.type === "ic") { ctx.fillRect(x0 + 6, y0 + 12, x1 - x0 - 12, y1 - y0 - 24); ctx.strokeRect(x0 + 6, y0 + 12, x1 - x0 - 12, y1 - y0 - 24); ctx.beginPath(); ctx.arc(x0 + 16, y0 + 22, 3, 0, 7); ctx.stroke(); }
      else if (c.type === "conn") ctx.strokeRect(x0 - 12, y0 + 6, x1 - x0 + 4, y1 - y0 - 12);
      else ctx.strokeRect(x0 + 8, y0 - 7, x1 - x0 - 16, 14);
      for (const [px, py] of c.pads) {
        const [X, Y] = P(c.x + px, c.y + py);
        ctx.fillStyle = "#e8b46a"; ctx.fillRect(X - 7, Y - 7, 14, 14);
      }
    }
    // ratsnest de redes pendientes o imposibles
    nets.forEach((n, ni) => {
      if (routedNets.has(ni)) return;
      const failed = routes.some(r => r.ni === ni && !r.path);
      const [a, b] = [P(...padPos(n.a)), P(...padPos(n.b))];
      ctx.strokeStyle = failed ? "rgba(255,90,90,.9)" : "rgba(255,255,255,.45)"; ctx.lineWidth = 1.2;
      ctx.setLineDash(failed ? [6, 4] : []); ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); ctx.setLineDash([]);
    });
  }
  // arrastrar componentes
  const toGrid = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * cv.width / C, (e.clientY - r.top) / r.height * cv.height / C]; };
  cv.addEventListener("pointerdown", e => {
    const [gx, gy] = toGrid(e);
    const c = comps.find(c => gx >= c.x - .5 && gx <= c.x + c.w + .5 && gy >= c.y - .5 && gy <= c.y + c.h + .5);
    if (!c) return;
    drag = { c, dx: gx - c.x, dy: gy - c.y, ox: c.x, oy: c.y }; cv.setPointerCapture(e.pointerId); cv.classList.add("dragging");
    cancelAnimationFrame(anim); routes = []; stats();
  });
  cv.addEventListener("pointermove", e => {
    if (!drag) return; const [gx, gy] = toGrid(e), c = drag.c;
    const nx = Math.max(1, Math.min(GW - c.w - 2, Math.round(gx - drag.dx))), ny = Math.max(1, Math.min(GH - c.h - 2, Math.round(gy - drag.dy)));
    const px = c.x, py = c.y; c.x = nx; c.y = ny;
    if (overlaps(c, comps)) { c.x = px; c.y = py; }
    draw();
  });
  const end = () => { drag = null; cv.classList.remove("dragging"); };
  cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
  $("#routeGo").onclick = route;
  $("#routeShuffle").onclick = () => { cancelAnimationFrame(anim); newBoard(); };
  newBoard();
})();

/* ======================================================================
   EFPD · generador de escalas de potenciómetro
   ====================================================================== */
(function scale() {
  const svg = $("#scaleSvg"), NS = "http://www.w3.org/2000/svg";
  const el = (n, a, p = svg) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  const I = { sweep: $("#sweep"), ticks: $("#ticks"), sub: $("#sub"), maxv: $("#maxv") };
  let custom = null, knob = .62;
  const TPL = {
    "300": { sweep: 300, ticks: 11, sub: 4, maxv: 10, labels: null },
    "270": { sweep: 270, ticks: 11, sub: 1, maxv: 10, labels: null },
    db: { sweep: 270, ticks: 9, sub: 1, maxv: 10, labels: ["−∞", "−40", "−30", "−20", "−12", "−6", "−3", "0", "+6"] },
    sel: { sweep: 150, ticks: 6, sub: 0, maxv: 5, labels: ["OFF", "1", "2", "3", "4", "5"] },
  };
  function render() {
    const sweep = +I.sweep.value, n = +I.ticks.value, sub = +I.sub.value, maxv = +I.maxv.value;
    $("#sweepOut").textContent = sweep + "°"; $("#ticksOut").textContent = n; $("#subOut").textContent = sub; $("#maxOut").textContent = maxv;
    svg.innerHTML = "";
    const defs = el("defs", {});
    const lg = el("linearGradient", { id: "alu", x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
    el("stop", { offset: 0, "stop-color": "#d9dde3" }, lg); el("stop", { offset: .5, "stop-color": "#b9bfc8" }, lg); el("stop", { offset: 1, "stop-color": "#cfd4da" }, lg);
    const rg = el("radialGradient", { id: "kn", cx: .4, cy: .35, r: .7 }, defs);
    el("stop", { offset: 0, "stop-color": "#4a4f57" }, rg); el("stop", { offset: 1, "stop-color": "#15181c" }, rg);
    el("rect", { x: 10, y: 10, width: 380, height: 380, rx: 14, fill: "url(#alu)" });
    for (const [x, y] of [[32, 32], [368, 32], [32, 368], [368, 368]]) { el("circle", { cx: x, cy: y, r: 7, fill: "#8d939c" }); el("circle", { cx: x, cy: y, r: 3.4, fill: "#5d636b" }); }
    const cx = 200, cy = 205, R = 112, start = -90 - sweep / 2;
    const pt = (a, r) => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)];
    // arco de referencia
    const [ax, ay] = pt(start, R), [bx, by] = pt(start + sweep, R);
    el("path", { d: `M${ax} ${ay} A${R} ${R} 0 ${sweep > 180 ? 1 : 0} 1 ${bx} ${by}`, fill: "none", stroke: "#1b1e23", "stroke-width": 1.4 });
    const labels = custom && custom.length === n ? custom : null;
    for (let i = 0; i < n; i++) {
      const a = start + sweep * i / (n - 1);
      const [x1, y1] = pt(a, R), [x2, y2] = pt(a, R + 16);
      el("line", { x1, y1, x2, y2, stroke: "#1b1e23", "stroke-width": 2.6, "stroke-linecap": "round" });
      const v = labels ? labels[i] : +(maxv * i / (n - 1)).toFixed(maxv * 1 / (n - 1) % 1 ? 1 : 0);
      const [tx, ty] = pt(a, R + 34);
      const t = el("text", { x: tx, y: ty, "text-anchor": "middle", "dominant-baseline": "central", "font-size": labels ? 13 : 15, "font-family": "Instrument Sans, sans-serif", "font-weight": 600, fill: "#1b1e23" });
      t.textContent = lang() === "es" ? String(v).replace(".", ",") : String(v);
      if (i < n - 1) for (let s = 1; s <= sub; s++) {
        const b = a + sweep / (n - 1) * s / (sub + 1);
        const [p1, q1] = pt(b, R), [p2, q2] = pt(b, R + 8);
        el("line", { x1: p1, y1: q1, x2: p2, y2: q2, stroke: "#1b1e23", "stroke-width": 1.2 });
      }
    }
    // rótulo
    const lab = el("text", { x: 200, y: 372, "text-anchor": "middle", "font-size": 15, "letter-spacing": 3, "font-family": "Bricolage Grotesque, sans-serif", "font-weight": 700, fill: "#1b1e23" });
    lab.textContent = custom === TPL.sel.labels ? "MODE" : custom === TPL.db.labels ? "GAIN" : "VOLUME";
    // mando
    const g = el("g", { id: "knob", style: "cursor:grab" });
    el("circle", { cx, cy: cy + 4, r: 78, fill: "rgba(0,0,0,.25)" }, g);
    el("circle", { cx, cy, r: 76, fill: "url(#kn)", stroke: "#0c0e11", "stroke-width": 2 }, g);
    for (let i = 0; i < 36; i++) { const [x1, y1] = pt(i * 10, 70), [x2, y2] = pt(i * 10, 76); el("line", { x1, y1, x2, y2, stroke: "#2b3037", "stroke-width": 2 }, g); }
    el("circle", { cx, cy, r: 56, fill: "#2a2e35" }, g);
    const ka = start + sweep * knob, [px, py] = pt(ka, 22), [qx, qy] = pt(ka, 66);
    el("line", { x1: px, y1: py, x2: qx, y2: qy, stroke: "#A9B8FF", "stroke-width": 5, "stroke-linecap": "round" }, g);
    const val = labels ? labels[Math.round(knob * (n - 1))] : (lang() === "es" ? (maxv * knob).toFixed(1).replace(".", ",") : (maxv * knob).toFixed(1));
    const vt = el("text", { x: cx, y: cy + 6, "text-anchor": "middle", "font-size": 16, "font-family": "Instrument Sans, sans-serif", "font-weight": 600, fill: "#dfe3ea" }, g);
    vt.textContent = val;
    if (labels) knob = Math.round(knob * (n - 1)) / (n - 1);
  }
  let dragging = false;
  const angleFrom = e => {
    const r = svg.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 400 - 200, y = (e.clientY - r.top) / r.height * 400 - 205;
    const sweep = +I.sweep.value, start = -90 - sweep / 2;
    let a = Math.atan2(y, x) * 180 / Math.PI; let rel = ((a - start) % 360 + 360) % 360;
    if (rel > sweep) rel = rel - sweep < (360 - sweep) / 2 ? sweep : 0;
    knob = rel / sweep; render();
  };
  svg.addEventListener("pointerdown", e => { if (!e.target.closest("#knob")) return; dragging = true; svg.setPointerCapture(e.pointerId); angleFrom(e); });
  svg.addEventListener("pointermove", e => dragging && angleFrom(e));
  svg.addEventListener("pointerup", () => dragging = false);
  svg.addEventListener("wheel", e => { if (!e.target.closest("#knob")) return; e.preventDefault(); knob = Math.max(0, Math.min(1, knob - Math.sign(e.deltaY) * .02)); render(); }, { passive: false });
  Object.values(I).forEach(inp => inp.addEventListener("input", () => {
    if (custom && (inp === I.ticks || inp === I.maxv)) custom = null;
    render();
  }));
  $$(".seg [data-tpl]").forEach(b => b.addEventListener("click", () => {
    $$(".seg [data-tpl]").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-checked", x === b); });
    const t = TPL[b.dataset.tpl];
    I.sweep.value = t.sweep; I.ticks.value = t.ticks; I.sub.value = t.sub; I.maxv.value = t.maxv; custom = t.labels; render();
  }));
  render();
  document.addEventListener("langchange", render);
})();

/* ======================================================================
   OPEN LVGL STUDIO · lienzo ⇄ YAML
   ====================================================================== */
(function lvgl() {
  const scr = $("#lvScreen"), ta = $("#lvYaml"), sync = $("#lvSync"), del = $("#lvDel");
  const SW = 1024, SH = 600;
  const initial = l => {
    const L = l === "en" ? ["Living room", "Lamp", "Heater", "Scenes", "Climate", "21.5°"] : ["Salón", "Lámpara", "Radiador", "Escenas", "Clima", "21,5°"];
    return [
      { type: "label", id: "titulo", x: 32, y: 22, width: 360, height: 56, text: L[0] },
      { type: "arc", id: "temp_arc", x: 40, y: 110, width: 240, height: 240, value: 62 },
      { type: "label", id: "temp_txt", x: 98, y: 205, width: 140, height: 50, text: L[5] },
      { type: "label", id: "lbl_lamp", x: 340, y: 118, width: 260, height: 50, text: L[1] },
      { type: "switch", id: "sw_lamp", x: 620, y: 112, width: 130, height: 62, checked: true },
      { type: "label", id: "lbl_heater", x: 340, y: 222, width: 260, height: 50, text: L[2] },
      { type: "slider", id: "sl_heater", x: 340, y: 280, width: 620, height: 54, value: 60 },
      { type: "button", id: "btn_scenes", x: 40, y: 460, width: 220, height: 96, text: L[3] },
      { type: "button", id: "btn_climate", x: 290, y: 460, width: 220, height: 96, text: L[4] },
    ];
  };
  let W = initial(lang()), dirty = false;
  let sel = null, counter = 1;
  function toYaml() {
    const L = ["lvgl:", "  pages:", "    - id: salon", "      bg_color: 0x0B161F", "      widgets:"];
    for (const w of W) {
      L.push(`        - ${w.type}:`, `            id: ${w.id}`, `            x: ${w.x}`, `            y: ${w.y}`, `            width: ${w.width}`, `            height: ${w.height}`);
      if (w.type === "label") L.push(`            text: "${w.text}"`);
      if (w.type === "button") L.push(`            widgets:`, `              - label:`, `                  align: CENTER`, `                  text: "${w.text}"`);
      if (w.type === "slider" || w.type === "arc") L.push(`            value: ${w.value}`);
      if (w.type === "switch") L.push(`            state:`, `              checked: ${w.checked}`);
    }
    return L.join("\n");
  }
  function fromYaml(src) {
    const lines = src.split("\n"), out = []; let cur = null;
    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i]; if (!ln.trim() || ln.trim().startsWith("#")) continue;
      let m = ln.match(/^ {8}- (button|label|switch|slider|arc):\s*$/);
      if (m) { cur = { type: m[1], x: 0, y: 0, width: 100, height: 50, text: "", value: 50, checked: false, id: m[1] + "_" + i }; out.push(cur); continue; }
      m = ln.match(/^\s+([a-z_]+):\s*(.*)$/);
      if (!m) { if (/^\s*- /.test(ln)) continue; throw i + 1; }
      if (!cur) continue;
      const [, k, vRaw] = m, v = vRaw.replace(/^"(.*)"$/, "$1");
      if (["x", "y", "width", "height", "value"].includes(k)) { if (!/^-?\d+$/.test(v)) throw i + 1; cur[k] = +v; }
      else if (k === "text") cur.text = v;
      else if (k === "id") cur.id = v;
      else if (k === "checked") cur.checked = v === "true";
    }
    return out;
  }
  const pct = (v, t) => (v / t * 100) + "%";
  function render() {
    scr.innerHTML = "";
    for (const w of W) {
      const d = document.createElement("div");
      d.className = `lvw lvw-${w.type}` + (w === sel ? " sel" : "") + (w.type === "switch" && w.checked ? " on" : "");
      Object.assign(d.style, { left: pct(w.x, SW), top: pct(w.y, SH), width: pct(w.width, SW), height: pct(w.height, SH) });
      if (w.type === "label" || w.type === "button") d.textContent = w.text;
      if (w.type === "label" && w.height >= 50) d.style.fontSize = "3.4cqw";
      if (w.type === "slider") d.style.setProperty("--v", w.value + "%");
      if (w.type === "arc") d.style.setProperty("--v", w.value);
      d.title = w.id;
      d.addEventListener("pointerdown", e => startDrag(e, w, d));
      d.addEventListener("dblclick", () => { if (w.type === "switch") { w.checked = !w.checked; dirty = true; commit(); } });
      scr.appendChild(d);
    }
    del.disabled = !sel;
  }
  function commit() { ta.value = toYaml(); sync.textContent = T("synced"); sync.classList.remove("err"); render(); }
  function startDrag(e, w, d) {
    e.preventDefault(); sel = w; render();
    const r = scr.getBoundingClientRect(), sx = SW / r.width, sy = SH / r.height;
    const ox = e.clientX, oy = e.clientY, x0 = w.x, y0 = w.y;
    const move = ev => {
      dirty = true;
      w.x = Math.max(0, Math.min(SW - w.width, Math.round((x0 + (ev.clientX - ox) * sx) / 4) * 4));
      w.y = Math.max(0, Math.min(SH - w.height, Math.round((y0 + (ev.clientY - oy) * sy) / 4) * 4));
      commit();
    };
    const up = () => { removeEventListener("pointermove", move); removeEventListener("pointerup", up); };
    addEventListener("pointermove", move); addEventListener("pointerup", up);
  }
  scr.addEventListener("pointerdown", e => { if (e.target === scr) { sel = null; render(); } });
  let t;
  ta.addEventListener("input", () => {
    clearTimeout(t); sync.textContent = T("editing"); sync.classList.remove("err");
    t = setTimeout(() => {
      try { W = fromYaml(ta.value); sel = null; render(); sync.textContent = T("synced"); dirty = true; }
      catch (line) { sync.textContent = T("badLine")(line); sync.classList.add("err"); }
    }, 300);
  });
  const DEF = {
    button: { width: 200, height: 80, text: "Botón" }, label: { width: 240, height: 50, text: "Texto" },
    switch: { width: 120, height: 58, checked: false }, slider: { width: 400, height: 50, value: 40 }, arc: { width: 180, height: 180, value: 50 },
  };
  $$("[data-add]").forEach(b => b.addEventListener("click", () => {
    const type = b.dataset.add, w = { type, id: `${type}_${counter++}`, x: 600, y: 400, ...DEF[type] };
    if (type === "button") w.text = lang() === "en" ? "Button" : "Botón";
    if (type === "label") w.text = lang() === "en" ? "Text" : "Texto";
    w.x = Math.min(w.x, SW - w.width); w.y = Math.min(w.y, SH - w.height);
    W.push(w); sel = w; dirty = true; commit();
  }));
  del.addEventListener("click", () => { if (!sel) return; W = W.filter(w => w !== sel); sel = null; dirty = true; commit(); });
  commit();
  document.addEventListener("langchange", () => { if (!dirty) { W = initial(lang()); sel = null; } commit(); });
})();
setLang(lang(), false);
})();
