import Link from 'next/link';

export function ContactCta() {
  return (
    <section className="w-full py-16 text-center md:py-24">
      <Link
        href="/contact"
        className="font-display text-3xl font-bold text-primary underline transition-opacity hover:opacity-80 md:text-4xl"
      >
        Contactez-moi
      </Link>
    </section>
  );
}
