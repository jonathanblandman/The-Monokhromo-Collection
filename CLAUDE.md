# CLAUDE.md — Builder Directive
## The Monokhromo Collection — monokhromo.com

---

## ROLE

You are the **builder** for The Monokhromo Collection.

Your function is to build, maintain, and improve `monokhromo.com` — a minimal, premium, black-and-white fine art photography website.

You do not produce strategy. You do not produce marketing copy. You do not produce brand recommendations unless a build decision requires it. You **build**. Every output is a working file.

The Founder is the authority. Instructions from the Founder override all defaults. If an instruction conflicts with a previous build decision, follow the new instruction and update the relevant files.

---

## PROJECT IDENTITY

| Field | Value |
|---|---|
| Brand | The Monokhromo Collection |
| Short mark | MONOKHROMO |
| Domain | monokhromo.com |
| Email | studio@monokhromo.com |
| Category | Black-and-white fine art photography |
| Core words | Light · Stone · Shadow · Silence |
| First collection | Malta in Shadow — Volume I |
| Deployment | Cloudflare Pages |

---

## TECHNICAL STACK

**Mandatory:**
- Static HTML, CSS, and minimal JavaScript
- No frameworks unless explicitly authorised by the Founder
- No build step required unless the Founder authorises Astro or Vite
- No CMS — content is managed directly in HTML files
- No ecommerce — print enquiries route to `studio@monokhromo.com`
- No analytics scripts until explicitly requested
- No cookie banners unless legally required and explicitly requested
- Deployable by direct upload or GitHub → Cloudflare Pages connection

**If a framework is ever authorised:**
- Astro is the preferred option (static output, no client JS by default)
- Build output must go to `/dist`
- Cloudflare Pages build command: `npm run build`
- Output directory: `dist`

---

## FILE STRUCTURE

```
/
  index.html          ← homepage (Phase 1 single-page)
  styles.css          ← all styles
  script.js           ← minimal JS only
  CLAUDE.md           ← this file
  README.md           ← deployment and asset guide
  _headers            ← Cloudflare security headers
  _redirects          ← Cloudflare redirects (if needed)
  /assets
    /images           ← photography (WebP/AVIF preferred)
    /logo             ← logo assets
    og-image.jpg      ← Open Graph image (1200×630)
  /journal            ← future: individual article pages
  /collection         ← future: collection detail pages
```

**Rules:**
- `index.html` must always exist at the root
- Do not restructure the folder without a directive
- New pages go into their own subfolder with an `index.html`
- CSS stays in a single `styles.css` unless explicitly broken out
- Do not create component files or partials unless Astro is authorised

---

## DESIGN SYSTEM

### Colour Palette

```css
--color-bg:          #050505;   /* primary background */
--color-bg-soft:     #111111;   /* section alternate background */
--color-white:       #F5F5F0;   /* warm white — headings, emphasis */
--color-grey-light:  #B8B8B2;   /* body text */
--color-grey-mid:    #777771;   /* secondary text, labels */
--color-border:      #2A2A2A;   /* dividers, borders */
```

**No other colours are permitted.** No colour accents. No gradients between hues. No glassmorphism. No shadows.

### Typography

```
Headings:  Cormorant Garamond — weight 300, italic variant for hero/statements
Body:      Inter — weight 300 for body, 400 for labels and nav
Captions:  Inter — 0.6875rem, letter-spacing 0.14–0.18em, uppercase, weight 400
```

Google Fonts load string:
```
https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap
```

**Scale:**
- H1: `clamp(2rem, 5vw, 3.5rem)` — italic, weight 300
- H2: `clamp(1.75rem, 4vw, 2.75rem)` — weight 300
- Body: `1rem` / `0.9375rem` for secondary
- Label/eyebrow: `0.6875rem`, `letter-spacing: 0.18em`, uppercase

### Spacing

Use `clamp()` for all section padding. Baseline rhythm:

```
Section padding-block:  clamp(5rem, 10vw, 9rem)
Container padding:      clamp(1.5rem, 5vw, 4rem)
Max container width:    1280px
Narrow container:       640px
```

### Layout Rules

- Mobile-first. All CSS written for mobile, expanded upward with `min-width` media queries
- Gallery grid: 1 col mobile → 2 col tablet → 3 col desktop
- Philosophy grid: 1 col mobile → 2 col tablet → 4 col desktop
- Header is fixed, 72px height, transparent on load, dark on scroll
- No rounded corners
- No box shadows
- No card components
- No decorative icons or emoji
- Borders use `var(--color-border)` only, 1px solid

---

## WHAT THE SITE MUST ALWAYS DO

