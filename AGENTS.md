# Repository Guidelines

## Project Structure & Module Organization

This repository is a React 19 application built with Vite.

- `src/main.jsx` bootstraps the application, while `src/App.jsx` contains the
  main page component.
- `src/App.css` and `src/index.css` contain component and global styles.
- `src/assets/` contains imported build-time assets such as images and SVGs.
- `public/` contains static files served from the site root (for example,
  `/icons.svg` and `/favicon.svg`).
- `index.html` is the Vite entry document; `vite.config.js` and
  `eslint.config.js` define build and lint behavior.

Keep feature-specific components and styles close to the feature. Use `public/`
only for files that must retain stable root-relative URLs.

## Build, Test, and Development Commands

Install dependencies with `npm install`, then use:

- `npm run dev` — start the Vite development server with HMR.
- `npm run build` — create the production bundle in `dist/`.
- `npm run preview` — serve the production bundle locally for inspection.
- `npm run lint` — run ESLint across the repository.

There is currently no automated test framework or `npm test` script. For UI
changes, manually verify the affected flow in the dev server and run the build
and lint commands before opening a PR.

## Coding Style & Naming Conventions

Use the existing JavaScript/JSX style: two-space indentation, semicolon-free
code, single-quoted JavaScript strings, and trailing commas where the codebase
uses them. Name React components in PascalCase, functions and variables in
camelCase, and CSS classes/IDs descriptively. Prefer semantic HTML and preserve
accessible labels, focus states, and meaningful image `alt` text. Follow the
ESLint configuration; do not disable a rule without documenting why.

## Testing Guidelines

No test suite is configured yet. When adding interactive behavior, add tests
only after introducing and documenting an appropriate test setup; otherwise,
include clear manual verification steps in the PR description.

## Commit & Pull Request Guidelines

The repository currently has only an initial `first commit`, so no established
commit convention can be inferred. Use short, imperative subjects such as
`Add responsive hero layout` and keep each commit focused. PRs should explain
the user-visible change, list validation performed (`npm run lint`,
`npm run build`, and manual checks), link related issues, and include screenshots
or a short recording for visual changes.
