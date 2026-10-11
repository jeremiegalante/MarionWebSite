import type { Metadata } from 'next';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { CategoryHero } from '@/components/sections/CategoryHero';
import { ProjectGrid } from '@/components/sections/ProjectGrid';

const images = Array.from(
  { length: 12 },
  (_, index) => `/assets/design-graphique/dg-${String(index + 1).padStart(2, '0')}.jpg`,
);

export const metadata: Metadata = {
  title: 'Design Graphique — Marion Ferran',
};

export default function DesignGraphiquePage() {
  return (
    <>
      <Navbar />
      <main>
        <CategoryHero title="Design Graphique" />
        <ProjectGrid images={images} altPrefix="Design graphique" />
      </main>
      <Footer />
    </>
  );
}
