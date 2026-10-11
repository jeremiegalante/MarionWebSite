import Image from 'next/image';

const projects = Array.from(
  { length: 8 },
  (_, index) => `/assets/home/recent-0${index + 1}.jpg`,
);

export function RecentProjects() {
  return (
    <section className="w-full py-10 md:py-14">
      <h2 className="text-center font-display text-3xl font-bold text-primary md:text-5xl">
        Projets récents
      </h2>
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
