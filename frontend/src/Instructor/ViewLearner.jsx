import { useEffect, useState } from 'react';
import { Users, Book, Calendar, Search, ArrowUpDown, UserCheck } from 'lucide-react';

function ViewLearner() {
  const [completionData, setCompletionData] = useState([]);
  const [learner, setLearner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [auth] = useState(JSON.parse(localStorage.getItem('tourstorage')));
  console.log(auth, "auth data");
  const [stats, setStats] = useState({
    totalLearners: 0,
    uniqueLearners: 0,
    uniqueCourses: 0
  });

  useEffect(() => {
    let data = {
      instructorid: auth.vendorid
    };

    setLoading(true);
    fetch('http://localhost:4000/multivendor/getLearner', {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then((result) => {
        setLearner(result);

        // Calculate stats
        const uniqueUserIds = new Set(result.map(item => item.user_id?._id).filter(Boolean));
        const uniqueCourseIds = new Set(result.map(item => item.course_id?._id).filter(Boolean));

        setStats({
          totalLearners: result.length,
          uniqueLearners: uniqueUserIds.size,
          uniqueCourses: uniqueCourseIds.size
        });

        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching learners:", error);
        setLoading(false);
      });
  }, [auth]);



 useEffect(() => {
  const fetchCompletions = async () => {
    try {
      console.log('Sending instructorId:', auth.vendorid); // ✅ log

      const response = await fetch('http://localhost:4000/multivendor/getcompletion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instructorId: auth.vendorid }),
      });

      const result = await response.json();
      console.log('Received completion data:', result); // ✅ log

      // Uncomment this after verification
      setCompletionData(result.data);
    } catch (err) {
      console.error('Error fetching completion data:', err);
    }
  };

  if (auth.vendorid) {
    fetchCompletions();
  }
}, [auth.vendorid]);


  // Sorting logic
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting and filtering
  const sortedAndFilteredLearners = [...learner]
    .filter(item => {
      const userName = item.user_id?.name?.toLowerCase() || '';
      const courseTitle = item.course_id?.title?.toLowerCase() || '';
      const searchLower = searchTerm.toLowerCase();

      return userName.includes(searchLower) || courseTitle.includes(searchLower);
    })
    .sort((a, b) => {
      if (sortConfig.key === 'name') {
        const aName = a.user_id?.name || '';
        const bName = b.user_id?.name || '';
        return sortConfig.direction === 'asc'
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      }

      if (sortConfig.key === 'course') {
        const aCourse = a.course_id?.title || '';
        const bCourse = b.course_id?.title || '';
        return sortConfig.direction === 'asc'
          ? aCourse.localeCompare(bCourse)
          : bCourse.localeCompare(aCourse);
      }

      if (sortConfig.key === 'date') {
        const aDate = a.date ? new Date(a.date).getTime() : 0;
        const bDate = b.date ? new Date(b.date).getTime() : 0;
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
      }

      return 0;
    });

  // Group learners by course for the course-based view
  const learnersByCoursesMap = learner.reduce((acc, item) => {
    const courseId = item.course_id?._id;
    const courseTitle = item.course_id?.title || 'Unknown Course';

    if (!courseId) return acc;

    if (!acc[courseId]) {
      acc[courseId] = {
        title: courseTitle,
        learners: []
      };
    }

    acc[courseId].learners.push(item);
    return acc;
  }, {});

  const coursesList = Object.values(learnersByCoursesMap);

  // Conditional rendering for loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Learner Management</h1>
        <p className="text-gray-500">Monitor and manage your course enrollments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Users size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Enrollments</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalLearners}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <UserCheck size={24} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Unique Learners</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.uniqueLearners}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-pink-100 p-3 rounded-full">
              <Book size={24} className="text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Courses</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.uniqueCourses}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Search by learner name or course title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Learners List */}
      {sortedAndFilteredLearners.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="text-gray-400 mb-3">
            <Users size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-800">No learners found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Learner</span>
                      {sortConfig.key === 'name' && (
                        <ArrowUpDown size={14} className={`transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('course')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Course</span>
                      {sortConfig.key === 'course' && (
                        <ArrowUpDown size={14} className={`transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('date')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Enrolled On</span>
                      {sortConfig.key === 'date' && (
                        <ArrowUpDown size={14} className={`transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedAndFilteredLearners.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-600 font-medium">
                            {item.user_id?.name ? item.user_id.name.charAt(0).toUpperCase() : "?"}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.user_id?.name || "Unknown User"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.user_id?.email || ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.course_id?.title || "Unknown Course"}</div>
                      <div className="text-xs text-gray-500">
                        {item.course_id?.category || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <div className="text-sm text-gray-600">
                          {item.date ? new Date(item.date).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : "Unknown"}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Course-based view */}
      <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">Enrollments by Course</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursesList.map((course, courseIdx) => (
          <div key={courseIdx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-purple-600 px-4 py-3">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium truncate">{course.title}</h3>
                <span className="bg-white text-purple-600 text-xs font-bold px-2 py-1 rounded-full">
                  {course.learners.length} enrollments
                </span>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto">
              <ul className="divide-y divide-gray-100">
                {course.learners.map((learner, learnerIdx) => (
                  <li key={learnerIdx} className="px-4 py-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <span className="text-gray-600 font-medium text-sm">
                            {learner.user_id?.name ? learner.user_id.name.charAt(0).toUpperCase() : "?"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {learner.user_id?.name || "Unknown User"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {learner.date ? new Date(learner.date).toLocaleDateString() : "Unknown date"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">Course Completed</h2>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
{completionData.length === 0 ? (
  <div className="text-gray-500">No course completions found.</div>
) : (
  completionData.map((item, idx) => (
    <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
      <div className="mb-2 font-semibold text-purple-700">{item.user}</div>
      <div className="mb-1 text-gray-800"><strong>Course:</strong> {item.course}</div>
      <div className="mb-1 text-gray-600"><strong>Completion:</strong> {item.completionPercentage}</div>
      <div className="mb-1 text-gray-600"><strong>Lessons Completed:</strong> {item.completedLessonsCount} / {item.totalLessons}</div>
    </div>
  ))
)}

</div>
      </div>
    </div>
  );
}

export default ViewLearner;