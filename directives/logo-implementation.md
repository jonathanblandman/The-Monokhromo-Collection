# Claude Code Directive — Logo Implementation
## The Monokhromo Collection — monokhromo.com

**Status:** Implemented  
**Authority:** The Founder  
**Last updated:** 2026-05-21

---

## ASSET

| Field        | Value                                       |
|---|---|
| File         | `assets/logo/monokhromo-logo.png`           |
| Dimensions   | 240 × 240px (square emblem mark)            |
| Format       | PNG, RGBA, optimised                        |
| File size    | ~52KB                                       |
| Display size | 40px (header) · 56px (footer)               |
| Source       | `../Logo Assets/Monokhromo Emblem Engraved Topaz Gigapixel 2x scale copy.png` |

The logo is the **emblem mark only**. No wordmark. No text beside it.

---

## HTML IMPLEMENTATION

### Header (`index.html` — inside `.site-header`)

```html
<a href="/" class="logo" aria-label="The Monokhromo Collection — return to home">
  <img src="/assets/logo/monokhromo-logo.png" alt="The Monokhromo Collection" class="logo-img" width="40" height="40">
</a>
```

### Footer (`index.html` — inside `.footer-brand`)

```html
<img src="/assets/logo/monokhromo-logo.png" alt="The Monokhromo Collection" class="footer-logo" width="56" height="56">
```

---

## CSS IMPLEMENTATION

### Header logo (`styles.css`)

```css
/* Logo */
.logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logo-img {
  display: block;
  width: auto;
  height: 40px;
  filter: brightness(0) invert(1);
  opacity: 0.9;
  transition: opacity var(--dur) var(--ease);
}

.logo:hover .logo-img,
.logo:focus-visible .logo-img {
  opacity: 1;
}
```

### Footer logo (`styles.css`)

```css
.footer-logo {
  display: block;
  width: auto;
  height: 56px;
  filter: brightness(0) invert(1);
  opacity: 0.85;
}
```

---

## RULES

1. **Always use the emblem mark** — `assets/logo/monokhromo-logo.png`. Do not substitute text.
2. **Always apply `filter: brightness(0) invert(1)`** — the site background is `#050505`. This renders the emblem white regardless of source colour. Do not remove this filter.
3. **Do not add a wordmark** unless explicitly directed by the Founder.
4. **Do not add border, shadow, background, or rounded corner** to the logo image. No decoration of any kind.
5. **Header height: 40px. Footer height: 56px.** Width is `auto` — preserve the 1:1 aspect ratio.
6. **Alt text must always be** `"The Monokhromo Collection"` — not "logo", not "MONOKHROMO".
7. **Respect `prefers-reduced-motion`** — the opacity transition on `.logo-img` is already governed by `var(--dur)`. No additional motion on the logo.
8. **If a new logo asset is provided**, resize to 240×240px, optimise as PNG, replace `assets/logo/monokhromo-logo.png`. Update `width`/`height` attributes in HTML if the aspect ratio changes.

---

## QUALITY CHECK

Before completing any task that touches the logo:

- [ ] Emblem visible in header on dark background (white, opacity 0.9)
- [ ] Hover state increases opacity to 1.0
- [ ] Footer emblem visible (white, opacity 0.85)
- [ ] No text fallback remaining (`MONOKHROMO` text must not appear)
- [ ] No rounded corners, shadows, or decorative borders on the image
- [ ] `alt` text is `"The Monokhromo Collection"`
- [ ] Page weight still within limits (logo PNG is ~52KB)

---

*Directive authority: The Founder — The Monokhromo Collection*
