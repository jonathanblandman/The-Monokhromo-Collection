// app.js — small vanilla JS for The Monokhromo Collection.
// Handles: mobile nav, segmented radios, conditional fields, contact + newsletter forms,
//          print-detail size selector + price update, scroll-aware nav.

(function () {
  "use strict";

  // ── Mobile nav toggle ─────────────────────────────────────────────────────
  const navToggle = document.querySelector(".mk-nav-toggle");
  const mobileNav = document.getElementById("mk-mobile-nav");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const open = mobileNav.hasAttribute("hidden");
      if (open) {
        mobileNav.removeAttribute("hidden");
        navToggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("mk-nav-open");
      } else {
        mobileNav.setAttribute("hidden", "");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("mk-nav-open");
      }
    });
  }

  // ── Segmented radio groups (visual on/off) ─────────────────────────────────
  document.querySelectorAll(".mk-form-seg").forEach((seg) => {
    seg.addEventListener("change", (e) => {
      if (e.target.matches('input[type="radio"]')) {
        seg.querySelectorAll(".mk-form-seg-opt").forEach((opt) =>
          opt.classList.toggle("is-on", opt.contains(e.target))
        );
        // Conditional fields keyed by data-show-when="name=value"
        const name = e.target.name;
        const value = e.target.value;
        const form = seg.closest("form");
        if (form) {
          form.querySelectorAll(`[data-show-when]`).forEach((f) => {
            const [n, v] = f.getAttribute("data-show-when").split("=");
            if (n === name) f.hidden = v !== value;
          });
        }
      }
    });
    // Initialise conditional fields based on default-checked radio
    const checked = seg.querySelector('input[type="radio"]:checked');
    if (checked) {
      const form = seg.closest("form");
      if (form) {
        form.querySelectorAll(`[data-show-when]`).forEach((f) => {
          const [n, v] = f.getAttribute("data-show-when").split("=");
          if (n === checked.name) f.hidden = v !== checked.value;
        });
      }
    }
  });

  // ── Contact form → mailto ─────────────────────────────────────────────────
  const contactForm = document.getElementById("mk-contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = contactForm.querySelector('[name="email"]')?.value || "";
      const name  = contactForm.querySelector('[name="name"]')?.value || "";
      const note  = contactForm.querySelector('[name="note"]')?.value || "";
      const intent = (contactForm.querySelector('input[name="intent"]:checked')?.value || "enquiry");
      const plate = contactForm.querySelector('[name="plate"]')?.value || "";
      const subject = encodeURIComponent(`Monokhromo enquiry — ${intent}${plate ? " · " + plate : ""}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nIntent: ${intent}${plate ? "\nPlate: " + plate : ""}\n\n${note}`
      );
      window.location.href = `mailto:studio@monokhromo.com?subject=${subject}&body=${body}`;
    });
  }

  // ── Newsletter form → mailto ─────────────────────────────────────────────
  const newsForm = document.getElementById("mk-news-form");
  if (newsForm) {
    newsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = newsForm.querySelector('[name="email"]')?.value || "";
      const subject = encodeURIComponent("Monokhromo letter — subscribe");
      const body = encodeURIComponent(`Please add me to the Monokhromo letter.\n\nEmail: ${email}`);
      window.location.href = `mailto:studio@monokhromo.com?subject=${subject}&body=${body}`;
    });
  }

  // ── Print-detail: size selector → updates CTA price ───────────────────────
  const buyForm = document.querySelector(".mk-buy");
  if (buyForm) {
    const SIZE_PRICES = { A4: 65, A3: 115, A2: 195 };
    const radios = buyForm.querySelectorAll('input[name="size"]');
    const ctaPrice = buyForm.querySelector(".mk-buy-cta-price");
    const sync = () => {
      const checked = buyForm.querySelector('input[name="size"]:checked');
      if (!checked) return;
      buyForm.querySelectorAll(".mk-buy-size").forEach((lbl) =>
        lbl.classList.toggle("is-on", lbl.contains(checked))
      );
      if (ctaPrice) ctaPrice.textContent = "€ " + SIZE_PRICES[checked.value];
    };
    radios.forEach((r) => r.addEventListener("change", sync));
    sync();
  }

  // ── Acquire CTA → friendly handoff (no payment in this prototype) ─────────
  document.querySelectorAll(".mk-buy-cta, .mk-btn-primary[href='/gallery/mono-lisa/']").forEach((b) => {
    // Only handle the acquire-on-detail-page button. The home/gallery acquire
    // CTAs are real <a> links; leave them alone.
    if (b.tagName !== "BUTTON") return;
    b.addEventListener("click", (e) => {
      e.preventDefault();
      const buy = document.querySelector(".mk-buy");
      if (!buy) return;
      const size = buy.querySelector('input[name="size"]:checked')?.value || "A4";
      window.location.href = `/contact/?intent=edition&plate=ml-${size.toLowerCase()}`;
    });
  });

  // ── Pre-fill contact form from URL params ─────────────────────────────────
  if (location.pathname.startsWith("/contact")) {
    const p = new URLSearchParams(location.search);
    const intent = p.get("intent");
    const plate = p.get("plate");
    if (intent) {
      const r = document.querySelector(`input[name="intent"][value="${intent}"]`);
      if (r) {
        r.checked = true;
        r.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
    if (plate) {
      const sel = document.querySelector('select[name="plate"]');
      if (sel) sel.value = plate;
    }
  }

  // ── Scroll-aware nav (subtle solidify on scroll) ──────────────────────────
  const navEl = document.querySelector(".mk-nav");
  if (navEl) {
    const onScroll = () => {
      navEl.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
