# Price Tracker 💱

A modern, responsive web application for real-time currency conversion and precious metals price tracking with historical data visualization.

## 🌟 Features

- **Currency Converter**: Convert between 10+ major currencies (USD, INR, EUR, GBP, JPY, AUD, CAD, CHF, CNY, SEK)
- **Precious Metals Prices**: Real-time gold and silver prices in USD, INR, and EUR
- **Historical Charts**: Visualize price trends over the last 3 years with interactive charts
- **Responsive Design**: Mobile-first, fully responsive layout
- **Real-time Updates**: Automatic data refresh every 5 minutes

## 🚀 Live Demo

Visit the live app: [Add your deployed URL here]

## 🛠️ Tech Stack

- **Frontend**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3
- **Charts**: Recharts
- **HTTP Client**: Axios
- **APIs**: ExchangeRate-API (free tier)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pricetracker.git
cd pricetracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🏗️ Build for Production

```bash
npm run build
```

The optimized files will be in the `dist/` directory.

## 🌍 Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### GitHub Pages

1. Update `vite.config.js` with your repository name:
```js
export default defineConfig({
  base: '/pricetracker/',
  // ... rest of config
})
```

2. Push to GitHub and enable GitHub Pages in repository settings
3. GitHub Actions will automatically deploy on push to main branch

## 📊 API Usage

This app uses free-tier APIs:

- **Exchange Rates**: [ExchangeRate-API](https://www.exchangerate-api.com/) (1,500 requests/month)
- **Precious Metals**: Mock data (replace with [Metals-API](https://metals-api.com/) or similar)

## 🎯 Future Enhancements

- [ ] User authentication and saved preferences
- [ ] Price alerts and notifications
- [ ] More precious metals (platinum, palladium)
- [ ] Cryptocurrency prices
- [ ] Export data to CSV
- [ ] Dark mode toggle

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Your Name - [GitHub](https://github.com/yourusername)

---

Built with ❤️ using React and Tailwind CSS
