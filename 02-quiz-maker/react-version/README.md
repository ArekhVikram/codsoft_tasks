# Cubiq (React + Vite version)

Alternative implementation of the quiz maker. The main, ready-to-open version is `../index.html`.
This one needs Node.js 18+ and has not been run in a browser.

```bash
npm install
npm run dev        # development server (open the printed http://localhost address)
npm run build      # production build in dist/
```
Opening this folder's `index.html` directly shows a blank page by design: Vite must serve it.

Deploy to Vercel: import the repo, set the root directory to `02-quiz-maker/react-version`, framework preset Vite, build `npm run build`, output `dist`.
