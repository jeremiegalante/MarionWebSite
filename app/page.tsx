import { Navbar } from '@/components/sections/Navbar';
import { Hero } from '@/components/sections/Hero';

const navLinks = [
  { label: 'Signalétique', href: '/signaletique/' },
  { label: 'Interactifs', href: '/interactifs/' },
  { label: 'Design graphique', href: '/design-graphique/' },
  { label: 'A propos', href: '/a-propos/' },
  { label: 'Contact', href: '/contact/' },
];

export default function HomePage() {
  return (
    <>
      <Navbar links={navLinks} />
      <main>
        <Hero
          title="Projets récents"
          cta="Voir tous mes projets"
          tabs={['Design graphique', 'Signalétique', 'Interactifs']}
        />
      </main>
    </>
  );
}
