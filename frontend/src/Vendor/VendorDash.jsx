import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { DollarSign, Users, BookOpen, TrendingUp, Calendar, Eye, UserPlus, Award, Target, Activity, IndianRupee } from 'lucide-react';

const VendorDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPayments: 0,
    thisMonth: 0
  });
  const [chartData, setChartData] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // Auth data from localStorage
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('tourstorage')) || {});
  const user = auth; // Using auth as user for compatibility

  // Prepare chart data from payments
  const prepareChartData = (paymentsData) => {
    const monthlyData = {};
    
    paymentsData.forEach(payment => {
      const date = new Date(payment.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          revenue: 0,
          payments: 0
        };
      }
      
      monthlyData[monthKey].revenue += payment.amount;
      monthlyData[monthKey].payments += 1;
    });
    
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  };

  // Your exact payments useEffect
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:4000/multivendor/views", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ venid: user?.vendorid })
        });
        const data = await response.json();
        setPayments(data);
        
        // Calculate stats
        const totalRevenue = data.reduce((sum, payment) => sum + payment.amount, 0);
        const totalPayments = data.length;
        const thisMonth = data.filter(p => 
          new Date(p.date).getMonth() === new Date().getMonth()
        ).reduce((sum, payment) => sum + payment.amount, 0);
        
        setStats({ totalRevenue, totalPayments, thisMonth });
        
        // Prepare chart data
        const chartData = prepareChartData(data);
        setChartData(chartData);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setLoading(false);
      }
    };

    if (user?.vendorid) {
      fetchPayments();
    }
  }, []);

  // Your exact instructors useEffect (uncommented)
  useEffect(() => {
    let ids = {
      vid: auth.vendorid
    }
    console.log(ids, "aps");

    fetch('http://localhost:4000/multivendor/viewinstructor', {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json",
      },
      body: JSON.stringify(ids),
    })
      .then((res) => res.json()).then((result) => {
        console.log(result, "hello world");
        setInstructors(result);
      })
      .catch((err) => console.log('Error'));
  }, [])

  // Your exact courses useEffect
  useEffect(() => {
    let ids = {
        venid: auth.vendorid
    };

    setIsLoading(true);
    fetch('http://localhost:4000/multivendor/getcourse', {
        method: 'POST',
        headers: {
            Accept: "application/json",
            'Content-Type': "application/json"
        },
        body: JSON.stringify(ids)
    })
    .then(res => res.json())
    .then(result => {
        setCourses(result);
        setFilteredCourses(result);
        
        // Extract unique categories and levels for filters
        const uniqueCategories = [...new Set(result.map(course => course.category?.category).filter(Boolean))];
        const uniqueLevels = [...new Set(result.map(course => course.level).filter(Boolean))];
        
        setCategories(uniqueCategories);
        setLevels(uniqueLevels);
        setIsLoading(false);
    })
    .catch(err => {
        console.error("Fetch error:", err);
        setIsLoading(false);
    });
  }, [auth.vendorid, refresh]);

  // Calculate additional stats
  const calculateAdditionalStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // New instructors this month
    const newInstructorsThisMonth = instructors.filter(instructor => {
      if (instructor.joinDate || instructor.createdAt) {
        const joinDate = new Date(instructor.joinDate || instructor.createdAt);
        return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
      }
      return false;
    }).length;

    // New courses this month
    const newCoursesThisMonth = courses.filter(course => {
      if (course.createdAt || course.date) {
        const createdDate = new Date(course.createdAt || course.date);
        return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
      }
      return false;
    }).length;

    // Course completion rates
    const completionRate = courses.length > 0 ? 
      (courses.filter(course => course.status === 'completed' || course.published).length / courses.length) * 100 : 0;

    return {
      newInstructorsThisMonth,
      newCoursesThisMonth,
      completionRate,
      totalInstructors: instructors.length,
      totalCourses: courses.length,
      averageRating: courses.length > 0 ? 
        courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length : 0
    };
  };

  // Prepare category distribution data
  const prepareCategoryData = () => {
    const categoryCount = {};
    courses.forEach(course => {
      const category = course.category?.category || 'Uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    return Object.entries(categoryCount).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / courses.length) * 100).toFixed(1)
    }));
  };

  // Prepare level distribution data
  const prepareLevelData = () => {
    const levelCount = {};
    courses.forEach(course => {
      const level = course.level || 'Not specified';
      levelCount[level] = (levelCount[level] || 0) + 1;
    });
    
    return Object.entries(levelCount).map(([name, value]) => ({ name, value }));
  };

  const additionalStats = calculateAdditionalStats();
  const categoryData = prepareCategoryData();
  const levelData = prepareLevelData();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
          <p className="text-gray-600">Complete overview of your business performance</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <IndianRupee className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* This Month Revenue */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.thisMonth.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Instructors */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Instructors</p>
                <p className="text-2xl font-bold text-gray-900">{additionalStats.totalInstructors}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Total Courses */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{additionalStats.totalCourses}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Instructors (This Month)</p>
                <p className="text-xl font-bold text-gray-900">{additionalStats.newInstructorsThisMonth}</p>
              </div>
              <UserPlus className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Courses (This Month)</p>
                <p className="text-xl font-bold text-gray-900">{additionalStats.newCoursesThisMonth}</p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalPayments}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Course Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Level Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Course Levels</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={levelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Trend */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Count Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="payments" stroke="#FF8042" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Payments */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
            <div className="space-y-3">
              {payments.slice(0, 5).map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">₹{payment.amount}</p>
                    <p className="text-sm text-gray-600">{new Date(payment.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status || 'completed'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Courses */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Courses</h3>
            <div className="space-y-3">
              {courses.slice(0, 5).map((course, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{course.title || course.name}</p>
                    <p className="text-sm text-gray-600">{course.category?.category || 'General'}</p>
                  </div>
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                    {course.level || 'Beginner'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;