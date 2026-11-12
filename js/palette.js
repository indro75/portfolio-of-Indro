(function () {
/* ═══════════ Command palette (Ctrl/Cmd + K) — palette.js ═══════════ */
'use strict';

const overlay = document.getElementById('paletteOverlay');
const input = document.getElementById('paletteInput');
const list = document.getElementById('paletteList');
const openBtn = document.getElementById('openPalette');

const EMAIL = 'indro3311@gmail.com';
const ACTIONS = [
  { icon: '⌂', name: 'Go to Home', hint: '#home', run: () => scrollToId('#home'), keys: 'nav home' },
  { icon: '◉', name: 'Go to About', hint: '#about', run: () => scrollToId('#about'), keys: 'nav about who' },
  { icon: '⚒', name: 'Go to Skills', hint: '#skills', run: () => scrollToId('#skills'), keys: 'nav skills stack arsenal' },
  { icon: '▲', name: 'Go to CP Stats', hint: '#cp', run: () => scrollToId('#cp'), keys: 'nav cp codeforces codechef leetcode rating' },
  { icon: '▤', name: 'Go to Projects', hint: '#projects', run: () => scrollToId('#projects'), keys: 'nav projects webos tutormatch smart residence' },
  { icon: '⚗', name: 'Go to The Lab', hint: '#lab', run: () => scrollToId('#lab'), keys: 'nav lab visualizer playground sort' },
  { icon: '✉', name: 'Go to Contact', hint: '#contact', run: () => scrollToId('#contact'), keys: 'nav contact hire' },
  { icon: '⧉', name: 'Copy email address', hint: 'indro3311@gmail.com', run: copyEmailPalette, keys: 'copy mail email' },
  { icon: '⌘', name: 'Open GitHub', hint: 'github.com/indro75', run: () => window.open('https://github.com/indro75', '_blank', 'noopener'), keys: 'github repos code' },
  { icon: 'in', name: 'Open LinkedIn', hint: 'linkedin.com/in/indro101', run: () => window.open('https://www.linkedin.com/in/indro101/', '_blank', 'noopener'), keys: 'linkedin connect' },
  { icon: '⚐', name: 'Open Codeforces profile', hint: 'codeforces.com/profile/indro101', run: () => window.open('https://codeforces.com/profile/indro101', '_blank', 'noopener'), keys: 'codeforces cf contests' },
  { icon: '★', name: 'Open Résumé (online CV)', hint: 'cv.html', run: () => window.open('cv.html', '_blank', 'noopener'), keys: 'resume cv pdf download online' },
  { icon: '✉', name: 'Hire me — send email', hint: 'mailto', run: () => { window.location.href = 'mailto:' + EMAIL + '?subject=Opportunity%20for%20Indrojit'; }, keys: 'hire job offer internship' }
];

function scrollToId(sel) { const el = document.querySelector(sel); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
async function copyEmailPalette() {
  try { await navigator.clipboard.writeText(EMAIL); } catch {}
  if (window.showToast) window.showToast('email copied to clipboard');
}

let filtered = [...ACTIONS];
let activeIdx = 0;

function render() {
  if (!filtered.length) {
    list.innerHTML = '<li class="palette-empty">no matches — try "skills", "projects" or "hire"</li>';
    return;
  }
  list.innerHTML = filtered.map((a, i) => `
    <li class="palette-item${i === activeIdx ? ' active' : ''}" role="option" data-idx="${i}">
      <span class="p-icon">${a.icon}</span>
      <span class="p-name">${a.name}</span>
      <span class="p-hint">${a.hint}</span>
    </li>`).join('');
}

function applyFilter() {
  const q = input.value.trim().toLowerCase();
  filtered = !q ? [...ACTIONS] : ACTIONS.filter(a => (a.name + ' ' + a.keys + ' ' + a.hint).toLowerCase().includes(q));
  activeIdx = 0;
  render();
}

function openPalette() {
  overlay.hidden = false;
  input.value = '';
  applyFilter();
  requestAnimationFrame(() => input.focus());
}
function closePalette() { overlay.hidden = true; }
function runActive() {
  const action = filtered[activeIdx];
  if (!action) return;
  closePalette();
  action.run();
}

openBtn.addEventListener('click', openPalette);
input.addEventListener('input', applyFilter);
list.addEventListener('click', e => {
  const item = e.target.closest('.palette-item');
  if (!item) return;
  activeIdx = +item.dataset.idx;
  runActive();
});
list.addEventListener('mousemove', e => {
  const item = e.target.closest('.palette-item');
  if (item && +item.dataset.idx !== activeIdx) { activeIdx = +item.dataset.idx; render(); }
});
overlay.addEventListener('click', e => { if (e.target === overlay) closePalette(); });

document.addEventListener('keydown', e => {
  const mod = e.ctrlKey || e.metaKey;
  if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); overlay.hidden ? openPalette() : closePalette(); return; }
  if (overlay.hidden) return;
  if (e.key === 'Escape') { closePalette(); return; }
  if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, filtered.length - 1); render(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); render(); }
  else if (e.key === 'Enter') { e.preventDefault(); runActive(); }
});

})();
