# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static site generator for Mary Rytikova's photography portfolio at plushka.se. The build script processes source images, injects data into an HTML template, and minifies CSS/JS — producing a self-contained SPA in `build/`.

## Commands

```bash
npm run build         # incremental build (skips already-processed images)
npm run build:force   # wipe build/photos and rebuild all images from scratch
npm run dev           # build + start local server
npm run serve         # local server only (port 3000)
npm run clean         # rm -rf build
```

Open `build/index.html` locally or visit `http://localhost:3000` after `npm run serve`.

## Architecture

**Build pipeline** (`build.js`):
1. Validates that every image listed in `pages.js` exists in `photos/` — missing files abort the build
2. Generates `preview_<name>` thumbnails (max 1000px, 85% JPEG) and full-size versions (max 3000px, 95% JPEG) into `build/photos/`; already-existing outputs are skipped
3. Computes MD5 hashes of processed images, CSS, and JS for cache-busting query strings
4. Replaces two placeholders in `script.js` before minification:
   - `ALL_SITE_IMAGES` → JSON array of all `{ preview, full, name, alt }` objects
   - `PAGES_DATA_PLACEHOLDER` → JSON array of `{ name, title, content }` objects (content = pre-rendered HTML)
5. Injects hashed asset URLs and navigation links into `template.html` → `build/index.html`

**SPA runtime** (`script.js`):
- Hash-based routing: `#index`, `#Restaurants`, `#Kids`, `#places`, `#about`
- On navigation, swaps `#page-content` innerHTML from the embedded `PAGES_DATA` constant (no network requests)
- Lightbox supports keyboard (←/→/Esc), touch swipe, and double-tap to close
- Preloads all preview images on load, then all full images in the background

## Adding/changing pages

Edit `pages.js` — this is the only content config file. Each page object:

```js
{
    name: 'page-id',    // used as URL hash
    title: 'Title',     // null for homepage; shown in header and nav
    template: 'gallery' // or 'about'
    images: ['filename.jpg', ...]  // filenames relative to photos/
}
```

After editing `pages.js`, run `npm run build`. The build fails if any listed image is missing from `photos/`.

## Deployment

Every push triggers GitHub Actions (`deploy.yml`):
- **Default**: deploys to a Cloudflare Pages preview branch
- **Production**: requires manual `workflow_dispatch` with `deploy_production: true`

Required secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`  
Required variables: `CLOUDFLARE_PROJECT_NAME`, `WEBSITE_URL`
