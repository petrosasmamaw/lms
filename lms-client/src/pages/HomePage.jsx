import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStudentCourses } from '../features/courses/coursesSlice'
import CourseCard from '../components/CourseCard'

export default function HomePage() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { list: courses, loading, error } = useSelector((s) => s.courses)

  useEffect(() => {
    if (user?.departmentId && user?.year) {
      dispatch(fetchStudentCourses({
        departmentId: user.departmentId,
        year: user.year,
      }))
    }
  }, [user, dispatch])

  return (
    <div>
      <header className="page-hero">
        <p className="text-xs font-extrabold uppercase tracking-wider text-orange-600 mb-1">Your learning</p>
        <h1>Welcome, {user?.name || 'Student'} 👋</h1>
        <p>
          Courses for your department · Year {user?.year}
        </p>
      </header>

      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-8">
          <span className="h-7 w-7 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-bold">Loading your courses...</span>
        </div>
      )}

      {error && <p className="toast-error">{error.message || 'Failed to load courses'}</p>}

      {!loading && !courses.length && (
        <div className="card p-10 text-center">
          <span className="text-4xl" aria-hidden>📭</span>
          <p className="text-slate-600 font-bold mt-4">No courses yet</p>
          <p className="text-slate-500 text-sm mt-1 font-semibold">
            Your admin hasn&apos;t added courses for your department and year.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course, i) => (
          <CourseCard key={course.id} course={course} index={i} />
        ))}
      </div>
    </div>
  )
}
