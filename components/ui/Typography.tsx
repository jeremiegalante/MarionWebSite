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
