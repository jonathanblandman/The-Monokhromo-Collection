# The Monokhromo Collection — monokhromo.com

Static site. No build step. Deploy-ready for Cloudflare Pages.

---

## Local preview

Open `index.html` directly in any browser, or run a local server:

```sh
# Python 3
python -m http.server 8000

# Node (if installed)
npx serve .
```

Visit `http://localhost:8000`

---

## Cloudflare Pages — deploy settings

| Setting | Value |
|---|---|
| Build command | *(leave empty)* |
| Build output directory | `/` |
| Root directory | `/` |

### Via GitHub
1. Push this folder (root) to a GitHub repository.
2. In Cloudflare Pages → Create project → Connect to Git.
3. Select the repository. Apply the settings above. Deploy.

### Via direct upload
1. In Cloudflare Pages → Create project → Direct Upload.
2. Upload a zip of this folder (root).
3. Deploy.

### Custom domain
After first deploy: Pages project → Custom domains → Add `monokhromo.com`.  
Add `www.monokhromo.com` as a second entry — the `_redirects` file handles the 301 to the apex automatically.

---

## Adding the logo

Replace the text mark in `index.html`:

```html
<!-- Current text mark -->
<a href="/" class="logo" ...>MONOKHROMO</a>

<!-- With an image logo -->
<a href="/" class="logo" ...>
  <img src="assets/logo/monokhromo-logo.svg" alt="The Monokhromo Collection" width="140" height="24">
</a>
```

Add the logo file to `/assets/logo/`. SVG preferred. Keep height ≤ 28px at display size.

---

## Adding photography

Place images in `/assets/images/`. Filenames must match the `src` attributes in `index.html`:

| Slot | Filename |
|---|---|
| Black Doorway Study | `black-doorway-study-valletta-malta.jpg` |
| Light Across Stone | `light-across-stone-mdina-malta.jpg` |
| Sea Ladder | `sea-ladder-mediterranean.jpg` |
| The Narrow Street | `the-narrow-street-malta.jpg` |
| Harbour Geometry | `harbour-geometry-sliema-malta.jpg` |
| Human Trace | `human-trace-street-study-malta.jpg` |

**Image specs:**
- Format: WebP (primary). JPEG fallback accepted.
- Gallery images: 1200 × 1500 px (4:5 portrait)
- Max file size: 300 KB after compression
- All images must be monochrome (black and white only)

When adding WebP/AVIF versions, upgrade the `<img>` tags to `<picture>` elements with `srcset`.

**Hero image:**  
Replace `div.ph--hero` (the dark gradient placeholder in `.hero-image`) with:

```html
<img
  src="assets/images/hero.jpg"
  alt="[describe the image]"
  width="1440"
  height="900"
  fetchpriority="high"
  class="hero-img"
>
```

Add to `styles.css`:
```css
.hero-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

---

## Adding the OG image

Place `og-image.jpg` at `assets/og-image.jpg`.  
Dimensions: 1200 × 630 px. A strong, high-contrast black-and-white frame.

---

## File map

```
/
  index.html          Single-page site (Phase 1)
  styles.css          All styles
  script.js           Minimal JS — header scroll + mobile nav
  _headers            Cloudflare security headers
  _redirects          www → apex 301 redirect
  README.md           This file
  CLAUDE.md           Builder directive for Claude Code
  /assets
    /images           Photography (add files here)
    /logo             Logo files (add files here)
    og-image.jpg      Open Graph image (add file here)
```

---

## Phase roadmap

| Phase | Scope | Status |
|---|---|---|
| 1 | Single landing page | **Current** |
| 2 | Collection pages (`/collection/malta-in-shadow-volume-i/`) | Pending |
| 3 | Journal article pages (`/journal/[slug]/`) | Pending |
| 4 | Print enquiry form (email only, no payment) | Pending |
| 5 | Limited edition print release page | Pending |
| 6 | Interior / hospitality enquiry package | Pending |

Do not build future phases without a Founder directive.

---

*The Monokhromo Collection — studio@monokhromo.com*
