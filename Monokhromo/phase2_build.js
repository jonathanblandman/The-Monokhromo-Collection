// phase2_build.js
// Generates Phase 2 update package for The Monokhromo Collection.
// Output: phase2/ folder with artwork pages + updated gallery/beauty pages.
// Do NOT overwrite the live deploy folder — this is for review before merge.

// ─── Re-use shared shell from _build.js ─────────────────────────────────────
// We eval _build.js to get all shared functions, then add our own pages.
// The shared functions write to wherever we tell them (they don't call saveFile).

const mainSrc = await readFile('_build.js');

// Extract everything except the final "writeAll" / "await writeAll" call,
// to avoid re-generating Phase 1 pages.
const coreSrc = mainSrc.replace(/\/\/ ─── Write all files[\s\S]*$/, '');

// Evaluate in a function scope so we can capture the exported symbols.
const getShell = new Function('saveFile', 'readFile', 'log', 'createCanvas', `
  return (() => {
    ${coreSrc}
    return { shell, eyebrow, priceTable, relPrefix, assetHref, pageHref, BRAND, SIZES };
  })();
`);
const { shell, eyebrow, priceTable, relPrefix, assetHref, pageHref, BRAND, SIZES } =
  getShell(saveFile, readFile, log, createCanvas);

// ─── Artwork data ─────────────────────────────────────────────────────────────
const COLLECTION = {
  slug:       "beauty",
  title:      "Beauty",
  longTitle:  "Beauty — Studio Studies I",
  eyebrow:    "BEAUTY — STUDIO STUDIES I",
  url:        "/collections/beauty/",
  statement:  "Beauty — Studio Studies I is the first release from The Monokhromo Collection: a series of black-and-white portraits drawn from Jonathan B. Landman's earlier studio archive and newly refined for limited digital edition release. The collection studies beauty not as decoration, but as presence — held in gaze, fabric, posture, silence, and controlled light.",
  epigraph:   "Beauty, in this practice, is what survives reduction.",
};

