import Link from 'next/link';
import { Container } from '@/components/ui/Container';

const pills = [
  { label: 'Design graphique', href: '/design-graphique' },
  { label: 'Signalétique', href: '/signaletique' },
  { label: 'Interactifs', href: '/interactifs' },
];

export function ExpertiseLinks() {
  return (
    <section className="w-full py-6">
      <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <Link
          href="/design-graphique"
          className="font-sans text-xl text-primary transition-opacity hover:opacity-80 md:text-2xl"
        >
          Voir tous mes projets
        </Link>
        <div className="flex flex-wrap gap-3">
          {pills.map((pill) => (
            <Link
              key={pill.href}
              href={pill.href}
              className="bg-primary px-6 py-3 font-sans text-sm font-medium text-background transition-opacity hover:opacity-90 md:text-base"
            >
              {pill.label}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
