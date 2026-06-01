import { Link } from 'react-router-dom'

export default function DepartmentCard({ dept }) {
  const yearLabel = dept.year ? `${dept.year} Year` : 'Year N/A'
  return (
    <Link to={`/departments/${dept.id}/year/${dept.year || 1}`} className="block p-4 bg-gray-800 rounded shadow hover:shadow-md">
      <h3 className="text-lg font-semibold">{dept.name}</h3>
      <p className="text-sm text-gray-400">{yearLabel}</p>
    </Link>
  )
}