const ARTWORKS = [
  {
    slug: "white-fur",
    title: "White Fur",
    seqLabel: "01 / 06",
    seoTitle: "White Fur — Black-and-White Fine Art Portrait | The Monokhromo Collection",
    metaDesc: "White Fur is a black-and-white fine art portrait from Beauty — Studio Studies I by Jonathan B. Landman, available as a limited digital edition.",
    certTitle: "White Fur — Beauty, Studio Studies I",
    alt: "Black-and-white studio portrait of a woman wrapped in white fur, from Beauty — Studio Studies I by Jonathan B. Landman.",
    poetic: "Wrapped in pale texture, she meets the lens with a gaze that does not ask to be softened. White Fur studies the tension between warmth and command — beauty held not in decoration, but in the quiet certainty of presence.",
    commercial: "White Fur is a black-and-white fine art portrait from Beauty — Studio Studies I by Jonathan B. Landman. Drawn from an earlier studio archive and newly refined for The Monokhromo Collection, the work is released as a limited digital edition with Certificate of Authenticity and printing guidance.",
  },
  {
    slug: "white-brim",
    title: "White Brim",
    seqLabel: "02 / 06",
    seoTitle: "White Brim — Monochrome Fine Art Portrait | The Monokhromo Collection",
    metaDesc: "White Brim is a monochrome studio portrait by Jonathan B. Landman, released as part of Beauty — Studio Studies I.",
    certTitle: "White Brim — Beauty, Studio Studies I",
    alt: "Black-and-white portrait of a woman wearing a wide white brimmed hat, from Beauty — Studio Studies I by Jonathan B. Landman.",
    poetic: "A wide white brim cuts the face into light and shadow, turning concealment into elegance. White Brim is a portrait of withheld revelation — the moment before expression becomes confession.",
    commercial: "White Brim is a black-and-white fine art portrait from Beauty — Studio Studies I by Jonathan B. Landman. The image explores shape, shadow, gaze, and fashion-like restraint through a monochrome studio composition. Released as a limited digital edition with Certificate of Authenticity and printing guidance.",
  },
  {
    slug: "seated-silence",
    title: "Seated Silence",
    seqLabel: "03 / 06",
    seoTitle: "Seated Silence — Black-and-White Studio Portrait | The Monokhromo Collection",
    metaDesc: "Seated Silence is a black-and-white studio portrait from Beauty — Studio Studies I by Jonathan B. Landman.",
    certTitle: "Seated Silence — Beauty, Studio Studies I",
    alt: "Black-and-white seated studio portrait of a woman posed in shadow and light, from Beauty — Studio Studies I by Jonathan B. Landman.",
    poetic: "The body folds into stillness, the face turned toward the viewer with a calm that resists performance. Seated Silence studies beauty as posture — quiet, deliberate, and held in the architecture of the frame.",
    commercial: "Seated Silence is a black-and-white fine art portrait from Beauty — Studio Studies I by Jonathan B. Landman. The work presents a studio figure study shaped by pose, contrast, and restraint. Released as a limited digital edition with Certificate of Authenticity and printing guidance.",
  },
  {
    slug: "open-collar",
    title: "Open Collar",
    seqLabel: "04 / 06",
    seoTitle: "Open Collar — Fine Art Black-and-White Portrait | The Monokhromo Collection",
    metaDesc: "Open Collar is a fine art black-and-white portrait by Jonathan B. Landman, released in Beauty — Studio Studies I.",
    certTitle: "Open Collar — Beauty, Studio Studies I",
    alt: "Black-and-white portrait of a woman in an open white shirt, from Beauty — Studio Studies I by Jonathan B. Landman.",
    poetic: "A white shirt opens into shadow, framing the face with a tension between softness and control. Open Collar is a portrait of intimacy without surrender — direct, composed, and quietly alive.",
    commercial: "Open Collar is a black-and-white fine art portrait from Beauty — Studio Studies I by Jonathan B. Landman. The image uses fabric, gaze, and controlled light to create a restrained monochrome study. Released as a limited digital edition with Certificate of Authenticity and printing guidance.",
  },
  {
    slug: "velvet-gaze",
    title: "Velvet Gaze",
    seqLabel: "05 / 06",
    seoTitle: "Velvet Gaze — Black-and-White Fine Art Portrait | The Monokhromo Collection",
    metaDesc: "Velvet Gaze is a black-and-white fine art portrait by Jonathan B. Landman from Beauty — Studio Studies I.",
    certTitle: "Velvet Gaze — Beauty, Studio Studies I",
    alt: "Black-and-white close studio portrait of a woman with direct gaze and dark clothing, from Beauty — Studio Studies I by Jonathan B. Landman.",
    poetic: "Her gaze arrives through darkness with the density of velvet — soft, guarded, and unbroken. Velvet Gaze studies the face as a field of quiet force, where beauty is not shown loudly but held with discipline.",
    commercial: "Velvet Gaze is a black-and-white fine art portrait from Beauty — Studio Studies I by Jonathan B. Landman. The work focuses on expression, dark tonal contrast, and the emotional force of direct gaze. Released as a limited digital edition with Certificate of Authenticity and printing guidance.",
  },
  {
    slug: "downcast-light",
    title: "Downcast Light",
    seqLabel: "06 / 06",
    seoTitle: "Downcast Light — Monochrome Fine Art Portrait | The Monokhromo Collection",
    metaDesc: "Downcast Light is a monochrome fine art portrait by Jonathan B. Landman from Beauty — Studio Studies I.",
    certTitle: "Downcast Light — Beauty, Studio Studies I",
    alt: "Black-and-white profile portrait of a woman looking downward, from Beauty — Studio Studies I by Jonathan B. Landman.",
    poetic: "Her face turns away, and the image becomes an act of withholding. Downcast Light holds beauty in the space between visibility and retreat — a quiet study of profile, shadow, and inwardness.",
    commercial: "Downcast Light is a black-and-white fine art portrait from Beauty — Studio Studies I by Jonathan B. Landman. The work uses profile, soft shadow, and restrained expression to create a quiet monochrome study. Released as a limited digital edition with Certificate of Authenticity and printing guidance.",
  },
];

const IMG_BASE = "/assets/artworks/beauty-studio-studies-i";

