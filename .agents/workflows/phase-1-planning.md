---
description: Phase 1 — Create complete project documentation before coding.
---

# Phase 1: Planning & Documentation

> **Tools:** AI Chat (Antigravity/Gemini) + VS Code
> **Duration:** 2–6 hours
> **Output:** Complete project docs in `docs/` folder

## Documents to Create

| # | File | Purpose |
|---|------|---------|
| 1 | `docs/01-planning.md` | Problem statement, roadmap, tech stack, dev phases |
| 2 | `docs/02-sitemap.md` | Page/screen structure, navigation flow |
| 3 | `docs/03-wireframe.md` | Text-based wireframes (desktop + mobile) per page |
| 4 | `docs/04-tech-stack.md` | Exact libraries, versions, and rationale |
| 5 | `docs/05-implementation-plan.md` | Module-by-module build order with dependencies |
| 6 | `docs/06-design-tokens.md` | Colors, typography, spacing, component guidelines |
| 7 | `docs/07-milestones.md` | GitHub Milestones & Issues plan (sequential build order) |

## Steps

1. **Decide Project Type** — Web SPA, Landing Page, Mobile App, Full-stack, or WordPress.
2. **Lock Tech Stack** — Framework, styling, state management, backend, database, auth. Refer to `stack.md` for defaults.
3. **Create Sitemap** — List all pages/screens with their routes and relationships.
4. **Write Wireframes** — Text-based wireframes for every screen (desktop + mobile versions). Use ASCII box drawings.
5. **Define Build Order** — Module-by-module, simplest → complex. Each module should be self-contained.
6. **Set Design Tokens** — Color palette (light + dark), typography (heading + body fonts), spacing scale (4px grid), border radius, shadows.
7. **Plan Milestones & Issues** — Break the implementation plan into sequential milestones. Each milestone groups related modules. Within each milestone, list every task as a GitHub Issue with title, labels, and acceptance criteria. This becomes `docs/07-milestones.md`.
8. **Review All Docs** — Ensure completeness. Every screen in sitemap must have a wireframe. Every feature must be in a module. Every module must map to at least one GitHub Issue in a milestone.

## AI Prompt Template

```
Act as a Senior Software Architect. I'm building [project name].

Context:
- Type: [Web app / Mobile app / Landing page]
- Problem: [from Phase 0]
- Features: [MVP list from Phase 0]
- My skill level: Junior-Mid fullstack developer

Create the following documentation:
1. Full planning document with problem statement, development phases, and tech stack
2. Sitemap showing all pages/routes and their relationships
3. Text-based wireframes for each page (desktop + mobile)
4. Module build order from simplest to most complex
5. Design token system (colors, fonts, spacing)

Format: Markdown. Be extremely detailed. Use tables for comparisons.
```

## Checklist Before Moving to Phase 2

- [ ] All 7 docs created and saved in `docs/`
- [ ] Every page/screen has a wireframe
- [ ] Tech stack is locked (no "maybe we'll use X")
- [ ] Design tokens are defined
- [ ] Build order is established
- [ ] Milestones & Issues plan is documented (`docs/07-milestones.md`)
- [ ] Every feature/module maps to at least one GitHub Issue
- [ ] Color palette includes both light and dark variants (if applicable)
