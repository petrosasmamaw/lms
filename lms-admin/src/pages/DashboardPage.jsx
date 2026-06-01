import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDepartments, createDepartment } from '../features/departments/departmentsSlice'
import DepartmentCard from '../components/DepartmentCard'

export default function DashboardPage() {
  const dispatch = useDispatch()
  const { list, loading } = useSelector((s) => s.departments)
  const [name, setName] = useState('')
  const [year, setYear] = useState(1)

  useEffect(() => { dispatch(fetchDepartments()) }, [])

  const grouped = [1,2,3,4].map(y => ({ year: y, items: list.filter(d => Number(d.year) === y) }))

  const handleCreate = async (e) => {
    e.preventDefault()
    await dispatch(createDepartment({ name, year }))
    setName('')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">Departments</h1>
        <form onSubmit={handleCreate} className="flex items-center space-x-2">
          <input className="p-2 bg-gray-900 rounded" placeholder="Department name" value={name} onChange={(e)=>setName(e.target.value)} required />
          <select className="p-2 bg-gray-900 rounded" value={year} onChange={(e)=>setYear(e.target.value)}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
          <button className="px-3 py-2 bg-indigo-600 rounded">Add</button>
        </form>
      </div>

      {loading && <div className="animate-spin">Loading...</div>}

      {grouped.map(g => (
        <section key={g.year} className="mb-6">
          <h2 className="text-xl mb-2">{g.year}st Year</h2>
          <div className="grid grid-cols-3 gap-4">
            {g.items.map(d => <DepartmentCard key={d.id} dept={d} />)}
          </div>
        </section>
      ))}
    </div>
  )
}
