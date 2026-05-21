"""
Certificate of Authenticity Generator
The Monokhromo Collection — monokhromo.com

Usage:
  python3 generate_certificate.py

  Edit the ARTWORKS list at the bottom to add new works.
  Each time an order comes in, call generate_certificate() with
  the appropriate edition number and save path.

  To generate a single certificate:
      generate_certificate(
          title="Mono Lisa",
          collection="Beauty",
          format_name="A3",
          dimensions="30 × 40 cm",
          edition_num=7,
          edition_total=25,
          date="21 May 2026",
          output_path="certificates/mono-lisa-a3-007.pdf"
      )

  To generate a full batch (all editions pre-printed, ready to send):
      generate_edition_batch(
          title="Mono Lisa",
          collection="Beauty",
          format_name="A3",
          dimensions="30 × 40 cm",
          edition_total=25,
          issue_date="May 2026",
          output_dir="certificates/mono-lisa/a3"
      )
"""

import os
import tempfile
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image


# ── Font Registration ──────────────────────────────────────────────

SERIF_REG    = '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf'
SERIF_ITALIC = '/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf'
SERIF_BOLD   = '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf'
SANS_LIGHT   = '/usr/share/fonts/truetype/lato/Lato-Light.ttf'
SANS_REG     = '/usr/share/fonts/truetype/lato/Lato-Regular.ttf'
SANS_MED     = '/usr/share/fonts/truetype/lato/Lato-Medium.ttf'

pdfmetrics.registerFont(TTFont('Serif',       SERIF_REG))
pdfmetrics.registerFont(TTFont('SerifItalic', SERIF_ITALIC))
pdfmetrics.registerFont(TTFont('SerifBold',   SERIF_BOLD))
pdfmetrics.registerFont(TTFont('SansLight',   SANS_LIGHT))
pdfmetrics.registerFont(TTFont('Sans',        SANS_REG))
pdfmetrics.registerFont(TTFont('SansMed',     SANS_MED))


# ── Colour Palette ────────────────────────────────────────────────

C_BG         = (0.980, 0.980, 0.973)   # #FAFAF8 warm white
C_BLACK      = (0.051, 0.051, 0.047)   # #0D0D0C near-black
C_GREY       = (0.467, 0.467, 0.443)   # #777771 mid-grey
C_RULE       = (0.165, 0.165, 0.161)   # #2A2A2A border colour
C_LIGHT_RULE = (0.729, 0.729, 0.706)   # #BABABC light rule

# Background as 0–255 tuple for PIL
C_BG_PIL = (int(0.980 * 255), int(0.980 * 255), int(0.973 * 255))  # (249, 249, 248)


# ── Image Asset Paths ─────────────────────────────────────────────

_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_DIR = os.path.dirname(_SCRIPT_DIR)

LOGO_PATH     = os.path.join(_PROJECT_DIR, 'Image assets', 'The Monokhromo Collection Print Logo.png')
WAX_SEAL_PATH = os.path.join(_PROJECT_DIR, 'Image assets', 'Wax Seal of Authenticity .png')


# ── Image Helpers ─────────────────────────────────────────────────

def _prepare_image(src_path, bg_rgb=C_BG_PIL, threshold=240, max_px=400):
    """
    Convert near-white / transparent pixels to the certificate background,
    then downscale to max_px on the longest side (sufficient for 300 dpi
    at the small sizes used on the certificate). Returns a temp file path.
    """
    img = Image.open(src_path).convert('RGBA')
    # Downscale first — dramatically reduces per-pixel loop cost and
    # the amount of image data reportlab embeds into each PDF.
    img.thumbnail((max_px, max_px), Image.LANCZOS)
    pixels = img.load()
    w, h = img.size
    bg_r, bg_g, bg_b = bg_rgb
    for y_px in range(h):
        for x_px in range(w):
            r, g, b, a = pixels[x_px, y_px]
            if a < 30 or (r >= threshold and g >= threshold and b >= threshold):
                pixels[x_px, y_px] = (bg_r, bg_g, bg_b, 255)
    out = img.convert('RGB')
    tmp = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
    out.save(tmp.name)
    tmp.close()
    return tmp.name


# Pre-process & downscale images once at module load.
# Downscaling from 1254 px to 400 px: reduces embedded data ~10×,
# reducing per-cert generation from ~7 s to ~0.3 s.
_LOGO_TMP     = _prepare_image(LOGO_PATH)
_WAX_SEAL_TMP = _prepare_image(WAX_SEAL_PATH)


