import React, { useEffect, useState } from 'react';
import url from '../Vendor/ImageUrl';

function InstructorCourseView() {
    const [courseview, setCourseView] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [auth] = useState(() => {
        const storedAuth = localStorage.getItem('tourstorage');
        return storedAuth ? JSON.parse(storedAuth) : null;
    });

    useEffect(() => {
        if (auth && auth.vendorid) {
            const ids = {
                instructorid: auth.vendorid
            };
            
            setLoading(true);
            fetch('http://localhost:4000/multivendor/instructorcourseview', {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(ids)
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .then((result) => {
                    setCourseView(result);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Fetch error:", error);
                    setError("Failed to load courses. Please try again later.");
                    setLoading(false);
                });
        } else {
            setError("Authentication information missing. Please log in again.");
            setLoading(false);
        }
    }, [auth]);

    // Filter courses based on search term
    const filteredCourses = courseview.filter(course => 
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.shortdescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.categoryid?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.level?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">My Courses</h1>
            
            {/* Search Box */}
            <div className="mb-8">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search courses by title, description, category, or level..."
                        className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-3 top-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    {searchTerm && (
                        <button 
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            onClick={() => setSearchTerm('')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
            
            {/* Search Results Count */}
            <div className="mb-4 text-gray-600">
                {searchTerm ? (
                    <p>Found {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} matching "{searchTerm}"</p>
                ) : (
                    <p>Total: {courseview.length} {courseview.length === 1 ? 'course' : 'courses'}</p>
                )}
            </div>
            
            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredCourses.map((course, index) => (
                        <CourseCard key={index} course={course} />
                    ))}
                </div>
            ) : (
                <div className="bg-gray-100 p-6 rounded-lg text-center">
                    {searchTerm ? (
                        <>
                            <p className="text-lg text-gray-600">No courses found matching your search criteria.</p>
                            <button 
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                onClick={() => setSearchTerm('')}
                            >
                                Clear Search
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-lg text-gray-600">No courses found. Create your first course to get started!</p>
                            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Create Course
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

function CourseCard({ course }) {
    // Calculate discount percentage if both prices are available
    const discountPercentage = course.price && course.discountprice 
        ? Math.round(((course.price - course.discountprice) / course.price) * 100) 
        : 0;

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            {/* Course Image */}
            <div className="relative h-48 bg-gray-200">
                {course.thumbnail ? (
                    <img 
                        src={url + course.thumbnail} 
                        alt={course.title} 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200">
                        <span className="text-gray-400">No image available</span>
                    </div>
                )}
                
                {/* Level Badge */}
                {course.level && (
                    <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {course.level}
                    </div>
                )}
                
                {/* Discount Badge */}
                {discountPercentage > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {discountPercentage}% OFF
                    </div>
                )}
            </div>
            
            {/* Course Content */}
            <div className="p-4">
                {/* Category */}
                {course.categoryid?.category && (
                    <p className="text-xs text-blue-600 font-semibold mb-2">
                        {course.categoryid.category}
                    </p>
                )}
                
                {/* Title */}
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {course.title}
                </h2>
                
                {/* Short Description */}
                <p className="text-gray-600 text-sm mb-3">
                    {course.shortdescription}
                </p>
                
                {/* Full Description */}
                <div className="mt-3 mb-4">
                    <h3 className="text-md font-semibold text-gray-700 mb-1">Description</h3>
                    <p className="text-gray-600 text-sm">
                        {course.description}
                    </p>
                </div>
                
                {/* Price Section */}
                <div className="flex items-center mt-4">
                    <div className="flex items-center">
                        {course.discountprice ? (
                            <>
                                <span className="text-lg font-bold text-gray-800">₹{course.discountprice}</span>
                                <span className="text-sm text-gray-500 line-through ml-2">₹{course.price}</span>
                            </>
                        ) : (
                            <span className="text-lg font-bold text-gray-800">₹{course.price || 'Free'}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InstructorCourseView;