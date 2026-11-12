/* ═══════════ Interactive terminal — terminal.js ═══════════ */
'use strict';

const termBody = document.getElementById('termBody');
const termOut = document.getElementById('termOut');
const termInput = document.getElementById('termInput');
const termClear = document.getElementById('termClear');
if (termBody && termInput) {
  const EMAIL = 'indro3311@gmail.com';
  const history = [];
  let histIdx = -1;

  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const link = (href, text) => `<a href="${href}" target="_blank" rel="noopener" style="color:#22d3ee;text-decoration:underline">${esc(text)}</a>`;

  const commands = {
    help: () => `<span class="term-accent">available commands:</span>
  <span class="term-ok">whoami</span>      who is this guy
  <span class="term-ok">about</span>       the story so far
  <span class="term-ok">skills</span>      things I wield
  <span class="term-ok">stats</span>       competitive programming numbers
  <span class="term-ok">projects</span>    featured builds
  <span class="term-ok">email</span>       get my email (click to copy)
  <span class="term-ok">github</span>      github.com/indro75
  <span class="term-ok">linkedin</span>    linkedin profile
  <span class="term-ok">resume</span>      open my online CV
  <span class="term-ok">sudo hire-me</span> elevated privileges granted
  <span class="term-ok">clear</span>       wipe the screen`,
    whoami: () => `<span class="term-accent">indrojit sana</span> — cse @ nubt (’27)
competitive programmer · full-stack developer
currently hunting software engineering internships ✦`,
    about: () => `started with <span class="term-ok">Hello, World!</span> in C++ and never stopped.
by day: competitive programming, chasing the next rating point.
by night: React / Next.js / Node / PHP — turning algorithms into
products people actually use.`,
    skills: () => `languages : c++ · python · javascript · php · java · sql · c
web       : react · next.js · tailwind · node · express · mongodb · mysql
tools/cp  : git · linux · dsa · algorithms · system design`,
    stats: () => `codeforces  @indro101 → max rating <span class="term-ok">1017</span> · 100+ solved
codechef    @indro101 → contest rating <span class="term-ok">1295</span> · 1200+ solved
leetcode    @indro101 → max rating <span class="term-ok">1489</span> · 20+ solved
${link('https://codeforces.com/profile/indro101', '↳ verify on codeforces')}`,
    projects: () => `<span class="term-accent">01</span> webos            web-based os · html/css/js
<span class="term-accent">02</span> smart-residence  tenant platform · php/mysql
<span class="term-accent">03</span> tutormatch        p2p campus tutoring · php/mysql/js
${link('https://github.com/indro75', '↳ all repos on github')}`,
    email: () => `<button class="term-copy" id="termCopyEmail" style="background:rgba(0,229,160,.12);border:1px solid rgba(0,229,160,.4);color:#00e5a0;border-radius:6px;padding:.15rem .6rem;font-family:inherit;cursor:pointer">${EMAIL} ⧉</button>`,
    github: () => link('https://github.com/indro75', 'opening github.com/indro75 →'),
    linkedin: () => link('https://www.linkedin.com/in/indro101/', 'opening linkedin.com/in/indro101 →'),
    codeforces: () => link('https://codeforces.com/profile/indro101', 'opening codeforces profile →'),
    resume: () => { window.open('cv.html', '_blank'); return '<span class="term-ok">opening cv.html…</span>'; },
    ls: () => 'home/  about/  skills/  cp-stats/  projects/  lab/  contact/',
    date: () => new Date().toString(),
    echo: args => esc(args.join(' ')) || '',
    coffee: () => '<span class="term-warn">brewing…</span> ▄︻̷̿┻̿═━ ( ☕ ) — caffeine level: optimal',
    sudo: args => {
      const sub = (args[0] || '').toLowerCase();
      if (sub === 'hire-me') {
        setTimeout(() => { window.location.href = 'mailto:' + EMAIL + '?subject=Let%27s%20work%20together'; }, 900);
        return '<span class="term-ok">[sudo] password accepted.</span>\npermission granted — opening mail client…';
      }
      return '<span class="term-err">sudo:</span> only `hire-me` is a valid target. nice try though.';
    },
    rm: () => '<span class="term-err">rm: permission denied</span> — this portfolio is read-only. (and backed up on github pages, so nice luck)',
    clear: () => { termOut.innerHTML = ''; return null; }
  };
  // alias easter eggs
  commands['hire-me'] = () => commands.sudo(['hire-me']);
  commands['vim'] = () => '<span class="term-warn">you are already inside vim. (there is no escape)</span>';

  function printLine(html, cls) {
    const div = document.createElement('div');
    div.className = 'term-line ' + (cls || 'term-res');
    div.innerHTML = html;
    termOut.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
  }
  function printRaw(html) {
    const div = document.createElement('div');
    div.className = 'term-line term-res';
    div.innerHTML = html;
    termOut.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function runCommand(raw) {
    const line = raw.trim();
    if (!line) return;
    history.push(line);
    histIdx = history.length;
    printLine('<span class="term-prompt">visitor@indro101:~$</span> <span class="term-cmd">' + esc(line) + '</span>', '');
    const parts = line.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    const fn = commands[cmd];
    if (fn) {
      const out = fn(args);
      if (out !== null && out !== undefined) printRaw(out);
    } else {
      printLine(`<span class="term-err">command not found: ${esc(cmd)}</span> — try <span class="term-accent">help</span>`);
    }
    // wire up dynamic copy button
    const copyBtn = document.getElementById('termCopyEmail');
    if (copyBtn) copyBtn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(EMAIL); } catch {}
      copyBtn.textContent = EMAIL + ' ✓ copied';
      if (window.showToast) window.showToast('email copied to clipboard');
    });
  }

  termInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const v = termInput.value;
      termInput.value = '';
      runCommand(v);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx > 0) { histIdx--; termInput.value = history[histIdx]; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx < history.length - 1) { histIdx++; termInput.value = history[histIdx]; } else { histIdx = history.length; termInput.value = ''; }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const v = termInput.value.trim().toLowerCase();
      const match = Object.keys(commands).find(c => c.startsWith(v));
      if (match) termInput.value = match;
    }
  });

  termBody.addEventListener('click', () => termInput.focus());
  termClear.addEventListener('click', () => { termOut.innerHTML = ''; termInput.focus(); });
  document.querySelectorAll('.hint-cmd').forEach(btn => {
    btn.addEventListener('click', () => { runCommand(btn.dataset.cmd); termInput.focus(); });
  });

  // boot sequence
  printLine('<span class="term-ok">last login:</span> ' + new Date().toDateString() + ' on ttys001', '');
  printLine('type <span class="term-accent">help</span> to see what I can do_');
}
