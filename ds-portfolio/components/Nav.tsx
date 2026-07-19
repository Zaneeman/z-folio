"use client";

import { PRIMARY_NAV } from "@/lib/constants";

export default function Nav() {
  return (
    <nav
  aria-label="Primary"
  className="
    rotate-90
    absolute
    top-20
    left-[-60px]
    h-24
    w-24
    bg-paper
    flex
    flex-col
    items-start
    justify-start
    gap-8
  "
>
      {PRIMARY_NAV.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="[writing-mode:Horizo-rl] text-[12px] tracking-wide2 uppercase text-mute hover:text-ink transition-colors"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
