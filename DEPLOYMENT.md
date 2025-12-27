# Deployment Guide 🚀

This guide will help you deploy your Price Tracker app globally using various platforms.

## Option 1: Vercel (Recommended - Easiest)

Vercel offers the simplest deployment with automatic CI/CD.

### Steps:

1. **Create a Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub (recommended)

2. **Import Your Project**
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the Vite configuration

3. **Deploy**
   - Click "Deploy"
   - Your app will be live in ~30 seconds!
   - You'll get a URL like: `https://pricetracker-xyz.vercel.app`

4. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain (free SSL included)

### CLI Method:
```bash
npm install -g vercel
vercel login
vercel
```

## Option 2: GitHub Pages (Free)

Deploy directly from your GitHub repository.

### Steps:

1. **Update vite.config.js** (Already configured for you!)
   - The base path is set to `'./'` for flexible deployment

2. **Create GitHub Repository**
   ```bash
   # Create a new repository on GitHub, then:
   git remote add origin https://github.com/yourusername/pricetracker.git
   git branch -M main
   git add .
   git commit -m "Ready for deployment"
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: GitHub Actions
   - The workflow is already set up in `.github/workflows/deploy.yml`

4. **Deploy**
   - Push to main branch
   - GitHub Actions will build and deploy automatically
   - Your app will be at: `https://yourusername.github.io/pricetracker/`

## Option 3: Netlify

Another excellent free hosting option with great features.

### Steps:

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **New Site from Git**
   - Click "Add new site" → "Import an existing project"
   - Connect to your GitHub repository
   - Build settings are auto-detected:
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **Deploy**
   - Click "Deploy site"
   - You'll get a URL like: `https://pricetracker-xyz.netlify.app`

4. **Continuous Deployment**
   - Every push to main automatically deploys

## Option 4: Cloudflare Pages

Fast global CDN with unlimited bandwidth (free tier).

### Steps:

1. **Create Cloudflare Account**
   - Go to [pages.cloudflare.com](https://pages.cloudflare.com)

2. **Create a Project**
   - Connect your GitHub repository
   - Build settings:
     - Framework preset: Vite
     - Build command: `npm run build`
     - Build output: `dist`

3. **Deploy**
   - Automatic deployments on git push
   - Global CDN distribution

## Pre-Deployment Checklist

- [ ] Test locally: `npm run dev`
- [ ] Build successfully: `npm run build`
- [ ] Preview build: `npm run preview`
- [ ] Update README with your repository info
- [ ] Commit all changes to Git
- [ ] Optional: Add environment variables for API keys

## Post-Deployment Steps

1. **Update README.md**
   - Add your live URL to the "Live Demo" section

2. **Test Your Deployed App**
   - Check all features work
   - Test on mobile devices
   - Verify API calls succeed

3. **Share Your App**
   - Share the URL with friends
   - Add it to your portfolio

## Monitoring & Analytics (Optional)

- **Google Analytics**: Add tracking to monitor users
- **Vercel Analytics**: Built-in analytics (Vercel only)
- **Sentry**: Error tracking for production issues

## Updating Your App

All platforms support automatic deployment:
```bash
git add .
git commit -m "Update: your changes"
git push
```

The app will automatically rebuild and deploy! 🎉

## Custom Domain Setup

All platforms support custom domains:

1. Purchase a domain (Namecheap, GoDaddy, etc.)
2. Add domain in platform settings
3. Update DNS records (CNAME or A record)
4. SSL certificate is automatically provisioned

## Troubleshooting

**Build fails?**
- Check `npm run build` works locally
- Ensure all dependencies are in `package.json`
- Check build logs for specific errors

**App loads but APIs fail?**
- Check browser console for CORS errors
- Verify API endpoints are accessible
- Check API rate limits

**Page not found on refresh?**
- GitHub Pages: Add 404.html redirecting to index.html
- Vercel/Netlify: Add vercel.json or netlify.toml redirect rules

---

Need help? Check the platform documentation or create an issue on GitHub!
