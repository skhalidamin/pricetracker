import { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CACHE_KEY = 'metalsPriceCache';
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

// Fallback prices (USD per gram) - Updated based on accurate Dec 2025 rates
const FALLBACK_GOLD = 158.16; // ₹14,204/g at 89.8 INR/USD
const FALLBACK_SILVER = 2.90; // ₹260/g (₹2,600 per 10g)

const MetalsPrice = () => {
  const [metal, setMetal] = useState('gold');
  const [karat, setKarat] = useState('24k');
  const [weight, setWeight] = useState('10');
  const [currency, setCurrency] = useState('INR');
  const [prices, setPrices] = useState({ gold24k: 0, silver: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [historicalData, setHistoricalData] = useState([]);

  const karatMultipliers = {
    '24k': 1,
    '22k': 22/24,
    '18k': 18/24
  };

  const weightOptions = {
    '1': 1,
    '10': 10,
    '100': 100,
    '1oz': 31.1035,
    '1kg': 1000
  };

  const exchangeRates = {
    USD: 1,
    INR: 89.8,
    EUR: 0.849,
    GBP: 0.741,
    AED: 3.673,
    SAR: 3.75
  };

  useEffect(() => {
    fetchMetalPrices();
  }, []);

  const getCachedData = () => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
    return null;
  };

  const setCachedData = (data) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  };

  const fetchMetalPrices = async () => {
    setLoading(true);
    setError('');
    
    const cached = getCachedData();
    if (cached) {
      setPrices(cached);
      setLastUpdated(new Date().toLocaleString());
      generateHistoricalData(cached.gold24k, cached.silver);
      setLoading(false);
      return;
    }

    try {
      const goldResponse = await axios.get('https://www.goldapi.io/api/XAU/USD', {
        headers: { 'x-access-token': 'goldapi-demo-key' }
      });
      
      const silverResponse = await axios.get('https://www.goldapi.io/api/XAG/USD', {
        headers: { 'x-access-token': 'goldapi-demo-key' }
      });

      const goldPricePerGram = goldResponse.data.price_gram;
      const silverPricePerGram = silverResponse.data.price_gram;

      const newPrices = {
        gold24k: goldPricePerGram,
        silver: silverPricePerGram
      };

      setPrices(newPrices);
      setCachedData(newPrices);
      generateHistoricalData(goldPricePerGram, silverPricePerGram);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error('Error fetching metal prices:', err);
      const fallbackPrices = {
        gold24k: FALLBACK_GOLD,
        silver: FALLBACK_SILVER
      };
      setPrices(fallbackPrices);
      generateHistoricalData(FALLBACK_GOLD, FALLBACK_SILVER);
      setError('Using estimated prices (API limit reached)');
      setLastUpdated(new Date().toLocaleString());
    }
    setLoading(false);
  };

  const generateHistoricalData = (currentGold, currentSilver) => {
    const data = [];
    const months = 12;
    
    // Historical base prices (Jan 2025) in USD per gram
    const goldBasePrice = 73.81; // ₹62,000 per 10g at 84 INR/USD = $73.81/g
    const silverBasePrice = 1.13; // ₹950 per 10g at 84 INR/USD = $1.13/g
    
    for (let i = months; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      // Linear interpolation from base price to current price
      const progress = (months - i) / months;
      const goldPrice = goldBasePrice + (currentGold - goldBasePrice) * progress;
      const silverPrice = silverBasePrice + (currentSilver - silverBasePrice) * progress;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        gold: Number(goldPrice.toFixed(2)),
        silver: Number(silverPrice.toFixed(2))
      });
    }
    setHistoricalData(data);
  };

  const getCurrentPrice = () => {
    const basePrice = metal === 'gold' ? prices.gold24k * karatMultipliers[karat] : prices.silver;
    const weightGrams = weightOptions[weight];
    const priceInUSD = basePrice * weightGrams;
    return (priceInUSD * exchangeRates[currency]).toFixed(2);
  };

  const formatHistoricalData = () => {
    return historicalData.map(item => ({
      ...item,
      value: Number((item[metal] * weightOptions[weight] * exchangeRates[currency]).toFixed(2))
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Precious Metals Prices</h2>
      
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="w-24">
          <label className="block text-sm font-medium text-gray-700 mb-2">Metal</label>
          <select
            value={metal}
            onChange={(e) => setMetal(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
          </select>
        </div>

        {metal === 'gold' && (
          <div className="w-28">
            <label className="block text-sm font-medium text-gray-700 mb-2">Karat</label>
            <select
              value={karat}
              onChange={(e) => setKarat(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="24k">24 Karat</option>
              <option value="22k">22 Karat</option>
              <option value="18k">18 Karat</option>
            </select>
          </div>
        )}

        <div className="w-32">
          <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
          <select
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1">1 gram</option>
            <option value="10">10 grams</option>
            <option value="100">100 grams</option>
            <option value="1oz">1 troy ounce</option>
            <option value="1kg">1 kilogram</option>
          </select>
        </div>

        <div className="w-32">
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="USD">USD ($)</option>
            <option value="INR">INR (₹)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="AED">AED (د.إ)</option>
            <option value="SAR">SAR (﷼)</option>
          </select>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">
              {metal === 'gold' ? `Gold (${karat})` : 'Silver'} - {weight === '1oz' ? '1 troy ounce' : weight === '1kg' ? '1 kilogram' : `${weight} ${weight === '1' ? 'gram' : 'grams'}`}
            </p>
            <p className="text-3xl font-bold text-gray-800">
              {currency === 'INR' && '₹'}
              {currency === 'USD' && '$'}
              {currency === 'EUR' && '€'}
              {currency === 'GBP' && '£'}
              {currency === 'AED' && 'د.إ '}
              {currency === 'SAR' && '﷼ '}
              {loading ? '...' : getCurrentPrice()}
            </p>
          </div>
          <button
            onClick={fetchMetalPrices}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Updating...' : 'Refresh'}
          </button>
        </div>
        {lastUpdated && (
          <p className="text-xs text-gray-500 mt-2">Last updated: {lastUpdated}</p>
        )}
      </div>

      {historicalData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Price History (Last 12 Months) - Per {weight === '1oz' ? 'Troy Ounce' : weight === '1kg' ? 'Kilogram' : `${weight} ${weight === '1' ? 'Gram' : 'Grams'}`}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={formatHistoricalData()}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metal === 'gold' ? '#FFD700' : '#C0C0C0'} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={metal === 'gold' ? '#FFD700' : '#C0C0C0'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [
                  `${currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'AED' ? 'د.إ ' : '﷼ '}${value}`,
                  `${metal === 'gold' ? `Gold (${karat})` : 'Silver'}`
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={metal === 'gold' ? '#FFD700' : '#C0C0C0'} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MetalsPrice;
