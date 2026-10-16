// answers: { [questionId]: selectedIndex | null }. Everything is calculated from real answers.
export function scoreQuiz(quiz, answers) {
  const total = quiz.questions.length;
  const correct = quiz.questions.filter((qn) => answers[qn.id] === qn.answer).length;
  return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
}

export function validateQuiz(d) {
  const errors = [];
  if (!d.title.trim()) errors.push('Give the quiz a title.');
  if (!d.questions.length) errors.push('Add at least one question.');
  d.questions.forEach((qn, i) => {
    const n = i + 1;
    if (!qn.text.trim()) errors.push(`Question ${n}: enter the question text.`);
    if (qn.options.some((o) => !o.trim())) errors.push(`Question ${n}: fill in all four answer choices.`);
    else if (new Set(qn.options.map((o) => o.trim().toLowerCase())).size < qn.options.length) errors.push(`Question ${n}: answer choices must be different.`);
  });
  return errors;
}
