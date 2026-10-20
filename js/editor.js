/* Mode édition local. NON sécurisé : n'importe qui peut l'ouvrir. Ne rien y stocker de secret. */
(function () {
    const { KEY, $, esc, clone } = window;
    let backup, tab = "profile", pi = 0, refImg = "";
    const btn = document.createElement("button"); btn.id = "editToggle"; btn.textContent = "✎"; btn.title = "Mode édition"; btn.setAttribute("aria-label", "Ouvrir le mode édition"); document.body.append(btn);
    const panel = document.createElement("aside"); panel.id = "editor"; panel.hidden = true; panel.setAttribute("aria-label", "Mode édition"); document.body.append(panel);
    const get = (o, p) => p.split(".").reduce((a, k) => a?.[k], o);
    const set = (o, p, v) => { const k = p.split("."); const l = k.pop(); k.reduce((a, x) => a[x], o)[l] = v };
    const TABS = { profile: "Profil", theme: "Design", projects: "Projets", data: "Listes", ref: "Référence", backup: "Données" };
    const field = (l, p, t = "text") => { const v = get(S, p); return `<label>${l}${t === "area" ? `<textarea data-p="${p}">${esc(v)}</textarea>` : `<input data-p="${p}" type="${t}" value="${esc(v)}">`}</label>` };
    const csv = (l, p) => `<label>${l} (séparés par des virgules)<input data-p="${p}" data-t="csv" value="${esc((get(S, p) || []).join(", "))}"></label>`;
    const lines = (l, p) => `<label>${l} (une par ligne)<textarea data-p="${p}" data-t="lines">${esc((get(S, p) || []).join("\n"))}</textarea></label>`;
    const img = (l, p) => `<label>${l}<input type="file" accept="image/*" data-img="${p}"></label>${get(S, p) ? `<img class="prev" src="${esc(get(S, p))}" alt="Aperçu"><button class="sm" data-act="clr" data-p="${p}">Retirer</button>` : ""}`;
    function toData(file, max = 900) { return new Promise((ok, ko) => { const r = new FileReader(); r.onerror = ko; r.onload = () => { const i = new Image(); i.onerror = ko; i.onload = () => { const k = Math.min(1, max / Math.max(i.width, i.height)), c = document.createElement("canvas"); c.width = i.width * k; c.height = i.height * k; c.getContext("2d").drawImage(i, 0, 0, c.width, c.height); ok(c.toDataURL("image/jpeg", .8)) }; i.src = r.result }; r.readAsDataURL(file) }) }
    const body = {
        profile: () => field("Nom affiché", "profile.name") + field("Sigle (logo texte)", "profile.brand") + field("Titre professionnel", "profile.title") + field("Présentation", "profile.intro", "area") + field("Mon approche", "profile.approach", "area") + csv("Domaines", "profile.domains") + img("Photo (facultative)", "profile.photo") +
            field("Lien du CV (ex. assets/cv.pdf)", "profile.cvUrl") + field("E-mail public", "profile.contact.email") + field("Téléphone public", "profile.contact.phone") + field("GitHub", "profile.contact.links.0.url") + field("LinkedIn", "profile.contact.links.1.url") +
            field("Jada : vision", "profile.jada.vision", "area") + field("Jada : objectifs", "profile.jada.goals", "area") + field("Objectifs d'évolution", "profile.objectives", "area"),
        theme: () => `<div class="row"><button class="sm" data-act="th-gold">Thème noir & or</button><button class="sm" data-act="th-ivory">Tester thème ivoire</button></div>` +
            [["Fond", "theme.bg"], ["Surfaces", "theme.surface"], ["Texte", "theme.text"], ["Texte secondaire", "theme.muted"], ["Accent", "theme.accent"], ["Accent clair", "theme.accent2"], ["Bordures", "theme.border"], ["Texte sur accent", "theme.onAccent"]].map(([l, p]) => field(l, p, "color")).join("") +
            field("Police des titres", "theme.fontHead") + field("Police du texte", "theme.fontBody") + field("Largeur max.", "theme.maxw") + field("Espacement", "theme.space") + field("Rayon des cartes", "theme.radius") + field("Ombre", "theme.shadow") + field("Durée animations", "theme.dur") +
            `<label><span><input type="checkbox" data-p="theme.anim" data-t="bool" ${S.theme.anim !== false ? "checked" : ""} style="width:auto"> Animations activées</span></label><b>Ordre des sections</b>` +
            S.sections.map((s, i) => `<div class="row"><span style="flex:1">${esc(s.label)}</span><button class="sm" data-act="sup" data-i="${i}">↑</button><button class="sm" data-act="sdn" data-i="${i}">↓</button></div>`).join(""),
        projects: () => {
            const p = S.projects[pi]; return `<div class="row"><select id="psel">${S.projects.map((x, i) => `<option value="${i}" ${i === pi ? "selected" : ""}>${esc(x.title)}</option>`).join("")}</select></div>
 <div class="row"><button class="sm" data-act="padd">+ Ajouter</button><button class="sm" data-act="pup">↑</button><button class="sm" data-act="pdn">↓</button><button class="sm" data-act="pdel">Supprimer</button></div>`+ (p ? (() => {
                    const b = `projects.${pi}.`;
                    return field("Titre", b + "title") + field("Catégorie", b + "category") + `<label>Statut<select data-p="${b}status">${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${p.status === k ? "selected" : ""}>${v}</option>`).join("")}</select></label>` +
                        field("Résumé", b + "summary", "area") + field("Description", b + "description", "area") + field("Problème", b + "problem", "area") + field("Objectif", b + "objective", "area") + lines("Fonctionnalités", b + "features") + csv("Technologies", b + "technologies") + field("Mon rôle", b + "role") +
                        field("Difficultés", b + "challenges", "area") + field("Solutions", b + "solution", "area") + field("Enseignements", b + "lessons", "area") + field("Début (AAAA-MM)", b + "startDate") + field("Fin (AAAA-MM)", b + "endDate") + field("URL démo", b + "demoUrl") + field("URL dépôt", b + "repositoryUrl") + img("Image de couverture", b + "coverImage") +
                        `<label>Ajouter des captures<input type="file" accept="image/*" multiple data-gal="${pi}"></label><button class="sm" data-act="gclr">Vider la galerie</button>` +
                        ["visible:Visible publiquement", "featured:Mis en avant", "jada:Associé à Jada Firmament"].map(x => { const [k, l] = x.split(":"); return `<label><span><input type="checkbox" data-p="${b + k}" data-t="bool" ${p[k] ? "checked" : ""} style="width:auto"> ${l}</span></label>` }).join("")
                })() : '<div class="empty">Aucun projet.</div>')
        },
        data: () => ["skills:Compétences", "experiences:Expériences", "education:Formations"].map(x => { const [k, l] = x.split(":"); return `<label>${l} (JSON)<textarea data-json="${k}" style="min-height:11rem;font-family:monospace">${esc(JSON.stringify(S[k], null, 1))}</textarea></label>` }).join("") + `<p class="warn">Modifiez le JSON puis quittez le champ : une erreur de syntaxe sera signalée sans rien casser.</p>`,
        ref: () => `<p class="warn">Version 1 : l'image sert de référence visuelle pendant la personnalisation. L'analyse automatique (IA) n'est pas incluse.</p>
 <label>Importer une image de référence<input type="file" accept="image/*" data-ref></label>${refImg ? `<img class="prev" style="max-height:60vh" src="${refImg}" alt="Image de référence importée">` : `<img class="prev" src="assets/images/reference-1-sombre.jpg" alt="Référence fournie : portfolio sombre et orange"><img class="prev" src="assets/images/reference-2-ivoire.jpg" alt="Référence fournie : portfolio ivoire">`}`,
        backup: () => `<div class="row"><button class="sm" data-act="exp">Exporter JSON</button><label class="sm">Importer JSON<input type="file" accept="application/json" data-imp hidden></label><button class="sm" data-act="rst">Restaurer par défaut</button></div><p class="warn">Les images sont réduites (900 px, JPEG) pour tenir dans le stockage du navigateur (~5 Mo). Exportez régulièrement. Ce mode n'est pas une protection d'accès.</p>`
    };
    function draw() {
        panel.innerHTML = `<header><b>Mode édition</b><button class="sm" data-act="save">Enregistrer</button><button class="sm" data-act="cancel">Annuler</button><button class="sm" data-act="close" aria-label="Fermer">✕</button></header>
 <div class="tabs" role="tablist">${Object.entries(TABS).map(([k, v]) => `<button role="tab" aria-selected="${k === tab}" data-tab="${k}">${v}</button>`).join("")}</div><div class="pane">${body[tab]()}</div>`
    }
    const upd = () => { renderAll() };
    const swap = (a, i, j) => { if (j < 0 || j >= a.length) return;[a[i], a[j]] = [a[j], a[i]] };
    btn.onclick = () => { backup = JSON.stringify(S); panel.hidden = false; draw() };
    panel.addEventListener("input", e => { const t = e.target; if (!t.dataset.p) return; let v = t.value; if (t.dataset.t === "bool") v = t.checked; if (t.dataset.t === "csv") v = v.split(",").map(x => x.trim()).filter(Boolean); if (t.dataset.t === "lines") v = v.split("\n").map(x => x.trim()).filter(Boolean); set(S, t.dataset.p, v); upd() });
    panel.addEventListener("change", async e => {
        const t = e.target;
        try {
            if (t.id === "psel") { pi = +t.value; draw() }
            else if (t.dataset.img) { set(S, t.dataset.img, await toData(t.files[0])); upd(); draw() }
            else if (t.dataset.gal) { for (const f of t.files) S.projects[pi].gallery.push(await toData(f)); upd(); draw(); toast("Captures ajoutées (pensez à enregistrer).") }
            else if (t.dataset.ref) { const r = new FileReader(); r.onload = () => { refImg = r.result; draw() }; r.readAsDataURL(t.files[0]) }
            else if (t.dataset.json) { S[t.dataset.json] = JSON.parse(t.value); upd(); toast("Liste mise à jour.") }
            else if (t.dataset.imp) { const d = JSON.parse(await t.files[0].text()); if (!d.profile || !d.projects) throw Error("Fichier invalide"); Object.keys(S).forEach(k => delete S[k]); Object.assign(S, d); upd(); draw(); toast("Import réussi (non enregistré).") }
        }
        catch (err) { toast("Erreur : " + err.message) }
    });
    panel.addEventListener("click", e => {
        const t = e.target.closest("button"); if (!t) return;
        if (t.dataset.tab) { tab = t.dataset.tab; return draw() }
        const a = t.dataset.act, i = +t.dataset.i, P = S.projects; if (!a) return;
        if (a === "save") { try { localStorage.setItem(KEY, JSON.stringify(S)); backup = JSON.stringify(S); toast("Modifications enregistrées.") } catch (err) { toast("Stockage plein : retirez des images ou exportez en JSON.") } }
        if (a === "cancel") { Object.keys(S).forEach(k => delete S[k]); Object.assign(S, JSON.parse(backup)); upd(); draw(); toast("Modifications annulées.") }
        if (a === "close") { panel.hidden = true }
        if (a === "rst" && confirm("Restaurer les données par défaut ? Les changements enregistrés seront perdus.")) { localStorage.removeItem(KEY); Object.keys(S).forEach(k => delete S[k]); Object.assign(S, clone(DEFAULT_DATA)); upd(); draw(); toast("Valeurs par défaut restaurées.") }
        if (a === "exp") { const l = document.createElement("a"); l.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: "application/json" })); l.download = "portfolio-donnees.json"; l.click(); toast("Export lancé.") }
        if (a === "th-gold") { Object.assign(S.theme, clone(DEFAULT_DATA.theme)); upd(); draw() }
        if (a === "th-ivory") { Object.assign(S.theme, { name: "ivoire", bg: "#f4efe2", surface: "#ffffff", text: "#161616", muted: "#5b5648", accent: "#b8891f", accent2: "#8a6612", border: "#ddd5c0", onAccent: "#111111" }); upd(); draw() }
        if (a === "sup" || a === "sdn") { swap(S.sections, i, a === "sup" ? i - 1 : i + 1); upd(); draw() }
        if (a === "padd") { S.projects.push({ id: "p" + Date.now(), title: "Nouveau projet", slug: "", category: "Applications", summary: "", description: "", problem: "", objective: "", solution: "", features: [], technologies: [], role: "", challenges: "", lessons: "", status: "unknown", startDate: "", endDate: "", coverImage: "", gallery: [], demoUrl: "", repositoryUrl: "", featured: false, visible: true, jada: false }); pi = S.projects.length - 1; upd(); draw() }
        if (a === "pdel" && P[pi] && confirm("Supprimer ce projet ?")) { P.splice(pi, 1); pi = Math.max(0, pi - 1); upd(); draw() }
        if (a === "pup") { swap(P, pi, pi - 1); pi = Math.max(0, pi - 1); upd(); draw() }
        if (a === "pdn") { swap(P, pi, pi + 1); pi = Math.min(P.length - 1, pi + 1); upd(); draw() }
        if (a === "gclr") { P[pi].gallery = []; upd(); draw() }
        if (a === "clr") { set(S, t.dataset.p, ""); upd(); draw() }
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !panel.hidden && !$("#modal").open) panel.hidden = true });
})();
