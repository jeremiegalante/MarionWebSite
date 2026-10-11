# Figma → Next.js statique — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire un pipeline reproductible qui transforme un design Figma en site statique multi-pages (Next.js App Router + Tailwind), déployable par FTP sur un hébergement mutualisé.

**Architecture:** Une pipeline « tokens → composants → pages ». Un script déterministe extrait les design tokens de l'API REST Figma vers `lib/tokens/tokens.json`, injectés dans le thème Tailwind. Le design system (atomes/molécules) est construit par-dessus ces tokens, puis les pages assemblent des sections. Le MCP Figma sert à lire la structure pendant le développement ; Playwright vérifie la fidélité visuelle.

**Tech Stack:** Next.js (App Router, TypeScript), Tailwind CSS, Vitest + React Testing Library, Playwright, API REST Figma, MCP `framelink-figma-context`, `lftp` pour le déploiement.

## Global Constraints

- Next.js App Router + TypeScript.
- Export statique : `output: 'export'`, `images.unoptimized: true`, `trailingSlash: true`.
- **Aucune** fonction serveur (route handlers dynamiques, ISR, middleware runtime).
- Node ≥ 20 (environnement actuel : Node 26).
- Toute valeur de design (couleur, espacement, typo, rayon) provient de `lib/tokens/tokens.json` ; **jamais** codée en dur dans un composant.
- Les textes affichés sont repris **verbatim** depuis Figma (FR).
- Un commit git à la fin de chaque tâche.
- Sortie de build : dossier `out/`.

---

## File Structure

```
app/
  layout.tsx                  # layout racine (fonts, thème, <html lang="fr">)
  page.tsx                    # route Accueil
  a-propos/page.tsx           # routes additionnelles (une par page Figma)
components/
  ui/                         # atomes du design system
    Button.tsx
    Container.tsx
    Typography.tsx
  sections/                   # blocs de page
    Hero.tsx
    Navbar.tsx
    Footer.tsx
lib/
  figma/
    extract-tokens.mjs        # script REST Figma -> tokens.json
    collect-tokens.mjs        # logique pure, testable
  tokens/
    tokens.json               # généré, committé
    theme.css                 # mapping tokens -> variables Tailwind (@theme)
tests/
  unit/                       # Vitest + RTL
  e2e/visual.spec.ts          # Playwright visual regression
scripts/
  figma-assets.mjs            # export images/icônes -> public/assets
public/assets/                # assets exportés
next.config.mjs
playwright.config.ts
vitest.config.ts
opencode.json                 # ajout du MCP Figma
```

---

## Task 1: Scaffold du projet + export statique

**Files:**
- Create: projet Next.js complet à la racine du dépôt
- Create: `next.config.mjs`
- Create: `.gitignore` (généré)

**Interfaces:**
- Produces: projet Next.js buildable, script `npm run build` produisant `out/`.

- [ ] **Step 1: Initialiser le projet**

Depuis `/home/cedric/Documents/dev/jeremy` :

```bash
git init
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --no-turbopack
```

- [ ] **Step 2: Configurer l'export statique**

Créer/écraser `next.config.mjs` :

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 3: Vérifier le build statique**

Run: `npm run build`
Expected: succès, dossier `out/` créé contenant `index.html`.

- [ ] **Step 4: Vérifier la sortie**

