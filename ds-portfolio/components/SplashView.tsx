"use client";

import { useEffect, useRef } from "react";
import { FEATURED_PROJECT } from "@/lib/constants";

// Consistent margin between every image, in both axes — the one gap
// value the whole grid is built from, so spacing never drifts.
const GAP = 16;

// Scroll distance (px) over which the intro overlay fades to nothing.
const FADE_DISTANCE = 320;

// Each image starts offset downward, as if extra space still separated it
// from the frame, and settles into place as it scrolls into view — closing
// that gap reads as the image sliding up into frame. Transform/opacity
// only (not a real margin) so revealing an image never triggers layout
// reflow on its neighbors.
const REVEAL_HIDDEN = ["opacity-0", "translate-y-16"] as const;
const REVEAL_SHOWN = ["opacity-100", "translate-y-0"] as const;

// How far below the visible frame an image can still be and start
// revealing early, so it settles into place right as it crosses in.
const REVEAL_LOOKAHEAD = 80;

export default function SplashView({ images }: { images: string[] }) {
  const pool = images.length > 0 ? images : FEATURED_PROJECT.images;

  // Simple two-column masonry: each image is scaled to its column's width
  // and keeps its native aspect ratio, so columns fill top-down at
  // whatever height that image actually is — no cropping, no fixed cells.
  const columns: string[][] = [[], []];
  pool.forEach((src, i) => columns[i % 2].push(src));

  const scrollRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const imgMap = useRef(new Map<string, HTMLImageElement>());

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

  // Reveal each image as it scrolls into the frame, instead of everything
  // just sitting there statically positioned. Driven by the same scroll
  // event as the overlay fade above (not IntersectionObserver): the two
  // masonry columns are rarely the same height, so a short column's last
  // image can sit well above a tall column's — checking every unrevealed
  // image's position against the current scroll offset on every scroll
  // tick guarantees it eventually gets revealed even if it was skipped
  // over by a fast/instant scroll (e.g. a "scroll to bottom" jump),
  // whereas an observer that only fires on entering a viewport region can
  // permanently miss an element that never lingered there.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      imgMap.current.forEach((img) => img.classList.add(...REVEAL_SHOWN));
      return;
    }

    const revealInView = () => {
      const bottom = el.clientHeight + REVEAL_LOOKAHEAD;
      imgMap.current.forEach((img) => {
        if (img.dataset.revealed) return;
        if (img.offsetTop - el.scrollTop > bottom) return;
        img.dataset.revealed = "true";
        img.classList.remove(...REVEAL_HIDDEN);
        img.classList.add(...REVEAL_SHOWN);
      });
    };

    revealInView();
    el.addEventListener("scroll", revealInView, { passive: true });
    return () => el.removeEventListener("scroll", revealInView);
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
                ref={(el) => {
                  if (el) imgMap.current.set(src, el);
                  else imgMap.current.delete(src);
                }}
                src={src}
                alt=""
                className="block h-auto w-full opacity-0 translate-y-16 transition-all duration-700 ease-out"
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
          <p className="mb-3 text-[clamp(9px,1.8vw,11px)] uppercase tracking-wide3 text-paper/70">
            {FEATURED_PROJECT.category} — {FEATURED_PROJECT.year}
          </p>

          <h1 className="text-[clamp(16px,10vw,64px)] font-medium uppercase leading-[0.9] tracking-tightest2 text-paper">
            {FEATURED_PROJECT.title}
          </h1>

          <p className="mt-6 hidden max-w-md text-[clamp(9px,1.8vw,10px)] leading-relaxed text-paper/80 sm:block">
            {FEATURED_PROJECT.description}
          </p>

          <p className="mt-4 text-[clamp(9px,1.8vw,11px)] uppercase tracking-wide2 text-paper/60">
            {FEATURED_PROJECT.location}
          </p>
        </div>
      </div>
    </div>
  );
}
