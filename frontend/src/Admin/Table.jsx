import React, { useEffect, useState } from 'react';
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaUserGraduate, FaUsers, FaEnvelope, FaPhone } from 'react-icons/fa';

function Table({ darkMode }) {
  const [view, setView] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Fetch data
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:4000/multivendor/viewstudent', {
      method: 'GET',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setView(result);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // Sort function
  const requestSort = (key) => {
    let direction = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  // Apply sorting
  const sortedItems = React.useMemo(() => {
    let sortableItems = [...view];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const keyParts = sortConfig.key.split('.');
        let aValue = a;
        let bValue = b;
        
        for (const part of keyParts) {
          aValue = aValue?.[part];
          bValue = bValue?.[part];
        }
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [view, sortConfig]);

  // Filter by search term
  const filteredItems = sortedItems.filter(item => {
    const searchText = searchTerm.toLowerCase();
    
    // Safe string conversion for search
    const getName = () => item.vendorid?.name ? String(item.vendorid.name).toLowerCase() : '';
    const getPhone = () => item.vendorid?.phone ? String(item.vendorid.phone).toLowerCase() : '';
    const getEmail = () => item.email ? String(item.email).toLowerCase() : '';
    
    return (
      getName().includes(searchText) ||
      getPhone().includes(searchText) ||
      getEmail().includes(searchText)
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get sorting indicator
  const getSortIcon = (name) => {
    if (sortConfig.key !== name) {
      return <FaSort className="text-gray-400 ml-2 text-xs opacity-60" />;
    }
    return sortConfig.direction === 'ascending' ? 
      <FaSortUp className="text-blue-500 ml-2 text-xs" /> : 
      <FaSortDown className="text-blue-500 ml-2 text-xs" />;
  };

  // Generate gradient colors for avatars
  const getGradientColor = (index) => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-blue-600',
      'from-purple-500 to-pink-600',
      'from-yellow-500 to-orange-600',
      'from-red-500 to-pink-600',
      'from-indigo-500 to-purple-600',
      'from-teal-500 to-blue-600',
      'from-orange-500 to-red-600'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className={`rounded-2xl shadow-xl overflow-hidden border ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700' 
        : 'bg-gradient-to-br from-white via-slate-50 to-white border-slate-200'
    }`}>
      {/* Enhanced Header */}
      <div className={`px-8 py-6 border-b backdrop-blur-sm ${
        darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white/50'
      }`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${
              darkMode 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25'
            }`}>
              <FaUserGraduate className="text-white text-xl" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-slate-800'
              }`}>
                Student Directory
              </h2>
              <p className={`text-sm ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Manage and view student information
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              darkMode 
                ? 'bg-blue-900/50 border border-blue-700/50' 
                : 'bg-blue-50 border border-blue-200'
            }`}>
              <FaUsers className={`text-sm ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <span className={`text-sm font-semibold ${
                darkMode ? 'text-blue-300' : 'text-blue-700'
              }`}>
                {filteredItems.length} Students
              </span>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-80 pl-12 pr-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:scale-105 ${
                  darkMode 
                    ? 'bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 hover:bg-slate-700' 
                    : 'bg-white border border-slate-300 text-slate-800 placeholder-slate-500 hover:border-slate-400 shadow-sm'
                }`}
              />
              <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-sm ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className={`flex flex-col justify-center items-center h-80 ${
            darkMode ? 'text-white' : 'text-slate-800'
          }`}>
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
            </div>
            <p className="mt-6 text-lg font-medium">Loading students...</p>
          </div>
        ) : view.length === 0 ? (
          <div className={`flex flex-col justify-center items-center h-80 ${
            darkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <div className={`p-6 rounded-full ${
              darkMode ? 'bg-slate-800' : 'bg-slate-100'
            }`}>
              <FaUserGraduate className="text-6xl opacity-30" />
            </div>
            <p className="mt-4 text-xl font-medium">No students found</p>
            <p className="text-sm mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          <table className="min-w-full">
            <thead className={`${
              darkMode 
                ? 'bg-gradient-to-r from-slate-800 to-slate-700' 
                : 'bg-gradient-to-r from-slate-50 to-slate-100'
            }`}>
              <tr>
                <th 
                  scope="col" 
                  className={`px-8 py-6 text-left text-xs font-bold uppercase tracking-wider cursor-pointer select-none transition-all duration-200 hover:bg-blue-500/10 ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}
                  onClick={() => requestSort('vendorid.name')}
                >
                  <div className="flex items-center">
                    <FaUserGraduate className="mr-2 text-blue-500" />
                    Student Name
                    {getSortIcon('vendorid.name')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className={`px-8 py-6 text-left text-xs font-bold uppercase tracking-wider cursor-pointer select-none transition-all duration-200 hover:bg-blue-500/10 ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}
                  onClick={() => requestSort('vendorid.phone')}
                >
                  <div className="flex items-center">
                    <FaPhone className="mr-2 text-green-500" />
                    Phone Number
                    {getSortIcon('vendorid.phone')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className={`px-8 py-6 text-left text-xs font-bold uppercase tracking-wider cursor-pointer select-none transition-all duration-200 hover:bg-blue-500/10 ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}
                  onClick={() => requestSort('email')}
                >
                  <div className="flex items-center">
                    <FaEnvelope className="mr-2 text-purple-500" />
                    Email Address
                    {getSortIcon('email')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              darkMode ? 'divide-slate-700' : 'divide-slate-200'
            }`}>
              {currentItems.map((student, index) => (
                <tr 
                  key={index} 
                  className={`transition-all duration-200 hover:scale-[1.005] ${
                    darkMode 
                      ? 'hover:bg-slate-800/50 hover:shadow-lg' 
                      : 'hover:bg-slate-50/50 hover:shadow-md'
                  }`}
                >
                  <td className={`px-8 py-6 whitespace-nowrap ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className={`flex-shrink-0 h-14 w-14 rounded-full bg-gradient-to-r ${getGradientColor(index)} flex items-center justify-center text-white font-bold text-lg shadow-lg transform transition-transform duration-200 hover:scale-110`}>
                        {student.vendorid?.name ? student.vendorid.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-lg ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {student.vendorid?.name || 'Unknown Student'}
                        </div>
                        <div className={`text-sm font-medium ${
                          darkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          ID: {student._id?.slice(-8).toUpperCase() || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={`px-8 py-6 whitespace-nowrap ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${
                        darkMode ? 'bg-green-900/30' : 'bg-green-50'
                      }`}>
                        <FaPhone className={`text-xs ${
                          darkMode ? 'text-green-400' : 'text-green-600'
                        }`} />
                      </div>
                      <span className="font-medium">
                        {student.vendorid?.phone || 'Not provided'}
                      </span>
                    </div>
                  </td>
                  <td className={`px-8 py-6 whitespace-nowrap ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${
                        darkMode ? 'bg-purple-900/30' : 'bg-purple-50'
                      }`}>
                        <FaEnvelope className={`text-xs ${
                          darkMode ? 'text-purple-400' : 'text-purple-600'
                        }`} />
                      </div>
                      <span className="font-medium truncate max-w-xs">
                        {student.email || 'Not provided'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Enhanced Pagination */}
      {filteredItems.length > itemsPerPage && (
        <div className={`px-8 py-6 flex items-center justify-between border-t backdrop-blur-sm ${
          darkMode ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-white/50'
        }`}>
          <div className={`text-sm font-medium ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Showing <span className="font-bold text-blue-500">{indexOfFirstItem + 1}</span> to{' '}
            <span className="font-bold text-blue-500">{Math.min(indexOfLastItem, filteredItems.length)}</span> of{' '}
            <span className="font-bold text-blue-500">{filteredItems.length}</span> students
          </div>
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === 1 
                  ? (darkMode ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed') 
                  : (darkMode ? 'bg-slate-700 text-white hover:bg-slate-600 hover:scale-105' : 'bg-white text-slate-700 hover:bg-slate-50 hover:scale-105 shadow-sm')
              }`}
            >
              Previous
            </button>
            <div className="flex space-x-1">
              {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    currentPage === i + 1
                      ? (darkMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-110' : 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-110')
                      : (darkMode ? 'bg-slate-700 text-white hover:bg-slate-600 hover:scale-105' : 'bg-white text-slate-700 hover:bg-slate-50 hover:scale-105 shadow-sm')
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => paginate(currentPage < Math.ceil(filteredItems.length / itemsPerPage) ? currentPage + 1 : currentPage)}
              disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === Math.ceil(filteredItems.length / itemsPerPage)
                  ? (darkMode ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed')
                  : (darkMode ? 'bg-slate-700 text-white hover:bg-slate-600 hover:scale-105' : 'bg-white text-slate-700 hover:bg-slate-50 hover:scale-105 shadow-sm')
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

export default Table;