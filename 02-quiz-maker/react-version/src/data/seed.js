// Sample quizzes shipped with the app. They are read-only and marked as samples in the UI.
const q = (id, text, options, answer, explanation = '') => ({ id, text, options, answer, explanation });

export const SEED_QUIZZES = [
  {
    id: 'sample-html', sample: true, title: 'HTML Basics', category: 'Web', difficulty: 'Easy',
    description: 'Check the building blocks of every web page.',
    questions: [
      q('h1', 'Which tag defines the main heading of a page?', ['<h1>', '<head>', '<header>', '<title>'], 0, '<h1> is the top-level heading. <title> sets the browser tab text.'),
      q('h2', 'Which attribute gives an image a text alternative?', ['title', 'alt', 'src', 'caption'], 1, 'The alt attribute is read by screen readers and shown if the image fails to load.'),
      q('h3', 'Which element is best for a block of major navigation links?', ['<nav>', '<aside>', '<section>', '<footer>'], 0, '<nav> marks major navigation blocks.'),
    ],
  },
  {
    id: 'sample-js', sample: true, title: 'JavaScript Essentials', category: 'Programming', difficulty: 'Medium',
    description: 'Types, scope and array methods.',
    questions: [
      q('j1', 'What does typeof null return?', ['"null"', '"object"', '"undefined"', '"number"'], 1, 'A long-standing quirk: typeof null is "object".'),
      q('j2', 'Which array method returns a new array of items that pass a test?', ['map', 'forEach', 'filter', 'reduce'], 2, 'filter keeps only items for which the callback returns true.'),
      q('j3', 'Which keyword declares a block-scoped variable that cannot be reassigned?', ['var', 'let', 'const', 'static'], 2),
    ],
  },
  {
    id: 'sample-space', sample: true, title: 'Solar System', category: 'Science', difficulty: 'Easy',
    description: 'A quick tour of our neighbourhood in space.',
    questions: [
      q('s1', 'Which planet is closest to the Sun?', ['Venus', 'Mercury', 'Mars', 'Earth'], 1),
      q('s2', 'Which planet has the most prominent ring system?', ['Saturn', 'Neptune', 'Mars', 'Mercury'], 0),
      q('s3', 'About how long does sunlight take to reach Earth?', ['8 seconds', '8 minutes', '8 hours', '8 days'], 1, 'Roughly 8 minutes and 20 seconds.'),
    ],
  },
];
export const CATEGORIES = ['Web', 'Programming', 'Science', 'General', 'History', 'Maths'];
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
