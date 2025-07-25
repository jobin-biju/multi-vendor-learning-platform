import React, { useEffect, useState } from 'react';
import { Plus, X, Search, List, Trash2, Edit, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CategoryPage = () => {
  // State to control modal visibility
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [viewcategory, setViewCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Toggle modal functions
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCategory = () => {
    if (!category.trim()) {
      showNotification('Category name is required', 'error');
      return;
    }

    setIsLoading(true);
    let data = {
      category: category,
      description: description
    };

    fetch('http://localhost:4000/multivendor/category', {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setCategory('');
        setDescription('');
        closeModal();
        showNotification('Category added successfully!');
        fetchCategories();
      })
      .catch(error => {
        console.error("Error adding category:", error);
        showNotification('Failed to add category', 'error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchCategories = () => {
    setIsLoading(true);
    fetch('http://localhost:4000/multivendor/viewcategory')
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setViewCategory(result);
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = (delid) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setIsLoading(true);
      let ids = {
        id: delid
      };
      fetch('http://localhost:4000/multivendor/deletecategory', {
        method: 'POST',
        headers: {
          Accept: "application/json",
          'Content-Type': "application/json"
        },
        body: JSON.stringify(ids)
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          showNotification('Category deleted successfully!');
          fetchCategories();
        })
        .catch(error => {
          console.error("Error deleting category:", error);
          showNotification('Failed to delete category', 'error');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const filteredCategories = viewcategory.filter(item =>
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen py-8 px-4">
      {/* Notification */}
      {notification && (
        <div 
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center transition-all transform animate-fade-in ${
            notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
          style={{
            animation: 'slideIn 0.3s ease-out forwards'
          }}
        >
          {notification.type === 'success' ? (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          ) : (
            <AlertTriangle className="w-5 h-5 mr-2" />
          )}
          {notification.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Main content container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <List size={24} />
                </div>
                <h1 className="text-2xl font-bold">Course Categories</h1>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  />
                </div>
                
                <button 
                  onClick={openModal}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-all hover:shadow-lg"
                >
                  <Plus size={18} />
                  <span>Add Category</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Table section */}
          <div className="p-6">
            <div className="overflow-x-auto rounded-xl shadow-sm border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {isLoading ? (
                    Array(3).fill(0).map((_, index) => (
                      <tr key={`loading-${index}`} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-slate-200 rounded w-full"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center space-x-2">
                            <div className="h-8 bg-slate-200 rounded w-16"></div>
                            <div className="h-8 bg-slate-200 rounded w-16"></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : filteredCategories.length > 0 ? (
                    filteredCategories.map((item, index) => (
                      <tr 
                        key={index} 
                        className="hover:bg-blue-50 transition-all duration-300"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                              {item.category.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900">{item.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600 line-clamp-2">{item.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-2">
                            <Link 
                              to={'/edit'} 
                              state={{id: item._id}}
                              className="inline-flex items-center px-3 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-200 transition-all duration-200"
                            >
                              <Edit size={16} className="mr-1" />
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="inline-flex items-center px-3 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-all duration-200"
                            >
                              <Trash2 size={16} className="mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="bg-slate-100 p-4 rounded-full mb-4">
                            <AlertTriangle size={32} className="text-slate-400" />
                          </div>
                          <p className="text-slate-500 font-medium">No categories found</p>
                          {searchTerm && (
                            <p className="text-slate-400 text-sm mt-1">
                              Try adjusting your search term
                            </p>
                          )}
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              openModal();
                            }}
                            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-all"
                          >
                            <Plus size={16} className="mr-1" />
                            Add your first category
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
            style={{
              animation: 'modalSlideIn 0.3s ease-out forwards'
            }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white flex items-center">
                <Plus size={20} className="mr-2" />
                Add New Category
              </h3>
              <button 
                onClick={closeModal}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Enter category name"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter category description"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                ></textarea>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex justify-end gap-2 border-t border-slate-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCategory}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes modalSlideIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CategoryPage;