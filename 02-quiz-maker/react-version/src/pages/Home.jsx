import Emblem from '../components/Emblem.jsx';
import CountUp from '../components/CountUp.jsx';
import QuizCard from '../components/QuizCard.jsx';

export default function Home({ quizzes, data, go }) {
  const att = data.attempts;
  const avg = att.length ? Math.round(att.reduce((s, a) => s + a.percent, 0) / att.length) : 0;
  const stats = [[quizzes.length, '', 'Quizzes available'], [data.quizzes.length, '', 'Created by you'], [att.length, '', 'Attempts finished'], [avg, '%', 'Average score']];
  return (
    <>
      <section className="hero">
        <div>
          <h1>Make a quiz. Test yourself. See what stuck.</h1>
          <p>Create multiple-choice quizzes in minutes, answer them one question at a time, and get instant feedback and a full review.</p>
          <div className="row">
            <button className="btn primary" onClick={() => go('create')}>Create a quiz</button>
            <button className="btn" onClick={() => go('list')}>Explore quizzes</button>
          </div>
        </div>
        <Emblem />
      </section>
      <section aria-label="Your stats" className="stats">
        {stats.map(([v, s, l]) => <div key={l}><strong><CountUp value={v} suffix={s} /></strong><span>{l}</span></div>)}
      </section>
      <h2>Featured quizzes</h2>
      <div className="grid">{quizzes.slice(0, 3).map((q) => <QuizCard key={q.id} quiz={q} onPlay={(id) => go('take', { id })} />)}</div>
      <h2>Recent attempts</h2>
      {att.length === 0 ? <p className="empty">No attempts yet. Start any quiz and your scores will appear here.</p> : (
        <ul className="recent">{att.slice(0, 5).map((a) => <li key={a.id}><span>{a.quizTitle}</span><span>{a.correct}/{a.total} ({a.percent}%)</span><time dateTime={a.date}>{new Date(a.date).toLocaleDateString()}</time></li>)}</ul>
      )}
    </>
  );
}
