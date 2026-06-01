import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchExams, createExam, fetchQuestions, addQuestion } from '../features/exams/examsSlice'

export default function ExamPage(){
  const { courseId } = useParams()
  const dispatch = useDispatch()
  const { list: exams, questions } = useSelector(s => s.exams)
  const [title, setTitle] = useState('')
  const [openExam, setOpenExam] = useState(null)
  const [qText, setQText] = useState('')
  const [choices, setChoices] = useState(['','','',''])
  const [correct, setCorrect] = useState(0)

  useEffect(()=>{ dispatch(fetchExams(courseId)) }, [courseId])

  const handleCreate = async (e) =>{
    e.preventDefault()
    await dispatch(createExam({ courseId, title }))
    setTitle('')
  }

  const open = async (exam) =>{
    setOpenExam(exam.id)
    await dispatch(fetchQuestions(exam.id))
  }

  const handleAddQuestion = async (examId) =>{
    const payload = { text: qText, choices, correct }
    await dispatch(addQuestion({ examId, question: payload }))
    setQText(''); setChoices(['','','','']); setCorrect(0)
    await dispatch(fetchQuestions(examId))
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Exams</h1>
      <form onSubmit={handleCreate} className="mb-4 flex space-x-2">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Exam title" className="p-2 bg-gray-900 rounded" required />
        <button className="px-3 py-2 bg-indigo-600 rounded">Create New Exam</button>
      </form>

      <div className="space-y-3">
        {exams.map(ex => (
          <div key={ex.id} className="bg-gray-800 p-3 rounded">
            <div className="flex justify-between items-center">
              <div>{ex.title}</div>
              <div>
                <button onClick={()=>open(ex)} className="px-2 py-1 bg-blue-600 rounded">Open</button>
              </div>
            </div>
            {openExam === ex.id && (
              <div className="mt-3">
                <h4 className="font-semibold">Questions</h4>
                {(questions[ex.id] || []).map((q, i) => (
                  <div key={i} className="p-2 bg-gray-900 rounded my-2">
                    <div>{q.text}</div>
                  </div>
                ))}

                <div className="mt-3 bg-gray-900 p-3 rounded">
                  <input value={qText} onChange={(e)=>setQText(e.target.value)} placeholder="Question text" className="w-full p-2 mb-2" />
                  {choices.map((c, idx) => (
                    <div key={idx} className="flex items-center mb-2">
                      <input type="radio" name="correct" checked={correct===idx} onChange={()=>setCorrect(idx)} className="mr-2" />
                      <input value={c} onChange={(e)=>{ const a = [...choices]; a[idx]=e.target.value; setChoices(a) }} placeholder={`Choice ${idx+1}`} className="p-2 flex-1" />
                    </div>
                  ))}
                  <button onClick={()=>handleAddQuestion(ex.id)} className="px-3 py-2 bg-green-600 rounded">Add Question</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
