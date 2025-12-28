# ILHAAM Price Tracker - Vanilla HTML/CSS/JS Version

This is a pure HTML, CSS, and JavaScript version of the Price Tracker app with NO frameworks or build tools required!

## Features

✨ **Beautiful Modern Design**
- Gradient header with purple theme
- Smooth animations and transitions
- Responsive layout for mobile and desktop
- Professional card-based UI

📊 **Live Data**
- Real-time currency exchange rates
- Live gold and silver prices
- 12-month historical charts using Chart.js
- Weekly percentage changes

💱 **Currency Converter**
- 12 major currencies (USD, INR, EUR, GBP, JPY, AUD, CAD, CHF, CNY, SEK, AED, SAR)
- Live exchange rates from Frankfurter API
- Swap currencies with animated button
- Fallback to hardcoded rates if APIs fail

🥇 **Precious Metals Tracker**
- Gold (24K, 22K, 18K) and Silver prices
- Multiple weights (1g, 10g, 100g, 1oz, 1kg)
- 6 currencies (USD, INR, EUR, GBP, AED, SAR)
- 6-hour caching to reduce API calls

## How to Run

### Option 1: Double-click (Simplest)
1. Open the `vanilla-version` folder
2. Double-click `index.html`
3. It will open in your default browser!

### Option 2: Local Server (Recommended for development)
```bash
# Navigate to the vanilla-version folder
cd vanilla-version

# If you have Python 3:
python3 -m http.server 8000

# If you have Python 2:
python -m SimpleHTTPServer 8000

# If you have Node.js:
npx http-server -p 8000

# If you have PHP:
php -S localhost:8000
```

Then open http://localhost:8000 in your browser.

### Option 3: VS Code Live Server
1. Open the `vanilla-version` folder in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## File Structure

```
vanilla-version/
├── index.html    # Main HTML file with all the structure
├── styles.css    # Beautiful modern CSS with gradients and animations
├── app.js        # All business logic and API calls
└── README.md     # This file
```

## Design Highlights

- **Purple Gradient Header**: Eye-catching header with live rates banner
- **Glassmorphism Cards**: Frosted glass effect on rate cards
- **Smooth Animations**: Fade-in effects, hover states, button rotations
- **Chart.js Integration**: Beautiful interactive charts with tooltips
- **Responsive Grid**: Adapts to any screen size
- **Professional Color Palette**: Blues for currency, gold/amber for metals

## APIs Used

1. **Frankfurter API** - Primary exchange rates (free, no key needed)
2. **ExchangeRate-API** - Fallback exchange rates
3. **GoldAPI.io** - Gold and silver prices (demo key, limited requests)
4. **Chart.js CDN** - For beautiful charts

## Comparison with React Version

### Vanilla HTML/CSS/JS:
✅ No build process required
✅ Faster initial load
✅ Easier to understand for beginners
✅ Works by just opening the HTML file
✅ More beautiful gradient design
✅ Smoother animations

### React Version:
✅ Better for larger applications
✅ Component reusability
✅ Hot module reloading during development
✅ Better state management for complex apps
✅ Easier to maintain at scale

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Fully responsive

## Notes

- The app uses `localStorage` to cache metal prices for 6 hours
- All the business logic from the React version is preserved
- Charts are rendered using Chart.js from CDN
- No npm install or build process needed!

Enjoy your beautiful vanilla JavaScript price tracker! 🎉
