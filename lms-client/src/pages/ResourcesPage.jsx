import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ExternalLink, FolderOpen } from 'lucide-react'
import { fetchResources } from '../features/resources/resourcesSlice'
import EmptyState from '../components/ui/EmptyState'

function TypeBadge({ type }) {
  const map = {
    pdf: 'badge-error',
    doc: 'badge-info',
    video: 'badge-accent',
  }
  return (
    <span className={`badge ${map[type] || 'badge-neutral'} uppercase`}>
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
        <div className="space-y-4">
          {[1, 2].map((i) => <div key={i} className="skeleton skeleton-card" />)}
        </div>
      )}
      {error && <p className="toast-error">Failed to load resources</p>}

      <div className="space-y-4">
        {list.map((r) => (
          <div key={r.id} className="card">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="section-title">{r.title}</h3>
              <TypeBadge type={r.type} />
            </div>
            {r.url && (
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="link-accent text-sm inline-flex items-center gap-1">
                <ExternalLink size={14} strokeWidth={1.5} aria-hidden="true" />
                Open
              </a>
            )}
          </div>
        ))}
        {!loading && !list.length && (
          <EmptyState
            icon={FolderOpen}
            title="No resources yet"
            description="Check back when your instructor uploads materials."
          />
        )}
      </div>
    </div>
  )
}
