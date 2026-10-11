export function CompetencesBand() {
  return (
    <section className="relative w-full bg-primary pt-16 md:pt-20">
      <div
        aria-hidden
        className="absolute right-0 top-0 hidden h-[76px] w-[200px] -translate-y-full bg-primary md:block"
      />
      <h2 className="text-center font-display text-3xl font-bold text-background md:text-5xl">
        Mes domaines de compétence
      </h2>
      <div className="h-40 md:h-80" aria-hidden />
    </section>
  );
}
