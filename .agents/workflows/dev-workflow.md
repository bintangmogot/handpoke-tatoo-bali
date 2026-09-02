---
description: Standard operating procedure for developing new features. Follow this for every feature/module build.
---

# Feature Development Steps

Whenever tasked with building a feature or making ANY change, follow these steps:

## Step 0: GitHub Issue (MANDATORY — No Exceptions)

**EVERY feature, bugfix, refactor, style change, or any modification — no matter how small — MUST start with a GitHub Issue.**

1. **Create a GitHub Issue** before writing any code:
   - Use a clear, descriptive title (e.g., `feat: add contact form validation`, `fix: navbar overlap on mobile`)
   - Include a description with: what needs to change, acceptance criteria, and any relevant context
   - Add appropriate **labels** (`feature`, `bug`, `refactor`, `style`, `chore`, `docs`)
   - Assign the issue to the correct **Milestone** (see below)

2. **Milestone Rules:**
   - Every project must have milestones that define sequential development phases
   - Each milestone groups related issues and defines a clear goal (e.g., `v0.1 — Core Layout`, `v0.2 — Interactive Features`)
   - Issues within a milestone should be numbered/ordered for sequential execution
   - **Complete all issues in the current milestone before moving to the next**
   - Never skip ahead to a later milestone's issues

3. **Issue-Driven Development:**
   - Work on ONE issue at a time
   - Reference the issue number in branch names: `feature/#12-login-form`
   - Reference the issue number in commits: `feat: add login form (#12)`
   - Close the issue via commit message: `closes #12` or manually after merge

## Step 1: Understand & Plan
Confirm the requirements from the GitHub Issue description. Identify the data structures, components, and dependencies needed. Cross-check with the project's `docs/` folder for existing planning docs.

## Step 2: Create Branch from Issue
```bash
git checkout -b feature/#<issue-number>-<short-desc>
```

## Step 3: Setup File Structure
Create the necessary files and folders if they don't exist. Follow the project's established folder structure pattern.

## Step 4: Core Implementation
Write the business logic and UI markup. Prototype in a single file first — refactor later if needed.

## Step 5: Styling & Polish
Apply the design system (refer to `design.md` tokens or project-specific design tokens). Ensure micro-animations on interactive elements. **Crucial:** Always check **21st.dev** to find, copy, and apply interesting, interactive features, animations, or premium UI elements that exactly match the feature needs.

## Step 6: Review & Refactor
Check for unused variables, overly complex functions, and adherence to the KISS principle. Remove debug logs unless helpful.

## Step 7: Git Commit & Close Issue
Use conventional commits with gitmojis (see `git-workflow.md`). Reference the issue number.
```bash
git add .
git commit -m "feat: add user login form (#12)"
git push -u origin feature/#12-login-form
```
Then merge to main/staging and close the issue.

## Step 8: Testing (if requested)
Provide basic unit tests for core logic. Always mock external API calls and database connections.

## Step 9: Move to Next Issue
Pick the next issue in the current milestone. If all issues in the milestone are done, move to the next milestone.

# Output Rule
If a step requires executing a terminal command (like installing a package `npm install x`), provide it explicitly as a bash command block.

# Quality Checks Before Closing an Issue
- [ ] GitHub Issue exists and is referenced in commits
- [ ] No console errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Matches Stitch design mockups (if available)
- [ ] Follows project design tokens (colors, fonts, spacing)
- [ ] Interactive elements have hover/focus states with transitions
- [ ] No hardcoded secrets — use environment variables
- [ ] Issue is closed after merge
