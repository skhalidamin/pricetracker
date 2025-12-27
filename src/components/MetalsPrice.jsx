import { useState, useEffect } from 'react';
import axios from 'axios';

const MetalsPrice = () => {
  const [prices, setPrices] = useState({
    gold: { usd: 0, inr: 0, eur: 0 },
    silver: { usd: 0, inr: 0, eur: 0 }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    fetchMetalPrices();
    // Refresh every 5 minutes
    const interval = setInterval(fetchMetalPrices, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetalPrices = async () => {
    setLoading(true);
    setError('');
    try {
      // Using Metals-API.com free tier or alternative
      // Note: You'll need to sign up for a free API key at https://metals-api.com
      // For demo purposes, using mock data
      
      // Get exchange rates for currency conversion
      const exchangeResponse = await axios.get(
        'https://api.exchangerate-api.com/v4/latest/USD'
      );
      const rates = exchangeResponse.data.rates;

      // Mock metal prices in USD per troy ounce (replace with actual API)
      // In production, use: https://api.metals.live/v1/spot
      const goldPriceUSD = 2050.50;
      const silverPriceUSD = 24.30;

      setPrices({
        gold: {
          usd: goldPriceUSD,
          inr: (goldPriceUSD * rates.INR).toFixed(2),
          eur: (goldPriceUSD * rates.EUR).toFixed(2)
        },
        silver: {
          usd: silverPriceUSD,
          inr: (silverPriceUSD * rates.INR).toFixed(2),
          eur: (silverPriceUSD * rates.EUR).toFixed(2)
        }
      });
      
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError('Failed to fetch metal prices. Please try again later.');
      console.error('Error fetching metal prices:', err);
    } finally {
      setLoading(false);
    }
  };

  const MetalCard = ({ metal, data, icon }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="text-3xl mr-2">{icon}</span>
          {metal}
        </h3>
        <button
          onClick={fetchMetalPrices}
          className="text-blue-500 hover:text-blue-700 text-sm"
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>
      
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600">USD</span>
            <span className="text-lg font-semibold text-gray-800">
              ${data.usd.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600">INR</span>
            <span className="text-lg font-semibold text-gray-800">
              ₹{data.inr}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">EUR</span>
            <span className="text-lg font-semibold text-gray-800">
              €{data.eur}
            </span>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            Per Troy Ounce
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Precious Metals Prices</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetalCard metal="Gold" data={prices.gold} icon="🏅" />
        <MetalCard metal="Silver" data={prices.silver} icon="⚪" />
      </div>

      {lastUpdated && (
        <p className="text-sm text-gray-500 text-center mt-4">
          Last updated: {lastUpdated}
        </p>
      )}
    </div>
  );
};

export default MetalsPrice;
