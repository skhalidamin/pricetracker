# ILHAAM Price Tracker

A beautiful, real-time price tracking application for currency exchange rates and precious metals built with vanilla HTML, CSS, and JavaScript.

## ✨ Features

### 💱 Currency Converter
- **12 Major Currencies**: USD, INR, EUR, GBP, JPY, AUD, CAD, CHF, CNY, SEK, AED, SAR
- **Live Exchange Rates**: Real-time data from Frankfurter API
- **12-Month Historical Charts**: Beautiful interactive charts using Chart.js
- **Smart Fallbacks**: Multiple API fallbacks ensure continuous operation
- **Weekly Percentage Changes**: Track currency fluctuations

### 🥇 Precious Metals Tracker
- **Gold & Silver Prices**: Real-time precious metal pricing
- **Multiple Karats**: 24K, 22K, and 18K gold
- **Flexible Weights**: 1g, 10g, 100g, 1 oz, 1 kg
- **6 Currencies**: USD, INR, EUR, GBP, AED, SAR
- **Smart Caching**: 6-hour cache to reduce API calls
- **Historical Data**: 12-month price trends

### 🎨 Beautiful Design
- **Modern UI**: Purple gradient header with glassmorphism effects
- **Smooth Animations**: Fade-ins, hover states, and transitions
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Professional Color Scheme**: Blue for currency, gold/amber for metals

## 🚀 Quick Start

### Easiest Way: Just Double-Click!
Simply double-click `index.html` - it opens in your browser. No server needed!

### Or Use a Local Server:

**Python 3:**
```bash
python3 -m http.server 5173
```

**Python 2:**
```bash
python -m SimpleHTTPServer 5173
```

Then open http://localhost:5173

### Or use npm:
```bash
npm run dev
```

## 📁 Files

- `index.html` - Main HTML structure
- `styles.css` - Beautiful modern CSS
- `app.js` - All business logic and APIs
- `vanilla-version/` - Backup copy

## 🔌 APIs Used

1. **Frankfurter API** - Exchange rates (free)
2. **ExchangeRate-API** - Fallback rates  
3. **GoldAPI.io** - Metal prices
4. **Chart.js** - Charts (CDN)

## 👨‍💻 Developer

**Khalid** - skhalidamin@gmail.com

---

© 2025 ILHAAM Price Tracker
