/* ═══════════ Algorithm visualizer — visualizer.js ═══════════ */
'use strict';

const canvas = document.getElementById('sortCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const cmpEl = document.getElementById('cmpCount');
  const swapEl = document.getElementById('swapCount');
  const statusEl = document.getElementById('sortStatus');
  const speedRange = document.getElementById('speedRange');
  const shuffleBtn = document.getElementById('shuffleBtn');
  const sortBtn = document.getElementById('sortBtn');
  const algoBtns = [...document.querySelectorAll('.algo-btn')];

  const N = 44;
  let arr = [];
  let colors = [];        // per-bar state: 'idle' | 'compare' | 'swap' | 'pivot' | 'done'
  let algo = 'bubble';
  let sorting = false;
  let cmps = 0, swaps = 0;

  const COLOR = {
    idle: '#1f6f54',
    compare: '#fbbf24',
    swap: '#f87171',
    pivot: '#a78bfa',
    done: '#00e5a0'
  };

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function shuffle() {
    if (sorting) return;
    arr = Array.from({ length: N }, () => 8 + Math.random() * 92);
    colors = Array(N).fill('idle');
    cmps = 0; swaps = 0;
    updateStats();
    setStatus('idle');
    draw();
  }

  function setStatus(txt, done) {
    statusEl.textContent = txt;
    statusEl.classList.toggle('done', !!done);
  }
  function updateStats() {
    cmpEl.textContent = cmps;
    swapEl.textContent = swaps;
  }
  const delay = () => Math.max(3, Math.round(160 - (+speedRange.value / 100) * 157));
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function draw() {
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    ctx.clearRect(0, 0, W, H);
    const barW = W / N;
    for (let i = 0; i < N; i++) {
      const h = (arr[i] / 100) * (H - 14);
      const x = i * barW, y = H - h;
      ctx.fillStyle = COLOR[colors[i]] || COLOR.idle;
      ctx.beginPath();
      const r = Math.min(3, barW / 3);
      ctx.roundRect ? ctx.roundRect(x + 1, y, Math.max(barW - 2, 1), h, [r, r, 0, 0]) : ctx.rect(x + 1, y, Math.max(barW - 2, 1), h);
      ctx.fill();
    }
  }

  function lockUI(lock) {
    sorting = lock;
    sortBtn.disabled = lock;
    shuffleBtn.disabled = lock;
    algoBtns.forEach(b => b.disabled = lock);
    sortBtn.textContent = lock ? 'sorting…' : 'Sort! ▶';
  }

  async function markDone() {
    for (let i = 0; i < N; i++) {
      colors[i] = 'done';
      draw();
      await sleep(12);
    }
    setStatus('sorted ✓', true);
  }

  async function compare(i, j) {
    cmps++;
    colors[i] = 'compare'; colors[j] = 'compare';
    updateStats(); draw();
    await sleep(delay());
  }
  async function swap(i, j) {
    swaps++;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    colors[i] = 'swap'; colors[j] = 'swap';
    updateStats(); draw();
    await sleep(delay());
  }
  function resetMarks(i, j) {
    if (colors[i] !== 'done') colors[i] = 'idle';
    if (colors[j] !== 'done') colors[j] = 'idle';
  }

  /* ---- algorithms (all async, step-delayed) ---- */
  async function bubbleSort() {
    for (let i = 0; i < N - 1; i++) {
      for (let j = 0; j < N - 1 - i; j++) {
        await compare(j, j + 1);
        if (arr[j] > arr[j + 1]) await swap(j, j + 1);
        resetMarks(j, j + 1);
      }
      colors[N - 1 - i] = 'done'; draw();
    }
    colors[0] = 'done';
  }
  async function selectionSort() {
    for (let i = 0; i < N; i++) {
      let min = i;
      for (let j = i + 1; j < N; j++) {
        await compare(min, j);
        if (arr[j] < arr[min]) { colors[min] = 'idle'; min = j; }
        if (colors[j] !== 'done') colors[j] = 'idle';
      }
      if (min !== i) await swap(i, min);
      colors[i] = 'done'; draw();
    }
  }
  async function insertionSort() {
    colors[0] = 'done';
    for (let i = 1; i < N; i++) {
      let key = arr[i], j = i - 1;
      colors[i] = 'swap'; draw(); await sleep(delay());
      while (j >= 0) {
        await compare(j, j + 1);
        if (arr[j] > key) {
          arr[j + 1] = arr[j]; swaps++;
          colors[j] = 'swap'; colors[j + 1] = 'compare';
          updateStats(); draw(); await sleep(delay());
          colors[j] = 'idle'; colors[j + 1] = 'idle';
          j--;
        } else { resetMarks(j, j + 1); break; }
      }
      arr[j + 1] = key;
      for (let k = 0; k <= i; k++) colors[k] = 'done';
      draw();
    }
  }
  async function mergeSort() {
    async function merge(l, m, r) {
      const L = arr.slice(l, m + 1), R = arr.slice(m + 1, r + 1);
      let i = 0, j = 0, k = l;
      while (i < L.length && j < R.length) {
        await compare(k, k); // counts comparison, highlights write position
        if (L[i] <= R[j]) arr[k] = L[i++]; else arr[k] = R[j++];
        swaps++;
        colors[k] = 'swap'; updateStats(); draw(); await sleep(delay());
        colors[k] = 'idle';
        k++;
      }
      while (i < L.length) { arr[k] = L[i++]; colors[k] = 'swap'; draw(); await sleep(delay()); colors[k] = 'idle'; k++; }
      while (j < R.length) { arr[k] = R[j++]; colors[k] = 'swap'; draw(); await sleep(delay()); colors[k] = 'idle'; k++; }
    }
    async function sort(l, r) {
      if (l >= r) return;
      const m = (l + r) >> 1;
      await sort(l, m);
      await sort(m + 1, r);
      await merge(l, m, r);
    }
    await sort(0, N - 1);
  }
  async function quickSort() {
    async function partition(lo, hi) {
      const pivot = arr[hi];
      colors[hi] = 'pivot'; draw();
      let i = lo;
      for (let j = lo; j < hi; j++) {
        await compare(j, hi);
        if (arr[j] < pivot) {
          if (i !== j) await swap(i, j);
          resetMarks(i, j);
          i++;
        } else resetMarks(j, hi);
      }
      [arr[i], arr[hi]] = [arr[hi], arr[i]]; swaps++;
      colors[hi] = 'idle'; colors[i] = 'done';
      updateStats(); draw();
      return i;
    }
    async function sort(lo, hi) {
      if (lo >= hi) { if (lo === hi) colors[lo] = 'done'; return; }
      const p = await partition(lo, hi);
      await sort(lo, p - 1);
      await sort(p + 1, hi);
    }
    await sort(0, N - 1);
  }

  const ALGOS = { bubble: bubbleSort, selection: selectionSort, insertion: insertionSort, merge: mergeSort, quick: quickSort };

  async function start() {
    if (sorting) return;
    lockUI(true);
    cmps = 0; swaps = 0;
    colors = Array(N).fill('idle');
    updateStats();
    setStatus('sorting…');
    try {
      await ALGOS[algo]();
      await markDone();
    } catch (err) {
      setStatus('interrupted');
    }
    lockUI(false);
  }

  algoBtns.forEach(btn => btn.addEventListener('click', () => {
    if (sorting) return;
    algo = btn.dataset.algo;
    algoBtns.forEach(b => b.classList.toggle('active', b === btn));
  }));
  shuffleBtn.addEventListener('click', shuffle);
  sortBtn.addEventListener('click', start);
  window.addEventListener('resize', resizeCanvas);

  resizeCanvas();
  shuffle();
}