Run: `ls out/index.html`
Expected: le fichier existe.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js with static export"
```

---

## Task 2: Brancher le MCP Figma dans opencode

**Files:**
- Modify: `/home/cedric/.config/opencode/opencode.json`

**Interfaces:**
- Produces: MCP `figma` disponible, alimenté par la variable d'environnement `FIGMA_API_KEY`.

- [ ] **Step 1: Ajouter le MCP**

Ajouter dans l'objet `mcp` de `opencode.json` :

```json
"figma": {
  "type": "local",
  "command": ["npx", "-y", "figma-developer-mcp", "--stdio"],
  "enabled": true,
  "environment": { "FIGMA_API_KEY": "{env:FIGMA_API_KEY}" }
}
```

- [ ] **Step 2: Fournir le token**

Exporter le personal access token Figma (gratuit) dans l'environnement du shell, puis redémarrer opencode.

```bash
export FIGMA_API_KEY="<ton_token_figma>"
```

- [ ] **Step 3: Vérifier l'accès**

Avec le MCP, lister un fichier : appeler l'outil Figma avec la *file key* d'un fichier accessible.
Expected: le MCP renvoie l'arbre du document.

- [ ] **Step 4: Noter les identifiants**

Consigner dans `docs/figma-inputs.md` : *file key* et *node ids* de chaque frame/page.
Expected: un mapping frame → route est écrit.

- [ ] **Step 5: Commit**

```bash
git add docs/figma-inputs.md
git commit -m "chore: document figma file key and node ids"
```

---

## Task 3: Extraction déterministe des design tokens

**Files:**
- Create: `lib/figma/collect-tokens.mjs`
- Create: `lib/figma/extract-tokens.mjs`
- Test: `tests/unit/collect-tokens.test.mjs`
- Create: `lib/tokens/tokens.json` (généré)

**Interfaces:**
- Produces: `collectTokens(document)` → `{ colors, fontSizes, fontFamilies, spacing, radii }`.
  - `colors: Record<string,string>` (hex, ex. `"primary": "#1D4ED8"`)
  - `fontSizes: number[]`, `fontFamilies: string[]`
  - `spacing: number[]`, `radii: number[]`

- [ ] **Step 1: Écrire le test qui échoue**

`tests/unit/collect-tokens.test.mjs` :

```js
import { test } from 'vitest';
import assert from 'node:assert/strict';
import { collectTokens } from '../../lib/figma/collect-tokens.mjs';

test('collecte couleurs, typo, espacements et rayons', () => {
  const doc = {
    nodes: [
      { type: 'RECTANGLE', fills: [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }], cornerRadius: 8 },
      { type: 'FRAME', paddingLeft: 16, itemSpacing: 24 },
      { type: 'TEXT', style: { fontSize: 18, fontFamily: 'Inter' } },
    ],
  };
  const t = collectTokens(doc);
  assert.deepEqual(t.colors, { '#ff0000': '#ff0000' });
  assert.deepEqual(t.fontSizes, [18]);
  assert.deepEqual(t.fontFamilies, ['Inter']);
  assert.ok(t.spacing.includes(16) && t.spacing.includes(24));
  assert.deepEqual(t.radii, [8]);
});
```

- [ ] **Step 2: Lancer le test (échec attendu)**

Run: `npx vitest run tests/unit/collect-tokens.test.mjs`
Expected: FAIL — `collectTokens` introuvable.

- [ ] **Step 3: Implémenter `collectTokens`**

`lib/figma/collect-tokens.mjs` :

```js
const toHex = (c) => {
  const h = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
  return `#${h(c.r)}${h(c.g)}${h(c.b)}`;
};

const walk = (node, visit) => {
  visit(node);
  (node.children ?? []).forEach((child) => walk(child, visit));
};

