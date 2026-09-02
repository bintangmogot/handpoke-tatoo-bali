---
description: Phase 3 — Initialize the project, set up folder structure, install deps, and configure git.
---

# Phase 3: Project Scaffolding

> **Tools:** Antigravity (VS Code) + Terminal
> **Duration:** 30 min – 2 hours
> **Output:** Working boilerplate with folder structure, design system, and git repo

## Steps

### 1. Initialize Project
Choose the correct command based on project type:

```bash
# Vue 3 + Vite
npm create vite@latest project-name -- --template vue-ts

# Next.js 15
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir

# Expo (React Native)
npx create-expo-app@latest project-name --template blank-typescript

# Laravel
composer create-project laravel/laravel project-name
```

### 2. Create Folder Structure
Follow the standard structure from `docs/05-implementation-plan.md`. Create all folders upfront:

**Web (Vue/React/Next.js):**
```
src/
├── components/ui/      # Base components (Button, Card, Input)
├── components/sections/ # Page sections (Hero, Features, Footer)
├── lib/                # Utilities, helpers, API clients
├── hooks/              # Custom hooks
├── contexts/           # Context providers
├── types/              # TypeScript types
├── constants/          # Design tokens, configs
└── styles/             # Global CSS
```

**Mobile (Expo):**
```
src/
├── constants/          # Design tokens
├── contexts/           # Theme, Language, Auth
├── hooks/              # Custom hooks
├── i18n/               # Translation files
├── components/ui/      # Base components
├── screens/            # Full screen components
├── services/           # API calls
├── types/              # Type definitions
└── utils/              # Helpers
```

### 3. Install Core Dependencies
Only install what's needed for the FIRST module. Don't pre-install everything.

### 4. Set Up Design Tokens
Create design token files based on `docs/06-design-tokens.md`:
- Colors (light + dark if applicable)
- Typography (font families, sizes, weights)
- Spacing (4px grid scale)

### 5. Configure Linting (Optional)
```bash
npm install -D eslint prettier eslint-config-prettier
```

### 6. Initialize Git
```bash
git init
git add .
git commit -m "🎉 init: initial project setup"
```

### 7. Create GitHub Repo
```bash
git branch -M main
git remote add origin https://github.com/bintangmogot/[repo-name].git
git push -u origin main
```

### 8. Set Up GitHub Milestones & Issues
After repo is created, set up project tracking:

1. **Create Milestones** in GitHub based on `docs/07-milestones.md`
   - Each milestone gets a title, description, and (optionally) a due date
   - Order: `v0.1` → `v0.2` → `v0.3` → etc.

2. **Create Issues** for every task in the first milestone
   - Use clear titles: `feat: add responsive navbar`
   - Add labels: `feature`, `bug`, `chore`, etc.
   - Assign to the correct milestone
   - Include acceptance criteria in the description

3. **Verify** all issues are visible and correctly assigned to milestones

> **Note:** You can create all milestone issues upfront, or just the current milestone's issues. At minimum, the FIRST milestone must have all its issues created before starting Phase 4.

### 9. Verify It Works
```bash
npm run dev        # Web projects
npx expo start     # Expo projects
php artisan serve   # Laravel projects
```

## Checklist Before Moving to Phase 4

- [ ] Project initializes without errors
- [ ] Folder structure matches the plan
- [ ] Design tokens are created as code
- [ ] Custom fonts loaded (if applicable)
- [ ] Dev server runs without errors
- [ ] Git initialized with first commit
- [ ] GitHub repo created (public for portfolio, private for client work)
- [ ] GitHub Milestones created (at least v0.1)
- [ ] GitHub Issues created for first milestone
- [ ] `.gitignore` includes `node_modules/`, `.env`, `dist/`
