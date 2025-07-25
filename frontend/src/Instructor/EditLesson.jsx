import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import url from '../Vendor/ImageUrl';
import { Save, ArrowLeft, Video, Clock, BookOpen, FileText, AlertCircle } from 'lucide-react';

function EditLesson() {
    const location = useLocation();
    const navigate = useNavigate();
    const [courseName, setCourseName] = useState('');
    const [coursetitle, setCourseTitle] = useState('');
    const [sectionview, setSectionView] = useState('');
    const [coursevideo, setCourseVideo] = useState('');
    const [coursepreview, setCoursePreview] = useState('');
    const [courseduration, setCourseDuration] = useState('');
    const [summary, setSummary] = useState('');
    const [courses, setCourses] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [tailwindReady, setTailwindReady] = useState(false);
    const auth = JSON.parse(localStorage.getItem("tourstorage"));

    // Load Tailwind CSS
    useEffect(() => {
        // Check if Tailwind is already loaded
        const existingScript = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
        if (!existingScript) {
            const script = document.createElement("script");
            script.src = "https://cdn.tailwindcss.com";
            script.onload = () => setTailwindReady(true);
            document.head.appendChild(script);
        } else {
            setTailwindReady(true);
        }
        // Optional: Remove script when component unmounts
        return () => {
            const script = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
            if (script) {
                document.head.removeChild(script);
            }
        };
    }, []);

    // Fetch lesson details
    useEffect(() => {
        if (!location.state?.id) {
            setNotification({
                show: true,
                message: 'No lesson ID provided',
                type: 'error'
            });
            setLoading(false);
            return;
        }

        const edits = { id: location.state.id };
        
        setLoading(true);
        fetch("http://localhost:4000/multivendor/editlesson", {
            method: 'POST',
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json"
            },
            body: JSON.stringify(edits)
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((result) => {
                setCourseName(result.courseName?._id || result.courseName);
                setCourseTitle(result.coursetitle);
                setSectionView(result.sectionview?._id || result.sectionview);
                setCourseVideo(result.coursevideo);
                setCourseDuration(result.courseduration);
                setSummary(result.summary);
                setCoursePreview(result.coursevideo ? url + result.coursevideo : "");
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching lesson details:", error);
                setNotification({
                    show: true,
                    message: 'Failed to load lesson details',
                    type: 'error'
                });
                setLoading(false);
            });
    }, [location.state]);

    // Fetch courses assigned to the logged-in user
    useEffect(() => {
        if (!auth?.vendorid) return;
        
        fetch("http://localhost:4000/multivendor/getassignedcourses", {
            method: 'POST',
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json"
            },
            body: JSON.stringify({ vendorid: auth.vendorid })
        })
            .then((res) => res.json())
            .then((data) => {
                // Include the currently selected course if it's not in the list
                if (courseName && !data.find(c => c._id === courseName)) {
                    data.push({ _id: courseName, title: "Current Course (Not Assigned)" });
                }
                setCourses(data);
            })
            .catch((error) => {
                console.error("Error fetching assigned courses:", error);
                setNotification({
                    show: true,
                    message: 'Failed to load courses',
                    type: 'error'
                });
            });
    }, [auth?.vendorid, courseName]);
  
    // Fetch all sections
    useEffect(() => {
        fetch("http://localhost:4000/multivendor/getallsections", {
            method: 'GET',
            headers: {
                Accept: "application/json"
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setSections(data);
            })
            .catch((error) => {
                console.error("Error fetching sections:", error);
                setNotification({
                    show: true,
                    message: 'Failed to load sections',
                    type: 'error'
                });
            });
    }, []);

    const handleLessonUpdate = () => {
        // Validate inputs
        if (!courseName || !coursetitle || !sectionview) {
            setNotification({
                show: true,
                message: 'Please fill in all required fields',
                type: 'error'
            });
            return;
        }

        setSaving(true);
        const formData = new FormData();
        formData.append("id", location.state.id);
        formData.append("courseName", courseName);
        formData.append("coursetitle", coursetitle);
        formData.append("sectionview", sectionview);
        if (coursevideo instanceof File) {
            formData.append("coursevideo", coursevideo);
        }
        formData.append('courseduration', courseduration);
        formData.append('summary', summary);
        
        fetch("http://localhost:4000/multivendor/updatelesson", {
            method: 'POST',
            body: formData
        })
        .then((res) => res.json())
        .then((result) => {
            console.log(result);
            setSaving(false);
            setNotification({
                show: true,
                message: 'Lesson updated successfully',
                type: 'success'
            });
            
            // Auto-hide the notification after 3 seconds
            setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
                // Navigate back to view lessons
                navigate(-1);
            }, 3000);
        })
        .catch((error) => {
            console.error("Error updating lesson:", error);
            setSaving(false);
            setNotification({
                show: true,
                message: 'Failed to update lesson',
                type: 'error'
            });
        });
    };

    if (loading || !tailwindReady) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="ml-4 text-gray-600">{!tailwindReady ? 'Loading styles...' : 'Loading lesson data...'}</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <button 
                            onClick={() => navigate(-1)}
                            className="mr-4 bg-blue-700 hover:bg-blue-800 text-white rounded-full p-2 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold text-white">Edit Lesson</h1>
                    </div>
                    
                    <button 
                        onClick={handleLessonUpdate}
                        disabled={saving}
                        className={`flex items-center px-4 py-2 rounded-md ${
                            saving 
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-green-500 hover:bg-green-600"
                        } text-white transition-colors`}
                    >
                        <Save size={18} className="mr-2" />
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                {/* Notification */}
                {notification.show && (
                    <div className={`px-6 py-3 ${
                        notification.type === 'success' ? 'bg-green-100 text-green-700 border-l-4 border-green-500' : 
                        'bg-red-100 text-red-700 border-l-4 border-red-500'
                    } flex items-center`}>
                        <AlertCircle size={20} className="mr-2" />
                        {notification.message}
                    </div>
                )}

                {/* Form */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Course Selection */}
                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium flex items-center">
                                <BookOpen size={18} className="mr-2 text-blue-500" />
                                Course <span className="text-red-500 ml-1">*</span>
                            </label>
                            <select
                                onChange={(e) => setCourseName(e.target.value)}
                                value={courseName}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                                <option value="">Select a Course</option>
                                {courses.length > 0 ? (
                                    courses.map((course) => (
                                        <option key={course._id} value={course._id}>
                                            {course.title}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">No courses available</option>
                                )}
                            </select>
                        </div>

                        {/* Section Selection */}
                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium flex items-center">
                                <FileText size={18} className="mr-2 text-blue-500" />
                                Section <span className="text-red-500 ml-1">*</span>
                            </label>
                            <select
                                onChange={(e) => setSectionView(e.target.value)}
                                value={sectionview}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                                <option value="">Select a Section</option>
                                {sections.map((section) => (
                                    <option key={section._id} value={section._id}>
                                        {section.section}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Lesson Title */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-gray-700 font-medium flex items-center">
                                <FileText size={18} className="mr-2 text-blue-500" />
                                Lesson Title <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                onChange={(e) => setCourseTitle(e.target.value)}
                                value={coursetitle}
                                placeholder="Enter lesson title"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Duration */}
                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium flex items-center">
                                <Clock size={18} className="mr-2 text-blue-500" />
                                Duration
                            </label>
                            <input
                                type="text"
                                onChange={(e) => setCourseDuration(e.target.value)}
                                value={courseduration}
                                placeholder="e.g. 45 min"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Video Upload */}
                    <div className="space-y-2 border-t pt-6">
                        <label className="block text-gray-700 font-medium flex items-center">
                            <Video size={18} className="mr-2 text-blue-500" />
                            Lesson Video
                        </label>
                        
                        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                            <div className="flex-grow">
                                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setCourseVideo(file);
                                                setCoursePreview(URL.createObjectURL(file));
                                            }
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Video size={36} className="text-blue-500 mb-2" />
                                    <p className="text-gray-600 text-center">
                                        Drag & drop your video here, or <span className="text-blue-500">click to browse</span>
                                    </p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {coursevideo instanceof File ? coursevideo.name : "Keep existing video or select a new one"}
                                    </p>
                                </div>
                            </div>
                            
                            {coursepreview && (
                                <div className="w-full md:w-64 h-36 bg-black rounded-lg overflow-hidden shadow-md">
                                    <video 
                                        src={coursepreview} 
                                        controls 
                                        className="w-full h-full object-contain"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-2 border-t pt-6">
                        <label className="block text-gray-700 font-medium flex items-center">
                            <FileText size={18} className="mr-2 text-blue-500" />
                            Lesson Summary
                        </label>
                        <textarea
                            onChange={(e) => setSummary(e.target.value)}
                            value={summary}
                            placeholder="Enter a brief summary of the lesson"
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                    <button 
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    
                    <button 
                        onClick={handleLessonUpdate}
                        disabled={saving}
                        className={`flex items-center px-6 py-2 rounded-md ${
                            saving 
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-green-500 hover:bg-green-600"
                        } text-white transition-colors`}
                    >
                        <Save size={18} className="mr-2" />
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditLesson;