# Climate Adaptation Dashboard - Deployment Guide

## Overview
This document provides instructions for deploying the Climate Adaptation Avoided Loss Dashboard to various hosting platforms.

## Build Files
The production build is located in the `dist/` directory and contains:
- `index.html` - Main HTML file
- `assets/` - JavaScript and CSS bundles
- All necessary dependencies bundled

## Deployment Options

### Option 1: Netlify (Recommended - Free Tier Available)

#### Method A: Drag and Drop
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire `dist` folder onto the page
3. Your site will be live immediately with a URL like `https://random-name.netlify.app`

#### Method B: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy from the project directory
cd /home/ubuntu/climate-adaptation-dashboard
netlify deploy --prod --dir=dist
```

### Option 2: Vercel (Free Tier Available)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from the project directory
cd /home/ubuntu/climate-adaptation-dashboard
vercel --prod
```

When prompted:
- Set up and deploy: Yes
- Which scope: Your account
- Link to existing project: No
- Project name: climate-adaptation-dashboard
- In which directory is your code located: ./
- Want to override settings: Yes
- Build Command: `pnpm build`
- Output Directory: `dist`
- Development Command: `pnpm dev`

### Option 3: GitHub Pages

1. Create a new repository on GitHub
2. Push the code:
```bash
cd /home/ubuntu/climate-adaptation-dashboard
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/climate-adaptation-dashboard.git
git push -u origin main
```

3. Update `vite.config.js` to add base path:
```javascript
export default defineConfig({
  base: '/climate-adaptation-dashboard/',
  // ... rest of config
})
```

4. Rebuild: `pnpm build`

5. Deploy to GitHub Pages:
```bash
git add dist -f
git commit -m "Add dist folder"
git subtree push --prefix dist origin gh-pages
```

6. Enable GitHub Pages in repository settings (Settings → Pages → Source: gh-pages branch)

### Option 4: AWS S3 + CloudFront

1. Create an S3 bucket
2. Enable static website hosting
3. Upload contents of `dist/` folder
4. Set bucket policy for public read access
5. (Optional) Set up CloudFront distribution for CDN

### Option 5: Local Server (Testing/Internal Use)

```bash
# Using Python
cd /home/ubuntu/climate-adaptation-dashboard/dist
python3 -m http.server 8080

# Using Node.js serve package
npx serve dist -p 8080
```

## Post-Deployment

After deployment, your dashboard will be accessible at the provided URL with all features:
- ✅ Activities browser with search/filter
- ✅ Editable assumptions with real-time calculations
- ✅ Company analysis
- ✅ Excel export functionality
- ✅ FactSet segment mappings

## Custom Domain

Most platforms (Netlify, Vercel) allow you to add a custom domain:
1. Go to domain settings in the platform dashboard
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate will be automatically provisioned

## Environment Variables

This dashboard is entirely client-side and doesn't require any environment variables or backend services.

## Troubleshooting

**Issue: Blank page after deployment**
- Check browser console for errors
- Verify the `base` path in `vite.config.js` matches your deployment path
- Ensure all files in `dist/` were uploaded

**Issue: 404 errors on refresh**
- Configure your hosting platform to redirect all routes to `index.html`
- For Netlify: Create `_redirects` file in `dist/` with: `/*    /index.html   200`
- For Vercel: Create `vercel.json` with rewrite rules

## Support

For issues specific to the dashboard functionality, refer to the main README.md file.

