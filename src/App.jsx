import { useState } from 'react';
import CurrencyConverter from './components/CurrencyConverter';
import MetalsPrice from './components/MetalsPrice';
import ContactUs from './components/ContactUs';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex flex-col items-center mb-4">
            {/* Logo - ILHAAM in bold circles arranged in 2 rows */}
            <div className="flex gap-3 mb-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-white text-2xl font-black">I</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-white text-2xl font-black">L</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-white text-2xl font-black">H</span>
              </div>
            </div>
            <div className="flex gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-600 to-red-600 flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-white text-2xl font-black">A</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-white text-2xl font-black">A</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-600 to-yellow-600 flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-white text-2xl font-black">M</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Price Tracker
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Real-time Currency Converter & Precious Metals Prices
          </p>
        </header>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg shadow-sm" role="group">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                activeTab === 'home'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200 transition-colors`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                activeTab === 'contact'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200 border-l-0 transition-colors`}
            >
              Contact Us
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {activeTab === 'home' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CurrencyConverter />
              <MetalsPrice />
            </div>
          )}
          
          {activeTab === 'contact' && <ContactUs />}
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-600 text-sm">
          <p>Data refreshes every 6 hours • Built with React & Tailwind CSS</p>
          <p className="mt-2">
            📈 Track currencies and precious metals with historical charts
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
