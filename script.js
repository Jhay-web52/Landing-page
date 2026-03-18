/* ═══════════════════════════════════════════════════
   SCISSORS  ·  Landing Page Scripts
   ═══════════════════════════════════════════════════ */

// ── Theme Toggle ──────────────────────────────────
const html        = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

// Initialize from localStorage, then fall back to system preference
function initTheme() {
  const saved  = localStorage.getItem('scissors-theme');
  const system = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  html.setAttribute('data-theme', saved || system);
}
initTheme();

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'light' ? 'dark' : 'light';

  // Briefly enable cross-property transitions only during switch
  html.classList.add('theme-transitioning');
  html.setAttribute('data-theme', next);
  localStorage.setItem('scissors-theme', next);

  setTimeout(() => html.classList.remove('theme-transitioning'), 400);
});

// Sync with OS preference changes (user hasn't manually set it)
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
  if (!localStorage.getItem('scissors-theme')) {
    html.classList.add('theme-transitioning');
    html.setAttribute('data-theme', e.matches ? 'light' : 'dark');
    setTimeout(() => html.classList.remove('theme-transitioning'), 400);
  }
});


// ── Mobile Menu ───────────────────────────────────
const menuToggle = document.getElementById('mobile-menu');
const navLinks   = document.querySelector('.nav-links');

function closeMenu() {
  navLinks.classList.remove('active');
  menuToggle.classList.remove('is-open');
  const [a, b, c] = menuToggle.querySelectorAll('span');
  a.style.transform = b.style.opacity = b.style.transform = c.style.transform = '';
}

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('active');
  menuToggle.classList.toggle('is-open', isOpen);
  const [a, b, c] = menuToggle.querySelectorAll('span');
  if (isOpen) {
    a.style.transform = 'rotate(45deg) translate(5px, 5px)';
    b.style.opacity   = '0';
    b.style.transform = 'scaleX(0)';
    c.style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    a.style.transform = b.style.opacity = b.style.transform = c.style.transform = '';
  }
});

navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

// Close on outside click
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('active') &&
      !navLinks.contains(e.target) &&
      !menuToggle.contains(e.target)) {
    closeMenu();
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('active')) closeMenu();
});


// ── Header Scroll Effect + Nav Scroll Spy ────────
const header   = document.getElementById('header');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const sections   = ['features', 'pricing', 'analytics', 'faqs']
  .map(id => document.getElementById(id))
  .filter(Boolean);

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Header background
  header.classList.toggle('scrolled', scrollY > 40);

  // Scroll-spy: highlight nav link for the section in view
  let current = '';
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navAnchors.forEach(a => {
    const matches = a.getAttribute('href') === '#' + current;
    a.classList.toggle('active', matches);
  });
}, { passive: true });


// ── Scroll Reveal ─────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -56px 0px' });

document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));


// ── Animated Stat Counters ────────────────────────
function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix || '';
  const duration = 1800;
  const start    = performance.now();

  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target) + suffix;
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

const statsSection = document.getElementById('analytics');
if (statsSection) statsObserver.observe(statsSection);


// ── FAQ Accordion ─────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
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
      urlInput.style.borderColor = '#f87171';
      urlInput.style.boxShadow   = '0 0 0 3px rgba(248,113,113,0.18)';
      urlInput.placeholder       = 'Please enter a URL first...';
      urlInput.focus();
      setTimeout(() => {
        urlInput.style.borderColor = '';
        urlInput.style.boxShadow   = '';
        urlInput.placeholder       = 'Paste your long URL here...';
      }, 2200);
    } else {
      const label = trimBtn.querySelector('span');
      const orig  = label.textContent;
      label.textContent        = 'Link Created! ✓';
      trimBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      trimBtn.style.boxShadow  = '0 4px 24px rgba(34,197,94,0.4)';
      setTimeout(() => {
        label.textContent        = orig;
        trimBtn.style.background = '';
        trimBtn.style.boxShadow  = '';
      }, 2400);
    }
  });
}


// ── Smooth page entrance ──────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity    = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  }));
});
