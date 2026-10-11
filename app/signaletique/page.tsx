import type { Metadata } from 'next';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { CategoryHero } from '@/components/sections/CategoryHero';
import { ProjectGrid } from '@/components/sections/ProjectGrid';

const images = Array.from(
  { length: 6 },
  (_, index) => `/assets/signaletique/sig-${String(index + 1).padStart(2, '0')}.jpg`,
);

export const metadata: Metadata = {
  title: 'Signalétique — Marion Ferran',
};

export default function SignaletiquePage() {
  return (
    <>
      <Navbar />
      <main>
        <CategoryHero title="Signalétique" />
        <ProjectGrid images={images} altPrefix="Signalétique" />
      </main>
      <Footer />
    </>
  );
}
