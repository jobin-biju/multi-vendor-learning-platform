import React, { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const RevenueChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Using fetch instead of axios to avoid import issues
        const response = await fetch('http://localhost:5000/predict-revenue');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const { past_7_days, next_7_days } = data;

        const formatted = [
          ...past_7_days.map(d => ({ ...d, type: 'Actual' })),
          ...next_7_days.map(d => ({ ...d, type: 'Predicted' })),
        ];

        setChartData(formatted);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{`Date: ${label}`}</p>
          <p className={`text-sm ${data.type === 'Actual' ? 'text-blue-600' : 'text-purple-600'}`}>
            {`${data.type}: ₹${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="w-full p-8 bg-white shadow-lg rounded-2xl border border-gray-100">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg text-gray-600">Loading revenue data...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching from API...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 bg-white shadow-lg rounded-2xl border border-gray-100">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p className="text-lg text-red-600 font-semibold">Error loading data</p>
          <p className="text-sm text-gray-500 mt-2">{error}</p>
          <p className="text-xs text-gray-400 mt-1">Please ensure your API server is running on localhost:5000</p>
        </div>
      </div>
    );
  }

  // Separate actual and predicted data for different styling
  const actualData = chartData.filter(d => d.type === 'Actual');
  const predictedData = chartData.filter(d => d.type === 'Predicted');
  const allData = [...actualData, ...predictedData];

  return (
    <div className="w-full p-8 bg-white shadow-lg rounded-2xl border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          📈 Revenue Prediction
        </h2>
        <p className="text-gray-600">Past 7 days actual vs Next 7 days predicted revenue</p>
        <div className="flex justify-center items-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Actual Revenue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Predicted Revenue</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={allData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#3B82F6"
              strokeWidth={3}
              dot={(props) => {
                const { payload } = props;
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={5}
                    fill={payload.type === 'Actual' ? '#3B82F6' : '#8B5CF6'}
                    stroke={payload.type === 'Actual' ? '#3B82F6' : '#8B5CF6'}
                    strokeWidth={2}
                  />
                );
              }}
              name="Revenue Amount"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-1">Total Actual (7 days)</h3>
          <p className="text-2xl font-bold text-blue-600">
            ₹{actualData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-sm font-semibold text-purple-800 mb-1">Total Predicted (7 days)</h3>
          <p className="text-2xl font-bold text-purple-600">
            ₹{predictedData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-sm font-semibold text-green-800 mb-1">Growth Projection</h3>
          <p className="text-2xl font-bold text-green-600">
            {actualData.length > 0 && predictedData.length > 0 ? 
              ((predictedData.reduce((sum, item) => sum + item.amount, 0) - 
                actualData.reduce((sum, item) => sum + item.amount, 0)) / 
                actualData.reduce((sum, item) => sum + item.amount, 0) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      {/* API Status */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">API Status:</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Connected to localhost:5000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
