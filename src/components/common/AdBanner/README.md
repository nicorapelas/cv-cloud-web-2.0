# AdBanner System

## Overview
The AdBanner system provides a sticky bottom banner for displaying advertisements across all authenticated pages in the CV Cloud web app.

## Features
- ✅ Sticky bottom positioning (always visible)
- ✅ Responsive design (90px desktop, 60px mobile)
- ✅ Automatically hidden for premium users
- ✅ Shows on all `/app/*` routes
- ✅ Hidden on public pages (login, signup, landing)
- ✅ Controlled via `AdvertisementContext`

## File Structure
```
AdBanner/
├── AdBanner.js          # Main component with logic
├── AdBanner.css         # Sticky banner styles
├── ads/
│   ├── GenericAd.js     # Generic placeholder ad
│   └── index.js         # Export all ads
├── index.js
└── README.md
```

## Usage

### Current Implementation
The banner is automatically added to all authenticated routes via `ProtectedRoute` in `App.js`:

```jsx
<ProtectedRoute>
  {children}
  <AdBanner />
</ProtectedRoute>
```

### Ad Visibility Rules
The banner will NOT show if:
1. `user.tier === 'premium'` (premium users don't see ads)
2. `bannerAdStripShow === false` (controlled via context)

The banner WILL show for:
- Regular users (tier: 'free')
- HR users (tier: 'free' or not premium)

## Adding New Ads

### Step 1: Create New Ad Component
Create a new file in `ads/` folder:

```jsx
// ads/UdemyAd.js
import React from 'react';

const UdemyAd = () => {
  return (
    <div className="generic-ad">
      <div className="generic-ad-icon">🎓</div>
      <div className="generic-ad-text">
        <h3 className="generic-ad-title">
          Boost your career with 10,000+ courses on Udemy
        </h3>
        <p className="generic-ad-subtitle">
          Learn new skills to stand out in your job search
        </p>
      </div>
      <a
        href="https://click.linksynergy.com/YOUR_AFFILIATE_LINK"
        className="generic-ad-cta"
        target="_blank"
        rel="noopener noreferrer"
      >
        Explore Courses →
      </a>
    </div>
  );
};

export default UdemyAd;
```

### Step 2: Export the New Ad
Update `ads/index.js`:

```jsx
export { default as GenericAd } from './GenericAd';
export { default as UdemyAd } from './UdemyAd';
```

### Step 3: Add to AdBanner Switch
Update `AdBanner.js`:

```jsx
import UdemyAd from './ads/UdemyAd';

const renderAdContent = () => {
  switch (bannerAdStripSelected) {
    case 'udemy':
      return <UdemyAd />;
    case 'generic':
    default:
      return <GenericAd />;
  }
};
```

### Step 4: Update Context (Optional)
To switch ads, update `AdvertisementContext.js`:

```jsx
{
  bannerAdStripSelected: 'udemy', // Change from 'generic'
}
```

## Testing

### Test Premium User (No Ads)
1. Update a test user's tier to 'premium' in the database
2. Login as that user
3. Verify no ad banner appears

### Test Free User (Show Ads)
1. Login as a regular user (tier: 'free')
2. Navigate to any `/app/*` route
3. Verify ad banner appears at bottom

### Test Responsive Design
1. Resize browser window
2. Verify banner adjusts height:
   - Desktop: 90px
   - Mobile (<768px): 60px
3. Check text remains readable

## Customization

### Change Banner Height
Edit `AdBanner.css`:

```css
.ad-banner-container {
  height: 90px; /* Change this */
}

@media (max-width: 768px) {
  .ad-banner-container {
    height: 60px; /* And this for mobile */
  }
}
```

**Important:** Also update `index.css`:

```css
.app-container {
  padding-bottom: 110px; /* height + 20px spacing */
}
```

### Change Banner Colors
Edit gradient in `AdBanner.css`:

```css
.ad-banner-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Change to your brand colors */
}
```

### Disable Ads Globally
In `AdvertisementContext.js`:

```jsx
{
  bannerAdStripShow: false, // Set to false
}
```

Or programmatically:

```jsx
const { setBannerAdStripShow } = useContext(AdvertisementContext);
setBannerAdStripShow(false);
```

## Future Enhancements

### Ad Rotation
Implement automatic ad rotation:

```jsx
useEffect(() => {
  const ads = ['generic', 'udemy', 'coursera'];
  let index = 0;
  
  const interval = setInterval(() => {
    index = (index + 1) % ads.length;
    setBannerAdStripSelected(ads[index]);
  }, 30000); // Rotate every 30 seconds
  
  return () => clearInterval(interval);
}, []);
```

### Click Tracking
Add analytics:

```jsx
const handleAdClick = (adName) => {
  // Google Analytics
  window.gtag('event', 'ad_click', {
    ad_name: adName,
  });
  
  // Or custom API
  api.post('/api/analytics/ad-click', { adName });
};
```

### A/B Testing
Test different ad variations:

```jsx
const adVariant = user._id % 2 === 0 ? 'variantA' : 'variantB';
```

### Close Button (Optional)
Allow users to dismiss ads temporarily:

```jsx
const [dismissed, setDismissed] = useState(false);

if (dismissed) return null;

return (
  <div className="ad-banner-container">
    <button onClick={() => setDismissed(true)}>×</button>
    {/* ad content */}
  </div>
);
```

## Troubleshooting

### Banner Not Showing
1. Check `user.tier !== 'premium'`
2. Check `bannerAdStripShow === true` in context
3. Verify you're on an `/app/*` route
4. Check browser console for errors

### Content Hidden Behind Banner
1. Verify `padding-bottom` in `.app-container` (index.css)
2. Should be: 110px desktop, 80px mobile
3. Clear browser cache

### Banner Too Tall/Short on Mobile
1. Check media query breakpoint in `AdBanner.css`
2. Adjust height for `@media (max-width: 768px)`

## Contact
For questions about the ad system, contact the development team.

