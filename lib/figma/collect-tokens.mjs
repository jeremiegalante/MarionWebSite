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
