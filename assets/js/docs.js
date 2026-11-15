/* Páginas de guía de cada programa: se construyen desde window.DOC y window.DOC_UI (ES/EN). */
(() => {
"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const D = window.DOC, U = window.DOC_UI;
const lang = () => document.documentElement.lang === "en" ? "en" : "es";
const L = o => o == null ? "" : typeof o === "string" ? o : (o[lang()] ?? o.es ?? "");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const K = { es: { Supr: "Supr", Ctrl: "Ctrl", Shift: "Mayús" }, en: { Supr: "Del", Ctrl: "Ctrl", Shift: "Shift" } };
const keys = sc => sc ? sc.split("+").map(k => `<kbd>${esc(K[lang()][k] || k || "+")}</kbd>`).join("") : "";
const icon = (name, cls = "ic") => name ? `<img class="${cls}" src="${D.iconDir}${name}${D.iconExt}" alt="" loading="lazy">` : `<span class="${cls} ic-none"></span>`;

const TXT = {
  es: { back: "Volver a la portada", gh: "Ver en GitHub", dl: "Descargar", what: "Qué es", install: "Instalación",
        use: "Cómo se usa", win: "La ventana principal", winHint: "Pulsa un número para ver qué es cada zona.",
        menus: "Menús", menusHint: "Pulsa un menú para ver sus opciones, atajos y para qué sirve cada una.",
        icons: "Barras de herramientas e iconos", iconsHint: "Pasa el ratón o pulsa un icono para ver su nombre y su función.",
        keys: "Atajos de teclado", gallery: "Pantallas y diálogos", tips: "Consejos", panels: "Paneles de ajustes",
        strat: "Estrategias de enrutado", cli: "Línea de comandos", realMenu: "Captura real del menú",
        diagram: "Esquema de la ventana (los iconos son los reales del programa)", other: "Otras guías",
        action: "Acción", shortcut: "Atajo", toc: "En esta página", title: "Guía de uso" },
  en: { back: "Back to home", gh: "View on GitHub", dl: "Download", what: "What it is", install: "Installation",
        use: "How to use it", win: "The main window", winHint: "Click a number to see what each area is.",
        menus: "Menus", menusHint: "Click a menu to see its options, shortcuts and what each one does.",
        icons: "Toolbars and icons", iconsHint: "Hover or click an icon to see its name and what it does.",
        keys: "Keyboard shortcuts", gallery: "Screens and dialogs", tips: "Tips", panels: "Settings panels",
        strat: "Routing strategies", cli: "Command line", realMenu: "Real screenshot of the menu",
        diagram: "Window layout (the icons are the program's real ones)", other: "Other guides",
        action: "Action", shortcut: "Shortcut", toc: "On this page", title: "User guide" },
};
const T = k => TXT[lang()][k];
const GUIDES = [["openlaser", "OpenLaser Studio", "var(--laser)"], ["openroute", "OpenRouteAI", "var(--route)"],
                ["efpd", "Electronic Front Panel Designer", "var(--panel)"], ["lvgl", "Open LVGL Studio", "var(--lvgl)"]];

let openMenu = 0;
function render() {
  const l = lang();
  document.title = `${D.name} · ${T("title")} · Aleluya-Git`;
  const sections = [["intro", T("what")], ["instalar", T("install")], ["uso", T("use")], ["ventana", T("win")],
    ["menus", T("menus")], ["iconos", T("icons")]];
  if (D.panels) sections.push(["paneles", T("panels")]);
  sections.push(["atajos", T("keys")], ["galeria", T("gallery")], ["consejos", T("tips")]);

  const hero = `
  <header class="d-hero">
    <a class="d-back" href="index.html#${D.anchor}">← ${T("back")}</a>
    <div class="d-hero-grid">
      <img class="d-icon" src="${D.icon}" alt="" width="120" height="120">
      <div>
        <p class="d-kicker">${T("title")}</p>
        <h1>${esc(D.name)}</h1>
        <p class="d-lede">${esc(L(D.lede))}</p>
        <ul class="d-meta">${D.meta.map(m => `<li>${esc(L(m))}</li>`).join("")}</ul>
        <div class="row">
          <a class="btn btn-solid" href="${D.repo}" target="_blank" rel="noopener">${T("gh")}</a>
          ${D.download ? `<a class="btn btn-ghost" href="${D.download}" target="_blank" rel="noopener">${T("dl")}</a>` : ""}
        </div>
      </div>
      ${D.logo ? `<div class="d-logo ${D.logoBg === "light" ? "on-light" : ""}"><img src="${D.logo}" alt="${esc(D.name)}"></div>` : ""}
    </div>
  </header>`;

  const toc = `<nav class="d-toc" aria-label="${T("toc")}"><p>${T("toc")}</p>${sections.map(([id, t]) => `<a href="#${id}">${esc(t)}</a>`).join("")}</nav>`;

  const intro = `<section id="intro"><h2>${T("what")}</h2>${L(D.intro).map(p => `<p>${esc(p)}</p>`).join("")}</section>`;
  const install = `<section id="instalar"><h2>${T("install")}</h2><ul class="d-list">${L(D.install).map(p => `<li>${p}</li>`).join("")}</ul></section>`;
  const steps = `<section id="uso"><h2>${T("use")}</h2><ol class="d-steps">${D.steps.map((s, i) => `
      <li><div class="d-step-text"><span class="d-num">${i + 1}</span><h3>${esc(L(s.t))}</h3><p>${esc(L(s.d))}</p></div>
      ${s.img ? `<button class="d-thumb zoom" data-src="${s.img}" aria-label="${esc(L(s.t))}"><img src="${s.img}" alt="" loading="lazy"></button>` : ""}</li>`).join("")}</ol></section>`;

  let win;
  if (D.window) {
    win = `<section id="ventana"><h2>${T("win")}</h2><p class="d-hint">${T("winHint")}</p>
      <div class="d-annot">
        <figure class="d-shot"><img src="${D.window.img}" alt="${esc(D.name)}">
          ${D.window.spots.map((s, i) => `<button class="spot" style="left:${s.x}%;top:${s.y}%" data-i="${i}" aria-label="${i + 1}. ${esc(L(s.t))}">${i + 1}</button>`).join("")}
        </figure>
        <ol class="d-legend">${D.window.spots.map((s, i) => `<li data-i="${i}" tabindex="0"><span class="d-num">${i + 1}</span><div><b>${esc(L(s.t))}</b><p>${esc(L(s.d))}</p></div></li>`).join("")}</ol>
      </div></section>`;
  } else {
    const g = D.diagram;
    const tb = g.toolbar.map(n => n === "-" ? `<i class="sep"></i>` : icon(n, "dg-ic")).join("");
    win = `<section id="ventana"><h2>${T("win")}</h2><p class="d-hint">${T("diagram")}</p>
      <div class="dg">
        <div class="dg-menu">${U.menus.map(m => `<span>${esc(L(m.t))}</span>`).join("")}</div>
        <div class="dg-tb">${tb}</div>
        <div class="dg-body">
          <div class="dg-panel"><b>${esc(L(g.left.t))}</b><div class="dg-tabs">${L(g.left.tabs).map(t => `<span>${esc(t)}</span>`).join("")}</div><p>${esc(L(g.left.d))}</p></div>
          <div class="dg-center"><div class="dg-tabs">${L(g.center.tabs).map((t, i) => `<span class="${i ? "" : "on"}">${esc(t)}</span>`).join("")}</div>
            <img src="${g.center.img}" alt=""><p>${esc(L(g.center.d))}</p></div>
          <div class="dg-panel"><b>${esc(L(g.right.t))}</b>${L(g.right.groups).map(t => `<span class="dg-group">${esc(t)}</span>`).join("")}<p>${esc(L(g.right.d))}</p></div>
        </div>
      </div></section>`;
  }

  const itemHTML = it => {
    if (it === "-") return `<li class="sep" role="separator"></li>`;
    if (it.items) return `<li class="d-sub"><div class="mi">${icon(it.icon)}<span class="ml">${esc(L(it.sub))}</span><span class="mk">▸</span></div><ul>${it.items.map(itemHTML).join("")}</ul></li>`;
    const tip = L(it.tip);
    return `<li><div class="mi">${icon(it.icon)}<span class="ml">${esc(L(it.l))}${tip ? `<small>${esc(tip)}</small>` : ""}</span><span class="mk">${keys(it.sc)}</span></div></li>`;
  };
  const menuImg = D.menuImgs && D.menuImgs[openMenu];
  const menus = `<section id="menus"><h2>${T("menus")}</h2><p class="d-hint">${T("menusHint")}</p>
    <div class="d-menubar" role="tablist">${U.menus.map((m, i) => `<button role="tab" aria-selected="${i === openMenu}" data-m="${i}">${esc(L(m.t))}</button>`).join("")}</div>
    <div class="d-menu-wrap ${menuImg ? "with-img" : ""}">
      <ul class="d-menu" role="tabpanel">${U.menus[openMenu].items.map(itemHTML).join("")}</ul>
      ${menuImg ? `<figure class="d-menu-img"><button class="zoom" data-src="${menuImg}"><img src="${menuImg}" alt=""></button><figcaption>${T("realMenu")}</figcaption></figure>` : ""}
    </div></section>`;

  const bars = `<section id="iconos"><h2>${T("icons")}</h2><p class="d-hint">${T("iconsHint")}</p>
    ${U.bars.map((b, bi) => `<div class="d-bar"><h3>${esc(L(b.t))}</h3>
      <div class="d-bar-row">${b.items.map((it, ii) => it === "-" ? `<i class="sep"></i>` :
        `<button class="d-ib" data-b="${bi}" data-i="${ii}" aria-label="${esc(L(it.l))}">${icon(it.icon)}</button>`).join("")}</div>
      <div class="d-bar-info" aria-live="polite"></div></div>`).join("")}</section>`;

  let panels = "";
  if (D.panels) {
    panels = `<section id="paneles"><h2>${T("panels")}</h2><dl class="d-defs">${D.panels.map(p => `<div><dt>${esc(L(p.t))}</dt><dd>${esc(L(p.d))}</dd></div>`).join("")}</dl>
      <h3 class="d-h3">${T("strat")}</h3><dl class="d-defs code">${D.strategies.map(([k, v]) => `<div><dt><code>${k}</code></dt><dd>${esc(L(v))}</dd></div>`).join("")}</dl>
      <h3 class="d-h3">${T("cli")}</h3><pre class="d-pre">${esc(D.cli)}</pre></section>`;
  }

  const seen = new Set(), sc = [];
  const collect = items => items.forEach(it => {
    if (it === "-") return;
    if (it.items) return collect(it.items);
    const key = L(it.l);
    if (it.sc && !seen.has(key)) { seen.add(key); sc.push(it); }
  });
  U.menus.forEach(m => collect(m.items)); U.bars.forEach(b => collect(b.items));
  const short = `<section id="atajos"><h2>${T("keys")}</h2><div class="d-keys">${sc.map(it => `<div>${icon(it.icon)}<span>${esc(L(it.l))}</span><span class="mk">${keys(it.sc)}</span></div>`).join("")}</div></section>`;

  const gal = `<section id="galeria"><h2>${T("gallery")}</h2><div class="d-gallery">${D.gallery.map(g => `
      <figure><button class="zoom" data-src="${g.img}" aria-label="${esc(L(g.t))}"><img src="${g.img}" alt="" loading="lazy"></button>
      <figcaption><b>${esc(L(g.t))}</b>${esc(L(g.d))}</figcaption></figure>`).join("")}</div></section>`;
  const tips = `<section id="consejos"><h2>${T("tips")}</h2><div class="d-tips">${D.tips.map(t => `<div><b>${esc(L(t.t))}</b><p>${esc(L(t.d))}</p></div>`).join("")}</div></section>`;
  const others = `<section class="d-others"><h2>${T("other")}</h2><div class="row">${GUIDES.filter(g => g[0] !== D.id).map(([id, n, c]) => `<a class="btn btn-ghost" style="--c:${c}" href="${id}.html">${n}</a>`).join("")}</div></section>`;

  $("#doc").innerHTML = hero + `<div class="d-layout">${toc}<article class="d-body">${intro}${install}${steps}${win}${menus}${bars}${panels}${short}${gal}${tips}${others}</article></div>`;
  wire();
}

function wire() {
  // anotaciones
  const spots = $$(".spot"), items = $$(".d-legend li");
  const pick = i => {
    spots.forEach(s => s.classList.toggle("on", s.dataset.i == i));
    items.forEach(li => li.classList.toggle("on", li.dataset.i == i));
  };
  spots.forEach(s => s.addEventListener("click", () => { pick(s.dataset.i); items[s.dataset.i].scrollIntoView({ block: "nearest", behavior: "smooth" }); }));
  items.forEach(li => { li.addEventListener("mouseenter", () => pick(li.dataset.i)); li.addEventListener("focus", () => pick(li.dataset.i)); li.addEventListener("click", () => pick(li.dataset.i)); });
  // menús
  $$(".d-menubar button").forEach(b => b.addEventListener("click", () => {
    openMenu = +b.dataset.m; const y = scrollY; render(); scrollTo(0, y); $(`.d-menubar button[data-m="${openMenu}"]`).focus();
  }));
  // iconos
  $$(".d-ib").forEach(b => {
    const show = () => {
      const it = U.bars[b.dataset.b].items[b.dataset.i], box = b.closest(".d-bar").querySelector(".d-bar-info");
      $$(".d-ib", b.closest(".d-bar")).forEach(x => x.classList.toggle("on", x === b));
      const tip = L(it.tip);
      box.innerHTML = `${icon(it.icon, "ic big")}<div><b>${esc(L(it.l))}</b> ${keys(it.sc)}${tip ? `<p>${esc(tip)}</p>` : ""}</div>`;
    };
    b.addEventListener("mouseenter", show); b.addEventListener("focus", show); b.addEventListener("click", show);
  });
  $$(".d-bar").forEach(bar => { const first = $(".d-ib", bar); if (first) first.dispatchEvent(new Event("focus")); });
  // lightbox
  $$(".zoom").forEach(b => b.addEventListener("click", () => {
    const lb = $("#lightbox"); $("img", lb).src = b.dataset.src; lb.hidden = false; $(".lb-close", lb).focus();
  }));
  // toc activo
  const links = $$(".d-toc a");
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-30% 0px -65% 0px" });
  $$(".d-body > section[id]").forEach(s => io.observe(s));
}

/* ---------- idioma, navegación y lightbox ---------- */
function setLang(l, save = true) {
  document.documentElement.lang = l;
  if (save) try { localStorage.setItem("lang", l); } catch (e) {}
  $$("[data-setlang]").forEach(b => b.setAttribute("aria-pressed", b.dataset.setlang === l));
  for (const attr of ["aria", "title", "alt"]) {
    $$(`[data-${attr}-${l}]`).forEach(el => el.setAttribute(attr === "aria" ? "aria-label" : attr, el.dataset[attr + l[0].toUpperCase() + l[1]]));
  }
  render();
}
$$("[data-setlang]").forEach(b => b.addEventListener("click", () => setLang(b.dataset.setlang)));
const nav = $(".nav"), onScroll = () => nav.classList.toggle("scrolled", scrollY > 40);
addEventListener("scroll", onScroll, { passive: true }); onScroll();
const toggle = $(".nav-toggle"), menu = $("#menu");
toggle.addEventListener("click", () => { const o = menu.classList.toggle("open"); toggle.setAttribute("aria-expanded", o); });
const lb = $("#lightbox");
lb.addEventListener("click", () => { lb.hidden = true; });
addEventListener("keydown", e => { if (e.key === "Escape") lb.hidden = true; });
document.documentElement.style.setProperty("--c", D.color);
setLang(lang(), false);
if (location.hash) setTimeout(() => { const t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }, 50);
})();
