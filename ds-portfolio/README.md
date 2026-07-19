# Studio Arkhe — rotating portfolio

A portfolio interaction inspired by the Diller Scofidio + Renfro website:
clicking **Index** rotates the whole interface 90° around the top-left
corner, like a sheet of paper turning, and reveals the project directory.
Clicking again rotates it back.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## How the rotation works

There are two layers, both driven by a single `state: "splash" | "index"`
value in `hooks/useRotation.tsx`:

1. **`#rotator`** (`components/AppShell.tsx`, styled in `app/globals.css`)
   — the literal rotating sheet. It holds only the permanent edge
   chrome: the site title, the primary nav, and the Index button. It
   never unmounts or rebuilds; it just gets a `data-state` attribute
   that flips a CSS transform:

   - Splash: `width: 100vw; height: 100vh; transform: none;`
   - Index: `width: 100vh; height: 100vw; transform: translate(100vw, 0) rotate(90deg);`

   `transform-origin` is pinned to `top left` the whole time. The
   width/height swap is what lets a 90° rotation land flush against a
   non-square viewport with no clipping or gaps — the math is written
   out in the CSS comments above `#rotator`. Because the title uses
   `writing-mode: vertical-rl`, it doesn't need any extra logic to
   "become horizontal" — that falls straight out of the parent rotating
   90°, exactly as the brief describes.

2. **`#content-pane`** — the readable body content (the hero image /
   copy in Splash, the search + category grid in Index). It sits as an
   upright sibling layer and crossfades in step with the rotation
   timing, so long-form content never has to be read sideways. This
   keeps the rotation itself GPU-cheap (`transform` + a couple of
   `width`/`height` swaps) and keeps the directory legible immediately.

Animation timing (duration, easing) lives in one place: the
`--rotation-duration` / `--rotation-ease` CSS variables in
`app/globals.css`, mirrored by `ROTATION_DURATION_MS` in
`hooks/useRotation.tsx` so the two stay in sync.

## Adding sections later

`lib/constants.ts` holds all the copy (`PRIMARY_NAV`,
`INDEX_CATEGORIES_LEFT/RIGHT`, `FEATURED_PROJECT`). Add a new nav entry
and it shows up in the rotating gutter automatically. New pages
(Projects, Studio, News, Contact…) can be added as their own
components rendered inside `#content-pane` without touching the
rotation system at all — that's the whole point of keeping the two
layers separate.

## Structure

```
app/
  layout.tsx        root layout
  page.tsx           mounts RotationProvider + AppShell
  globals.css         Tailwind + the rotation geometry
components/
  AppShell.tsx        composes the rotator and the content pane
  Header.tsx           vertical site title / rotates to horizontal
  Nav.tsx               vertical primary nav
  IndexToggle.tsx        the Index / Close button
  SplashView.tsx          hero / project view content
  IndexView.tsx            search + category + grid content
hooks/
  useRotation.tsx         splash/index state, shared via context
lib/
  constants.ts            nav items, categories, copy
```
