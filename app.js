/* ============================================================
   TOUX HAIR — app.js
   Handles: nav scroll/hamburger, open/closed badge,
            today row highlight, contact form, scroll reveals,
            footer year, subtle hero parallax
   ============================================================ */

'use strict';

/* ---- DOM references ---- */
const navHeader   = document.getElementById('nav-header');
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');
const hoursStatus = document.getElementById('hours-status');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const footerYear  = document.getElementById('footer-year');
const heroBgImg   = document.querySelector('.hero-bg-img');

/* ============================================================
   1. FOOTER YEAR
   ============================================================ */
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

/* ============================================================
   2. STICKY NAV — add .nav-scrolled on scroll
   ============================================================ */
function onScroll() {
  if (window.scrollY > 20) {
    navHeader.classList.add('nav-scrolled');
  } else {
    navHeader.classList.remove('nav-scrolled');
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run on load in case page is already scrolled

/* ============================================================
   3. HAMBURGER MENU TOGGLE
   ============================================================ */
function openMenu() {
  hamburger.classList.add('is-open');
  mobileMenu.classList.add('is-open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // prevent background scroll
}

function closeMenu() {
  hamburger.classList.remove('is-open');
  mobileMenu.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.contains('is-open');
  if (isOpen) closeMenu(); else openMenu();
});

/* Close menu when a mobile link is tapped */
document.querySelectorAll('[data-close-menu]').forEach((el) => {
  el.addEventListener('click', closeMenu);
});

/* Close menu on outside tap */
document.addEventListener('click', (e) => {
  if (
    mobileMenu.classList.contains('is-open') &&
    !mobileMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    closeMenu();
  }
});

/* ============================================================
   4. OPENING HOURS — Open Now / Closed badge
      Business hours in WAT (UTC+1):
        Mon–Thu  09:00 – 22:30
        Fri–Sat  09:00 – 23:00
        Sun      15:00 – 23:00
   ============================================================ */

function checkOpenStatus() {
  /* Convert the visitor's local time to WAT (UTC+1) */
  const now = new Date();
  /* getTimezoneOffset returns offset in minutes (negative for ahead of UTC) */
  const utcMs  = now.getTime() + now.getTimezoneOffset() * 60_000;
  const watMs  = utcMs + 1 * 3_600_000; // UTC+1
  const wat    = new Date(watMs);

  const day    = wat.getDay();   // 0=Sun … 6=Sat
  const hour   = wat.getHours();
  const minute = wat.getMinutes();
  const timeVal = hour * 60 + minute; // total minutes since midnight

  /* Convert HH:MM to total minutes for comparison */
  const t = (h, m) => h * 60 + m;

  /* Determine open window + which row to highlight */
  let openStart, openEnd, todayRowId;

  if (day >= 1 && day <= 4) {
    // Monday(1) to Thursday(4)
    openStart   = t(9, 0);
    openEnd     = t(22, 30);
    todayRowId  = 'row-mon-thu';
  } else if (day === 5 || day === 6) {
    // Friday(5) or Saturday(6)
    openStart   = t(9, 0);
    openEnd     = t(23, 0);
    todayRowId  = 'row-fri-sat';
  } else {
    // Sunday(0)
    openStart   = t(15, 0);
    openEnd     = t(23, 0);
    todayRowId  = 'row-sun';
  }

  const isOpen = timeVal >= openStart && timeVal < openEnd;

  /* Update badge */
  hoursStatus.textContent = isOpen ? 'Open Now' : 'Closed';
  hoursStatus.classList.toggle('is-open',   isOpen);
  hoursStatus.classList.toggle('is-closed', !isOpen);

  /* Highlight today's row */
  const todayRow = document.getElementById(todayRowId);
  if (todayRow) todayRow.classList.add('is-today');
}

checkOpenStatus();

/* ============================================================
   5. CONTACT FORM — validation + success state
   ============================================================ */

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    /* Basic HTML5 validity check */
    if (!contactForm.checkValidity()) {
      /* Trigger browser tooltips */
      contactForm.reportValidity();
      return;
    }

    /* Simulate async send — show success panel */
    const submitBtn = contactForm.querySelector('.form-submit');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      contactForm.hidden  = true;
      formSuccess.hidden  = false;
    }, 800);
  });
}

/* ============================================================
   6. SCROLL REVEAL — IntersectionObserver
   ============================================================ */

function initReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

  if (!('IntersectionObserver' in window)) {
    /* Fallback: just show everything */
    revealEls.forEach((el) => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* Add reveal classes to key elements after DOM is ready */
function markRevealTargets() {
  const targets = [
    '.section-header',
    '.gallery-grid',
    '.hours-card',
    '.contact-grid',
    '.footer-inner',
  ];

  targets.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      if (!el.classList.contains('reveal') && !el.classList.contains('reveal-stagger')) {
        el.classList.add('reveal');
      }
    });
  });

  /* Gallery items: stagger */
  const galleryGrid = document.querySelector('.gallery-grid');
  if (galleryGrid) galleryGrid.classList.replace('reveal', 'reveal-stagger');

  /* Contact info cards: stagger */
  const contactInfo = document.querySelector('.contact-info');
  if (contactInfo) contactInfo.classList.add('reveal-stagger');
}

markRevealTargets();
initReveal();

/* ============================================================
   7. SUBTLE HERO PARALLAX (scroll-based)
   ============================================================ */

function onParallaxScroll() {
  if (!heroBgImg) return;
  /* Move bg slightly slower than scroll for depth */
  const offset = window.scrollY * 0.3;
  heroBgImg.style.transform = `translateY(${offset}px)`;
}

/* Only apply on non-touch (prefer reduced motion check) */
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', onParallaxScroll, { passive: true });
}

/* ============================================================
   8. ACTIVE NAV LINK highlighting via IntersectionObserver
   ============================================================ */

function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  if (!navLinks.length || !sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove('active'));
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );

  sections.forEach((sec) => observer.observe(sec));
}

initActiveNav();
