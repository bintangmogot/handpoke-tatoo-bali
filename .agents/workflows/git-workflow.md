---
description: Rules and conventions for Git version control.
---

# Commit Message Standards

Use the Conventional Commits specification, enhanced with standard Gitmojis:

**Format:** `<emoji> <type>: <short lowercase description> (#<issue-number>)`

> **MANDATORY:** Every commit MUST reference a GitHub Issue number. If no issue exists, create one first.

| Type | Use When |
|------|----------|
| `feat:` | A new feature |
| `fix:` | A bug fix |
| `refactor:` | Code restructure (no new feature, no fix) |
| `style:` | UI/CSS-only changes |
| `docs:` | Documentation changes |
| `chore:` | Build tools, configs, dependencies |
| `test:` | Adding or updating tests |
| `perf:` | Performance improvements |
| `init:` | Initial commit / project setup |

**Examples:**
```
feat: add user login form interface (#12)
fix: resolve navbar overlap on mobile (#15)
refactor: extract auth logic into custom hook (#18)
style: update button hover animations (#20)
docs: add module 2 guide (#22)
chore: update tailwindcss to v4 (#25)
test: add unit tests for budget calculator (#27)
init: initial project setup (#1)
```

**Closing Issues via Commit:**
Add `closes #<number>` in the commit body to auto-close the issue on merge:
```
feat: add contact form validation (#14)

- Added email format validation
- Added required field checks
- Added error message display

closes #14
```

# Branch Naming Convention

> **MANDATORY:** Branch names MUST include the GitHub Issue number.

| Pattern | Use When | Example |
|---------|----------|---------|
| `feature/#<id>-<short-desc>` | New feature | `feature/#12-login-system` |
| `fix/#<id>-<short-desc>` | Bug fix | `fix/#15-header-alignment` |
| `chore/#<id>-<short-desc>` | Maintenance | `chore/#25-update-deps` |
| `docs/#<id>-<short-desc>` | Documentation | `docs/#22-deployment-guide` |

# Milestone-Driven Development

```
Milestones define the ORDER of work. Always work sequentially.

v0.1 — Core Layout          ← Complete ALL issues here first
  ├── #1 Project setup
  ├── #2 Create navbar
  └── #3 Create footer

v0.2 — Features             ← Then move to this milestone
  ├── #4 Add contact form
  ├── #5 Add portfolio grid
  └── #6 Add dark mode

v0.3 — Polish & Deploy      ← Then this one
  ├── #7 Performance optimization
  ├── #8 SEO meta tags
  └── #9 Deploy to Vercel
```

**Rules:**
- Every project starts by creating milestones in GitHub
- Each milestone has a clear goal and groups related issues
- Issues within a milestone are worked on sequentially (by issue number order)
- A milestone is only "complete" when ALL its issues are closed
- NEVER start a new milestone's issue before the current milestone is fully complete

# Branch Strategy

```
main ─────────────────────── Production (auto-deploys to Vercel/Live)
  │
staging ──────────────────── QA / Preview Environment (auto-deploys to preview URL)
  │
  ├── feature/#12-login ──── Feature branch (from issue #12, merge via PR)
  ├── fix/#15-navbar ──────── Bug fix branch (from issue #15, merge via PR)
  └── chore/#25-deps ──────── Maintenance branch (from issue #25)
```

- `main` = production level. Always stable and deployable.
- `staging` = preview level. Used for testing and client review before pushing to production.
- Feature branches are created from `staging`, developed, and merged back into `staging` via PR.
- Once `staging` is tested and verified, merge `staging` into `main` to trigger production deploy.
- **For solo projects:** Direct push to `main` is sometimes acceptable for hotfixes, but using `staging` limits breaking production.

# Git Workflow (Daily)

```bash
# 0. Check current milestone — pick the next open issue
#    Go to GitHub Issues, filter by current milestone, pick lowest-numbered open issue

# 1. Create branch from issue
git checkout -b feature/#12-login-form

# 2. Make changes, commit often (always reference issue)
git add .
git commit -m "feat: add hero section layout (#12)"

# 3. Push to remote
git push -u origin feature/#12-login-form

# 4. Create PR or merge to main (reference issue in PR description)
git checkout main
git merge feature/#12-login-form
git push origin main

# 5. Close the issue (if not auto-closed via commit)

# 6. Clean up
git branch -d feature/#12-login-form

# 7. Pick next issue in milestone → repeat
```

# PR & Push Checklist

Before running `git push`, ensure:

- [ ] A GitHub Issue exists for this work
- [ ] Branch name includes issue number
- [ ] Commits reference issue number
- [ ] `npm run build` (or `npx expo export`) completes without errors
- [ ] No console errors in the browser/app
- [ ] All routes work correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Commit messages follow the convention above
- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] `.env` files are NOT committed (check `.gitignore`)

# .gitignore Essentials

Always ensure these are in `.gitignore`:
```
node_modules/
dist/
.next/
.env
.env.local
.env.production
*.log
.DS_Store
Thumbs.db
```