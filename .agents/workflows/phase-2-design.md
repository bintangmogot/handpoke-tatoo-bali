---
description: Phase 2 — Design all screens in Google Stitch before coding.
---

# Phase 2: UI/UX Design (Stitch)

> **Tools:** Google Stitch (primary), Figma (optional for complex projects)
> **Duration:** 2–8 hours
> **Output:** Finalized high-fidelity screen designs for every page

## Stitch Workflow

### Step 1: Setup
1. Open Google Stitch (via MCP or web interface).
2. Create a new project → name it same as your project.
3. Have your `docs/03-wireframe.md` and `docs/06-design-tokens.md` open for reference.

### Step 2: Generate Screens (One by One)
For each screen in your sitemap, use a detailed prompt:

```
Generate a [page name] screen for a [type] app.

Style: [modern minimalist / bold dark / notion-inspired / etc.]
Colors: Primary [#hex], Background [#hex], Text [#hex], Accent [#hex]
Fonts: Heading [font name], Body [font name]
Layout: [describe from wireframe — e.g., "hero section with centered text, 
         full-width image, two CTA buttons below"]
Content: [exact text/data to display]
Device: [Desktop / Mobile]
```

### Step 3: Iterate & Refine
- Use `edit_screens` to adjust colors, layout, spacing, typography.
- Compare with design tokens from `docs/06-design-tokens.md`.
- Ensure consistency across ALL screens (same colors, fonts, spacing).

### Step 4: Generate Variants
- For key screens (homepage, dashboard), generate 2–3 variants.
- Pick the best one. Note why in a comment.

### Step 5: Mobile Versions
- Generate mobile versions for EVERY desktop screen.
- Verify: single column layout, touch-friendly buttons (≥44px), no horizontal scroll.

### Step 6: Finalize & Export
- Ensure ALL screens are consistent.
- Screenshot or export final designs.
- Save to project folder: `designs/` or `docs/designs/`.

## Design Checklist

- [ ] All screens from sitemap designed
- [ ] Desktop + Mobile version for every screen
- [ ] Color palette consistent across all screens
- [ ] Typography hierarchy clear (H1 > H2 > Body > Caption)
- [ ] CTAs are prominent and visually distinct
- [ ] Hover/active states defined for interactive elements
- [ ] Micro-animations noted (what animates, how)
- [ ] Dark mode variant (if applicable)
- [ ] Designs reference the correct design tokens

## Design Principles (Your Standards)

| Principle | Rule |
|-----------|------|
| No pure colors | Never `#FF0000` or `#000000`. Use softened variants |
| Border radius | Default `rounded-lg/xl`. Sharp only for gym/fitness projects |
| Micro-animations | Every interactive element needs `transition-all duration-200` |
| Modern fonts | Always Google Fonts. Never system defaults |
| Responsive-first | Design mobile FIRST, then scale up |
| Accessible | Min contrast 4.5:1, focusable elements visible |
| Inspiration (21st.dev) | Always check 21st.dev to find and copy interactive features, animations, and premium designs |
