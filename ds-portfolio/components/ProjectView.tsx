"use client";

import { PROJECTS, type Project } from "@/lib/constants";

export default function ProjectView({
    project,
    onProjectClick,
}: {
    project: Project;
    onProjectClick: (project: Project) => void;
}) {

    const relatedProjects = PROJECTS
        .filter((p) => p.id !== project.id)
        .slice(0, 3);

    return (
        <main className=" w-full  bg-paper">



            {/* Image Gallery */}
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


            {/* Related Projects */}
            <section
                className="
    mt-24
    px-6
    pb-24
    sm:px-12
  "
            >
                <div
                    className="
                  border-t
                   border-ink/20
                    pt-6
                   "
                >

                    <p
                        className="
                    mb-8
                 text-[11px]
                    uppercase
                    tracking-wide3
                    text-mute
                   "
                    >
                        Selected Projects
                    </p>


                    <div
                        className="
                      mx-auto
                      grid
                      max-w-5xl
                      grid-cols-2
                      gap-4
                      sm:grid-cols-4
                     "    
                    >

                        {relatedProjects.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onProjectClick(item)}
                                className="
                                group
                                text-left
                              "
                            >

                                <div
                                    className="
                                   aspect-[4/3]
                                   overflow-hidden
                                   border
                                   border-ink/10
                                  "
                                >
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="
                                      h-full
                                       w-full
                                       object-cover
                                       transition-transform
                                       duration-500
                                      group-hover:scale-105
                                     "
                                    />
                                </div>


                                <p
                                    className="
                                      mt-2
                                      text-[11px]
                                      uppercase
                                      tracking-wide
                                     text-ink
                                    "
                                >
                                    {item.title}
                                </p>

                                <p
                                    className="
                                 text-[10px]
                                  text-mute
                                 "
                                >
                                    {item.year}
                                </p>

                            </button>
                        ))}

                    </div>

                </div>
            </section>

        </main>
    );
}