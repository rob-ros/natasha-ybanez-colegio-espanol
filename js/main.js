/* main.js */
(function() {
  'use strict';

  function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function(...args) {
      const context = this;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }


  // ------------------------- 
  // Mobile menu toggle
  // -------------------------
  const navToggle = document.querySelector('.nav-toggle');
  const navList   = document.querySelector('.nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      navList.classList.toggle('show');
    });
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navList.classList.remove('show'));
    });
  }

  // -------------------------
  // Barra de navegación dinámica (oculta al bajar, aparece al subir)
  // -------------------------
  let lastScrollY = window.scrollY;
  const siteHeader = document.querySelector('.site-header');
  let ticking = false;
  function handleNavScroll() {
    if (!siteHeader) return;
    const currentScroll = window.scrollY;
    if (currentScroll > lastScrollY && currentScroll > 60) {
      siteHeader.classList.add('nav-hidden');
    } else {
      siteHeader.classList.remove('nav-hidden');
    }
    lastScrollY = currentScroll;
    ticking = false;
  }
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(handleNavScroll);
      ticking = true;
    }
  });

})();