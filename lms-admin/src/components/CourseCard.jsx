import { Link } from 'react-router-dom'

export default function CourseCard({ course }) {
  return (
    <div className="p-3 bg-gray-800 rounded">
      <h4 className="font-medium">{course.name}</h4>
      <div className="mt-2 flex space-x-2">
        <Link to={`/courses/${course.id}/resources`} className="px-2 py-1 bg-blue-600 rounded text-sm">Resources</Link>
        <Link to={`/courses/${course.id}/exams`} className="px-2 py-1 bg-green-600 rounded text-sm">Exam</Link>
      </div>
    </div>
  )
}
