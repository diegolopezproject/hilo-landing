/* ============================================
   HILO LANDING — main.js
   navbar scroll · tabs · acordeón FAQ · reveals on scroll
   (pendiente: se implementa por sesiones, ver interacciones.md)
   ============================================ */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Navbar: estado scrolled (interacciones §1) ---- */
  var header = document.querySelector('.site-header');
  if (header) {
    var THRESHOLD = 40;
    var ticking = false;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > THRESHOLD);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Tabs (interacciones §2) ----
     Genérico para N tabs: el chip i controla la imagen i y el tabpanel i (orden DOM). */
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
    var imgs = Array.prototype.slice.call(root.querySelectorAll('.tabs__img'));
    var tablist = root.querySelector('[role="tablist"]');
    var current = tabs.reduce(function (acc, t, i) {
      return t.getAttribute('aria-selected') === 'true' ? i : acc;
    }, 0);
    var swapTimer = null;

    // Carga diferida de los paneles no visibles (interacciones §7)
    var preloaded = false;
    function preload() {
      if (preloaded) return;
      preloaded = true;
      imgs.forEach(function (img) {
        if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
      });
    }
    tablist.addEventListener('pointerenter', preload);
    tablist.addEventListener('focusin', preload);

    function showText(panel) {
      panel.hidden = false;
      if (REDUCED) return;
      panel.classList.add('is-entering');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          panel.classList.remove('is-entering'); // transiciona a opacity 1 / translateY 0
        });
      });
    }

    function select(next) {
      if (next === current) return;
      preload();
      var prev = current;
      current = next;

      tabs.forEach(function (t, i) {
        t.setAttribute('aria-selected', i === next ? 'true' : 'false');
        t.tabIndex = i === next ? 0 : -1;
      });

      // Imagen: crossfade 200ms (capas apiladas, sin reflow)
      imgs.forEach(function (img, i) {
        img.classList.toggle('is-active', i === next);
      });

      // Texto: fade-out 120ms → swap → fade-in 150ms
      if (swapTimer) { clearTimeout(swapTimer); swapTimer = null; }
      panels.forEach(function (p, i) {
        if (i !== prev && i !== next) { p.hidden = true; p.classList.remove('is-leaving', 'is-entering'); }
      });
      var leaving = panels[prev];
      var entering = panels[next];
      if (REDUCED) {
        leaving.hidden = true;
        entering.hidden = false;
        return;
      }
      leaving.classList.add('is-leaving');
      swapTimer = setTimeout(function () {
        leaving.classList.remove('is-leaving');
        leaving.hidden = true;
        showText(entering);
        swapTimer = null;
      }, 120);
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(i); });
    });

    // Teclado: flechas mueven la selección (roving tabindex), Home/End a extremos
    tablist.addEventListener('keydown', function (e) {
      var delta = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
      var target = null;
      if (delta !== undefined) target = (current + delta + tabs.length) % tabs.length;
      if (e.key === 'Home') target = 0;
      if (e.key === 'End') target = tabs.length - 1;
      if (target === null) return;
      e.preventDefault();
      select(target);
      tabs[target].focus();
    });
  });

  /* ---- FAQ: acordeón (interacciones §3) ----
     Items independientes: abrir uno no cierra los demás. La animación
     la hace CSS (grid-template-rows 0fr→1fr). */
  document.querySelectorAll('[data-accordion] .faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-item__button');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      item.classList.toggle('is-open', !open);
    });
  });

  /* ---- Reveal on scroll (interacciones §5) ---- */
  var revealables = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealables.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
