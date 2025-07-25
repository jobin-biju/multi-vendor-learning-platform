import React, { useEffect, useState } from 'react';
import { Plus, Loader2, CheckCircle, XCircle } from 'lucide-react';

function AddSection() {
  const [section, setSection] = useState('');
  const [sectionView, setSectionView] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSection = () => {
    if (!section.trim()) {
      setMessage({ text: 'Please enter a section name', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return;
    }

    setIsSubmitting(true);
    let data = { section: section };
    
    fetch('http://localhost:4000/multivendor/addsection', {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify(data)
    })
    .then((res) => res.json())
    .then((result) => {
      setSection('');
      setMessage({ text: 'Section added successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      fetchSections();
    })
    .catch(error => {
      setMessage({ text: 'Failed to add section', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  const fetchSections = () => {
    setIsLoading(true);
    fetch("http://localhost:4000/multivendor/viewsec")
      .then((res) => res.json())
      .then((result) => {
        setSectionView(result);
      })
      .catch(error => {
        console.error("Error fetching sections:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchSections();
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
            <h1 className="text-2xl font-bold text-white">Course Section Management</h1>
            <p className="text-blue-100 mt-1">Create and manage your course sections</p>
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
                  <XCircle className="h-5 w-5 mr-2" />
                )}
                {message.text}
              </div>
            )}

            {/* Add Section Form */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Section</h2>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
                    Section Name
                  </label>
                  <input
                    id="section"
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter section name"
                  />
                </div>
                <div className="md:self-end">
                  <button
                    onClick={handleSection}
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Section
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Sections Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Available Sections</h2>
                {isLoading && (
                  <div className="flex items-center text-blue-600">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Loading...
                  </div>
                )}
              </div>
              
              {sectionView.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Section Name
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sectionView.map((item, index) => (
                        <tr 
                          key={index} 
                          className="hover:bg-gray-50 transition duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {item.section}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-dashed border-gray-200">
                  <div className="text-gray-400 mb-2">No sections available</div>
                  <p className="text-sm text-gray-500">Add your first section using the form above</p>
                </div>
              )}
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

export default AddSection;