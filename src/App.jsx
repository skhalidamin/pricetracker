import CurrencyConverter from './components/CurrencyConverter'
import MetalsPrice from './components/MetalsPrice'
import HistoricalChart from './components/HistoricalChart'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            💱 Price Tracker
          </h1>
          <p className="text-gray-600 text-lg">
            Real-time Currency Converter & Precious Metals Prices
          </p>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Currency Converter Section */}
          <CurrencyConverter />

          {/* Precious Metals Prices Section */}
          <MetalsPrice />

          {/* Historical Chart Section */}
          <HistoricalChart />
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-600 text-sm">
          <p>Data updates every 5 minutes • Built with React & Tailwind CSS</p>
          <p className="mt-2">
            📈 Track currencies and precious metals over the last 3 years
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
