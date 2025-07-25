import React, { useEffect, useState } from 'react';
import url from '../Vendor/ImageUrl';

function AdminCourseView() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = () => {
    setLoading(true);
    fetch('http://localhost:4000/multivendor/adminviewcourse')
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📘 Course Management</h1>

      {loading ? (
        <div className="text-center text-gray-500 text-lg font-medium">Loading courses...</div>
      ) : courses.length > 0 ? (
        <div className="overflow-x-auto shadow-lg rounded-2xl border border-gray-200 bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Thumbnail</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Vendor</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50 transition-all duration-150">
                  <td className="px-6 py-3">
                    <img
                      src={url + course.thumbnail}
                      alt="Thumbnail"
                      className="h-14 w-14 rounded-lg object-cover border border-gray-300 shadow-sm"
                    />
                  </td>
                  <td className="px-6 py-3 font-semibold text-gray-800">{course.title}</td>
                  <td className="px-6 py-3 text-gray-600">{course.level}</td>
                  <td className="px-6 py-3 text-green-600 font-medium">₹{course.price}</td>
                  <td className="px-6 py-3 text-blue-600 font-medium">₹{course.discountprice}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">{course.venid?.name || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-12 bg-white p-6 rounded-2xl shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h2>
          <p className="text-gray-500">Currently, there are no courses available to display.</p>
        </div>
      )}
    </div>
  );
}

export default AdminCourseView;
