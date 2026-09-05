# Black Hole Experience

An immersive, left-to-right English React 19 + Vite experience about black
holes, gravitational lensing, and the scientists who helped us understand
them. The hero is rendered with a custom WebGL pipeline, while the rest of the
page remains useful when WebGL is unavailable.

The interface is intentionally dark and editorial: warm accretion-disk light,
system sans-serif typography, grayscale scientist portraits,
keyboard-accessible controls, and cards that can be browsed with either buttons
or touch gestures.

## Stack

- React 19 with Vite
- TypeScript-checked TSX components
- Tailwind CSS v4
- Native WebGL shaders with adaptive quality and a visual fallback
- Scientist portraits served from `public/scientists` and displayed in grayscale

## Features

- Interactive black-hole hero with an adaptive WebGL renderer.
- CSS fallback when WebGL is unsupported, loses its context, or cannot allocate
  the required buffers.
- Responsive English LTR layout for mobile, tablet, and desktop screens.
- Six scientist archive cards with swipe, pointer, keyboard, and dot navigation.
- External source links on every archive card. Links open in a new tab and do
  not trigger the card's swipe gesture.
- Reduced-motion support through `prefers-reduced-motion`.
- Lazy-loaded, dimensioned scientist images with grayscale treatment.

## Development

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run typecheck
npm run build
npm run preview
```

## Deploy to GitHub Pages

The Vite base path is configured for this repository's project site:
`/Black-Hole-Experience/`. To publish the production build to the `gh-pages`
branch, run:

```bash
npm install
npm run lint
npm run typecheck
npm run deploy
```

Then, in GitHub, open `Settings → Pages`, choose `Deploy from a branch`, select
the `gh-pages` branch and the `/ (root)` folder, and save. The site will be
available at:
`https://parsa-rajabi-nanami.github.io/Black-Hole-Experience/`

`npm run typecheck` validates the TypeScript components even though the main
entry points are JavaScript. There is no automated test runner configured yet;
manual browser verification is currently the source of truth for the WebGL
hero, responsive layout, image loading, and carousel interactions.

## Project structure

```text
src/
├── components/
│   ├── black-hole-experience-page.tsx
│   └── ui/
│       ├── blackhole-hero-section.tsx
│       └── testimonial.tsx
├── App.jsx
├── index.css
└── main.jsx
```

Static assets live under `public/` because their URLs are stable at runtime:

```text
public/
└── scientists/
    ├── andrea-ghez.jpg
    ├── cape-thorn.jpg
    ├── john-mitchell.jpg
    ├── karl-schwarzschild.jpg
    ├── roger-penrose.jpg
    └── stephen-hawking.jpg
```

The WebGL hero pauses when it is outside the viewport, caps device pixel ratio,
adapts to software rendering, and respects `prefers-reduced-motion`. If WebGL
is unavailable or loses its context, the page keeps its content and presents a
lightweight CSS fallback.

## Accessibility and LTR behavior

The document declares `lang="en"` and `dir="ltr"` at the HTML level, and the
application repeats the direction at its root so embedded sections keep the
same writing mode. Buttons and links have visible focus states, portraits have
English alternative text, and the archive exposes tab and panel semantics for
keyboard and assistive-technology users.

For a quick manual check, open the site at approximately 375px, 768px, and
1440px widths. Confirm that the hero actions scroll to their sections, source
links open normally, cards can be swiped without dragging a link, and the page
has no horizontal overflow.

## Release notes

Before publishing, choose and add the repository's preferred open-source
license. No license is implied by this repository yet.
