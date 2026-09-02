# Dotlinetattu - Full Custom Website Rebuild (Final Architecture)

## Project Overview

**Client:** Jerry (Silver Jerry) - Dotlinetattu Traditional Handpoke Tattoo Studio, Bali
**Budget:** Rp 2.500.000 (Full Upfront - PAID)
**Scope:** Full website rebuild with a smart Real-Time Booking Engine & Admin Panel.
**Domain:** dotlinetattu.com (Hostinger DNS → Vercel)
**Target Audience:** International (Americans/Tourists)

---

## 🏗️ System Architecture & Logic

### Tech Stack
| Layer | Technology | Function |
|-------|-----------|----------|
| **Frontend/Backend** | Next.js 15 (App Router) | UI & Server API Routes |
| **Styling** | Tailwind CSS 4 | Dark Industrial + Orange Theme |
| **Database** | Supabase (PostgreSQL) | Real-time calendar & bookings storage |
| **Payment** | Xendit API | Process 50% deposits (QRIS, CC, E-Wallet) |
| **Email** | Resend API | Auto-send invoices and receipts |
| **Hosting** | Vercel (Free Tier) | Zero-cost edge deployment |

### The Golden Rule: 50% Deposit
Setiap transaksi melalui website, baik Flash maupun Custom, **hanya menagih 50% Deposit** dari total harga. Sisa 50% dibayarkan tunai/langsung di studio setelah proses tattoo selesai.

---

## 🔄 Dual Booking Flow (The Engine)

Website ini memiliki 2 jalur (flow) yang sangat spesifik untuk menangani tipe client yang berbeda:

### Flow 1: Flash Tattoo (100% Client-Side Auto)
Cocok untuk desain yang sudah fix ukuran dan harganya.
1. Client browse gallery Flash Tattoo di website.
2. Client klik "Book Flash Tattoo".
3. Client dihadapkan pada UI **Kalender (Real-time)**. Tanggal & jam yang sudah dibooking orang lain otomatis *disabled* (abu-abu).
4. Client pilih jadwal yang kosong, isi form (Nama, Email, WA).
5. Sistem menghitung harga, lalu client bayar **50% deposit** via Xendit UI.
6. **Sukses:** Jadwal otomatis terkunci di database atas nama client tersebut. Sistem mengirim email invoice otomatis ke client.

### Flow 2: Custom / Session Tattoo (Admin-Generated Invoice)
Untuk tattoo custom yang butuh konsultasi desain, ukuran, dan estimasi waktu.
1. Client klik "Consult Custom Tattoo" di website.
2. Langsung dilempar ke **WhatsApp** Bang Jerry tanpa perlu isi form di web.
3. **Konsultasi (Manual):** Bang Jerry & client diskusi desain, sepakat harga total (misal Rp 5.000.000) dan sepakat jadwal (misal 10 Sept, 14:00).
4. **Admin Panel:** Bang Jerry login ke `dotlinetattu.com/admin`.
5. Bang Jerry isi form singkat: Nama Client, Email, Jadwal, dan Total Harga (Rp 5.000.000).
6. **Sistem:** Otomatis memblokir jadwal tersebut di kalender, membagi harga jadi 2, dan men-generate link pembayaran Xendit untuk deposit (Rp 2.500.000).
7. Bang Jerry copy link tersebut, kirim ke WA client: *"Here is the link to secure your slot."*
8. Client klik link & bayar. Jadwal resmi *Confirmed*.

---

## 🎛️ Admin Panel Features (`/admin`)

Halaman rahasia khusus untuk Bang Jerry mengelola studionya.
- **Calendar View:** Melihat jadwal harian/bulanan secara visual.
- **Generate Invoice:** Membuat link pembayaran (50% deposit) hasil diskusi WA.
- **Reschedule Management:** Mengubah jam/tanggal client *setelah* Bang Jerry izin/diskusi via chat WA.
- **Testimonial Manager:** Tambah/Edit review (Upload foto, 5 Bintang, Text, Nama, Bendera Negara).

---

## 🎨 Design Tokens & UI Structure

**Theme:** Dark Industrial + Orange Accent (Reference: Quiet Ink & Canggu Ink Club).

```css
Colors:
  --bg-primary:      #0a0a0a     (Deep charcoal/black)
  --bg-secondary:    #141414     (Card backgrounds)
  --accent:          #ea580c     (Orange-600 - Main CTA & Stars)
  --text-primary:    #fafafa     (White-ish text)
  --text-secondary:  #a3a3a3     (Muted text)

Typography:
  --font-heading:    "Space Grotesk" (Bold, industrial feel)
  --font-body:       "Inter" (Clean readability)
```

**Premium Testimonial Card Layout:**
- Top: Photo/Video of healed tattoo + "VERIFIED" orange badge.
- Middle: 5 Orange Stars + Italicized Review Text (Gray).
- Bottom: Bold Client Name + Country Flag + Country Name.

---

## 📂 Pages & Route Structure

| Route | Purpose |
|-------|---------|
| `/` (overlay) | "Enter Studio" black screen, unlocks `bg-music.mp4` |
| `/` | Home: Video Hero, Teasers, Premium Testimonials, CTA |
| `/about` | Jerry's expanded story, traditional roots (Kalimantan/Mentawai) |
| `/services` | Process steps, Passing Session, Custom Session info |
| `/gallery` | Filterable grid (Handpoke / Machine / Flash) |
| `/faq` | 10cm minimum size, 6-hr medical limit, Aftercare |
| `/blog` | 5 SEO starter articles |
| `/booking` | Flash Tattoo Calendar & Checkout UI |
| `/admin` | Secured dashboard (Calendar, Generate Invoice, Reviews) |

---

## 🚀 Milestones & GitHub Issues

### v0.1 - Foundation & UI Components
- `init: Next.js 15, Tailwind 4, Supabase Setup`
- `feat: Design tokens, global CSS, Navbar, Footer`
- `feat: "Enter Studio" overlay & audio context manager`
- `feat: Premium Testimonial Card component (w/ Flags)`

### v0.2 - Static Pages & Content
- `feat: Home page (Video Hero placeholder, Testimonial grid)`
- `feat: About, Services, FAQ, and Gallery pages`
- `docs: Write 5 SEO blog articles`

### v0.3 - Supabase & Calendar Logic
- `feat: Database schema (bookings, reviews, users)`
- `feat: Frontend Availability Checker (block booked slots)`
- `feat: Admin Dashboard layout & Calendar View`

### v0.4 - Payment & Dual Booking Engine
- `feat: Flash Tattoo booking flow -> Xendit 50% Checkout`
- `feat: Admin "Generate Invoice" flow -> Xendit Link Generator`
- `feat: Auto-email via Resend on payment success`
- `feat: Admin Reschedule function`

### v0.5 - Final Polish & Launch
- `feat: Full Technical SEO (Meta, OG, JSON-LD)`
- `chore: Vercel Deploy & Hostinger DNS pointing`
- `chore: Xendit Production Activation`
