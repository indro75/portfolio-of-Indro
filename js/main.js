/* ═══════════ INDROJIT SANA — main.js ═══════════ */
'use strict';

/* ---------- Toast ---------- */
const toastEl = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}
window.showToast = showToast;

/* ---------- Nav scroll state + mobile menu ---------- */
const nav = document.getElementById('topnav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.addEventListener('click', e => {
  if (e.target.tagName === 'A') { hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); }
});

/* ---------- Typewriter ---------- */
const roles = [
  'Competitive Programmer',
  'Full-Stack Developer',
  'CSE @ NUBT ’27',
  'React · Next.js · Node',
  'Open to Internships'
];
const twEl = document.getElementById('typewriter');
let roleIdx = 0, charIdx = 0, deleting = false;
function typeStep() {
  const full = roles[roleIdx];
  twEl.textContent = full.slice(0, charIdx);
  let delay = deleting ? 28 : 62;
  if (!deleting && charIdx < full.length) charIdx++;
  else if (!deleting && charIdx === full.length) { deleting = true; delay = 1700; }
  else if (deleting && charIdx > 0) charIdx--;
  else { deleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 350; }
  setTimeout(typeStep, delay);
}
if (twEl) typeStep();

/* ---------- Animated counters (IntersectionObserver) ---------- */
const counters = document.querySelectorAll('[data-target]');
const counterIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const dur = 1600, start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(target * (p === 1 ? 1 : eased)) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    counterIO.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach(el => counterIO.observe(el));

/* ---------- CP bar fills ---------- */
const bars = document.querySelectorAll('.cp-bar-fill');
const barIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.width + '%';
      barIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
bars.forEach(b => barIO.observe(b));

/* ---------- Reveal on scroll ---------- */
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealIO.unobserve(entry.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));
/* safety net: never leave content hidden if the observer can't fire */
setTimeout(() => document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible')), 1500);

/* ---------- Project card tilt + glow ---------- */
const fine = window.matchMedia('(pointer: fine)').matches;
if (fine) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.transform = `rotateY(${(px - 0.5) * 10}deg) rotateX(${(0.5 - py) * 10}deg) translateY(-4px)`;
      card.style.setProperty('--gx', (px * r.width) + 'px');
      card.style.setProperty('--gy', (py * r.height) + 'px');
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ---------- Copy email ---------- */
const copyBtn = document.getElementById('copyEmailBtn');
const copyLabel = document.getElementById('copyEmailLabel');
const EMAIL = 'indro3311@gmail.com';
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(EMAIL);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = EMAIL; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch {}
    ta.remove();
  }
  if (copyLabel) copyLabel.textContent = 'copied ✓';
  showToast('email copied to clipboard');
  setTimeout(() => { if (copyLabel) copyLabel.textContent = EMAIL; }, 2200);
}
if (copyBtn) copyBtn.addEventListener('click', copyEmail);

/* ---------- Footer year ---------- */
document.getElementById('footerYear').textContent = new Date().getFullYear();

/* ---------- Hero: matrix-style code rain ---------- */
(function codeRain() {
  const canvas = document.getElementById('rainCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const glyphs = '01{}();<>/=+-*&|:.#$%λΣπ=>fn';
  const fontSize = 15;
  let cols, drops, W, H;
  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    cols = Math.floor(W / fontSize);
    drops = Array.from({ length: cols }, () => Math.random() * -60);
  }
  resize();
  window.addEventListener('resize', resize);
  let last = 0;
  function frame(t) {
    requestAnimationFrame(frame);
    if (t - last < 55) return; // throttle to ~18fps
    last = t;
    ctx.fillStyle = 'rgba(11,15,23,0.16)';
    ctx.fillRect(0, 0, W, H);
    ctx.font = fontSize + 'px "JetBrains Mono", monospace';
    for (let i = 0; i < cols; i++) {
      const ch = glyphs[(Math.random() * glyphs.length) | 0];
      const x = i * fontSize, y = drops[i] * fontSize;
      const head = Math.random() < 0.045;
      ctx.fillStyle = head ? '#a7f3d0' : '#0e5c3f';
      ctx.fillText(ch, x, y);
      if (y > H && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.55;
    }
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(frame);
})();

/* ---------- Contact: drifting dot grid ---------- */
(function dotGrid() {
  const canvas = document.getElementById('gridCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);
  let t = 0;
  function frame() {
    requestAnimationFrame(frame);
    t += 0.012;
    ctx.clearRect(0, 0, W, H);
    const gap = 46;
    for (let x = gap / 2; x < W; x += gap) {
      for (let y = gap / 2; y < H; y += gap) {
        const wave = Math.sin(t + x * 0.012 + y * 0.012) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(x, y, 1 + wave * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 160, ${0.05 + wave * 0.22})`;
        ctx.fill();
      }
    }
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) frame();
})();
