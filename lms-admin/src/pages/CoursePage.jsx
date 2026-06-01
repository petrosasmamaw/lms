import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from '../features/courses/coursesSlice'

export default function CoursePage(){
  const { courseId } = useParams()
  const dispatch = useDispatch()
  const course = useSelector(s => s.courses.list.find(c => String(c.id) === String(courseId)))

  useEffect(()=>{ dispatch(fetchCourses(`?id=${courseId}`)) }, [courseId])

  return (
    <div>
      <h1 className="text-2xl mb-4">{course?.name || 'Course'}</h1>
      <div className="flex space-x-2">
        <Link to={`/courses/${courseId}/resources`} className="px-3 py-2 bg-blue-600 rounded">Resources</Link>
        <Link to={`/courses/${courseId}/exams`} className="px-3 py-2 bg-green-600 rounded">Exam</Link>
      </div>
    </div>
  )
}
