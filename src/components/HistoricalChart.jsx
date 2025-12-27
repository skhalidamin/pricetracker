import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const HistoricalChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('EUR/USD');
  const [timeRange, setTimeRange] = useState('1year');

  const assets = [
    { value: 'EUR/USD', label: 'EUR to USD' },
    { value: 'INR/USD', label: 'INR to USD' },
    { value: 'GBP/USD', label: 'GBP to USD' },
    { value: 'GOLD', label: 'Gold Price' },
    { value: 'SILVER', label: 'Silver Price' }
  ];

  const timeRanges = [
    { value: '1month', label: '1 Month', days: 30 },
    { value: '6months', label: '6 Months', days: 180 },
    { value: '1year', label: '1 Year', days: 365 },
    { value: '3years', label: '3 Years', days: 1095 }
  ];

  useEffect(() => {
    fetchHistoricalData();
  }, [selectedAsset, timeRange]);

  const fetchHistoricalData = async () => {
    setLoading(true);
    setError('');
    try {
      const range = timeRanges.find(r => r.value === timeRange);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - range.days);

      // Generate mock historical data (replace with actual API in production)
      const data = generateMockData(startDate, endDate, selectedAsset);
      setChartData(data);
    } catch (err) {
      setError('Failed to fetch historical data. Please try again later.');
      console.error('Error fetching historical data:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (startDate, endDate, asset) => {
    const data = [];
    let baseValue = asset === 'GOLD' ? 2000 : asset === 'SILVER' ? 24 : 1.1;
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const randomChange = (Math.random() - 0.5) * (baseValue * 0.02);
      baseValue += randomChange;
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        value: parseFloat(baseValue.toFixed(2))
      });
      
      currentDate.setDate(currentDate.getDate() + Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 50)));
    }
    
    return data;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Historical Price Trends</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Asset</label>
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {assets.map((asset) => (
              <option key={asset.value} value={asset.value}>
                {asset.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-600">Loading chart data...</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name={assets.find(a => a.value === selectedAsset)?.label}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      <p className="text-sm text-gray-500 text-center mt-4">
        📊 Historical data for {assets.find(a => a.value === selectedAsset)?.label} over {timeRanges.find(r => r.value === timeRange)?.label.toLowerCase()}
      </p>
    </div>
  );
};

export default HistoricalChart;
