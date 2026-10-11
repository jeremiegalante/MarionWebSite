'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavLink = { label: string; href: string };

const leftLinks: NavLink[] = [
  { label: 'Design graphique', href: '/design-graphique' },
  { label: 'Signalétique', href: '/signaletique' },
  { label: 'Interactifs', href: '/interactifs' },
];

const rightLinks: NavLink[] = [
  { label: 'A propos', href: '/a-propos' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname === `${href}/`;

  const renderLink = (link: NavLink) => (
    <Link
      key={link.href}
      href={link.href}
      className={`font-sans text-sm transition-colors hover:text-primary md:text-base ${
        isActive(link.href) ? 'text-primary' : 'text-ink'
      }`}
    >
      {link.label}
    </Link>
  );

  return (
    <header className="w-full bg-background">
      <div className="relative flex min-h-[170px] flex-col items-center justify-center gap-6 px-6 py-8 md:min-h-[200px]">
        <nav
          aria-label="Expertises"
          className="hidden md:absolute md:left-6 md:top-6 md:flex md:gap-7"
        >
          {leftLinks.map(renderLink)}
        </nav>

        <nav
          aria-label="Navigation secondaire"
          className="hidden md:absolute md:right-6 md:top-6 md:flex md:gap-7"
        >
          {rightLinks.map(renderLink)}
        </nav>

        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/logo.png"
            alt="Marion Ferran"
            width={92}
            height={64}
            priority
            className="h-11 w-auto md:h-14"
          />
          <span className="font-sans leading-tight text-primary">
            <span className="block text-sm font-semibold md:text-base">
              Marion Ferran
            </span>
            <span className="block text-xs md:text-sm">Portfolio</span>
          </span>
        </Link>

        <nav
          aria-label="Navigation principale"
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:hidden"
        >
          {[...leftLinks, ...rightLinks].map(renderLink)}
        </nav>
      </div>
    </header>
  );
}
