import { useRef, useState } from 'react';
import { CATEGORIES, DIFFICULTIES } from '../data/seed.js';
import { uid } from '../utils/storage.js';
import { validateQuiz } from '../utils/score.js';

const blankQ = () => ({ id: uid(), text: '', options: ['', '', '', ''], answer: 0, explanation: '' });

export default function QuizEditor({ quiz, onSave, go }) {
  const [d, setD] = useState(() => quiz ? structuredClone(quiz) : { id: uid(), title: '', description: '', category: CATEGORIES[0], difficulty: 'Easy', sample: false, questions: [blankQ()] });
  const [errors, setErrors] = useState([]);
  const [preview, setPreview] = useState(false);
  const errRef = useRef(null);
  if (quiz?.sample) return <p className="empty">Sample quizzes are read-only. Create your own quiz instead.</p>;

  const set = (patch) => setD((x) => ({ ...x, ...patch }));
  const setQ = (i, patch) => set({ questions: d.questions.map((q, k) => (k === i ? { ...q, ...patch } : q)) });
  const setOpt = (i, j, v) => setQ(i, { options: d.questions[i].options.map((o, k) => (k === j ? v : o)) });
  const move = (i, dir) => { const qs = [...d.questions], j = i + dir; if (j < 0 || j >= qs.length) return; [qs[i], qs[j]] = [qs[j], qs[i]]; set({ questions: qs }); };
  const remove = (i) => set({ questions: d.questions.filter((_, k) => k !== i) });

  function submit(e) {
    e.preventDefault();
    const errs = validateQuiz(d);
    setErrors(errs);
    if (errs.length) { setTimeout(() => errRef.current?.focus(), 0); return; }
    onSave({ ...d, title: d.title.trim(), description: d.description.trim(), sample: false });
    go('list');
  }

  return (
    <form onSubmit={submit} noValidate>
      <h1>{quiz ? 'Edit quiz' : 'Create a quiz'}</h1>
      {errors.length > 0 && <div className="alert" role="alert" tabIndex={-1} ref={errRef}><strong>Fix these before saving:</strong><ul>{errors.map((e) => <li key={e}>{e}</li>)}</ul></div>}
      <div className="panel">
        <label>Title<input value={d.title} onChange={(e) => set({ title: e.target.value })} maxLength={80} required /></label>
        <label>Description<textarea value={d.description} onChange={(e) => set({ description: e.target.value })} rows={2} maxLength={200} /></label>
        <div className="two">
          <label>Category<select value={d.category} onChange={(e) => set({ category: e.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label>Difficulty<select value={d.difficulty} onChange={(e) => set({ difficulty: e.target.value })}>{DIFFICULTIES.map((x) => <option key={x}>{x}</option>)}</select></label>
        </div>
      </div>
      {d.questions.map((q, i) => (
        <fieldset className="panel" key={q.id}>
          <legend>Question {i + 1}</legend>
          <label>Question text<input value={q.text} onChange={(e) => setQ(i, { text: e.target.value })} /></label>
          {q.options.map((o, j) => (
            <div className="opt" key={j}>
              <input type="radio" name={`ans-${q.id}`} checked={q.answer === j} onChange={() => setQ(i, { answer: j })} aria-label={`Mark choice ${j + 1} as correct`} />
              <input value={o} onChange={(e) => setOpt(i, j, e.target.value)} placeholder={`Choice ${j + 1}`} aria-label={`Question ${i + 1} choice ${j + 1}`} />
            </div>
          ))}
          <label>Explanation (optional)<input value={q.explanation} onChange={(e) => setQ(i, { explanation: e.target.value })} /></label>
          <div className="row">
            <button type="button" className="btn" onClick={() => move(i, -1)} disabled={i === 0}>Move up</button>
            <button type="button" className="btn" onClick={() => move(i, 1)} disabled={i === d.questions.length - 1}>Move down</button>
            <button type="button" className="btn danger" onClick={() => remove(i)}>Delete question</button>
          </div>
        </fieldset>
      ))}
      <div className="row">
        <button type="button" className="btn" onClick={() => set({ questions: [...d.questions, blankQ()] })}>Add question</button>
        <button type="button" className="btn" onClick={() => setPreview(!preview)} aria-expanded={preview}>{preview ? 'Hide preview' : 'Preview'}</button>
        <button type="submit" className="btn primary">{quiz ? 'Save changes' : 'Publish quiz'}</button>
      </div>
      {preview && (
        <section className="panel" aria-label="Preview">
          <h2>{d.title || 'Untitled quiz'}</h2><p>{d.description}</p>
          {d.questions.map((q, i) => <div key={q.id}><h3>{i + 1}. {q.text || '(empty question)'}</h3><ul>{q.options.map((o, j) => <li key={j} className={j === q.answer ? 'ok' : ''}>{o || '(empty)'}{j === q.answer ? ' (correct)' : ''}</li>)}</ul></div>)}
        </section>
      )}
    </form>
  );
}
