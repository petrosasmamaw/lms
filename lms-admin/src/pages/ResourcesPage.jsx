import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchResources, uploadResource, deleteResource } from '../features/resources/resourcesSlice'

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
      // Auto-detect type from file
      const name = selectedFile.name.toLowerCase()
      if (name.endsWith('.pdf')) setType('pdf')
      else if (name.endsWith('.doc') || name.endsWith('.docx')) setType('doc')
      else if (name.endsWith('.mp4') || name.endsWith('.mov') || name.endsWith('.webm')) setType('video')
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !title) {
      alert('Please fill in title and select a file')
      return
    }
    
    console.log(`Uploading: ${file.name}, Type: ${type}, Title: ${title}`)
    const result = await dispatch(uploadResource({ courseId, title, type, file }))
    console.log('Upload result:', result)
    
    if (result.payload) {
      setTitle('')
      setFile(null)
      dispatch(fetchResources(courseId))
    }
  }

  const handleDelete = (resourceId) => {
    if (confirm('Delete this resource?')) {
      dispatch(deleteResource(resourceId))
    }
  }

  const handleOpenResource = (resource) => {
    console.log('Opening resource:', resource)
    if (resource.type === 'doc') {
      window.open(resource.url, '_blank')
    } else {
      setViewerModal(resource)
    }
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
          <option value="video">Video (MP4/MOV)</option>
        </select>
        <div>
          <input
            type="file"
            className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-semibold hover:file:bg-indigo-100"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.mp4,.mov,.webm"
            required
          />
          {file && <p className="text-xs text-slate-500 mt-1">Selected: {file.name}</p>}
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
        {message && <p className="text-green-600 text-sm font-semibold bg-green-50 p-3 rounded">{message}</p>}
        {error && <p className="text-red-600 text-sm font-semibold bg-red-50 p-3 rounded">{typeof error === 'string' ? error : 'Upload failed'}</p>}
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
                  {r.type === 'doc' ? 'Download' : 'Open'} →
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

      {/* Resource Viewer Modal */}
      {viewerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b bg-slate-50">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-800">{viewerModal.title}</h2>
                <p className="text-xs text-slate-500 mt-1">{viewerModal.type.toUpperCase()} • {viewerModal.url}</p>
              </div>
              <button
                onClick={() => setViewerModal(null)}
                className="ml-4 text-slate-500 hover:text-slate-700 text-2xl font-light hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-50 flex items-center justify-center">
              {viewerModal.type === 'pdf' ? (
                <iframe
                  key={viewerModal.id}
                  src={`${viewerModal.url}#view=FitH&toolbar=1`}
                  title={viewerModal.title}
                  className="w-full h-full rounded border border-slate-200"
                  style={{ minHeight: '500px' }}
                  allow="fullscreen"
                  onError={(e) => console.error('iFrame error:', e)}
                />
              ) : viewerModal.type === 'video' ? (
                <video
                  key={viewerModal.id}
                  controls
                  className="max-w-full max-h-full rounded bg-black"
                  style={{ maxHeight: '600px' }}
                  onError={(e) => console.error('Video error:', e)}
                >
                  <source src={viewerModal.url} type="video/mp4" />
                  <source src={viewerModal.url} type="video/quicktime" />
                  Your browser doesn't support video playback.
                </video>
              ) : (
                <div className="text-center text-slate-500">
                  <p>Unable to preview this file type</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 p-4 border-t bg-slate-50 justify-end">
              <a
                href={viewerModal.url}
                download={viewerModal.title}
                className="btn-secondary"
              >
                Download
              </a>
              <button
                onClick={() => window.open(viewerModal.url, '_blank')}
                className="btn-secondary"
              >
                Open in new tab
              </button>
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
