import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchResources, uploadResource } from '../features/resources/resourcesSlice'

export default function ResourcesPage(){
  const { courseId } = useParams()
  const dispatch = useDispatch()
  const { list, loading } = useSelector(s => s.resources)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('pdf')
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)

  useEffect(()=>{ dispatch(fetchResources(courseId)) }, [courseId])

  const handleUpload = async (e) =>{
    e.preventDefault()
    if(!file) return
    const fd = new FormData()
    fd.append('title', title)
    fd.append('type', type)
    fd.append('courseId', courseId)
    fd.append('file', file)
    await dispatch(uploadResource({ courseId, formData: fd, onUploadProgress: (p)=>{ setProgress(Math.round((p.loaded/p.total)*100)) } }))
    setTitle(''); setFile(null); setProgress(0)
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Resources</h1>
      <form onSubmit={handleUpload} className="space-y-2 mb-4 bg-gray-800 p-3 rounded">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 bg-gray-900 rounded" required />
        <select value={type} onChange={(e)=>setType(e.target.value)} className="p-2 bg-gray-900 rounded">
          <option value="pdf">PDF</option>
          <option value="doc">DOC</option>
          <option value="video">VIDEO</option>
        </select>
        <input type="file" onChange={(e)=>setFile(e.target.files[0])} accept=".pdf,.doc,.docx,.mp4,.mov" />
        <div>
          <button className="px-3 py-2 bg-indigo-600 rounded" disabled={loading}>Upload</button>
        </div>
        {progress>0 && <div className="text-sm">Uploading: {progress}%</div>}
      </form>

      <div className="grid grid-cols-3 gap-3">
        {list.map(r => (
          <div key={r.id} className="p-3 bg-gray-800 rounded">
            <div className="font-medium">{r.title}</div>
            <div className="text-sm text-gray-400">{r.type}</div>
            {r.url && <a href={r.url} target="_blank" className="text-blue-400">Open</a>}
          </div>
        ))}
      </div>
    </div>
  )
}
