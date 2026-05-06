# Coloring Book

A small browser-based coloring book built with React, TypeScript, and Vite.

The app lets users:

- Pick a color from a large touch-friendly palette
- Color SVG drawing regions by clicking or tapping
- Move through five progressively richer coloring levels
- Save the current drawing as a JPG image

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