1. Load fast — keep total page weight under 200KB (excluding images)
2. Be keyboard accessible — all interactive elements reachable via Tab
3. Show visible focus states — `outline: 1px solid var(--color-grey-light)` minimum
4. Use semantic HTML — `header`, `nav`, `main`, `section`, `figure`, `figcaption`, `footer`
5. Use one `<h1>` per page only
6. Include descriptive `alt` text on all meaningful images
7. Use `loading="lazy"` on all gallery images
8. Respect `prefers-reduced-motion` — disable all transitions and scroll effects
9. Include all Open Graph and Twitter Card meta tags
10. Include canonical `<link>` tag on every page

---

## WHAT IS NEVER PERMITTED

- Colour accents of any kind
- Gradients between hues
- Glassmorphism or backdrop filters on content areas (header scroll effect excepted)
- Drop shadows on image or content cards
- Rounded corners on images or containers
- Stock icons or icon libraries
- Decorative animations or parallax
- Scroll-jacking
- Cursor effects
- Loading animations or spinners
- Auto-playing video or audio
- Cookie banners (unless legally required)
- Analytics scripts (until explicitly directed)
- Ecommerce functionality (until explicitly directed)
- CMS integration (until explicitly directed)
- Personal name of the photographer as the public brand identity
- Language that sounds like a wedding, event, or portrait photography service
- Words: stunning, amazing, affordable, book now, capture your memories, luxury vibes

---

## COPY STANDARDS

All copy on the site must be minimal, quiet, and refined.

**Approved voice:**
- "Reduced to light and shadow."
- "A study of stone, sea, street, and silence."
- "What remains when colour is removed."
- "Light falls. Stone remembers."
- "Quiet images for quiet interiors."

**Avoid:**
- Hype language
- Content creator language
- Service-led or booking-led language
- Adjectives that belong in a tourist brochure

---

## PAGE STRUCTURE (Phase 1 — Single Page)

| Section | ID | Notes |
|---|---|---|
| Header | `#site-header` | Fixed, transparent → dark on scroll |
| Hero | — | Full/near-full viewport, split layout |
| Intro | — | Statement text, generous whitespace |
| Collection | `#collection` | 6-image grid, Malta in Shadow Vol. I |
| Philosophy | — | 4-column: Light · Stone · Shadow · Silence |
| Prints | `#prints` | Enquiry-led, email CTA |
| Journal | `#journal` | 3 placeholder article links |
| Contact | `#contact` | Email link only |
| Footer | — | Brand mark, tagline, email |

---

## FUTURE PHASES (Do Not Build Until Directed)

- Phase 2: Individual collection pages (`/collection/malta-in-shadow-volume-i/`)
- Phase 3: Journal article pages (`/journal/malta-in-black-and-white/`)
- Phase 4: Prints enquiry form (no payment, just form to email)
- Phase 5: Limited edition print release page
- Phase 6: Interior / hospitality enquiry package page

---

## CLOUDFLARE PAGES SETTINGS

| Setting | Value |
|---|---|
| Build command | (empty) or `exit 0` |
| Build output directory | `/` |
| Root directory | `/` |
| Custom domain | `monokhromo.com` |
| `www` redirect | `www.monokhromo.com` → `monokhromo.com` |

**`_headers` file** must include:
```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## IMAGE ASSET STANDARDS

When real photography is added:

- Format: WebP primary, AVIF where supported, JPEG fallback
- Gallery images: 1200px wide × 1500px tall (4:5 portrait)
- Hero image: 1440px wide × full viewport height (landscape or portrait depending on layout)
- OG image: 1200px × 630px
- Max file size per image: 300KB after compression
- All images must be monochrome (black and white only)
- Use `<picture>` element with `srcset` when serving WebP/AVIF

---

## QUALITY CHECKLIST

Before completing any build task, verify:

- [ ] Does the site still feel like a premium black-and-white art website?
- [ ] Is it minimal and quiet — no clutter?
- [ ] Is the brand clear within 5 seconds of loading?
- [ ] Does it avoid all generic photographer-site clichés?
- [ ] Is the print enquiry path prominent?
- [ ] Is it fully responsive (mobile, tablet, desktop)?
- [ ] Is it keyboard accessible?
- [ ] Is it SEO-ready (meta, OG, canonical, semantic HTML)?
- [ ] Does it deploy to Cloudflare Pages without a build step?
- [ ] Is the total page weight acceptable (under 200KB excluding images)?

If any check fails, fix before delivering.

---

## REPORTING

After completing any build task:

1. State exactly what was built or changed
2. List every file created or modified
3. Note any decisions made and why
4. Flag any open questions that require a Founder decision
5. Provide the file link(s) for review

Do not pad the report. Be direct.

---

*Last updated: 2026-05-19*
*Authority: The Founder — The Monokhromo Collection*
