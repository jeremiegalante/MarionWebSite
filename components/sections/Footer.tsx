import Image from 'next/image';
import { Container } from '@/components/ui/Container';

const expertises = [
  "Graphisme d'exposition",
  "Création d'identités graphiques",
  "Création d'affiches et déclinaisons",
  'Signalétiques directionnelle',
  'Interfaces interactives',
];

export function Footer() {
  return (
    <footer className="w-full bg-background">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_auto] md:items-start md:gap-8">
        <div className="flex items-start gap-4">
          <Image
            src="/assets/logo.png"
            alt=""
            aria-hidden
            width={92}
            height={64}
            className="h-14 w-auto brightness-0 md:h-16"
          />
          <div className="font-sans text-sm leading-relaxed text-ink">
            <p className="font-semibold">Marion Ferran</p>
            <p>Design graphique pluri-médias</p>
            <p className="mt-4">06 70 70 19 17</p>
            <p className="mt-4 font-semibold">Mentions légales</p>
            <p>Tous droits réservés</p>
            <p>
              {"Les images de ce site ne sont pas libres de droit"}
            </p>
          </div>
        </div>

        <div className="font-sans text-sm text-ink">
          <p className="font-semibold">Expertises</p>
          <ul className="mt-3 space-y-2">
            {expertises.map((expertise) => (
              <li key={expertise}>{expertise}</li>
            ))}
          </ul>
        </div>

        <div className="md:justify-self-end">
          {/* Icône décorative : ajouter l'URL du profil LinkedIn réel lorsque disponible. */}
          <span className="inline-block text-blue">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
              className="h-9 w-9"
            >
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
            </svg>
          </span>
        </div>
      </Container>
    </footer>
  );
}
