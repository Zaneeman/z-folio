"use client";

import { useState } from "react";
import { INDEX_CATEGORIES_LEFT, INDEX_CATEGORIES_RIGHT } from "@/lib/constants";
import { PROJECTS } from "@/lib/constants";
import type { Project } from "@/lib/constants";

export default function IndexView({
  onProjectClick,
  isExiting = false,
  isEntering = false,
}: {
  onProjectClick: (project: any) => void;
  isExiting?: boolean;
  isEntering?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="h-full w-full overflow-y-auto bg-paper px-6 pt-10 pb-24 sm:px-12 sm:pt-14">
      <div className="mx-auto max-w-5xl">
        <label className="block">
          <span className="sr-only">Search projects</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="w-full border border-ink bg-transparent px-4 py-3 text-[13px] tracking-wide outline-none focus:border-[var(--accent)]"
          />
        </label>

        <div className="mt-12 grid grid-cols-2 gap-x-6">
          <ul className="space-y-1">
            {INDEX_CATEGORIES_LEFT.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() =>
                    setActiveCategory((c) => (c === cat ? null : cat))
                  }
                  className={`text-[15px] sm:text-[17px] uppercase tracking-tight transition-colors ${
                    activeCategory === cat
                      ? "text-[var(--accent)]"
                      : "text-ink hover:text-mute"
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
          <ul className="space-y-1 text-right">
            {INDEX_CATEGORIES_RIGHT.map((cat) => (
              <li key={cat}>


                <button
                  onClick={() =>
                    setActiveCategory((c) => (c === cat ? null : cat))
                  }
                  className={`group text-[15px] sm:text-[17px] uppercase tracking-tight transition-colors ${activeCategory === cat
                      ? "text-[var(--accent)]"
                      : "text-mute hover:text-ink"
                    }`}
                >
                  {cat.split("").map((letter, i) => (
                    <span
                      key={i}
                      style={{
                        transitionDelay: `${i * 25}ms`,
                      }}
                      className="
                      [transform:rotateY(180deg)]
                     inline-block
                     transition-transform
                     duration-300
                     group-hover:rotate-0
                     "
                    >
                      {letter}
                    </span>
                  ))}
                </button>
                
                
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-ink/20 pt-4 text-[11px] uppercase tracking-wide2 text-mute">
          <label className="flex items-center gap-2">

          </label>
          <div className="flex gap-6">

          </div>
        </div>
      </div>

      <div
        className={`mx-auto mt-8 flex w-[40vw] flex-col gap-0.5 ${
          isExiting ? "tiles-exit" : isEntering ? "tiles-enter" : ""
        }`}
      >
        {PROJECTS.map((item) => (
          <div
            key={item.id}
            onClick={() => onProjectClick(item)}
            className="group relative block aspect-[3/1] cursor-pointer overflow-hidden transition-transform duration-500 hover:scale-105 hover:-translate-y-4"
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              className="
                h-full
                w-full
                object-cover
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-ink/70
                via-transparent
                to-transparent
              "
            />

            <div className="pointer-events-none absolute bottom-1.5 right-2 text-right">
              <p className="text-[11px] tracking-wide uppercase text-paper">
                {item.title}
              </p>
              <p className="text-[10px] text-paper/70">{item.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
