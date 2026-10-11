import Image from 'next/image';

export function CategoryHero({ title }: { title: string }) {
  return (
    <section className="relative w-full pt-8 md:pt-14">
      <div className="relative mx-auto flex w-[22rem] max-w-full items-center justify-center">
        <Image
          src="/assets/logo.png"
          alt=""
          aria-hidden
          width={92}
          height={64}
          className="h-36 w-auto object-contain opacity-[0.14] md:h-60"
        />
        <h1 className="absolute left-1/2 top-1/2 w-max max-w-[22rem] -translate-x-1/2 -translate-y-1/2 text-center font-display text-5xl font-bold leading-none text-primary md:text-7xl">
          {title}
        </h1>
      </div>
    </section>
  );
}
