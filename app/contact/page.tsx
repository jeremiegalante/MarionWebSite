import type { Metadata } from 'next';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { ContactHero } from '@/components/sections/ContactHero';
import { ContactInfo } from '@/components/sections/ContactInfo';

export const metadata: Metadata = {
  title: 'Contact — Marion Ferran',
};

export default function ContactPage() {
  return (
    <>
      <Navbar variant="compact" />
      <main>
        <ContactHero />
        <ContactInfo />
      </main>
      <Footer />
    </>
  );
}
