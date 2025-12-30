// State Management
const state = {
    currency: {
        amount: 1,
        from: 'USD',
        to: 'INR',
        rate: 0,
        convertedAmount: 0,
        historicalData: [],
        lastUpdated: ''
    },
    metals: {
        metal: 'gold',
        karat: '24k',
        weight: '10',
        currency: 'INR',
        viewMode: 'total', // 'total' | 'per-gram'
        prices: { gold24k: 158.16, silver: 2.90 },
        historicalData: [],
        lastUpdated: ''
    },
    activeTab: 'dashboard'
};

// Constants
const FALLBACK_RATES = {
    USD: 1,
    INR: 89.8,
    EUR: 0.849,
    GBP: 0.741,
    AED: 3.673,
    SAR: 3.75
};

const EXCHANGE_RATES = {
    USD: 1,
    INR: 89.8,
    EUR: 0.849,
    GBP: 0.741,
    AED: 3.673,
    SAR: 3.75
};

const KARAT_MULTIPLIERS = {
    '24k': 1,
    '22k': 22/24,
    '18k': 18/24
};

const WEIGHT_OPTIONS = {
    '1': 1,
    '10': 10,
    '100': 100,
    '1oz': 31.1035,
    '1kg': 1000
};

const CACHE_KEY = 'metalsPriceCache';
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

let currencyChart = null;
let metalsChart = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initCurrencyConverter();
    initMetalsPriceTracker();
    // Immediate UI setup using fallback values so the page is not blank
    updateMetalsPrice();
    generateMetalsHistoricalData();
    updateMetalsChart();
    updateLiveBanner();
    fetchExchangeRate();
    fetchMetalPrices();
});

// Tab Management
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabName).classList.add('active');
            
            state.activeTab = tabName;
        });
    });
}

// Currency Converter
function initCurrencyConverter() {
    const amountInput = document.getElementById('amount');
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    const swapBtn = document.getElementById('swapBtn');
    
    amountInput.addEventListener('input', () => {
        state.currency.amount = parseFloat(amountInput.value) || 0;
        updateConvertedAmount();
    });
    
    fromSelect.addEventListener('change', () => {
        state.currency.from = fromSelect.value;
        fetchExchangeRate();
    });
    
    toSelect.addEventListener('change', () => {
        state.currency.to = toSelect.value;
        fetchExchangeRate();
    });
    
    swapBtn.addEventListener('click', () => {
        const temp = state.currency.from;
        state.currency.from = state.currency.to;
        state.currency.to = temp;
        
        fromSelect.value = state.currency.from;
        toSelect.value = state.currency.to;
        
        fetchExchangeRate();
    });
}

async function fetchExchangeRate() {
    const { from, to } = state.currency;
    
    if (from === to) {
        state.currency.rate = 1;
        state.currency.historicalData = [];
        updateConvertedAmount();
        updateCurrencyUI();
        return;
    }
    
    try {
        // Try Frankfurter API first
        const response = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
        const data = await response.json();
        state.currency.rate = data.rates[to];
        state.currency.lastUpdated = new Date().toLocaleString();
        
        await fetchHistoricalCurrencyData();
        updateConvertedAmount();
        updateCurrencyUI();
        updateLiveBanner();
    } catch (err) {
        console.error('Frankfurter API failed, trying fallback:', err);
        
        try {
            // Try exchangerate-api as fallback
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
            const data = await response.json();
            state.currency.rate = data.rates[to];
            state.currency.lastUpdated = new Date().toLocaleString();
            
            generateFallbackCurrencyHistory();
            updateConvertedAmount();
            updateCurrencyUI();
            updateLiveBanner();
        } catch (fallbackErr) {
            console.error('All APIs failed, using hardcoded rates:', fallbackErr);
            
            const fromRate = FALLBACK_RATES[from] || 1;
            const toRate = FALLBACK_RATES[to] || 1;
            state.currency.rate = toRate / fromRate;
            
            showError('currencyError', 'Using estimated exchange rates (APIs unavailable)');
            generateFallbackCurrencyHistory();
            updateConvertedAmount();
            updateCurrencyUI();
            updateLiveBanner();
        }
    }
}