export function collectTokens(document) {
  const colors = {}, fontSizes = new Set(), fontFamilies = new Set();
  const spacing = new Set(), radii = new Set();

  for (const root of document.nodes ?? []) {
    walk(root, (n) => {
      for (const fill of n.fills ?? []) {
        if (fill.type === 'SOLID' && fill.color) colors[toHex(fill.color)] = toHex(fill.color);
      }
      if (typeof n.cornerRadius === 'number') radii.add(n.cornerRadius);
      if (typeof n.paddingLeft === 'number') spacing.add(n.paddingLeft);
      if (typeof n.itemSpacing === 'number') spacing.add(n.itemSpacing);
      if (n.style?.fontSize) fontSizes.add(n.style.fontSize);
      if (n.style?.fontFamily) fontFamilies.add(n.style.fontFamily);
    });
  }

  const asc = (a, b) => a - b;
  return {
    colors,
    fontSizes: [...fontSizes].sort(asc),
    fontFamilies: [...fontFamilies].sort(),
    spacing: [...spacing].sort(asc),
    radii: [...radii].sort(asc),
  };
}
```

- [ ] **Step 4: Lancer le test (succès attendu)**

Run: `npx vitest run tests/unit/collect-tokens.test.mjs`
Expected: PASS.

- [ ] **Step 5: Script d'extraction REST**

`lib/figma/extract-tokens.mjs` :

```js
import { writeFile } from 'node:fs/promises';
import { collectTokens } from './collect-tokens.mjs';

const [fileKey] = process.argv.slice(2);
if (!fileKey || !process.env.FIGMA_API_KEY) {
  console.error('Usage: FIGMA_API_KEY=... node lib/figma/extract-tokens.mjs <fileKey>');
  process.exit(1);
}

const res = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
  headers: { 'X-Figma-Token': process.env.FIGMA_API_KEY },
});
if (!res.ok) throw new Error(`Figma API ${res.status}`);

const { document } = await res.json();
const tokens = collectTokens(document);
await writeFile('lib/tokens/tokens.json', JSON.stringify(tokens, null, 2));
console.log('tokens.json écrit :', Object.keys(tokens));
```

- [ ] **Step 6: Générer les tokens réels**

Run: `FIGMA_API_KEY=<token> node lib/figma/extract-tokens.mjs <fileKey>`
Expected: `lib/tokens/tokens.json` rempli avec les vraies valeurs.

- [ ] **Step 7: Commit**

```bash
git add lib/figma lib/tokens/tokens.json tests/unit/collect-tokens.test.mjs
git commit -m "feat: extract design tokens from figma REST API"
```

---

## Task 4: Injecter les tokens dans le thème Tailwind

**Files:**
- Create: `lib/tokens/theme.css`
- Modify: `app/globals.css` (importer `theme.css`)

**Interfaces:**
- Consumes: `lib/tokens/tokens.json` (Task 3).
- Produces: classes Tailwind utilisables : `bg-primary`, `text-primary`, `p-<n>`, `rounded-<n>`.

- [ ] **Step 1: Générer `theme.css` depuis les tokens**

`lib/tokens/theme.css` (exemple — recopier les valeurs de `tokens.json`) :

```css
@import "tailwindcss";

@theme {
  --color-primary: #1D4ED8;
  --color-foreground: #111827;
  --color-background: #FFFFFF;
  --font-sans: "Inter", system-ui, sans-serif;
  --radius-sm: 8px;
  --spacing-4: 16px;
  --spacing-6: 24px;
}
```

- [ ] **Step 2: Importer le thème**

Dans `app/globals.css`, conserver uniquement :

```css
@import "../lib/tokens/theme.css";
```

- [ ] **Step 3: Vérifier qu'une classe de token compile**

Ajouter temporairement dans `app/page.tsx` : `<div className="bg-primary text-background p-4">test</div>`, puis :

Run: `npm run build`
Expected: succès, `bg-primary` présent dans le CSS généré (`grep -r "1D4ED8" out/_next`).

- [ ] **Step 4: Retirer le test visuel**

Supprimer le `<div>` temporaire.

- [ ] **Step 5: Commit**

```bash
git add lib/tokens/theme.css app/globals.css app/page.tsx
git commit -m "feat: map figma tokens into tailwind theme"
```

---

## Task 5: Harness de régression visuelle

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/visual.spec.ts`

**Interfaces:**
- Produces: commande `npm run test:visual` capturant chaque route en desktop + mobile.

- [ ] **Step 1: Installer Playwright**

```bash
npm i -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Configurer Playwright**

`playwright.config.ts` :

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:3000' },
  webServer: {
    command: 'npm run build && npx serve out -l 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
});
```

