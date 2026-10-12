/* ============================================================
   JEFF TECH — main.js
   Scroll reveal · count-up · navbar scroll state
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Respect reduced motion ---------- */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 60) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile bottom bar: reveal after first paint ---------- */
  const mobileBar = document.querySelector('.mobile-bar');
  if (mobileBar) {
    window.addEventListener('load', () => {
      setTimeout(() => mobileBar.classList.add('visible'), 400);
    });
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // Stagger siblings
        const parent = el.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter(c => c.classList.contains('reveal'));
          const idx = siblings.indexOf(el);
          const delay = Math.min(idx, 6) * 80;
          el.style.transitionDelay = delay + 'ms';
        }
        el.classList.add('revealed');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  /* ---------- Frost-line draw-in ---------- */
  const frostLines = document.querySelectorAll('.frost-line');
  if (frostLines.length && 'IntersectionObserver' in window && !prefersReduced) {
    const fo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('frost-visible');
          fo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    frostLines.forEach(el => fo.observe(el));
  } else {
    frostLines.forEach(el => el.classList.add('frost-visible'));
  }

  /* ---------- Count-up (hero badge) ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && !prefersReduced) {
    const countUp = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out-cubic
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
    };
    const co = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => co.observe(el));
  } else {
    counters.forEach(el => { el.textContent = el.dataset.count || '0'; });
  }

  /* ---------- Smooth scroll for internal anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      // Close mobile menu if open
      const menu = document.getElementById('mobileMenu');
      const toggle = document.getElementById('navToggle');
      if (menu && menu.classList.contains('open')) {
        menu.classList.remove('open');
        menu.setAttribute('aria-hidden', 'true');
        toggle && toggle.classList.remove('open');
        toggle && toggle.setAttribute('aria-expanded', 'false');
      }

      const navbarEl = document.getElementById('navbar');
      const offset = navbarEl ? navbarEl.offsetHeight + 12 : 12;
      const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Active nav link on scroll (home page only) ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const navIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => navIo.observe(s));
  }
})();