def _draw_image_centred(c, img_path, cx, y_top, width_pts):
    """Draw an image centred on cx, top edge at y_top, scaled to width_pts."""
    img = Image.open(img_path)
    iw, ih = img.size
    aspect = ih / iw
    height_pts = width_pts * aspect
    x = cx - width_pts / 2
    c.drawImage(img_path, x, y_top - height_pts, width=width_pts, height=height_pts,
                preserveAspectRatio=True, mask='auto')
    return height_pts


# ── Text Helpers ──────────────────────────────────────────────────

def set_colour(c, rgb):
    c.setFillColorRGB(*rgb)

def set_stroke(c, rgb):
    c.setStrokeColorRGB(*rgb)

def draw_rule(c, x, y, width, colour=C_RULE, thickness=0.5):
    set_stroke(c, colour)
    c.setLineWidth(thickness)
    c.line(x, y, x + width, y)

def _reset_char_space(c):
    """
    Emit a Tc 0 operator to reset PDF character spacing to zero.
    Character spacing set inside a PDFTextObject persists in the content
    stream and affects all subsequent drawString/drawCentredString calls
    unless explicitly reset here.
    """
    t = c.beginText(0, 0)
    t.setCharSpace(0)
    c.drawText(t)

def draw_tracked(c, cx, y, text, char_space):
    """Draw centred text with character spacing, then reset spacing to 0."""
    font_name = c._fontname
    font_size = c._fontsize
    base_w = c.stringWidth(text, font_name, font_size)
    total_w = base_w + char_space * max(len(text) - 1, 0)
    x = cx - total_w / 2
    t = c.beginText(x, y)
    t.setCharSpace(char_space)
    t.textLine(text)
    c.drawText(t)
    _reset_char_space(c)

def draw_tracked_left(c, x, y, text, char_space):
    """Draw left-aligned text with character spacing, then reset spacing to 0."""
    t = c.beginText(x, y)
    t.setCharSpace(char_space)
    t.textLine(text)
    c.drawText(t)
    _reset_char_space(c)


# ── Certificate Generator ─────────────────────────────────────────

