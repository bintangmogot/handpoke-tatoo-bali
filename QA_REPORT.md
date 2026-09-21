# QA data reset and feature coverage report

Date: 20 September 2026

## What was reset

The current operational records were removed and replaced in Supabase for:

- `bookings`
- `appointments`
- `payments`
- `blocked_dates`

Gallery and testimonial content was preserved. The seed is repeatable with:

```bash
node --env-file=.env.local scripts/seed-qa-data.mjs
```

## Seeded dataset

| Area | Count | Coverage |
|---|---:|---|
| Bookings | 8 | ACTIVE, COMPLETED, CANCELLED; flash and custom tattoo; paid and pending clients |
| Appointments | 9 | consultation, design review, tattoo session; scheduled, completed, cancelled |
| Payments | 8 | pending, paid, failed, expired, cancelled |
| Blocked dates | 2 | one timed block and one full-day block |
| Image pairs | 8 | tattoo design plus body-placement reference on every booking |

Synthetic QA contact data is included on two records:

- Bintang Aprilian
- `qa.owner@example.com`
- `+6281234567890`

Tattoo designs use existing studio Cloudinary assets. Three local placement fixtures are stored in `public/assets/qa/` for deterministic QA. No additional image generation will be used without approval; future image sourcing can use approved web-search assets instead.

## Verification

- Seed script completed with before/after counts: 8 bookings, 9 appointments, 8 payments, 2 blocked dates.
- Admin browser smoke check loaded the seeded records and showed `6` open clients, `4` booked meetings, `2` payment links, and filters for needs action, meetings, payments, closed records, and all clients.
- `npx tsc --noEmit` passed.
- Production `npm run build` passed.

## Important finding

The live database constraint supports only `consultation`, `design_review`, and `tattoo_session` appointment types. The unsupported `follow_up` option was removed from the admin UI and seed data; follow-up work is represented as a design review with explanatory notes. This prevents the admin form from offering a value that the live database rejects.

## Not executed

No real Midtrans transaction was created. Payment rows cover the UI states without charging money. Python Playwright was unavailable in this environment, so browser verification used the local browser inspector instead.
