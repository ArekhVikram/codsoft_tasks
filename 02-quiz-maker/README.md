# Cubiq — Online Quiz Maker (CODSOFT Task: Online Quiz Maker, Level 2)

Open `index.html` by double-clicking it (after extracting the zip). One self-contained file, plain HTML/CSS/JavaScript, no install.

## Features
- Dashboard with real stats, featured quizzes and recent attempts
- Create, edit, delete and reorder questions (four choices each, correct answer, optional explanation), with validation and preview
- Quiz list with search by title and category/difficulty filters, plus empty states
- Quiz player: one question at a time, confirm-then-feedback, progress bar, optional 20-second timer
- Results: score, percentage, animated ring and a question-by-question review, with Retry and Return actions
- Three sample quizzes, labelled "Sample" and read-only. Your own quizzes are labelled "Yours"
- Guest mode only: data is saved in this browser (`localStorage`), with no accounts and no server

## Deploy
Static site: drag the folder into Netlify or Vercel, or enable GitHub Pages.

## React version
`react-version/` contains an alternative React + Vite implementation (needs Node.js: `npm install && npm run dev`). It has not been run in a browser.
