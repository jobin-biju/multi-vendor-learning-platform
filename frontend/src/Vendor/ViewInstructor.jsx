import React, { useEffect, useState } from 'react';
import url from './ImageUrl';
import { Trash2, Search, RefreshCw, UserPlus, Filter, MoreVertical, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

function ViewInstructor() {
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showDropdownId, setShowDropdownId] = useState(null);
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('tourstorage')));

  // Fetch instructors on component mount
  useEffect(() => {
    fetchInstructors();
  }, []);

  // Filter instructors whenever search term or active filter changes
  useEffect(() => {
    filterInstructors();
  }, [searchTerm, activeFilter, instructors]);

  const filterInstructors = () => {
    let filtered = [...instructors];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(instructor => 
        instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply role filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(instructor => 
        instructor.role.toLowerCase() === activeFilter.toLowerCase()
      );
    }
    
    setFilteredInstructors(filtered);
  };

  const fetchInstructors = () => {
    setLoading(true);
    const ids = {
      vid: auth._id
    };

    fetch('http://localhost:4000/multivendor/viewinstructor', {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json",
      },
      body: JSON.stringify(ids),
    })
      .then((res) => res.json())
      .then((result) => {
        setInstructors(result);
        setFilteredInstructors(result);
        setLoading(false);
      })
      .catch((err) => {
        console.log('Error fetching instructors:', err);
        setError('Failed to load instructors');
        setLoading(false);
      });
  };
  
  const handleDelete = (delid) => {
    setIsDeleting(true);
    
    const idss = {
      id: delid
    };

    fetch('http://localhost:4000/multivendor/deleteinstructor', {
      method: "post",
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify(idss)
    })
      .then((res) => res.json())
      .then((result) => {
        // Remove instructor from state
        setInstructors(prevInstructors => 
          prevInstructors.filter(instructor => instructor._id !== delid)
        );
        setIsDeleting(false);
        
        // Show toast notification
        showNotification('Instructor deleted successfully');
      })
      .catch(err => {
        console.error("Delete failed:", err);
        setIsDeleting(false);
        showNotification('Failed to delete instructor', 'error');
      });
  };

  const confirmDelete = (id, name) => {
    // Using a more stylish custom modal would be better in production
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      handleDelete(id);
    }
  };
  
  const showNotification = (message, type = 'success') => {
    // In production, replace with a proper toast notification system
    alert(message);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleDropdown = (id) => {
    setShowDropdownId(showDropdownId === id ? null : id);
  };

  // Get unique roles for filtering
  const roles = ['all', ...new Set(instructors.map(item => item.role.toLowerCase()))];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-white rounded-lg shadow p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading instructors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <button 
              onClick={fetchInstructors}
              className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-300"
            >
              <RefreshCw size={16} />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Instructor Management</h1>
          <p className="text-gray-600 mt-1">Manage your team of instructors</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search instructors..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          {/* <Link to="/addinstructor" className="flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-300">
            <UserPlus size={18} />
            <span>Add Instructor</span>
          </Link> */}
        </div>
      </div>
      
      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {roles.map(role => (
          <button
            key={role}
            onClick={() => setActiveFilter(role)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 ${
              activeFilter === role 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Instructors Grid/List */}
      {filteredInstructors.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-indigo-100 p-4">
              <Filter size={32} className="text-indigo-500" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">No instructors found</h3>
          <p className="text-gray-600 mt-2">
            {searchTerm || activeFilter !== 'all' 
              ? "Try adjusting your search or filter criteria" 
              : "Start by adding your first instructor"}
          </p>
          {(searchTerm || activeFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors duration-300"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInstructors.map((instructor) => (
            <div key={instructor._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative">
                {/* Dropdown menu */}
                <div className="absolute top-2 right-2 z-10">
                  <button 
                    onClick={() => toggleDropdown(instructor._id)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical size={20} className="text-gray-600" />
                  </button>
                  
                  {showDropdownId === instructor._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                      <button 
                        onClick={() => {
                          toggleDropdown(null);
                          // Handle edit (link to edit page)
                          console.log("Edit", instructor._id);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Edit size={16} />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => {
                          toggleDropdown(null);
                          confirmDelete(instructor._id, instructor.name);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Background header */}
                <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                
                {/* Profile image */}
                <div className="absolute left-4 top-12 border-4 border-white rounded-full">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                    <img 
                      src={url + instructor.profile} 
                      alt={instructor.name} 
                      className="object-cover h-full w-full"
                      onError={(e) => { e.target.src = "/api/placeholder/96/96"; e.target.alt = "No Image" }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-16 pb-6 px-6">
                <h3 className="text-xl font-bold text-gray-800">{instructor.name}</h3>
                <div className="flex items-center mt-1">
                  <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    {instructor.role}
                  </span>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-start">
                    <div className="text-gray-500 font-medium w-20 flex-shrink-0">Email:</div>
                    <div className="text-gray-800 truncate">{instructor.email}</div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-gray-500 font-medium w-20 flex-shrink-0">Phone:</div>
                    <div className="text-gray-800">{instructor.phone || "—"}</div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-gray-500 font-medium w-20 flex-shrink-0">Gender:</div>
                    <div className="text-gray-800">{instructor.gender || "—"}</div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-gray-500 font-medium w-20 flex-shrink-0">Education:</div>
                    <div className="text-gray-800 truncate">{instructor.education || "—"}</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={() => confirmDelete(instructor._id, instructor.name)}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded flex items-center justify-center gap-1 transition-colors duration-300"
                    disabled={isDeleting}
                  >
                    <Trash2 size={16} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewInstructor;