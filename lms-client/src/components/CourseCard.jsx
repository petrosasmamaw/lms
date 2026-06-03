import { Link } from 'react-router-dom'

const ACCENTS = [
  { border: 'border-l-orange-500', badge: 'bg-orange-50 text-orange-700 border-orange-100' },
  { border: 'border-l-teal-500', badge: 'bg-teal-50 text-teal-700 border-teal-100' },
  { border: 'border-l-violet-500', badge: 'bg-violet-50 text-violet-700 border-violet-100' },
  { border: 'border-l-rose-500', badge: 'bg-rose-50 text-rose-700 border-rose-100' },
]

export default function CourseCard({ course, index = 0 }) {
  const { border, badge } = ACCENTS[index % ACCENTS.length]
  return (
    <div className={`card p-5 border-l-4 ${border} flex flex-col justify-between min-h-[160px] hover:-translate-y-0.5`}>
      <div>
        <h3 className="text-lg font-extrabold text-slate-800 leading-snug">{course.name}</h3>
        <span className={`inline-block mt-3 text-xs font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full border ${badge}`}>
          Year {course.year}
        </span>
      </div>
      <Link
        to={`/courses/${course.id}`}
        state={{ course }}
        className="mt-5 inline-block text-center btn-primary text-sm py-2.5 w-full"
      >
        Open Course
      </Link>
    </div>
  )
}
