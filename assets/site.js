/* Awaken Coffee Bar - site behaviour */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- opening animation ---- */
  var intro = document.getElementById('intro');
  if (intro) {
    var hide = function () { intro.classList.add('gone'); };
    if (reduced) { hide(); }
    else { window.setTimeout(hide, 1050); }
    window.setTimeout(function () { if (intro.parentNode) { intro.parentNode.removeChild(intro); } }, 2200);
  }

  /* ---- sticky nav shadow ---- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 12) { nav.classList.add('stuck'); }
      else { nav.classList.remove('stuck'); }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- mobile menu ---- */
  var burger = document.querySelector('.burger');
  var menu = document.querySelector('.mobile-menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    Array.prototype.forEach.call(menu.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- gmail compose links (built in JS so the address is never in the HTML) ---- */
  Array.prototype.forEach.call(document.querySelectorAll('a[data-gmail]'), function (a) {
    var to = a.getAttribute('data-user') + '@' + a.getAttribute('data-domain');
    a.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to) +
      '&su=' + (a.getAttribute('data-su') || '') +
      '&body=' + (a.getAttribute('data-body') || '');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---- reveal on scroll (plain rect checks, so nothing can stay hidden) ---- */
  var rvs = Array.prototype.slice.call(document.querySelectorAll('.rv'));
  if (rvs.length) {
    if (reduced) {
      rvs.forEach(function (el) { el.classList.add('in'); });
    } else {
      rvs.forEach(function (el, i) { el.style.transitionDelay = (Math.min(i % 4, 3) * 80) + 'ms'; });
      var ticking = false;
      var check = function () {
        ticking = false;
        var h = window.innerHeight || document.documentElement.clientHeight;
        for (var i = rvs.length - 1; i >= 0; i--) {
          var r = rvs[i].getBoundingClientRect();
          if (r.top < h * 0.94 && r.bottom > 0) {
            rvs[i].classList.add('in');
            rvs.splice(i, 1);
          }
        }
      };
      var queue = function () {
        if (!ticking) { ticking = true; window.requestAnimationFrame(check); }
      };
      window.addEventListener('scroll', queue, { passive: true });
      window.addEventListener('resize', queue);
      window.addEventListener('load', queue);
      check();
      window.setTimeout(check, 400);
      window.setTimeout(check, 1400);
      /* safety net: if nothing revealed at all, something is wrong, so show everything */
      var total = rvs.length;
      window.setTimeout(function () {
        if (rvs.length === total) {
          rvs.forEach(function (el) { el.classList.add('in'); });
          rvs.length = 0;
        }
      }, 3000);
    }
  }

  /* ---- rotating hero photos ---- */
  var slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 1 && !reduced) {
    var s = 0;
    window.setInterval(function () {
      slides[s].classList.remove('on');
      s = (s + 1) % slides.length;
      slides[s].classList.add('on');
    }, 5500);
  }

  /* ---- rotating hero review quote (real Google reviews) ---- */
  var quotes = window.AWAKEN_REVIEWS || [];
  var qBox = document.getElementById('heroQuote');
  if (qBox && quotes.length) {
    var qText = qBox.querySelector('.hq-text');
    var qName = qBox.querySelector('.hq-name');
    var q = 0;
    var paint = function () {
      qText.textContent = '"' + quotes[q].short + '"';
      qName.textContent = quotes[q].name + ', Google review';
    };
    paint();
    if (!reduced && quotes.length > 1) {
      window.setInterval(function () {
        qBox.classList.add('fade');
        window.setTimeout(function () {
          q = (q + 1) % quotes.length;
          paint();
          qBox.classList.remove('fade');
        }, 560);
      }, 6200);
    }
  }

  /* ---- current year ---- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
