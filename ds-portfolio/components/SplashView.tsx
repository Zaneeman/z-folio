"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FEATURED_PROJECT } from "@/lib/constants";

/*
  FREEFORM SPLASH CANVAS
  ----------------------
  Instead of a single-axis vertical scroller, the splash is an infinite
  2D plane you can roam omnidirectionally (drag / trackpad / wheel).

  How the infinite grid works:
  - A single "block" is a bento layout of tiles (BENTO) laid out on a
    COLS x ROWS cell grid that fully tiles a BLOCK_W x BLOCK_H area with
    no gaps or overlaps, so the block repeats seamlessly in every
    direction.
  - We only render the blocks (ci, cj) whose canvas region intersects the
    viewport (+ a margin). Tiles carry absolute *canvas* coordinates; a
    single wrapper is translated by the current pan offset. That means
    per-frame panning only writes one transform (imperative, no React
    re-render) — the tile list is recomputed only when the visible block
    window changes (i.e. when you cross a block boundary).
  - To avoid the obvious "same picture repeating" look, each block picks
    images from the pool with a per-block index shift, so geometry
    repeats but imagery does not.
*/

const COLS = 4;
const ROWS = 6;
// Square base unit — keeps a "1x1" cell a true 1:1 square and a "2x2" cell
// a true 1:1 square at 2x scale, so the "<cols>x<rows>" filename prefix
// (see lib/images.ts) always matches what's actually rendered on screen.
const CELL_W = 380;
const CELL_H = 380;
const GUTTER = 12;
const BLOCK_W = COLS * CELL_W;
const BLOCK_H = ROWS * CELL_H;
const MARGIN = 240; // pre-render slack (px) beyond the viewport edges

// Bento layout: [col, row, colSpan, rowSpan] on a COLS x ROWS grid.
// Verified to cover all 24 cells exactly once (no gaps, no overlaps).
const BENTO: [number, number, number, number][] = [
  [0, 0, 2, 2],
  [2, 0, 1, 1],
  [3, 0, 1, 1],
  [2, 1, 2, 1],
  [0, 2, 1, 2],
  [1, 2, 1, 1],
  [2, 2, 2, 2],
  [1, 3, 1, 1],
  [0, 4, 2, 1],
  [2, 4, 1, 2],
  [3, 4, 1, 1],
  [0, 5, 1, 1],
  [1, 5, 1, 1],
  [3, 5, 1, 1],
];

type Tile = {
  k: number;
  x: number;
  y: number;
  w: number;
  h: number;
  shape: string;
};

const BASE_TILES: Tile[] = BENTO.map(([c, r, cw, ch], k) => ({
  k,
  x: c * CELL_W + GUTTER / 2,
  y: r * CELL_H + GUTTER / 2,
  w: cw * CELL_W - GUTTER,
  h: ch * CELL_H - GUTTER,
  shape: `${cw}x${ch}`,
}));