async function fetchHistoricalCurrencyData() {
    try {
        const { from, to } = state.currency;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        
        const response = await fetch(
            `https://api.frankfurter.app/${startDate.toISOString().split('T')[0]}..${endDate.toISOString().split('T')[0]}?from=${from}&to=${to}`
        );
        const data = await response.json();
        
        // Build daily data first
        const daily = Object.entries(data.rates)
            .map(([dateStr, rates]) => ({
                rawDate: new Date(dateStr),
                date: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                rate: rates[to]
            }))
            .sort((a, b) => a.rawDate - b.rawDate);

        // Sample to weekly data (one point per calendar week)
        const sampledWeekly = [];
        let lastWeek = -1;
        let lastYear = -1;
        daily.forEach(item => {
            const d = item.rawDate;
            const jan1 = new Date(d.getFullYear(), 0, 1);
            const days = Math.floor((d - jan1) / (24 * 60 * 60 * 1000));
            const weekNum = Math.floor(days / 7);
            const yearNum = d.getFullYear();
            if (weekNum !== lastWeek || yearNum !== lastYear) {
                sampledWeekly.push({ date: item.date, rate: item.rate });
                lastWeek = weekNum;
                lastYear = yearNum;
            }
        });
        
        state.currency.historicalData = sampledWeekly;
        updateCurrencyChart();
    } catch (err) {
        console.error('Error fetching historical data:', err);
        generateFallbackCurrencyHistory();
    }
}

function generateFallbackCurrencyHistory() {
    const { from, to, rate: currentRate } = state.currency;
    const data = [];
    const weeks = 52;
    
    const historicalBaseRates = {
        'USD-INR': 84.0,
        'USD-EUR': 0.93,
        'USD-GBP': 0.79,
        'USD-AED': 3.673,
        'USD-SAR': 3.75,
    };
    
    const pairKey = `${from}-${to}`;
    const reversePairKey = `${to}-${from}`;
    
    let baseRate;
    if (historicalBaseRates[pairKey]) {
        baseRate = historicalBaseRates[pairKey];
    } else if (historicalBaseRates[reversePairKey]) {
        baseRate = 1 / historicalBaseRates[reversePairKey];
    } else {
        baseRate = currentRate * 0.95;
    }
    
    for (let i = weeks; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i * 7);
        
        const progress = (weeks - i) / weeks;
        const rate = baseRate + (currentRate - baseRate) * progress;
        
        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            rate: Number(rate.toFixed(4))
        });
    }
    
    state.currency.historicalData = data;
    updateCurrencyChart();
}

function updateConvertedAmount() {
    const { amount, rate } = state.currency;
    state.currency.convertedAmount = (amount * rate).toFixed(2);
}

function updateCurrencyUI() {
    const { amount, from, to, rate, convertedAmount, lastUpdated } = state.currency;
    
    document.getElementById('resultLabel').textContent = `${amount} ${from} =`;
    document.getElementById('convertedAmount').textContent = convertedAmount;
    document.getElementById('resultCurrency').textContent = to;
    document.getElementById('exchangeRate').textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
    document.getElementById('currencyUpdated').textContent = `Updated: ${lastUpdated || 'Just now'}`;
    
    hideError('currencyError');
}

