/* ============================================================
   PORTFOLIO — MAIN.JS
   - Language toggle (EN / FA)
   - Navbar scroll effect + active links
   - Hamburger menu
   - Scroll reveal
   - Skill bar animation
   - Contact form
   ============================================================ */

(function () {
  'use strict';

  /* ─── STATE ─── */
  let currentLang = localStorage.getItem('portfolio-lang') || 'en';

  /* ─── DOM REFS ─── */
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  const langToggle = document.getElementById('langToggle');
  const langLabel  = document.getElementById('langLabel');
  const contactForm = document.getElementById('contactForm');
  const htmlEl    = document.documentElement;
  const body      = document.body;

  /* ============================================================
     LANGUAGE
     ============================================================ */
  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('portfolio-lang', lang);

    if (lang === 'fa') {
      htmlEl.setAttribute('lang', 'fa');
      htmlEl.setAttribute('dir', 'rtl');
      body.classList.add('rtl');
      langLabel.textContent = 'EN';
    } else {
      htmlEl.setAttribute('lang', 'en');
      htmlEl.setAttribute('dir', 'ltr');
      body.classList.remove('rtl');
      langLabel.textContent = 'FA';
    }

    /* ── text nodes ── */
    document.querySelectorAll('[data-en][data-fa]').forEach(el => {
      el.textContent = el.dataset[lang];
    });

    /* ── placeholders ── */
    document.querySelectorAll('[data-en-placeholder][data-fa-placeholder]').forEach(el => {
      el.placeholder = lang === 'fa' ? el.dataset.faPlaceholder : el.dataset.enPlaceholder;
    });

    /* ── button submit span inside form ── */
    document.querySelectorAll('button[type="submit"] [data-en]').forEach(el => {
      el.textContent = el.dataset[lang];
    });
  }

  langToggle.addEventListener('click', () => {
    applyLang(currentLang === 'en' ? 'fa' : 'en');
  });

  /* init */
  applyLang(currentLang);

  /* ============================================================
     NAVBAR SCROLL
     ============================================================ */
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    /* active nav link */
    const sections = document.querySelectorAll('section[id]');
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 90) currentId = sec.id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + currentId);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============================================================
     HAMBURGER
     ============================================================ */
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  /* close on link click */
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  /* ============================================================
     SCROLL REVEAL
     ============================================================ */
  /* Tag every section child as revealable */
  const revealTargets = [
    '.about-grid > *',
    '.about-stats .stat',
    '.skill-category',
    '.timeline-item',
    '.project-card',
    '.contact-grid > *',
  ];

  revealTargets.forEach((sel, gi) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.classList.add(`reveal-delay-${(i % 3) + 1}`);
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ============================================================
     SKILL BARS
     ============================================================ */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.classList.add('animated');
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-category').forEach(cat => skillObserver.observe(cat));

  /* ============================================================
     CONTACT FORM
     ============================================================ */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const span = btn.querySelector('span');
      const origEn = span.dataset.en;
      const origFa = span.dataset.fa;

      btn.disabled = true;
      btn.style.opacity = '.7';

      /* Simulate send */
      setTimeout(() => {
        span.dataset.en = '✓ Sent!';
        span.dataset.fa = '✓ ارسال شد!';
        span.textContent = currentLang === 'fa' ? '✓ ارسال شد!' : '✓ Sent!';
        btn.style.background = '#22d66a';
        btn.style.boxShadow = '0 4px 24px rgba(34,214,106,.3)';

        setTimeout(() => {
          btn.disabled = false;
          btn.style.opacity = '';
          btn.style.background = '';
          btn.style.boxShadow = '';
          span.dataset.en = origEn;
          span.dataset.fa = origFa;
          span.textContent = currentLang === 'fa' ? origFa : origEn;
          contactForm.reset();
        }, 2500);
      }, 900);
    });
  }

  /* ============================================================
     SMOOTH CLOSE HERO SCROLL
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });

  /* ============================================================
     HERO ROLE TYPING
     ============================================================ */
  const rolesEN = ['Backend Developer', 'API Architect', 'Django Developer'];
  const rolesFA = ['توسعه‌دهنده بک‌اند', 'معمار API', 'توسعه‌دهنده جنگو'];
  const roleEl  = document.querySelector('.hero-role span[data-en]');
  let roleIdx = 0, charIdx = 0, deleting = false;

  function typeRole() {
    if (!roleEl) return;
    const list = currentLang === 'fa' ? rolesFA : rolesEN;
    const word = list[roleIdx % list.length];

    if (!deleting) {
      roleEl.textContent = word.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(typeRole, 1800);
        return;
      }
    } else {
      roleEl.textContent = word.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx++;
      }
    }
    setTimeout(typeRole, deleting ? 60 : 100);
  }

  setTimeout(typeRole, 1000);

})();
