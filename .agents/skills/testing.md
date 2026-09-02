---
name: Testing Guidelines
description: Rules for writing tests and performing QA across web and mobile projects.
---

# Testing Philosophy
- Write tests that focus on **user behavior and core business logic**, not implementation details.
- Aim for high coverage on **critical paths** (Authentication, Payment, Core Features).
- Manual QA is always required before deployment — automated tests complement, not replace.

# Testing Levels

| Level | What | Tool | When |
|-------|------|------|------|
| **Manual Testing** | Click through every flow | Browser / Expo Go | After each feature |
| **Visual Testing** | Compare with Stitch/Figma designs | Side-by-side | After styling |
| **Responsive Testing** | Test all breakpoints (mobile, tablet, desktop) | DevTools / real device | After each page |
| **Performance Testing** | Lighthouse audit (target: all scores ≥ 90) | Chrome DevTools | Before deploy |
| **Cross-browser** | Chrome, Firefox, Safari, Edge | Manual or BrowserStack | Before deploy |
| **Unit Tests** | Core business logic | Jest + RTL / Vitest | If requested |
| **E2E Tests** | Critical user flows | Playwright | For production apps |

# Tools by Project Type

| Project Type | Unit Tests | E2E Tests | Component Tests |
|-------------|-----------|-----------|----------------|
| **Vue 3 + Vite** | Vitest | Playwright | Vue Test Utils |
| **Next.js / React** | Jest + React Testing Library | Playwright | RTL |
| **React Native / Expo** | Jest + RNTL | Detox (if needed) | RNTL |
| **Laravel** | PHPUnit | Laravel Dusk | — |
| **WordPress** | — | Manual QA | — |

# Manual QA Checklist (Per Page/Screen)

- [ ] Page loads without errors (no console errors)
- [ ] All text is readable (no overflow, no truncation)
- [ ] All images load correctly
- [ ] All links work (no broken links, no 404s)
- [ ] All buttons are clickable and give visual feedback
- [ ] Forms validate correctly (required fields, email format, etc.)
- [ ] Error states are handled gracefully (empty states, API failures)
- [ ] Loading states exist where needed (spinners, skeletons)
- [ ] Mobile: touch targets are ≥ 44px
- [ ] Mobile: no horizontal scroll
- [ ] Dark mode: all elements are visible and contrasted (if applicable)

# Performance Targets (Lighthouse)

| Metric | Target |
|--------|--------|
| Performance | ≥ 90 |
| Accessibility | ≥ 90 |
| Best Practices | ≥ 95 |
| SEO | ≥ 90 |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |

# Rules for the AI

- When asked to "write tests" for a file, always **mock external API calls and database connections**.
- Ensure all test descriptions (`it` or `test` blocks) clearly state **what is being tested and the expected outcome** in plain English.
- Prefer `describe` blocks to group related tests logically.
- For Vue projects, use Vitest over Jest unless the project already uses Jest.
- For React/Next.js projects, use Jest + React Testing Library.
- Always include at least one **happy path** test and one **error/edge case** test.
