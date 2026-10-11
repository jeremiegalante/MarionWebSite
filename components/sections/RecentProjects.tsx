import Image from 'next/image';
import { Typography } from '@/components/ui/Typography';

const projects = Array.from(
  { length: 8 },
  (_, index) => `/assets/home/recent-${String(index + 1).padStart(2, '0')}.jpg`,
);

export function RecentProjects() {
  return (
    <section className="w-full py-10 md:py-14">
      <Typography
        as="h2"
        variant="sectionTitle"
        className="text-center text-primary"
      >
        Projets récents
      </Typography>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {projects.map((src, index) => (
          <div key={src} className="relative aspect-square overflow-hidden">
            <Image
              src={src}
              alt={`Projet récent ${index + 1}`}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
