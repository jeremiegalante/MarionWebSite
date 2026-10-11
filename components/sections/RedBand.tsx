import Image from 'next/image';
import { Container } from '@/components/ui/Container';

const images = [
  '/assets/home/bottom-01.jpg',
  '/assets/home/bottom-02.jpg',
  '/assets/home/bottom-03.jpg',
];

export function RedBand() {
  return (
    <section className="w-full bg-primary py-14 md:py-20">
      <Container>
        <h2 className="mx-auto max-w-4xl text-center font-display text-2xl font-bold leading-snug text-background md:text-4xl">
          {
            'Je conçois et réalise des images pour les institution culturelles, le domaine de la santé et du social.'
          }
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-7">
          {images.map((src, index) => (
            <div
              key={src}
              className="relative aspect-[2/3] overflow-hidden"
            >
              <Image
                src={src}
                alt={`Réalisation ${index + 1}`}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
