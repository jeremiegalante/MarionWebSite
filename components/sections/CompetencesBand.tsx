import { Typography } from '@/components/ui/Typography';

export function CompetencesBand() {
  return (
    <section className="relative w-full bg-primary pt-16 md:pt-20">
      <div
        aria-hidden
        className="absolute right-0 top-0 hidden h-[76px] w-[200px] -translate-y-full bg-primary md:block"
      />
      <Typography
        as="h2"
        variant="sectionTitle"
        className="text-center text-background"
      >
        Mes domaines de compétence
      </Typography>
      <div className="h-40 md:h-80" aria-hidden />
    </section>
  );
}
