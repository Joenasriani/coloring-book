# Coloring Book

A small browser-based coloring book built with React, TypeScript, and Vite.

The app lets users:

- Pick a color from a large touch-friendly palette
- Color SVG drawing regions by clicking or tapping
- Move through five progressively richer coloring levels
- Save the current drawing as a JPG image
- Play optional background music from a bundled static audio file

## Tech stack

- React
- TypeScript
- Vite

## Local development

Prerequisites:

- Node.js 22.x recommended
- npm

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run TypeScript checks:

```bash
npm run typecheck
```

## itch.io HTML upload

This repo is configured for itch.io static HTML hosting.

Important build details:

- `vite.config.ts` uses `base: './'` so built JS, CSS, and assets load from a nested iframe or folder path.
- The app entry in `index.html` is relative.
- The music path in `main.tsx` is relative: `./music/Color%20Parade.mp3`.
- The GitHub Actions workflow builds the app, verifies `dist/index.html`, verifies the bundled music folder when present, then uploads `coloring-book-itch.zip` as a workflow artifact.

Manual itch.io ZIP creation:

```bash
npm install
npm run typecheck
npm run build
cd dist
zip -r ../coloring-book-itch.zip .
```

Upload `coloring-book-itch.zip` to itch.io, or upload a ZIP made from the contents of `dist`. Do not ZIP the repository root.

itch.io project settings:

- Kind of project: HTML
- Upload file: `coloring-book-itch.zip`
- Check: This file will be played in the browser
- Recommended orientation: responsive desktop and mobile browser

## Environment variables

No environment variables are required for the current app.

Do not add a Gemini or other AI API key unless a real server-side AI feature is introduced later. Frontend-only Vite environment variables can be exposed to browser bundles when referenced.

## Vercel deployment

Use these settings:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`
- Node.js version: 22.x recommended

## Production notes

This is a static frontend app. The current implementation does not require a backend, database, authentication, or AI API.
