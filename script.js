const progress = document.getElementById('progress');
const currentSlide = document.getElementById('currentSlide');
const slides = [...document.querySelectorAll('.slide')];
const navDots = [...document.querySelectorAll('.nav-dot')];
const overview = document.getElementById('overview');
const overviewGrid = document.getElementById('overviewGrid');

const slideTitles = [
  ['01','Information Security','Introduction'],
  ['02','What is information security?','The big picture'],
  ['03','The CIA triad','Core framework'],
  ['04','The threat landscape','Know the risks'],
  ['05','The human factor','Human-centered security'],
  ['06','Layers of protection','Build the defense'],
  ['07','Access should be earned','Identity & access'],
  ['08','Encryption & data privacy','Protect information'],
  ['09','Backups & recovery','Resilience'],
  ['10','When incidents happen','Incident response'],
  ['11','Everyday security checklist','Good habits'],
  ['12',"Everyone's responsibility",'Takeaway']
];

slideTitles.forEach((item, index) => {
  const card = document.createElement('button');
  card.className = 'overview-card';
  card.innerHTML = `<span>${item[0]} / 12</span><strong>${item[1]}</strong><small>${item[2].toUpperCase()}</small>`;
  card.addEventListener('click', () => {
    overview.classList.remove('open');
    overview.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.querySelector(`#slide-${index + 1}`).scrollIntoView({behavior:'smooth'});
  });
  overviewGrid.appendChild(card);
});

function openOverview() {
  overview.classList.add('open');
  overview.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeOverview() {
  overview.classList.remove('open');
  overview.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
document.getElementById('overviewBtn').addEventListener('click', openOverview);
document.getElementById('closeOverview').addEventListener('click', closeOverview);
overview.addEventListener('click', e => { if (e.target === overview) closeOverview(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeOverview();
  if (overview.classList.contains('open')) return;
  const current = Math.max(0, slides.findIndex(s => s.classList.contains('is-current')));
  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    e.preventDefault(); slides[Math.min(current + 1, slides.length - 1)].scrollIntoView({behavior:'smooth'});
  }
  if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault(); slides[Math.max(current - 1, 0)].scrollIntoView({behavior:'smooth'});
  }
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold: 0.12, rootMargin: '0px 0px -4% 0px'});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const slideObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const index = slides.indexOf(entry.target);
      slides.forEach(s => s.classList.remove('is-current'));
      entry.target.classList.add('is-current');
      currentSlide.textContent = String(index + 1).padStart(2, '0');
      navDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }
  });
}, {threshold: 0.45});
slides.forEach(s => slideObserver.observe(s));

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const value = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${Math.min(100, Math.max(0, value))}%`;
}
window.addEventListener('scroll', updateProgress, {passive:true});
window.addEventListener('resize', updateProgress);
updateProgress();

const checks = [...document.querySelectorAll('.check-row input')];
const checkCount = document.getElementById('checkCount');
const checkProgress = document.getElementById('checkProgress');
function updateChecks() {
  const count = checks.filter(c => c.checked).length;
  checkCount.textContent = `${count} / ${checks.length}`;
  checkProgress.style.width = `${count / checks.length * 100}%`;
}
checks.forEach(c => c.addEventListener('change', updateChecks));

/* Gentle image parallax, disabled for reduced-motion users */
const imageBackdrop = document.querySelector('.image-backdrop');
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && imageBackdrop) {
  window.addEventListener('scroll', () => {
    const section = document.querySelector('#slide-5');
    const rect = section.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const offset = (window.innerHeight - rect.top) * 0.035;
      imageBackdrop.style.transform = `scale(1.08) translateY(${offset}px)`;
    }
  }, {passive:true});
}
