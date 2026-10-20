/* Effets visuels. Utilise les données (S) ; respecte prefers-reduced-motion et le réglage « Animations ». */
(function () {
    const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)], esc = window.esc;
    const rm = () => matchMedia("(prefers-reduced-motion:reduce)").matches || S.theme.anim === false;
    let io, stop, secs = [], tick = false;
    const bar = Object.assign(document.createElement("div"), { id: "prog" }), dots = Object.assign(document.createElement("nav"), { id: "dots" });
    dots.setAttribute("aria-label", "Parcours"); document.body.append(bar, dots);
    const spiral = () => { let d = ""; for (let t = 0; t < 4.6 * Math.PI; t += .08) { const r = 3 * Math.pow(1.618, 2 * t / Math.PI); d += (d ? "L" : "M") + (r * Math.cos(t)).toFixed(1) + " " + (r * Math.sin(t)).toFixed(1) } return `<svg class="sp" viewBox="-260 -260 520 520" aria-hidden="true"><path pathLength="1" d="${d}"/></svg>` };
    const rev = (sel, cls, step = 80) => $$(sel).forEach((e, i) => { e.classList.add("fx", ...cls.split(" ").filter(Boolean)); e.style.setProperty("--i", (i % 8) * step + "ms"); io && io.observe(e) });
    const count = b => { const to = +b.dataset.count, t0 = performance.now(); (function f(t) { const k = Math.min(1, (t - t0) / 1200); b.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); k < 1 && requestAnimationFrame(f) })(t0) };
    function split(h) { let i = 0;[...h.childNodes].forEach(n => { if (n.nodeType === 3) { const f = document.createDocumentFragment(); n.textContent.split(/(\s+)/).forEach(w => { if (!w.trim()) return f.append(w); const s = document.createElement("span"); s.className = "w"; s.style.setProperty("--i", i++); s.textContent = w; f.append(s) }); n.replaceWith(f) } else if (n.nodeType === 1) { n.classList.add("w"); n.style.setProperty("--i", i++) } }) }
    function viz() {
        const g = $("#pgrid"); if (!g || $(".viz")) return; const P = S.projects.filter(p => p.visible !== false), st = {}, tc = {};
        P.forEach(p => { st[p.status] = (st[p.status] || 0) + 1; p.technologies.forEach(t => tc[t] = (tc[t] || 0) + 1) });
        const top = Object.entries(tc).sort((a, b) => b[1] - a[1]).slice(0, 6), B = (o, m) => o.map(([k, v], i) => `<div class="bar" style="--i:${i * 90}ms"><span>${esc(k)}</span><i style="--w:${v / m * 100}%"></i><b>${v}</b></div>`).join("");
        const el = document.createElement("div"); el.className = "viz";
        el.innerHTML = `<div class="card"><div class="stats"><div><b data-count="${P.length}">0</b>projets</div><div><b data-count="${Object.keys(tc).length}">0</b>technologies</div><div><b data-count="${new Set(P.map(p => p.category)).size}">0</b>domaines</div></div></div>
 <div class="card"><h3>Avancement</h3>${B(Object.entries(st).map(([k, v]) => [STATUS[k] || k, v]), P.length || 1)}</div>${top.length ? `<div class="card"><h3>Technologies les plus utilisées</h3>${B(top, top[0][1])}</div>` : ""}`; g.before(el)
    }
    function finale() {
        if ($("#finale")) return; const f = document.createElement("section"); f.id = "finale";
        f.innerHTML = spiral() + `<div class="wrap"><h2>Merci d'avoir fait le voyage.</h2><p>Un projet vous a parlé ? Construisons quelque chose d'utile ensemble.</p><p><a class="btn btn-gold" href="#contact">Me contacter</a> <button class="btn" data-top>Remonter</button></p></div>`; $(".foot").before(f)
    }
    function particles(h) {
        const c = document.createElement("canvas"); c.id = "hero-cv"; h.prepend(c); const x = c.getContext("2d"); if (!x) return;
        let W, H, pts = [], m = { x: -999, y: -999 }, run = true, id; const col = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#d4a937";
        const size = () => { W = c.width = h.clientWidth; H = c.height = h.clientHeight; pts = Array.from({ length: Math.min(70, W / 18 | 0) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: Math.random() * .5 - .25, vy: Math.random() * .5 - .25 })) }; size();
        const ro = new ResizeObserver(size); ro.observe(h); const vis = new IntersectionObserver(e => { run = e[0].isIntersecting; if (run) loop() }); vis.observe(h);
        const mv = e => { const r = h.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; h.style.setProperty("--mx", m.x + "px"); h.style.setProperty("--my", m.y + "px") }; h.addEventListener("pointermove", mv);
        function loop() {
            cancelAnimationFrame(id); if (!run) return; x.clearRect(0, 0, W, H); x.fillStyle = x.strokeStyle = col;
            pts.forEach((p, i) => {
                p.x = (p.x + p.vx + W) % W; p.y = (p.y + p.vy + H) % H; x.globalAlpha = .7; x.fillRect(p.x, p.y, 2, 2);
                for (let j = i + 1; j < pts.length; j++) { const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y); if (d < 110) { x.globalAlpha = (1 - d / 110) * .25; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke() } }
                const d = Math.hypot(p.x - m.x, p.y - m.y); if (d < 160) { x.globalAlpha = (1 - d / 160) * .5; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(m.x, m.y); x.stroke() }
            });
            id = requestAnimationFrame(loop)
        } loop();
        stop = () => { run = false; cancelAnimationFrame(id); ro.disconnect(); vis.disconnect(); h.removeEventListener("pointermove", mv); c.remove() }
    }
    function onScroll() {
        if (tick) return; tick = true; requestAnimationFrame(() => {
            tick = false; const max = document.documentElement.scrollHeight - innerHeight, p = max > 0 ? scrollY / max : 0;
            bar.style.transform = `scaleX(${p})`; document.documentElement.style.setProperty("--gy", p * 100 + "%");
            if (!rm()) $$("[data-par]").forEach(e => { const r = e.parentElement.getBoundingClientRect(); e.style.setProperty("--py", ((r.top + r.height / 2 - innerHeight / 2) * -e.dataset.par).toFixed(1) + "px") });
            let cur = secs[0]; secs.forEach(s => { if (s.el.getBoundingClientRect().top < innerHeight * .4) cur = s });
            $$("#dots a").forEach(a => a.classList.toggle("on", !!cur && a.hash === "#" + cur.id))
        })
    }
    function init() {
        io && io.disconnect(); stop && stop(); stop = null; const on = !rm(); document.documentElement.classList.toggle("fx-on", on);
        secs = S.sections.map(s => ({ id: s.id, el: document.getElementById(s.id) })).filter(s => s.el);
        dots.innerHTML = secs.map(s => `<a href="#${s.id}" aria-label="${esc(S.sections.find(x => x.id === s.id).label)}"><span>${esc(S.sections.find(x => x.id === s.id).label)}</span></a>`).join("");
        finale(); viz(); const j = $("#jada"); if (j && !j.querySelector(".sp")) j.insertAdjacentHTML("afterbegin", spiral());
        if (!on) { $$("[data-count]").forEach(b => b.textContent = b.dataset.count); return onScroll() }
        io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; e.target.classList.add("in"); e.target.querySelectorAll("[data-count]").forEach(count); io.unobserve(e.target) }), { threshold: .15 });
        const h = $(".hero h1"); h && split(h); const hero = $(".hero"); hero && particles(hero);
        [[".hero h1", .1], [".photo", -.08], [".jada img", .06]].forEach(([s, v]) => $$(s).forEach(e => e.dataset.par = v));
        rev("section h2", "c", 0); rev(".sub", "", 0); rev(".hero .lead,.hero .cta,.hero .domains", "", 140);
        rev("#about .card:nth-child(odd)", "l"); rev("#about .card:nth-child(even)", "r"); rev("#skills .card", "", 100); rev("#skills .chip", "pop", 35);
        rev(".viz .card", "", 120); rev(".pcard", "", 70); rev("#experience .card", "l"); rev(".jada>div", "l"); rev(".jada img", "r"); rev("#contact .wrap>*:not(h2)", "", 90); rev("#finale .wrap>*:not(h2)", "", 120);
        $$(".sp").forEach(s => io.observe(s)); onScroll()
    }
    document.addEventListener("pointermove", e => {
        if (rm() || e.pointerType === "touch") return;
        const c = e.target.closest && e.target.closest(".pcard"); if (c) {
            const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
            c.style.setProperty("--ry", ((px - .5) * 10).toFixed(1) + "deg"); c.style.setProperty("--rx", ((.5 - py) * 10).toFixed(1) + "deg"); c.style.setProperty("--gx", px * 100 + "%"); c.style.setProperty("--gy2", py * 100 + "%")
        }
        const b = e.target.closest && e.target.closest(".btn"); if (b) { const r = b.getBoundingClientRect(); b.style.setProperty("--tx", ((e.clientX - r.left - r.width / 2) * .18).toFixed(1) + "px"); b.style.setProperty("--ty", ((e.clientY - r.top - r.height / 2) * .3).toFixed(1) + "px") }
    });
    document.addEventListener("pointerout", e => { const t = e.target.closest && e.target.closest(".pcard,.btn"); if (t && !t.contains(e.relatedTarget)) { ["--rx", "--ry", "--tx", "--ty"].forEach(k => t.style.removeProperty(k)) } });
    document.addEventListener("click", e => { if (e.target.closest("[data-top]")) scrollTo({ top: 0, behavior: rm() ? "auto" : "smooth" }) });
    addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll);
    const oa = window.renderAll; window.renderAll = function () { oa(); init() };
    const og = window.renderGrid; window.renderGrid = function () { og(); if (io && !rm()) rev(".pcard", "", 70) };
    init();
})();
