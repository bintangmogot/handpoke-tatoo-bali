---
description: Phase 6 — Deploy the application to Vercel or Cloudflare Pages.
---

# Phase 6: Deployment

> **Tools:** Vercel (primary), Cloudflare Pages (static sites)
> **Duration:** 15–30 min (first deploy), automatic (subsequent)
> **Output:** Live website accessible worldwide

## Platform Decision

| If Your Project Is... | Use |
|-----------------------|-----|
| Next.js (any complexity) | **Vercel** (they built Next.js) |
| Vue/Vite SPA or landing page | **Vercel** or **Cloudflare Pages** |
| Static site with zero backend | **Cloudflare Pages** (unlimited bandwidth) |
| Full-stack with heavy backend | **Vercel** frontend + **Railway** backend ($5/mo) |

## Pre-Deploy Checklist

- [ ] `npm run build` succeeds locally
- [ ] `npm run preview` shows correct website
- [ ] All routes work (including direct URL access / refresh)
- [ ] No console errors in production build
- [ ] Environment variables list ready for dashboard
- [ ] Latest code pushed to GitHub

## Deploy to Vercel (First Time)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **"Add New..."** → **"Project"**
3. Find your repo → Click **"Import"**
4. Verify auto-detected settings:
   - Build Command: `npm run build`
   - Output Directory: `dist` (Vite) or `.next` (Next.js)
5. Add environment variables (Settings → Environment Variables)
6. Click **"Deploy"**
7. Wait 1–3 minutes → **Live! 🎉**

## Deploy to Cloudflare Pages (Alternative)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages
2. Create Application → Pages → Connect to Git
3. Select repo → Configure build:
   - Build Command: `npm run build`
   - Build Output: `dist`
4. Deploy → Live with unlimited bandwidth!

## Post-Deploy Verification

- [ ] Visit live URL on desktop browser
- [ ] Test on real mobile device
- [ ] All routes load directly (no 404 on refresh)
- [ ] Images and fonts load correctly
- [ ] HTTPS works (padlock icon in browser)
- [ ] Share URL with someone else to confirm it works

## SPA Routing Fix (If Getting 404 on Refresh)

Create `vercel.json` in project root:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Subsequent Updates

```bash
# Edit code → test → commit → push → done!
git add .
git commit -m "✨ feat: add contact section"
git push
# Vercel/Cloudflare auto-deploys in ~1 minute ✅
```
