# Deployment Guide - Thanvish Travels

This guide covers deploying the Thanvish Travels React application to various platforms.

## Prerequisites

- Node.js 16+ and npm 8+ installed
- Firebase Realtime Database configured
- Git (for version control)

## Build for Production

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables (optional):**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_URL=https://travaling-76f20-default-rtdb.firebaseio.com
   VITE_APP_TITLE=Thanvish Travels
   VITE_APP_DESCRIPTION=Book Your Dream Journey
   ```

3. **Build the application:**
   ```bash
   npm run build
   ```
   
   This creates an optimized production build in the `dist` directory.

4. **Preview the production build locally:**
   ```bash
   npm run preview
   ```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   
   Or connect your GitHub repository to Vercel for automatic deployments.

3. **Set environment variables in Vercel dashboard:**
   - Go to Project Settings → Environment Variables
   - Add `VITE_FIREBASE_URL` if using a different Firebase instance

**Vercel Configuration (`vercel.json` - optional):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   netlify deploy --prod --dir=dist
   ```

3. **Or create `netlify.toml`:**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

4. **Set environment variables in Netlify dashboard:**
   - Site Settings → Environment Variables

### Option 3: Firebase Hosting

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting:**
   ```bash
   firebase init hosting
   ```
   
   Select options:
   - Public directory: `dist`
   - Configure as single-page app: `Yes`
   - Set up automatic builds: `Yes` (optional)

4. **Create `firebase.json`:**
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

5. **Deploy:**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

### Option 4: GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update `package.json`:**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/thanvish-travels"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. **Update `vite.config.js` base path:**
   ```js
   export default defineConfig({
     base: '/thanvish-travels/',
     // ... rest of config
   })
   ```

### Option 5: Traditional Web Hosting (cPanel, FTP, etc.)

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Upload contents of `dist` folder:**
   - Upload all files from `dist` directory to your web server
   - Ensure `index.html` is in the root directory

3. **Configure server:**
   - Set up URL rewriting to redirect all routes to `index.html`
   - For Apache, create `.htaccess`:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

## Environment Variables

Create a `.env` file for local development or set them in your hosting platform:

- `VITE_FIREBASE_URL` - Firebase Realtime Database URL
- `VITE_APP_TITLE` - Application title
- `VITE_APP_DESCRIPTION` - Application description

**Note:** Only variables prefixed with `VITE_` are exposed to the client-side code.

## Build Optimization

The production build includes:
- ✅ Code minification and tree-shaking
- ✅ Asset optimization and compression
- ✅ Code splitting for better performance
- ✅ Console.log removal in production
- ✅ Source maps disabled (enable if needed for debugging)

## Post-Deployment Checklist

- [ ] Verify Firebase database connection
- [ ] Test all routes and navigation
- [ ] Verify booking form submission
- [ ] Test admin login and dashboard
- [ ] Check mobile responsiveness
- [ ] Verify WhatsApp integration
- [ ] Test contact form submission
- [ ] Check browser console for errors
- [ ] Verify environment variables are set correctly
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)

## Troubleshooting

### Routes not working after deployment
- Ensure your hosting platform supports client-side routing
- Configure URL rewriting to redirect all routes to `index.html`

### Firebase connection errors
- Verify Firebase URL is correct in environment variables
- Check Firebase database rules allow read/write operations
- Ensure Firebase project is active

### Build fails
- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version: `node --version` (should be 16+)
- Review build errors in terminal output

### Assets not loading
- Verify `base` path in `vite.config.js` matches deployment path
- Check asset paths in browser developer tools
- Ensure all files from `dist` folder are uploaded

## Support

For issues or questions, contact the development team.

