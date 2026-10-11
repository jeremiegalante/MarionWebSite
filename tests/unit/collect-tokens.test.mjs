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
