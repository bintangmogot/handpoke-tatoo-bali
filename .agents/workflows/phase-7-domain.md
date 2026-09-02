---
description: Phase 7 — Buy and connect a custom domain to your deployment.
---

# Phase 7: Domain & DNS

> **Tools:** Cloudflare Registrar (recommended), Namecheap, Niagahoster
> **Duration:** 30 min setup + 1–24 hours DNS propagation
> **Output:** Custom domain pointing to your live deployment

## Registrar Recommendation (2026)

| Registrar | Price (.com) | Best Feature |
|-----------|-------------|--------------|
| **Cloudflare** ⭐ | ~$10/year | At-cost pricing (no markup), DDoS protection, best DNS |
| **Namecheap** | ~$10/year | WhoisGuard free, good UI |
| **Niagahoster** | ~Rp 150k/year | Indonesian support, local payment |

> **Best choice:** Cloudflare — cheapest, fastest DNS, free DDoS protection + CDN.

## Steps

### 1. Buy Domain
- Go to [cloudflare.com](https://cloudflare.com) → Domain Registration → Search
- Buy your domain (e.g., `myapp.com`)
- Pay via credit card or PayPal

### 2. Add Domain to Vercel
1. Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Enter your domain: `myapp.com`
3. Click **"Add"**

### 3. Configure DNS
Vercel will show required DNS records. Add them in Cloudflare:

```
Type: A     | Name: @   | Value: 76.76.21.21
Type: CNAME | Name: www | Value: cname.vercel-dns.com
```

### 4. Wait for Propagation
- DNS changes take **1–24 hours** (usually under 1 hour with Cloudflare)
- Vercel automatically provisions **SSL/HTTPS**
- Your site will be live at `https://myapp.com` ✅

### 5. Verify
- [ ] `https://myapp.com` loads correctly
- [ ] `https://www.myapp.com` redirects to `https://myapp.com`
- [ ] HTTPS padlock icon visible
- [ ] All pages still work

## Cloudflare Bonus Features (Free)
Once your domain is on Cloudflare, you get for free:
- **DDoS Protection** — automatic
- **CDN Caching** — static assets cached at edge
- **Analytics** — visitor stats
- **Page Rules** — redirects, caching rules
- **Email Routing** — forward `contact@myapp.com` to your Gmail
