import { useMemo, useState } from 'react';
import QuizCard from '../components/QuizCard.jsx';
import { CATEGORIES, DIFFICULTIES } from '../data/seed.js';

export default function QuizList({ quizzes, go, onDelete }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('');
  const [diff, setDiff] = useState('');
  const shown = useMemo(() => quizzes.filter((q) =>
    q.title.toLowerCase().includes(search.trim().toLowerCase()) && (!cat || q.category === cat) && (!diff || q.difficulty === diff)), [quizzes, search, cat, diff]);
  return (
    <>
      <h1>Quizzes</h1>
      <div className="filters" role="search">
        <label>Search by title<input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. JavaScript" /></label>
        <label>Category<select value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label>Difficulty<select value={diff} onChange={(e) => setDiff(e.target.value)}><option value="">All</option>{DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}</select></label>
      </div>
      <p aria-live="polite" className="meta">{shown.length} quiz{shown.length === 1 ? '' : 'zes'} found</p>
      {shown.length === 0 ? (
        <div className="empty"><p>No quizzes match those filters.</p><button className="btn" onClick={() => { setSearch(''); setCat(''); setDiff(''); }}>Clear filters</button> <button className="btn primary" onClick={() => go('create')}>Create a quiz</button></div>
      ) : (
        <div className="grid">{shown.map((q) => <QuizCard key={q.id} quiz={q} onPlay={(id) => go('take', { id })} onEdit={(id) => go('create', { id })} onDelete={onDelete} />)}</div>
      )}
    </>
  );
}
