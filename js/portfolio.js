/**
 * DARSHAK DAMANIYA INTERIOR — Portfolio Filter & Dual-Media Lightbox Gallery
 * Features:
 * - Category & Media Type tab filtering (All, Videos, Photos, Interiors, Fabrication, Civil, Furniture, Renovation)
 * - Dual-Media Lightbox Modal supporting high-res photos and full HD on-site project videos
 * - Automatic video playback management (pause/reset on modal close or slide switch)
 * - Direct WhatsApp inquiry with auto-populated project title & category
 * - Touch swipe & keyboard navigation (Esc, ArrowLeft, ArrowRight)
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxVideo = document.getElementById('lightboxVideo');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxCat = document.getElementById('lightboxCat');
  const lightboxType = document.getElementById('lightboxType');
  const lightboxWaBtn = document.getElementById('lightboxWaBtn');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentVisibleItems = Array.from(portfolioItems);
  let currentLightboxIndex = 0;

  // ==========================================
  // Category & Media Type Filtering
  // ==========================================
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      currentVisibleItems = [];

      portfolioItems.forEach(item => {
        const itemCategory = (item.getAttribute('data-category') || '').toLowerCase();
        const itemType = (item.getAttribute('data-type') || 'image').toLowerCase();

        let shouldShow = false;

        if (filterValue === 'all') {
          shouldShow = true;
        } else if (filterValue === 'video') {
          shouldShow = itemType === 'video';
        } else if (filterValue === 'photo') {
          shouldShow = itemType === 'image';
        } else {
          shouldShow = itemCategory.includes(filterValue);
        }

        if (shouldShow) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 40);
          currentVisibleItems.push(item);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.92)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // ==========================================
  // Lightbox Modal
  // ==========================================
  function stopActiveVideo() {
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.removeAttribute('src');
      lightboxVideo.load();
      lightboxVideo.style.display = 'none';
    }
  }

  function openLightbox(index) {
    if (!currentVisibleItems.length || !lightboxModal) return;

    currentLightboxIndex = index;
    if (currentLightboxIndex >= currentVisibleItems.length) currentLightboxIndex = 0;
    if (currentLightboxIndex < 0) currentLightboxIndex = currentVisibleItems.length - 1;

    // Reset currently playing video first
    stopActiveVideo();

    const item = currentVisibleItems[currentLightboxIndex];
    const mediaType = item.getAttribute('data-type') || 'image';
    const mediaSrc = item.getAttribute('data-src') || '';
    const titleEl = item.querySelector('.portfolio-title');
    const catEl = item.querySelector('.portfolio-cat-badge');
    const desc = item.getAttribute('data-desc') || 'Bespoke craftsmanship executed by Darshak Damaniya Interior in Mumbai.';

    const itemTitle = titleEl ? titleEl.textContent.trim() : 'Project Showcase';
    const catText = catEl ? catEl.textContent.trim() : 'Interior & Fabrication';

    if (lightboxTitle) lightboxTitle.textContent = itemTitle;
    if (lightboxCat) lightboxCat.textContent = catText;
    if (lightboxDesc) lightboxDesc.textContent = desc;

    if (mediaType === 'video') {
      if (lightboxImg) lightboxImg.style.display = 'none';
      if (lightboxVideo) {
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = mediaSrc;
        lightboxVideo.load();
        const playPromise = lightboxVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay with sound may be blocked by browser policy until user gesture
          });
        }
      }
      if (lightboxType) {
        lightboxType.className = 'portfolio-type-badge type-video';
        lightboxType.innerHTML = '<i class="fa-solid fa-video"></i> Video';
      }
    } else {
      if (lightboxVideo) lightboxVideo.style.display = 'none';
      if (lightboxImg) {
        lightboxImg.style.display = 'block';
        lightboxImg.src = mediaSrc;
      }
      if (lightboxType) {
        lightboxType.className = 'portfolio-type-badge type-photo';
        lightboxType.innerHTML = '<i class="fa-solid fa-camera"></i> Photo';
      }
    }

    if (lightboxWaBtn) {
      const waMsg = encodeURIComponent(`Hi Darshak Damaniya Interior, I saw your project "${itemTitle}" (${catText}) on your website. I would like to inquire about similar work for my space and get a quotation.`);
      lightboxWaBtn.href = `https://wa.me/919867819387?text=${waMsg}`;
    }

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    stopActiveVideo();
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

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swiped Left -> Next
      openLightbox(currentLightboxIndex + 1);
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      // Swiped Right -> Prev
      openLightbox(currentLightboxIndex - 1);
    }
  }
});