function updateCurrencyChart() {
    const canvas = document.getElementById('currencyChart');
    const ctx = canvas.getContext('2d');
    
    if (currencyChart) {
        currencyChart.destroy();
    }
    
    const { from, to, historicalData } = state.currency;
    
    currencyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: historicalData.map(d => d.date),
            datasets: [{
                label: `${from} to ${to}`,
                data: historicalData.map(d => d.rate),
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#1f2937',
                    bodyColor: '#6b7280',
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `1 ${from} = ${context.parsed.y.toFixed(4)} ${to}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: '#f3f4f6'
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Metals Price Tracker
function initMetalsPriceTracker() {
    const metalSelect = document.getElementById('metal');
    const karatSelect = document.getElementById('karat');
    const weightSelect = document.getElementById('weight');
    const currencySelect = document.getElementById('metalCurrency');
    const toggleTotalBtn = document.getElementById('metalsViewTotal');
    const togglePerGramBtn = document.getElementById('metalsViewPerGram');
    
    metalSelect.addEventListener('change', () => {
        state.metals.metal = metalSelect.value;
        updateMetalsPrice();
        updateMetalsChart();
        
        // Show/hide karat selector
        karatSelect.disabled = metalSelect.value === 'silver';
    });
    
    karatSelect.addEventListener('change', () => {
        state.metals.karat = karatSelect.value;
        updateMetalsPrice();
        updateMetalsChart();
    });
    
    weightSelect.addEventListener('change', () => {
        state.metals.weight = weightSelect.value;
        updateMetalsPrice();
        updateMetalsChart();
    });
    
    currencySelect.addEventListener('change', () => {
        state.metals.currency = currencySelect.value;
        updateMetalsPrice();
        updateMetalsChart();
    });

    // Toggle chart view: total vs per-gram
    if (toggleTotalBtn && togglePerGramBtn) {
        toggleTotalBtn.addEventListener('click', () => {
            state.metals.viewMode = 'total';
            toggleTotalBtn.classList.add('active');
            togglePerGramBtn.classList.remove('active');
            updateMetalsChart();
        });
        togglePerGramBtn.addEventListener('click', () => {
            state.metals.viewMode = 'per-gram';
            togglePerGramBtn.classList.add('active');
            toggleTotalBtn.classList.remove('active');
            updateMetalsChart();
        });
    }
}

function getCachedMetalData() {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const cachedDate = new Date(timestamp).toDateString();
        const todayDate = new Date().toDateString();
        if (Date.now() - timestamp < CACHE_DURATION && cachedDate === todayDate) {
            return data;
        }
    }
    return null;
}

function setCachedMetalData(data) {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
    }));
}

async function fetchMetalPrices() {
    const cached = getCachedMetalData();
    if (cached) {
        state.metals.prices = cached;
        state.metals.lastUpdated = new Date().toLocaleString();
        generateMetalsHistoricalData();
        updateMetalsPrice();
        updateLiveBanner();
        return;
    }
    
    try {
        const token = localStorage.getItem('GOLDAPI_TOKEN') || 'goldapi-demo-key';
        const goldResponse = await fetch('https://www.goldapi.io/api/XAU/USD', {
            headers: { 'x-access-token': token }
        });
        const goldData = await goldResponse.json();
        
        const silverResponse = await fetch('https://www.goldapi.io/api/XAG/USD', {
            headers: { 'x-access-token': token }
        });
        const silverData = await silverResponse.json();
        
        // Validate and apply prices without clobbering existing or fallback values
        const nextPrices = { ...state.metals.prices };
        const goldPrice = Number(goldData?.price_gram);
        const silverPrice = Number(silverData?.price_gram);
        if (Number.isFinite(goldPrice) && goldPrice > 0) {
            nextPrices.gold24k = goldPrice;
        }
        if (Number.isFinite(silverPrice) && silverPrice > 0) {
            nextPrices.silver = silverPrice;
        }
        state.metals.prices = nextPrices;
        
        setCachedMetalData(state.metals.prices);
        state.metals.lastUpdated = new Date().toLocaleString();
        generateMetalsHistoricalData();
        updateMetalsPrice();
        updateLiveBanner();
    } catch (err) {
        console.error('Error fetching metal prices:', err);
        state.metals.prices = {
            gold24k: 158.16,
            silver: 2.90
        };
        showError('metalsError', 'Using estimated prices (API limit reached)');
        state.metals.lastUpdated = new Date().toLocaleString();
        generateMetalsHistoricalData();
        updateMetalsPrice();
        updateLiveBanner();
    }
}

function generateMetalsHistoricalData() {
    // Use safe numeric values with fallbacks if API/cached values are invalid
    const currentGold = Number(state.metals.prices.gold24k);
    const currentSilver = Number(state.metals.prices.silver);
    const gold24k = (Number.isFinite(currentGold) && currentGold > 0) ? currentGold : 158.16;
    const silver = (Number.isFinite(currentSilver) && currentSilver > 0) ? currentSilver : 2.90;
    const data = [];
    const weeks = 52;
    
    // Use prices closer to current for more realistic weekly changes
    const goldBasePrice = gold24k * 0.92; // Start 8% lower than current
    const silverBasePrice = silver * 0.88; // Start 12% lower than current
    
    for (let i = weeks; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i * 7);
        
        const progress = (weeks - i) / weeks;
        const goldPrice = goldBasePrice + (gold24k - goldBasePrice) * progress;
        const silverPrice = silverBasePrice + (silver - silverBasePrice) * progress;
        
        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            gold: Number(goldPrice.toFixed(2)),
            silver: Number(silverPrice.toFixed(2))
        });
    }
    
    state.metals.historicalData = data;
    updateMetalsChart();
}

function updateMetalsPrice() {
    const { metal, karat, weight, currency, prices } = state.metals;
    
    // Use safe fallbacks so UI always updates even if API values are missing
    const gold24k = (Number.isFinite(Number(prices.gold24k)) && Number(prices.gold24k) > 0) ? Number(prices.gold24k) : 158.16;
    const silver = (Number.isFinite(Number(prices.silver)) && Number(prices.silver) > 0) ? Number(prices.silver) : 2.90;
    
    const basePrice = metal === 'gold' 
        ? gold24k * KARAT_MULTIPLIERS[karat]
        : silver;
    
    const weightGrams = WEIGHT_OPTIONS[weight];
    const priceInUSD = basePrice * weightGrams;
    
    // Get the current exchange rate for the selected currency
    let exchangeRate = EXCHANGE_RATES[currency];
    if (currency === 'INR' && state.currency.from === 'USD' && state.currency.to === 'INR' && state.currency.rate > 0) {
        exchangeRate = state.currency.rate; // Use live USD/INR rate
    }
    
    const finalPrice = priceInUSD * exchangeRate;
    
    const metalName = metal.charAt(0).toUpperCase() + metal.slice(1);
    const karatLabel = metal === 'gold' ? ` (${karat.toUpperCase()})` : '';
    const weightLabel = weight === '1oz' ? ' 1 oz' : weight === '1kg' ? ' 1 kg' : ` ${weight}g`;
    
    document.getElementById('metalResultLabel').textContent = `${metalName}${weightLabel}${karatLabel} =`;
    document.getElementById('metalPrice').textContent = finalPrice.toLocaleString('en-US', { maximumFractionDigits: 2 });
    document.getElementById('metalResultCurrency').textContent = currency;
    
    const pricePerGram = (priceInUSD / weightGrams) * exchangeRate;
    const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency;
    document.getElementById('metalPricePerGram').textContent = 
        `${currencySymbol}${pricePerGram.toLocaleString('en-US', { maximumFractionDigits: 2 })} per gram`;
    
    document.getElementById('metalsUpdated').textContent = 
        `Updated: ${state.metals.lastUpdated || 'Just now'}`;
    
    hideError('metalsError');
}

function updateMetalsChart() {
    const canvas = document.getElementById('metalsChart');
    const ctx = canvas.getContext('2d');
    
    if (metalsChart) {
        metalsChart.destroy();
    }
    
    // Ensure we have historical data; if not, generate a fallback
    if (!state.metals.historicalData || state.metals.historicalData.length === 0) {
        generateMetalsHistoricalData();
    }
    const { metal, historicalData, currency, karat, weight, viewMode } = state.metals;
    const color = metal === 'gold' ? '#f59e0b' : '#6b7280';
    
    // Determine exchange rate for chart based on selected currency
    let exchangeRate = EXCHANGE_RATES[currency] || 1;
    if (currency === 'INR' && state.currency.from === 'USD' && state.currency.to === 'INR' && state.currency.rate > 0) {
        exchangeRate = state.currency.rate;
    }
    const currencySymbols = { USD: '$', INR: '₹', EUR: '€', GBP: '£', AED: 'AED ', SAR: 'SAR ' };
    const symbol = currencySymbols[currency] || currency + ' ';
    const isTotal = viewMode === 'total';
    const weightGrams = isTotal ? (WEIGHT_OPTIONS[weight] || 1) : 1;
    const weightLabel = isTotal ? (weight === '1oz' ? '1 oz' : weight === '1kg' ? '1 kg' : `${weight}g`) : 'per gram';
    
    metalsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: historicalData.map(d => d.date),
            datasets: [{
                label: `${metal.charAt(0).toUpperCase() + metal.slice(1)} Price (${currency}, ${weightLabel}${metal === 'gold' ? `, ${karat.toUpperCase()}` : ''})`,
                data: historicalData.map(d => {
                    const km = metal === 'gold' ? KARAT_MULTIPLIERS[karat] || 1 : 1;
                    const basePerGram = metal === 'gold' ? d.gold * km : d.silver;
                    return basePerGram * weightGrams * exchangeRate;
                }),
                borderColor: color,
                backgroundColor: color + '20',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#1f2937',
                    bodyColor: '#6b7280',
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            if (isTotal) {
                                const wl = (weight === '1oz' ? '1 oz' : weight === '1kg' ? '1 kg' : `${weight}g`);
                                return `${symbol}${context.parsed.y.toFixed(2)} total (${wl})`;
                            }
                            return `${symbol}${context.parsed.y.toFixed(2)} per gram`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: '#f3f4f6'
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return symbol + value.toFixed(0);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Live Banner Updates
function updateLiveBanner() {
    // Update USD/INR
    if (state.currency.from === 'USD' && state.currency.to === 'INR' && state.currency.rate > 0) {
        const rate = state.currency.rate;
        document.getElementById('usdInrRate').textContent = `1 USD = ${rate.toFixed(4)} INR`;
        
        // Calculate weekly change
        const weeklyChange = calculateWeeklyChange(state.currency.historicalData);
        updateChangeDisplay('usdInrChange', 'usdInrPercent', weeklyChange);
    }
    
    // Update Gold 10g price - only if prices are available
    if (state.metals.prices.gold24k && state.metals.prices.gold24k > 0) {
        // Convert banner value to the currently selected metals currency
        const selectedCurrency = state.metals.currency || 'INR';
        let exchangeRate = EXCHANGE_RATES[selectedCurrency] || 1;
        if (selectedCurrency === 'INR' && state.currency.from === 'USD' && state.currency.to === 'INR' && state.currency.rate > 0) {
            exchangeRate = state.currency.rate; // prefer live USD->INR for INR banner
        }
        const currencySymbols = { USD: '$', INR: '₹', EUR: '€', GBP: '£', AED: 'AED ', SAR: 'SAR ' };
        const symbol = currencySymbols[selectedCurrency] || selectedCurrency + ' ';
        const goldGramUSD = Number(state.metals.prices.gold24k) > 0 ? Number(state.metals.prices.gold24k) : 158.16;
        const karat = state.metals.karat || '24k';
        const karatMultiplier = KARAT_MULTIPLIERS[karat] || 1;
        const goldGramAdjusted = goldGramUSD * karatMultiplier;
        const gold10gValue = goldGramAdjusted * 10 * exchangeRate;
        document.getElementById('goldRate').textContent = 
            `Gold 10g (${karat.toUpperCase()}) = ${symbol}${Math.round(gold10gValue).toLocaleString()}`;
        
        if (state.metals.historicalData.length > 0) {
            const goldWeeklyChange = calculateWeeklyChange(
                state.metals.historicalData.map(d => ({ rate: d.gold }))
            );
            updateChangeDisplay('goldChange', 'goldPercent', goldWeeklyChange);
        }
    }
}

function calculateWeeklyChange(historicalData) {
    if (!historicalData || historicalData.length < 2) return 0;
    const last = historicalData[historicalData.length - 1];
    const prev = historicalData[historicalData.length - 2];
    const currentValue = last.rate ?? last.gold ?? 0;
    const previousValue = prev.rate ?? prev.gold ?? 0;
    if (!(currentValue > 0) || !(previousValue > 0)) return 0;
    const weeklyChange = ((currentValue - previousValue) / previousValue) * 100;
    return weeklyChange;
}

function updateChangeDisplay(elementId, percentId, change) {
    const element = document.getElementById(elementId);
    const percentElement = document.getElementById(percentId);
    const icon = element.querySelector('.change-icon');
    
    if (change >= 0) {
        element.classList.remove('negative');
        element.classList.add('positive');
        icon.textContent = '▲';
    } else {
        element.classList.remove('positive');
        element.classList.add('negative');
        icon.textContent = '▼';
    }
    
    percentElement.textContent = Math.abs(change).toFixed(2);
}

// Utility Functions
function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

function hideError(elementId) {
    const errorEl = document.getElementById(elementId);
    errorEl.style.display = 'none';
}
