# ROBO.DANCE

Hilarious meme website with a high-quality dancing robot.

## Features
- Live dance stage (groove / spin / break / vibe)
- Meme forge — caption, download PNG, post to wall
- Reaction buttons + chaos meter
- Local meme wall (stored in your browser)

## Live
https://billyx86.github.io/robo-dance/

## Run it locally
The site is a plain static app (no build step). Any static server works:

```sh
# from the repo root
python3 -m http.server 8000
# or
npx serve .
```

Then open http://localhost:8000/

## Structure
- `index.html` — markup + inline styles
- `app.js` — ES module entry point (wiring/DOM)
- `lib/chaos.js` — chaos meter logic (pure, unit-tested)
- `lib/wall.js` — meme-wall capping/seeding/quota-shrinking (pure, unit-tested)
- `lib/meme.js` — meme data tables + text wrapping (pure, unit-tested)
- `tests/` — vitest unit tests for the `lib/` modules

## Tests
```sh
npm install
npm test
```

CI (`.github/workflows/test.yml`) runs the suite on every push and PR.
`.github/workflows/pages.yml` deploys the site to GitHub Pages on `main`.
