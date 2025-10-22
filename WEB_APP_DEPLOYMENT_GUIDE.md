# Web App Environment Configuration Guide

## ✅ Dynamic Server URL Configuration Implemented!

Your web app now automatically switches between development and production server URLs based on the `NODE_ENV` environment variable.

---

## 📁 Configuration Files Created/Updated

**Note:** All config files are in `src/config/` (Create React App requirement)

### 1. **`src/config/keys.js`** (NEW - Environment Switcher)

```javascript
let keys;

if (process.env.NODE_ENV === 'production') {
  keys = require('./keys_prod').default;
} else {
  keys = require('./keys_dev').default;
}

export default keys;
```

### 2. **`src/config/keys_dev.js`** (UPDATED - Development)

```javascript
const keys = {
  serverUrl: 'http://localhost:5000', // Development server
  cloudinary: {
    uploadVideoUrl: 'https://api.cloudinary.com/v1_1/cv-cloud/video/upload',
    uploadPdfUrl: 'https://api.cloudinary.com/v1_1/cv-cloud/raw/upload',
    uploadImageUrl: 'https://api.cloudinary.com/v1_1/cv-cloud/image/upload',
  },
};

export default keys;
```

### 3. **`src/config/keys_prod.js`** (NEW - Production)

```javascript
const keys = {
  serverUrl: 'https://cv-cloud-server-v25-d7d4ce152279.herokuapp.com', // Production server
};

export default keys;
```

---

## 🔧 Files Updated with Dynamic URLs

### 1. **`src/api/api.js`** ✅

**Before:**

```javascript
const instance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});
```

**After:**

```javascript
import keys from '../config/keys';

const instance = axios.create({
  baseURL: keys.serverUrl,
  withCredentials: true,
});
```

### 2. **`src/services/socketService.js`** ✅

**Before:**

```javascript
this.socket = io('http://localhost:5000', { ... });
```

**After:**

```javascript
import keys from '../config/keys';

this.socket = io(keys.serverUrl, { ... });
```

### 3. **`src/components/App/forms/firstImpression/FirstImpressionRecordUpload.js`** ✅

**Before:**

```javascript
fetch('http://localhost:5000/api/cloudinary/signature-request-no-preset', ...)
fetch('http://localhost:5000/api/first-impression', ...)
```

**After:**

```javascript
import keys from '../../../../config/keys';

fetch(`${keys.serverUrl}/api/cloudinary/signature-request-no-preset`, ...)
fetch(`${keys.serverUrl}/api/first-impression`, ...)
```

---

## 🎯 How It Works

### Development (Local)

When running locally with `npm start`:

- `NODE_ENV` is undefined or set to 'development'
- Uses `config/keys_dev.js`
- Server URL: `http://localhost:5000`

### Production (Deployed)

When building for production with `npm run build`:

- `NODE_ENV` is set to 'production'
- Uses `config/keys_prod.js`
- Server URL: `https://cv-cloud-server-v25-d7d4ce152279.herokuapp.com`

---

## 🚀 Deployment Steps

### 1. Build for Production

```bash
cd /home/nicorapelas/Workspace/cv-cloud/rebuild/web
npm run build
```

This creates an optimized production build in the `build/` directory.

### 2. Deploy to Your Hosting (Options)

#### Option A: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

#### Option B: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Option C: AWS S3 + CloudFront

```bash
# Upload build folder to S3
aws s3 sync build/ s3://your-bucket-name/ --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

#### Option D: Heroku (Static Site)

```bash
# Add buildpack for create-react-app
heroku create cv-cloud-web --buildpack mars/create-react-app
git push heroku main
```

---

## ⚙️ Environment Variables

Your web app doesn't need environment variables for the server URL because it's configured in the `keys_*.js` files.

However, if you want to make it even more flexible, you can use `.env` files:

### Create `.env.development`

```
REACT_APP_SERVER_URL=http://localhost:5000
```

### Create `.env.production`

```
REACT_APP_SERVER_URL=https://cv-cloud-server-v25-d7d4ce152279.herokuapp.com
```

### Update `src/config/keys_prod.js`

```javascript
const keys = {
  serverUrl:
    process.env.REACT_APP_SERVER_URL ||
    'https://cv-cloud-server-v25-d7d4ce152279.herokuapp.com',
};

export default keys;
```

---

## 🔍 Verification

### Check Current Configuration

In your browser console (after running the app):

```javascript
// This will show which server URL is being used
console.log('NODE_ENV:', process.env.NODE_ENV);
```

### Test API Calls

```javascript
// All API calls now go through the configured server
// Development: http://localhost:5000/api/...
// Production: https://cv-cloud-server-v25-d7d4ce152279.herokuapp.com/api/...
```

---

## 📋 Checklist Before Deploying

- [x] Dynamic server URL configured
- [x] `config/keys.js` created
- [x] `config/keys_dev.js` updated
- [x] `config/keys_prod.js` created
- [x] `src/api/api.js` updated
- [x] `src/services/socketService.js` updated
- [x] `src/components/.../FirstImpressionRecordUpload.js` updated
- [ ] Run `npm run build` successfully
- [ ] Test production build locally (optional)
- [ ] Deploy to hosting platform
- [ ] Test live site

---

## 🧪 Testing Production Build Locally

Before deploying, you can test the production build locally:

```bash
# Build
npm run build

# Serve the build folder
npx serve -s build -l 3000

# Open http://localhost:3000
# It should connect to production server
```

---

## 🌐 CORS Configuration

Make sure your **server** allows requests from your web app domain.

In `server/startup/routes.js`, update the CORS config:

```javascript
app.use(
  cors({
    origin: [
      'http://localhost:3000', // Development
      'https://www.cvcloud.app', // Production
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);
```

**Important:** Add your actual production web app URL to the origin array!

---

## 🎨 Custom Domain Setup

If deploying to `https://www.cvcloud.app`:

1. **Update server CORS** (see above)
2. **Update DNS records** to point to your hosting
3. **Configure SSL** (usually automatic with Netlify/Vercel)
4. **Test the deployment**

---

## 📝 Summary

### What Changed:

- ✅ No more hardcoded `localhost:5000` URLs
- ✅ Automatic environment detection
- ✅ Single configuration point for server URL
- ✅ Works in both development and production

### URLs in Use:

- **Development:** `http://localhost:5000`
- **Production:** `https://cv-cloud-server-v25-d7d4ce152279.herokuapp.com`
- **Web App (target):** `https://www.cvcloud.app`

---

## 🆘 Troubleshooting

### Issue: CORS errors in production

**Solution:** Add your web app domain to server CORS config

### Issue: API calls go to localhost in production

**Solution:** Verify `NODE_ENV=production` during build

### Issue: Socket.io not connecting

**Solution:** Check server URL in browser console, verify WebSocket isn't blocked

---

## ✅ Ready to Deploy!

Your web app is now configured to automatically use the correct server URL based on the environment. Just run `npm run build` and deploy! 🚀
