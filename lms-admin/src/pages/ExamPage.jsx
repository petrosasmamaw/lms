import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Check, ClipboardList } from 'lucide-react'
import { fetchExams, createExam, fetchQuestions, addQuestion } from '../features/exams/examsSlice'
import EmptyState from '../components/ui/EmptyState'
import LoadingButton from '../components/ui/LoadingButton'

export default function ExamPage() {
  const { courseId } = useParams()
  const dispatch = useDispatch()
  const { list: exams, questions } = useSelector((s) => s.exams)
  const [title, setTitle] = useState('')
  const [openExam, setOpenExam] = useState(null)
  const [qText, setQText] = useState('')
  const [choices, setChoices] = useState(['', '', '', ''])
  const [correct, setCorrect] = useState(0)
  const [createLoading, setCreateLoading] = useState(false)
  const [addingQuestionFor, setAddingQuestionFor] = useState(null)

  useEffect(() => {
    dispatch(fetchExams(courseId))
  }, [courseId, dispatch])

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreateLoading(true)
    try {
      await dispatch(createExam({ courseId: Number(courseId), title }))
      setTitle('')
      dispatch(fetchExams(courseId))
    } finally {
      setCreateLoading(false)
    }
  }

  const open = async (exam) => {
    setOpenExam(exam.id)
    await dispatch(fetchQuestions(exam.id))
  }

  const handleAddQuestion = async (examId) => {
    setAddingQuestionFor(examId)
    try {
      await dispatch(addQuestion({ examId, question: { text: qText, choices, correct } }))
      setQText('')
      setChoices(['', '', '', ''])
      setCorrect(0)
      await dispatch(fetchQuestions(examId))
    } finally {
      setAddingQuestionFor(null)
    }
  }

  return (
    <div className="page-shell">
      <Link to={`/courses/${courseId}`} className="link-back">← Course</Link>
      <div className="mt-4 mb-8">
        <h1 className="page-title">Exams</h1>
        <p className="page-subtitle">Create exams and add multiple-choice questions</p>
      </div>

      <form onSubmit={handleCreate} className="card flex flex-wrap gap-3 mb-8 p-4">
        <input className="input max-w-sm flex-1 min-w-[10rem]" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Exam title" required />
        <LoadingButton type="submit" className="btn-primary whitespace-nowrap" loading={createLoading} loadingText="Creating…" disabled={!title}>
          Create exam
        </LoadingButton>
      </form>

      <div className="space-y-4">
        {exams.map((ex) => (
          <div key={ex.id} className="card">
            <div className="flex justify-between items-center gap-4">
              <h3 className="section-title">{ex.title}</h3>
              <button type="button" onClick={() => open(ex)} className="btn-secondary text-sm shrink-0">
                {openExam === ex.id ? 'Collapse' : 'Manage'}
              </button>
            </div>
            {openExam === ex.id && (
              <div className="mt-5 pt-5 border-t border-[var(--color-border)]">
                <h4 className="text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-4 uppercase tracking-wide">Questions</h4>
                {(questions[ex.id] || []).map((q) => (
                  <div key={q.id} className="mb-3 p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)]">
                    <p className="font-medium text-[var(--color-text-primary)]">{q.questionText}</p>
                    <ul className="mt-2 space-y-1">
                      {(q.choices || []).map((c) => (
                        <li key={c.id} className={`text-[var(--text-sm)] flex items-center gap-2 ${c.isCorrect ? 'text-[var(--color-success)]' : 'text-[var(--color-text-secondary)]'}`}>
                          {c.isCorrect && <Check size={14} strokeWidth={1.5} aria-hidden="true" />}
                          {c.choiceText}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="mt-4 p-5 rounded-[var(--radius-md)] bg-[var(--color-accent-muted)] border border-[var(--color-accent-border)]">
                  <p className="text-[var(--text-sm)] font-medium text-[var(--color-accent)] mb-3">Add question</p>
                  <input className="input mb-3" value={qText} onChange={(e) => setQText(e.target.value)} placeholder="Question text" />
                  {choices.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <input type="radio" name={`correct-${ex.id}`} className="accent-[var(--color-accent)] w-4 h-4" checked={correct === idx} onChange={() => setCorrect(idx)} />
                      <input className="input" value={c} onChange={(e) => { const next = [...choices]; next[idx] = e.target.value; setChoices(next) }} placeholder={`Choice ${idx + 1}`} />
                    </div>
                  ))}
                  <LoadingButton onClick={() => handleAddQuestion(ex.id)} className="btn-primary mt-3" loading={addingQuestionFor === ex.id} loadingText="Adding…">
                    Add question
                  </LoadingButton>
                </div>
              </div>
            )}
          </div>
        ))}
        {!exams.length && (
          <EmptyState icon={ClipboardList} title="No exams yet" description="Create an exam above to start adding questions." />
        )}
      </div>
    </div>
  )
}