- [ ] **Step 3: Écrire le test visuel**

`tests/e2e/visual.spec.ts` :

```ts
import { test, expect } from '@playwright/test';

const routes = ['/'];

for (const route of routes) {
  test(`visuel ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.02, fullPage: true });
  });
}
```

- [ ] **Step 4: Premier passage (création des baselines)**

```bash
npm i -D serve
npm run test:visual -- --update-snapshots
```

Ajouter le script dans `package.json` : `"test:visual": "playwright test"`.
Expected: snapshots créés dans `tests/e2e/visual.spec.ts-snapshots/`.

- [ ] **Step 5: Comparer à la référence Figma**

Exporter les frames de référence via l'API REST :

```bash
FIGMA_API_KEY=<token> node scripts/figma-assets.mjs <fileKey> <nodeId> frame.png
```

Placer les PNG de référence dans `docs/reference/` et comparer visuellement aux snapshots.

- [ ] **Step 6: Commit**

```bash
git add playwright.config.ts tests/e2e package.json package-lock.json
git commit -m "test: add playwright visual regression harness"
```

---

## Task 6: Atomes du design system (TDD)

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Container.tsx`
- Create: `components/ui/Typography.tsx`
- Test: `tests/unit/ui.test.tsx`
- Create: `vitest.config.ts`

**Interfaces:**
- Produces:
  - `Button({ children, variant = 'primary' | 'secondary', ...rest })`
  - `Container({ children, className? })`
  - `Typography({ as = 'p' | 'h1' | 'h2' | 'h3', children })`

- [ ] **Step 1: Configurer Vitest + RTL**

```bash
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

`vitest.config.ts` :

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, include: ['tests/unit/**/*.test.{ts,tsx,mjs}'] },
});
```

Ajouter `"test:unit": "vitest run"` dans `package.json`.

- [ ] **Step 2: Écrire les tests qui échouent**

`tests/unit/ui.test.tsx` :

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';

test('Button rend son label', () => {
  render(<Button>Envoyer</Button>);
  expect(screen.getByRole('button', { name: 'Envoyer' })).toBeInTheDocument();
});

test('Typography h1 utilise la balise h1', () => {
  render(<Typography as="h1">Titre</Typography>);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Titre');
});
```

- [ ] **Step 3: Lancer les tests (échec attendu)**

Run: `npm run test:unit`
Expected: FAIL — modules introuvables.

- [ ] **Step 4: Implémenter les atomes**

`components/ui/Button.tsx` :

```tsx
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary';

const styles: Record<Variant, string> = {
  primary: 'bg-primary text-background hover:opacity-90',
  secondary: 'bg-background text-primary border border-primary',
};

export function Button({
  variant = 'primary',
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-sm px-6 py-3 font-sans ${styles[variant]} ${className}`}
      {...rest}
    />
  );
}
```

`components/ui/Container.tsx` :

```tsx
import type { ReactNode } from 'react';

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 md:px-6 ${className}`}>{children}</div>;
}
```

`components/ui/Typography.tsx` :

```tsx
import type { ElementType, ReactNode } from 'react';

const sizes: Record<string, string> = {
  h1: 'text-4xl md:text-5xl font-bold',
  h2: 'text-3xl md:text-4xl font-semibold',
  h3: 'text-2xl font-semibold',
  p: 'text-base',
};

export function Typography({ as = 'p', children }: { as?: ElementType; children: ReactNode }) {
  const Tag = as as ElementType;
  return <Tag className={sizes[as as string] ?? sizes.p}>{children}</Tag>;
}
```

- [ ] **Step 5: Lancer les tests (succès attendu)**

Run: `npm run test:unit`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/ui tests/unit/ui.test.tsx vitest.config.ts package.json
git commit -m "feat: design-system atoms with tests"
```

---

## Task 7: Motif de section + première section (Hero)

