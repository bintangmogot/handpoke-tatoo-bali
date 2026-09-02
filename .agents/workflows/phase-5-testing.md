---
description: Phase 5 — Test and QA the application before deployment.
---

# Phase 5: Testing & QA

> **Tools:** Browser DevTools, Playwright (via webapp-testing skill), Lighthouse
> **Duration:** 1–4 hours per feature, full QA before deploy
> **Output:** Verified, bug-free application ready for production

## Testing Levels

| Level | What | Tool | When |
|-------|------|------|------|
| **Manual QA** | Click through every flow | Browser / Expo Go | After each feature |
| **Visual QA** | Compare with Stitch/Figma designs | Side-by-side | After styling |
| **Responsive QA** | Test all breakpoints | DevTools responsive mode | After each page |
| **Performance** | Lighthouse audit | Chrome DevTools | Before deploy |
| **Cross-browser** | Chrome, Firefox, Safari, Edge | Manual / BrowserStack | Before deploy |
| **Unit Tests** | Core business logic | Vitest / Jest | If requested |
| **E2E Tests** | Critical user flows | Playwright | For production apps |

## Manual QA Checklist (Per Page)

- [ ] Page loads without errors (check console: F12)
- [ ] All text is readable (no overflow, no truncation)
- [ ] All images load correctly
- [ ] All links work (no broken links, no 404s)
- [ ] All buttons are clickable and give visual feedback
- [ ] Forms validate correctly (required, format, length)
- [ ] Error states handled gracefully (empty, API fail, timeout)
- [ ] Loading states exist where needed (spinner, skeleton)
- [ ] Mobile: touch targets ≥ 44px
- [ ] Mobile: no horizontal scroll
- [ ] Dark mode: all elements visible (if applicable)

## Pre-Deploy Full QA

- [ ] ALL pages/routes tested manually
- [ ] Direct URL access works (e.g., `yourdomain.com/about` doesn't 404)
- [ ] `npm run build` completes without errors
- [ ] `npm run preview` shows correct website
- [ ] Lighthouse scores: Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 90
- [ ] No console errors in production build
- [ ] Tested on real mobile device (not just DevTools)
- [ ] All environment variables documented for deployment

## Performance Targets (Lighthouse)

| Metric | Target |
|--------|--------|
| Performance | ≥ 90 |
| Accessibility | ≥ 90 |
| Best Practices | ≥ 95 |
| SEO | ≥ 90 |
| FCP (First Contentful Paint) | < 1.5s |
| LCP (Largest Contentful Paint) | < 2.5s |
| CLS (Cumulative Layout Shift) | < 0.1 |
