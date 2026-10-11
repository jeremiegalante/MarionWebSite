import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export function AboutSection() {
  return (
    <section className="w-full py-14 md:py-20">
      <Container className="flex flex-col items-center gap-10 md:flex-row md:gap-8">
        <div className="flex-1 text-center">
          <h2 className="font-display text-3xl font-bold leading-tight text-primary md:text-4xl">
            {"Je suis Marion, Directrice Artistique pour l'Agence Opixido depuis 2023"}
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-sans text-base text-ink md:text-lg">
            {
              "Spécialisée en graphisme muséographique j'interviens sur tout type de supports graphiques. La didactique et la pédagogie sont au centre de mes conceptions pour des rendus sur mesure."
            }
          </p>
          <Link
            href="/a-propos"
            className="mt-6 inline-block font-sans text-base text-primary underline transition-opacity hover:opacity-80"
          >
            {"En savoir plus ->"}
          </Link>
        </div>
        <div className="shrink-0">
          <Image
            src="/assets/home/portrait.jpg"
            alt="Portrait de Marion Ferran"
            width={605}
            height={600}
            className="h-60 w-60 rounded-full object-cover md:h-80 md:w-80 lg:h-96 lg:w-96"
          />
        </div>
      </Container>
    </section>
  );
}
