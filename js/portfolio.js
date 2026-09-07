/**
 * DARSHAK DAMANIYA INTERIOR — Portfolio Filter & Lightbox Gallery
 * Features:
 * - Category tab filtering with smooth transition
 * - Lightbox modal with high-res preview, title, details, and direct WhatsApp inquiry
 * - Keyboard navigation (Esc, Left, Right)
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxCat = document.getElementById('lightboxCat');
  const lightboxWaBtn = document.getElementById('lightboxWaBtn');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentVisibleItems = Array.from(portfolioItems);
  let currentLightboxIndex = 0;

  // ==========================================
  // Category Filtering
  // ==========================================
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      currentVisibleItems = [];

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        const shouldShow = filterValue === 'all' || itemCategory === filterValue;

        if (shouldShow) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
          currentVisibleItems.push(item);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.92)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ==========================================
  // Lightbox Modal
  // ==========================================
  function openLightbox(index) {
    if (!currentVisibleItems.length || !lightboxModal) return;

    currentLightboxIndex = index;
    if (currentLightboxIndex >= currentVisibleItems.length) currentLightboxIndex = 0;
    if (currentLightboxIndex < 0) currentLightboxIndex = currentVisibleItems.length - 1;

    const item = currentVisibleItems[currentLightboxIndex];
    const imgEl = item.querySelector('img');
    const titleEl = item.querySelector('.portfolio-title');
    const catEl = item.querySelector('.portfolio-cat-badge');
    const desc = item.getAttribute('data-desc') || 'High-precision interior design & craftsmanship executed by Darshak Damaniya Interior in Mumbai.';

    const imgSrc = imgEl ? imgEl.src : '';
    const imgTitle = titleEl ? titleEl.textContent : 'Project Details';
    const catText = catEl ? catEl.textContent : 'Interior & Fabrication';

    if (lightboxImg) lightboxImg.src = imgSrc;
    if (lightboxTitle) lightboxTitle.textContent = imgTitle;
    if (lightboxCat) lightboxCat.textContent = catText;
    if (lightboxDesc) lightboxDesc.textContent = desc;

    if (lightboxWaBtn) {
      const waMsg = encodeURIComponent(`Hi Darshak Damaniya Interior, I am interested in your project: "${imgTitle}" (${catText}). Please share more details and estimated pricing.`);
      lightboxWaBtn.href = `https://wa.me/919867819387?text=${waMsg}`;
    }

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Click event on portfolio item
  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const index = currentVisibleItems.indexOf(item);
      if (index !== -1) {
        openLightbox(index);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(currentLightboxIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(currentLightboxIndex + 1);
    });
  }

  // Close when clicking backdrop outside content
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      openLightbox(currentLightboxIndex - 1);
    } else if (e.key === 'ArrowRight') {
      openLightbox(currentLightboxIndex + 1);
    }
  });
});
