// build.js — Static site generator for The Monokhromo Collection.
// Run via the run_script tool. Generates all pages from a shared shell + per-page content.

// ─── Brand data ────────────────────────────────────────────────────────────
const BRAND = {
  name: "The Monokhromo Collection",
  founder: "Jonathan B. Landman",
  shortName: "Monokhromo",
  pillars: ["Light", "Stone", "Shadow", "Silence"],
  tagline: "Black-and-white fine art photography. A practice in light, stone, shadow, silence.",
  description: "The Monokhromo Collection is the black-and-white fine art photography of Jonathan B. Landman. Limited digital editions with certificate of authenticity and printing guidance.",
  email: "studio@monokhromo.com",
  pressEmail: "studio@monokhromo.com",
  year: 2026,
};

const SIZES = [
  { code: "A4", label: "A4 Digital Edition", dim: "210 × 297 mm",  px: "3508 × 2480 px @ 300 ppi", price: 65,  n: "01" },
  { code: "A3", label: "A3 Digital Edition", dim: "297 × 420 mm",  px: "4961 × 3508 px @ 300 ppi", price: 115, n: "02" },
  { code: "A2", label: "A2 Digital Edition", dim: "420 × 594 mm",  px: "7016 × 4961 px @ 300 ppi", price: 195, n: "03" },
];

const WORKS = [
  {
    id: "mono-lisa",
    title: "Mono Lisa",
    plate: "ML·01",
    collection: "beauty",
    pillar: "Light",
    status: "available",
    year: 2025,
    summary: "A monochrome portrait — a quiet response to a familiar subject. Stillness, contour, light withheld.",
    longCaption: "A study in restraint. Mono Lisa is the inaugural plate of the house — a portrait stripped to its tonal essentials. The negative space is not absence; it is the space the eye is permitted to enter.",
    tone: 0.16,
    light: 24,
  },
];

const COLLECTIONS = [
  {
    slug: "beauty",
    title: "Beauty",
    pillarLabel: "Light · Silence",
    epigraph: "Beauty, in this practice, is what survives reduction.",
    description: "A study in subjects asked to stand quietly. Portraits and forms held in monochrome until only their contour remains.",
    essay: [
      "Beauty is the older word for the work. Not the loud kind — the kind that survives when colour is taken away, when the room is quiet, when the subject has stopped performing for the camera and is, for a moment, simply looking back.",
      "Each plate in the collection is offered as a digital edition. The master file is delivered after purchase, alongside a certificate of authenticity and a short letter of printing guidance, so the work can be produced on archival paper at the size and surface of your choosing.",
    ],
    works: ["mono-lisa"],
  },
  {
    slug: "malta-in-shadow",
    title: "Malta in Shadow",
    pillarLabel: "Stone · Shadow",
    epigraph: "Stone keeps a record of its weather, if you let it.",
    description: "Limestone, walls, and weather on a small archipelago at the centre of the Mediterranean. A long study in shadow as architecture.",
    essay: [
      "Malta is built almost entirely of one material — a soft, honey‑coloured limestone that records every century of sun and wind. In monochrome the colour is gone; what remains is the structure of the shadow against it.",
      "The collection is forthcoming. Plates will be issued as the work resolves — slowly, in small editions, the way the buildings themselves were made.",
    ],
    works: [],
  },
];

// ─── Shared shell pieces ───────────────────────────────────────────────────

// Compute relative path prefix from a page's URL back to the site root.
// e.g. "/" → "./", "/gallery/" → "../", "/gallery/mono-lisa/" → "../../"
function relPrefix(currentUrl) {
  const trimmed = currentUrl.replace(/^\/|\/$/g, "");
  const depth = trimmed === "" ? 0 : trimmed.split("/").length;
  return depth === 0 ? "./" : "../".repeat(depth);
}
// Convert an absolute site URL to a relative href from the current page.
// "/" stays as <root>index.html, "/gallery/" becomes <prefix>gallery/index.html.
function pageHref(targetUrl, currentUrl) {
  const prefix = relPrefix(currentUrl);
  let path = targetUrl.replace(/^\//, "");
  if (path === "" || path.endsWith("/")) path += "index.html";
  return prefix + path;
}
// Asset path (relative).
function assetHref(absPath, currentUrl) {
  return relPrefix(currentUrl) + absPath.replace(/^\//, "");
}

function head({ title, description, url }) {
  const fullTitle = title ? `${title} — ${BRAND.name}` : BRAND.name;
  const canonical = `https://monokhromo.com${url}`;
  const A = (p) => assetHref(p, url);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${fullTitle}</title>
  <meta name="description" content="${description}" />
  <meta name="author" content="${BRAND.founder}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${BRAND.name}" />
  <meta property="og:title" content="${fullTitle}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="https://monokhromo.com/assets/brand/monokhromo-primary-emblem-white.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="theme-color" content="#0a0a0c" />
  <link rel="icon" type="image/x-icon" href="${A("/assets/favicon/favicon.ico")}" />
  <link rel="icon" type="image/png" sizes="16x16" href="${A("/assets/favicon/favicon-16x16.png")}" />
  <link rel="icon" type="image/png" sizes="32x32" href="${A("/assets/favicon/favicon-32x32.png")}" />
  <link rel="icon" type="image/png" sizes="96x96" href="${A("/assets/favicon/favicon-96x96.png")}" />
  <link rel="apple-touch-icon" sizes="180x180" href="${A("/assets/favicon/favicon-180x180.png")}" />
  <link rel="icon" type="image/png" sizes="192x192" href="${A("/assets/favicon/favicon-192x192.png")}" />
  <link rel="icon" type="image/png" sizes="512x512" href="${A("/assets/favicon/favicon-512x512.png")}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=IBM+Plex+Sans:wght@300;400;500&family=IBM+Plex+Mono:wght@300;400;500&family=Allura&display=swap" />
  <link rel="stylesheet" href="${A("/styles.css")}" />
  <link rel="stylesheet" href="${A("/pages.css")}" />
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "VisualArtsOrganization",
    "name": BRAND.name,
    "founder": { "@type": "Person", "name": BRAND.founder },
    "url": "https://monokhromo.com/",
    "description": BRAND.description,
    "sameAs": []
  })}</script>
