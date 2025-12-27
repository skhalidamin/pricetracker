import { useState } from 'react';
import CurrencyConverter from './components/CurrencyConverter';
import MetalsPrice from './components/MetalsPrice';
import ContactUs from './components/ContactUs';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-8 border-b border-gray-200 pb-6 bg-white shadow-sm -mx-4 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-row items-center gap-4">
              {/* Logo */}
              <img 
                src="/logo.png" 
                alt="ILHAAM Logo" 
                className="h-8 w-8 object-contain flex-shrink-0"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Price Tracker
                </h1>
                <p className="text-sm text-gray-500">
                  Real-time Currency & Precious Metals
                </p>
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
              <CurrencyConverter />
              <MetalsPrice />
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
