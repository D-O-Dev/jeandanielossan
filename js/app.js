/* Affichage du portfolio à partir des données (S). Aucun HTML de projet n'est écrit à la main. */
const KEY = "jada_portfolio_v1", $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clone = o => JSON.parse(JSON.stringify(o));
const safeUrl = u => /^(https?:|mailto:|tel:|assets\/|data:image\/|data:application\/pdf|\.\/|#)/i.test(u || "") ? u : "";
window.loadState = () => { try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r) } catch (e) { console.warn("Lecture impossible", e) } return clone(DEFAULT_DATA) };
window.S = loadState();
let filter = "Tous";
window.toast = m => { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 2600) };
const fmt = d => d ? d.replace(/^(\d{4})-(\d{2})$/, "$2/$1") : "";
const period = p => [fmt(p.startDate), fmt(p.endDate)].filter(Boolean).join(" → ");
const list = a => a && a.length ? `<ul>${a.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : "";
const block = (t, v) => v && String(v).trim() ? `<h4>${t}</h4><p>${esc(v)}</p>` : "";

window.applyTheme = () => {
  const t = S.theme, r = document.documentElement.style, m = { bg: "--bg", surface: "--surface", text: "--text", muted: "--muted", accent: "--accent", accent2: "--accent-2", border: "--border", onAccent: "--on-accent", fontHead: "--font-head", fontBody: "--font-body", maxw: "--maxw", space: "--space", radius: "--radius", shadow: "--shadow", dur: "--dur" };
  for (const k in m) if (t[k]) r.setProperty(m[k], t[k]);
  document.documentElement.dataset.anim = t.anim === false ? "off" : "on"
};

const R = {
  home() {
    const p = S.profile, w = p.name.split(" "), last = w.pop();
    const marquee = [...new Set(S.skills.flatMap(c => c.items.map(i => i.n)))].slice(0, 10).map(n => `<span>${esc(n)}</span><i>✦</i>`).join("");
    return `<section id="home" class="hero"><div class="wrap grid"><div>
    <p class="muted">${esc(p.title)}</p><h1>${esc(w.join(" "))} <span class="gold">${esc(last)}</span></h1>
    <p class="lead">${esc(p.intro)}</p>${p.approach ? `<p>${esc(p.approach)}</p>` : ""}
    <div class="cta"><a class="btn btn-gold" href="#projects">Voir mes réalisations</a><a class="btn" href="#contact">Me contacter</a><a class="btn" href="#" data-cv>Télécharger le CV</a></div>
    <ul class="domains">${p.domains.map(d => `<li class="chip">${esc(d)}</li>`).join("")}</ul></div>
    ${p.photo ? `<img class="photo" src="${esc(p.photo)}" alt="${esc(p.photoAlt)}">` : ""}</div></section>
    <div class="strip" aria-hidden="true"><div>${marquee + marquee}</div></div>`
  },
  about() {
    const p = S.profile, ed = S.education.filter(e => e.title).map(e => `<div class="tl"><b>${esc(e.title)}</b><small>${esc([e.place, e.period].filter(Boolean).join(" · "))}</small></div>`).join("");
    const ex = S.experiences.map(e => `<div class="tl"><b>${esc(e.role)}</b><small>${esc([e.place, e.period].filter(Boolean).join(" · "))}</small></div>`).join("");
    const pers = S.projects.filter(x => x.visible && !x.jada && x.category !== "Entrepreneuriat").map(x => `<div class="tl"><b>${esc(x.title)}</b><small>${esc(period(x))}</small></div>`).join("");
    return `<section id="about"><div class="wrap"><h2>À propos</h2><div class="two">
   <div class="card"><h3>Parcours scolaire</h3>${ed || '<p class="muted">À compléter.</p>'}</div>
   <div class="card"><h3>Expérience professionnelle</h3>${ex || '<p class="muted">Aucune expérience renseignée.</p>'}</div>
   <div class="card"><h3>Projets personnels</h3>${pers}</div>
   <div class="card"><h3>Initiative entrepreneuriale</h3><p>${esc(p.jada.vision)}</p></div>
   ${p.objectives ? `<div class="card"><h3>Objectifs</h3><p>${esc(p.objectives)}</p></div>` : ""}</div></div></section>`
  },
  skills() {
    return `<section id="skills"><div class="wrap"><h2>Compétences</h2><p class="sub">Technologies utilisées dans mes projets et mon parcours.</p><div class="cards">${S.skills.map(c => `<div class="card"><h3>${esc(c.cat)}</h3><ul class="domains">${c.items.map(i => `<li class="chip" ${i.desc ? `title="${esc(i.desc)}"` : ""}>${esc(i.n)}${i.level ? ` · ${esc(i.level)}` : ""}</li>`).join("")}</ul></div>`).join("") || '<div class="empty">Aucune compétence.</div>'}</div></div></section>`
  },
  projects() {
    const vis = S.projects.filter(p => p.visible !== false), cats = ["Tous", ...new Set(vis.map(p => p.category).filter(Boolean))];
    return `<section id="projects"><div class="wrap"><h2>Réalisations</h2><p class="sub">Terminés, prototypes et visions : chaque statut est indiqué honnêtement.</p>
  <div class="filters" role="group" aria-label="Filtrer par catégorie">${cats.map(c => `<button aria-pressed="${c === filter}" data-filter="${esc(c)}">${esc(c)}</button>`).join("")}</div><div id="pgrid"></div></div></section>`
  },
  experience() { return `<section id="experience"><div class="wrap"><h2>Expériences</h2>${S.experiences.map(e => `<article class="card" style="margin-bottom:1rem"><h3>${esc(e.role)}</h3><p class="muted">${esc([e.place, e.period].filter(Boolean).join(" · "))}</p>${e.description ? `<p>${esc(e.description)}</p>` : ""}${e.tech?.length ? `<ul class="domains">${e.tech.map(t => `<li class="chip">${esc(t)}</li>`).join("")}</ul>` : ""}</article>`).join("") || '<div class="empty">Aucune expérience renseignée.</div>'}</div></section>` },
  jada() {
    const j = S.profile.jada, rel = S.projects.filter(p => p.jada && p.visible !== false && p.id !== "p7");
    return `<section id="jada"><div class="wrap jada"><div><h2>Jada Firmament</h2><p>${esc(j.vision)}</p>${j.goals ? `<h3>Objectifs</h3><p>${esc(j.goals)}</p>` : ""}
  ${rel.length ? `<h3>Projets associés</h3><ul class="domains">${rel.map(p => `<li><button class="chip" data-open="${p.id}">${esc(p.title)}</button></li>`).join("")}</ul>` : ""}
  ${j.platforms?.length ? `<p>${j.platforms.filter(l => safeUrl(l.url)).map(l => `<a href="${esc(l.url)}" rel="noopener" target="_blank">${esc(l.label)}</a>`).join(" · ")}</p>` : ""}</div>
  <img src="assets/logos/jada-firmament.png" alt="Logo officiel Jada Firmament : lettres dorées sur fond noir" loading="lazy"></div></section>`},
  contact() {
    const c = S.profile.contact, links = c.links.filter(l => l.label && safeUrl(l.url));
    return `<section id="contact"><div class="wrap"><h2>Contact</h2>
  ${c.email || c.phone || links.length ? `<p>${c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a><br>` : ""}${c.phone ? `<a href="tel:${esc(c.phone)}">${esc(c.phone)}</a><br>` : ""}${links.map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join(" · ")}</p>` : '<div class="empty">Les coordonnées publiques seront ajoutées prochainement.</div>'}
  <p><a class="btn" href="#" data-cv>Télécharger le CV</a></p>
  ${c.email ? `<form class="contact" id="cform"><p class="muted">Ce formulaire n'envoie rien par un serveur : il ouvre votre application e-mail avec le message pré-rempli.</p>
   <label>Nom<input name="n" required></label><label>Message<textarea name="m" required></textarea></label><button class="btn btn-gold">Préparer l'e-mail</button></form>`: ""}</div></section>`
  }
};
function cardHtml(p) {
  return `<button class="card pcard" data-open="${p.id}">${p.coverImage ? `<img class="cover" src="${esc(p.coverImage)}" alt="Image de couverture : ${esc(p.title)}" loading="lazy">` : `<div class="cover" aria-hidden="true">${esc(p.title[0] || "?")}</div>`}
 <div class="body"><span class="status ${p.status === "done" ? "done" : ""}">${STATUS[p.status] || STATUS.unknown}</span><h3>${esc(p.title)}</h3><p class="muted">${esc(p.summary)}</p>
 ${p.technologies.length ? `<ul class="domains">${p.technologies.slice(0, 4).map(t => `<li class="chip">${esc(t)}</li>`).join("")}</ul>` : ""}</div></button>`
}
function renderGrid() {
  const g = $("#pgrid"); if (!g) return; const v = S.projects.filter(p => p.visible !== false && (filter === "Tous" || p.category === filter));
  g.innerHTML = v.length ? `<div class="cards">${v.map(cardHtml).join("")}</div>` : `<div class="empty">Aucun projet dans cette catégorie. Ajoutez-en depuis le mode édition.</div>`;
  $$(".filters button").forEach(b => b.setAttribute("aria-pressed", b.dataset.filter === filter))
}
function openProject(id) {
  const p = S.projects.find(x => x.id === id); if (!p) return; const m = $("#modal");
  m.innerHTML = `<button class="btn close" data-close>Fermer</button><span class="status ${p.status === "done" ? "done" : ""}">${STATUS[p.status] || STATUS.unknown}</span><h2 id="mTitle">${esc(p.title)}</h2>
  ${p.coverImage ? `<img src="${esc(p.coverImage)}" alt="Couverture : ${esc(p.title)}">` : ""}<p class="muted">${esc([p.category, period(p)].filter(Boolean).join(" · "))}</p>
  ${block("Présentation", p.summary)}${block("Description", p.description)}${block("Problème traité", p.problem)}${block("Objectif", p.objective)}
  ${p.features.length ? `<h4>Fonctionnalités</h4>${list(p.features)}` : ""}${p.technologies.length ? `<h4>Technologies</h4><ul class="domains">${p.technologies.map(t => `<li class="chip">${esc(t)}</li>`).join("")}</ul>` : ""}
  ${block("Mon rôle", p.role)}${block("Difficultés rencontrées", p.challenges)}${block("Solutions apportées", p.solution)}${block("Enseignements", p.lessons)}
  ${p.gallery.length ? `<h4>Captures</h4><div class="gallery">${p.gallery.map((g, i) => `<img src="${esc(g)}" alt="Capture ${i + 1} de ${esc(p.title)}">`).join("")}</div>` : ""}
  <p style="margin-top:1.2rem">${safeUrl(p.demoUrl) ? `<a class="btn btn-gold" href="${esc(p.demoUrl)}" target="_blank" rel="noopener">Démonstration</a> ` : ""}${safeUrl(p.repositoryUrl) ? `<a class="btn" href="${esc(p.repositoryUrl)}" target="_blank" rel="noopener">Code source</a>` : ""}</p>`;
  m.showModal()
}
window.renderAll = () => {
  applyTheme(); const p = S.profile; document.title = `${p.name} — Développeur d'applications`;
  $("#brand").textContent = p.brand || "JD"; $("#footText").textContent = `© ${new Date().getFullYear()} ${p.name} · Jada Firmament`;
  $("#menu").innerHTML = S.sections.map(s => `<li><a href="#${s.id}">${esc(s.label)}</a></li>`).join("");
  $("#main").innerHTML = S.sections.map(s => R[s.id] ? R[s.id]() : "").join(""); renderGrid()
};
document.addEventListener("click", e => {
  const t = e.target;
  const f = t.closest("[data-filter]"); if (f) { filter = f.dataset.filter; renderGrid() }
  const o = t.closest("[data-open]"); if (o) openProject(o.dataset.open);
  if (t.closest("[data-close]")) $("#modal").close();
  if (t.id === "modal") $("#modal").close();
  if (t.matches(".gallery img")) t.classList.toggle("big");
  if (t.closest("#burger")) { const u = $("#menu"), x = u.classList.toggle("open"); $("#burger").setAttribute("aria-expanded", x) }
  if (t.closest("#menu a")) $("#menu").classList.remove("open");
  const cv = t.closest("[data-cv],#cvNav"); if (cv) { const u = safeUrl(S.profile.cvUrl); if (u) { cv.href = u; cv.setAttribute("download", "CV-" + S.profile.name.replace(/\s+/g, "-") + ".pdf") } else { e.preventDefault(); toast("CV pas encore disponible.") } }
});
document.addEventListener("submit", e => { if (e.target.id === "cform") { e.preventDefault(); const d = new FormData(e.target); location.href = `mailto:${S.profile.contact.email}?subject=${encodeURIComponent("Contact via le portfolio")}&body=${encodeURIComponent(d.get("m") + "\n\n" + d.get("n"))}` } });
renderAll();
/* Utilitaires partagés avec editor.js */
Object.assign(window, { KEY, $, $$, esc, clone, safeUrl });
