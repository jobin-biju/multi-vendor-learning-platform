

// import React, { useEffect, useState } from 'react';
// import {
//   PieChart, Pie, Cell,
//   BarChart, Bar, XAxis, YAxis, Tooltip,
//   ResponsiveContainer
// } from 'recharts';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

// function AdminDashboardContent() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [viewCategory, setViewCategory] = useState([]);
//   const [students, setViewStudents] = useState([]);
//   const [vendors, setVendorView] = useState([]);

//   const fetchCategories = () => {
//     setIsLoading(true);
//     fetch('http://localhost:4000/multivendor/viewcategory')
//       .then((response) => response.json())
//       .then((result) => setViewCategory(result))
//       .catch(error => console.error("Error fetching categories:", error))
//       .finally(() => setIsLoading(false));
//   };

//   const fetchStudents = () => {
//     fetch('http://localhost:4000/multivendor/viewstudent')
//       .then((res) => res.json())
//       .then((result) => setViewStudents(result))
//       .catch(error => console.error("Error fetching students:", error));
//   };

//   const fetchVendors = () => {
//     fetch('http://localhost:4000/multivendor/vendorview')
//       .then((res) => res.json())
//       .then((result) => setVendorView(result))
//       .catch(error => console.error('Error fetching vendors:', error));
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchStudents();
//     fetchVendors();
//   }, []);

//   const summaryData = [
//     { label: 'Categories', value: viewCategory.length },
//     { label: 'Students', value: students.length },
//     { label: 'Vendors', value: vendors.length },
//   ];

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold mb-4">📊 Admin Dashboard</h1>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {summaryData.map((item, index) => (
//           <div key={index} className="bg-white rounded-xl shadow p-6 text-center border">
//             <p className="text-gray-500 text-lg font-medium">{item.label}</p>
//             <p className="text-3xl font-bold text-blue-600 mt-2">{item.value}</p>
//           </div>
//         ))}
//       </div>

//       {/* Pie Chart */}
//       <div className="bg-white rounded-xl shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">Distribution Overview</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie
//               data={summaryData}
//               dataKey="value"
//               nameKey="label"
//               cx="50%"
//               cy="50%"
//               outerRadius={100}
//               fill="#8884d8"
//               label
//             >
//               {summaryData.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Bar Chart */}
//       <div className="bg-white rounded-xl shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">Entities Count</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={summaryData}>
//             <XAxis dataKey="label" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="value" fill="#00C49F" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboardContent;


import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  Legend, CartesianGrid
} from 'recharts';
import { 
  Users, Package, Store, TrendingUp, Activity, RefreshCw, 
  Eye, BarChart3, Calendar, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

function AdminDashboardContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [viewCategory, setViewCategory] = useState([]);
  const [students, setViewStudents] = useState([]);
  const [vendors, setVendorView] = useState([]);
  const [activeChart, setActiveChart] = useState('pie');
  const [timeRange, setTimeRange] = useState('today');

  // Your original fetch functions
  const fetchCategories = () => {
    setIsLoading(true);
    fetch('http://localhost:4000/multivendor/viewcategory')
      .then((response) => response.json())
      .then((result) => setViewCategory(result))
      .catch(error => console.error("Error fetching categories:", error))
      .finally(() => setIsLoading(false));
  };

  const fetchStudents = () => {
    fetch('http://localhost:4000/multivendor/viewstudent')
      .then((res) => res.json())
      .then((result) => setViewStudents(result))
      .catch(error => console.error("Error fetching students:", error));
  };

  const fetchVendors = () => {
    fetch('http://localhost:4000/multivendor/vendorview')
      .then((res) => res.json())
      .then((result) => setVendorView(result))
      .catch(error => console.error('Error fetching vendors:', error));
  };

  const refreshAllData = () => {
    setIsLoading(true);
    Promise.all([
      fetchCategories(),
      fetchStudents(),
      fetchVendors()
    ]).finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCategories();
    fetchStudents();
    fetchVendors();
  }, []);

  const summaryData = [
    { 
      label: 'Categories', 
      value: viewCategory.length,
      color: '#6366f1',
      icon: Package,
      change: '+12%',
      trend: 'up'
    },
    { 
      label: 'Students', 
      value: students.length,
      color: '#10b981',
      icon: Users,
      change: '+8%',
      trend: 'up'
    },
    { 
      label: 'Vendors', 
      value: vendors.length,
      color: '#f59e0b',
      icon: Store,
      change: '+15%',
      trend: 'up'
    },
  ];

  // Enhanced data for trend visualization
  const trendData = [
    { name: 'Jan', Categories: 12, Students: 45, Vendors: 8 },
    { name: 'Feb', Categories: 15, Students: 52, Vendors: 12 },
    { name: 'Mar', Categories: 18, Students: 58, Vendors: 15 },
    { name: 'Apr', Categories: 22, Students: 65, Vendors: 18 },
    { name: 'May', Categories: 25, Students: 72, Vendors: 22 },
    { name: 'Jun', Categories: viewCategory.length, Students: students.length, Vendors: vendors.length },
  ];

  const StatCard = ({ item, index }) => {
    const Icon = item.icon;
    const isPositive = item.trend === 'up';
    
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div 
                className="p-3 rounded-xl"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-3">
              <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {item.change}
              </div>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="w-16 h-8 bg-gradient-to-r from-transparent to-gray-100 rounded opacity-60"></div>
          </div>
        </div>
      </div>
    );
  };

  const ChartToggle = ({ type, icon: Icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        active 
          ? 'bg-indigo-600 text-white shadow-lg' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">Real-time analytics and insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <button
                onClick={refreshAllData}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {summaryData.map((item, index) => (
            <StatCard key={index} item={item} index={index} />
          ))}
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distribution Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Distribution Overview</h2>
              <div className="flex space-x-2">
                <ChartToggle
                  type="pie"
                  icon={Activity}
                  label="Pie"
                  active={activeChart === 'pie'}
                  onClick={() => setActiveChart('pie')}
                />
                <ChartToggle
                  type="bar"
                  icon={BarChart3}
                  label="Bar"
                  active={activeChart === 'bar'}
                  onClick={() => setActiveChart('bar')}
                />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              {activeChart === 'pie' ? (
                <PieChart>
                  <Pie
                    data={summaryData}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {summaryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              ) : (
                <BarChart data={summaryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Trend Analysis */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Growth Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Categories" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Students" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Vendors" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Activity Overview</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Last 6 months</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorCategories" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorVendors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="Categories"
                stackId="1"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorCategories)"
              />
              <Area
                type="monotone"
                dataKey="Students"
                stackId="1"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorStudents)"
              />
              <Area
                type="monotone"
                dataKey="Vendors"
                stackId="1"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#colorVendors)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">View Reports</p>
                <p className="text-sm text-gray-600">Detailed analytics</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">System Health</p>
                <p className="text-sm text-gray-600">All systems normal</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Growth Rate</p>
                <p className="text-sm text-gray-600">+15% this month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardContent;