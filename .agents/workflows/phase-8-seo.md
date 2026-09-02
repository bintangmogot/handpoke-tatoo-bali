---
description: Phase 8 — Implement SEO, analytics, and social media meta tags.
---

# Phase 8: SEO & Analytics

> **Tools:** Google Search Console, Google Analytics (GA4), Vercel Analytics
> **Duration:** 1–3 hours initial setup + ongoing optimization
> **Output:** Discoverable, indexed website with analytics tracking

## Technical SEO Checklist (In-Code)

### HTML Structure
- [ ] Semantic HTML tags (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<article>`)
- [ ] One `<h1>` per page
- [ ] Proper heading hierarchy (H1 > H2 > H3 — no skipping levels)
- [ ] All `<img>` have descriptive `alt` text with keywords
- [ ] All `<a>` links are descriptive (never "click here")

### Meta Tags (Per Page)
```html
<!-- Title: 50-60 characters, include primary keyword -->
<title>Personal Trainer Bali | Coach Yohan - Premium Fitness in Canggu</title>

<!-- Description: 150-160 characters -->
<meta name="description" content="Transform your body with Coach Yohan. Premium personal training, meal plans, and fitness coaching in Canggu, Bali. Book your session today." />

<!-- Viewport (should already exist) -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### Open Graph (Social Sharing)
```html
<meta property="og:title" content="Page Title" />
<meta property="og:description" content="Page description" />
<meta property="og:image" content="https://mysite.com/og-image.jpg" />
<meta property="og:url" content="https://mysite.com/page" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Page Title" />
<meta name="twitter:description" content="Page description" />
<meta name="twitter:image" content="https://mysite.com/og-image.jpg" />
```

### Performance (SEO Impact)
- [ ] Fast loading (LCP < 2.5s)
- [ ] No layout shift (CLS < 0.1)
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] Images optimized (WebP, lazy loading)

## Sitemap & Robots

### robots.txt
Create `public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml
```

### Sitemap
- **Next.js:** Use `next-sitemap` package
- **Vite/SPA:** Create `public/sitemap.xml` manually or use `vite-plugin-sitemap`

## Analytics Setup

### Step 1: Google Search Console
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property → enter your domain
3. Verify via DNS (add TXT record in Cloudflare)
4. Submit sitemap URL: `https://yourdomain.com/sitemap.xml`
5. Monitor: indexing status, crawl errors, search queries

### Step 2: Google Analytics (GA4)
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create new GA4 property
3. Get Measurement ID (G-XXXXXXXXXX)
4. Add to `index.html` or use `@analytics/google` package
5. Track: page views, conversions, user behavior

### Step 3: Vercel Analytics (Optional)
1. Vercel Dashboard → Analytics tab → Enable
2. Free basic tier: Core Web Vitals, page views
3. No code changes needed

### Step 4: Submit to Bing
1. Go to [bing.com/webmasters](https://www.bing.com/webmasters)
2. Import from Google Search Console (fastest method)

## Ongoing SEO Tasks

| Task | Frequency |
|------|-----------|
| Check Search Console for errors | Weekly |
| Review keyword rankings | Monthly |
| Update meta descriptions if needed | Monthly |
| Add new content / pages | As needed |
| Check broken links | Monthly |
| Monitor Core Web Vitals | Monthly |
