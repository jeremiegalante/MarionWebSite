export function AboutHero() {
  return (
    <section className="w-full pt-10 text-center md:pt-16">
      <div className="relative mx-auto flex flex-col items-center px-4">
        <p
          aria-hidden
          className="font-display text-4xl font-bold leading-none text-primary opacity-10 md:text-6xl"
        >
          On se connait ?
        </p>
        <h1 className="font-display text-3xl font-bold leading-tight text-primary md:text-4xl">
          A Propos
        </h1>
        <p className="font-display text-3xl font-bold leading-tight text-primary md:text-4xl">
          Marion Ferran
        </p>
        <p className="mt-3 font-sans text-lg text-primary md:text-xl">
          Graphiste spécialisée en muséographie
        </p>
      </div>
    </section>
  );
}
