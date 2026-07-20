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

            {/* Image gallery — scaled to the page's max width instead of
                full-bleed viewport width, at each image's native aspect
                ratio rather than a forced full-screen crop. */}
            <section className="mx-auto mt-16 w-[90vw] sm:w-[85vw] lg:w-[75vw]">
                {project.images.map((image, i) => (
                    <img
                        key={image}
                        src={image}
                        alt={`${project.title} ${i + 1}`}
                        className="block h-auto w-full"
                    />
                ))}
            </section>

        </main>
    );
}