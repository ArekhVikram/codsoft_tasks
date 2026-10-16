# Facet — 3D Interactive Landing Page (CODSOFT Task: Landing Page, Level 1)

Open `index.html` by double-clicking it (after extracting the zip). It is one self-contained file with no install and no server. Fonts load from Google Fonts with system fallbacks, so it also works offline.

## Hero (matches the reference design)
- Transparent navigation with numbered links, active-section dots and a "Contact us" pill
- Large serif headline revealed line by line, short lead text and an "Explore our work" link with animated arrow
- Right-hand scroll rail with a moving marker and a live section counter (01 / 07)
- Bottom line with the tagline and a working ambient-sound toggle (off by default)
- Animated light beam, drifting haze and vignette

## 3D scene
Drawn with a small hand-written WebGL renderer (`FacetGL`, inside `index.html`), not a library:
- A large faceted glass crystal with iridescent, environment-style reflections and glowing edges
- 18 floating shards that orbit, spin and drift, plus dark rocks and ~900 dust particles with a copper sparkle cluster
- Blurred foreground rocks for depth of field (second, low-resolution canvas)
- Intro animation: the crystal scales in, shards fly into place, text and UI fade up
- The crystal turns with scroll, follows the pointer and moves between sections
- Showcase section with three themes (Prism, Ember, Frost) that blend smoothly

## Other features
Tilt cards, magnetic buttons, scroll reveals, animated counters, mobile menu, a drawn fallback when WebGL is unavailable, `prefers-reduced-motion` support, and a lighter scene on small screens (fewer shards and particles, lower resolution).

## Customise
Everything is in `index.html`: colours are CSS variables at the top of the `<style>` block, copy is in the HTML, themes and poses are in the last `<script>`. Replace the `hello@example.com` link and the footer social links with your own.

## Deploy
Static site: drag the folder into Netlify, or enable GitHub Pages on the repo.
