import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchResources } from '../features/resources/resourcesSlice'

function TypeBadge({ type }) {
  const colors = {
    pdf: 'bg-red-50 text-red-700 border-red-100',
    doc: 'bg-blue-50 text-blue-700 border-blue-100',
    video: 'bg-purple-50 text-purple-700 border-purple-100',
  }
  return (
    <span className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-full border ${colors[type] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
      {type}
    </span>
  )
}

export default function ResourcesPage() {
  const { courseId } = useParams()
  const dispatch = useDispatch()
  const { list, loading, error } = useSelector((s) => s.resources)

  useEffect(() => {
    dispatch(fetchResources(courseId))
  }, [courseId, dispatch])

  return (
    <div>
      <Link to={`/courses/${courseId}`} className="link-back">← Course</Link>
      <header className="page-hero mt-2">
        <h1>Resources</h1>
        <p>Study materials for this course</p>
      </header>

      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-8">
          <span className="h-7 w-7 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-bold">Loading resources...</span>
        </div>
      )}
      {error && <p className="toast-error">Failed to load resources</p>}

      <div className="space-y-4">
        {list.map((r) => (
          <div key={r.id} className="card p-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="font-extrabold text-slate-800 text-lg">{r.title}</h3>
              <TypeBadge type={r.type} />
            </div>

            {r.url && (
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-orange-600 font-extrabold text-sm hover:underline"
              >
                Open →
              </a>
            )}
          </div>
        ))}
        {!loading && !list.length && (
          <div className="card p-10 text-center">
            <span className="text-4xl" aria-hidden>📂</span>
            <p className="text-slate-600 font-bold mt-4">No resources yet</p>
            <p className="text-slate-500 text-sm mt-1 font-semibold">Check back when your instructor uploads materials.</p>
          </div>
        )}
      </div>
    </div>
  )
}
