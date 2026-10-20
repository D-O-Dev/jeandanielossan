/* ===== DONNÉES PAR DÉFAUT =====
   Aucune information inventée : un champ vide n'est pas affiché aux visiteurs.
   Statuts : done, wip, proto, design, paused, dropped, unknown (À préciser). */
window.STATUS = { done: "Terminé", wip: "En cours", proto: "Prototype", design: "En conception", paused: "Suspendu", dropped: "Abandonné", unknown: "À préciser" };
const P = (o) => Object.assign({ slug: "", category: "Applications", summary: "", description: "", problem: "", objective: "", solution: "", features: [], technologies: [], role: "", challenges: "", lessons: "", status: "unknown", startDate: "", endDate: "", coverImage: "", gallery: [], demoUrl: "", repositoryUrl: "", featured: false, visible: true, jada: false }, o);
window.DEFAULT_DATA = {
  version: 1,
  profile: {
    name: "Jean Daniel Ossan", brand: "JD", title: "Développeur d'applications et concepteur de solutions technologiques",
    intro: "Je conçois des solutions numériques qui répondent à des problèmes concrets. Du développement d'applications à la conception de projets technologiques, je cherche à associer qualité technique, expérience utilisateur et utilité réelle.",
    approach: "", photo: "", photoAlt: "Portrait de Jean Daniel Ossan",
    domains: ["Développement d'applications", "Web", "Java / Spring Boot", "Conception de solutions"],
    cvUrl: "", objectives: "",
    jada: { vision: "Jada Firmament est mon initiative entrepreneuriale et mon univers de conception de solutions technologiques. Elle est distincte de mes projets scolaires et professionnels.", goals: "", platforms: [] },
    contact: { email: "", phone: "", links: [{ label: "GitHub", url: "" }, { label: "LinkedIn", url: "" }] }
  },
  sections: [
    { id: "home", label: "Accueil" }, { id: "about", label: "À propos" }, { id: "skills", label: "Compétences" },
    { id: "projects", label: "Réalisations" }, { id: "experience", label: "Expériences" }, { id: "jada", label: "Jada Firmament" }, { id: "contact", label: "Contact" }],
  education: [
    { title: "Baccalauréat scientifique", place: "", period: "" },
    { title: "BTS Développement d'Applications", place: "", period: "" }],
  experiences: [
    {
      role: "Stagiaire développeur Full Stack Java/Angular", place: "Atos Digital Academy, Abidjan", period: "Juillet 2025 – novembre 2026",
      tech: ["Java", "Angular", "Thymeleaf", "Spring Boot", "JavaScript", "HTML"], description: ""
    }],
  skills: [
    { cat: "Développement backend", items: [{ n: "Java" }, { n: "Spring Boot" }, { n: "PHP" }, { n: "Laravel" }] },
    { cat: "Développement frontend", items: [{ n: "HTML" }, { n: "CSS" }, { n: "JavaScript" }, { n: "Angular" }, { n: "Thymeleaf" }, { n: "Vue.js" }] },
    { cat: "Bases de données", items: [{ n: "MySQL" }, { n: "PostgreSQL" }] },
    { cat: "Outils et conception", items: [{ n: "Git / GitHub / GitLab" }, { n: "Visual Studio Code" }, { n: "IntelliJ IDEA" }, { n: "Figma" }, { n: "UML" }, { n: "Trello" }] },
    { cat: "Autres domaines explorés", items: [{ n: "Intelligence artificielle" }, { n: "IoT" }, { n: "Conception de produits numériques" }, { n: "Analyse et conception d'applications" }] }],
  theme: {
    name: "or", bg: "#0d0d0d", surface: "#171717", text: "#f3efe4", muted: "#a9a396", accent: "#d4a937", accent2: "#f0d48a", border: "#2a2a2a", onAccent: "#111111",
    fontHead: '"Trebuchet MS","Segoe UI",system-ui,sans-serif', fontBody: "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif",
    maxw: "1120px", space: "1rem", radius: "18px", shadow: "0 10px 30px rgba(0,0,0,.35)", dur: ".35s", anim: true
  },
  projects: [
    P({ id: "p1", title: "Transport et réservation de tickets", category: "Applications", summary: "Point de départ de mon parcours de conception d'applications.", description: "" }),
    P({ id: "p2", title: "Application de gestion scolaire", category: "Applications", summary: "Projet de gestion scolaire.", technologies: ["Java", "Thymeleaf", "PostgreSQL", "IntelliJ IDEA"], startDate: "2025-05", endDate: "2025-10" }),
    P({ id: "p3", title: "Application bancaire", category: "Applications", summary: "Projet d'application bancaire (projet technique, non présenté comme un service en production).", technologies: ["Java", "Spring Boot", "Thymeleaf"], startDate: "2025-07", endDate: "2025-10" }),
    P({ id: "p4", title: "Prédiction des inondations", category: "Conception", summary: "Projet consacré à la prédiction des inondations : frontend, conception et modélisation.", technologies: ["PostgreSQL", "UML"], role: "Frontend et conception", features: ["Fonctionnalité d'alertes envisagée (non confirmée comme terminée)"] }),
    P({ id: "p5", title: "RDSA — Site web événementiel", category: "Web", summary: "RDSA (Réunion des Assoiffés de Prière & d'Adoration), édition RDSA 3 : site événementiel avec interface publique et backend en cours de développement.", description: "Parcours de participation, gestion des paiements déclarés et des preuves de paiement, génération de tickets et préparation du contrôle des présences. Les fonctionnalités backend sont présentées selon leur état réel.", technologies: ["Laravel 10", "PHP", "Blade", "HTML", "CSS", "JavaScript", "MySQL", "Eloquent ORM", "Vite"], status: "wip", featured: true }),
    P({ id: "p6", title: "EVE — Gestion financière et entrepreneuriale", category: "Conception", summary: "Application pensée pour les entrepreneurs, commerçants, prestataires et petites entreprises en Côte d'Ivoire, avec moins de saisie manuelle.", description: "Vision : gestion financière et de l'activité, expérience simple et intuitive, réflexion autour de la capture rapide des informations et des produits.", status: "design", featured: true }),
    P({ id: "p7", title: "Jada Firmament — Initiative entrepreneuriale", category: "Entrepreneuriat", summary: "Mon initiative entrepreneuriale et mon univers de conception de solutions technologiques.", status: "wip", jada: true }),
    P({ id: "p8", title: "Jada AI — Assistant vocal intelligent", category: "Entrepreneuriat", summary: "Vision d'un assistant vocal intelligent. Pas encore présenté comme opérationnel.", jada: true, featured: true }),
    P({ id: "p9", title: "JadaOS — Environnement technologique", category: "Entrepreneuriat", summary: "Chantier de recherche : environnement inspiré de l'expérience des consoles modernes, interface élégante, appareils connectés, technologies open source.", status: "design", jada: true }),
    P({ id: "p10", title: "JStore — Commerce numérique", category: "Entrepreneuriat", summary: "Boutique numérique envisagée autour de gadgets et de vêtements, orientée vers le marché ivoirien." }),
    P({ id: "p11", title: "IT WAVE / ITechWaves", category: "Entrepreneuriat", summary: "Initiative orientée technologies et solutions numériques : développement, IA, IoT, solutions pour entreprises, startups et communautés. Nom et statut modifiables." })
  ]
};
