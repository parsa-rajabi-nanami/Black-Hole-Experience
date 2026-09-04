# Black Hole Experience

An immersive React 19 + Vite experience that explains black-hole lensing with a
custom WebGL renderer and a keyboard- and touch-friendly science archive.

## Stack

- React 19 with Vite
- TypeScript-checked TSX components
- Tailwind CSS v4
- Native WebGL shaders with adaptive quality and a visual fallback

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

The WebGL hero pauses when it is outside the viewport, caps device pixel ratio,
adapts to software rendering, and respects `prefers-reduced-motion`. If WebGL
is unavailable or loses its context, the page keeps its content and presents a
lightweight CSS fallback.

## Release notes

Before publishing, choose and add the repository's preferred open-source
license. No license is implied by this repository yet.
