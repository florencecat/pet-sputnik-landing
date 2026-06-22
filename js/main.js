/* ============================================================
   PetСпутник — интерактив лендинга
   ------------------------------------------------------------
   Два эффекта (перенесены из исходного DC-компонента, без
   зависимостей от фреймворка):
     1. revealOnScroll — плавное появление блоков [data-reveal]
        при прокрутке (с задержкой [data-reveal-delay] в мс).
     2. initParallax  — лёгкий параллакс слоёв [data-depth] вслед
        за курсором (фон [data-parallax-bg] и сцена
        [data-parallax-stage]).
   ============================================================ */
(function () {
  'use strict';

  // Плавное появление элементов при попадании во вьюпорт.
  function revealOnScroll() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) return;

    els.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition =
        'opacity .75s cubic-bezier(.2,.7,.2,1), transform .75s cubic-bezier(.2,.7,.2,1)';
      var d = el.getAttribute('data-reveal-delay');
      if (d) el.style.transitionDelay = d + 'ms';
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'none';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

    els.forEach(function (el) { io.observe(el); });
  }

  // Параллакс слоёв вслед за движением мыши.
  function initParallax() {
    var stage = document.querySelector('[data-parallax-stage]');
    var bg = document.querySelector('[data-parallax-bg]');
    var collect = function (root) {
      return root ? Array.prototype.slice.call(root.querySelectorAll('[data-depth]')) : [];
    };
    var layers = collect(stage).concat(collect(bg));
    if (!layers.length) return;

    var raf = null, tx = 0, ty = 0;
    var apply = function () {
      layers.forEach(function (l) {
        var d = parseFloat(l.getAttribute('data-depth')) || 0;
        l.style.transform = 'translate(' + (tx * d * 16) + 'px, ' + (ty * d * 16) + 'px)';
      });
      raf = null;
    };
    var onMove = function (e) {
      tx = (e.clientX / window.innerWidth) - 0.5;
      ty = (e.clientY / window.innerHeight) - 0.5;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
  }

  function init() {
    revealOnScroll();
    initParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
