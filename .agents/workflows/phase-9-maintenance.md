---
description: Phase 9 — Ongoing maintenance, monitoring, and iteration after launch.
---

# Phase 9: Maintenance & Iteration

> **Tools:** GitHub (Dependabot), Vercel Monitoring, Google Analytics
> **Duration:** Ongoing (weekly check-ins)
> **Output:** Stable, secure, evolving application

## Post-Launch Checklist (First 2 Weeks)

- [ ] Monitor Vercel dashboard for failed deployments
- [ ] Check Google Search Console for crawl errors
- [ ] Review Lighthouse scores
- [ ] Share live URL — collect user feedback
- [ ] Fix critical bugs immediately
- [ ] Test on multiple devices/browsers

## Iteration Cycle

```
Collect Feedback → Prioritize Issues → Plan Fix/Feature → Code → Test → Deploy → Repeat
```

Focus on:
1. **Bug fixes** — highest priority, deploy immediately
2. **UX improvements** — based on real user feedback
3. **New features** — from the "Nice to Have" backlog (Phase 0)
4. **Performance** — optimize images, bundle size, loading speed

## Monthly Maintenance Tasks

| Task | How | Tool |
|------|-----|------|
| Update npm dependencies | `npm outdated` → `npm update` | Terminal |
| Review security alerts | Check Dependabot PRs | GitHub |
| Check broken links | Run link checker | [deadlinkchecker.com](https://deadlinkchecker.com) |
| Lighthouse audit | F12 → Lighthouse tab | Chrome DevTools |
| Review analytics | Check visitor trends, top pages | GA4 / Vercel |
| Backup database | Automatic or manual export | Supabase / hosting |
| Update content/copy | Edit text, images, pricing | Direct in code or CMS |
| Check SSL expiry | Should auto-renew | Vercel / Cloudflare |

## Dependency Update Workflow

```bash
# 1. Check what's outdated
npm outdated

# 2. Update minor versions (safe)
npm update

# 3. For major versions, update one by one and test
npm install package-name@latest

# 4. Test after updating
npm run build
npm run dev
# Click through critical flows

# 5. Commit
git add .
git commit -m "🔧 chore: update dependencies"
git push
```

## When to Do a Major Update

| Signal | Action |
|--------|--------|
| Framework major version (Vue 4, Next 16) | Plan migration, read changelog |
| Security vulnerability alert | Update immediately |
| Performance degradation | Audit and optimize |
| User complaints about feature | Prioritize UX fix |
| 6+ months since last dep update | Schedule maintenance day |

## Client Project Maintenance

For freelance/client projects, set up a maintenance plan:

| Tier | Price | Includes |
|------|-------|----------|
| Basic | $20/month | Hosting monitoring, dependency updates, 1 small fix |
| Standard | $50/month | Above + content updates, 3 fixes, monthly report |
| Premium | $100/month | Above + new features, SEO monitoring, priority support |

> Upsell maintenance to every client after delivery. Recurring revenue!
