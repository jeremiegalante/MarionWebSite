import type { Metadata } from 'next';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { CategoryHero } from '@/components/sections/CategoryHero';
import { ProjectGrid } from '@/components/sections/ProjectGrid';

const images = Array.from(
  { length: 6 },
  (_, index) => `/assets/interactifs/int-${String(index + 1).padStart(2, '0')}.jpg`,
);

export const metadata: Metadata = {
  title: 'Interactifs — Marion Ferran',
};

export default function InteractifsPage() {
  return (
    <>
      <Navbar />
      <main>
        <CategoryHero title="Interactifs" />
        <ProjectGrid images={images} altPrefix="Interactifs" />
      </main>
      <Footer />
    </>
  );
}
