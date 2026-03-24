# Deployment Guide for Locara

This guide covers deploying Locara to various hosting platforms.

## Quick Start Deployment

### Netlify (Recommended)

**Automatic Deployment:**

1. Push code to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/locara.git
git push -u origin main
```

2. Connect to Netlify:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add New Site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Build settings auto-fill:
     - **Build command:** `pnpm build`
     - **Publish directory:** `.next`
   - Click "Deploy site"

3. Add environment variables in Netlify dashboard:
   - Go to **Settings** → **Build & deploy** → **Environment**
   - Add `JWT_SECRET` and any other secrets

**Result:** Your site will be live at `https://locara-xxx.netlify.app`

### Vercel (Alternative)

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Deploy (auto-configured for Next.js)

**Result:** Your site will be live at `https://locara.vercel.app`

## Environment Variables

Set these in your hosting platform's environment variables section:

```env
JWT_SECRET=your_secret_key_change_this_in_production
NEXT_PUBLIC_API_URL=https://your-domain.com
```

## Performance Optimization

The application includes:
- ✅ Image optimization (WebP, AVIF formats)
- ✅ Code splitting and lazy loading
- ✅ CSS-in-JS optimization with Tailwind
- ✅ SWC minification for faster builds
- ✅ Compression enabled by default
- ✅ Security headers configured
- ✅ PWA support (manifest.json, service worker)

## Security Features

**Built-in Security:**
- X-Content-Type-Options
- X-Frame-Options (DENY)
- X-XSS-Protection
- Referrer-Policy (strict-origin-when-cross-origin)
- Content-Security-Policy configured
- HTTPS enforced in production

## Monitoring

After deployment, monitor:
- Page load times (Lighthouse)
- Error rates (browser console/logs)
- API response times
- User engagement metrics

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### 404 on Routes
- Verify `netlify.toml` rewrite rules
- Check Next.js routing in `src/app`

### Environment Variables Not Loading
- Confirm variables are set in platform dashboard
- Rebuild deployment after adding variables
- Restart development server locally

## Analytics & SEO

Add to your hosting platform:
- **Google Analytics:** track user behavior
- **Search Console:** monitor search performance
- **Sitemap:** auto-generated at `/sitemap.xml`

## Custom Domain

### Netlify
1. Go to **Site settings** → **Domain management**
2. Add custom domain
3. Update DNS records (provided by Netlify)

### Vercel
1. Go to **Settings** → **Domains**
2. Add custom domain
3. Follow DNS setup instructions

## SSL/HTTPS

Both Netlify and Vercel provide:
- ✅ Free SSL certificates
- ✅ Auto-renewal
- ✅ Automatic HTTPS redirects

## Scaling

For high traffic:
- Enable edge caching (CDN)
- Use serverless functions for APIs
- Consider database optimization
- Implement rate limiting

## Support

- **Netlify Docs:** https://docs.netlify.com/
- **Vercel Docs:** https://vercel.com/docs/
- **Next.js Docs:** https://nextjs.org/docs/
