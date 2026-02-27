# Ascendify - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Step 1: Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Select "Next.js" as the framework preset

### Step 2: Configure Environment Variables
Add these variables in Vercel project settings:

```env
# Clerk Authentication (REQUIRED)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...

# Convex Backend (REQUIRED)
CONVEX_DEPLOYMENT=prod:your-project
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# AI Providers (at least one required)
GROQ_API_KEY=your_groq_api_key
GOOGLE_AI_STUDIO_KEY=your_gemini_api_key
GOOGLE_AI_STUDIO_KEY_BACKUP=your_backup_gemini_key
OPENROUTER_API_KEY=your_openrouter_api_key
AIML_API_KEY=your_aiml_api_key

# PayU Payments (INR gateway)
PAYU_MERCHANT_KEY=your_payu_key
PAYU_MERCHANT_SALT=your_payu_salt
PAYU_MODE=production

# Billing
BILLING_WEBHOOK_SYNC_SECRET=your_billing_sync_secret
NEXT_PUBLIC_CLERK_CHECKOUT_PRO_MONTHLY_URL=
NEXT_PUBLIC_CLERK_CHECKOUT_LIFETIME_URL=
NEXT_PUBLIC_CLERK_BILLING_PORTAL_URL=

# Site Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Optional: Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 3: Deploy Settings
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x or higher

### Step 4: Domain Setup
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown

## 📊 Post-Deployment Checklist

### Performance
- [ ] Test Lighthouse score (aim for 90+)
- [ ] Verify Core Web Vitals
- [ ] Check mobile responsiveness

### SEO
- [ ] Verify sitemap at `/sitemap.xml`
- [ ] Verify robots.txt at `/robots.txt`
- [ ] Submit sitemap to Google Search Console

### Security
- [ ] Verify security headers (use securityheaders.com)
- [ ] Test CSP (Content Security Policy)
- [ ] Check HTTPS is enforced

### Functionality
- [ ] Test user registration/onboarding
- [ ] Test habit tracking
- [ ] Test AI goal decomposition
- [ ] Test chatbot functionality
- [ ] Test offline mode (PWA)

## 🔧 Troubleshooting

### Build Fails
1. Check Node.js version (must be 18+)
2. Verify all environment variables are set
3. Check for TypeScript errors: `npm run build`

### API Routes Not Working
1. Verify environment variables in Vercel
2. Check function logs in Vercel dashboard
3. Ensure API keys are valid

### PWA Not Installing
1. Clear browser cache
2. Verify manifest.json loads correctly
3. Check service worker registration

## 📈 Monitoring

### Recommended Tools
- **Vercel Analytics**: Built-in (enable in project settings)
- **Uptime Monitoring**: UptimeRobot (free tier available)
- **Error Tracking**: Use Vercel's built-in error logs and Convex dashboard logs

### Performance Monitoring
1. Enable Vercel Speed Insights
2. Monitor Core Web Vitals
3. Set up alerting for performance regressions

## 🔐 Security Best Practices

### Environment Variables
- Never commit `.env.local` to Git
- Use Vercel's encrypted environment variables
- Rotate API keys periodically

### Headers (Already Configured)
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Strict-Transport-Security enabled
- Content-Security-Policy configured

## 📱 PWA Deployment Notes

### App Store Submission (Optional)
1. Use PWABuilder to generate app packages
2. Submit to Microsoft Store, Google Play
3. Configure deep linking

### Push Notifications
1. Generate VAPID keys
2. Configure in service worker
3. Set up notification scheduling

---

## Quick Commands

```bash
# Local development
npm run dev

# Production build test
npm run build && npm run start

# Type checking
npx tsc --noEmit

# Lint
npm run lint
```

## Support

For deployment issues, check:
1. Vercel deployment logs
2. Browser console errors
3. Network tab for failed requests