// ─── Artwork page generator ───────────────────────────────────────────────────
function artworkPage(aw, idx) {
  const url = `/gallery/${aw.slug}/`;
  const A = p => assetHref(p, url);
  const imgFull  = `${IMG_BASE}/${aw.slug}.jpg`;
  const imgThumb = `${IMG_BASE}/${aw.slug}-thumb.jpg`;
  const prev = ARTWORKS[(idx - 1 + ARTWORKS.length) % ARTWORKS.length];
  const next = ARTWORKS[(idx + 1) % ARTWORKS.length];

  const body = `
    <nav class="mk-breadcrumb mk-mono-xs">
      <a href="${pageHref('/', url)}">Index</a> /
      <a href="${pageHref('/gallery/', url)}">Gallery</a> /
      <a href="${pageHref('/collections/beauty/', url)}">${COLLECTION.longTitle}</a> /
      <span>${aw.title}</span>
    </nav>

    <section class="mk-art-hero">
      <div class="mk-art-img-wrap">
        <img
          class="mk-art-img"
          src="${A(imgFull)}"
          alt="${aw.alt}"
          width="1280"
          height="1600"
          loading="eager"
          fetchpriority="high"
        />
      </div>
      <div class="mk-art-info">
        <div class="mk-art-seq mk-mono-xs">${COLLECTION.eyebrow} · ${aw.seqLabel}</div>
        <h1 class="mk-art-title"><em>${aw.title}</em></h1>

        <div class="mk-art-rule"></div>
        <p class="mk-art-poetic">${aw.poetic}</p>
        <div class="mk-art-rule"></div>
        <p class="mk-art-commercial">${aw.commercial}</p>
        <div class="mk-art-rule"></div>

        <div class="mk-buy">
          <div class="mk-buy-head">
            <span class="mk-mono-xs">CHOOSE A SIZE</span>
            <span class="mk-mono-xs">DELIVERY · BY EMAIL, WITHIN 48 H</span>
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
          <a
            class="mk-btn mk-btn-primary mk-btn-block mk-art-cta"
            href="${pageHref('/contact/', url)}?intent=edition&work=${aw.slug}"
          >Request this edition <span class="mk-btn-arrow">↗</span></a>
          <p class="mk-buy-foot mk-mono-xs">
            INCLUDED · MASTER FILE · CERTIFICATE · PRINTING GUIDANCE · EDITION SIZE STATED ON CERTIFICATE
          </p>
        </div>
      </div>
    </section>

    <section class="mk-section">
      ${eyebrow("EDITION", "What is included")}
      <div class="mk-detail-grid">
        <div class="mk-detail-card">
          <h4>Master file</h4>
          <p>A high-resolution JPEG at 300 ppi, prepared at the size selected. Suitable for archival pigment printing on cotton rag or baryta.</p>
        </div>
        <div class="mk-detail-card">
          <h4>Certificate of authenticity</h4>
          <p>A signed, hand-numbered certificate (delivered as a print-ready PDF) recording the work, edition, issue date, and your name as holder.</p>
          <a href="${pageHref('/certificate-of-authenticity/', url)}">VIEW SPECIMEN →</a>
        </div>
        <div class="mk-detail-card">
          <h4>Printing guidance</h4>
          <p>A short letter from the studio recommending papers, surfaces, and ICC profiles the work has been calibrated for.</p>
        </div>
      </div>
    </section>

    <section class="mk-section">
      ${eyebrow("COLLECTION", COLLECTION.longTitle)}
      <div class="mk-art-nav">
        <a class="mk-art-nav-prev" href="${pageHref(`/gallery/${prev.slug}/`, url)}">
          <span class="mk-mono-xs">← Previous</span>
          <span class="mk-art-nav-t"><em>${prev.title}</em></span>
        </a>
        <a class="mk-art-nav-coll" href="${pageHref('/collections/beauty/', url)}">
          <span class="mk-mono-xs">ALL SIX WORKS</span>
          <span>View the collection →</span>
        </a>
        <a class="mk-art-nav-next" href="${pageHref(`/gallery/${next.slug}/`, url)}">
          <span class="mk-mono-xs">Next →</span>
          <span class="mk-art-nav-t"><em>${next.title}</em></span>
        </a>
      </div>
    </section>

    <section class="mk-section">
      <div class="mk-cta-band">
        <h3>Questions about this edition?</h3>
        <p>Contact the studio directly to request this work, ask about sizes, or discuss printing.</p>
        <a class="mk-btn mk-btn-ghost" href="${pageHref('/contact/', url)}">Contact the studio →</a>
      </div>
    </section>
  `;

  // Custom <head> override for artwork SEO
  const pageHtml = shell({
    title: aw.seoTitle.replace(/ — The Monokhromo Collection$/, ''),
    description: aw.metaDesc,
    url,
    mainClass: "mk-artwork",
    body,
  });

  // Inject OG image pointing to the artwork itself
  return pageHtml.replace(
    /<meta property="og:image" content="[^"]*" \/>/,
    `<meta property="og:image" content="https://monokhromo.com${imgFull}" />`
  );
}

