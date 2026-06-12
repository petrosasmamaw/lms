import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ExternalLink, Trash2, FolderOpen } from 'lucide-react'
import { fetchResources, uploadResource, deleteResource } from '../features/resources/resourcesSlice'
import EmptyState from '../components/ui/EmptyState'
import LoadingButton from '../components/ui/LoadingButton'

function detectResourceType(filename = '') {
  const name = filename.toLowerCase()
  if (name.endsWith('.pdf')) return 'pdf'
  if (name.endsWith('.doc') || name.endsWith('.docx')) return 'doc'
  if (name.endsWith('.mp4') || name.endsWith('.mov') || name.endsWith('.webm')) return 'video'
  return 'pdf'
}

const TYPE_BADGE = {
  pdf: 'badge-error',
  doc: 'badge-info',
  video: 'badge-accent',
}

export default function ResourcesPage() {
  const { courseId } = useParams()
  const dispatch = useDispatch()
  const { list, loading, message, error } = useSelector((s) => s.resources)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('pdf')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    dispatch(fetchResources(courseId))
  }, [courseId, dispatch])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setType(detectResourceType(selectedFile.name))
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !title) {
      alert('Please fill in title and select a file')
      return
    }
    setUploading(true)
    try {
      const uploadType = detectResourceType(file.name)
      const result = await dispatch(uploadResource({ courseId, title, type: uploadType, file }))
      if (result.payload) {
        setTitle('')
        setFile(null)
        setType('pdf')
        dispatch(fetchResources(courseId))
      }
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = (resourceId) => {
    if (confirm('Delete this resource?')) {
      dispatch(deleteResource(resourceId))
    }
  }

  return (
    <div className="page-shell">
      <Link to={`/courses/${courseId}`} className="link-back">← Course</Link>
      <div className="mt-4 mb-8">
        <h1 className="page-title">Resources</h1>
        <p className="page-subtitle">Upload and manage course materials</p>
      </div>

      <form onSubmit={handleUpload} className="card space-y-4 mb-10 max-w-lg">
        <h2 className="section-title">Upload new resource</h2>
        <div>
          <label className="label" htmlFor="title">Title</label>
          <input id="title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resource title" required />
        </div>
        <div>
          <label className="label" htmlFor="type">Type</label>
          <select id="type" className="select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="pdf">PDF</option>
            <option value="doc">Document (DOC/DOCX)</option>
            <option value="video">Video (MP4/MOV/WEBM)</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="file">File</label>
          <input id="file" type="file" className="file-input" onChange={handleFileChange} accept=".pdf,.doc,.docx,.mp4,.mov,.webm" required />
          {file && (
            <p className="helper-text font-mono">
              {file.name} · {type.toUpperCase()}
            </p>
          )}
        </div>
        <LoadingButton type="submit" className="btn-primary w-full" loading={uploading} loadingText="Uploading…">
          Upload
        </LoadingButton>
        {message && <p className="toast-success">{message}</p>}
        {error && (
          <p className="toast-error">
            {typeof error === 'string' ? error : error?.message || 'Upload failed'}
          </p>
        )}
      </form>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton skeleton-card" />)}
        </div>
      )}

      {!loading && !list.length && (
        <EmptyState icon={FolderOpen} title="No resources yet" description="Upload your first PDF, document, or video above." />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((r) => (
          <div key={r.id} className="card">
            <div className="font-medium text-[var(--color-text-primary)]">{r.title}</div>
            <span className={`badge ${TYPE_BADGE[r.type] || 'badge-neutral'} mt-3 uppercase`}>
              {r.type}
            </span>
            <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--color-border)]">
              {r.url && (
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="link-accent text-sm flex items-center gap-1 flex-1">
                  <ExternalLink size={14} strokeWidth={1.5} aria-hidden="true" />
                  Open
                </a>
              )}
              <button type="button" onClick={() => handleDelete(r.id)} disabled={loading} className="btn-icon text-[var(--color-error)]">
                <Trash2 size={16} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
