import { useState, useEffect } from 'react';
import CurrencyConverter from './components/CurrencyConverter';
import MetalsPrice from './components/MetalsPrice';
import ContactUs from './components/ContactUs';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [liveRates, setLiveRates] = useState({
    usdInr: 89.74,
    usdInrWeekly: 0,
    gold10g: 14204,
    goldWeekly: 0,
    goldKarat: '24k',
    goldSymbol: '₹'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-8 border-b border-gray-200 pb-6 bg-white shadow-sm -mx-4 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900">
              <sup className="text-[8px] font-normal">ILHAAM</sup> Price Tracker
            </h1>
            <p className="text-sm text-gray-500">
              Real-time Currency & Precious Metals
            </p>
            
            {/* Live Rates Banner */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* USD/INR Rate */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-lg font-bold text-gray-900">
                    1 USD = {liveRates.usdInr.toFixed(4)} INR
                  </span>
                  <span className="px-2 py-1 bg-blue-600 text-white rounded-md text-xs font-semibold">
                    Live
                  </span>
                </div>
                {liveRates.usdInrWeekly !== 0 && (
                  <div className={`text-sm font-medium ${liveRates.usdInrWeekly >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {liveRates.usdInrWeekly >= 0 ? '▲' : '▼'} {Math.abs(liveRates.usdInrWeekly).toFixed(2)}% this week
                  </div>
                )}
              </div>
              
              {/* Gold Rate */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-lg font-bold text-gray-900">
                    Gold 10g ({(liveRates.goldKarat || '24k').toUpperCase()}) = {liveRates.goldSymbol || '₹'}{liveRates.gold10g.toLocaleString()}
                  </span>
                  <span className="px-2 py-1 bg-amber-600 text-white rounded-md text-xs font-semibold">
                    Live
                  </span>
                </div>
                {liveRates.goldWeekly !== 0 && (
                  <div className={`text-sm font-medium ${liveRates.goldWeekly >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {liveRates.goldWeekly >= 0 ? '▲' : '▼'} {Math.abs(liveRates.goldWeekly).toFixed(2)}% this week
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex gap-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-6 py-3 text-sm font-semibold relative ${
                activeTab === 'home'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              } transition-colors`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-3 text-sm font-semibold relative ${
                activeTab === 'contact'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              } transition-colors`}
            >
              Contact
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {activeTab === 'home' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CurrencyConverter onRatesUpdate={(rates) => setLiveRates(prev => ({ ...prev, ...rates }))} />
              <MetalsPrice onRatesUpdate={(rates) => setLiveRates(prev => ({ ...prev, ...rates }))} />
            </div>
          )}
          
          {activeTab === 'contact' && <ContactUs />}
        </div>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <p>© 2025 ILHAAM Price Tracker. Data refreshes every 6 hours.</p>
            <p className="text-gray-400">Built with React & Tailwind CSS</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
