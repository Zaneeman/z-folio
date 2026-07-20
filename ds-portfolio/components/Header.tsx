"use client";

import { SITE_TITLE } from "@/lib/constants";
import { useRotation } from "@/hooks/useRotation";

export default function Header({
  onBackToIndex,
  isProject = false,
}: {
  onBackToIndex: () => void;
  isProject?: boolean;
}) {
  const { toggle, isIndex } = useRotation();
  const displayTitle = isIndex ? "Z-FOLIO" : SITE_TITLE;
  const displayBack = isIndex ? "↑ Index" : "↓";
  const size2 = isProject
    ? "text-[clamp(16px,5vw,24px)]"
    : "text-[clamp(9px,2.5vw,12px)]";
  const color2 = isIndex ? "text-paper" : "text-ink";
  const background = isIndex ? "bg-ink" : "bg-paper";


  return (
    <>
      <div className={`absolute top-0 left-0 h-full w-12 sm:w-14 border-r border-ink/80 ${background} flex items-start justify-center pt-8`}>
        <button
          onClick={toggle}
          aria-label="Return to project view"
          className={`
           h-full
            flex
           items-center
            justify-left
           [writing-mode:vertical-rl]
            text-[clamp(28px,8vw,60px)]
            tracking-wide2
            font-medium
            hover:opacity-60
            transition-opacity
           whitespace-nowrap
             ${color2}
           `}
        >
          {displayTitle}
        </button>
      </div>

      {/*
        Anchored bottom-right (local, unrotated coordinates) — the inverse
        corner of the top-left title button above. It's a direct sibling
        of the header box (not nested inside it) so it's positioned
        relative to #rotator itself, the same way IndexToggle's
        bottom-left tab is — meaning it rotates rigidly with the rest of
        the chrome: it starts at the bottom-right of the screen in the
        splash orientation and swings to the top-right once #rotator
        rotates into the index orientation.
      */}
      <button
        onClick={onBackToIndex}
        aria-label="Back to index"
        className={`
  absolute
  bottom-6
  left-[-1rem]
  w-12
  sm:w-14
  flex
  justify-center
  [writing-mode:vertical-rl]
  ${size2}
  tracking-wide3
  uppercase
  ${color2}
  hover:text-ink
  transition-colors
  z-[9999]
`}
      >
        {displayBack}
      </button>
    </>
  );
}
