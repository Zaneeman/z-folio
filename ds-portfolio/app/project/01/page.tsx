import { PROJECTS } from "@/lib/constants";
import { notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = PROJECTS.find(
    (p) => p.slug === params.slug
  );

  if (!project) notFound();

  return (
    <main className="bg-paper min-h-screen">

      {/* Header */}
      <section className="px-6 pt-12 sm:px-12">
        <p className="text-[11px] uppercase tracking-wide3 text-mute">
          {project.category} — {project.year}
        </p>

        <h1 className="
          mt-4
          text-[12vw]
          leading-none
          uppercase
          tracking-tightest2
          font-medium
        ">
          {project.title}
        </h1>

        <p className="
          mt-6
          max-w-md
          text-[13px]
          leading-relaxed
          text-ink/70
        ">
          {project.description}
        </p>
      </section>


      {/* Image gallery */}
      <section className="mt-16">
        {project.images.map((image, i) => (
          <img
            key={image}
            src={image}
            alt={`${project.title} ${i + 1}`}
            className="
              block
              w-full
              h-screen
              object-cover
            "
          />
        ))}
      </section>

    </main>
  );
}