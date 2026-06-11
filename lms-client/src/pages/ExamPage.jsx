import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ClipboardList } from 'lucide-react'
import {
  fetchExams,
  fetchQuestions,
  fetchExamAttempt,
  submitExam,
  clearSubmission,
} from '../features/exams/examsSlice'
import EmptyState from '../components/ui/EmptyState'

function ExamTaker({ examId, onDone }) {
  const dispatch = useDispatch()
  const { questions, attempts, submission, loading, error } = useSelector((s) => s.exams)
  const qs = questions[examId] || []
  const attempt = attempts[examId]
  const [answers, setAnswers] = useState({})

  useEffect(() => {
    dispatch(fetchQuestions(examId))
    dispatch(fetchExamAttempt(examId))
    dispatch(clearSubmission())
  }, [examId, dispatch])

  useEffect(() => {
    if (submission?.examId === Number(examId) || submission?.examId === examId) {
      onDone()
    }
  }, [submission, examId, onDone])

  if (attempt) {
    const score = attempt.score
    const pct = score != null ? `${score}%` : 'Recorded'
    return (
      <div className="alert-info">
        <p className="font-medium">You already submitted this exam.</p>
        <p className="mt-1 font-mono text-[var(--text-sm)]">Score: {pct}</p>
      </div>
    )
  }

  const handleChange = (questionId, choiceId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }))
  }

  const handleSubmit = () => {
    const payload = Object.entries(answers).map(([questionId, choiceId]) => ({
      questionId: Number(questionId),
      choiceId: Number(choiceId),
    }))
    dispatch(submitExam({ examId, answers: payload }))
  }

  const answered = Object.keys(answers).length
  const progress = qs.length ? Math.round((answered / qs.length) * 100) : 0

  if (!qs.length && !loading) {
    return <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">This exam has no questions yet.</p>
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex justify-between text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-2">
          <span>Progress</span>
          <span className="font-mono">{answered} / {qs.length} answered</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {qs.map((q, idx) => (
        <div key={q.id} className="card">
          <p className="font-medium text-[var(--color-text-primary)] mb-4">
            <span className="font-mono text-[var(--color-text-tertiary)] mr-2">{idx + 1}.</span>
            {q.questionText}
          </p>
          <div className="space-y-2">
            {(q.choices || []).map((c) => (
              <label key={c.id} className="choice-label">
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  className="accent-[var(--color-accent)] w-4 h-4"
                  checked={Number(answers[q.id]) === c.id}
                  onChange={() => handleChange(q.id, c.id)}
                />
                <span className="text-[var(--text-sm)]">{c.choiceText}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {error && <p className="toast-error">{error.message || 'Submission failed'}</p>}

      {submission && submission.examId == examId && (
        <div className="toast-success">
          You scored <span className="font-mono">{submission.correct}/{submission.total}</span> ({submission.score}%)
        </div>
      )}

      <button type="button" onClick={handleSubmit} className="btn-primary w-full sm:w-auto" disabled={loading || answered < qs.length}>
        {loading ? 'Submitting…' : 'Submit exam'}
      </button>
    </div>
  )
}

export default function ExamPage() {
  const { courseId } = useParams()
  const dispatch = useDispatch()
  const { list: exams, loading } = useSelector((s) => s.exams)
  const [activeExamId, setActiveExamId] = useState(null)

  useEffect(() => {
    dispatch(fetchExams(courseId))
  }, [courseId, dispatch])

  return (
    <div>
      <Link to={`/courses/${courseId}`} className="link-back">← Course</Link>
      <header className="page-hero mt-2">
        <h1>Exams</h1>
        <p>Take your course assessments</p>
      </header>

      {loading && (
        <div className="loading-row">
          <span className="spinner" />
          Loading exams…
        </div>
      )}

      {!activeExamId && (
        <div className="space-y-3">
          {exams.map((exam) => (
            <div key={exam.id} className="card flex items-center justify-between gap-4">
              <span className="section-title">{exam.title}</span>
              <button type="button" className="btn-primary text-sm shrink-0" onClick={() => setActiveExamId(exam.id)}>
                Start exam
              </button>
            </div>
          ))}
          {!loading && !exams.length && (
            <EmptyState
              icon={ClipboardList}
              title="No exams available"
              description="Your instructor hasn't published any exams yet."
            />
          )}
        </div>
      )}

      {activeExamId && (
        <div>
          <button type="button" className="btn-secondary mb-5 text-sm" onClick={() => setActiveExamId(null)}>
            ← Back to exam list
          </button>
          <ExamTaker examId={activeExamId} onDone={() => {}} />
        </div>
      )}
    </div>
  )
}
