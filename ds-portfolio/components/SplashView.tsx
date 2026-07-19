"use client";

import { FEATURED_PROJECT } from "@/lib/constants";

// Consistent margin between every image, in both axes — the one gap
// value the whole grid is built from, so spacing never drifts.
const GAP = 16;

export default function SplashView({ images }: { images: string[] }) {
  const pool = images.length > 0 ? images : FEATURED_PROJECT.images;

  // Simple two-column masonry: each image is scaled to its column's width
  // and keeps its native aspect ratio, so columns fill top-down at
  // whatever height that image actually is — no cropping, no fixed cells.
  const columns: string[][] = [[], []];
  pool.forEach((src, i) => columns[i % 2].push(src));

  return (
    <div className="h-full w-full overflow-y-auto bg-paper ml-12 sm:ml-14">
      <div className="px-6 pt-10 sm:px-12 sm:pt-14">
        <p className="mb-3 text-[11px] uppercase tracking-wide3 text-mute">
          {FEATURED_PROJECT.category} — {FEATURED_PROJECT.year}
        </p>

        <h1 className="text-[13vw] font-medium uppercase leading-[0.9] tracking-tightest2 text-ink sm:text-[5vw]">
          {FEATURED_PROJECT.title}
        </h1>

        <p className="mt-6 max-w-md text-[10px] leading-relaxed text-ink/70">
          {FEATURED_PROJECT.description}
        </p>

        <p className="mt-4 text-[11px] uppercase tracking-wide2 text-ink/50">
          {FEATURED_PROJECT.location}
        </p>
      </div>

      <div className="grid grid-cols-2 p-4" style={{ gap: GAP }}>
        {columns.map((col, ci) => (
          <div key={ci} className="flex flex-col" style={{ gap: GAP }}>
            {col.map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                className="block h-auto w-full"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
