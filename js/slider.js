/**
 * DARSHAK DAMANIYA — Full-Width Automatic Hero Slider
 * Features:
 * - Auto-rotation every 4.5 seconds with live progress indicator
 * - Pause on hover / touch
 * - Arrow navigation & clickable pagination dots
 * - Slide counter (01 / 05)
 * - Mobile touch swipe gestures
 */

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const currentCountEl = document.querySelector('.slider-counter .current');
  const totalCountEl = document.querySelector('.slider-counter .total');
  const progressFill = document.querySelector('.slider-progress-fill');
  const sliderContainer = document.querySelector('.hero-slider-section');

  if (!slides.length) return;

  let currentSlide = 0;
  const totalSlides = slides.length;
  const slideDuration = 4500; // 4.5 seconds
  let slideTimer = null;
  let progressInterval = null;
  let progress = 0;
  const progressStepTime = 50; // update progress bar every 50ms

  // Initialize total count in counter
  if (totalCountEl) {
    totalCountEl.textContent = String(totalSlides).padStart(2, '0');
  }

  // Update slide display
  function goToSlide(index) {
    // Wrap around
    if (index >= totalSlides) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = totalSlides - 1;
    } else {
      currentSlide = index;
    }

    // Toggle active classes
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentSlide);
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });

    // Update counter display
    if (currentCountEl) {
      currentCountEl.textContent = String(currentSlide + 1).padStart(2, '0');
    }

    // Reset progress
    resetProgressBar();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  // Progress Bar Management
  function resetProgressBar() {
    progress = 0;
    if (progressFill) {
      progressFill.style.width = '0%';
    }
  }

  function startSliderTimer() {
    stopSliderTimer();

    // Start progress interval
    progressInterval = setInterval(() => {
      progress += (progressStepTime / slideDuration) * 100;
      if (progressFill) {
        progressFill.style.width = `${Math.min(progress, 100)}%`;
      }
      if (progress >= 100) {
        nextSlide();
      }
    }, progressStepTime);
  }

  function stopSliderTimer() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
    if (slideTimer) {
      clearTimeout(slideTimer);
      slideTimer = null;
    }
  }

  // Event Listeners for Controls
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startSliderTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startSliderTimer();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      startSliderTimer();
    });
  });

  // Pause on hover
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => {
      stopSliderTimer();
    });

    sliderContainer.addEventListener('mouseleave', () => {
      startSliderTimer();
    });
  }

  // Touch Swipe Support for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (sliderContainer) {
    sliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopSliderTimer();
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startSliderTimer();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swiped Left -> Next
      nextSlide();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swiped Right -> Prev
      prevSlide();
    }
  }

  // Initialize First Slide & Start Timer
  goToSlide(0);
  startSliderTimer();
});
