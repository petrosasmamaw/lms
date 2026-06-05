import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchExams, createExam, fetchQuestions, addQuestion } from '../features/exams/examsSlice'

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
      <div className="mt-3 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Exams</h1>
        <p className="text-slate-500 text-sm mt-1">Create exams and add multiple-choice questions</p>
      </div>

      <form onSubmit={handleCreate} className="card p-4 flex flex-wrap gap-2 mb-8">
        <input className="input max-w-sm flex-1 min-w-[10rem]" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Exam title" required />
        <button type="submit" className="btn-primary whitespace-nowrap" disabled={createLoading || !title}>
          {createLoading ? 'Creating...' : 'Create New Exam'}
        </button>
      </form>

      <div className="space-y-4">
        {exams.map((ex) => (
          <div key={ex.id} className="card p-5">
            <div className="flex justify-between items-center gap-4">
              <h3 className="font-bold text-slate-800 text-lg">{ex.title}</h3>
              <button type="button" onClick={() => open(ex)} className="btn-secondary text-sm shrink-0">
                {openExam === ex.id ? 'Expanded' : 'Manage'}
              </button>
            </div>
            {openExam === ex.id && (
              <div className="mt-5 border-t border-slate-100 pt-5">
                <h4 className="font-semibold mb-4 text-slate-700">Questions</h4>
                {(questions[ex.id] || []).map((q) => (
                  <div key={q.id} className="mb-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="font-medium text-slate-800">{q.questionText}</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {(q.choices || []).map((c) => (
                        <li key={c.id} className={c.isCorrect ? 'text-emerald-600 font-semibold' : 'text-slate-500'}>
                          {c.isCorrect ? '✓ ' : '○ '}{c.choiceText}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="mt-4 p-5 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <p className="text-sm font-semibold text-indigo-800 mb-3">Add question</p>
                  <input className="input mb-3" value={qText} onChange={(e) => setQText(e.target.value)} placeholder="Question text" />
                  {choices.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <input
                        type="radio"
                        name={`correct-${ex.id}`}
                        className="accent-indigo-600 w-4 h-4"
                        checked={correct === idx}
                        onChange={() => setCorrect(idx)}
                      />
                      <input className="input" value={c} onChange={(e) => { const next = [...choices]; next[idx] = e.target.value; setChoices(next) }} placeholder={`Choice ${idx + 1}`} />
                    </div>
                  ))}
                  <button type="button" onClick={() => handleAddQuestion(ex.id)} className="btn-primary mt-3" disabled={addingQuestionFor === ex.id}>
                    {addingQuestionFor === ex.id ? 'Adding...' : 'Add Question'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {!exams.length && (
          <p className="text-slate-400 text-center py-8 card">No exams created yet. Add one above.</p>
        )}
      </div>
    </div>
  )
}
