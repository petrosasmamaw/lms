import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchExams,
  fetchQuestions,
  fetchExamAttempt,
  submitExam,
  clearSubmission,
} from '../features/exams/examsSlice'

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
      <div className="card p-6 bg-emerald-50 border-emerald-200">
        <p className="font-extrabold text-emerald-800">You already submitted this exam.</p>
        <p className="text-emerald-700 mt-1 font-bold">Score: {pct}</p>
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
    return <p className="text-slate-500 font-semibold">This exam has no questions yet.</p>
  }

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <div className="flex justify-between text-sm font-extrabold text-slate-600 mb-2">
          <span>Progress</span>
          <span>{answered} / {qs.length} answered</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {qs.map((q, idx) => (
        <div key={q.id} className="card p-5">
          <p className="font-extrabold text-slate-800 mb-4">
            {idx + 1}. {q.questionText}
          </p>
          <div className="space-y-3">
            {(q.choices || []).map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-slate-100 hover:border-orange-200 cursor-pointer has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 transition-colors"
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  className="w-5 h-5 accent-orange-600"
                  checked={Number(answers[q.id]) === c.id}
                  onChange={() => handleChange(q.id, c.id)}
                />
                <span className="text-slate-700 font-semibold">{c.choiceText}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {error && <p className="toast-error">{error.message || 'Submission failed'}</p>}

      {submission && submission.examId == examId && (
        <div className="card p-6 bg-emerald-50 border-emerald-200">
          <p className="font-extrabold text-emerald-800 text-lg">
            You scored {submission.correct}/{submission.total} ({submission.score}%)
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        className="btn-primary w-full sm:w-auto"
        disabled={loading || answered < qs.length}
      >
        {loading ? 'Submitting...' : 'Submit Exam'}
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
        <div className="flex items-center gap-3 text-slate-500 py-6">
          <span className="h-7 w-7 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-bold">Loading exams...</span>
        </div>
      )}

      {!activeExamId && (
        <div className="space-y-3">
          {exams.map((exam) => (
            <div key={exam.id} className="card p-5 flex items-center justify-between gap-4">
              <span className="font-extrabold text-slate-800">{exam.title}</span>
              <button type="button" className="btn-primary text-sm shrink-0" onClick={() => setActiveExamId(exam.id)}>
                Start Exam
              </button>
            </div>
          ))}
          {!loading && !exams.length && (
            <div className="card p-10 text-center">
              <span className="text-4xl" aria-hidden>📋</span>
              <p className="text-slate-600 font-bold mt-4">No exams available</p>
              <p className="text-slate-500 text-sm mt-1 font-semibold">Your instructor hasn&apos;t published any exams yet.</p>
            </div>
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
