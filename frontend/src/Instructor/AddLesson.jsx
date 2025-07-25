import React, { useEffect, useState } from 'react';
import { Plus, Clock, FileVideo, Book, CheckCircle, Loader2, FileText, Layout } from 'lucide-react';

function AddLesson() {
  const [sectionview, setSectionView] = useState([]);
  const [sectionview1, setSectionView1] = useState('');
  const [courseName, setCourseName] = useState([]);
  const [courseName1, setCourseName1] = useState('');
  const [coursetitle, setCourseTitle] = useState('');
  const [coursevideo, setCourseVideo] = useState(null);
  const [courseduration, setCourseDuration] = useState('');
  const [summary, setSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [selectedFileName, setSelectedFileName] = useState('');
  const [auth] = useState(JSON.parse(localStorage.getItem('tourstorage')));

  useEffect(() => {
    fetch("http://localhost:4000/multivendor/viewsection")
      .then((res) => res.json())
      .then((result) => {
        setSectionView(result);
      })
      .catch((error) => {
        console.error("Error fetching sections:", error);
      });
  }, []);

  useEffect(() => {
    if (auth && auth.vendorid) {
      const ids = {
        instructorid: auth.vendorid
      };

      if (ids.instructorid === auth.vendorid) {
        fetch("http://localhost:4000/multivendor/lessoncourseview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ids),
        })
          .then((res) => res.json())
          .then((result) => {
            setCourseName(result);
          })
          .catch((error) => {
            console.error("Error fetching lesson course view:", error);
          });
      }
    }
  }, [auth]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseVideo(file);
      setSelectedFileName(file.name);

      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";

      videoElement.onloadedmetadata = function () {
        window.URL.revokeObjectURL(videoElement.src);

        const durationInSeconds = videoElement.duration;
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = Math.floor(durationInSeconds % 60);
        const formattedDuration = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

        setCourseDuration(formattedDuration);
      };

      videoElement.src = URL.createObjectURL(file);
    }
  };

  const validateForm = () => {
    if (!courseName1) {
      setMessage({ text: 'Please select a course', type: 'error' });
      return false;
    }
    if (!coursetitle.trim()) {
      setMessage({ text: 'Please enter a lesson title', type: 'error' });
      return false;
    }
    if (!sectionview1) {
      setMessage({ text: 'Please select a section', type: 'error' });
      return false;
    }
    if (!coursevideo) {
      setMessage({ text: 'Please upload a video', type: 'error' });
      return false;
    }
    return true;
  };

  const handleCourse = () => {
    if (!validateForm()) {
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return;
    }

    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('sectionview1', sectionview1);
    formData.append('courseName1', courseName1);
    formData.append('coursetitle', coursetitle);
    formData.append('coursevideo', coursevideo);
    formData.append('courseduration', courseduration);
    formData.append('summary', summary);
    formData.append('insid', auth.vendorid);

    fetch('http://localhost:4000/multivendor/addlesson', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        setMessage({ text: 'Lesson added successfully!', type: 'success' });
        // Reset form
        setCourseTitle('');
        setSectionView1('');
        setCourseName1('');
        setCourseVideo(null);
        setCourseDuration('');
        setSummary('');
        setSelectedFileName('');
      })
      .catch((error) => {
        setMessage({ text: 'Failed to add lesson', type: 'error' });
        console.error("Error adding lesson:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
            <h1 className="text-2xl font-bold text-white">Add Course Lesson</h1>
            <p className="text-blue-100 mt-1">Create new content for your courses</p>
          </div>

          {/* Main Content */}
          <div className="p-8">
            {/* Alert Messages */}
            {message.text && (
              <div className={`mb-6 flex items-center p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border-l-4 border-green-500' 
                  : 'bg-red-50 text-red-700 border-l-4 border-red-500'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <FileText className="h-5 w-5 mr-2" />
                )}
                {message.text}
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Selection */}
                <div>
                  <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
                    <Book className="inline h-4 w-4 mr-1" /> Course Name
                  </label>
                  <select 
                    id="courseName" 
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    onChange={(e) => setCourseName1(e.target.value)}
                    value={courseName1}
                  >
                    <option value="">Select Course</option>
                    {courseName.map((item, index) => (
                      <option key={index} value={item._id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lesson Title */}
                <div>
                  <label htmlFor="lessonTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    <FileText className="inline h-4 w-4 mr-1" /> Lesson Title
                  </label>
                  <input 
                    id="lessonTitle"
                    type="text" 
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter lesson title"
                    onChange={(e) => setCourseTitle(e.target.value)} 
                    value={coursetitle} 
                  />
                </div>

                {/* Section Selection */}
                <div>
                  <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
                    <Layout className="inline h-4 w-4 mr-1" /> Section
                  </label>
                  <select 
                    id="section" 
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    onChange={(e) => setSectionView1(e.target.value)}
                    value={sectionview1}
                  >
                    <option value="">Select Section</option>
                    {sectionview.map((course, index) => (
                      <option key={index} value={course._id}>
                        {course.section}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration (Read Only) */}
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock className="inline h-4 w-4 mr-1" /> Duration
                  </label>
                  <input 
                    id="duration"
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
                    value={courseduration} 
                    readOnly 
                    placeholder="Auto-calculated from video"
                  />
                </div>

                {/* Video Upload */}
                <div className="md:col-span-2">
                  <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-1">
                    <FileVideo className="inline h-4 w-4 mr-1" /> Course Video
                  </label>
                  <div className="flex items-center">
                    <label className="w-full flex items-center justify-center px-4 py-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition duration-200">
                      <input 
                        id="video"
                        type="file" 
                        accept="video/*" 
                        onChange={handleVideoChange} 
                        className="hidden"
                      />
                      <FileVideo className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-500">
                        {selectedFileName ? selectedFileName : 'Click to upload video'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Summary */}
                <div className="md:col-span-2">
                  <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                    <FileText className="inline h-4 w-4 mr-1" /> Lesson Summary
                  </label>
                  <textarea 
                    id="summary"
                    rows="4" 
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter a brief summary of this lesson"
                    onChange={(e) => setSummary(e.target.value)} 
                    value={summary}
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCourse}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center min-w-32"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lesson
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-sm mt-4">
          © {new Date().getFullYear()} Course Management System
        </div>
      </div>
    </div>
  );
}

export default AddLesson;