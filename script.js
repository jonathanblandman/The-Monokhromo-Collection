/* =============================================================
   THE MONOKHROMO COLLECTION — monokhromo.com
   script.js — v1.0  |  Minimal JS only
   ============================================================= */

(function () {
  'use strict';

  /* ── Header: add .is-scrolled after 40px ── */
  var header = document.getElementById('site-header');

  if (header) {
    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); /* run once on load in case page is already scrolled */
  }

  /* ── Mobile nav toggle ── */
  var toggle = document.querySelector('.nav-toggle');
  var nav    = document.getElementById('nav-menu');

  if (toggle && nav) {

    function openNav() {
      toggle.setAttribute('aria-expanded', 'true');
      nav.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      toggle.getAttribute('aria-expanded') === 'true' ? closeNav() : openNav();
    });

    /* Close on any nav link click */
    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        toggle.focus();
      }
    });
  }

}());
