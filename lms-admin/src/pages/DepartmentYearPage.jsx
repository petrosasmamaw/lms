import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses, createCourse } from '../features/courses/coursesSlice'
import CourseCard from '../components/CourseCard'

export default function DepartmentYearPage(){
  const { departmentId, year } = useParams()
  const dispatch = useDispatch()
  const { list: courses, loading } = useSelector(s => s.courses)
  const [tab, setTab] = useState('students')
  const [name, setName] = useState('')

  useEffect(()=>{
    dispatch(fetchCourses(`?departmentId=${departmentId}&year=${year}`))
  }, [departmentId, year])

  const handleCreateCourse = async (e) =>{
    e.preventDefault()
    await dispatch(createCourse({ name, departmentId, year }))
    setName('')
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Department — {departmentId} — {year} Year</h1>
      <div className="mb-4">
        <button onClick={()=>setTab('students')} className={`px-3 py-1 rounded ${tab==='students'?'bg-indigo-600':''}`}>Students</button>
        <button onClick={()=>setTab('courses')} className={`px-3 py-1 rounded ml-2 ${tab==='courses'?'bg-indigo-600':''}`}>Courses</button>
      </div>

      {tab === 'students' && (
        <div>
          <p>Students list for department {departmentId} year {year} (fetched from /api/users)</p>
        </div>
      )}

      {tab === 'courses' && (
        <div>
          <form onSubmit={handleCreateCourse} className="mb-4 flex space-x-2">
            <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Course name" className="p-2 bg-gray-900 rounded" required />
            <button className="px-3 py-2 bg-indigo-600 rounded">Add Course</button>
          </form>

          {loading && <div className="animate-spin">Loading courses...</div>}
          <div className="grid grid-cols-3 gap-3">
            {courses.map(c => <CourseCard key={c.id} course={c} />)}
          </div>
        </div>
      )}
    </div>
  )
}
