import { useEffect, useState } from 'react';
import { scoreQuiz } from '../utils/score.js';
import CountUp from '../components/CountUp.jsx';

export default function Results({ quiz, answers, go }) {
  const [shown, setShown] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShown(true), 60); return () => clearTimeout(t); }, []);
  if (!quiz) return <p className="empty">No results to show. <button className="btn" onClick={() => go('home')}>Back to dashboard</button></p>;
  const { correct, total, percent } = scoreQuiz(quiz, answers);
  return (
    <>
      <h1>Results: {quiz.title}</h1>
      <div className="panel center">
        <div className="ring" style={{ '--pct': shown ? percent : 0 }} role="img" aria-label={`${percent} percent`}><span><CountUp value={percent} suffix="%" /></span></div>
        <p><strong>{correct}</strong> correct out of <strong>{total}</strong></p>
        <div className="row"><button className="btn primary" onClick={() => go('take', { id: quiz.id, run: Date.now() })}>Retry quiz</button><button className="btn" onClick={() => go('home')}>Return to dashboard</button></div>
      </div>
      <h2>Review</h2>
      <ol className="review">
        {quiz.questions.map((q) => {
          const a = answers[q.id], ok = a === q.answer;
          return (
            <li key={q.id} className={ok ? 'right' : 'wrong'}>
              <h3>{q.text}</h3>
              <p>Your answer: {a == null ? 'No answer' : q.options[a]} <strong>{ok ? '(correct)' : '(incorrect)'}</strong></p>
              {!ok && <p>Correct answer: {q.options[q.answer]}</p>}
              {q.explanation && <p className="meta">{q.explanation}</p>}
            </li>
          );
        })}
      </ol>
    </>
  );
}