**Files:**
- Create: `components/sections/Navbar.tsx`
- Create: `components/sections/Hero.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Container`, `Button`, `Typography` (Task 6).
- Produces: `Hero({ title, subtitle, cta })`, `Navbar({ links })`.

> **Note d'exécution :** les valeurs concrètes (textes, image, ordre, espacements) se lisent depuis le node Figma via le MCP. La structure ci-dessous est le patron à reproduire pour chaque section ; seule la donnée change.

- [ ] **Step 1: Écrire la Navbar**

`components/sections/Navbar.tsx` :

```tsx
import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export function Navbar({ links }: { links: { label: string; href: string }[] }) {
  return (
    <header className="w-full border-b border-black/10">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="font-sans font-semibold text-primary">Logo</Link>
        <nav className="hidden gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="font-sans text-foreground hover:text-primary">
              {l.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
```

- [ ] **Step 2: Écrire la section Hero**

`components/sections/Hero.tsx` :

```tsx
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';

export function Hero({ title, subtitle, cta }: { title: string; subtitle: string; cta: string }) {
  return (
    <section className="py-16 md:py-24">
      <Container className="flex flex-col items-start gap-6">
        <Typography as="h1">{title}</Typography>
        <Typography as="p" >{subtitle}</Typography>
        <Button>{cta}</Button>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: Assembler la page Accueil**

`app/page.tsx` :

```tsx
import { Navbar } from '@/components/sections/Navbar';
import { Hero } from '@/components/sections/Hero';

export default function HomePage() {
  return (
    <>
      <Navbar links={[{ label: 'Accueil', href: '/' }, { label: 'À propos', href: '/a-propos/' }]} />
      <main>
        <Hero title="Titre depuis Figma" subtitle="Sous-titre depuis Figma" cta="Action" />
      </main>
    </>
  );
}
```

- [ ] **Step 4: Remplacer les textes par les valeurs Figma**

Lire le node via le MCP, recopier les textes verbatim et ajuster les espacements via les classes de tokens.
Expected: contenu conforme à la frame.

- [ ] **Step 5: Vérifier build + visuel**

Run: `npm run build && npm run test:visual`
Expected: build OK, snapshot mis à jour après comparaison à la référence Figma.

- [ ] **Step 6: Commit**

```bash
git add components/sections app/page.tsx
git commit -m "feat: navbar and hero section"
```

---

## Task 8: Pages restantes + routing

**Files:**
- Create: `app/<route>/page.tsx` (une par page Figma)
- Create: `components/sections/<Section>.tsx` (selon les frames)
- Modify: `tests/e2e/visual.spec.ts` (ajouter les routes)

**Interfaces:**
- Consumes: atomes (Task 6), patron de section (Task 7).

- [ ] **Step 1: Ajouter les routes au test visuel**

Dans `tests/e2e/visual.spec.ts`, compléter :

```ts
const routes = ['/', '/a-propos/', '/contact/'];
```

- [ ] **Step 2: Créer une page par frame Figma**

Pour chaque frame listée dans `docs/figma-inputs.md`, créer `app/<route>/page.tsx` en réutilisant `Navbar`, `Footer` et des sections issues du design system. Recopier les textes verbatim depuis le MCP.
Expected: chaque route rend une page complète.

- [ ] **Step 3: Vérifier toutes les routes**

Run: `npm run build && npm run test:visual -- --update-snapshots`
Expected: un snapshot par route × breakpoint (desktop + mobile).

- [ ] **Step 4: Comparer chaque page à sa référence Figma**

Rendre les frames de référence et comparer ; corriger les écarts d'espacement/typo via les tokens.

- [ ] **Step 5: Commit**

```bash
git add app components tests/e2e
git commit -m "feat: remaining pages and routing"
```

---

## Task 9: Export des assets Figma

**Files:**
- Create: `scripts/figma-assets.mjs`
- Create: `public/assets/` (images exportées)

**Interfaces:**
- Produces: commande `node scripts/figma-assets.mjs <fileKey> <nodeId> <out>`.

- [ ] **Step 1: Implémenter l'export**

`scripts/figma-assets.mjs` :

```js
import { writeFile } from 'node:fs/promises';

const [fileKey, nodeId, out = 'asset.png'] = process.argv.slice(2);
const token = process.env.FIGMA_API_KEY;
if (!fileKey || !nodeId || !token) {
  console.error('Usage: FIGMA_API_KEY=... node scripts/figma-assets.mjs <fileKey> <nodeId> <out>');
  process.exit(1);
}

const api = `https://api.figma.com/v1/images/${fileKey}?ids=${nodeId}&format=png&scale=2`;
const res = await fetch(api, { headers: { 'X-Figma-Token': token } });
const { images } = await res.json();
const url = images[nodeId];
const bin = await fetch(url);
await writeFile(`public/assets/${out}`, Buffer.from(await bin.arrayBuffer()));
console.log('asset écrit :', out);
```

- [ ] **Step 2: Exporter les assets nécessaires**

Pour chaque image/icône repérée dans les frames, lancer le script vers `public/assets/`.
Expected: fichiers présents dans `public/assets/`.

- [ ] **Step 3: Référencer les assets**

Utiliser `next/image` avec `unoptimized` ou des `<img>` vers `/assets/<fichier>` dans les sections.

- [ ] **Step 4: Vérifier**

Run: `npm run build`
Expected: build OK, assets copiés dans `out/assets/`.

- [ ] **Step 5: Commit**

```bash
git add scripts/figma-assets.mjs public/assets
git commit -m "feat: export figma assets"
```

---

## Task 10: Build final, vérification et déploiement FTP

**Files:**
- Create: `scripts/deploy.sh`
- Modify: `README.md` (instructions de déploiement)

**Interfaces:**
- Produces: `npm run build` → `out/` ; `scripts/deploy.sh` → upload FTP.

- [ ] **Step 1: Ajouter le script de build final**

Dans `package.json` : `"build:static": "next build"`.

- [ ] **Step 2: Script de déploiement FTP**

`scripts/deploy.sh` :

```bash
#!/usr/bin/env bash
set -euo pipefail
: "${FTP_HOST:?}" "${FTP_USER:?}" "${FTP_PASS:?}"
npm run build
lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" -e "mirror -R --delete out/ /www/; bye"
```

- [ ] **Step 3: Vérifier les gates de qualité**

Run: `npm run lint && npx tsc --noEmit && npm run test:unit && npm run test:visual && npm run build`
Expected: tout passe ; `out/` contient une `index.html` par route.

- [ ] **Step 4: Documenter**

Décrire dans `README.md` : prérequis, extraction des tokens, build, déploiement.

- [ ] **Step 5: Commit final**

```bash
git add scripts/deploy.sh README.md package.json
git commit -m "chore: final build and FTP deploy"
```

---

## Self-Review

**Couverture du spec :**
- Stack (Next export statique) → Task 1 ✔
- MCP Figma REST/token → Task 2 ✔
- Extraction tokens → Tasks 3–4 ✔
- Design system → Task 6 ✔
- Assemblage pages → Tasks 7–8 ✔
- Export assets → Task 9 ✔
- Vérification (Playwright, desktop/mobile, build/lint/tsc) → Tasks 5, 10 ✔
- Hébergement OVH via FTP → Task 10 ✔

**Placeholders :** les tâches 7–8 utilisent des textes d'exemple marqués comme devant être remplacés par les valeurs Figma à l'exécution — c'est explicite, pas un TBD caché.

**Cohérence de types :** `collectTokens`, `Button`, `Container`, `Typography`, `Navbar`, `Hero` gardent les mêmes signatures entre définition et usage.

**Dépendance externe :** les tâches 7–8 nécessitent le *file key* + *node ids* (Task 2) et le token Figma. À fournir avant exécution.
