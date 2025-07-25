import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaShoppingCart,
  FaTable,
  FaTasks,
  FaUser,
  FaBell,
  FaChartBar,
  FaChartLine,
  FaSun,
  FaMoon,
  FaBars,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaBook,
  FaLayerGroup,
  FaClipboardList,
  FaGraduationCap
} from "react-icons/fa";
import Course from "../Admincomponents/Course";
import Table from "../Admin/Table";
import Form from "../Admin/Form";
import Review from "../Admin/Review";
import VendorTable from "./VendorTable";
import Category from "../Admin/Category";
import DashboardContent from "./DashboardContent";
import Loader from "../Admincomponents/Loader";
import AdminCourseView from "./AdminCourseView";

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [showMenu, setShowMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 1024);
  const [notifications, setNotifications] = useState(3);
  const [isLoading, setIsLoading] = useState(true);

  const toggleUserMenu = () => setShowMenu(!showMenu);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const menuItems = [
    { 
      icon: <FaHome />, 
      text: "Dashboard", 
      description: "Overview & Analytics"
    },
    { 
      icon: <FaGraduationCap />, 
      text: "Student", 
      description: "Student Management"
    },
    { 
      icon: <FaUser />, 
      text: "Vendor", 
      description: "Vendor Dashboard" 
    },
    { 
      icon: <FaLayerGroup />, 
      text: "Category", 
      description: "Content Categories" 
    },
    { 
      icon: <FaClipboardList />, 
      text: "Revenue", 
      description: "Form Builder" 
    },
    { 
      icon: <FaBook />, 
      text: "course", 
      description: "Vendor course" 
    },
    { 
      icon: <FaBook />, 
      text: "Review", 
      description: "User Reviews" 
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const renderContent = () => {
    switch (activeItem) {
      case "Dashboard":
        return <DashboardContent darkMode={darkMode} />;
      case "NFT Marketplace":
        return <Course />;
      case "Student":
        return <Table darkMode={darkMode} />;
      case "Revenue":
        return <Form />;
      case "Review":
        return <Review />;
      case "Vendor":
        return <VendorTable />;
      case "Category":
        return <Category />;
      case "course":
        return <AdminCourseView/>;
      default:
        return (
          <h1 className={`text-2xl font-light ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {activeItem}
          </h1>
        );
    }
  };

  // Load Tailwind CSS dynamically
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

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 10);

    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarCollapsed(false);
      } else {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);

    // Optional: Remove script when component unmounts
    return () => {
      const script = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
      if (script) {
        document.head.removeChild(script);
        setTailwindReady(false);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!tailwindReady || isLoading) {
    return null;
  }

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile overlay */}
      {!sidebarCollapsed && window.innerWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-20" 
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`${sidebarCollapsed ? 'w-16' : 'w-64'} 
        ${darkMode ? 'bg-gray-800' : 'bg-white'} 
        fixed inset-y-0 left-0 transition-all duration-300 z-30 flex flex-col border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}
        ${sidebarCollapsed ? 'lg:translate-x-0' : 'translate-x-0'}
        ${sidebarCollapsed ? 'max-lg:-translate-x-full' : 'max-lg:translate-x-0'}`}
      >
        {/* Logo Section */}
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} h-16 px-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {!sidebarCollapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                E
              </div>
              <span className="font-semibold text-lg text-gray-900 dark:text-white">
                Elearn Pro
              </span>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
              E
            </div>
          )}
          {!sidebarCollapsed && (
            <button 
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={toggleSidebar}
            >
              <FaBars className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex-1 px-3 py-4 overflow-y-auto">
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150
                ${activeItem === item.text 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                  : `text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white`
                }`}
                onClick={() => setActiveItem(item.text)}
              >
                <span className={`${sidebarCollapsed ? '' : 'mr-3'}`}>
                  {item.icon}
                </span>
                {!sidebarCollapsed && (
                  <span>{item.text}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className={`px-3 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <button 
              className={`p-2 rounded-md transition-colors duration-150
              ${darkMode 
                ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              onClick={toggleDarkMode}
            >
              {darkMode ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
            </button>
            
            {!sidebarCollapsed && (
              <button 
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 rounded-md transition-colors duration-150"
              >
                <FaSignOutAlt className="w-4 h-4 mr-2" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Header */}
        <header className={`flex items-center justify-between h-16 px-6 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center">
            <button 
              className="mr-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
              onClick={toggleSidebar}
            >
              <FaBars className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            {/* Desktop toggle button */}
            <button 
              className="mr-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden lg:block"
              onClick={toggleSidebar}
            >
              <FaBars className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {activeItem}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button 
              className={`relative p-2 rounded-md transition-colors duration-150
              ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <FaBell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                  {notifications}
                </span>
              )}
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                className={`flex items-center space-x-2 p-2 rounded-md transition-colors duration-150
                ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
                onClick={toggleUserMenu}
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                  A
                </div>
                <span className="hidden md:inline-block text-sm font-medium">Admin</span>
              </button>
              
              {showMenu && (
                <div className={`absolute right-0 mt-2 w-48 py-1 rounded-md shadow-lg z-40 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`px-4 py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin User</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>admin@elearn.com</p>
                  </div>
                  
                  <a 
                    href="#" 
                    className={`flex items-center px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                    ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    <FaUserCircle className="w-4 h-4 mr-2" /> Your Profile
                  </a>
                  <a 
                    href="#" 
                    className={`flex items-center px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                    ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    <FaCog className="w-4 h-4 mr-2" /> Settings
                  </a>
                  <div className={`border-t my-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
                  <button 
                    onClick={handleLogout}
                    className={`flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 transition-colors w-full text-left`}
                  >
                    <FaSignOutAlt className="w-4 h-4 mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Breadcrumb */}
        <div className={`px-6 py-3 text-sm border-b ${darkMode ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
          <div className="flex items-center space-x-2">
            <span>Home</span>
            <span>/</span>
            <span className={darkMode ? 'text-white' : 'text-gray-900'}>{activeItem}</span>
          </div>
        </div>
        
        {/* Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;