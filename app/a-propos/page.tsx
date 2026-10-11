import type { Metadata } from 'next';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { AboutHero } from '@/components/sections/AboutHero';
import { AboutIntro } from '@/components/sections/AboutIntro';
import { CompetencesBand } from '@/components/sections/CompetencesBand';

export const metadata: Metadata = {
  title: 'A Propos — Marion Ferran',
};

export default function AProposPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutHero />
        <AboutIntro />
        <CompetencesBand />
      </main>
      <Footer />
    </>
  );
}
