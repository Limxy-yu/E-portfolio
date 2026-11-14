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

document.getElementById('increaseText')?.addEventListener('click', () => {
  sizeIndex = Math.min(sizeIndex + 1, sizeLevels.length - 1);
  applySize();
});
document.getElementById('decreaseText')?.addEventListener('click', () => {
  sizeIndex = Math.max(sizeIndex - 1, 0);
  applySize();
});
document.getElementById('resetText')?.addEventListener('click', () => {
  sizeIndex = 0;
  applySize();
});

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
  }, { rootMargin: '-40% 0px -45% 0px', threshold: 0 });

  sections.forEach((section) => spyObserver.observe(section));
}

/* ---------- Weekly Logbook Accordion & Phase Filter ---------- */
const weekCards = document.querySelectorAll('.week-card');
weekCards.forEach((card) => {
  const header = card.querySelector('.week-header');
  header?.addEventListener('click', () => {
    card.classList.toggle('open');
  });
});

document.getElementById('expandAllWeeks')?.addEventListener('click', () => {
  weekCards.forEach((c) => {
    if (!c.classList.contains('hidden')) c.classList.add('open');
  });
});

document.getElementById('collapseAllWeeks')?.addEventListener('click', () => {
  weekCards.forEach((c) => c.classList.remove('open'));
});

const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const phase = btn.dataset.phase;
    weekCards.forEach((card) => {
      if (phase === 'all' || card.dataset.phase === phase) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ---------- 1-Click PDF Document Preview Modal ---------- */
const docModal = document.getElementById('docModal');
const docModalTitle = document.getElementById('docModalTitle');
const docModalFrame = document.getElementById('docModalFrame');
const docModalNewTab = document.getElementById('docModalNewTab');

window.openDocModal = function(pdfPath, title) {
  if (!docModal) return;
  docModalTitle.textContent = title;
  docModalFrame.src = pdfPath;
  docModalNewTab.href = pdfPath;
  docModal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeDocModal = function() {
  if (!docModal) return;
  docModal.classList.remove('active');
  docModalFrame.src = '';
  document.body.style.overflow = '';
};

/* ---------- 1-Click Image Lightbox Modal ---------- */
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

window.openLightbox = function(imgSrc, captionText) {
  if (!lightboxModal) return;
  lightboxImg.src = imgSrc;
  lightboxImg.alt = captionText;
  lightboxCaption.textContent = captionText;
  lightboxModal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = function() {
  if (!lightboxModal) return;
  lightboxModal.classList.remove('active');
  lightboxImg.src = '';
  document.body.style.overflow = '';
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeDocModal();
    window.closeLightbox();
  }
});
