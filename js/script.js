const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Text size accessibility controls ---------- */
const body = document.body;
const sizeLevels = ['', 'text-larger', 'text-largest'];
let sizeIndex = 0;

const applySize = () => {
  body.classList.remove('text-larger', 'text-largest');
  if (sizeLevels[sizeIndex]) {
    body.classList.add(sizeLevels[sizeIndex]);
  }
};

const increaseBtn = document.getElementById('increaseText');
const decreaseBtn = document.getElementById('decreaseText');
const resetBtn = document.getElementById('resetText');

if (increaseBtn) {
  increaseBtn.addEventListener('click', () => {
    sizeIndex = Math.min(sizeIndex + 1, sizeLevels.length - 1);
    applySize();
  });
}
if (decreaseBtn) {
  decreaseBtn.addEventListener('click', () => {
    sizeIndex = Math.max(sizeIndex - 1, 0);
    applySize();
  });
}
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    sizeIndex = 0;
    applySize();
  });
}

/* ---------- Animated counters (trigger on scroll into view) ---------- */
const counters = document.querySelectorAll('.counter');

const runCounter = (counter) => {
  const target = +counter.getAttribute('data-target');
  const updateCounter = () => {
    const current = +counter.innerText;
    const increment = target / 100 || 1;
    if (current < target) {
      counter.innerText = Math.ceil(current + increment);
      setTimeout(updateCounter, 20);
    } else {
      counter.innerText = target;
    }
  };
  updateCounter();
};

if (counters.length) {
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    counters.forEach((c) => { c.innerText = c.getAttribute('data-target'); });
  } else {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => counterObserver.observe(c));
  }
}

/* ---------- Reveal-on-scroll for trail items and cards ---------- */
const revealTargets = document.querySelectorAll(
  '.trail-item, .legend-card, .stat-card, .dataset-card, .gallery-grid figure'
);

revealTargets.forEach((el) => el.classList.add('reveal'));

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach((el) => revealObserver.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('in-view'));
}

/* ---------- Scrollspy: highlight active nav link ---------- */
const navLinks = document.querySelectorAll('.nav-link');
const sections = Array.from(navLinks)
  .map((link) => document.getElementById(link.dataset.section))
  .filter(Boolean);

if (sections.length && 'IntersectionObserver' in window) {
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach((section) => spyObserver.observe(section));
}
