import React, { useState, useEffect } from 'react';
import { Menu, ChevronLeft, ChevronRight, Book, PlusCircle,MessageCircle , ShoppingCart, User, LogOut, BarChart3, Bell ,GraduationCap, LayoutGrid} from 'lucide-react';
import InstructorCourseView from './InstructorCourseView';
import AddSection from './AddSection';
import AddLesson from './AddLesson';
import ViewLesson from './ViewLesson';
import ViewLearner from './ViewLearner';
import InstructorChat from './InstructorChat'

const VendorSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [tailwindReady, setTailwindReady] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  const menuItems = [
    { id: 'dashboard', icon: <BarChart3 className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'mycourse', icon: <GraduationCap  className="w-5 h-5" />, label: 'My Course' },
    { id: 'add-section', icon: <LayoutGrid className="w-5 h-5" />, label: 'Add Section' },
    { id: 'add-lesson', icon: <PlusCircle className="w-5 h-5" />, label: 'Add lesson ' },
    { id: 'view-learner', icon: <PlusCircle className="w-5 h-5" />, label: 'View learner' },
    { id: 'chats', icon: <MessageCircle  className="w-5 h-5" />, label: 'chats' }
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    // Show notification when changing menu items (for demo purposes)
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

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
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Modified to conditionally render Course component when dashboard is selected
  const renderContent = () => {
    // If dashboard is selected, render the Course component
    if (activeMenu === 'mycourse') {
      return <InstructorCourseView/>;
    }else if (activeMenu === 'add-section'){
      return <AddSection/>;
    }else if (activeMenu === 'add-lesson'){
      return <AddLesson/>
    }else if (activeMenu === 'dashboard'){
      return <ViewLesson/>
    }else if(activeMenu === 'view-learner'){
      return <ViewLearner/>
    }else if (activeMenu === 'chats'){
      return <InstructorChat/>
    }
    // For all other menu items, render the default content
    return (
      <div className="p-6 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}</h2>
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <p className="text-gray-700">Content for {activeMenu} will be displayed here</p>
        </div>
      </div>
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href="/";
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Notification Toast */}
      <div 
        className={`fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 transform ${
          showNotification ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}
      >
        Navigated to {activeMenu}
      </div>
      
      {/* Fixed Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full ${
          collapsed ? 'w-20' : 'w-64'
        } bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-900 text-white shadow-xl transition-all duration-300 ease-in-out z-20 flex flex-col`}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between p-5 border-b border-blue-700/50 backdrop-blur-sm bg-blue-900/30">
          {!collapsed && (
            <div className="flex items-center group">
              <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center transform group-hover:rotate-90 transition-all duration-300">
                <Menu className="w-5 h-5 text-blue-100" />
              </div>
              <h5 className="font-bold text-lg ml-3 text-blue-50">
                Instructor<span className="text-blue-300 animate-pulse">Hub</span>
              </h5>
            </div>
          )}
          <button 
            onClick={toggleSidebar} 
            className={`w-8 h-8 rounded-full flex items-center justify-center bg-blue-800 hover:bg-blue-700 text-blue-100 focus:outline-none transition-all duration-200 ease-in-out hover:shadow-lg ${
              collapsed ? 'mx-auto hover:scale-110' : 'hover:rotate-180'
            }`}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-5 px-3 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700">
          {menuItems.map(item => (
            <div 
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`flex items-center cursor-pointer rounded-lg py-3 px-4 mb-2 transition-all duration-300
                          ${collapsed ? 'justify-center' : 'justify-start'} 
                          ${activeMenu === item.id 
                            ? 'bg-blue-700/50 text-blue-200 shadow-md transform scale-105' 
                            : 'hover:bg-blue-800/30 text-blue-200 hover:translate-x-1'}`}
            >
              <div className={`transition-transform duration-300 ${activeMenu === item.id ? 'text-blue-300 scale-110' : 'text-blue-300'}`}>
                {item.icon}
              </div>
              {!collapsed && (
                <span className={`ml-3 text-sm transition-all duration-200 ${activeMenu === item.id ? 'font-medium' : 'font-normal'}`}>
                  {item.label}
                </span>
              )}
              {!collapsed && activeMenu === item.id && (
                <div className="ml-auto w-1.5 h-6 rounded-full bg-blue-300 animate-pulse"></div>
              )}
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div 
          className={`flex items-center cursor-pointer py-4 px-4 mx-3 mb-5 rounded-lg
                      hover:bg-red-500/20 transition-all duration-300 group
                      ${collapsed ? 'justify-center' : 'justify-start'}`}
          onClick={() => handleMenuClick('logout')}
        >
          <LogOut className="w-5 h-5 text-red-300 group-hover:rotate-12 transition-transform duration-300" />
          {!collapsed && (
            <span className="ml-3 text-sm text-red-200 group-hover:text-red-100 transition-colors duration-300" onClick={handleLogout}>
              Logout
            </span>
          )}
        </div>
        
        {/* Version Label */}
        {!collapsed && (
          <div className="text-center py-3 text-xs text-blue-400 font-medium bg-blue-900/20 backdrop-blur-sm">
            InstructorHub v2.1
          </div>
        )}
      </div>

      {/* Main Content Area with proper margin to account for fixed sidebar */}
      <div className={`flex-1 ${collapsed ? 'ml-20' : 'ml-64'} transition-all duration-300 ease-in-out`}>
        {/* Top Navigation */}
        <div className="bg-white shadow-sm p-4 flex justify-between items-center backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-800 transition-all duration-300">
            {activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}
          </h1>
          <div className="flex items-center space-x-5">
            {/* <div className="relative cursor-pointer group">
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full group-hover:animate-ping"></span>
              <Bell className="w-5 h-5 text-gray-600 hover:text-blue-600 transition-colors duration-300" />
            </div> */}
            {/* <div className="relative cursor-pointer group">
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full group-hover:animate-ping"></span>
              <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-blue-600 transition-colors duration-300" />
            </div> */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold cursor-pointer hover:shadow-lg hover:scale-110 transition-all duration-300">
              I
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="p-6 overflow-y-auto bg-gray-50" style={{height: "calc(100vh - 72px)"}}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default VendorSidebar;

// import React from 'react'

// function VendorSidebar() {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default VendorSidebar
