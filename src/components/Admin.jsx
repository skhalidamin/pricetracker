import { useEffect, useState } from 'react';

const Admin = ({ onRefresh }) => {
  const [visitsToday, setVisitsToday] = useState(0);
  const [visitsTotal, setVisitsTotal] = useState(0);
  const [lastRefresh, setLastRefresh] = useState('—');

  useEffect(() => {
    const todayKey = 'VISITS_TODAY';
    const dateKey = 'VISITS_DATE';
    const totalKey = 'VISITS_TOTAL';
    const todayStr = new Date().toDateString();
    const storedDate = localStorage.getItem(dateKey);
    if (storedDate !== todayStr) {
      localStorage.setItem(dateKey, todayStr);
      localStorage.setItem(todayKey, '0');
    }
    const today = parseInt(localStorage.getItem(todayKey) || '0', 10);
    const total = parseInt(localStorage.getItem(totalKey) || '0', 10);
    setVisitsToday(today);
    setVisitsTotal(total);
  }, []);

  const handleRefresh = () => {
    setLastRefresh(new Date().toLocaleString());
    onRefresh?.();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Admin Controls</h2>
        <p className="text-sm text-gray-500 mt-1">Manual refresh and visit analytics</p>
      </div>

      <div className="flex gap-3 items-center mb-6">
        <button
          onClick={handleRefresh}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-md transition-colors"
        >
          Refresh Now
        </button>
        <span className="text-sm text-gray-600">Last refresh: {lastRefresh}</span>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Visits Analytics</p>
        <p className="text-base text-gray-700">Visits Today: {visitsToday}</p>
        <p className="text-base text-gray-700">Visits Total: {visitsTotal}</p>
      </div>
    </div>
  );
};

export default Admin;
