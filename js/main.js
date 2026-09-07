/**
 * DARSHAK DAMANIYA INTERIOR — Core Main JavaScript
 * Features:
 * - Sticky Navigation with scroll spy
 * - Mobile drawer menu
 * - Animated stats counters
 * - Interactive Cost Estimator calculator with direct WhatsApp forwarding
 * - Contact / Quotation form with real-time validation and WhatsApp link generator
 * - Floating Back-To-Top button
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // Sticky Header & Active Nav Highlighting
  // ==========================================
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-item a');
  const backToTopBtn = document.querySelector('.floating-backtotop');

  function handleScroll() {
    const scrollY = window.pageYOffset;

    // Header sticky styling
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active navigation link highlighting
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Check on initial load

  // Back to top click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // Mobile Drawer Menu Toggle
  // ==========================================
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const drawerClose = document.querySelector('.drawer-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-item a');

  function openMobileMenu() {
    if (mobileDrawer) mobileDrawer.classList.add('active');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openMobileMenu);
  if (drawerClose) drawerClose.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // ==========================================
  // Animated Counters on Scroll
  // ==========================================
  const counterElements = document.querySelectorAll('.metric-number, .experience-number');
  let countersStarted = false;

  function runCounters() {
    counterElements.forEach(counter => {
      const target = +counter.getAttribute('data-count');
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        counter.textContent = `${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = `${target}${suffix}`;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  const statsSection = document.querySelector('.metrics-strip, .about-section');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          runCounters();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(statsSection);
  } else {
    runCounters();
  }

  // ==========================================
  // Interactive Cost Estimator Calculator
  // ==========================================
  const calcService = document.getElementById('calcService');
  const calcArea = document.getElementById('calcArea');
  const calcAreaVal = document.getElementById('calcAreaVal');
  const tierBtns = document.querySelectorAll('.tier-btn');
  const calcPriceEl = document.getElementById('calcPrice');
  const calcWaBtn = document.getElementById('calcWaBtn');

  let selectedTier = 'premium'; // standard, premium, luxury
  const tierMultipliers = {
    standard: 1.0,
    premium: 1.35,
    luxury: 1.85
  };

  const serviceBaseRates = {
    interior: 1500, // approx per sq ft
    fabrication: 450,
    civil: 1600,
    furniture: 1200,
    renovation: 1100,
    turnkey: 2200
  };

  const serviceNames = {
    interior: 'Luxury Interior Design & Fitouts',
    fabrication: 'Metal & Structural Fabrication',
    civil: 'Civil Construction',
    furniture: 'Custom Furniture',
    renovation: 'Renovation & Remodeling',
    turnkey: 'Complete Turnkey Project'
  };

  function updateEstimate() {
    if (!calcService || !calcArea || !calcPriceEl) return;

    const serviceKey = calcService.value;
    const area = parseInt(calcArea.value, 10) || 500;
    if (calcAreaVal) calcAreaVal.textContent = `${area} Sq. Ft.`;

    const baseRate = serviceBaseRates[serviceKey] || 1200;
    const multiplier = tierMultipliers[selectedTier] || 1.35;

    const estimatedTotal = Math.round(baseRate * area * multiplier);
    const minEst = Math.round(estimatedTotal * 0.9);
    const maxEst = Math.round(estimatedTotal * 1.15);

    function formatINR(val) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(val);
    }

    calcPriceEl.textContent = `${formatINR(minEst)} - ${formatINR(maxEst)}`;

    if (calcWaBtn) {
      const sName = serviceNames[serviceKey] || 'Interior, Civil & Fabrication';
      const tierLabel = selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1);
      const text = `Hi Darshak Damaniya Interior, I used your website Cost Calculator for:\n- Service: ${sName}\n- Area: ${area} Sq. Ft.\n- Quality Tier: ${tierLabel}\n- Estimated Range: ${formatINR(minEst)} - ${formatINR(maxEst)}\n\nKindly provide a detailed consultation and quotation.`;
      calcWaBtn.href = `https://wa.me/919867819387?text=${encodeURIComponent(text)}`;
    }
  }

  if (calcArea) {
    calcArea.addEventListener('input', updateEstimate);
  }

  if (calcService) {
    calcService.addEventListener('change', updateEstimate);
  }

  tierBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tierBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTier = btn.getAttribute('data-tier') || 'premium';
      updateEstimate();
    });
  });

  // Initial estimate calculation
  updateEstimate();

  // ==========================================
  // Contact & Quotation Form Handling + WhatsApp Direct
  // ==========================================
  const quoteForm = document.getElementById('quoteForm');
  const quoteFormStatus = document.getElementById('quoteFormStatus');
  const submitWaBtn = document.getElementById('submitWaBtn');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('quoteName').value.trim();
      const phone = document.getElementById('quotePhone').value.trim();
      const email = document.getElementById('quoteEmail').value.trim();
      const service = document.getElementById('quoteService').value;
      const message = document.getElementById('quoteMessage').value.trim();

      if (!name || !phone) {
        alert('Please provide at least your Name and Phone Number.');
        return;
      }

      // Build rich WhatsApp message
      const text = `*New Project Quotation Request*\n--------------------------\n*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email || 'Not provided'}\n*Project Type:* ${service}\n*Message / Requirements:*\n${message || 'Please contact me to discuss my project requirements.'}\n--------------------------\n_Sent via Darshak Damaniya Interior Website_`;

      const waUrl = `https://wa.me/919867819387?text=${encodeURIComponent(text)}`;

      if (quoteFormStatus) {
        quoteFormStatus.textContent = '✓ Thank you! Redirecting you directly to Darshak Damaniya Interior on WhatsApp...';
        quoteFormStatus.className = 'form-status success';
      }

      // Open WhatsApp after short delay
      setTimeout(() => {
        window.open(waUrl, '_blank');
        quoteForm.reset();
      }, 700);
    });
  }

  // Quick Direct WhatsApp trigger from form
  if (submitWaBtn) {
    submitWaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.getElementById('quoteName').value.trim() || 'Client';
      const phone = document.getElementById('quotePhone').value.trim() || 'N/A';
      const service = document.getElementById('quoteService').value;
      const message = document.getElementById('quoteMessage').value.trim();

      const text = `Hi Darshak Damaniya Interior, my name is ${name} (${phone}). I am inquiring about ${service}. ${message ? `Details: ${message}` : 'Please share your portfolio and quotation.'}`;
      window.open(`https://wa.me/919867819387?text=${encodeURIComponent(text)}`, '_blank');
    });
  }
});
