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
        <main className="
         absolute
         left-0
         right-0
         bottom-0
         top-20
         overflow-y-auto
          bg-paper
        "
        >

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