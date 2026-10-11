# jeremy — portfolio statique généré depuis Figma

Site vitrine multi-pages (Next.js App Router, TypeScript, export statique)
généré à partir de maquettes Figma, sans backend, destiné à un hébergement
mutualisé type OVH (upload FTP).

## Stack

| Rôle | Choix |
|---|---|
| Framework | Next.js 16 (App Router) + `output: 'export'` |
| Style | Tailwind CSS 4 (`@theme` dans `lib/tokens/theme.css`) |
| Tests | Vitest (unitaire) + Playwright (visuel desktop/mobile) |
| Source design | API REST Figma (personal access token) |

## Prérequis

- Node.js 20+ et npm
- `lftp` (déploiement FTP) — `sudo apt install lftp`
- Un personal access token Figma (gratuit) pour (ré)extraire les tokens

## Installation

```bash
npm install
```

## Routes

| Route | Fichier exporté |
|---|---|
| `/` | `out/index.html` |
| `/design-graphique` | `out/design-graphique/index.html` |
| `/signaletique` | `out/signaletique/index.html` |
| `/interactifs` | `out/interactifs/index.html` |
| `/a-propos` | `out/a-propos/index.html` |
| `/contact` | `out/contact/index.html` |

`trailingSlash: true` fait que chaque route produit un `index.html` dans son
dossier.

## Développement

```bash
npm run dev        # http://localhost:3000
npm run lint       # ESLint
npm run typecheck  # next typegen + tsc --noEmit
npm run test:unit  # Vitest
npm run test:visual # Playwright (build + serve sur :4310)
```

`npm run typecheck` lance `next typegen` avant `tsc --noEmit`. La génération
préalable est nécessaire : `app/layout.tsx` utilise `LayoutProps<"/">`, un type
écrit dans `.next/types/` (git-ignoré) par Next.js. Sans elle, `tsc --noEmit`
échoue sur un clone neuf. Équivalent manuel :

```bash
npx next typegen && npx tsc --noEmit
```

## Extraction des tokens

Les design tokens (couleurs, typographie, espacements, rayons) sont lus depuis
l'arbre Figma via l'API REST, puis écrits dans `lib/tokens/tokens.json` et
mappés dans `lib/tokens/theme.css`.

1. Renseigner le token et la file key dans `.env.local` (git-ignoré) :

   ```bash
   FIGMA_API_KEY=figd_xxx
   FIGMA_FILE_KEY=KPIKm3YvmSA10T5c4OwSMO
   ```

2. Extraire les tokens :

   ```bash
   FIGMA_API_KEY=figd_xxx node lib/figma/extract-tokens.mjs "$FIGMA_FILE_KEY"
   ```

Les identifiants des frames et le mapping frame → route sont documentés dans
`docs/figma-inputs.md`.

## Build

```bash
npm run build          # next build -> out/
npm run build:static   # alias explicite pour l'export statique
```

Le résultat est un dossier `out/` entièrement statique (HTML, CSS, JS, assets).

## Déploiement FTP (OVH)

`scripts/deploy.sh` construit le site puis synchronise `out/` vers le serveur
via `lftp` (`mirror -R --delete`).

1. Exporter les identifiants FTP :

   ```bash
   export FTP_HOST=ftp.example.com
   export FTP_USER=mon_utilisateur
   export FTP_PASS=mon_mot_de_passe
   ```

2. Lancer le déploiement :

   ```bash
   ./scripts/deploy.sh
   ```

Le script échoue immédiatement si l'une des trois variables `FTP_HOST`,
`FTP_USER`, `FTP_PASS` n'est pas définie. La cible distante est `/www/` ;
l'option `--delete` supprime les fichiers distants absents du build.
