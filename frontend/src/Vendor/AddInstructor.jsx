import React, { useState } from 'react';
import { UserPlus, Mail, Phone, Camera, Briefcase, Calendar, MapPin, Book, Lock } from 'lucide-react';

const AddInstructorForm = () => {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    dob: '',
    gender: '',
    address: '',
    education: '',
    password: '',
  });
  const [profile, setProfile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [errors, setErrors] = useState({});
  const auth = JSON.parse(localStorage.getItem('tourstorage'));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(selectedFile.type)) {
        setErrors({
          ...errors,
          profile: 'Please select a valid image file (JPEG, PNG, or GIF)'
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          profile: 'Image size should be less than 5MB'
        });
        return;
      }

      setProfile(selectedFile);
      setErrors({
        ...errors,
        profile: ''
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formValues.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formValues.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    
    // Email validation
    if (!formValues.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (optional but validate if provided)
    if (formValues.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formValues.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Password validation
    if (!formValues.password) {
      newErrors.password = 'Password is required';
    } else if (formValues.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formValues.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    // Date of birth validation (if provided)
    if (formValues.dob) {
      const dobDate = new Date(formValues.dob);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      
      if (isNaN(dobDate.getTime())) {
        newErrors.dob = 'Please enter a valid date';
      } else if (age < 18) {
        newErrors.dob = 'Instructor must be at least 18 years old';
      } else if (dobDate > today) {
        newErrors.dob = 'Date of birth cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField && document.getElementsByName(firstErrorField)[0]) {
        document.getElementsByName(firstErrorField)[0].focus();
      }
      return;
    }
    
    setLoading(true);
    setStatus({ type: '', message: '' });
    
    const formData = new FormData();
    formData.append('vid', auth._id);
    formData.append('name', formValues.name);
    formData.append('email', formValues.email);
    formData.append('phone', formValues.phone);
    if (profile) {
      formData.append('profile', profile);
    }
    formData.append('role', formValues.role);
    formData.append('dob', formValues.dob);
    formData.append('gender', formValues.gender);
    formData.append('address', formValues.address);
    formData.append('education', formValues.education);
    formData.append('password', formValues.password);
    formData.append('usertype', 3);

    fetch('http://localhost:4000/multivendor/addinstructor', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setLoading(false);
        
        if (result.error) {
          // Handle server validation errors or other issues
          setStatus({ 
            type: 'error', 
            message: result.error || 'Failed to add instructor. Please try again.' 
          });
          return;
        }
        
        setStatus({ 
          type: 'success', 
          message: 'Instructor added successfully!' 
        });
        
        // Reset form
        setFormValues({
          name: '',
          email: '',
          phone: '',
          role: '',
          dob: '',
          gender: '',
          address: '',
          education: '',
          password: '',
        });
        setProfile(null);
        setImagePreview(null);
        setErrors({});
      })
      .catch((err) => {
        console.error("Registration Error:", err);
        setLoading(false);
        setStatus({ 
          type: 'error', 
          message: 'Failed to add instructor. Please try again.' 
        });
      });
  };

  // Function to determine if a field has an error
  const hasError = (field) => errors[field] && errors[field] !== '';

  // Function to get input class based on error state
  const getInputClasses = (field) => {
    return `pl-10 block w-full rounded-md ${
      hasError(field)
        ? 'border-red-300 focus:border-red-500 focus:ring focus:ring-red-500'
        : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500'
    } focus:ring-opacity-50`;
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 py-6 px-8">
        <h2 className="text-white text-2xl font-bold flex items-center gap-2">
          <UserPlus size={24} />
          Add New Instructor
        </h2>
        <p className="text-purple-100 mt-1">Fill in the details to add a new instructor to your team</p>
      </div>
      
      {status.message && (
        <div className={`mx-8 mt-6 p-4 rounded-lg ${
          status.type === 'success' 
            ? 'bg-green-50 text-green-800 border-l-4 border-green-500' 
            : 'bg-red-50 text-red-800 border-l-4 border-red-500'
        }`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8">
        <div className="flex flex-col sm:flex-row gap-8 mb-6">
          {/* Profile picture section */}
          <div className="flex flex-col items-center justify-center">
            <div className={`w-32 h-32 rounded-full ${hasError('profile') ? 'border-red-300' : 'border-gray-300'} bg-gray-100 border-2 border-dashed flex items-center justify-center mb-4 overflow-hidden`}>
              {imagePreview ? (
                <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <Camera size={40} className="text-gray-400" />
              )}
            </div>
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-full transition duration-300 flex items-center gap-2">
              <Camera size={16} />
              Upload Photo
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
            {profile && (
              <p className="mt-2 text-sm text-gray-500">{profile.name}</p>
            )}
            {hasError('profile') && (
              <p className="mt-1 text-sm text-red-600">{errors.profile}</p>
            )}
          </div>

          {/* Form fields */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserPlus size={18} className={`${hasError('name') ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  className={getInputClasses('name')}
                  placeholder="John Doe"
                />
              </div>
              {hasError('name') && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className={`${hasError('email') ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  className={getInputClasses('email')}
                  placeholder="john@example.com"
                />
              </div>
              {hasError('email') && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className={`${hasError('phone') ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formValues.phone}
                  onChange={handleInputChange}
                  className={getInputClasses('phone')}
                  placeholder="+1 (123) 456-7890"
                />
              </div>
              {hasError('phone') && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase size={18} className={`${hasError('role') ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  name="role"
                  value={formValues.role}
                  onChange={handleInputChange}
                  className={getInputClasses('role')}
                  placeholder="Yoga Instructor"
                />
              </div>
              {hasError('role') && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className={`${hasError('dob') ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="date"
                  name="dob"
                  value={formValues.dob}
                  onChange={handleInputChange}
                  className={getInputClasses('dob')}
                />
              </div>
              {hasError('dob') && (
                <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formValues.gender}
                onChange={handleInputChange}
                className={`block w-full rounded-md ${
                  hasError('gender')
                    ? 'border-red-300 focus:border-red-500 focus:ring focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500'
                } focus:ring-opacity-50`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {hasError('gender') && (
                <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
              )}
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Book size={18} className={`${hasError('education') ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  name="education"
                  value={formValues.education}
                  onChange={handleInputChange}
                  className={getInputClasses('education')}
                  placeholder="BSc in Sports Science"
                />
              </div>
              {hasError('education') && (
                <p className="mt-1 text-sm text-red-600">{errors.education}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className={`${hasError('password') ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleInputChange}
                  className={getInputClasses('password')}
                  placeholder="••••••••"
                />
              </div>
              {hasError('password') && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <MapPin size={18} className={`${hasError('address') ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <textarea
              name="address"
              value={formValues.address}
              onChange={handleInputChange}
              rows="3"
              className={`pl-10 block w-full rounded-md ${
                hasError('address')
                  ? 'border-red-300 focus:border-red-500 focus:ring focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500'
              } focus:ring-opacity-50`}
              placeholder="Enter full address"
            ></textarea>
          </div>
          {hasError('address') && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button 
            type="button"
            onClick={() => {
              setFormValues({
                name: '',
                email: '',
                phone: '',
                role: '',
                dob: '',
                gender: '',
                address: '',
                education: '',
                password: '',
              });
              setProfile(null);
              setImagePreview(null);
              setErrors({});
            }}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Add Instructor"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInstructorForm;