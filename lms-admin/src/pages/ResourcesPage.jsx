import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchResources, uploadResource, deleteResource } from '../features/resources/resourcesSlice'

function detectResourceType(filename = '') {
  const name = filename.toLowerCase()
  if (name.endsWith('.pdf')) return 'pdf'
  if (name.endsWith('.doc') || name.endsWith('.docx')) return 'doc'
  if (name.endsWith('.mp4') || name.endsWith('.mov') || name.endsWith('.webm')) return 'video'
  return 'pdf'
}

function getViewerConfig(resource) {
  if (!resource?.url) return null

  if (resource.type === 'pdf') {
    return {
      mode: 'iframe',
      src: `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(resource.url)}`,
      hint: 'If the PDF does not appear, use Open in new tab.',
    }
  }

  if (resource.type === 'video') {
    return {
      mode: 'video',
      src: resource.url,
      hint: 'Video playback uses the uploaded file directly.',
    }
  }

  if (resource.type === 'doc') {
    return {
      mode: 'iframe',
      src: `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(resource.url)}`,
      hint: 'Document preview is provided by Microsoft Office Online.',
    }
  }

  return null
}

export default function ResourcesPage() {
  const { courseId } = useParams()
  const dispatch = useDispatch()
  const { list, loading, message, error } = useSelector((s) => s.resources)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('pdf')
  const [file, setFile] = useState(null)
  const [viewerModal, setViewerModal] = useState(null)

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

    const uploadType = detectResourceType(file.name)
    const result = await dispatch(uploadResource({ courseId, title, type: uploadType, file }))

    if (result.payload) {
      setTitle('')
      setFile(null)
      setType('pdf')
      dispatch(fetchResources(courseId))
    }
  }

  const handleDelete = (resourceId) => {
    if (confirm('Delete this resource?')) {
      dispatch(deleteResource(resourceId))
    }
  }

  const handleOpenResource = (resource) => {
    setViewerModal(resource)
  }

  const viewerConfig = viewerModal ? getViewerConfig(viewerModal) : null

  return (
    <div className="page-shell">
      <Link to={`/courses/${courseId}`} className="link-back">← Course</Link>
      <div className="mt-3 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Resources</h1>
        <p className="text-slate-500 text-sm mt-1">Upload and manage course materials</p>
      </div>

      <form onSubmit={handleUpload} className="card p-6 space-y-4 mb-10 max-w-lg">
        <h2 className="font-semibold text-slate-800">Upload new resource</h2>
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Resource title"
          required
        />
        <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="pdf">PDF</option>
          <option value="doc">Document (DOC/DOCX)</option>
          <option value="video">Video (MP4/MOV/WEBM)</option>
        </select>
        <div>
          <input
            type="file"
            className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-semibold hover:file:bg-indigo-100"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.mp4,.mov,.webm"
            required
          />
          {file && (
            <p className="text-xs text-slate-500 mt-1">
              Selected: {file.name} ({type.toUpperCase()})
            </p>
          )}
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
        {message && <p className="text-green-600 text-sm font-semibold bg-green-50 p-3 rounded">{message}</p>}
        {error && (
          <p className="text-red-600 text-sm font-semibold bg-red-50 p-3 rounded">
            {typeof error === 'string' ? error : error?.message || 'Upload failed'}
          </p>
        )}
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="font-semibold text-slate-800">{r.title}</div>
            <span className="inline-block mt-3 text-xs uppercase tracking-wide font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {r.type}
            </span>
            <div className="flex gap-2 mt-4">
              {r.url && (
                <button
                  onClick={() => handleOpenResource(r)}
                  className="text-indigo-600 text-sm font-semibold hover:underline flex-1 text-left"
                >
                  Open →
                </button>
              )}
              <button
                onClick={() => handleDelete(r.id)}
                disabled={loading}
                className="text-red-600 text-sm font-semibold hover:text-red-800 px-3 py-1"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        {!list.length && !loading && (
          <p className="text-slate-400 col-span-full py-8 text-center">No resources uploaded yet.</p>
        )}
      </div>

      {viewerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col min-h-0">
            <div className="flex justify-between items-center p-4 border-b bg-slate-50 shrink-0">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-slate-800 truncate">{viewerModal.title}</h2>
                <p className="text-xs text-slate-500 mt-1 uppercase">{viewerModal.type}</p>
              </div>
              <button
                onClick={() => setViewerModal(null)}
                className="ml-4 text-slate-500 hover:text-slate-700 text-2xl font-light hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden p-4 bg-gray-50">
              {viewerConfig?.mode === 'iframe' && (
                <iframe
                  key={`${viewerModal.id}-${viewerModal.url}`}
                  src={viewerConfig.src}
                  title={viewerModal.title}
                  className="w-full h-full min-h-[500px] rounded border border-slate-200 bg-white"
                  allow="fullscreen"
                />
              )}

              {viewerConfig?.mode === 'video' && (
                <video
                  key={`${viewerModal.id}-${viewerModal.url}`}
                  controls
                  className="w-full max-h-full rounded bg-black"
                  src={viewerConfig.src}
                >
                  Your browser does not support video playback.
                </video>
              )}

              {!viewerConfig && (
                <div className="h-full min-h-[300px] flex items-center justify-center text-slate-500">
                  <p>Unable to preview this file.</p>
                </div>
              )}

              {viewerConfig?.hint && (
                <p className="text-xs text-slate-500 mt-3">{viewerConfig.hint}</p>
              )}
            </div>

            <div className="flex gap-2 p-4 border-t bg-slate-50 justify-end shrink-0">
              <a
                href={viewerModal.url}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                {viewerModal.type === 'doc' ? 'Download file' : 'Open in new tab'}
              </a>
              <button
                onClick={() => setViewerModal(null)}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
