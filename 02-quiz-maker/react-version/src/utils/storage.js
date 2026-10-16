const KEY = 'cubiq:data';
const VERSION = 1;
const empty = () => ({ version: VERSION, quizzes: [], attempts: [] });

// Safe, version-aware load: bad JSON or an unknown shape falls back to empty data.
export function loadData() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (!raw || raw.version !== VERSION || !Array.isArray(raw.quizzes) || !Array.isArray(raw.attempts)) return empty();
    return raw;
  } catch { return empty(); }
}
export function saveData(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); return true; } catch { return false; }
}
export const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
