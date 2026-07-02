# Cod3Black Agency — Done-for-You AI Business Systems

Cod3Black Agency installs websites, funnels, admin dashboards, automations, and AI workflows for small businesses, creators, food brands, nonprofits, and service providers.

## The Mission

Help businesses stop manually chasing customers, orders, messages, and operations.

## What We Sell

| Package | Investment | What you get |
|---------|-----------|--------------|
| **Starter System** | $1,500–$2,500 | Website + 1 funnel + booking/contact + basic automation |
| **Growth System** | $4,000–$6,000 | Website + admin dashboard + payments/booking + automations + AI workflow |
| **Automation Retainer** | $500–$1,500/mo | Ongoing optimizations, new automations, reports, support |

## Tech Stack

- **Framework:** Next.js 15 App Router
- **Styling:** Tailwind CSS
- **Database:** Turso (libSQL) via `@libsql/client`
- **Email:** Resend
- **Hosting:** Vercel
- **Auth:** Simple env-based admin password (MVP)

## Local Development

```bash
npm install
npm run dev
```

## Required Environment Variables

Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_APP_URL=https://c3bai-nu.vercel.app

TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...

RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=hello@c3bai.com
RESEND_TO_EMAIL=hello@c3bai.com

ADMIN_PASSWORD=...
ADMIN_SECRET=...
```

## Admin Dashboard

Visit `/admin` after setting `ADMIN_PASSWORD` and `ADMIN_SECRET`.

## Deployment

Push to `master` on `wizelements/c3bai`. Vercel auto-deploys.

```bash
git push origin master
```
