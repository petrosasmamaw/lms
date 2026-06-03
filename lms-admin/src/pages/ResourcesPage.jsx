import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchResources, uploadResource } from '../features/resources/resourcesSlice'

export default function ResourcesPage() {
  const { courseId } = useParams()
  const dispatch = useDispatch()
  const { list, loading, message } = useSelector((s) => s.resources)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('pdf')
  const [file, setFile] = useState(null)

  useEffect(() => {
    dispatch(fetchResources(courseId))
  }, [courseId, dispatch])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return
    await dispatch(uploadResource({ courseId, title, type, file }))
    setTitle('')
    setFile(null)
    dispatch(fetchResources(courseId))
  }

  return (
    <div className="page-shell">
      <Link to={`/courses/${courseId}`} className="link-back">← Course</Link>
      <div className="mt-3 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Resources</h1>
        <p className="text-slate-500 text-sm mt-1">Upload and manage course materials</p>
      </div>

      <form onSubmit={handleUpload} className="card p-6 space-y-4 mb-10 max-w-lg">
        <h2 className="font-semibold text-slate-800">Upload new resource</h2>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="pdf">PDF</option>
          <option value="doc">DOC</option>
          <option value="video">VIDEO</option>
        </select>
        <input
          type="file"
          className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-semibold hover:file:bg-indigo-100"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          accept=".pdf,.doc,.docx,.mp4,.mov"
          required
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
        {message && <p className="toast-success">{message}</p>}
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="font-semibold text-slate-800">{r.title}</div>
            <span className="inline-block mt-3 text-xs uppercase tracking-wide font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {r.type}
            </span>
            {r.url && (
              <a href={r.url} target="_blank" rel="noreferrer" className="block mt-4 text-indigo-600 text-sm font-semibold hover:underline">
                Open resource →
              </a>
            )}
          </div>
        ))}
        {!list.length && !loading && (
          <p className="text-slate-400 col-span-full py-8 text-center">No resources uploaded yet.</p>
        )}
      </div>
    </div>
  )
}
