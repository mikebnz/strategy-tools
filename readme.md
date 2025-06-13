# StrategAI Stakeholder Influence Mapper

A professional stakeholder mapping tool based on proven methodology used to win New Zealand's largest enterprise deals.

## Features

- **Stakeholder Mapping**: Add and categorize stakeholders with influence, support, and engagement metrics
- **Real-time Analysis**: Automatic calculations and strategic recommendations
- **Lead Generation**: Built-in lead capture for report generation
- **Mobile Responsive**: Works perfectly on all devices
- **Professional Branding**: StrategAI branding throughout

## Based on Proven Experience

This tool reflects methodology developed through:
- Winning New Zealand's largest managed services contract
- Leading teams of 40+ across complex government deals
- 30+ years of enterprise sales leadership at Datacom and Fujitsu

## Deployment Instructions

### For Netlify:

1. **Upload to GitHub**:
   - Create a new repository named `strategai-tools`
   - Upload all files from this package
   - Commit changes

2. **Connect to Netlify**:
   - In Netlify dashboard: "Add new site" → "Import existing project"
   - Connect to your GitHub repository
   - Build settings: Leave as default (Netlify auto-detects React)
   - Deploy!

3. **Custom Domain**:
   - In Netlify: Site Settings → Domain Management
   - Add custom domain: `tools.strategai.co.nz`
   - Update DNS records as shown

### Build Commands (Netlify auto-detects these):
- Build command: `npm run build`
- Publish directory: `build`

## File Structure

```
strategai-tools/
├── public/
│   └── index.html          # HTML template with SEO meta tags
├── src/
│   ├── App.js             # Main React component
│   ├── index.js           # React entry point
│   └── index.css          # Styles and Tailwind imports
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Contact

Mike Bullock  
Email: mike@wn.co.nz  
Phone: +64 27 449 6200  
LinkedIn: [linkedin.com/in/mike-bullock](https://linkedin.com/in/mike-bullock)

## Analytics Setup

To add Google Analytics:
1. Get your GA4 measurement ID
2. Replace `GA_MEASUREMENT_ID` in `public/index.html` with your actual ID

## Lead Capture

The tool includes lead capture functionality. When deployed on Netlify:
- Form submissions will appear in your Netlify dashboard
- You can set up email notifications
- Lead data is captured when users request reports

## Support

For technical support or customizations, contact mike@wn.co.nz