import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        ink: "#0A0A0A",
        line: "#0A0A0A",
        mute: "#8A8A85",
      },
      fontFamily: {
        mono: [
          "'IBM Plex Mono'",
          "ui-monospace",
          "'SFMono-Regular'",
          "Menlo",
          "monospace",
        ],
        futura: [
           "'Futura PT'",
           "'Futura'",
          "'Century Gothic'",
           "Arial",
            "sans-serif",
  ],
        sans: [
          "'Helvetica Neue'",
          "'Neue Haas Grotesk'",
          "Arial",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tightest2: "-0.04em",
        wide2: "0.08em",
        wide3: "0.16em",
      },
      transitionTimingFunction: {
        architectural: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