// ─── Updated gallery/index.html ───────────────────────────────────────────────
function galleryPage() {
  const url = '/gallery/';
  const body = `
    <header class="mk-page-head">
      ${eyebrow("01", "Gallery")}
      <h1 class="mk-page-title">
        <em>Beauty</em> — Studio Studies I.
      </h1>
      <p class="mk-page-lede">
        Six black-and-white portraits from The Monokhromo Collection's first release.
        Each work is available as a limited digital edition — master file, certificate
        of authenticity, and printing guidance.
      </p>
    </header>

    <section class="mk-section">
      <div class="mk-gal-grid-p2">
        ${ARTWORKS.map((aw, i) => {
          const imgThumb = `${IMG_BASE}/${aw.slug}-thumb.jpg`;
          return `<a class="mk-p2-card" href="${pageHref(`/gallery/${aw.slug}/`, url)}">
            <div class="mk-p2-img-wrap">
              <img
                class="mk-p2-img"
                src="${assetHref(imgThumb, url)}"
                alt="${aw.alt}"
                width="384"
                height="480"
                loading="${i < 2 ? 'eager' : 'lazy'}"
              />
            </div>
            <div class="mk-p2-card-meta">
              <span class="mk-mono-xs">${String(i+1).padStart(2,'0')} / 06</span>
              <span class="mk-p2-card-title"><em>${aw.title}</em></span>
              <span class="mk-p2-card-from">from € 65</span>
            </div>
          </a>`;
        }).join("")}
      </div>
    </section>

    <section class="mk-section">
      <div class="mk-cta-band">
        <h3>Questions about an edition?</h3>
        <p>Contact the studio directly to enquire about any work in the collection.</p>
        <a class="mk-btn mk-btn-primary" href="${pageHref('/contact/', url)}">Contact the studio →</a>
      </div>
    </section>
  `;
  return shell({
    title: "Gallery",
    description: "Six black-and-white fine art portraits from Beauty — Studio Studies I by Jonathan B. Landman. Limited digital editions with certificate of authenticity.",
    url,
    mainClass: "mk-gallery mk-gallery-p2",
    body,
  });
}

