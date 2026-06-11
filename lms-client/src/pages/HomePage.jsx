import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BookOpen } from 'lucide-react'
import { fetchStudentCourses } from '../features/courses/coursesSlice'
import CourseCard from '../components/CourseCard'
import EmptyState from '../components/ui/EmptyState'

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
        <p className="eyebrow">Your learning</p>
        <h1>Welcome, {user?.name || 'Student'}</h1>
        <p>
          Courses for your department · Year <span className="font-mono">{user?.year}</span>
        </p>
      </header>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton skeleton-card" />)}
        </div>
      )}

      {error && <p className="toast-error">{error.message || 'Failed to load courses'}</p>}

      {!loading && !courses.length && (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description="Your admin hasn't added courses for your department and year."
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}
