import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { HomeHero } from '@/components/sections/HomeHero';
import { RecentProjects } from '@/components/sections/RecentProjects';
import { ExpertiseLinks } from '@/components/sections/ExpertiseLinks';
import { AboutSection } from '@/components/sections/AboutSection';
import { RedBand } from '@/components/sections/RedBand';
import { ContactCta } from '@/components/sections/ContactCta';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HomeHero />
        <RecentProjects />
        <ExpertiseLinks />
        <AboutSection />
        <RedBand />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