</head>`;
}

const NAV_ITEMS = [
  { url: "/",                              label: "Index",       n: "00", short: "Home"  },
  { url: "/gallery/",                      label: "Gallery",     n: "01", short: "Gallery" },
  { url: "/collections/",                  label: "Collections", n: "02", short: "Collections" },
  { url: "/prints/",                       label: "Prints",      n: "03", short: "Prints" },
  { url: "/certificate-of-authenticity/",  label: "Certificate", n: "04", short: "COA" },
  { url: "/about/",                        label: "About",       n: "05", short: "About" },
  { url: "/contact/",                      label: "Contact",     n: "06", short: "Contact" },
];

function isActive(currentUrl, navUrl) {
  if (navUrl === "/") return currentUrl === "/";
  return currentUrl === navUrl || currentUrl.startsWith(navUrl);
}

function backdrop() {
  // Pure CSS backdrop — no JS needed. All layers are CSS-driven.
  return `<div class="mk-backdrop" aria-hidden="true">
    <div class="mk-base"></div>
    <div class="mk-light-1"></div>
    <div class="mk-light-2"></div>
    <div class="mk-paper"></div>
    <div class="mk-strie"></div>
    <div class="mk-grain"></div>
    <div class="mk-vign"></div>
    <div class="mk-edge"></div>
  </div>`;
}

function nav(currentUrl) {
  const links = NAV_ITEMS.slice(1).map(item => `
        <a href="${item.url}" class="mk-nav-link${isActive(currentUrl, item.url) ? ' is-on' : ''}"${isActive(currentUrl, item.url) ? ' aria-current="page"' : ''}>
          <span class="mk-nav-n">${item.n}</span>
          <span class="mk-nav-l">${item.label}</span>
        </a>`).join("");
  return `<header class="mk-nav">
    <a href="/" class="mk-mark" aria-label="${BRAND.name} — home">
      <img class="mk-mark-aperture" src="/assets/brand/monokhromo-aperture-icon-white.png" alt="" width="36" height="36" aria-hidden="true" />
      <img class="mk-mark-wordmark" src="/assets/brand/monokhromo-horizontal-wordmark-white.png" alt="The Monokhromo Collection" width="82" height="44" />
    </a>
    <nav class="mk-nav-links" aria-label="Primary">${links}
    </nav>
    <button class="mk-nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mk-mobile-nav">
      <span></span><span></span><span></span>
    </button>
  </header>
  <div class="mk-mobile-nav" id="mk-mobile-nav" hidden>
    ${NAV_ITEMS.map(item => `<a href="${item.url}" class="mk-mobile-link${isActive(currentUrl, item.url) ? ' is-on' : ''}"><span class="mk-mono-xs">${item.n}</span> ${item.label}</a>`).join("")}
  </div>`;
}

function footer() {
  return `<footer class="mk-foot">
    <div class="mk-foot-emblem-row">
      <img class="mk-foot-emblem" src="/assets/brand/monokhromo-primary-emblem-white.png" alt="The Monokhromo Collection" width="110" height="109" />
    </div>
    <div class="mk-foot-pillars">
      ${BRAND.pillars.map((p, i) => `<span class="mk-foot-pillar"><span class="mk-mono-xs">${String(i+1).padStart(2,"0")}</span>${p}</span>`).join("")}
    </div>
    <div class="mk-foot-row">
      <div class="mk-foot-block">
        <div class="mk-foot-h">${BRAND.name}</div>
        <p class="mk-foot-p">
          The black-and-white fine art photography of ${BRAND.founder}.
          Limited digital editions, issued with a certificate of authenticity
          and a letter of printing guidance.
        </p>
      </div>
      <div class="mk-foot-block mk-foot-block-narrow">
        <div class="mk-foot-h">Catalogue</div>
        <ul class="mk-foot-list">
          <li><a href="/gallery/">Gallery</a></li>
          <li><a href="/collections/">Collections</a></li>
          <li><a href="/prints/">Prints &amp; pricing</a></li>
          <li><a href="/certificate-of-authenticity/">Certificate of authenticity</a></li>
        </ul>
      </div>
      <div class="mk-foot-block mk-foot-block-narrow">
        <div class="mk-foot-h">House</div>
        <ul class="mk-foot-list">
          <li><a href="/about/">About</a></li>
          <li><a href="/contact/">Contact</a></li>
          <li><a href="mailto:${BRAND.email}">${BRAND.email}</a></li>
        </ul>
      </div>
    </div>
    <div class="mk-foot-rule"></div>
    <div class="mk-foot-bottom">
      <span class="mk-mono-xs">© ${BRAND.year} · ${BRAND.founder.toUpperCase()} · ALL EDITIONS NUMBERED</span>
      <span class="mk-mono-xs">SET IN CORMORANT GARAMOND &amp; IBM PLEX</span>
    </div>
  </footer>`;
}

function eyebrow(n, label) {
  return `<div class="mk-eyebrow">
    <span class="mk-eyebrow-n">${n}</span>
    <span class="mk-eyebrow-rule"></span>
    <span class="mk-eyebrow-l">${label}</span>
  </div>`;
}

// PrintFrame — pure HTML/CSS version. Accepts work object.
function printFrame(work, opts = {}) {
  const { aspect = "4/5", large = false, link = null } = opts;
  const tone = work.tone ?? 0.14;
  const light = work.light ?? 20;
  const bg = `radial-gradient(120% 100% at ${light}% 18%, rgba(255,255,255,${(tone + 0.08).toFixed(3)}) 0%, rgba(255,255,255,${(tone * 0.6).toFixed(3)}) 22%, rgba(255,255,255,${(tone * 0.25).toFixed(3)}) 45%, rgba(0,0,0,0) 70%), linear-gradient(170deg, #15151a 0%, #0a0a0c 60%, #050506 100%)`;
  const inner = `<div class="pf-frame">
      <div class="pf-mat">
        <div class="pf-print" style="background:${bg}; aspect-ratio:${aspect};">
          <svg class="pf-lines" viewBox="0 0 200 250" preserveAspectRatio="none" aria-hidden="true">
            <line x1="-20" y1="${170 - light/2}" x2="220" y2="${210 - light/2}" stroke="rgba(255,255,255,0.05)" stroke-width="0.4"/>
            <line x1="-20" y1="${196 - light/2}" x2="220" y2="${236 - light/2}" stroke="rgba(255,255,255,0.03)" stroke-width="0.4"/>
          </svg>
          <div class="pf-vign"></div>
          <div class="pf-grain"></div>
          <div class="pf-hover">
            <div class="pf-hover-inner">
              <div class="pf-hover-plate">PLATE ${work.plate}</div>
              <div class="pf-hover-title">${work.title}</div>
              <div class="pf-hover-meta"><span>${work.pillar}</span><span>·</span><span>${work.year}</span></div>
            </div>
          </div>
          <div class="pf-corner pf-corner-tl"></div>
          <div class="pf-corner pf-corner-tr"></div>
          <div class="pf-corner pf-corner-bl"></div>
          <div class="pf-corner pf-corner-br"></div>
        </div>
      </div>
    </div>
    <figcaption class="pf-cap">
      <span class="pf-cap-plate">${work.plate}</span>
      <span class="pf-cap-title">${work.title}</span>
      <span class="pf-cap-meta">${work.pillar} · ${work.year}</span>
    </figcaption>`;
  const cls = "pf" + (large ? " pf-lg" : "") + (link ? " pf-clickable" : "");
  if (link) return `<a href="${link}" class="${cls}" style="aspect-ratio:auto;">${inner}</a>`;
  return `<figure class="${cls}">${inner}</figure>`;
}

