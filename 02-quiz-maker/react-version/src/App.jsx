import { useEffect, useMemo, useState } from 'react';
import { SEED_QUIZZES } from './data/seed.js';
import { loadData, saveData } from './utils/storage.js';
import Home from './pages/Home.jsx';
import QuizList from './pages/QuizList.jsx';
import QuizEditor from './pages/QuizEditor.jsx';
import QuizPlayer from './pages/QuizPlayer.jsx';
import Results from './pages/Results.jsx';

const NAV = [['home', 'Dashboard'], ['list', 'Quizzes'], ['create', 'Create']];

export default function App() {
  const [data, setData] = useState(loadData);
  const [route, setRoute] = useState({ name: 'home' });
  const [storageError, setStorageError] = useState(false);

  useEffect(() => { setStorageError(!saveData(data)); }, [data]);
  const quizzes = useMemo(() => [...SEED_QUIZZES, ...data.quizzes], [data.quizzes]);
  const find = (id) => quizzes.find((q) => q.id === id);

  const go = (name, params = {}) => { setRoute({ name, ...params }); window.scrollTo(0, 0); };
  const saveQuiz = (quiz) => setData((d) => ({ ...d, quizzes: d.quizzes.some((x) => x.id === quiz.id) ? d.quizzes.map((x) => (x.id === quiz.id ? quiz : x)) : [quiz, ...d.quizzes] }));
  const deleteQuiz = (quiz) => { if (window.confirm(`Delete "${quiz.title}"? This cannot be undone.`)) setData((d) => ({ ...d, quizzes: d.quizzes.filter((x) => x.id !== quiz.id) })); };
  const addAttempt = (a) => setData((d) => ({ ...d, attempts: [a, ...d.attempts].slice(0, 50) }));

  const common = { quizzes, data, go };
  let page;
  if (route.name === 'list') page = <QuizList {...common} onDelete={deleteQuiz} />;
  else if (route.name === 'create') page = <QuizEditor key={route.id || 'new'} quiz={route.id ? find(route.id) : null} onSave={saveQuiz} go={go} />;
  else if (route.name === 'take') page = find(route.id) ? <QuizPlayer key={route.id + (route.run || 0)} quiz={find(route.id)} onFinish={addAttempt} go={go} /> : <Home {...common} />;
  else if (route.name === 'results') page = <Results quiz={route.quiz} answers={route.answers} go={go} />;
  else page = <Home {...common} />;

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="bar">
        <button className="brand" onClick={() => go('home')} aria-label="Cubiq home"><span className="logo" aria-hidden="true" />Cubiq</button>
        <nav aria-label="Primary">
          {NAV.map(([n, label]) => <button key={n} className={route.name === n ? 'on' : ''} aria-current={route.name === n ? 'page' : undefined} onClick={() => go(n)}>{label}</button>)}
        </nav>
      </header>
      {storageError && <p className="alert" role="alert">Your browser blocked local storage, so changes will be lost when you close this tab.</p>}
      <main id="main">{page}</main>
      <footer className="foot">Guest mode. Quizzes and scores are saved only in this browser. There are no accounts and nothing is sent to a server.</footer>
    </>
  );
}
