import React, { useEffect, useState } from 'react';
import url from './ImageUrl';
import { Link } from 'react-router-dom';

function Mycourse() {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [auth] = useState(JSON.parse(localStorage.getItem('tourstorage')));
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let ids = {
            venid: auth.vendorid
        };

        setIsLoading(true);
        fetch('http://localhost:4000/multivendor/getcourse', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json"
            },
            body: JSON.stringify(ids)
        })
        .then(res => res.json())
        .then(result => {
            setCourses(result);
            setFilteredCourses(result);
            
            // Extract unique categories and levels for filters
            const uniqueCategories = [...new Set(result.map(course => course.category?.category).filter(Boolean))];
            const uniqueLevels = [...new Set(result.map(course => course.level).filter(Boolean))];
            
            setCategories(uniqueCategories);
            setLevels(uniqueLevels);
            setIsLoading(false);
        })
        .catch(err => {
            console.error("Fetch error:", err);
            setIsLoading(false);
        });
    }, [auth.vendorid, refresh]);

    useEffect(() => {
        // Apply filters whenever search term or filters change
        let results = courses;
        
        // Apply search term filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            results = results.filter(course => 
                (course.title && course.title.toLowerCase().includes(term)) || 
                (course.shortdescription && course.shortdescription.toLowerCase().includes(term)) ||
                (course.description && course.description.toLowerCase().includes(term))
            );
        }
        
        // Apply category filter
        if (categoryFilter) {
            results = results.filter(course => 
                course.category?.category === categoryFilter
            );
        }
        
        // Apply level filter
        if (levelFilter) {
            results = results.filter(course => 
                course.level === levelFilter
            );
        }
        
        setFilteredCourses(results);
    }, [searchTerm, categoryFilter, levelFilter, courses]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    
    const handleCategoryChange = (e) => {
        setCategoryFilter(e.target.value);
    };
    
    const handleLevelChange = (e) => {
        setLevelFilter(e.target.value);
    };
    
    const resetFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setLevelFilter('');
    };
    
    const handleDelete = (courseId) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            let ids = {
                id: courseId
            };
            fetch('http://localhost:4000/multivendor/deletecourse', {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(ids)
            })
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                setRefresh(prev => prev + 1);
            })
            .catch(err => {
                console.error("Delete error:", err);
            });
        }
    };

    const openDescriptionModal = (course) => {
        setSelectedCourse(course);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    // Handle clicking outside modal to close it
    const handleOutsideClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    };

    // Handle Escape key to close modal
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };

        if (showModal) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [showModal]);

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                
                .animate-slide-up {
                    animation: slideUp 0.5s ease-out forwards;
                }
                
                .animate-pulse-blue {
                    animation: pulse 2s infinite;
                }
                
                .card-enter {
                    opacity: 0;
                    transform: translateY(20px);
                }
                
                .staggered-animation > * {
                    animation: slideUp 0.4s ease-out forwards;
                    opacity: 0;
                }
                
                .staggered-animation > *:nth-child(1) { animation-delay: 0.1s; }
                .staggered-animation > *:nth-child(2) { animation-delay: 0.15s; }
                .staggered-animation > *:nth-child(3) { animation-delay: 0.2s; }
                .staggered-animation > *:nth-child(4) { animation-delay: 0.25s; }
                .staggered-animation > *:nth-child(5) { animation-delay: 0.3s; }
                .staggered-animation > *:nth-child(6) { animation-delay: 0.35s; }
                .staggered-animation > *:nth-child(7) { animation-delay: 0.4s; }
                .staggered-animation > *:nth-child(8) { animation-delay: 0.45s; }
            `}</style>
            <div className="max-w-7xl mx-auto animate-fade-in">
                <div className="mb-8 flex justify-between items-center animate-slide-up">
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight relative">
                        <span className="inline-block pb-1">My Courses</span>
                        <span className="absolute -bottom-1 left-0 w-16 h-1 bg-blue-500 rounded"></span>
                    </h1>
                    {/* <Link to="/addcourse">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2 group">
                            <svg className="w-4 h-4 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Create Course</span>
                        </button>
                    </Link> */}
                </div>
                
                {/* Search and Filter Section */}
                <div className="bg-white p-5 rounded-xl shadow-sm mb-6 border border-gray-100 animate-slide-up" style={{animationDelay: "0.15s"}}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search input */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Search by title or description..." 
                                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                        
                        {/* Category filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <div className="relative">
                                <select 
                                    className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                                    value={categoryFilter}
                                    onChange={handleCategoryChange}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>{category}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        {/* Level filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                            <div className="relative">
                                <select 
                                    className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                                    value={levelFilter}
                                    onChange={handleLevelChange}
                                >
                                    <option value="">All Levels</option>
                                    {levels.map((level, index) => (
                                        <option key={index} value={level}>{level}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Filter stats and reset */}
                    <div className="flex justify-between items-center mt-6">
                        <div className="text-sm text-gray-600">
                            Showing <span className="font-medium text-blue-600">{filteredCourses.length}</span> of <span className="font-medium">{courses.length}</span> courses
                        </div>
                        <button 
                            className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            onClick={resetFilters}
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center items-center py-12 animate-fade-in">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 animate-pulse-blue"></div>
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                        <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-4 text-gray-500 text-lg font-medium">No courses found</p>
                        {(searchTerm || categoryFilter || levelFilter) && (
                            <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 staggered-animation">
                        {filteredCourses.map((course, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md border border-gray-100 transform hover:translate-y-[-4px] hover:scale-[1.01] group">
                                <div className="relative h-40 bg-gray-100 overflow-hidden">
                                    {course.thumbnail ? (
                                        <img 
                                            src={url + course.thumbnail} 
                                            alt={course.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full bg-gray-100 group-hover:bg-gray-50 transition-colors duration-300">
                                            <svg className="h-12 w-12 text-gray-300 transition-all duration-300 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm opacity-90">
                                        {course.level}
                                    </div>
                                </div>
                                
                                <div className="p-3 flex-grow">
                                    <h2 className="text-base font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                        {course.title}
                                    </h2>
                                    <p className="text-gray-600 text-xs mb-2 line-clamp-1">{course.shortdescription}</p>
                                    
                                    <div className="flex items-center mb-2">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 mr-2 flex items-center justify-center">
                                            <span className="text-xs font-bold">{course.instructorRegister?.name?.charAt(0) || "?"}</span>
                                        </div>
                                        <span className="text-xs text-gray-700 font-medium truncate">{course.instructorRegister?.name || "Unknown Instructor"}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 text-[10px]">
                                            {course.category?.category || "Uncategorized"}
                                        </div>
                                        <button 
                                            onClick={() => openDescriptionModal(course)} 
                                            className="inline-flex items-center text-blue-500 text-xs font-medium hover:text-blue-700 focus:outline-none transition-colors"
                                        >
                                            Info
                                            <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="px-3 py-3 mt-auto border-t border-gray-50">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-end">
                                            {course.discountprice ? (
                                                <>
                                                    <span className="text-sm font-bold text-blue-600">₹{course.discountprice}</span>
                                                    <span className="text-xs text-gray-500 line-through ml-1">₹{course.price}</span>
                                                </>
                                            ) : (
                                                <span className="text-sm font-bold text-blue-600">₹{course.price}</span>
                                            )}
                                        </div>
                                        <div className="flex space-x-1">
                                            {course._id && (
                                                <Link to='/editcourse' state={{ id: course._id }} className="group/button">
                                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-all duration-300 hover:shadow-md flex items-center">
                                                        <svg className="w-3 h-3 mr-1 opacity-0 group-hover/button:opacity-100 transition-all duration-300 transform translate-x-2 group-hover/button:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                </Link>
                                            )}
                                            <button 
                                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-medium transition-all duration-300 hover:shadow-md group/delete"
                                                onClick={() => handleDelete(course._id || index)}
                                            >
                                                <span className="flex items-center">
                                                    <svg className="w-3 h-3 mr-1 opacity-0 group-hover/delete:opacity-100 transition-all duration-300 transform translate-x-2 group-hover/delete:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Description Modal */}
                {showModal && selectedCourse && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay backdrop-blur-sm animate-fade-in"
                        onClick={handleOutsideClick}
                        style={{animationDuration: "0.2s"}}
                    >
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-screen overflow-hidden animate-slide-up" style={{animationDuration: "0.3s", animationDelay: "0.1s"}}>
                            <div className="flex justify-between items-center border-b p-4">
                                <h3 className="text-lg font-semibold text-gray-800">{selectedCourse.title}</h3>
                                <button 
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors transform hover:rotate-90 duration-300"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="p-4 overflow-y-auto" style={{ maxHeight: '60vh' }}>
                                {selectedCourse.description ? (
                                    <div className="prose max-w-none text-gray-700">
                                        {selectedCourse.description}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No description available</p>
                                )}
                            </div>
                            
                            <div className="border-t p-4 flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium transition-all duration-300 shadow-sm hover:shadow flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Add this CSS to your global stylesheet for the fade-in animation
// @keyframes fadeInUp {
//   from {
//     opacity: 0;
//     transform: translateY(20px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }
// .animate-fade-in-up {
//   animation: fadeInUp 0.3s ease-out forwards;
// }

export default Mycourse;