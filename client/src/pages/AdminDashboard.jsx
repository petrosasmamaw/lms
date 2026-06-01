import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../redux/slices/departmentSlice';

export function AdminDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { departments } = useSelector((state) => state.department);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600">{departments.length}</div>
            <p className="text-gray-600">Departments</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600">0</div>
            <p className="text-gray-600">Courses</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-purple-600">0</div>
            <p className="text-gray-600">Exams</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-orange-600">0</div>
            <p className="text-gray-600">Students</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Create Department
              </button>
              <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Create Course
              </button>
              <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
                Create Exam
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            <p className="text-gray-600">No recent activity</p>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Departments</h3>
          {departments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{dept.name}</td>
                      <td className="py-3">{dept.description || '-'}</td>
                      <td className="text-right py-3">
                        <button className="text-blue-600 hover:underline mr-3">Edit</button>
                        <button className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No departments yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
