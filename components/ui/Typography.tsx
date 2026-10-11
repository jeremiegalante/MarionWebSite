import type { ElementType, ReactNode } from 'react';

type Variant = 'sectionTitle' | 'bandTitle' | 'lead' | 'body';

const variants: Record<Variant, string> = {
  sectionTitle: 'font-display text-3xl font-bold md:text-5xl',
  bandTitle: 'font-display text-2xl font-bold leading-snug md:text-4xl',
  lead: 'font-display text-2xl font-bold leading-snug md:text-3xl',
  body: 'font-sans text-base',
};

export function Typography({
  as = 'p',
  variant = 'body',
  className = '',
  children,
}: {
  as?: ElementType;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  const Tag = as as ElementType;
  return (
    <Tag className={`${variants[variant]} ${className}`.trim()}>{children}</Tag>
  );
}
