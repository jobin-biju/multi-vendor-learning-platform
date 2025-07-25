import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, ChevronDown, Upload } from 'lucide-react';

const FormPage = () => {
  // Form states
  const [category, setCategory] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('tourstorage')) || {});
  
  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    shortdescription: '',
    description: '',
    categoryId: '',
    level: '',
    instructorId: '',
    price: '',
    discountprice: '',
    thumbnail: null
  });
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState({ type: '', message: '' });
  const [previewUrl, setPreviewUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [formStep, setFormStep] = useState(1);

  // Load categories
  useEffect(() => {
    fetch('http://localhost:4000/multivendor/viewcategory')
      .then((res) => res.json())
      .then((result) => setCategory(result))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  // Load instructors
  useEffect(() => {
    if (!auth?.vendorid) return;

const payload = { vid: auth._id}; 

    fetch('http://localhost:4000/multivendor/viewinstructor', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((result) => setInstructors(result))
      .catch((err) => console.log('Instructor fetch error:', err));
  }, [auth]);

  // Get selected instructor data
  const selectedInstructor = instructors.find((inst) => inst._id === formData.instructorId);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      if (files && files[0]) {
        // Create preview URL for the image
        const fileUrl = URL.createObjectURL(files[0]);
        setPreviewUrl(fileUrl);
        setFormData({ ...formData, [name]: files[0] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.shortdescription.trim()) newErrors.shortdescription = 'Short description is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.categoryId) newErrors.categoryId = 'Please select a category';
    if (!formData.level) newErrors.level = 'Please select a level';
    if (!formData.instructorId) newErrors.instructorId = 'Please select an instructor';
    if (!formData.price) newErrors.price = 'Price is required';
    
    // Price validation
    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = 'Price must be a number';
    }
    
    if (formData.discountprice && isNaN(Number(formData.discountprice))) {
      newErrors.discountprice = 'Discount price must be a number';
    }
    
    // Thumbnail validation for step 2
    if (formStep === 2 && !formData.thumbnail) {
      newErrors.thumbnail = 'Please upload a thumbnail image';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateForm()) {
      setFormStep(2);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setFormStep(1);
  };

  // Submit form handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setFormFeedback({ type: '', message: '' });
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('shortdescription', formData.shortdescription);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('categoryid', formData.categoryId);
    formDataToSend.append('level', formData.level);
    formDataToSend.append('instructorid', formData.instructorId);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('discountprice', formData.discountprice);
    formDataToSend.append('thumbnail', formData.thumbnail);
formDataToSend.append('vendorid', auth.vendorid?._id || auth.vendorid);
   
    fetch('http://localhost:4000/multivendor/addcourse', {
      method: 'POST',
      body: formDataToSend,
    })
    .then((res) => res.json())
    .then((result) => {
      setIsSubmitting(false);
      setFormFeedback({ 
        type: 'success', 
        message: 'Course created successfully!' 
      });
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          title: '',
          shortdescription: '',
          description: '',
          categoryId: '',
          level: '',
          instructorId: '',
          price: '',
          discountprice: '',
          thumbnail: null
        });
        setPreviewUrl('');
        setFormStep(1);
      }, 2000);
    })
    .catch((err) => {
      setIsSubmitting(false);
      setFormFeedback({ 
        type: 'error', 
        message: 'Failed to create course. Please try again.' 
      });
      console.error('Error creating course:', err);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-6 px-8">
            <h1 className="text-2xl font-bold text-white">Create New Course</h1>
            <p className="text-blue-100 mt-1">Share your knowledge with the world</p>
          </div>

          {/* Progress steps */}
          <div className="px-8 pt-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${formStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  1
                </div>
                <div className="ml-3">
                  <p className="font-medium">Course Details</p>
                </div>
              </div>
              <div className="grow mx-4 h-1 bg-gray-200">
                <div className={`h-full ${formStep > 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              </div>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${formStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  2
                </div>
                <div className="ml-3">
                  <p className="font-medium">Media & Finish</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form feedback message */}
          {formFeedback.message && (
            <div className={`mx-8 p-4 mb-6 rounded-md ${formFeedback.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} flex items-center`}>
              {formFeedback.type === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              )}
              <p>{formFeedback.message}</p>
            </div>
          )}

          <form className="px-8 pb-8">
            {/* Step 1: Course Details */}
            {formStep === 1 && (
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g. Complete JavaScript Course 2025"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description*
                  </label>
                  <textarea
                    name="shortdescription"
                    value={formData.shortdescription}
                    onChange={handleChange}
                    rows="2"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.shortdescription ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="A brief overview of your course (displayed in search results)"
                  />
                  {errors.shortdescription && <p className="mt-1 text-sm text-red-600">{errors.shortdescription}</p>}
                </div>

                {/* Full Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Description*
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Detailed description of what students will learn from your course"
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category*
                  </label>
                  <div className="relative">
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select a category</option>
                      {category.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.category}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level*
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                      <label key={level} className="flex items-center">
                        <input
                          type="radio"
                          name="level"
                          value={level}
                          checked={formData.level === level}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={`ml-2 ${formData.level === level ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                          {level}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.level && <p className="mt-1 text-sm text-red-600">{errors.level}</p>}
                </div>

                {/* Instructor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructor*
                  </label>
                  <div className="relative">
                    <select
                      name="instructorId"
                      value={formData.instructorId}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.instructorId ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select an instructor</option>
                      {instructors.map((inst) => (
                        <option key={inst._id} value={inst._id}>
                          {inst.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.instructorId && <p className="mt-1 text-sm text-red-600">{errors.instructorId}</p>}
                </div>

                {/* Show instructor role if selected */}
                {selectedInstructor && (
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructor Role
                    </label>
                    <p className="text-blue-800 font-medium">{selectedInstructor.role}</p>
                  </div>
                )}

                {/* Price & Discount Price - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Regular Price*
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">₹</span>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`w-full pl-8 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Price <span className="text-gray-400">(Optional)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">₹</span>
                      <input
                        type="text"
                        name="discountprice"
                        value={formData.discountprice}
                        onChange={handleChange}
                        className={`w-full pl-8 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.discountprice ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.discountprice && <p className="mt-1 text-sm text-red-600">{errors.discountprice}</p>}
                  </div>
                </div>

                {/* Next button */}
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Continue to Media
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Media & Submit */}
            {formStep === 2 && (
              <div className="py-4 space-y-6">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Course Media</h3>
                
                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Thumbnail Image*
                  </label>
                  
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden">
                    <input
                      id="thumbnail-upload"
                      name="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    
                    <div className="space-y-1 text-center">
                      {previewUrl ? (
                        <div className="flex flex-col items-center">
                          <img 
                            src={previewUrl}
                            alt="Thumbnail preview" 
                            className="h-32 object-contain mb-4"
                          />
                          <p className="text-sm text-blue-600">Click to change image</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="thumbnail-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                              <span>Upload a file</span>
                              <input id="thumbnail-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {errors.thumbnail && <p className="mt-1 text-sm text-red-600">{errors.thumbnail}</p>}
                </div>

                {/* Navigation and Submit Buttons */}
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Back
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-6 py-2 bg-blue-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                  >
                    {isSubmitting ? 'Creating Course...' : 'Create Course'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormPage;




