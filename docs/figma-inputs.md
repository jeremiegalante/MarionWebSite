# Figma inputs

Identifiants du fichier Figma source du site (découverts via l'API REST Figma).

- **File name:** `TESTS_SITE`
- **File key:** `KPIKm3YvmSA10T5c4OwSMO`

## Mapping frame → route

| Frame name | node-id | route |
|---|---|---|
| HOME | `3:43` | `/` |
| Design Graphique | `4030:2` | `/design-graphique` |
| A propos | `4030:232` | `/a-propos` |
| Contact | `4030:289` | `/contact` |

## Note

D'autres frames (`Design Graphique - projet`, `Interactifs`, `Calque_1`) semblent être des
sous-sections ou des composants, et non des pages de premier niveau. Elles seront à affiner
lors de l'assemblage des pages.

## Accès

Le MCP `figma` (configuré dans `~/.config/opencode/opencode.json`) consomme la variable
d'environnement `FIGMA_API_KEY` (personal access token), stockée dans `.env.local` (git-ignoré).
