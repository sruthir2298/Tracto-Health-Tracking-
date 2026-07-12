/** Tracto App Shell — sidebar, bottom nav, toast, modal, quick-log */
(function (global) {
  'use strict';

  const ICONS = {
    overview: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V10.5z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-4.5-9.5-9C.5 9 2.5 6 6 6c2 0 3 1.5 4 3 1-1.5 2-3 4-3 3.5 0 5.5 3 3.5 6C19 16.5 12 21 12 21z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    nutrition: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3c-2 4-6 6-6 10a6 6 0 0012 0c0-4-4-6-6-10z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    progress: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19V5M4 19h16M8 16l3-4 3 2 4-6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 4a2 2 0 11-4 0 2 2 0 014 0zM7 21l3-7 2 3 3-8 3 5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    sleep: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3a7 7 0 107 7c0-4-3-7-7-7z" stroke-linecap="round"/><path d="M15 2c1.5 1 2.5 2.8 2.5 5" stroke-linecap="round"/></svg>',
    reports: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 3v5h5M9 13h6M9 17h4" stroke-linecap="round"/></svg>',
    profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" stroke-linecap="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9a6 6 0 0112 0c0 7 2 7 2 9H4c0-2 2-2 2-9z" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 20a2 2 0 004 0" stroke-linecap="round"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V10.5z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  const NAV = [
    { id: 'dashboard', label: 'Overview', href: 'dashboard.html', icon: 'overview' },
    { id: 'heart-rate', label: 'Heart', href: 'heart-rate.html', icon: 'heart' },
    { id: 'nutrition', label: 'Nutrition', href: 'nutrition.html', icon: 'nutrition' },
    { id: 'activity', label: 'Activity', href: 'activity.html', icon: 'activity' },
    { id: 'sleep', label: 'Sleep', href: 'sleep.html', icon: 'sleep' },
    { id: 'reports', label: 'Reports', href: 'reports.html', icon: 'reports' },
    { id: 'profile', label: 'Profile', href: 'profile.html', icon: 'profile' },
  ];

  const MOBILE_NAV = [
    { id: 'dashboard', label: 'Home', href: 'dashboard.html', icon: 'home' },
    { id: 'nutrition', label: 'Nutrition', href: 'nutrition.html', icon: 'nutrition' },
    { id: 'log', label: 'Log', href: '#', icon: 'plus', isLog: true },
    { id: 'activity', label: 'Activity', href: 'activity.html', icon: 'activity' },
    { id: 'sleep', label: 'Sleep', href: 'sleep.html', icon: 'sleep' },
  ];

  let toastHost = null;
  let activeModal = null;
  let lastFocus = null;

  function ensureToastHost() {
    if (!toastHost) {
      toastHost = document.createElement('div');
      toastHost.className = 'toast-host';
      toastHost.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastHost);
    }
    return toastHost;
  }

  function toast(message, duration) {
    const host = ensureToastHost();
    const el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.innerHTML = '<span style="color:var(--pulse-teal)">✓</span><span></span>';
    el.querySelector('span:last-child').textContent = message;
    host.appendChild(el);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 260);
    }, duration || 2800);
  }

  function getFocusable(container) {
    return [...container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )].filter((el) => el.offsetParent !== null || el === document.activeElement);
  }

  function closeModal() {
    if (!activeModal) return;
    const backdrop = activeModal;
    backdrop.classList.remove('open');
    setTimeout(() => backdrop.remove(), 220);
    activeModal = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
    document.removeEventListener('keydown', onModalKey);
  }

  function onModalKey(e) {
    if (!activeModal) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key !== 'Tab') return;
    const modal = activeModal.querySelector('.modal');
    const focusable = getFocusable(modal);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openModal(options) {
    closeModal();
    lastFocus = document.activeElement;
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.setAttribute('role', 'presentation');
    const wide = options.wide ? ' modal-wide' : '';
    backdrop.innerHTML =
      '<div class="modal' + wide + '" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">' +
      '<div class="modal-header">' +
      '<div><h2 id="modal-title"></h2>' +
      (options.subtitle ? '<p class="modal-sub"></p>' : '') +
      '</div>' +
      '<button type="button" class="modal-close" aria-label="Close">' + ICONS.close + '</button>' +
      '</div>' +
      '<div class="modal-body"></div>' +
      '</div>';

    backdrop.querySelector('#modal-title').textContent = options.title || '';
    if (options.subtitle) {
      backdrop.querySelector('.modal-sub').textContent = options.subtitle;
    }
    const body = backdrop.querySelector('.modal-body');
    if (typeof options.content === 'string') body.innerHTML = options.content;
    else if (options.content instanceof Node) body.appendChild(options.content);

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
    backdrop.querySelector('.modal-close').addEventListener('click', closeModal);

    document.body.appendChild(backdrop);
    activeModal = backdrop;
    requestAnimationFrame(() => backdrop.classList.add('open'));
    document.addEventListener('keydown', onModalKey);

    const modal = backdrop.querySelector('.modal');
    const focusable = getFocusable(modal);
    (focusable[0] || modal).focus();

    if (typeof options.onOpen === 'function') options.onOpen(modal, closeModal);
    return { modal, close: closeModal };
  }

  function openQuickLog(preselect) {
    const content =
      '<div class="quick-log-grid">' +
      [
        { id: 'meal', ico: '🥗', label: 'Log meal', bg: 'rgba(245,158,11,.12)' },
        { id: 'water', ico: '💧', label: 'Log water', bg: 'rgba(0,212,180,.12)' },
        { id: 'workout', ico: '👟', label: 'Add workout', bg: 'rgba(124,92,252,.12)' },
        { id: 'weight', ico: '⚖️', label: 'Record weight', bg: 'rgba(136,153,187,.12)' },
        { id: 'note', ico: '📝', label: 'Add health note', bg: 'rgba(0,212,180,.08)' },
      ].map((o) =>
        '<button type="button" class="quick-log-opt" data-log="' + o.id + '">' +
        '<div class="ico" style="background:' + o.bg + '">' + o.ico + '</div>' +
        '<span>' + o.label + '</span></button>'
      ).join('') +
      '</div>';

    openModal({
      title: 'Log activity',
      subtitle: 'Choose what you would like to record.',
      content,
      onOpen(modal, close) {
        modal.querySelectorAll('[data-log]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const type = btn.dataset.log;
            close();
            handleQuickLog(type);
          });
        });
        if (preselect) {
          const target = modal.querySelector('[data-log="' + preselect + '"]');
          if (target) setTimeout(() => target.click(), 180);
        }
      },
    });
  }

  function handleQuickLog(type) {
    if (type === 'meal') {
      if (document.body.dataset.page === 'nutrition' && typeof global.TractoNutrition !== 'undefined') {
        global.TractoNutrition.openAddMeal();
        return;
      }
      openMealQuickForm();
      return;
    }
    if (type === 'water') {
      if (document.body.dataset.page === 'nutrition' && typeof global.TractoNutrition !== 'undefined') {
        global.TractoNutrition.addWater();
        return;
      }
      toast('Water logged · +250 ml');
      return;
    }
    if (type === 'workout') {
      toast('Workout logged · 30 min sample activity');
      return;
    }
    if (type === 'weight') {
      openModal({
        title: 'Record weight',
        content:
          '<div class="form-group"><label for="qw">Weight (kg)</label>' +
          '<input class="form-input" id="qw" type="number" step="0.1" value="62.5" min="20" max="250"></div>' +
          '<div class="modal-actions"><button type="button" class="btn btn-teal" id="save-w">Save</button>' +
          '<button type="button" class="btn btn-ghost" data-close>Cancel</button></div>',
        onOpen(modal, close) {
          modal.querySelector('[data-close]').onclick = close;
          modal.querySelector('#save-w').onclick = () => {
            toast('Weight saved · ' + modal.querySelector('#qw').value + ' kg');
            close();
          };
        },
      });
      return;
    }
    if (type === 'note') {
      openModal({
        title: 'Health note',
        content:
          '<div class="form-group"><label for="qn">Note</label>' +
          '<textarea class="form-textarea" id="qn" placeholder="How are you feeling today?"></textarea></div>' +
          '<div class="modal-actions"><button type="button" class="btn btn-teal" id="save-n">Save note</button>' +
          '<button type="button" class="btn btn-ghost" data-close>Cancel</button></div>',
        onOpen(modal, close) {
          modal.querySelector('[data-close]').onclick = close;
          modal.querySelector('#save-n').onclick = () => {
            toast('Health note saved');
            close();
          };
        },
      });
    }
  }

  function openMealQuickForm() {
    openModal({
      title: 'Log meal',
      content:
        '<div class="form-group"><label for="mn">Meal name</label>' +
        '<input class="form-input" id="mn" value="Evening snack"></div>' +
        '<div class="form-row">' +
        '<div class="form-group"><label for="mk">Calories</label><input class="form-input" id="mk" type="number" value="220"></div>' +
        '<div class="form-group"><label for="mp">Protein (g)</label><input class="form-input" id="mp" type="number" value="12"></div>' +
        '</div>' +
        '<div class="modal-actions"><button type="button" class="btn btn-teal" id="save-m">Add meal</button>' +
        '<button type="button" class="btn btn-ghost" data-close>Cancel</button></div>',
      onOpen(modal, close) {
        modal.querySelector('[data-close]').onclick = close;
        modal.querySelector('#save-m').onclick = () => {
          toast('Meal added');
          close();
        };
      },
    });
  }

  function ringSVG(pct, size, gradientId) {
    const r = size === 'sm' ? 28 : 58;
    const c = size === 'sm' ? 36 : 70;
    const circ = 2 * Math.PI * r;
    const offset = circ - (Math.min(100, Math.max(0, pct)) / 100) * circ;
    const gid = gradientId || 'ringGrad';
    return (
      '<svg viewBox="0 0 ' + (c * 2) + ' ' + (c * 2) + '" aria-hidden="true">' +
      '<defs><linearGradient id="' + gid + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
      '<stop offset="0%" stop-color="#00d4b4"/><stop offset="100%" stop-color="#7c5cfc"/>' +
      '</linearGradient></defs>' +
      '<circle cx="' + c + '" cy="' + c + '" r="' + r + '" fill="none" stroke="var(--border)" stroke-width="' + (size === 'sm' ? 5 : 9) + '"/>' +
      '<circle cx="' + c + '" cy="' + c + '" r="' + r + '" fill="none" stroke="url(#' + gid + ')" stroke-width="' + (size === 'sm' ? 5 : 9) + '" stroke-linecap="round" stroke-dasharray="' + circ + '" stroke-dashoffset="' + offset + '"/>' +
      '</svg>'
    );
  }

  function mountShell(pageId) {
    if (pageId === 'onboarding') return;

    const shell = document.getElementById('app-shell');
    if (!shell) return;

    const main = shell.querySelector('.app-main') || shell.querySelector('main');
    if (!main) return;

    // Sidebar
    const sidebar = document.createElement('aside');
    sidebar.className = 'app-sidebar';
    sidebar.setAttribute('aria-label', 'Main navigation');
    sidebar.innerHTML =
      '<a href="landing.html" class="logo">tracto</a>' +
      '<nav class="sidebar-nav">' +
      NAV.map((n) =>
        '<a class="sidebar-link' + (n.id === pageId ? ' active' : '') + '" href="' + n.href + '"' +
        (n.id === pageId ? ' aria-current="page"' : '') + '>' +
        ICONS[n.icon] + '<span>' + n.label + '</span></a>'
      ).join('') +
      '</nav>' +
      '<div class="sidebar-footer">' +
      '<div class="sidebar-profile"><div class="avatar">S</div>' +
      '<div><div class="name">Sruthi</div><div class="meta">Prototype profile</div></div></div>' +
      '<a class="sidebar-home" href="landing.html">← Back to home</a>' +
      '</div>';

    const backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      backdrop.classList.remove('show');
    });

    // Topbar (mobile)
    const topbar = document.createElement('div');
    topbar.className = 'app-topbar';
    topbar.innerHTML =
      '<button type="button" class="icon-btn" id="menu-toggle" aria-label="Open menu">' + ICONS.menu + '</button>' +
      '<a href="landing.html" class="logo">tracto</a>' +
      '<a href="landing.html" class="back-link">Home</a>';

    main.insertBefore(topbar, main.firstChild);

    topbar.querySelector('#menu-toggle').addEventListener('click', () => {
      sidebar.classList.add('open');
      backdrop.classList.add('show');
    });

    // Bottom nav
    const bottom = document.createElement('nav');
    bottom.className = 'app-bottom-nav';
    bottom.setAttribute('aria-label', 'Mobile navigation');
    bottom.innerHTML =
      '<div class="bottom-nav-bar">' +
      MOBILE_NAV.map((n) => {
        if (n.isLog) {
          return '<button type="button" class="bnav-log" id="bnav-log" aria-label="Log activity">' + ICONS.plus + '</button>';
        }
        return (
          '<a class="bnav-item' + (n.id === pageId ? ' active' : '') + '" href="' + n.href + '"' +
          (n.id === pageId ? ' aria-current="page"' : '') + '>' +
          ICONS[n.icon] + '<span>' + n.label + '</span></a>'
        );
      }).join('') +
      '</div>';

    shell.insertBefore(sidebar, shell.firstChild);
    document.body.appendChild(backdrop);
    document.body.appendChild(bottom);

    bottom.querySelector('#bnav-log').addEventListener('click', () => openQuickLog());

    document.querySelectorAll('[data-open-log]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openQuickLog(btn.dataset.openLog || undefined);
      });
    });
  }

  function storageGet(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function storageSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) { /* ignore */ }
  }

  function celebrate(options) {
    const opts = options || {};
    const title = opts.title || 'Goal reached!';
    const message = opts.message || 'Nice work — keep the momentum going.';
    const key = opts.key || '';
    if (key) {
      const seen = storageGet('tracto_celebrated', {});
      if (seen[key]) return false;
      seen[key] = Date.now();
      storageSet('tracto_celebrated', seen);
    }

    let host = document.querySelector('.celebrate-host');
    if (!host) {
      host = document.createElement('div');
      host.className = 'celebrate-host';
      document.body.appendChild(host);
    }
    const colors = ['#00D4B4', '#7C5CFC', '#F59E0B', '#FF4D6D', '#38BDF8'];
    const bits = Array.from({ length: 28 }, (_, i) => {
      const left = Math.random() * 100;
      const delay = Math.random() * 0.4;
      const dur = 1.4 + Math.random() * 0.8;
      return '<i style="--l:' + left + '%;--d:' + delay + 's;--t:' + dur + 's;--c:' + colors[i % colors.length] + '"></i>';
    }).join('');

    host.innerHTML =
      '<div class="celebrate-overlay" role="dialog" aria-modal="true" aria-labelledby="cele-title">' +
      '<div class="celebrate-confetti" aria-hidden="true">' + bits + '</div>' +
      '<div class="celebrate-card">' +
      '<div class="celebrate-emoji" aria-hidden="true">🎉</div>' +
      '<h2 id="cele-title"></h2><p></p>' +
      '<button type="button" class="btn btn-grad btn-sm" data-cele-close>Continue</button>' +
      '</div></div>';
    host.querySelector('h2').textContent = title;
    host.querySelector('p').textContent = message;
    requestAnimationFrame(() => host.classList.add('show'));
    const close = () => {
      host.classList.remove('show');
      setTimeout(() => { host.innerHTML = ''; }, 280);
    };
    host.querySelector('[data-cele-close]').onclick = close;
    host.querySelector('.celebrate-overlay').addEventListener('click', (e) => {
      if (e.target.classList.contains('celebrate-overlay')) close();
    });
    toast(title);
    return true;
  }

  global.Tracto = {
    icons: ICONS,
    toast,
    openModal,
    closeModal,
    openQuickLog,
    ringSVG,
    celebrate,
    mountShell,
    storageGet,
    storageSet,
  };

  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    if (page) mountShell(page);
  });
})(window);