export default function SplashView({
  images,
}: {
  images: Record<string, string[]>;
}) {
  // Pulled from the featured folder on the server (see lib/images.ts).
  // Files named "<cols>x<rows>.<seq>.ext" (e.g. "2x2.001.jpg") only fill
  // bento cells of that exact shape; anything else lands under "misc" and
  // is used as a fallback for shapes that have no dedicated images yet.
  // Falls back to the hardcoded list only if the folder read comes back
  // empty entirely.
  const hasAny = Object.values(images).some((list) => list.length > 0);
  const misc = images.misc ?? [];
  const fallback = FEATURED_PROJECT.images;

  const poolFor = (shape: string): string[] => {
    if (!hasAny) return fallback;
    const exact = images[shape];
    if (exact && exact.length > 0) return exact;
    if (misc.length > 0) return misc;
    return fallback;
  };

  const imageFor = (t: Tile, ci: number, cj: number) => {
    const pool = poolFor(t.shape);
    return pool[((t.k + ci * 3 + cj * 7) % pool.length + pool.length) % pool.length];
  };

  const rootRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const offset = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const last = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const raf = useRef<number | null>(null);
  const size = useRef({ w: 0, h: 0 });
  const interacted = useRef(false);

  const reduceMotion = useRef(false);

  const [win, setWin] = useState({ ci0: 0, ci1: 0, cj0: 0, cj1: 0 });
  const winRef = useRef(win);

  // Prevent re-computing the visible block window unless it actually changed.
  const syncWindow = () => {
    const { w, h } = size.current;
    if (!w || !h) return;
    const { x, y } = offset.current;
    const next = {
      ci0: Math.floor((-x - MARGIN) / BLOCK_W),
      ci1: Math.floor((-x + w + MARGIN) / BLOCK_W),
      cj0: Math.floor((-y - MARGIN) / BLOCK_H),
      cj1: Math.floor((-y + h + MARGIN) / BLOCK_H),
    };
    const cur = winRef.current;
    if (
      next.ci0 !== cur.ci0 ||
      next.ci1 !== cur.ci1 ||
      next.cj0 !== cur.cj0 ||
      next.cj1 !== cur.cj1
    ) {
      winRef.current = next;
      setWin(next);
    }
  };

  // Write the pan offset straight to the DOM — no React render per frame.
  const apply = () => {
    const { x, y } = offset.current;
    if (layerRef.current) {
      layerRef.current.style.transform = `translate3d(${Math.round(
        x
      )}px, ${Math.round(y)}px, 0)`;
    }
    if (overlayRef.current) {
      const dist = Math.hypot(x, y);
      overlayRef.current.style.opacity = String(
        Math.max(0, 1 - dist / 480)
      );
    }
    syncWindow();
  };

  const stopRaf = () => {
    if (raf.current !== null) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
    }
  };

  const glide = () => {
    const v = vel.current;
    offset.current.x += v.x;
    offset.current.y += v.y;
    v.x *= 0.93;
    v.y *= 0.93;
    apply();
    if (Math.hypot(v.x, v.y) > 0.08) {
      raf.current = requestAnimationFrame(glide);
    } else {
      raf.current = null;
    }
  };

  const fadeHint = () => {
    if (interacted.current) return;
    interacted.current = true;
    if (hintRef.current) hintRef.current.style.opacity = "0";
  };

  // Measure the viewport and keep the block window in sync.
  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const r = el.getBoundingClientRect();
      size.current = { w: r.width, h: r.height };
      apply();
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wheel / trackpad panning (non-passive so we can stop the page scroll).
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      stopRaf();
      offset.current.x -= e.deltaX;
      offset.current.y -= e.deltaY;
      vel.current = { x: -e.deltaX * 0.25, y: -e.deltaY * 0.25 };
      fadeHint();
      apply();
      if (!reduceMotion.current) {
        stopRaf();
        raf.current = requestAnimationFrame(glide);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    stopRaf();
    dragging.current = true;
    interacted.current || fadeHint();
    last.current = { x: e.clientX, y: e.clientY };
    vel.current = { x: 0, y: 0 };
    rootRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    offset.current.x += dx;
    offset.current.y += dy;
    // Smooth the velocity a little so flicks feel natural.
    vel.current = {
      x: vel.current.x * 0.2 + dx * 0.8,
      y: vel.current.y * 0.2 + dy * 0.8,
    };
    apply();
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    rootRef.current?.releasePointerCapture(e.pointerId);
    if (!reduceMotion.current && Math.hypot(vel.current.x, vel.current.y) > 0.5) {
      stopRaf();
      raf.current = requestAnimationFrame(glide);
    }
  };

  useEffect(() => () => stopRaf(), []);

  // Filter to tiles that actually intersect the viewport (+ margin), rather
  // than mounting every tile in a whole block once any part of it is
  // visible — at block edges that was rendering 2-3x more <img>s than
  // were ever on screen.
  const tiles = useMemo(() => {
    const { x, y } = offset.current;
    const { w, h } = size.current;
    const left = -x - MARGIN;
    const right = -x + w + MARGIN;
    const top = -y - MARGIN;
    const bottom = -y + h + MARGIN;

    const out: { key: string; src: string; left: number; top: number; w: number; h: number }[] = [];
    for (let cj = win.cj0; cj <= win.cj1; cj++) {
      for (let ci = win.ci0; ci <= win.ci1; ci++) {
        for (const t of BASE_TILES) {
          const ax = ci * BLOCK_W + t.x;
          const ay = cj * BLOCK_H + t.y;
          if (ax + t.w < left || ax > right || ay + t.h < top || ay > bottom) continue;
          out.push({
            key: `${ci}:${cj}:${t.k}`,
            src: imageFor(t, ci, cj),
            left: ax,
            top: ay,
            w: t.w,
            h: t.h,
          });
        }
      }
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win, images]);

  return (
    <div
      ref={rootRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className="
        relative
        h-full
        w-full
        overflow-hidden
        ml-12
        sm:ml-14
        cursor-grab
        active:cursor-grabbing
        touch-none
        select-none
      "
    >
      {/* Infinite pannable image plane */}
      <div ref={layerRef} className="absolute left-0 top-0 will-change-transform">
        {tiles.map((tile) => (
          <Image
            key={tile.key}
            src={tile.src}
            alt=""
            draggable={false}
            width={tile.w}
            height={tile.h}
            quality={60}
            style={{
              position: "absolute",
              left: tile.left,
              top: tile.top,
            }}
            className="block max-w-none object-cover pointer-events-none select-none bg-ink/20 border border-paper/40"
          />
        ))}
      </div>

      {/* Legibility vignette */}
      <div
        className="
          absolute
          inset-0
          pointer-events-none
          bg-gradient-to-t
          from-ink/80
          via-transparent
          to-transparent
        "
      />

      {/* Featured text — fixed, fades out as you roam */}
      <div
        ref={overlayRef}
        className="
          absolute
          z-10
          bottom-16
          left-0
          px-6
          sm:px-12
          pointer-events-none
        "
      >
        <p className="text-[11px] tracking-wide3 uppercase text-paper/60 mb-3">
          {FEATURED_PROJECT.category} — {FEATURED_PROJECT.year}
        </p>

        <h1 className="text-paper text-[13vw] leading-[0.9] tracking-tightest2 font-medium uppercase sm:text-[5vw]">
          {FEATURED_PROJECT.title}
        </h1>

        <p className="mt-6 max-w-md text-[10px] leading-relaxed text-paper/70">
          {FEATURED_PROJECT.description}
        </p>

        <p className="mt-4 text-[11px] tracking-wide2 uppercase text-paper/50">
          {FEATURED_PROJECT.location}
        </p>
      </div>

      {/* Roam hint — fades on first interaction */}
      <div
        ref={hintRef}
        className="
          absolute
          z-10
          bottom-6
          right-6
          sm:right-12
          text-[10px]
          tracking-wide2
          uppercase
          text-paper/50
          pointer-events-none
          transition-opacity
          duration-700
        "
      >
        Drag to explore ✦
      </div>
    </div>
  );
}
