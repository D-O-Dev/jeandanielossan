# Portfolio — Jean Daniel Ossan (Jada Firmament)

Site statique : HTML5, CSS3, JavaScript natif. Aucune dépendance, aucun backend.

## Lancer le site
Double-cliquez sur `index.html`, ou lancez un petit serveur : `python3 -m http.server` puis ouvrez http://localhost:8000.

## Structure
- `index.html` : squelette (navigation, `<main>`, fenêtre de détail).
- `css/style.css` : tout le design ; les réglages sont dans les variables `:root` en haut.
- `js/data.js` : **toutes les données** (profil, compétences, expériences, projets, thème).
- `js/app.js` : affichage du site à partir des données (mode visiteur).
- `js/editor.js` : mode édition (bouton discret ✎ en bas à gauche).
- `assets/logos/jada-firmament.png` : visuel officiel fourni. `assets/images/` : vos deux références de design.

## Modifier les informations
Ouvrez ✎ → onglet **Profil** (nom, titre, présentation, photo, contacts, CV, Jada) ou **Listes** (compétences, expériences, formations en JSON). Cliquez **Enregistrer** : les changements survivent au rechargement (localStorage). **Annuler** revient au dernier enregistrement.
CV : copiez votre PDF dans `assets/cv.pdf` puis saisissez `assets/cv.pdf` dans « Lien du CV ».

## Ajouter un projet
✎ → **Projets** → **+ Ajouter**, remplissez la fiche (statut, technologies, couverture, captures…). Aucun HTML à toucher. Un champ vide n'est jamais affiché. Pour la catégorie « Autres projets », saisissez ce nom de catégorie. Pour un ajout permanent dans le code, copiez un bloc `P({...})` dans `js/data.js`.

## Modifier le design
✎ → **Design** : couleurs, polices, largeur, espacements, rayon, ombre, durée, animations, ordre des sections, thème ivoire de test, retour au thème noir & or. Ou éditez les variables `:root` de `style.css`.

## Sauvegarde
✎ → **Données** : export / import JSON (migration future vers un backend facilitée). Les images sont réduites à 900 px pour respecter la limite du navigateur (~5 Mo).

## Publier
Déposez le dossier sur GitHub Pages, Netlify, Cloudflare Pages ou Vercel (site statique, sans commande de build). Les données enregistrées dans ✎ restent **dans votre navigateur** : pour publier vos modifications, exportez le JSON puis reportez-le dans `js/data.js`.

## Informations à compléter
- Nom exact, contexte, fonctionnalités, rôle, statut et captures : projet transport/tickets.
- Fonctionnalités réellement implémentées et captures : gestion scolaire, application bancaire.
- Ce qui est terminé ou à faire : prédiction des inondations (alertes).
- État réel des fonctionnalités backend et captures : RDSA.
- Statut/avancement : EVE, Jada AI, JadaOS, JStore, IT WAVE / ITechWaves (nom exact).
- Lieux/périodes de formation, missions confirmées chez Atos, CV, e-mail, téléphone, GitHub, LinkedIn, objectifs, photo, liens officiels Jada.

## Tests effectués et limites
Testés : syntaxe des 3 scripts (`node --check`) ; rendu dans un DOM simulé (7 sections, 11 cartes, ouverture d'une fiche, édition d'un titre, enregistrement dans localStorage).
**Non testés** : affichage réel sur navigateurs et téléphones, import/export de fichiers, téléversement d'images, navigation clavier complète. À vérifier de votre côté.
Limites : le mode édition n'est **pas sécurisé** (aucune authentification) ; l'image de référence est une aide visuelle, sans analyse automatique par IA ; le formulaire de contact ouvre seulement votre application e-mail ; le logo est le visuel fourni (pas de version détourée) ; polices système (aucun chargement externe).

## Effets visuels (`css/fx.css`, `js/fx.js`)
Parallaxe, particules dorées dans l'accueil, titre animé, révélations propres à chaque section, cartes 3D, visualisations (statistiques, avancement, technologies — calculées depuis vos projets), spirale d'or dessinée (clin d'œil au visuel Jada), navigation par points, barre de progression et scène finale. Tout se coupe avec « Animations activées » (✎ → Design) ou la préférence système « réduire les animations ». Non testés sur vrais navigateurs/téléphones.
