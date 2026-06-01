import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            📚 Learning Management System
          </h1>
          <p className="text-xl text-gray-600">
            A modern platform for managing courses, resources, and student progress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">Course Management</h3>
            <p className="text-gray-600">
              Organize and manage multiple courses with academic years and departments
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Monitor student progress and achievements with detailed results
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-xl font-bold mb-2">Resource Library</h3>
            <p className="text-gray-600">
              Access and organize learning materials by course and academic year
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="mt-16 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold mb-2">For Administrators</h4>
              <ul className="text-gray-600 space-y-1">
                <li>✓ Manage departments and academic years</li>
                <li>✓ Create and organize courses</li>
                <li>✓ Upload learning resources</li>
                <li>✓ Create exams and questions</li>
                <li>✓ View student results and statistics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">For Students</h4>
              <ul className="text-gray-600 space-y-1">
                <li>✓ View courses for your department and year</li>
                <li>✓ Access learning resources</li>
                <li>✓ Take exams and quizzes</li>
                <li>✓ View exam results and progress</li>
                <li>✓ Track academic performance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
