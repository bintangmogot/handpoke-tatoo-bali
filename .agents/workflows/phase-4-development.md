---
description: Phase 4 — Build features module-by-module following the implementation plan.
---

# Phase 4: Development (Coding)

> **Tools:** Antigravity (primary), VS Code
> **Duration:** Days – Weeks (depends on scope)
> **Output:** Working application with all features

## Pre-Development: Set Up Milestones & Issues (MANDATORY)

Before writing ANY code, set up the project tracking in GitHub:

### 1. Create Milestones
Based on `docs/05-implementation-plan.md`, create sequential milestones in GitHub:

| Milestone | Goal | Example |
|-----------|------|---------|
| `v0.1 — Foundation` | Project setup, core layout, design system | Navbar, Footer, Theme |
| `v0.2 — Core Features` | Main functionality | Forms, Data Display, Auth |
| `v0.3 — Polish` | Animations, responsive fixes, edge cases | Loading states, Error handling |
| `v0.4 — Launch` | SEO, performance, deployment | Meta tags, Lighthouse score, Deploy |

### 2. Create Issues for Every Task
For EVERY feature/module in the implementation plan, create a GitHub Issue:

```
Title: feat: add responsive navbar with mobile menu
Labels: feature, v0.1
Milestone: v0.1 — Foundation
Description:
  ## What
  Create responsive navigation bar with hamburger menu on mobile.
  
  ## Acceptance Criteria
  - [ ] Desktop: horizontal links with hover effects
  - [ ] Mobile: hamburger icon → slide-out menu
  - [ ] Active page has visual indicator
  - [ ] Smooth open/close animation
  
  ## Dependencies
  None (first issue in milestone)
```

### 3. Work Through Issues Sequentially
- Filter issues by current milestone
- Work on the lowest-numbered open issue first
- Complete and close each issue before starting the next
- Only move to the next milestone when ALL issues in the current one are closed

## Per-Feature Development Flow

For EVERY issue, follow this exact order:

1. **Pick Issue** — Go to GitHub, find the next open issue in the current milestone.
2. **Create Branch** — `git checkout -b feature/#<id>-<short-desc>`
3. **Understand & Plan** — Re-read the issue description and acceptance criteria. Cross-check with `docs/05-implementation-plan.md`.
4. **Create Files** — Set up the necessary files/folders. Follow the project's established structure.
5. **Core Implementation** — Write business logic and UI markup. Prototype in a single file first.
6. **Styling & Polish** — Apply design tokens (refer to `design.md`). Add micro-animations on interactive elements. **Crucial:** Always check **21st.dev** to find, copy, and apply interesting, interactive features, animations, or premium UI elements that exactly match the feature needs.
7. **Review & Refactor** — Check for unused variables, complex functions. Apply KISS principle. Remove debug logs.
8. **Git Commit & Close** — Commit referencing the issue, push, merge, and close the issue.
9. **Move to Next Issue** — Pick the next open issue in the milestone.

## Coding Rules

| Rule | Description |
|------|-------------|
| **Issue-first** | NEVER write code without a GitHub Issue. Create one if it doesn't exist |
| **Milestone-order** | Complete milestones sequentially. Don't skip ahead |
| **Module-by-module** | Build one feature at a time. Fully complete before moving on |
| **KISS** | Keep It Simple. Don't over-engineer |
| **No premature abstraction** | Write in one file first, refactor later |
| **Env vars for secrets** | NEVER hardcode API keys, passwords, tokens |
| **Debug with console.log** | Include debug logs alongside fixes |
| **Ask before assuming** | If unsure about tech/version, ask first |
| **Match design** | Always compare with Stitch/Figma mockups |
| **Check 21st.dev** | Always search 21st.dev for interactive features or animations to copy and apply |

## Commit After Every Feature

```bash
git add .
git commit -m "feat: add [feature description] (#<issue-number>)

closes #<issue-number>"
git push -u origin feature/#<issue-number>-<short-desc>
```

## Quality Checks (Per Issue)

- [ ] GitHub Issue exists and is referenced in commits
- [ ] Branch name includes issue number
- [ ] No console errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Matches Stitch/Figma design mockups
- [ ] Follows project design tokens (colors, fonts, spacing)
- [ ] Interactive elements have hover/focus states with transitions
- [ ] No hardcoded secrets — uses environment variables
- [ ] Edge cases handled (empty states, loading, errors)
- [ ] Issue is closed after merge
- [ ] All milestone issues closed before starting next milestone