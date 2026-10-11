import { Container } from '@/components/ui/Container';

export function AboutIntro() {
  return (
    <section className="w-full py-16 md:py-28">
      <Container className="grid gap-12 md:grid-cols-[2fr_3fr] md:items-center md:gap-16">
        <p className="font-display text-2xl font-bold leading-snug text-primary md:text-3xl">
          Mon manifeste ? Mettre le design graphique au service de la transmission.
        </p>
        <div className="space-y-5 font-sans text-base leading-relaxed text-blue md:text-lg">
          <p>
            {
              "Mon parcours s'est forgé au sein de deux institutions des arts appliqués : l'"
            }
            <strong>École Boulle</strong>
            {" et l'"}
            <strong>École Estienne</strong>
            {
              ". De cette double formation, j'ai gardé le goût du volume, de l'espace et du sens de la communication visuelle."
            }
          </p>
          <p>
            {
              "Qu'il s'agisse de concevoir l'identité graphique d'une exposition, de réaliser un projet multimédia ou une signalétique, ma démarche reste la même : faire preuve de clarté et de pédagogie."
            }
          </p>
          <p>
            {"Cette sensibilité m'a amenée à "}
            <strong>enseigner les Arts Appliqués</strong>
            {
              ", en guidant mes élèves sur des sujets collaboratifs, culturels et environnementaux."
            }
          </p>
          <p>
            {'Après des années marquantes chez '}
            <strong>Studio K</strong>
            {
              " (2007-2013), un premier passage chez Opixido en 2014 et une période de freelance, j'ai posé de nouveau mes valises chez "
            }
            <strong>Opixido</strong>
            {
              " en 2023. J'y combine aujourd'hui mes casquettes de Cheffe de projet, conceptrice graphique et directrice artistique pour donner vie à des projets ambitieux."
            }
          </p>
        </div>
      </Container>
    </section>
  );
}