def generate_certificate(
    title,
    collection,
    format_name,
    dimensions,
    edition_num,
    edition_total,
    date,
    output_path
):
    """
    Generate a single Certificate of Authenticity PDF.

    Args:
        title:         Artwork title, e.g. "Mono Lisa"
        collection:    Collection name, e.g. "Beauty"
        format_name:   Print format, e.g. "A3"
        dimensions:    Print dimensions, e.g. "30 × 40 cm"
        edition_num:   This edition number, e.g. 7
        edition_total: Total edition size, e.g. 25
        date:          Date string, e.g. "May 2026"
        output_path:   Output PDF file path
    """

    os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)

    # Use module-level cached preprocessed images (processed once at import time)
    logo_tmp     = _LOGO_TMP
    wax_seal_tmp = _WAX_SEAL_TMP

    W, H = A4  # 595.28 × 841.89 pts

    c = canvas.Canvas(output_path, pagesize=A4)
    c.setTitle(f"Certificate of Authenticity — {title} — {format_name} {edition_num}/{edition_total}")
    c.setAuthor("The Monokhromo Collection")
    c.setSubject("Certificate of Authenticity — Limited Edition Fine Art Digital Print")

    # ── Background
    c.setFillColorRGB(*C_BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # ── Double border
    BORDER_OUTER = 16 * mm
    BORDER_INNER = 18 * mm
    set_stroke(c, C_RULE)
    c.setLineWidth(0.75)
    c.rect(BORDER_OUTER, BORDER_OUTER,
           W - 2 * BORDER_OUTER, H - 2 * BORDER_OUTER,
           fill=0, stroke=1)
    c.setLineWidth(0.25)
    c.rect(BORDER_INNER, BORDER_INNER,
           W - 2 * BORDER_INNER, H - 2 * BORDER_INNER,
           fill=0, stroke=1)

    MARGIN    = 22 * mm
    CONTENT_W = W - 2 * MARGIN
    CX        = W / 2

    # ─────────────────────────────────────────────────────────────
    # TOP SECTION — Logo
    # ─────────────────────────────────────────────────────────────

    LOGO_WIDTH  = 38 * mm   # rendered width on certificate
    y = H - 24 * mm         # top edge of logo

    logo_h = _draw_image_centred(c, logo_tmp, CX, y, LOGO_WIDTH)
    y = y - logo_h - 6 * mm

    draw_rule(c, MARGIN, y, CONTENT_W)

    # ─────────────────────────────────────────────────────────────
    # CERTIFICATE HEADING
    # ─────────────────────────────────────────────────────────────

    y -= 12 * mm
    c.setFont('SerifItalic', 24)
    set_colour(c, C_BLACK)
    c.drawCentredString(CX, y, 'Certificate of Authenticity')

    # ─────────────────────────────────────────────────────────────
    # THIS CERTIFIES THAT
    # ─────────────────────────────────────────────────────────────

    y -= 11 * mm
    c.setFont('Sans', 6.5)
    set_colour(c, C_GREY)
    draw_tracked(c, CX, y, 'THIS CERTIFIES THAT', 2.5)

    # ─────────────────────────────────────────────────────────────
    # ARTWORK TITLE
    # ─────────────────────────────────────────────────────────────

    y -= 11 * mm
    c.setFont('SerifItalic', 32)
    set_colour(c, C_BLACK)
    c.drawCentredString(CX, y, title)

    y -= 7 * mm
    c.setFont('SansLight', 8.5)
    set_colour(c, C_GREY)
    draw_tracked(c, CX, y, f'Collection: {collection}', 1.2)

    # ─────────────────────────────────────────────────────────────
    # EDITION DETAILS GRID
    # ─────────────────────────────────────────────────────────────

    y -= 9 * mm
    draw_rule(c, MARGIN, y, CONTENT_W)

    y -= 8 * mm

    col1_x = MARGIN
    col2_x = MARGIN + CONTENT_W * 0.34
    col3_x = MARGIN + CONTENT_W * 0.67

    # Row 1 — labels
    c.setFont('Sans', 6)
    set_colour(c, C_GREY)
    draw_tracked_left(c, col1_x, y, 'FORMAT', 1.8)
    draw_tracked_left(c, col2_x, y, 'EDITION', 1.8)
    draw_tracked_left(c, col3_x, y, 'RESOLUTION', 1.8)

    y -= 5.5 * mm
    c.setFont('Serif', 11)
    set_colour(c, C_BLACK)
    c.drawString(col1_x, y, f'{format_name}')
    c.setFont('SansLight', 8.5)
    set_colour(c, C_GREY)
    c.drawString(col1_x + 10 * mm, y + 0.5, f'· {dimensions}')

    c.setFont('Serif', 11)
    set_colour(c, C_BLACK)
    c.drawString(col2_x, y, f'{edition_num} of {edition_total}')

    c.setFont('Serif', 11)
    set_colour(c, C_BLACK)
    c.drawString(col3_x, y, '300 dpi')

    y -= 9 * mm

    # Row 2 — labels
    c.setFont('Sans', 6)
    set_colour(c, C_GREY)
    draw_tracked_left(c, col1_x, y, 'DATE OF ISSUE', 1.8)
    draw_tracked_left(c, col2_x, y, 'LICENCE', 1.8)

    y -= 5.5 * mm
    c.setFont('Serif', 11)
    set_colour(c, C_BLACK)
    c.drawString(col1_x, y, date)

    c.setFont('SansLight', 8.5)
    set_colour(c, C_GREY)
    c.drawString(col2_x, y + 0.5, 'Personal use · One physical print')

    y -= 9 * mm
    draw_rule(c, MARGIN, y, CONTENT_W)

    # ─────────────────────────────────────────────────────────────
    # LICENCE STATEMENT
    # ─────────────────────────────────────────────────────────────

    y -= 8 * mm

    licence_text = (
        'This digital file is a limited-edition work of fine art photography, '
        'issued by The Monokhromo Collection. It is licensed for personal use only. '
        'One physical print may be produced from this file. The file may not be '
        'reproduced, shared, resold, or used commercially in any form. '
        'Edition integrity is maintained by purchase record.'
    )

    c.setFont('SansLight', 7.5)
    set_colour(c, C_GREY)
    words   = licence_text.split()
    line    = ''
    LINE_H  = 4.8 * mm
    WRAP_W  = CONTENT_W * 0.93   # safety margin — Lato Light metrics run slightly narrow

    for word in words:
        test = (line + ' ' + word).strip()
        if c.stringWidth(test, 'SansLight', 7.5) <= WRAP_W:
            line = test
        else:
            c.drawString(MARGIN, y, line)
            y -= LINE_H
            line = word
    if line:
        c.drawString(MARGIN, y, line)
        y -= LINE_H

    # ─────────────────────────────────────────────────────────────
    # CONTACT
    # ─────────────────────────────────────────────────────────────

    y -= 5 * mm
    c.setFont('Sans', 8)
    set_colour(c, C_BLACK)
    c.drawString(MARGIN, y, 'studio@monokhromo.com')

    # ─────────────────────────────────────────────────────────────
    # BOTTOM — Wax Seal + Tagline
    # Anchored from content bottom, not page bottom, to close the gap.
    # ─────────────────────────────────────────────────────────────

    WAX_WIDTH  = 28 * mm
    y_seal_top = y - 10 * mm          # 10 mm below contact line
    y_rule     = y_seal_top - WAX_WIDTH - 5 * mm
    y_tagline  = y_rule - 5 * mm

    # Wax seal — centred
    _draw_image_centred(c, wax_seal_tmp, CX, y_seal_top, WAX_WIDTH)

    # Thin rule beneath seal
    draw_rule(c, MARGIN, y_rule, CONTENT_W, C_LIGHT_RULE, 0.3)

    # Tagline
    c.setFont('SerifItalic', 8.5)
    set_colour(c, C_GREY)
    draw_tracked(c, CX, y_tagline, 'Light · Stone · Shadow · Silence', 1.5)

    # ─────────────────────────────────────────────────────────────
    c.save()

    # Note: logo_tmp and wax_seal_tmp are module-level cached files — do not unlink here

    print(f'  ✓  {output_path}')


# ── Batch Generator ───────────────────────────────────────────────

def generate_edition_batch(
    title,
    collection,
    format_name,
    dimensions,
    edition_total,
    issue_date,
    output_dir
):
    """
    Pre-generate all certificates for an edition.
    Creates: output_dir/{title-slug}-{format}-NNN.pdf for each edition number.
    """
    title_slug = title.lower().replace(' ', '-')
    fmt_slug   = format_name.lower()

    print(f'\nGenerating {edition_total} certificates — {title} · {format_name}')
    for n in range(1, edition_total + 1):
        filename     = f'{title_slug}-{fmt_slug}-{n:03d}of{edition_total:03d}.pdf'
        output_path  = os.path.join(output_dir, filename)
        generate_certificate(
            title=title,
            collection=collection,
            format_name=format_name,
            dimensions=dimensions,
            edition_num=n,
            edition_total=edition_total,
            date=issue_date,
            output_path=output_path
        )
    print(f'  Done. {edition_total} certificates saved to: {output_dir}')


# ── ARTWORK REGISTRY ──────────────────────────────────────────────
# Add new artworks here as they are released.
# Run this script to regenerate all certificates.
#
# FORMAT:
#   title         — artwork title exactly as it appears on the product page
#   collection    — collection name (e.g. "Beauty", "Malta in Shadow")
#   formats       — list of (format_name, dimensions, edition_total, output_dir)
#   issue_date    — month and year of release (e.g. "May 2026")
# ─────────────────────────────────────────────────────────────────

ARTWORKS = [
    {
        'title':      'Mono Lisa',
        'collection': 'Beauty',
        'issue_date': 'May 2026',
        'formats': [
            ('A4', '21 × 30 cm', 50,  'mono-lisa/a4'),
            ('A3', '30 × 40 cm', 25,  'mono-lisa/a3'),
            ('A2', '42 × 59 cm', 15,  'mono-lisa/a2'),
        ]
    },
    # ── Add future artworks below this line ──────────────────────
    # {
    #     'title':      'Next Work Title',
    #     'collection': 'Beauty',
    #     'issue_date': 'June 2026',
    #     'formats': [
    #         ('A4', '21 × 30 cm', 50, 'next-work/a4'),
    #         ('A3', '30 × 40 cm', 25, 'next-work/a3'),
    #         ('A2', '42 × 59 cm', 15, 'next-work/a2'),
    #     ]
    # },
]


# ── Main ──────────────────────────────────────────────────────────

if __name__ == '__main__':
    base = os.path.dirname(os.path.abspath(__file__))

    for artwork in ARTWORKS:
        for (fmt_name, dims, ed_total, rel_dir) in artwork['formats']:
            output_dir = os.path.join(base, rel_dir)
            generate_edition_batch(
                title=artwork['title'],
                collection=artwork['collection'],
                format_name=fmt_name,
                dimensions=dims,
                edition_total=ed_total,
                issue_date=artwork['issue_date'],
                output_dir=output_dir
            )

    print('\nAll certificates generated.')
