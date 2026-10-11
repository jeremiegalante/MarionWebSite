import { Container } from '@/components/ui/Container';

export function ContactInfo() {
  return (
    <section className="w-full py-16 md:py-24">
      <Container className="flex flex-col items-center gap-10 md:flex-row md:gap-20">
        <div
          aria-hidden
          className="h-56 w-56 shrink-0 rounded-full bg-muted md:h-80 md:w-80"
        />
        <div>
          <h2 className="font-display text-2xl font-bold text-blue md:text-3xl">
            Parlons de votre projet
          </h2>
          <div className="mt-6 space-y-2 font-sans text-xl text-blue md:text-2xl">
            <p>
              <a
                href="mailto:marion@opixido.com"
                className="transition-opacity hover:opacity-80"
              >
                marion@opixido.com
              </a>
            </p>
            <p>
              <a
                href="tel:+33770701917"
                className="transition-opacity hover:opacity-80"
              >
                06 70 70 19 17
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
