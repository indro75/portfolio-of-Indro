# indro101 — Portfolio

Personal portfolio of **Indrojit Sana** (@indro101) — competitive programmer & full-stack developer.

Static site · vanilla HTML/CSS/JS · no build step.

## Features / interactions

- 🌧 Canvas **code rain** hero background + drifting dot-grid contact section
- 📄 **`cv.html`** — online résumé page, print-friendly (Print → Save as PDF gives a clean one-pager)
- ⌨️ Working **in-browser terminal** (`help`, `whoami`, `stats`, `sudo hire-me`, arrow-key history, tab-completion)
- ⌘ **Command palette** — `Ctrl/Cmd + K`, fuzzy filter, keyboard navigation
- 🧮 **Algorithm visualizer** — bubble / selection / insertion / merge / quick sort with live comparison & swap counters
- ⚡ **Live playground** — sandboxed iframe, edit HTML/CSS/JS, runs instantly (`Ctrl/Cmd + Enter`)
- 📊 Animated CP stat counters (Codeforces / CodeChef / LeetCode)
- 🃏 3D **tilt project cards** with cursor-tracked glow
- ✍️ Typewriter role rotator, copy-to-clipboard email, reveal-on-scroll, mobile hamburger nav

## Run locally

Just open `index.html`, or serve it:

```bash
python -m http.server 8000
# → http://localhost:8000
```

## Deploy (GitHub Pages)

Push to a repo → **Settings → Pages → Deploy from branch** → `main` / root. Done.

> Notes:
> - The hero and `cv.html` reference the images in `assets/` (`img-0.jpg`, `myPic.png`). See `assets/README.md`.
> - Résumé links on the site (About button, `resume` terminal command, Ctrl+K palette) all open `cv.html`.
