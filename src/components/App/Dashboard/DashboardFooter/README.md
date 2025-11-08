# Dashboard Footer Component

A professional footer component for the CV Cloud dashboard that provides quick access to important links, legal information, and support resources.

## Features

- **Company Branding**: CV Cloud logo and tagline
- **Quick Links**: Easy navigation to main dashboard features
- **Legal Information**: Terms & Conditions and Privacy Policy with modal integration
- **Support**: Contact and help resources
- **Version Display**: Shows current app version
- **Responsive Design**: Optimized for all screen sizes
- **Smooth Animations**: Fade-in animations for better UX

## Usage

```jsx
import DashboardFooter from './DashboardFooter/DashboardFooter';

const Dashboard = () => {
  return (
    <div>
      {/* Your dashboard content */}
      <DashboardFooter />
    </div>
  );
};
```

## Components Used

- `TermsAndConditionsModal`: Modal for displaying Terms & Conditions and Privacy Policy

## Sections

### 1. Company Info
- CV Cloud logo
- Tagline: "Create professional CVs in minutes"
- Copyright notice

### 2. Quick Links
- Dashboard
- View CV
- Share CV

### 3. Legal
- Terms & Conditions (opens modal)
- Privacy Policy (opens modal)

### 4. Support
- Contact Us (mailto link)
- Get Help (mailto link with support subject)

### 5. Bottom Bar
- "Made with ❤️ in South Africa"
- App version badge

## Styling

The footer uses:
- Dark gradient background (#1e293b to #0f172a)
- Responsive grid layout
- Hover effects on links with smooth transitions
- Mobile-first responsive design
- Fade-in animations for sections

## Responsive Breakpoints

- Desktop: 4-column grid layout
- Tablet (≤768px): 2-column grid layout
- Mobile (≤480px): Single column layout

## Customization

### Changing Links

Edit the `dashboard-footer-links` sections in `DashboardFooter.js`:

```jsx
<a href="/your-link" className="dashboard-footer-link">
  Your Link Text
</a>
```

### Changing Contact Email

Update the `mailto:` links:

```jsx
<a href="mailto:youremail@domain.com" className="dashboard-footer-link">
  Contact Us
</a>
```

### Changing Version Number

The version is hardcoded in the component. Update it in `DashboardFooter.js`:

```jsx
<span className="dashboard-footer-version">v1.0.2</span>
```

## Notes

- The Terms & Conditions modal is integrated and opens when clicking legal links
- All external links use proper href attributes
- The footer has a top margin to provide spacing from dashboard content
- Animations are staggered for a smooth appearance effect

