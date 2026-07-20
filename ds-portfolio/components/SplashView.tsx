"use client";

import { useEffect, useRef } from "react";
import { FEATURED_PROJECT } from "@/lib/constants";

// Consistent margin between every image, in both axes — the one gap
// value the whole grid is built from, so spacing never drifts.
const GAP = 16;

// Outer side margins, 3x the gap between images.
const SIDE_MARGIN = GAP * 3;

// Scroll distance (px) over which the intro overlay fades to nothing.
const FADE_DISTANCE = 320;

// Each image starts offset this far downward and eases up to translateY(0)
// as it scrolls into the frame — closing that gap reads as the image
// sliding up into place. Transform/opacity only (not a real margin) so
// revealing an image never triggers layout reflow on its neighbors.
const REVEAL_TRAVEL = 140;

// The reveal is scroll-linked, not a timed CSS transition: an image's
// offset is a direct function of scroll position, computed fresh on every
// scroll event, so it moves exactly in step with the scroll instead of
// racing an independent clock. REVEAL_LEAD is how far below the visible
// frame the motion starts (px); REVEAL_ZONE is the total scroll distance
// the slide plays out over. Ending the zone above the visible edge
// (REVEAL_ZONE > REVEAL_LEAD) means part of the slide happens while the
// image is already on screen, so the motion is actually visible rather
// than resolving entirely off-screen before it ever appears.
const REVEAL_LEAD = 60;
const REVEAL_ZONE = 480;

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

  // Reveal each image as a direct function of scroll position, instead of
  // a scroll-triggered timed transition — moving it exactly in step with
  // the scroll rather than racing an independent clock. Driven by the same
  // scroll event as the overlay fade above (not IntersectionObserver): the
  // two masonry columns are rarely the same height, so a short column's
  // last image can sit well above a tall column's — checking every
  // image's position on every scroll tick guarantees it still gets placed
  // correctly even if a fast/instant scroll (e.g. "scroll to bottom")
  // jumps straight past where it would normally be mid-travel.
  //
  // Every image is recomputed on every tick (nothing gets locked in once
  // "settled") so scrolling back up reverses the same motion — an image
  // eases back down and fades out exactly as it eased in, instead of
  // staying permanently revealed.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      imgMap.current.forEach((img) => {
        img.style.transform = "";
        img.style.opacity = "";
      });
      return;
    }

    const updatePositions = () => {
      const start = el.clientHeight + REVEAL_LEAD;
      const end = start - REVEAL_ZONE;
      imgMap.current.forEach((img) => {
        const top = img.offsetTop - el.scrollTop;
        const progress = Math.min(1, Math.max(0, (start - top) / (start - end)));
        img.style.transform = `translateY(${REVEAL_TRAVEL * (1 - progress)}px)`;
        img.style.opacity = String(progress);
      });
    };

    updatePositions();
    el.addEventListener("scroll", updatePositions, { passive: true });
    return () => el.removeEventListener("scroll", updatePositions);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="relative h-full w-[calc(100%-3rem)] overflow-y-auto bg-paper ml-12 sm:ml-14 sm:w-[calc(100%-3.5rem)]"
    >
      {/* Image grid — outer side margins are 3x the gap between images. */}
      <div
        className="grid grid-cols-2"
        style={{ gap: GAP, paddingLeft: SIDE_MARGIN, paddingRight: SIDE_MARGIN }}
      >
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
                style={{
                  transform: `translateY(${REVEAL_TRAVEL}px)`,
                  opacity: 0,
                }}
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
        <div className="relative px-6 pb-10 pt-20 pl-8 sm:px-12 sm:pb-14 sm:pt-24 sm:pl-14">
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
