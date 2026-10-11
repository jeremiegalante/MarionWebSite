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
const tokens = collectTokens({ nodes: document.children });
await writeFile('lib/tokens/tokens.json', JSON.stringify(tokens, null, 2));
console.log('tokens.json écrit :', Object.keys(tokens));
