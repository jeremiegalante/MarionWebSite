import Image from 'next/image';

export function ProjectGrid({
  images,
  altPrefix,
}: {
  images: string[];
  altPrefix: string;
}) {
  return (
    <section className="w-full pb-14 pt-6 md:pb-20 md:pt-10">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {images.map((src, index) => (
          <div key={src} className="relative aspect-square overflow-hidden">
            <Image
              src={src}
              alt={`${altPrefix} — projet ${index + 1}`}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
