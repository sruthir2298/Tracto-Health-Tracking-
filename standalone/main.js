/** Shared JS — scroll reveal, section nav, ECG animation */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Scroll reveal */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (reduced) {
      els.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    els.forEach((el) => observer.observe(el));

    setTimeout(() => {
      document.querySelectorAll('#hero .reveal').forEach((el) => el.classList.add('visible'));
    }, 100);
  }

  /* Sticky section nav */
  function initSectionNav() {
    const links = document.querySelectorAll('.sec-nav-link[data-section]');
    if (!links.length) return;

    const sections = [...links]
      .map((l) => document.getElementById(l.dataset.section))
      .filter(Boolean);

    function setActive(id) {
      links.forEach((a) => a.classList.toggle('active', a.dataset.section === id));
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-110px 0px -55% 0px', threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));

    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById(link.dataset.section)?.scrollIntoView({ behavior: 'smooth' });
        setActive(link.dataset.section);
      });
    });
  }

  /* ECG path animation */
  function initEcg() {
    if (reduced) return;
    document.querySelectorAll('.ecg-path').forEach((path) => {
      const len = path.getTotalLength?.() || 180;
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.style.animation = 'ecg-draw 2.5s ease-in-out infinite';
    });
  }

  /* Dashboard mode toggle */
  function initDashboardToggle() {
    const sketchBtn = document.getElementById('btn-sketch');
    const polishedBtn = document.getElementById('btn-polished');
    const sketchView = document.getElementById('view-sketch');
    const polishedView = document.getElementById('view-polished');
    if (!sketchBtn || !polishedBtn) return;

    function setMode(mode) {
      const isSketch = mode === 'sketch';
      sketchView.classList.toggle('hidden', !isSketch);
      polishedView.classList.toggle('hidden', isSketch);
      sketchBtn.className = 'mode-btn ' + (isSketch ? 'sketch-active' : 'inactive');
      polishedBtn.className = 'mode-btn ' + (!isSketch ? 'polished-active' : 'inactive');
    }

    sketchBtn.addEventListener('click', () => setMode('sketch'));
    polishedBtn.addEventListener('click', () => setMode('polished'));
  }

  /* Floating metric tabs — click / cycle pulse + phone glow */
  function initMetricTabs() {
    const tabs = document.querySelectorAll('.metric-tab');
    const stage = document.querySelector('.phones-stage--image');
    if (!tabs.length) return;

    function activate(tab) {
      tabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      if (stage) {
        const glow = getComputedStyle(tab).getPropertyValue('--tab').trim() || '#00D4B4';
        stage.style.setProperty('--glow', glow);
        stage.classList.add('is-lit');
      }
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        activate(tab);
        tab.animate(
          [
            { transform: 'translateY(-4px) scale(1.04)' },
            { transform: 'translateY(-6px) scale(1.07)' },
            { transform: 'translateY(-4px) scale(1.04)' },
          ],
          { duration: 320, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
        );
      });
    });

    // Soft auto-cycle highlight for life on the page
    if (reduced) return;
    let i = 0;
    activate(tabs[0]);
    setInterval(() => {
      if (document.querySelector('.metric-tab:hover, .metric-tab:focus-visible')) return;
      activate(tabs[i % tabs.length]);
      i += 1;
    }, 2800);
  }

  /* Phone image — gentle parallax tilt on pointer move */
  function initPhonesParallax() {
    const img = document.querySelector('.phones-img');
    if (!img || reduced) return;
    const stage = img.closest('.phones-stage');
    if (!stage) return;

    stage.addEventListener('pointermove', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      img.style.transform = `translateY(-4px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`;
    });
    stage.addEventListener('pointerleave', () => {
      img.style.transform = '';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initSectionNav();
    initEcg();
    initDashboardToggle();
    initMetricTabs();
    initPhonesParallax();
  });
})();
