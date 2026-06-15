# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static marketing website for **Kotao Academy** — audiovisual training courses at Studio Kotao in Colombes (92). No build system, no package manager, no dependencies. Open `index.html` directly in a browser or serve with any static file server.

```bash
# Quick local preview
npx serve .
# Deploy to production
npx vercel --prod
```

## Architecture

Three files make up the live site:

| File | Role |
|------|------|
| `index.html` | Single-page landing site with anchor-link navigation |
| `style.css` | All styles for `index.html` |
| `script.js` | Scroll reveal, FAQ accordion, nav scroll effect, catalogue tabs |

`reservation.html` is a standalone booking page with **inline CSS** (not shared with `style.css`). It reads `?formation=mobile` or `?formation=creator` from the URL to populate the formation card and date options dynamically. The `formations` object at the bottom of its `<script>` block holds all formation data and available dates.

`AVANT/` is the archived previous version — do not modify.

## Key patterns

**Scroll animations** — add `data-reveal`, `data-reveal-left`, or `data-reveal-right` to any element; `script.js` uses `IntersectionObserver` to add `.visible` when it enters the viewport. Wrap a group in `.stagger` to get staggered delays (up to 6 children). For image clip reveals, use `data-clip` on the container.

**Catalogue tabs** — the `[data-tabs]` container in `index.html` is wired automatically by `script.js`. Each `<button class="tab-btn" data-tab="X">` maps to `<div class="tab-panel" data-panel="X">`.

**FAQ accordion** — `.faq__item` toggles `.open` on click; CSS uses `max-height` transition to reveal `.faq__answer`.

## Design tokens (`:root` in `style.css`)

```css
--accent:       #D1FE17   /* lime yellow — primary brand colour */
--bg:           #0a0a0a   /* page background */
--bg-2:         #111111   /* section alternation */
--bg-3:         #1a1a1a   /* cards */
--muted:        #888888   /* secondary text */
```

`reservation.html` duplicates these under different names (`--orange`, `--dark`, etc.) — keep both in sync if colours change.