// ─── Updated collections/beauty/index.html ────────────────────────────────────
function beautyCollectionPage() {
  const url = '/collections/beauty/';
  const body = `
    <nav class="mk-breadcrumb mk-mono-xs">
      <a href="${pageHref('/', url)}">Index</a> /
      <a href="${pageHref('/collections/', url)}">Collections</a> /
      <span>${COLLECTION.longTitle}</span>
    </nav>

    <header class="mk-page-head mk-coll-head">
      ${eyebrow("02 · 01", `Collection · ${COLLECTION.title}`)}
      <h1 class="mk-page-title">
        <span class="mk-coll-title-num">I.</span>
        <em>${COLLECTION.longTitle}</em>
      </h1>
      <p class="mk-page-lede">${COLLECTION.statement}</p>
    </header>

    <section class="mk-coll-feature">
      <div class="mk-coll-feature-cover">
        <a href="${pageHref('/gallery/white-fur/', url)}" class="mk-coll-feature-img-link">
          <img
            class="mk-coll-feature-img"
            src="${assetHref(`${IMG_BASE}/white-fur.jpg`, url)}"
            alt="${ARTWORKS[0].alt}"
            width="1280"
            height="1600"
            loading="eager"
          />
        </a>
      </div>
      <div class="mk-coll-feature-text">
        <div class="mk-stag mk-stag-lg">
          <span class="mk-stag-num">LIGHT · SILENCE</span>
          <span class="mk-stag-rule"></span>
          <span class="mk-stag-years">6 WORKS</span>
        </div>
        <blockquote class="mk-coll-epi">
          <p>${COLLECTION.epigraph}</p>
          <cite>— ${BRAND.founder.toUpperCase()}</cite>
        </blockquote>
        <dl class="mk-coll-meta">
          <div><dt>Collection</dt><dd><em>${COLLECTION.longTitle}</em></dd></div>
          <div><dt>Format</dt><dd>Digital edition</dd></div>
          <div><dt>Works</dt><dd>Six portraits</dd></div>
          <div><dt>From</dt><dd>€ 65</dd></div>
        </dl>
        <div>
          <a class="mk-btn mk-btn-primary" href="${pageHref('/gallery/', url)}">View all six works →</a>
        </div>
      </div>
    </section>

    <section class="mk-coll-essay">
      <div class="mk-coll-essay-eyebrow">
        <span class="mk-mono-xs">FOUNDER'S NOTE</span>
        <span class="mk-mono-xs">${BRAND.founder.toUpperCase()}</span>
      </div>
      <p class="mk-coll-essay-p mk-coll-essay-p-first">
        <span class="mk-dropcap">B</span>eauty — Studio Studies I gathers six portraits from an earlier period of studio work, revisited and refined for the Collection's first public release. The images were made with controlled studio light, in long sessions, without a brief beyond attention.
      </p>
      <p class="mk-coll-essay-p">
        The subjects were not given instructions about expression. They were asked only to be present. The work is, in that sense, a study in what the face does when it stops performing — which is, I think, where beauty actually lives.
      </p>
      <p class="mk-coll-essay-p">
        Each plate is issued as a digital edition: a high-resolution file, a certificate, and a letter of guidance for whoever is going to print it. The work belongs on paper. I leave the choice of paper to you.
      </p>
      <div class="mk-coll-essay-sig">
        <span class="mk-mono-xs">— ${BRAND.founder.toUpperCase()}</span>
      </div>
    </section>

    <section class="mk-section">
      ${eyebrow("PLATES", "Six works in this collection")}
      <div class="mk-coll-plates-grid-p2">
        ${ARTWORKS.map((aw, i) => {
          const imgThumb = `${IMG_BASE}/${aw.slug}-thumb.jpg`;
          return `<div class="mk-coll-plate-p2">
            <a href="${pageHref(`/gallery/${aw.slug}/`, url)}">
              <img
                src="${assetHref(imgThumb, url)}"
                alt="${aw.alt}"
                width="384"
                height="480"
                loading="${i < 3 ? 'eager' : 'lazy'}"
              />
            </a>
            <div class="mk-coll-plate-p2-cap">
              <span class="mk-mono-xs">${String(i+1).padStart(2,'0')} / 06</span>
              <a href="${pageHref(`/gallery/${aw.slug}/`, url)}" class="mk-coll-plate-p2-t"><em>${aw.title}</em></a>
            </div>
          </div>`;
        }).join("")}
      </div>
    </section>

    <section class="mk-section">
      <div class="mk-cta-band">
        <h3>Enquire to acquire.</h3>
        <p>Each work is available as a digital edition from €65. Contact the studio to request a specific plate.</p>
        <a class="mk-btn mk-btn-primary" href="${pageHref('/contact/', url)}">Contact the studio →</a>
      </div>
    </section>
  `;
  return shell({
    title: COLLECTION.longTitle,
    description: `${COLLECTION.longTitle} — six black-and-white fine art portraits by ${BRAND.founder}, available as limited digital editions.`,
    url,
    mainClass: "mk-collection mk-collection-p2",
    body,
  });
}

// ─── Write all Phase 2 files ──────────────────────────────────────────────────
const OUT = 'phase2';

const filesToWrite = [
  [`${OUT}/gallery/index.html`,              galleryPage()],
  [`${OUT}/collections/beauty/index.html`,   beautyCollectionPage()],
  ...ARTWORKS.map((aw, i) => [`${OUT}/gallery/${aw.slug}/index.html`, artworkPage(aw, i)]),
];

for (const [path, content] of filesToWrite) {
  await saveFile(path, content);
  log('wrote ' + path);
}

// Copy shared assets into phase2 for local preview
const shared = ['styles.css', 'pages.css', 'app.js'];
for (const f of shared) {
  await saveFile(`${OUT}/${f}`, await readFile(f));
}
log('copied shared assets for local preview');

log(`\nPhase 2 build complete.`);
log(`Files created: ${ARTWORKS.length} artwork pages + 2 updated pages = ${ARTWORKS.length + 2} HTML files`);
