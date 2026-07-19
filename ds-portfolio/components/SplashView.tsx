"use client";

import { useEffect, useRef } from "react";
import { FEATURED_PROJECT } from "@/lib/constants";

// Consistent margin between every image, in both axes — the one gap
// value the whole grid is built from, so spacing never drifts.
const GAP = 16;

// Scroll distance (px) over which the intro overlay fades to nothing.
const FADE_DISTANCE = 320;

export default function SplashView({ images }: { images: string[] }) {
  const pool = images.length > 0 ? images : FEATURED_PROJECT.images;

  // Simple two-column masonry: each image is scaled to its column's width
  // and keeps its native aspect ratio, so columns fill top-down at
  // whatever height that image actually is — no cropping, no fixed cells.
  const columns: string[][] = [[], []];
  pool.forEach((src, i) => columns[i % 2].push(src));

  const scrollRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Overlay is a sibling of the scrolling grid, absolutely positioned
  // against the scroll container itself (not the page), so it stays
  // pinned over the images as they scroll underneath it — fading out
  // imperatively here avoids a React re-render on every scroll tick.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      if (!overlayRef.current) return;
      const opacity = Math.max(0, 1 - el.scrollTop / FADE_DISTANCE);
      overlayRef.current.style.opacity = String(opacity);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="relative h-full w-full overflow-y-auto bg-paper ml-12 sm:ml-14"
    >
      {/* Image grid — full-bleed to the container's edges, only the
          gaps between images are ever visible. */}
      <div className="grid grid-cols-2" style={{ gap: GAP }}>
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

      {/* Intro text — anchored to the bottom-left of the frame, overlaying
          the grid beneath it, fading out as the user scrolls away from
          the top of the page. */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent" />

        <div className="relative px-6 pb-10 pt-20 sm:px-12 sm:pb-14 sm:pt-24">
          <p className="mb-3 text-[11px] uppercase tracking-wide3 text-paper/70">
            {FEATURED_PROJECT.category} — {FEATURED_PROJECT.year}
          </p>

          <h1 className="text-[13vw] font-medium uppercase leading-[0.9] tracking-tightest2 text-paper sm:text-[5vw]">
            {FEATURED_PROJECT.title}
          </h1>

          <p className="mt-6 max-w-md text-[10px] leading-relaxed text-paper/80">
            {FEATURED_PROJECT.description}
          </p>

          <p className="mt-4 text-[11px] uppercase tracking-wide2 text-paper/60">
            {FEATURED_PROJECT.location}
          </p>
        </div>
      </div>
    </div>
  );
}
