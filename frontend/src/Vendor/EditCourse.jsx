import React, { useEffect, useState } from 'react';
import { useLocation,Link } from 'react-router-dom';
import url from './ImageUrl';

function EditCourse() {
    const location = useLocation();
    const [title, setTitle] = useState('');
    const [shortdescription, setShortDescription] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [level, setLevel] = useState('');
    const [instructor, setInstructor] = useState('');
    const [instructors, setInstructors] = useState([]);
    const [price, setPrice] = useState('');
    const [discountprice, setDiscountPrice] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailpreview, setThumbnailPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [auth] = useState(JSON.parse(localStorage.getItem('tourstorage')));

    useEffect(() => {
        setLoading(true);
        const edits = { id: location.state.id };

        // Fetch course details
        fetch('http://localhost:4000/multivendor/editcourse', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(edits),
        })
            .then((res) => res.json())
            .then((result) => {
                setTitle(result.title || '');
                setShortDescription(result.shortdescription || '');
                setDescription(result.description || '');
                setCategory(result.categoryid?._id || '');
                setLevel(result.level || '');
                setInstructor(result.instructorid?._id || '');
                setPrice(result.price || '');
                setDiscountPrice(result.discountprice || '');
                setThumbnail(null);
                setThumbnailPreview(result.thumbnail ? url + result.thumbnail : '');
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching course details:', err);
                setLoading(false);
            });

        // Fetch categories and instructors
        const vendorid = auth?.vendorid?._id; // this will be 687622b6b3afcc0bac316530

        fetch(`http://localhost:4000/multivendor/getcategoriesandinstructors?vendorid=${vendorid}`)
            .then((res) => res.json())
            .then((data) => {
                setCategories(data.categories || []);
                setInstructors(data.instructors || []);
            })
            .catch((err) => console.error('Error fetching dropdown data:', err));
    }, [auth, location.state.id]);

    const handleCourseUpdate = (e) => {
        e.preventDefault();
        setLoading(true);
        
        const formData = new FormData();
        formData.append('id', location.state.id);
        formData.append('title', title);
        formData.append('shortdescription', shortdescription);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('level', level);
        formData.append('instructor', instructor);
        formData.append('price', price);
        formData.append('discountprice', discountprice);
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        fetch('http://localhost:4000/multivendor/updatecourse', {
            method: 'POST',
            body: formData,
        })
            .then((res) => res.json())
            .then((result) => {
                setSuccess(true);
                setLoading(false);
                setTimeout(() => setSuccess(false), 3000);
                console.log(result);
            })
            .catch((err) => {
                console.error('Error updating course:', err);
                setLoading(false);
            });
    };
    const [tailwindReady, setTailwindReady] = useState(false);

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
        setTailwindReady(false);
      }
    };
  }, []);

  if (!tailwindReady) {
    return <div>Loading form styles...</div>;
  }
    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    {/* Header with gradient background */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
                        <h1 className="text-3xl font-bold text-white">Edit Course</h1>
                        <p className="text-blue-100 mt-2">Update your course information and settings</p>
                    </div>

                    {/* Loading indicator */}
                    {loading && (
                        <div className="flex justify-center p-6">
                            <div className="animate-pulse flex space-x-4">
                                <div className="bg-blue-200 h-3 w-24 rounded"></div>
                                <div className="bg-blue-300 h-3 w-24 rounded"></div>
                                <div className="bg-blue-200 h-3 w-24 rounded"></div>
                            </div>
                        </div>
                    )}

                    {/* Success message */}
                    {success && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 mx-6 my-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700 font-medium">
                                        Course updated successfully!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form className="p-6 space-y-6" onSubmit={handleCourseUpdate}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Course Title */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    onChange={(e) => setTitle(e.target.value)}
                                    value={title}
                                    placeholder="Enter course title"
                                    required
                                />
                            </div>

                            {/* Short Description */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    onChange={(e) => setShortDescription(e.target.value)}
                                    value={shortdescription}
                                    placeholder="Brief description of your course"
                                />
                            </div>

                            {/* Full Description */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    rows="5"
                                    onChange={(e) => setDescription(e.target.value)}
                                    value={description}
                                    placeholder="Comprehensive description of course content and objectives"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <div className="relative">
                                    <select
                                        className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition duration-200"
                                        onChange={(e) => setCategory(e.target.value)}
                                        value={category}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.category}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Instructor */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
                                <div className="relative">
                                    <select
                                        className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition duration-200"
                                        onChange={(e) => setInstructor(e.target.value)}
                                        value={instructor}
                                    >
                                        <option value="">Select Instructor</option>
                                        {instructors.map((inst) => (
                                            <option key={inst._id} value={inst._id}>
                                                {inst.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Level */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                                <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 space-y-2 md:space-y-0 md:flex md:items-center md:space-x-6">
                                    {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                                        <label key={lvl} className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="level"
                                                value={lvl}
                                                className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                                                onChange={(e) => setLevel(e.target.value)}
                                                checked={level === lvl}
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{lvl}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                                <div className="relative rounded-lg shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        className="w-full pl-7 border border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                        onChange={(e) => setPrice(e.target.value)}
                                        value={price}
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            {/* Discount Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price</label>
                                <div className="relative rounded-lg shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        className="w-full pl-7 border border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                        onChange={(e) => setDiscountPrice(e.target.value)}
                                        value={discountprice}
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            {/* Thumbnail */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
                                <div className="mt-2 flex items-center">
                                    <div className="flex-shrink-0">
                                        {thumbnailpreview ? (
                                            <img
                                                src={thumbnailpreview}
                                                alt="Thumbnail Preview"
                                                className="h-40 w-40 object-cover rounded-lg shadow-md"
                                            />
                                        ) : (
                                            <div className="h-40 w-40 rounded-lg bg-gray-200 flex items-center justify-center">
                                                <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-5">
                                        <label className="cursor-pointer bg-white py-2 px-4 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200">
                                            <span>Upload Image</span>
                                            <input
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    setThumbnail(e.target.files[0]);
                                                    setThumbnailPreview(URL.createObjectURL(e.target.files[0]));
                                                }}
                                            />
                                        </label>
                                        <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="pt-6 border-t border-gray-200 flex justify-end space-x-3">
                           <Link to='/'><button
                                type="button"
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                            >
                                Cancel
                            </button></Link> 
                            <button
                                type="submit"
                                className="bg-blue-600 py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Course'}
                                {!loading && (
                                    <svg className="ml-2 -mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditCourse;