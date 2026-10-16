import { useEffect, useRef, useState } from 'react';
import { scoreQuiz } from '../utils/score.js';
import { uid } from '../utils/storage.js';

const SECONDS = 20;

export default function QuizPlayer({ quiz, onFinish, go }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [locked, setLocked] = useState(false);
  const [answers, setAnswers] = useState({});
  const [timed, setTimed] = useState(false);
  const [left, setLeft] = useState(SECONDS);
  const [started, setStarted] = useState(false);
  const saved = useRef(false); // guards against saving the same attempt twice
  const q = quiz.questions[i];
  const last = i === quiz.questions.length - 1;

  const confirm = (choice) => { if (locked) return; setLocked(true); setAnswers((a) => ({ ...a, [q.id]: choice })); };

  useEffect(() => {
    if (!timed || !started || locked) return;
    if (left <= 0) { confirm(picked); return; }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  });

  function next() {
    if (!last) { setI(i + 1); setPicked(null); setLocked(false); setLeft(SECONDS); return; }
    if (saved.current) return;
    saved.current = true;
    const { correct, total, percent } = scoreQuiz(quiz, answers);
    onFinish({ id: uid(), quizId: quiz.id, quizTitle: quiz.title, correct, total, percent, date: new Date().toISOString() });
    go('results', { quiz, answers });
  }

  if (!quiz.questions.length) return <p className="empty">This quiz has no questions yet.</p>;
  if (!started) return (
    <div className="panel center">
      <h1>{quiz.title}</h1><p>{quiz.questions.length} questions. Pick an answer, then confirm it to see the result.</p>
      <label className="check"><input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} /> Timer mode ({SECONDS} seconds per question)</label>
      <div className="row"><button className="btn primary" onClick={() => setStarted(true)}>Begin</button><button className="btn" onClick={() => go('list')}>Back</button></div>
    </div>
  );

  const correct = locked && answers[q.id] === q.answer;
  return (
    <div className="panel">
      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={quiz.questions.length} aria-valuenow={i + (locked ? 1 : 0)} aria-label="Quiz progress"><i style={{ width: `${((i + (locked ? 1 : 0)) / quiz.questions.length) * 100}%` }} /></div>
      <p className="meta">Question {i + 1} of {quiz.questions.length}{timed && !locked ? ` · ${left}s left` : ''}</p>
      <fieldset disabled={locked} className="choices">
        <legend><h2>{q.text}</h2></legend>
        {q.options.map((o, j) => {
          const cls = locked ? (j === q.answer ? 'right' : j === answers[q.id] ? 'wrong' : '') : '';
          return <label key={j} className={`choice ${cls} ${picked === j ? 'sel' : ''}`}><input type="radio" name="choice" checked={picked === j} onChange={() => setPicked(j)} />{o}</label>;
        })}
      </fieldset>
      <div aria-live="polite" className={`feedback ${locked ? (correct ? 'right' : 'wrong') : ''}`}>
        {locked && (<><strong>{answers[q.id] == null ? 'Time is up.' : correct ? 'Correct!' : 'Not quite.'}</strong>{!correct && <> The answer is “{q.options[q.answer]}”.</>}{q.explanation && <p>{q.explanation}</p>}</>)}
      </div>
      <div className="row">
        {!locked ? <button className="btn primary" disabled={picked === null} onClick={() => confirm(picked)}>Confirm answer</button>
          : <button className="btn primary" onClick={next}>{last ? 'See results' : 'Next question'}</button>}
        <button className="btn" onClick={() => { if (window.confirm('Leave this quiz? Your progress will be lost.')) go('list'); }}>Quit</button>
      </div>
    </div>
  );
}
