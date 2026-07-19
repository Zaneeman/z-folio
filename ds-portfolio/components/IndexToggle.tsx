"use client";

import { useRotation } from "@/hooks/useRotation";

export default function IndexToggle({
  onOpenIndex,
}: {
  onOpenIndex: () => void;
}) {
  const { toggle, isIndex } = useRotation();

  const handleClick = () => {
    if (!isIndex) {
      // returning to index
      onOpenIndex();
    }

    toggle();
  };

  return (
    <button
      onClick={handleClick}
      aria-pressed={isIndex}
      className="absolute bottom-6 left-0 w-12 sm:w-14 flex justify-center [writing-mode:vertical-rl] rotate-180 text-[12px] tracking-wide3 uppercase text-mute hover:text-ink transition-colors"
    >
      {isIndex ? "Close" : "Index"}
    </button>
  );
}