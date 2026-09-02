---
name: Tech Stack Restrictions
description: Strict guidelines on allowed libraries, frameworks, and versions.
---

# Frontend Stack (Primary — Web)
- **Framework:** Vue 3 (Composition API) with Vite. For new projects, also consider React 19 / Next.js 15 (App Router).
- **Styling:** TailwindCSS 4. Do NOT use inline styles (`style={{...}}`) unless calculating dynamic properties based on state.
- **Component Libraries:** DaisyUI, Bootstrap 5 (for legacy/WordPress-adjacent projects).
- **State Management:** Pinia (Vue) or Zustand / React Context (React). Avoid Redux unless explicitly asked.

# Frontend Stack (Mobile)
- **Framework:** React Native + Expo (managed workflow).
- **Language:** TypeScript.
- **Routing:** Expo Router (file-based, like Next.js).
- **Styling:** StyleSheet.create() with design tokens. No inline styles.

# Backend & Database
- **Backend:** Laravel 10-11 (REST API, Eloquent ORM) or Node.js (Express/Nest.js).
- **Database:** PostgreSQL (preferred) or MySQL/MariaDB.
- **ORM:** Eloquent (Laravel) or Prisma (Node.js).
- **API Style:** RESTful structure or Next.js Route Handlers.
- **Auth:** Supabase Auth, Laravel Sanctum, or NextAuth v5.

# CMS & WordPress
- **CMS:** WordPress + Elementor Pro for client sites.
- **E-commerce:** WooCommerce (WordPress) or Shopify.
- **LMS:** Tutor LMS (WordPress).

# Hosting & Deployment
- **Frontend Hosting:** Vercel (primary), Cloudflare Pages (static sites).
- **Backend Hosting:** Railway ($5/month) or VPS Ubuntu.
- **Domain:** Cloudflare Registrar (at-cost, $10/year).
- **Media/CDN:** Cloudinary (with `f_auto,q_auto` transforms) primary, Cloudflare R2 (fallback).

# General Rules
- Do NOT introduce random third-party libraries for simple utilities that can be written in 10 lines of vanilla JavaScript.
- Always check if the current project environment matches these assumptions before writing large chunks of architecture.
- Use `npx expo install` instead of `npm install` for Expo projects.
- Always use environment variables for secrets. Never commit `.env` files.

*(Note: Update this file whenever the project transitions to a different primary tech stack.)*
