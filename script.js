/* ═══════════════════════════════════════════════════
   SCISSORS  ·  Landing Page Scripts
   ═══════════════════════════════════════════════════ */

// ── Mobile Menu ───────────────────────────────────
const menuToggle = document.getElementById('mobile-menu');
const navLinks   = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('active');
  const spans  = menuToggle.querySelectorAll('span');

  if (isOpen) {
    spans[0].style.transform  = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity    = '0';
    spans[1].style.transform  = 'scaleX(0)';
    spans[2].style.transform  = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform  = '';
    spans[1].style.opacity    = '';
    spans[1].style.transform  = '';
    spans[2].style.transform  = '';
  }
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[1].style.transform = '';
    spans[2].style.transform = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('active') &&
      !navLinks.contains(e.target) &&
      !menuToggle.contains(e.target)) {
    navLinks.classList.remove('active');
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[1].style.transform = '';
    spans[2].style.transform = '';
  }
});


// ── Header Scroll Effect ──────────────────────────
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


// ── Scroll Reveal ─────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -56px 0px',
});

document.querySelectorAll('.scroll-reveal').forEach(el => {
  revealObserver.observe(el);
});


// ── Animated Stat Counters ────────────────────────
function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix || '';
  const duration = 1800;
  const start    = performance.now();

  const update = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.getElementById('stats-section');
if (statsSection) statsObserver.observe(statsSection);


// ── FAQ Accordion ─────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all open items with smooth transition
    document.querySelectorAll('.faq-item.open').forEach(open => {
      open.classList.remove('open');
    });

    // Toggle the clicked one
    if (!isOpen) item.classList.add('open');
  });
});


// ── Trim URL Button ───────────────────────────────
const trimBtn  = document.querySelector('.trim-btn');
const urlInput = document.querySelector('.url-input');

if (trimBtn && urlInput) {
  trimBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const val = urlInput.value.trim();

    if (!val) {
      // Error state
      urlInput.style.borderColor = '#f87171';
      urlInput.style.boxShadow   = '0 0 0 3px rgba(248,113,113,0.15)';
      urlInput.placeholder       = 'Please enter a URL first...';
      urlInput.focus();
      setTimeout(() => {
        urlInput.style.borderColor = '';
        urlInput.style.boxShadow   = '';
        urlInput.placeholder       = 'Paste your long URL here...';
      }, 2200);
    } else {
      // Success state
      const label = trimBtn.querySelector('span');
      const orig  = label.textContent;
      label.textContent      = 'Link Created! ✓';
      trimBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      trimBtn.style.boxShadow  = '0 4px 24px rgba(34,197,94,0.4)';

      setTimeout(() => {
        label.textContent       = orig;
        trimBtn.style.background = '';
        trimBtn.style.boxShadow  = '';
      }, 2400);
    }
  });
}


// ── Smooth page entrance ──────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
});
