/* ============================================
   HILO LANDING — main.js
   navbar scroll · tabs · acordeón FAQ · reveals on scroll
   (pendiente: se implementa por sesiones, ver interacciones.md)
   ============================================ */
(function () {
  'use strict';

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
})();
