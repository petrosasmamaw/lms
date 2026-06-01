import { useSelector } from 'react-redux';

export function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600">0</div>
            <p className="text-gray-600">Courses Enrolled</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600">0</div>
            <p className="text-gray-600">Exams Completed</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-purple-600">0%</div>
            <p className="text-gray-600">Average Score</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Your Courses</h3>
            <p className="text-gray-600">No courses enrolled yet</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Your Results</h3>
            <p className="text-gray-600">No exam results yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
