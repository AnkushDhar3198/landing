# NovaPulse Landing Page

An interactive, modern landing page built with **HTML**, **CSS**, and **JavaScript** only.

## Overview

NovaPulse is a frontend showcase project focused on:
- modern UI/UX patterns
- responsive design for desktop and mobile
- progressive enhancement using modern browser APIs
- accessibility and interaction quality

## Live Demo

If GitHub Pages is enabled from the `main` branch root, open:

`https://ankushdhar3198.github.io/landing/landing.html`

## Features

- Responsive hero and content sections
- Theme switching (dark/light) with persistence
- Accent color switching with persistence
- Command palette (`Ctrl + K` / `Cmd + K`)
- Scroll progress indicator and scroll spy navigation
- Animated counters and reveal-on-scroll effects
- Interactive cards (tilt + magnetic effects)
- Live activity feed simulation
- Pricing simulator
- Share and clipboard actions
- Reduced-motion and keyboard accessibility support

## Tech Stack

- HTML5 semantic structure (`dialog`, `template`, `details`, landmark sections)
- Modern CSS (`@layer`, custom properties, `color-mix`, container queries, media queries)
- Vanilla JavaScript (modular utilities, observers, state management, progressive feature checks)

## Project Structure

```
landing.html
landing.css
landing.js
README.md
```

## Run Locally

1. Clone the repository:
   `git clone https://github.com/AnkushDhar3198/landing.git`
2. Open folder:
   `cd landing`
3. Open `landing.html` in a browser
   - or use VS Code Live Server for auto-reload

## GitHub Pages Deployment

1. Open repository **Settings** -> **Pages**
2. Set:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
3. Save and wait for build
4. Visit:
   `https://ankushdhar3198.github.io/landing/landing.html`

## Keyboard Shortcuts

- `Ctrl + K` (or `Cmd + K`) -> Open command palette
- `Esc` -> Close command palette/menu

## Customization

- Edit content/sections in `landing.html`
- Update design tokens (colors, spacing, shadows) in `landing.css`
- Add/remove interactions in `landing.js`

## Browser Notes

The page uses progressive enhancement. Advanced APIs are used when available, with fallbacks for older browsers.

## License

This project is provided for learning and portfolio use.
