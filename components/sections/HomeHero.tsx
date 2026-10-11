import Image from 'next/image';

export function HomeHero() {
  return (
    <section className="relative w-full">
      <Image
        src="/assets/home/hero.jpg"
        alt=""
        width={1920}
        height={738}
        priority
        className="h-auto w-full object-cover"
      />
      <p className="absolute bottom-4 right-4 max-w-xs text-right font-sans text-xs text-white md:bottom-6 md:right-8 md:max-w-md md:text-sm">
        {"Graphisme de l'exposition Bonnes mères au MUCEM"}
      </p>
    </section>
  );
}
