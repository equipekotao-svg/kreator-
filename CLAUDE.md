# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Site marketing statique pour **KreatorPlay** (anciennement Kotao Academy) — formations audiovisuelles en studio à Colombes (92). Pas de build system, pas de package manager, pas de dépendances. Ouvrir `index.html` directement dans un navigateur ou servir avec un serveur statique.

```bash
# Prévisualisation locale
npx serve .
# Déploiement production
npx vercel --prod
```

## Architecture

| Fichier | Rôle |
|---------|------|
| `index.html` | Landing page one-page avec navigation par ancres |
| `style.css` | Tous les styles de `index.html` |
| `script.js` | Scroll reveal, accordion FAQ, effet nav, catalogue tabs+search |
| `reservation.html` | Page de réservation standalone (CSS inline, pas partagé) |
| `admin.html` | Interface admin sans code — modifier index.html + photos |

`reservation.html` lit `?formation=mobile` ou `?formation=creator` dans l'URL pour peupler dynamiquement la carte formation et les dates. L'objet `formations` en bas de son `<script>` contient toutes les données et dates disponibles.

`AVANT/` = ancienne version archivée — ne pas modifier.

## Interface admin (`admin.html`)

Ouvrir via `npx serve .` puis aller sur `http://localhost:3000/admin.html` (**ne pas ouvrir directement en `file://`** — le fetch de index.html sera bloqué).

### Ce que l'admin permet de modifier sans toucher au code

| Section | Contenu |
|---------|---------|
| 📅 Sessions | Jour, mois, formation, lien réservation, statut (🟢🟡🔴) |
| 🎯 Hero | Texte du badge, 4 stats de la proof strip |
| 💶 Prix | Prix + description des 2 formations |
| 💬 Témoignages | Citation, nom, rôle des 3 clients |
| ❓ FAQ | Questions et réponses |
| 🖼 Photos | 14 photos du site (formations, studio, intervenants) |

### Workflow admin — textes
1. Modifier les champs dans l'admin
2. Cliquer **Prévisualiser** (ouvre le résultat dans un nouvel onglet)
3. Cliquer **Télécharger index.html**
4. Remplacer `index.html` dans le dossier du site
5. `git push origin main`

### Workflow admin — photos
1. Cliquer **"+ Changer la photo"** sur chaque carte photo
2. Sélectionner la nouvelle image (JPG/PNG)
3. Cliquer **Télécharger les photos (ZIP)**
4. Dézipper `kreatorplay-photos.zip` **à la racine du dossier** (remplace les fichiers dans `images/`)
5. `git push origin main`

### Dépendances admin
- JSZip 3.10.1 (chargé depuis jsDelivr CDN) — pour le ZIP des photos
- Les champs sont pré-remplis automatiquement depuis le `index.html` courant via `fetch()`

## Key patterns

**Scroll animations** — ajouter `data-reveal`, `data-reveal-left`, ou `data-reveal-right` sur n'importe quel élément ; `script.js` utilise `IntersectionObserver` pour ajouter `.visible` quand l'élément entre dans le viewport. Entourer un groupe de `.stagger` pour des délais échelonnés (jusqu'à 6 enfants). Pour les reveals avec clip d'image, utiliser `data-clip` sur le conteneur.

**Catalogue tabs + search (unifié)** — `script.js` gère un système bidirectionnel unique :
- Cliquer un onglet → active le panneau **ET** met à jour le dropdown de filtre
- Changer le dropdown → active l'onglet correspondant
- Recherche mot-clé seule → résultats cross-domaine (tous les panneaux ouverts, aucun onglet actif)
- Recherche mot-clé + domaine sélectionné → filtre dans ce domaine uniquement
- Effacer la recherche → restaure l'onglet qui était actif (état mémorisé dans `filterT.value`)
- Source de vérité unique : la valeur du `<select id="filterThematique">`

**FAQ accordion** — `.faq__item` bascule `.open` au clic ; le CSS utilise une transition `max-height` pour révéler `.faq__answer`.

## Design tokens (`:root` dans `style.css`)

```css
--accent:       #D1FE17   /* lime yellow — couleur principale de marque */
--bg:           #0a0a0a   /* fond de page */
--bg-2:         #111111   /* alternance sections */
--bg-3:         #1a1a1a   /* cartes */
--muted:        #888888   /* texte secondaire */
```

`reservation.html` duplique ces tokens sous d'autres noms (`--orange`, `--dark`, etc.) — garder les deux en sync si les couleurs changent.

## Images du site

```
images/
  formations/
    mobile-creator.jpg   ← carte formation Mobile Creator
    creator-video.jpg    ← carte formation Creator Video
  studio.png             ← section "Un vrai studio"
  intervenants/
    realisation-pub.jpg
    realisation-pub-cinema.jpg
    youtube-clip.jpg
    fiction-horreur.jpg
    montage.jpg
    podcast.jpg
    plateau-youtube.jpg
    outils-ia.jpg
    photographie.jpg
    chef-operateur.jpg
    ecriture.jpg
```

## Workflow

Quand l'utilisateur demande de pusher, exécuter directement sans demander de confirmation :

```bash
git push origin main
```
