import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary';

const styles: Record<Variant, string> = {
  primary:
    'bg-primary px-6 py-3 font-sans text-sm font-medium text-background transition-opacity hover:opacity-90 md:text-base',
  secondary:
    'inline-flex items-center justify-center rounded-sm border border-primary bg-background px-6 py-3 font-sans text-primary',
};

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = 'primary', className = '', children, ...rest } = props;
  const classes = `${styles[variant]} ${className}`.trim();

  if (props.href !== undefined) {
    return (
      <Link
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        href={props.href}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
