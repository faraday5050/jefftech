/* ============================================================
   JEFF TECH — gallery.js
   Project filtering + lightbox for the Projects page
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Project filtering ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('#projectGrid .project-card');
  const emptyMsg = document.getElementById('projectsEmpty');

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach((b) => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });

        let visible = 0;
        projectCards.forEach((card) => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.classList.remove('fade-in');
          if (match) {
            card.classList.remove('hidden');
            void card.offsetWidth;
            card.classList.add('fade-in');
            visible++;
          } else {
            card.classList.add('hidden');
          }
        });

        if (emptyMsg) emptyMsg.hidden = visible > 0;
      });
    });
  }

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (!lightbox || !lightboxContent) return;

  const cardButtons = document.querySelectorAll('.project-card-btn');
  const projects = [];

  cardButtons.forEach((btn, i) => {
    const card = btn.closest('.project-card');
    if (!card) return;
    const img = card.querySelector('.project-thumb img');
    const cat = card.querySelector('.project-cat');
    const title = card.querySelector('h3');
    const desc = card.querySelector('p');

    projects.push({
      img: img ? img.getAttribute('src') : '',
      alt: img ? img.getAttribute('alt') : '',
      category: cat ? cat.textContent.trim() : '',
      title: title ? title.textContent.trim() : '',
      description: desc ? desc.textContent.trim() : ''
    });

    btn.addEventListener('click', () => openLightbox(i));
  });

  let currentIndex = 0;

  const WA_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg>';

  const renderSlide = (i) => {
    const p = projects[i];
    if (!p) return;

    const waMsg = encodeURIComponent(
      `Hello JEFF TECH, I saw your project "${p.title}" on your website and would like something similar. My location is ______.`
    );

    lightboxContent.innerHTML = `
      <img class="lightbox-img" src="${p.img}" alt="${p.alt}" />
      <div class="lightbox-body">
        <span class="lb-cat">${p.category}</span>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="lightbox-cta">
          <a class="btn btn-whatsapp" target="_blank" rel="noopener"
             href="https://wa.me/2349135323307?text=${waMsg}">
            ${WA_ICON}
            Ask About This Service
          </a>
          <a class="btn btn-outline" href="contact.html">Book a Service</a>
        </div>
      </div>
    `;
  };

  const openLightbox = (i) => {
    currentIndex = i;
    renderSlide(currentIndex);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose && lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + projects.length) % projects.length;
    renderSlide(currentIndex);
  };
  const showNext = () => {
    currentIndex = (currentIndex + 1) % projects.length;
    renderSlide(currentIndex);
  };

  lightboxClose && lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev && lightboxPrev.addEventListener('click', showPrev);
  lightboxNext && lightboxNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
})();