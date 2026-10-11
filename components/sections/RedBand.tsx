import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';

const images = [
  '/assets/home/bottom-01.jpg',
  '/assets/home/bottom-02.jpg',
  '/assets/home/bottom-03.jpg',
];

export function RedBand() {
  return (
    <section className="w-full bg-primary py-14 md:py-20">
      <Container>
        <Typography
          as="h2"
          variant="bandTitle"
          className="mx-auto max-w-4xl text-center text-background"
        >
          {
            'Je conçois et réalise des images pour les institution culturelles, le domaine de la santé et du social.'
          }
        </Typography>
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