function priceTable() {
  return `<div class="mk-prints-table">
    <div class="mk-prints-row mk-prints-row-h">
      <span class="mk-mono-xs">N°</span>
      <span class="mk-mono-xs">Edition</span>
      <span class="mk-mono-xs">Paper size</span>
      <span class="mk-mono-xs">Master file</span>
      <span class="mk-mono-xs ralign">Price</span>
    </div>
    ${SIZES.map(s => `<div class="mk-prints-row">
      <span class="mono mk-prints-n">${s.n}</span>
      <span class="mk-prints-edn">${s.label}</span>
      <span class="mono mk-prints-dim">${s.dim}</span>
      <span class="mono mk-prints-px">${s.px}</span>
      <span class="mk-prints-price ralign">€ ${s.price}</span>
    </div>`).join("")}
  </div>`;
}

function shell({ title, description, url, body, mainClass = "" }) {
  // Rewrite absolute /paths in the body and chrome to be relative to this page.
  const prefix = relPrefix(url);
  const rewrite = (html) => html.replace(/(href|src)="\/([^"]*)"/g, (m, attr, p) => {
    // Skip protocol/anchor — none start with single leading slash, so they're safe.
    let path = p;
    if (path === "" ) path = "index.html";
    else if (path.endsWith("/")) path += "index.html";
    return `${attr}="${prefix}${path}"`;
  });
  const chrome = rewrite(`${backdrop()}<div class="mk-shell">${nav(url)}<main class="mk-page ${mainClass}" id="main">${rewrite(body)}</main>${footer()}</div>`);
  return `${head({ title, description, url })}
<body data-page="${url}">
  ${chrome}
  <script src="${assetHref("/app.js", url)}" defer></script>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE BODIES
// ═══════════════════════════════════════════════════════════════════════════

// HOME
const monoLisa = WORKS.find(w => w.id === "mono-lisa");
const pageHome = shell({
  title: "",
  description: BRAND.description,
  url: "/",
  mainClass: "mk-home",
  body: `
    <section class="mk-hero">
      <div class="mk-hero-meta">
        ${eyebrow("00 · 1", "The Monokhromo Collection")}
        <div class="mk-hero-meta-r"><span class="mk-mono-xs">MMXXVI · CURRENT</span></div>
      </div>

      <h1 class="mk-hero-title">
        <span class="mk-hero-line">Light.</span>
        <span class="mk-hero-line mk-hero-line-italic">Stone.</span>
        <span class="mk-hero-line">Shadow.</span>
        <span class="mk-hero-line mk-hero-line-italic">Silence.</span>
      </h1>

      <div class="mk-hero-foot">
        <p class="mk-hero-lede">
          The black-and-white fine art photography of <em>${BRAND.founder}</em>.
          Limited digital editions, issued with a certificate of authenticity
          and printing guidance, so each work can be produced on the paper
          of your choosing.
        </p>
        <div class="mk-hero-cta">
          <a class="mk-btn mk-btn-primary" href="/gallery/">View the gallery <span class="mk-btn-arrow">↗</span></a>
          <a class="mk-btn mk-btn-ghost" href="/prints/">Prints &amp; pricing</a>
        </div>
      </div>

      <div class="mk-hero-rule"></div>

      <div class="mk-hero-pillars">
        ${BRAND.pillars.map((p, i) => `<div class="mk-hero-pillar">
          <span class="mk-mono-xs">PILLAR · ${String(i+1).padStart(2,"0")}</span>
          <span class="mk-hero-pillar-name">${p}</span>
        </div>`).join("")}
      </div>
    </section>

    <section class="mk-section mk-featured">
      ${eyebrow("00 · 2", "Currently available")}
      <div class="mk-featured-grid">
        <div class="mk-featured-frame">
          ${printFrame(monoLisa, { large: true, link: "/gallery/" })}
        </div>
        <div class="mk-featured-info">
          <div class="mk-stag mk-stag-lg">
            <span class="mk-stag-num">PLATE ${monoLisa.plate}</span>
            <span class="mk-stag-rule"></span>
            <span class="mk-stag-years">${monoLisa.year}</span>
          </div>
          <h2 class="mk-featured-title"><em>${monoLisa.title}</em></h2>
          <p class="mk-featured-pull">${monoLisa.longCaption}</p>
          <p class="mk-featured-attr">— ${BRAND.founder.toUpperCase()}</p>

          <dl class="mk-featured-dl">
            <div><dt>Collection</dt><dd><a href="/collections/beauty/"><em>Beauty</em></a></dd></div>
            <div><dt>Pillar</dt><dd>${monoLisa.pillar}</dd></div>
            <div><dt>Issued</dt><dd>${monoLisa.year}</dd></div>
            <div><dt>Format</dt><dd>Digital master file</dd></div>
            <div><dt>Sizes</dt><dd>A4 / A3 / A2</dd></div>
            <div><dt>From</dt><dd>€ 65</dd></div>
          </dl>

          <div class="mk-featured-cta">
            <a class="mk-btn mk-btn-primary" href="/gallery/">Enquire to acquire</a>
            <a class="mk-btn mk-btn-link" href="/collections/beauty/">Read the collection essay →</a>
          </div>
        </div>
      </div>
    </section>

    <section class="mk-section mk-house">
      ${eyebrow("00 · 3", "From the house")}
      <div class="mk-house-grid">
        <h3 class="mk-house-h">
          A practice, not a feed. Each plate <em>asks the room to stop moving.</em>
        </h3>
        <div class="mk-house-body">
          <p>
            The Monokhromo Collection issues monochrome fine art photographs as
            digital editions. After purchase, the master file is delivered to
            you, accompanied by a numbered certificate of authenticity and a
            short letter of printing guidance.
          </p>
          <p>
            The work is yours to print, frame, and live with — at the size, on
            the paper, and at the moment that suits the wall. No open editions,
            no reissues, no compromise on the file itself.
          </p>
        </div>
      </div>
    </section>

    <section class="mk-section">
      ${eyebrow("00 · 4", "Collections")}
      <div class="mk-coll-cards">
        ${COLLECTIONS.map((c, i) => `<a class="mk-coll-card" href="/collections/${c.slug}/">
          <div class="mk-coll-card-l">
            <span class="mk-mono-xs">SERIES ${String(i+1).padStart(2,"0")}</span>
            <span class="mk-mono-xs">${c.pillarLabel.toUpperCase()}</span>
          </div>
          <h3 class="mk-coll-card-t"><em>${c.title}</em></h3>
          <p class="mk-coll-card-d">${c.description}</p>
          <span class="mk-coll-card-arrow">Enter →</span>
        </a>`).join("")}
      </div>
    </section>

    <section class="mk-section">
      ${eyebrow("00 · 5", "Continue")}
      <div class="mk-index-strip">
        ${[
          { url: "/prints/",                      n: "I",   t: "Prints & pricing",  d: "Three sizes — A4, A3, A2. € 65 / € 115 / € 195." },
          { url: "/certificate-of-authenticity/", n: "II",  t: "On authenticity",   d: "What the certificate is, and what it guarantees." },
          { url: "/about/",                       n: "III", t: "About the work",    d: "The practice, the pillars, the founder." },
          { url: "/contact/",                     n: "IV",  t: "Correspond",        d: "Contact the studio directly." },
        ].map(i => `<a class="mk-index-card" href="${i.url}">
          <span class="mk-index-n">${i.n}</span>
          <span class="mk-index-t">${i.t}</span>
          <span class="mk-index-d">${i.d}</span>
          <span class="mk-index-arrow">→</span>
        </a>`).join("")}
      </div>
    </section>
  `,
});

// GALLERY
const pageGallery = shell({
  title: "Gallery",
  description: "All available plates from The Monokhromo Collection — limited digital editions of black-and-white fine art photography by Jonathan B. Landman.",
  url: "/gallery/",
  mainClass: "mk-gallery",
  body: `
    <header class="mk-page-head">
      ${eyebrow("01", "Gallery")}
      <h1 class="mk-page-title">All <em>available</em> plates.</h1>
      <p class="mk-page-lede">
        The complete catalogue of editions currently in print. Each plate is
        offered as a digital master file in three sizes, with certificate and
        printing guidance.
      </p>
    </header>

    <section class="mk-section">
      <div class="mk-gal-grid mk-gal-grid-cur">
        ${WORKS.filter(w => w.status === "available").map(w => `
          <div class="mk-gal-card">
            ${printFrame(w, { link: `/gallery/${w.id}/` })}
            <div class="mk-gal-card-meta">
              <div class="mk-gal-card-left">
                <span class="mk-mono-xs">PLATE ${w.plate}</span>
                <span class="mk-mono-xs">${w.pillar.toUpperCase()} · ${w.year}</span>
              </div>
              <div class="mk-gal-card-right">
                <span class="mk-gal-card-from mk-mono-xs">FROM</span>
                <span class="mk-gal-card-price">€ 65</span>
              </div>
            </div>
            <a class="mk-btn mk-btn-primary mk-btn-block" href="/gallery/${w.id}/">Enquire <span class="mk-btn-arrow">↗</span></a>
          </div>
        `).join("")}
        <div class="mk-gal-coming">
          <div class="mk-gal-coming-inner">
            <span class="mk-mono-xs">FORTHCOMING · MALTA IN SHADOW</span>
            <h3>The next plates are being printed.</h3>
            <p>New editions are issued slowly. Subscribe below to be told when a new plate is released.</p>
            <a class="mk-btn mk-btn-ghost" href="/contact/">Subscribe to the letter →</a>
          </div>
        </div>
      </div>
    </section>

    <section class="mk-section">
      ${eyebrow("01 · b", "How an edition works")}
      <div class="mk-howto-grid">
        ${[
          { n: "01", t: "Choose a size",  d: "Select A4, A3, or A2. The master file is sent at the resolution required to print at that size with no quality loss." },
          { n: "02", t: "Receive the file", d: "A high-resolution master file (TIFF + PDF preview), a numbered certificate of authenticity, and a letter of printing guidance." },
          { n: "03", t: "Print at home or with a printer", d: "Use a fine-art printer of your choosing. The guidance letter includes paper, ICC profile, and surface recommendations." },
          { n: "04", t: "Live with the work", d: "The edition is permanent. The file is yours to print once for personal display, on the paper that suits your wall." },
        ].map(s => `<div class="mk-howto-card">
          <span class="mk-howto-n">${s.n}</span>
          <span class="mk-howto-t">${s.t}</span>
          <span class="mk-howto-d">${s.d}</span>
        </div>`).join("")}
      </div>
    </section>
  `,
});

// GALLERY > MONO LISA (a print detail page so the link works)
const monoLisaDetail = shell({
  title: "Mono Lisa",
  description: "Mono Lisa — a black-and-white fine art portrait by Jonathan B. Landman. Limited digital editions in A4, A3, and A2, with certificate of authenticity and printing guidance.",
  url: "/gallery/mono-lisa/",
  mainClass: "mk-print-detail",
  body: `
    <nav class="mk-breadcrumb mk-mono-xs">
      <a href="/">Index</a> / <a href="/gallery/">Gallery</a> / <span>Mono Lisa</span>
    </nav>

    <section class="mk-section mk-print-hero">
      <div class="mk-print-frame">
        ${printFrame(monoLisa, { large: true })}
      </div>
      <div class="mk-print-info">
        ${eyebrow("PLATE", monoLisa.plate)}
        <h1 class="mk-page-title"><em>${monoLisa.title}</em></h1>
        <p class="mk-print-lede">${monoLisa.longCaption}</p>

        <dl class="mk-print-dl">
          <div><dt>Collection</dt><dd><a href="/collections/beauty/"><em>Beauty</em></a></dd></div>
          <div><dt>Pillar</dt><dd>${monoLisa.pillar}</dd></div>
          <div><dt>Issued</dt><dd>${monoLisa.year}</dd></div>
          <div><dt>Format</dt><dd>Digital master file (TIFF + PDF preview)</dd></div>
        </dl>

        <div class="mk-buy">
          <div class="mk-buy-head">
            <span class="mk-mono-xs">CHOOSE A SIZE</span>
            <span class="mk-mono-xs">DELIVERY · BY EMAIL, WITHIN 24 H</span>
          </div>
          <div class="mk-buy-sizes" role="radiogroup" aria-label="Edition size">
            ${SIZES.map((s, i) => `<label class="mk-buy-size${i === 0 ? ' is-on' : ''}">
              <input type="radio" name="size" value="${s.code}"${i === 0 ? ' checked' : ''} />
              <span class="mk-buy-size-l">
                <span class="mk-buy-size-code">${s.code}</span>
                <span class="mk-buy-size-dim">${s.dim}</span>
              </span>
              <span class="mk-buy-size-px mk-mono-xs">${s.px}</span>
              <span class="mk-buy-size-p">€ ${s.price}</span>
            </label>`).join("")}
          </div>
          <button class="mk-btn mk-btn-primary mk-btn-block mk-buy-cta">
            Request this edition — <span class="mk-buy-cta-price">€ 65</span> <span class="mk-btn-arrow">↗</span>
          </button>
          <p class="mk-buy-foot mk-mono-xs">
            INCLUDED · MASTER FILE · CERTIFICATE · PRINTING GUIDANCE · EDITION SIZE STATED ON CERTIFICATE
          </p>
        </div>
      </div>
    </section>

    <section class="mk-section">
      ${eyebrow("DETAIL", "What you receive")}
      <div class="mk-detail-grid">
        <div class="mk-detail-card">
          <h4>Master file</h4>
          <p>A high-resolution TIFF, prepared at 300 ppi for the size selected, with embedded ICC profile (Adobe RGB / sRGB on request).</p>
        </div>
        <div class="mk-detail-card">
          <h4>Certificate of authenticity</h4>
          <p>A signed, numbered certificate (PDF) recording the plate, edition, issue date, and buyer.</p>
          <a class="mk-mono-xs" href="/certificate-of-authenticity/">SPECIMEN →</a>
        </div>
        <div class="mk-detail-card">
          <h4>Printing guidance</h4>
          <p>A short letter naming the papers, surfaces and printer profiles the work has been calibrated for.</p>
        </div>
      </div>
    </section>
  `,
});

// COLLECTIONS index
const pageCollections = shell({
  title: "Collections",
  description: "The collections of The Monokhromo Collection — Beauty, Malta in Shadow. Black-and-white fine art photography by Jonathan B. Landman.",
  url: "/collections/",
  mainClass: "mk-collections-index",
  body: `
    <header class="mk-page-head">
      ${eyebrow("02", "Collections")}
      <h1 class="mk-page-title">Two collections, in <em>monochrome.</em></h1>
      <p class="mk-page-lede">
        The work is organised into collections — each pursued slowly until the
        plates resolve. Below, the current two.
      </p>
    </header>

    <section class="mk-section">
      <div class="mk-coll-large">
        ${COLLECTIONS.map((c, i) => `<a class="mk-coll-large-card" href="/collections/${c.slug}/">
          <div class="mk-coll-large-meta">
            <span class="mk-mono-xs">SERIES · ${String(i+1).padStart(2,"0")}</span>
            <span class="mk-mono-xs">${c.pillarLabel.toUpperCase()}</span>
            <span class="mk-mono-xs">${c.works.length > 0 ? `${c.works.length} PLATE${c.works.length > 1 ? 'S' : ''}` : "FORTHCOMING"}</span>
          </div>
          <h2 class="mk-coll-large-t"><em>${c.title}</em></h2>
          <blockquote class="mk-coll-large-epi">${c.epigraph}</blockquote>
          <p class="mk-coll-large-d">${c.description}</p>
          <span class="mk-coll-large-arrow">Enter the collection →</span>
        </a>`).join("")}
      </div>
    </section>
  `,
});

// COLLECTION pages (generated per collection)
function collectionPage(c, idx) {
  const works = c.works.map(id => WORKS.find(w => w.id === id)).filter(Boolean);
  const cover = works[0];
  return shell({
    title: c.title,
    description: `${c.title} — a collection from The Monokhromo Collection. ${c.description}`,
    url: `/collections/${c.slug}/`,
    mainClass: "mk-collection",
    body: `
      <nav class="mk-breadcrumb mk-mono-xs">
        <a href="/">Index</a> / <a href="/collections/">Collections</a> / <span>${c.title}</span>
      </nav>

      <header class="mk-page-head mk-coll-head">
        ${eyebrow(`02 · ${String(idx+1).padStart(2,"0")}`, `Collection · ${c.title}`)}
        <h1 class="mk-page-title">
          <span class="mk-coll-title-num">${String(idx+1).padStart(2,"0")}.</span>
          <em>${c.title}</em>
        </h1>
        <p class="mk-page-lede">${c.description}</p>
      </header>

      <section class="mk-coll-feature">
        <div class="mk-coll-feature-cover">
          ${cover ? printFrame(cover, { large: true, link: `/gallery/${cover.id}/` }) : `
            <div class="mk-coll-feature-empty">
              <span class="mk-mono-xs">PLATES FORTHCOMING</span>
              <p>This collection is in development. Subscribe below to be told when the first plate is released.</p>
            </div>
          `}
        </div>
        <div class="mk-coll-feature-text">
          <div class="mk-stag mk-stag-lg">
            <span class="mk-stag-num">${c.pillarLabel.toUpperCase()}</span>
            <span class="mk-stag-rule"></span>
            <span class="mk-stag-years">${works.length > 0 ? `${works.length} PLATE${works.length > 1 ? 'S' : ''}` : "FORTHCOMING"}</span>
          </div>
          <blockquote class="mk-coll-epi">
            <p>${c.epigraph}</p>
            <cite>— ${BRAND.founder.toUpperCase()}</cite>
          </blockquote>
          <dl class="mk-coll-meta">
            <div><dt>Pillars</dt><dd>${c.pillarLabel}</dd></div>
            <div><dt>Status</dt><dd>${works.length > 0 ? "In print" : "Forthcoming"}</dd></div>
            <div><dt>Plates</dt><dd>${works.length}</dd></div>
            <div><dt>Format</dt><dd>Digital edition</dd></div>
          </dl>
        </div>
      </section>

      <section class="mk-coll-essay">
        <div class="mk-coll-essay-eyebrow">
          <span class="mk-mono-xs">FOUNDER'S NOTE</span>
          <span class="mk-mono-xs">${BRAND.founder.toUpperCase()}</span>
        </div>
        ${c.essay.map((p, i) => `<p class="mk-coll-essay-p${i === 0 ? ' mk-coll-essay-p-first' : ''}">${i === 0 ? `<span class="mk-dropcap">${p[0]}</span>${p.slice(1)}` : p}</p>`).join("")}
        <div class="mk-coll-essay-sig">
          <span class="mk-mono-xs">— ${BRAND.founder.toUpperCase()}</span>
        </div>
      </section>

      ${works.length > 0 ? `
        <section class="mk-section">
          ${eyebrow("PLATES", `In ${c.title}`)}
          <div class="mk-coll-plates-grid">
            ${works.map((w, i) => `<div class="mk-coll-plate">
              <div class="mk-coll-plate-num">
                <span class="mk-mono-xs">${String(i+1).padStart(2,"0")}</span>
                <span class="mk-mono-xs">/${String(works.length).padStart(2,"0")}</span>
              </div>
              ${printFrame(w, { link: `/gallery/${w.id}/` })}
            </div>`).join("")}
          </div>
        </section>
      ` : ""}

      <section class="mk-section">
        <div class="mk-cta-band">
          <h3>The work is released slowly.</h3>
          <p>Subscribe to the letter — a brief note when a new plate is issued. No more than four issues a year.</p>
          <a class="mk-btn mk-btn-primary" href="/contact/">Subscribe →</a>
        </div>
      </section>
    `,
  });
}

const pageBeauty = collectionPage(COLLECTIONS[0], 0);
const pageMalta = collectionPage(COLLECTIONS[1], 1);

// PRINTS
const pagePrints = shell({
  title: "Prints & pricing",
  description: "Limited digital editions in three sizes — A4 € 65, A3 € 115, A2 € 195. Master file, certificate of authenticity, and printing guidance included.",
  url: "/prints/",
  mainClass: "mk-prints",
  body: `
    <header class="mk-page-head">
      ${eyebrow("03", "Prints & pricing")}
      <h1 class="mk-page-title">Digital editions, <em>printed by you.</em></h1>
      <p class="mk-page-lede">
        Each work is offered as a digital master file in three sizes. After
        purchase, the file is delivered with a numbered certificate of
        authenticity and a short letter of printing guidance — so the work can
        be produced on archival paper, at the size and surface that suits your
        wall.
      </p>
    </header>

    <section class="mk-section">
      ${eyebrow("03 · 1", "Three sizes")}
      ${priceTable()}
      <p class="mk-prints-foot">
        Prices are per edition, per work. The master file is delivered as a
        300‑ppi TIFF (sRGB + Adobe RGB on request) with an accompanying PDF
        preview. The file is licensed for personal printing and display.
      </p>
    </section>

    <section class="mk-section">
      ${eyebrow("03 · 2", "What is included")}
      <div class="mk-detail-grid">
        <div class="mk-detail-card">
          <h4>The master file</h4>
          <p>
            A high-resolution TIFF at 300 ppi, prepared at the size selected.
            Delivered with an embedded ICC profile. Suitable for archival pigment
            printing on cotton rag or baryta papers.
          </p>
        </div>
        <div class="mk-detail-card">
          <h4>Certificate of authenticity</h4>
          <p>
            A signed, hand-numbered certificate (delivered as a print-ready PDF)
            recording the plate, the edition number, the issue date, and your
            name as the holder.
          </p>
          <a class="mk-mono-xs" href="/certificate-of-authenticity/">VIEW SPECIMEN →</a>
        </div>
        <div class="mk-detail-card">
          <h4>Printing guidance</h4>
          <p>
            A short letter from the studio: paper recommendations (cotton rag,
            baryta, washi), ICC profiles, surface notes, and the names of
            printers who have produced the work to satisfaction.
          </p>
        </div>
      </div>
    </section>

    <section class="mk-section">
      ${eyebrow("03 · 3", "Frequently asked")}
      <dl class="mk-faq">
        <div class="mk-faq-row">
          <dt>Are the editions limited?</dt>
          <dd>Yes. Each plate is issued in a numbered edition. The edition size will be stated on the certificate at time of issue.</dd>
        </div>
        <div class="mk-faq-row">
          <dt>Can I print the file more than once?</dt>
          <dd>The file is licensed for personal display. You may produce a single archival print of the work, and re-print if the original is damaged. Commercial reproduction is not permitted.</dd>
        </div>
        <div class="mk-faq-row">
          <dt>What paper should I use?</dt>
          <dd>The guidance letter lists the papers the work has been calibrated for — cotton rag, baryta, or washi. Any reputable fine-art printer will recognise them.</dd>
        </div>
        <div class="mk-faq-row">
          <dt>Can the certificate be transferred?</dt>
          <dd>Yes. Certificates are issued in your name and can be transferred to a future owner on written request to the studio.</dd>
        </div>
        <div class="mk-faq-row">
          <dt>Do you ship physical prints?</dt>
          <dd>Not at this time. The Monokhromo Collection issues digital editions only — the print itself is produced by you or a printer of your choosing.</dd>
        </div>
      </dl>
    </section>

    <section class="mk-section">
      <div class="mk-cta-band">
        <h3>Begin with the first plate.</h3>
        <p><em>Mono Lisa</em> — the inaugural edition, available now in A4, A3, and A2.</p>
        <a class="mk-btn mk-btn-primary" href="/gallery/mono-lisa/">Enquire — <em>Mono Lisa</em> →</a>
      </div>
    </section>
  `,
});

// CERTIFICATE OF AUTHENTICITY
const pageCertificate = shell({
  title: "Certificate of authenticity",
  description: "Each edition from The Monokhromo Collection is issued with a signed, numbered certificate of authenticity.",
  url: "/certificate-of-authenticity/",
  mainClass: "mk-cert",
  body: `
    <header class="mk-page-head">
      ${eyebrow("04", "Certificate of authenticity")}
      <h1 class="mk-page-title">
        Each edition is issued with a <em>signed certificate.</em>
      </h1>
      <p class="mk-page-lede">
        The certificate is the formal record of the edition. It accompanies the
        master file and travels with the work for the life of the print.
      </p>
    </header>

    <section class="mk-section">
      <div class="mk-cert-eyebrow">
        <span class="mk-mono-xs">SPECIMEN · NOT FOR RESALE</span>
        <span class="mk-mono-xs">N° MK · ML · 01 / MMXXVI</span>
      </div>
      <article class="mk-cert-doc">
        <header class="mk-cert-doc-head">
          <div class="mk-cert-doc-headl">
            <img class="mk-cert-doc-mark" src="/assets/brand/monokhromo-small-seal-black.png" alt="The Monokhromo Collection seal" width="72" height="76" />
            <div class="mk-cert-doc-house mk-mono-xs">THE MONOKHROMO COLLECTION · ${BRAND.founder.toUpperCase()}</div>
          </div>
          <div class="mk-cert-doc-num">
            <span class="mk-mono-xs">CERTIFICATE</span>
            <span class="mk-cert-doc-no">N° MK·ML·01</span>
          </div>
        </header>

        <div class="mk-cert-doc-body">
          <p class="mk-cert-doc-statement">
            This is to certify that the work described below is an
            <em>original digital fine art photograph</em> by <em>${BRAND.founder}</em>,
            issued in a numbered edition by The Monokhromo Collection.
          </p>

          <dl class="mk-cert-fields">
            <div><dt>Plate</dt><dd>${monoLisa.plate} · <em>${monoLisa.title}</em></dd></div>
            <div><dt>Collection</dt><dd>Beauty</dd></div>
            <div><dt>Pillar</dt><dd>${monoLisa.pillar}</dd></div>
            <div><dt>Year of issue</dt><dd>${monoLisa.year}</dd></div>
            <div><dt>Edition</dt><dd>Numbered — size stated on certificate </dd></div>
            <div><dt>Size</dt><dd>A4 · A3 · A2</dd></div>
            <div><dt>Process</dt><dd>Archival digital master file</dd></div>
            <div><dt>Holder</dt><dd>______________________</dd></div>
          </dl>

          <div class="mk-cert-sigs">
            <div class="mk-cert-sig">
              <div class="mk-cert-sig-line"><em>${BRAND.founder}</em></div>
              <div class="mk-cert-sig-label mk-mono-xs">SIGNED · ${BRAND.founder.toUpperCase()}</div>
            </div>
            <div class="mk-cert-sig">
              <div class="mk-cert-sig-line mk-cert-sig-blank">&nbsp;</div>
              <div class="mk-cert-sig-label mk-mono-xs">DATED &amp; HELD BY</div>
            </div>
            <div class="mk-cert-seal">
              <img class="mk-cert-seal-img" src="/assets/brand/monokhromo-small-seal-black.png" alt="Monokhromo seal" />
              <div class="mk-cert-seal-ring" aria-hidden="true"></div>
            </div>
          </div>
        </div>

        <footer class="mk-cert-doc-foot mk-mono-xs">
          <span>FORM MK · COA · REV ${BRAND.year}</span>
          <span>${BRAND.email.toUpperCase()}</span>
          <span>MONOKHROMO.COM</span>
        </footer>
      </article>
    </section>

    <section class="mk-section">
      ${eyebrow("04 · b", "What the certificate guarantees")}
      <div class="mk-detail-grid">
        <div class="mk-detail-card">
          <h4>Origin</h4>
          <p>That the work is an original digital fine art photograph by ${BRAND.founder}, issued by The Monokhromo Collection.</p>
        </div>
        <div class="mk-detail-card">
          <h4>Edition state</h4>
          <p>That the work is a numbered edition. The edition size will be stated on the certificate at time of issue.</p>
        </div>
        <div class="mk-detail-card">
          <h4>Title</h4>
          <p>That you, as named on the certificate, are the recorded holder of the edition until you transfer it.</p>
        </div>
      </div>
    </section>

    <section class="mk-section">
      <div class="mk-cta-band">
        <h3>The certificate travels with the work.</h3>
        <p>If you acquire a print from a previous owner, the certificate is the formal proof of edition. Transfers are recorded by the studio on written request.</p>
        <a class="mk-btn mk-btn-ghost" href="/contact/">Request a transfer →</a>
      </div>
    </section>
  `,
});

// ABOUT
const pageAbout = shell({
  title: "About",
  description: "The Monokhromo Collection is the black-and-white fine art photography practice of Jonathan B. Landman, founded on four pillars: light, stone, shadow, silence.",
  url: "/about/",
  mainClass: "mk-about",
  body: `
    <header class="mk-page-head">
      ${eyebrow("05", "About")}
      <h1 class="mk-page-title">
        The practice of <em>${BRAND.founder}.</em>
      </h1>
      <p class="mk-page-lede">
        The Monokhromo Collection is a black-and-white fine art photography
        practice. Plates are issued slowly, in small digital editions, and
        accompanied by a signed certificate of authenticity.
      </p>
    </header>

    <section class="mk-section">
      ${eyebrow("05 · 1", "Four pillars")}
      <div class="mk-pillars-grid">
        ${BRAND.pillars.map((p, i) => `<div class="mk-pillar-card">
          <span class="mk-mono-xs">PILLAR · ${String(i+1).padStart(2,"0")}</span>
          <h3 class="mk-pillar-name"><em>${p}</em></h3>
          <p class="mk-pillar-note">${[
            "What the eye can hold without strain. The work begins, and ends, with how much of it is asked to be seen.",
            "Architecture in monochrome — the material before it is read as building. Limestone, plaster, marble, mortar.",
            "Not the absence of light, but its discipline. Where the eye is asked to wait.",
            "The condition the work hopes the room will hold while the print is being looked at."
          ][i]}</p>
        </div>`).join("")}
      </div>
    </section>

    <section class="mk-section">
      ${eyebrow("05 · 2", "Founder's note")}
      <div class="mk-about-note">
        <p class="mk-about-note-p mk-about-note-p-first">
          <span class="mk-dropcap">T</span>he Monokhromo Collection began as a
          small, deliberate practice — to make photographs that read as objects
          rather than feeds, and to make them available without the friction of
          gallery overhead. Each work is offered as a digital edition: a
          high‑resolution master file, a certificate of authenticity, and a
          short letter of printing guidance.
        </p>
        <p class="mk-about-note-p">
          The frame, the paper, the wall — these are choices best made by the
          person who will live with the work. The studio's role is to make sure
          the file is good enough that those choices are genuinely yours.
        </p>
        <p class="mk-about-note-p">
          New plates are released slowly. The work is monochrome by conviction,
          not by aesthetic preference. The pillars are the discipline.
        </p>
        <div class="mk-about-note-sig">
          <div class="mk-about-note-sig-line"><em>${BRAND.founder}</em></div>
          <div class="mk-mono-xs">FOUNDER</div>
        </div>
      </div>
    </section>

    <section class="mk-section">
      ${eyebrow("05 · 3", "How the work is sold")}
      <div class="mk-detail-grid">
        <div class="mk-detail-card">
          <h4>Digital editions</h4>
          <p>Each plate is a numbered digital edition. The master file is delivered after purchase, with a certificate of authenticity and printing guidance.</p>
        </div>
        <div class="mk-detail-card">
          <h4>Three sizes</h4>
          <p>A4, A3, and A2 — € 65, € 115, € 195. Each size is prepared at 300 ppi with embedded ICC profile, ready to be sent to a printer.</p>
        </div>
        <div class="mk-detail-card">
          <h4>Printed by you</h4>
          <p>The file is yours to print on the paper and surface of your choosing. The studio recommends a small set of papers in the guidance letter.</p>
        </div>
      </div>
    </section>

    <section class="mk-section">
      <div class="mk-cta-band">
        <h3>Begin with the first plate.</h3>
        <p><em>Mono Lisa</em> is the inaugural edition. A4 from € 65.</p>
        <a class="mk-btn mk-btn-primary" href="/gallery/mono-lisa/">Enquire — <em>Mono Lisa</em> →</a>
      </div>
    </section>
  `,
});

// CONTACT
const pageContact = shell({
  title: "Contact",
  description: "Correspond with The Monokhromo Collection — Jonathan B. Landman's black-and-white fine art photography studio.",
  url: "/contact/",
  mainClass: "mk-contact",
  body: `
    <header class="mk-page-head">
      ${eyebrow("06", "Contact")}
      <h1 class="mk-page-title">
        Correspond with <em>the studio.</em>
      </h1>
      <p class="mk-page-lede">
        Every message is read by ${BRAND.founder}. The studio replies by hand,
        usually within two working days.
      </p>
    </header>

    <section class="mk-section">
      <div class="mk-contact-grid">
        <form class="mk-form" id="mk-contact-form" novalidate>
          <fieldset class="mk-form-field">
            <legend>I would like to</legend>
            <div class="mk-form-seg">
              ${[
                { v: "edition", l: "Acquire an edition" },
                { v: "letter",  l: "Subscribe to the letter" },
                { v: "press",   l: "Press inquiry" },
                { v: "other",   l: "Something else" },
              ].map((o, i) => `<label class="mk-form-seg-opt${i === 0 ? ' is-on' : ''}">
                <input type="radio" name="intent" value="${o.v}"${i === 0 ? " checked" : ""} />
                <span>${o.l}</span>
              </label>`).join("")}
            </div>
          </fieldset>

          <div class="mk-form-row">
            <fieldset class="mk-form-field">
              <legend>Name</legend>
              <input class="mk-form-input" name="name" type="text" autocomplete="name" placeholder="Full name" />
            </fieldset>
            <fieldset class="mk-form-field">
              <legend>Email</legend>
              <input class="mk-form-input" name="email" type="email" autocomplete="email" placeholder="you@example.com" required />
            </fieldset>
          </div>

          <fieldset class="mk-form-field" data-show-when="intent=edition">
            <legend>Plate &amp; size</legend>
            <select name="plate" class="mk-form-input">
              <option value="ml-a4">Mono Lisa · A4 · € 65</option>
              <option value="ml-a3">Mono Lisa · A3 · € 115</option>
              <option value="ml-a2">Mono Lisa · A2 · € 195</option>
              <option value="future">A future plate (be told first)</option>
            </select>
          </fieldset>

          <fieldset class="mk-form-field">
            <legend>Note to the studio</legend>
            <textarea class="mk-form-input mk-form-textarea" name="note" rows="4" placeholder="Anything we should know — paper, viewing, prior correspondence…"></textarea>
          </fieldset>

          <div class="mk-form-foot">
            <span class="mk-mono-xs">READ BY ${BRAND.founder.toUpperCase()} · NOT USED FOR MARKETING</span>
            <button class="mk-btn mk-btn-primary" type="submit">Send to the studio <span class="mk-btn-arrow">↗</span></button>
          </div>

          <div class="mk-form-receipt" id="mk-form-receipt" hidden>
            <span class="mk-mono-xs" id="mk-form-receipt-time"></span>
            <p>Thank you. ${BRAND.founder} will reply by hand to the address you provided, usually within two working days.</p>
          </div>
        </form>

        <aside class="mk-contact-side">
          <div class="mk-contact-block">
            <h4>Direct</h4>
            <p><a href="mailto:${BRAND.email}">${BRAND.email}</a></p>
            <p class="mk-mono-xs">REPLIES WITHIN 48 HOURS</p>
          </div>
          <div class="mk-contact-block">
            <h4>Press</h4>
            <p>High-resolution press images and recent statements available on request.</p>
            <p><a href="mailto:${BRAND.pressEmail}">${BRAND.pressEmail}</a></p>
          </div>
          <div class="mk-contact-block">
            <h4>The letter</h4>
            <p>A short note when a new plate is released. Four times a year, no more.</p>
            <form class="mk-news" id="mk-news-form" novalidate>
              <input name="email" type="email" placeholder="your@email" class="mk-form-input" required />
              <button class="mk-btn mk-btn-ghost" type="submit">Subscribe</button>
            </form>
            <span class="mk-mono-xs" id="mk-news-receipt" hidden>SUBSCRIBED · THANK YOU</span>
          </div>
        </aside>
      </div>
    </section>
  `,
});

// ─── Sitemap and robots ─────────────────────────────────────────────────────
const sitemapUrls = [
  "/", "/gallery/", "/gallery/mono-lisa/",
  "/collections/", "/collections/beauty/", "/collections/malta-in-shadow/",
  "/prints/", "/certificate-of-authenticity/", "/about/", "/contact/",
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url><loc>https://monokhromo.com${u}</loc></url>`).join("\n")}
</urlset>`;

const robots = `User-agent: *
Allow: /
Sitemap: https://monokhromo.com/sitemap.xml`;

// ─── Write all files ────────────────────────────────────────────────────────
async function writeAll() {
  const files = [
    ["index.html",                                       pageHome],
    ["gallery/index.html",                               pageGallery],
    ["gallery/mono-lisa/index.html",                     monoLisaDetail],
    ["collections/index.html",                           pageCollections],
    ["collections/beauty/index.html",                    pageBeauty],
    ["collections/malta-in-shadow/index.html",           pageMalta],
    ["prints/index.html",                                pagePrints],
    ["certificate-of-authenticity/index.html",           pageCertificate],
    ["about/index.html",                                 pageAbout],
    ["contact/index.html",                               pageContact],
    ["sitemap.xml",                                      sitemap],
    ["robots.txt",                                       robots],
  ];
  for (const [path, content] of files) {
    await saveFile(path, content);
    log("wrote " + path);
  }
}

await writeAll();
