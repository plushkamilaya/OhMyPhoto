# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static site generator for Mary Rytikova's photography portfolio at plushka.se. The build script processes source images, injects data into an HTML template, and minifies CSS/JS — producing a self-contained SPA in `build/`.

## Commands

```bash
npm run build         # incremental build (skips already-processed images)
npm run build:force   # wipe build/photos and rebuild all images from scratch
npm run dev           # build + start local server
npm run serve         # local server only (port 8000; override with PORT=...)
npm run watch         # build + serve + rebuild on pages.js changes
npm run clean         # rm -rf build
```

Open `build/index.html` locally or visit `http://localhost:8000` after `npm run serve`.

**Incremental caveat**: processed images are skipped if the output file already exists, so replacing a photo's content while keeping the same filename requires `npm run build:force` (or deleting its outputs from `build/photos/`).

## Architecture

**Build pipeline** (`build.js`):
1. Validates that every image listed in `pages.js` exists in `photos/` — missing files abort the build; unused photos only produce a warning
2. Generates `preview_<name>` thumbnails (max 1000px) and full-size versions (max 3000px) into `build/photos/`, both 85% JPEG; already-existing outputs are skipped
3. Processes gear images from `gear/` → `build/photos/gear_<name>.jpg`: trims borders, flattens transparency and near-white vendor backdrops to pure white, resizes to max 600px
4. Computes MD5 hashes of processed images, CSS, and JS for cache-busting query strings
5. Replaces two placeholders in `script.js` before minification:
   - `ALL_SITE_IMAGES` → JSON array of all `{ preview, full, name, alt }` objects
   - `PAGES_DATA_PLACEHOLDER` → JSON array of `{ name, title, content }` objects (content = pre-rendered HTML)
6. Injects hashed asset URLs and navigation links into `template.html` → `build/index.html`

**SPA runtime** (`script.js`):
- Hash-based routing: `#index`, `#Restaurants`, `#Kids`, `#places`, `#about`
- Deep links to a lightbox image via query param: `/#Restaurants?image=ES7A6101`
- On navigation, swaps `#page-content` innerHTML from the embedded `PAGES_DATA` constant (no network requests)
- Lightbox supports keyboard (←/→/Esc), touch swipe, and double-tap to close
- Preloads all preview images on load, then all full images in the background

## Adding/changing pages

Edit `pages.js` — the content config file. Each page object:

```js
{
    name: 'page-id',    // used as URL hash
    title: 'Title',     // null for homepage; shown in header and nav
    template: 'gallery', // or 'about'
    images: ['filename.jpg', ...]  // filenames relative to photos/
}
```

A gallery image entry can also be `{ src: 'filename.jpg', wide: 2 }` to span 2 (or 3) grid columns.

The `about` page additionally has a `gear` array: `{ category, name, image, url, description }` per item, with `image` relative to `gear/`. Note the About biography text is hardcoded in `generateAboutHTML()` in `build.js`, not in `pages.js`.

After editing `pages.js`, run `npm run build`. The build fails if any listed image is missing from `photos/` (or gear image from `gear/`).

## Deployment

Every push triggers GitHub Actions (`deploy.yml`):
- **Default**: deploys to a Cloudflare Pages preview branch
- **Production**: requires manual `workflow_dispatch` with `deploy_production: true`

Required secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`  
Required variables: `CLOUDFLARE_PROJECT_NAME`, `WEBSITE_URL`
