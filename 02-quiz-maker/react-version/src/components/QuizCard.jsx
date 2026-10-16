export default function QuizCard({ quiz, onPlay, onEdit, onDelete }) {
  return (
    <article className="qcard">
      <div className="tags">
        <span className="tag">{quiz.category}</span>
        <span className="tag">{quiz.difficulty}</span>
        <span className={`tag ${quiz.sample ? 'sample' : 'mine'}`}>{quiz.sample ? 'Sample' : 'Yours'}</span>
      </div>
      <h3>{quiz.title}</h3>
      <p>{quiz.description || 'No description.'}</p>
      <p className="meta">{quiz.questions.length} question{quiz.questions.length === 1 ? '' : 's'}</p>
      <div className="row">
        <button className="btn primary" onClick={() => onPlay(quiz.id)}>Start quiz</button>
        {!quiz.sample && onEdit && <button className="btn" onClick={() => onEdit(quiz.id)}>Edit</button>}
        {!quiz.sample && onDelete && <button className="btn danger" onClick={() => onDelete(quiz)}>Delete</button>}
      </div>
    </article>
  );
}
