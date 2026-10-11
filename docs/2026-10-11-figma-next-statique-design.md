# Design — Génération d'un site statique multi-pages depuis Figma

Date : 2026-10-11
Statut : validé (sections 1-3)

## 1. Objectif

Générer un **site web statique multi-pages** à partir d'un visuel Figma, en
développement assisté par IA avec opencode, à coût zéro côté Figma.

## 2. Non-objectifs

- Pas de backend, pas de rendu serveur, pas de CMS.
- Pas de fonctionnalités dynamiques nécessitant une API à l'exécution.
- Pas d'achat de licence Figma (Dev Mode payant exclu).

## 3. Contraintes

- Figma : **plan gratuit**, pas de Dev Mode.
- Design fourni : frames **desktop + mobile**.
- Hébergement : **mutualisé type OVH** → uniquement des fichiers statiques
  servis par FTP, aucune fonction serveur.

## 4. Décisions (stack)

| Rôle | Choix | Raison |
|---|---|---|
| Design → IA | MCP `framelink-figma-context` (API REST Figma + personal access token gratuit) | Lit l'arbre exact (auto-layout, tailles, couleurs, typo, textes) sans Dev Mode |
| Framework | Next.js (App Router) + `output: 'export'` | 1 URL = 1 HTML réel, bon SEO, routing natif |
| Style | Tailwind CSS | Traduction directe des tokens Figma, standard Figma→code |
| Vérif visuelle | PNG des frames via `/v1/images` de l'API Figma | Référence visuelle pour comparaison |
| Cible | Dossier `out/` statique, upload FTP | Compatible mutualisé OVH |

### Config Next.js pour export statique

- `output: 'export'`
- `images.unoptimized: true`
- `trailingSlash: true` (génère `/a-propos/index.html`)
- Aucune fonction serveur (route handlers dynamiques, ISR, etc.)

## 5. Workflow de génération

Principe : **tokens → composants → pages**, jamais du copier-coller page par page.

1. **Brancher le MCP Figma** : entrée dans `opencode.json` avec `FIGMA_API_KEY`,
   redémarrage d'opencode. Récupérer la *file key* et les *node ids* de chaque frame.
2. **Extraire les design tokens** : couleurs, échelle typographique, espacements,
   rayons, ombres → `tailwind.config` + variables CSS. Fondation de la cohérence.
3. **Construire le design system** : atomes (Button, Input, Typography…) puis
   molécules (Card, Navbar, Footer), mappés sur les *components* Figma.
4. **Assembler les pages** section par section ; chaque frame Figma = une route,
   réutilisant les composants du design system.
5. **Exporter les assets** (images, icônes SVG/PNG) via l'endpoint REST dans `public/`.
6. **Vérifier** : comparaison aux PNG des frames, breakpoints desktop/mobile,
   puis `next build` + lint + typecheck.

## 6. Structure du projet

```
app/
  (routes)/          # une route par page Figma
  layout.tsx
components/
  ui/                # atomes du design system
  sections/          # blocs de page (Hero, Footer…)
lib/
  tokens/            # tokens dérivés de Figma
public/
  assets/            # images et icônes exportées
```

## 7. Vérification & qualité (gates)

- **Par composant/page** : build OK, `eslint` + `tsc` propres, aucun texte/asset manquant.
- **Régression visuelle** : Playwright capture chaque route en desktop + mobile,
  comparée aux PNG rendus par l'API Figma ; correction des écarts.
- **Responsive** : vérifié aux breakpoints Figma (mobile + desktop).
- **Sortie** : `next build` produit `out/`, prêt à FTP.

## 8. Prérequis utilisateur

- Fournir une **file key** Figma et les **node ids** des frames/pages.
- Fournir un **personal access token** Figma (gratuit, révocable).
- Donner accès (lecture) au fichier Figma concerné.

## 9. Questions ouvertes

- Domaine / chemin exact sur l'hébergement OVH (racine vs sous-dossier → impact
  sur `basePath`).
- Faut-il un `basePath` si le site est servi dans un sous-répertoire ?
