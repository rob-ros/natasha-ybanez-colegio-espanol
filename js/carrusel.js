(function() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;

    const slidesContainer = carousel.querySelector('.slides');
    let slides = Array.from(slidesContainer.children);

    // 1. Clonar primer y último slide
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    firstClone.classList.add('clone');
    lastClone.classList.add('clone');
    slidesContainer.appendChild(firstClone);
    slidesContainer.insertBefore(lastClone, slidesContainer.firstChild);

    // 1.1. Pre-cargar imágenes en los clones
    [firstClone, lastClone].forEach(clone => {
      clone.querySelectorAll('img').forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.onload = () => img.classList.add('loaded');
          img.classList.remove('lazy');
        }
      });
    });

    // 2. Actualizar lista de slides tras clonar
    slides = Array.from(slidesContainer.children);
    let currentIndex = 1; // primer slide real
    const slideCount = slides.length;
    let slideWidth = slides[0].clientWidth;
    const intervalMs = 5000;
    let timer;

    // Helper para recalcular slideWidth si es 0
    function ensureSlideWidth() {
      slideWidth = slides[0].clientWidth;
      if (!slideWidth) {
        setTimeout(() => {
          slideWidth = slides[0].clientWidth;
          if (!slideWidth) slideWidth = carousel.offsetWidth || 1;
          goToSlide(currentIndex, false);
        }, 100);
      }
    }

    // Bloqueo de transición para evitar clicks múltiples
    let isTransitioning = false;

    // 3. Mover al slide dado
    function goToSlide(index, withTransition = true) {
      ensureSlideWidth();
      if (isTransitioning) return;
      if (withTransition) {
        slidesContainer.style.transition = 'transform 1s ease-in-out';
        isTransitioning = true;
      } else {
        slidesContainer.style.transition = 'none';
      }
      currentIndex = index;
      slidesContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      // Si el usuario navega fuera de los límites, corrige inmediatamente
      if (currentIndex <= 0) {
        setTimeout(() => {
          slidesContainer.style.transition = 'none';
          currentIndex = slideCount - 2;
          slidesContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
          isTransitioning = false;
        }, withTransition ? 1000 : 0);
      } else if (currentIndex >= slideCount - 1) {
        setTimeout(() => {
          slidesContainer.style.transition = 'none';
          currentIndex = 1;
          slidesContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
          isTransitioning = false;
        }, withTransition ? 1000 : 0);
      }
    }

    // 4. Rebobinar al slide real tras aterrizar en un clon
    slidesContainer.addEventListener('transitionend', () => {
      isTransitioning = false;
      const slide = slides[currentIndex];
      if (slide.classList.contains('clone')) {
        slidesContainer.style.transition = 'none';
        if (currentIndex === slideCount - 1) {
          currentIndex = 1;
        }
        if (currentIndex === 0) {
          currentIndex = slideCount - 2;
        }
        ensureSlideWidth();
        slidesContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      }
    });

    // 5. Flechas de navegación (validar existencia)
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        restartAuto();
        goToSlide(currentIndex - 1);
      });
      nextBtn.addEventListener('click', () => {
        restartAuto();
        goToSlide(currentIndex + 1);
      });
    }

    // 6. Auto-play
    function startAuto() {
      timer = setInterval(() => goToSlide(currentIndex + 1), intervalMs);
    }
    function restartAuto() {
      clearInterval(timer);
      startAuto();
    }

    // 7. Resize: recalcula ancho y reposiciona sin transición
    window.addEventListener('resize', () => {
      goToSlide(currentIndex, false);
    });

    // 8. Esperar a que todas las imágenes del carrusel carguen antes de inicializar
    function imagesLoaded(container, callback) {
      const imgs = Array.from(container.querySelectorAll('img'));
      let loaded = 0;
      if (imgs.length === 0) return callback();
      imgs.forEach(img => {
        if (img.complete) {
          loaded++;
          if (loaded === imgs.length) callback();
        } else {
          img.addEventListener('load', () => {
            loaded++;
            if (loaded === imgs.length) callback();
          });
          img.addEventListener('error', () => {
            loaded++;
            if (loaded === imgs.length) callback();
          });
        }
      });
    }

    imagesLoaded(slidesContainer, () => {
      ensureSlideWidth();
      goToSlide(currentIndex, false);
      startAuto();
    });
  })();
