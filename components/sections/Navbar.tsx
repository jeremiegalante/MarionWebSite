import Link from 'next/link';
import { Container } from '@/components/ui/Container';

type NavLink = { label: string; href: string };

export function Navbar({ links }: { links: NavLink[] }) {
  return (
    <header className="w-full border-b border-muted">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="font-display font-semibold text-primary">
          Marion Ferran Portfolio
        </Link>
        <nav aria-label="Navigation principale" className="hidden gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-ink transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
