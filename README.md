# c3bai - Cod3Black Agency Pricing & Services

Transparent pricing platform for AI system development. $125/hour, structured inquiry forms, and automatic scope estimation.

## Structure

- **`app/`** - Next.js app directory
  - **`api/inquiry/route.js`** - POST endpoint for inquiry form submissions
  - **`inquiry-form.jsx`** - React form component (5 sections, 10 min completion)
- **`docs/`** - Complete implementation documentation
  - `C3BAI_PRICING_PAGE_IMPLEMENTATION.md` - Full pricing strategy & copy
  - `C3BAI_DEPLOYMENT_SUMMARY.md` - Week-by-week implementation plan
  - `C3BAI_GO_LIVE_CHECKLIST.md` - Launch checklist
  - `C3BAI_FINAL_PRICING_READY.md` - Tier details & FAQ
  - Plus 14 reference documents

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deployment

Deploy to Vercel:

```bash
vercel
```

## Key Files

| File | Purpose |
|------|---------|
| `docs/C3BAI_PRICING_PAGE_IMPLEMENTATION.md` | Complete pricing guide (copy-paste ready) |
| `app/inquiry-form.jsx` | React form component |
| `app/api/inquiry/route.js` | API endpoint for form submissions |
| `docs/C3BAI_DEPLOYMENT_SUMMARY.md` | 40-hour implementation plan |
| `docs/C3BAI_GO_LIVE_CHECKLIST.md` | Go-live checklist |

## The Strategy

**Pricing Tiers** (all based on $125/hour):
- **Starter**: $2,500/month = 20 hours
- **Professional**: $7,500/month = 60 hours
- **Enterprise**: $20K+/month = 160+ hours

**Key Message**: "You're not buying API access. You're buying experienced engineering hours at $125/hour."

**Proof of Concept**: 5 live projects (Beltline Golf, TradeAlerts, Gratog, etc-app, Image-to-SVG)

## Implementation Phases

**Phase 1 (Week 1)**: Pricing page + FAQ + Projects showcase  
**Phase 2 (Week 2)**: Stripe setup + payment integration  
**Phase 3 (Week 3)**: Inquiry form + API route + auto-emails  
**Phase 4 (March)**: POC gallery + case studies  

See `docs/C3BAI_DEPLOYMENT_SUMMARY.md` for detailed 40-hour plan.

## Environment Variables

```
STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_STARTER_SETUP_PRICE=price_xxx
STRIPE_STARTER_MONTHLY_PRICE=price_xxx
STRIPE_PRO_SETUP_PRICE=price_xxx
STRIPE_PRO_MONTHLY_PRICE=price_xxx
EMAIL_API_KEY=xxxxx
```

## Status

- ✅ Documentation complete
- ✅ Pricing strategy validated
- ✅ React form component ready
- ✅ API route template ready
- ⏳ Awaiting Stripe setup
- ⏳ Awaiting email service configuration
- ⏳ Awaiting database/inquiry storage setup

## Next Steps

1. Setup Stripe products & webhooks
2. Configure email service (Resend, SendGrid, etc)
3. Configure inquiry storage (database, Airtable, or Google Sheets)
4. Integrate pricing page copy into existing Next.js pages
5. Deploy to production

See `docs/C3BAI_GO_LIVE_CHECKLIST.md` for detailed week-by-week timeline.

---

**Timeline**: Ready to launch by Feb 11, 2026  
**Expected Result**: Pricing live, inquiries flowing, first customer by end of month  
**ROI**: $1M+ Year 1 (based on conservative projections)
