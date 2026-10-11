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
