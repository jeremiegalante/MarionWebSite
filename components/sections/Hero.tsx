import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';

export function Hero({
  title,
  subtitle,
  cta,
  tabs = [],
}: {
  title: string;
  subtitle?: string;
  cta?: string;
  tabs?: string[];
}) {
  return (
    <section className="py-16 md:py-24">
      <Container className="flex flex-col items-start gap-6">
        <div className="font-display">
          <Typography as="h1">{title}</Typography>
        </div>
        {subtitle ? <Typography as="p">{subtitle}</Typography> : null}
        {cta ? <Button>{cta}</Button> : null}
        {tabs.length > 0 ? (
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {tabs.map((tab) => (
              <li key={tab} className="font-sans text-sm text-ink/70">
                {tab}
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
