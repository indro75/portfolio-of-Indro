/* ═══════════ Live playground — playground.js ═══════════ */
'use strict';

const codeArea = document.getElementById('playgroundCode');
const frame = document.getElementById('playgroundFrame');
if (codeArea && frame) {
  const presetSelect = document.getElementById('presetSelect');
  const runBtn = document.getElementById('runBtn');
  const resetBtn = document.getElementById('resetBtn');

  const PRESETS = {
    clock: `<!-- a tiny live clock -->
<style>
  body { margin: 0; height: 100vh; display: grid; place-items: center;
         background: #0b0f17; color: #00e5a0; font-family: monospace; }
  .clock { font-size: 3rem; letter-spacing: .1em; text-shadow: 0 0 24px #00e5a0aa; }
  .label { font-size: .7rem; color: #22d3ee; text-align: center; margin-top: .5rem; }
</style>
<div class="clock" id="t">00:00:00</div>
<div class="label">live · javascript</div>
<script>
  const tick = () => { document.getElementById('t').textContent = new Date().toLocaleTimeString(); };
  tick(); setInterval(tick, 1000);
<\/script>`,
    button: `<!-- neon pulse button -->
<style>
  body { margin: 0; height: 100vh; display: grid; place-items: center; background: #0b0f17; }
  button {
    font-family: monospace; font-size: 1.1rem; color: #04140c; cursor: pointer;
    background: linear-gradient(115deg, #00e5a0, #22d3ee); border: none;
    padding: 1rem 2.2rem; border-radius: 14px; font-weight: 700;
    box-shadow: 0 0 30px #00e5a066;
    animation: pulse 1.6s ease-in-out infinite; transition: transform .15s;
  }
  button:hover { transform: scale(1.08); }
  button:active { transform: scale(.95); }
  @keyframes pulse { 0%,100% { box-shadow: 0 0 22px #00e5a055; } 50% { box-shadow: 0 0 48px #22d3ee99; } }
</style>
<button onclick="this.textContent = 'shipped ✦'">deploy_me()</button>`,
    card: `<!-- gradient glass card -->
<style>
  body { margin: 0; height: 100vh; display: grid; place-items: center;
         background: radial-gradient(circle at 30% 20%, #1b2735, #0b0f17); font-family: sans-serif; }
  .card {
    width: 240px; padding: 1.4rem; border-radius: 18px; color: #fff;
    background: linear-gradient(150deg, #8b5cf6cc, #00e5a055);
    border: 1px solid #ffffff33; backdrop-filter: blur(6px);
    box-shadow: 0 20px 60px #00000088; transition: transform .3s;
  }
  .card:hover { transform: translateY(-10px) rotate(-1deg); }
  h2 { margin: 0 0 .3rem; font-size: 1.3rem; } p { margin: 0; opacity: .8; font-size: .85rem; }
</style>
<div class="card">
  <h2>🚀 Hello, World!</h2>
  <p>Built by indro101 — hover me. Edit anything, it runs live.</p>
</div>`
  };

  function run() {
    frame.srcdoc = codeArea.value;
  }

  function loadPreset(name) {
    codeArea.value = PRESETS[name] || PRESETS.clock;
    run();
  }

  let debounce;
  codeArea.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(run, 700);
  });
  // Ctrl/Cmd + Enter runs immediately
  codeArea.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); if (window.showToast) window.showToast('▶ executed'); }
    // real tabs inside the textarea
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = codeArea.selectionStart, epos = codeArea.selectionEnd;
      codeArea.setRangeText('  ', s, epos, 'end');
      codeArea.dispatchEvent(new Event('input'));
    }
  });

  presetSelect.addEventListener('change', () => loadPreset(presetSelect.value));
  runBtn.addEventListener('click', run);
  resetBtn.addEventListener('click', () => loadPreset(presetSelect.value));

  loadPreset('clock');
}
