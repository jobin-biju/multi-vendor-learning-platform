import React, { useEffect, useState } from "react";
import url from "../Vendor/ImageUrl";
import { Link } from "react-router-dom";
import { X, Clock, Film, Book, Edit, Trash2, ChevronRight } from "lucide-react";

function ViewLesson() {
  const [lesson, setLesson] = useState([]);
  const [auth] = useState(JSON.parse(localStorage.getItem("tourstorage")));
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  useEffect(() => {
    if (!auth?.vendorid) return;
    const ids = { insid: auth.vendorid };

    setLoading(true);
    fetch("http://localhost:4000/multivendor/viewlesson", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ids),
    })
      .then((res) => res.json())
      .then((result) => {
        setLesson(result);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch lessons:", err);
        setLoading(false);
      });
  }, [auth?.vendorid]);

  const groupedCourses = lesson.reduce((acc, item) => {
    const courseId = item.courseName?._id;
    if (!courseId) return acc;
    
    if (!acc[courseId]) {
      acc[courseId] = {
        course: item.courseName,
        lessons: [],
      };
    }
    acc[courseId].lessons.push(item);
    return acc;
  }, {});

  const openModal = (courseId, e) => {
    e.stopPropagation();
    setSelectedCourse(groupedCourses[courseId]);
    setModalVisible(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCourse(null);
    document.body.style.overflow = 'auto';
  };

  const handleDeleteLesson = (lessonId) => {
    if (deleteConfirm === lessonId) {
      const ids = {
        id: lessonId
      };
      
      fetch("http://localhost:4000/multivendor/deletelesson", {
        method: 'POST',
        headers: {
          Accept: "application/json",
          'Content-Type': "application/json"
        },
        body: JSON.stringify(ids)
      })
        .then((res) => res.json())
        .then((result) => {
          // Update UI by removing the deleted lesson
          const updatedLessons = lesson.filter(item => item._id !== lessonId);
          setLesson(updatedLessons);
          setDeleteConfirm(null);
        })
        .catch(err => {
          console.error("Failed to delete lesson:", err);
        });
    } else {
      setDeleteConfirm(lessonId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">My Courses</h1>
        
        {Object.keys(groupedCourses).length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-10 text-center">
            <Book size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600">No courses available</h2>
            <p className="text-gray-500 mt-2">Start by creating your first course</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.entries(groupedCourses).map(([courseId, group]) => (
              <div
                key={courseId}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                onClick={(e) => openModal(courseId, e)}
              >
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={url + group.course?.thumbnail}
                    alt={group.course?.title || "Course"}
                    className="w-full h-full object-cover"
                    onError={(e) => {e.target.src = "https://via.placeholder.com/300x200?text=No+Image"}}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="font-bold text-xl truncate">{group.course?.title || "Untitled Course"}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Film size={16} className="text-blue-500 mr-2" />
                      <span className="text-gray-600">{group.lessons.length} {group.lessons.length === 1 ? 'Lesson' : 'Lessons'}</span>
                    </div>
                    <button 
                      className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center hover:bg-blue-600 transition-colors"
                      onClick={(e) => openModal(courseId, e)}
                    >
                      <span>View</span>
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalVisible && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 animate-fadeIn">
          <div 
            className="bg-white rounded-lg w-11/12 max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold">{selectedCourse.course?.title || "Course Details"}</h2>
              <button
                onClick={closeModal}
                className="bg-blue-700 hover:bg-blue-800 rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="overflow-y-auto flex-grow p-6">
              {selectedCourse.lessons.length === 0 ? (
                <div className="text-center py-10">
                  <Film size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No lessons available for this course</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedCourse.lessons.map((lesson, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg overflow-hidden shadow-sm border border-gray-200"
                    >
                      <div className="p-5">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">{lesson.coursetitle || "Untitled Lesson"}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center text-gray-600 mb-2">
                              <Book size={16} className="mr-2 text-blue-500" />
                              <span><strong>Section:</strong> {lesson.sectionview?.section || "Uncategorized"}</span>
                            </div>
                            
                            <div className="flex items-center text-gray-600 mb-2">
                              <Clock size={16} className="mr-2 text-blue-500" />
                              <span><strong>Duration:</strong> {lesson.courseduration || "Not specified"}</span>
                            </div>
                            
                            <div className="mt-3">
                              <h4 className="font-medium text-gray-700 mb-2">Summary:</h4>
                              <p className="text-gray-600 bg-white p-3 rounded border border-gray-200">
                                {lesson.summary || "No summary provided"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-black rounded-lg overflow-hidden">
                            <video
                              src={url + lesson.coursevideo}
                              controls
                              className="w-full h-full"
                              poster={url + lesson.courseName?.thumbnail}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 mt-6">
                          <Link 
                            to='/editlesson' 
                            state={{ id: lesson._id }}
                            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                          >
                            <Edit size={16} className="mr-2" />
                            Edit
                          </Link>

                          <button
                            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                              deleteConfirm === lesson._id 
                                ? "bg-red-600 text-white hover:bg-red-700" 
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            onClick={() => handleDeleteLesson(lesson._id)}
                          >
                            <Trash2 size={16} className="mr-2" />
                            {deleteConfirm === lesson._id ? "Confirm" : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewLesson;