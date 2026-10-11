import Link from 'next/link';
import { Button } from '@/components/ui/Button';
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
            <Button key={pill.href} href={pill.href}>
              {pill.label}
            </Button>
          ))}
        </div>
      </Container>
    </section>
  );
}
