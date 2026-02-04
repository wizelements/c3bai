# c3bai.vercel.app Pricing Launch Checklist
## Ready-to-ship implementation timeline

---

## Pre-Launch Setup (Week 1)

### Product Setup
- [ ] Create Stripe account + activate Live Mode
- [ ] Create 3 products in Stripe Dashboard:
  - [ ] Starter Monthly (price ID: `price_1O...`)
  - [ ] Starter Annual (price ID: `price_1P...`)
  - [ ] Professional Monthly (price ID: `price_1Q...`)
  - [ ] Professional Annual (price ID: `price_1R...`)
- [ ] Set up webhook endpoint in Stripe (e.g., `https://c3bai.vercel.app/api/webhook/stripe`)
- [ ] Generate Stripe API keys + webhook secret
- [ ] Create database schema (run Prisma migrations)
- [ ] Setup environment variables (.env.local)

### Frontend Development
- [ ] Create `/pricing` page (home page link)
- [ ] Build `PricingCard` component (reusable)
- [ ] Build `FeatureComparison` component (table)
- [ ] Build `ConsultationForm` component
- [ ] Build `PricingFAQ` component
- [ ] Add responsive design (mobile-first)
- [ ] Implement toggle (Monthly / Annual pricing)

### Backend Development
- [ ] Build `/api/consultation` endpoint (form submission)
- [ ] Build `/api/pricing/plans` endpoint (pricing data)
- [ ] Build `/api/checkout` endpoint (Stripe session)
- [ ] Build `/api/webhook/stripe` endpoint (subscription events)
- [ ] Build `/api/usage` endpoint (usage tracking)
- [ ] Setup email notifications (Nodemailer)
- [ ] Setup calendar integration (Calendly API)

### Testing
- [ ] Test consultation form submission
- [ ] Test Stripe checkout in test mode
- [ ] Test subscription creation in database
- [ ] Test webhook event processing
- [ ] Test email notifications
- [ ] Test mobile responsiveness
- [ ] Test annual discount calculation
- [ ] Test form validation + error handling

---

## Launch Week (Week 2)

### Content & Copy
- [ ] Write pricing page header (hero section)
- [ ] Write tier descriptions
- [ ] Write feature descriptions
- [ ] Write FAQ answers (8-10 questions)
- [ ] Write CTA buttons (clear, action-oriented)
- [ ] Proofread all copy

### Design & UX
- [ ] Design pricing cards (Figma/mockup)
- [ ] Implement dark mode (matches current site)
- [ ] Add pricing animations (tier hover effects)
- [ ] Design comparison table
- [ ] Design consultation form
- [ ] Design success screen (post-consultation)
- [ ] Test on Chrome, Safari, Firefox, Mobile

### Stripe Configuration
- [ ] Switch Stripe to Live Mode
- [ ] Verify webhook endpoint is live
- [ ] Test live checkout flow
- [ ] Verify invoicing is enabled
- [ ] Setup subscription settings (billing cycles, trials)

### Email & Notifications
- [ ] Setup Gmail SMTP (or SendGrid)
- [ ] Create consultation confirmation email
- [ ] Create team notification email (sales alert)
- [ ] Create calendar booking email
- [ ] Test email delivery

### Analytics & Tracking
- [ ] Add Stripe event logging to database
- [ ] Setup Google Analytics event tracking:
  - [ ] "View Pricing Page"
  - [ ] "Click Get Started" (by tier)
  - [ ] "Start Consultation"
  - [ ] "Checkout Start"
  - [ ] "Subscription Created"
- [ ] Setup event dashboard (daily metrics)

---

## Soft Launch (Week 2-3)

### Limited Release
- [ ] Deploy to production (pricing page live but hidden)
- [ ] Send to 10-20 trusted advisors for feedback
- [ ] Collect feedback on pricing, copy, UX
- [ ] Monitor Stripe events (look for errors)
- [ ] Monitor email delivery (check spam folder)
- [ ] Fix any critical bugs

### Feedback Loop
- [ ] Survey: "Would you buy this? Why/why not?"
- [ ] Ask: "What price would you expect?"
- [ ] Ask: "What features would move you to Pro tier?"
- [ ] Iterate based on feedback

### Metrics Tracking
- [ ] Setup daily reporting dashboard
- [ ] Track: Pricing page views, consultations submitted, checkouts started
- [ ] Track: Consultation form abandonment rate
- [ ] Track: Checkout abandonment rate
- [ ] Track: Stripe error rates

---

## Public Launch (Week 3)

### Go-Live
- [ ] Enable pricing page link in main navigation
- [ ] Update meta description (SEO)
- [ ] Submit to Google Search Console
- [ ] Setup Google Analytics 4 (if not already)
- [ ] Verify all links work (pricing → checkout → success)

### Marketing
- [ ] Send launch email to:
  - [ ] Existing leads/contacts
  - [ ] Twitter/LinkedIn followers
  - [ ] Email list
- [ ] Post on LinkedIn (positioning + pricing)
- [ ] Post on Twitter/X (launch announcement)
- [ ] Create founding customer offer (20% discount first 3 months)

### Sales Enablement
- [ ] Train sales team on pricing (objection handling)
- [ ] Create sales one-pager (print version)
- [ ] Create email templates for follow-up
- [ ] Setup Slack notifications for new consultations
- [ ] Schedule daily sales standup (review consultations)

---

## Post-Launch Optimization (Weeks 4+)

### Monitoring
- [ ] Daily check: Consultation submissions (target: 5+ per week)
- [ ] Daily check: Checkout starts (target: 2+ per week)
- [ ] Daily check: Stripe errors (target: 0)
- [ ] Weekly check: Email delivery rate (target: >98%)
- [ ] Weekly check: Form abandonment (target: <40%)

### Conversion Optimization
- [ ] A/B test: Pricing page layout (single vs. multi-tier emphasis)
- [ ] A/B test: CTA button colors (blue vs. neon green)
- [ ] A/B test: "Get Started" vs. "Start Free Trial" text
- [ ] A/B test: Annual discount messaging (20% vs. "Save $5K")
- [ ] A/B test: Consultation form (short 3-field vs. long 6-field)

### Customer Onboarding
- [ ] Create onboarding email sequence (5 emails over 2 weeks):
  - [ ] Day 0: Welcome + next steps
  - [ ] Day 2: Getting started guide
  - [ ] Day 4: API documentation
  - [ ] Day 7: Quick wins (first use case)
  - [ ] Day 14: Success metrics
- [ ] Setup in-app onboarding (tour/walkthrough)
- [ ] Create knowledge base articles (setup, troubleshooting)

### Customer Success
- [ ] Identify usage patterns (who's using it)
- [ ] Identify at-risk accounts (low usage, approaching cancellation)
- [ ] Setup upsell triggers (e.g., >80% token usage → upgrade offer)
- [ ] Schedule quarterly business reviews (for 3+ month customers)

### Pricing Adjustments
- [ ] Track: Consultation to Starter conversion rate
  - [ ] Target: 10-15%
  - [ ] If <5%: Lower pricing or improve positioning
  - [ ] If >25%: Raise pricing or tighten qualification
- [ ] Track: Starter to Professional upgrade rate
  - [ ] Target: 30-40% within 6 months
  - [ ] If <10%: Improve Professional tier value prop
  - [ ] If >50%: Starter tier may be too low

---

## Metrics Dashboard (Setup Week 1)

### Real-Time Dashboard (Google Sheets or Metabase)
```
Daily Metrics:
- Pricing page views
- Consultation form submissions
- Consultation completion rate (% who book)
- Checkout sessions started
- Checkout completions
- Stripe errors
- Email bounce rate

Weekly Metrics:
- New paid customers (by tier)
- Upgrade conversions (Starter → Pro)
- Cancellations
- Usage by tier (avg tokens, docs, webhooks)
- Revenue (recurring + overage)
- CAC (cost to acquire customer)

Monthly Metrics:
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)
- Net Revenue Retention
- Churn rate
- LTV:CAC ratio
- Customer satisfaction (NPS)
```

---

## Critical Success Factors

### Week 1 Targets
- [ ] Deploy pricing page without errors
- [ ] Stripe checkout working in live mode
- [ ] Email notifications delivering
- [ ] Analytics tracking all events
- [ ] Team trained on sales process

### Week 2-3 Targets
- [ ] 5+ consultation submissions
- [ ] 1+ paid customers signed up
- [ ] 0 critical bugs reported
- [ ] <40% consultation form abandonment

### Month 1 Targets
- [ ] 20+ consultation submissions
- [ ] 5+ paid customers (mix of Starter & Pro)
- [ ] 30%+ consultation-to-paid conversion
- [ ] CAC < $2,000 per customer
- [ ] Net revenue retention > 100% (initial data)

### Month 3 Targets
- [ ] 50+ consultations total
- [ ] 15+ paid customers
- [ ] 40%+ Starter → Professional upgrade rate
- [ ] $15K+ MRR
- [ ] <5% churn rate
- [ ] LTV:CAC ratio > 3:1

---

## Common Pitfalls to Avoid

### ❌ Pricing Page Not Live
**Problem**: Only private beta testing  
**Fix**: Make pricing page public in Week 2 (even if imperfect)

### ❌ No Email Notifications
**Problem**: Leads lost because sales doesn't know  
**Fix**: Setup Slack webhook immediately (notification in #sales)

### ❌ Confusing Pricing Language
**Problem**: Too many footnotes/caveats  
**Fix**: Simple messaging: "$2,500/mo includes X, overages $Y"

### ❌ Stripe Configuration Issues
**Problem**: Checkout broken, customers can't pay  
**Fix**: Test thoroughly in Week 1, use Stripe test mode extensively

### ❌ High Consultation Form Abandonment
**Problem**: >50% drop-off after initial view  
**Fix**: Reduce to 3-field form (email, name, description)

### ❌ No Sales Follow-Up Process
**Problem**: Consultations submitted but never responded to  
**Fix**: Daily standup, target 4-hour response time

### ❌ Underestimating Support Load
**Problem**: Pricing/billing questions overwhelming team  
**Fix**: Create FAQ section, setup email templates

---

## File Structure Needed

```
app/
  ├── pricing/
  │   ├── page.tsx                 # Main pricing page
  │   ├── consultation/
  │   │   └── page.tsx            # Consultation booking
  │   ├── success/
  │   │   └── page.tsx            # Post-checkout success
  │   └── invoice/
  │       └── page.tsx            # Invoice history
  └── api/
      ├── consultation/
      │   └── route.ts             # Form submission
      ├── checkout/
      │   └── route.ts             # Stripe session
      ├── webhook/
      │   └── stripe/
      │       └── route.ts         # Webhook handler
      └── usage/
          └── route.ts             # Usage tracking

components/
  ├── PricingCard.tsx
  ├── PricingComparison.tsx
  ├── ConsultationForm.tsx
  ├── PricingFAQ.tsx
  └── PricingHero.tsx

lib/
  ├── stripe.ts                    # Stripe client + functions
  ├── db.ts                        # Database client
  └── email.ts                     # Email service

types/
  └── pricing.ts                   # TypeScript interfaces
```

---

## Environment Variables Template

```bash
# Stripe
STRIPE_PUBLIC_KEY=pk_live_51O...
STRIPE_SECRET_KEY=sk_live_51O...
STRIPE_WEBHOOK_SECRET=whsec_1O...

# Pricing Product IDs (from Stripe Dashboard)
NEXT_PUBLIC_STRIPE_STARTER_MONTHLY=price_1O...
NEXT_PUBLIC_STRIPE_STARTER_ANNUAL=price_1P...
NEXT_PUBLIC_STRIPE_PRO_MONTHLY=price_1Q...
NEXT_PUBLIC_STRIPE_PRO_ANNUAL=price_1R...

# Email
GMAIL_USER=noreply@c3bai.com
GMAIL_PASSWORD=app_specific_password
SALES_EMAIL=sales@c3bai.com
SUPPORT_EMAIL=support@c3bai.com

# Calendar
CALENDLY_API_TOKEN=eyJraWQiOi...

# Database
DATABASE_URL=postgresql://user:password@host:5432/c3bai

# URLs
NEXT_PUBLIC_URL=https://c3bai.vercel.app
```

---

## Deployment Checklist

- [ ] All environment variables set in Vercel Dashboard
- [ ] Database migrations run (Prisma migrate deploy)
- [ ] Stripe webhook endpoint configured
- [ ] Email service tested (send test email)
- [ ] Google Analytics configured
- [ ] Error tracking setup (Sentry or similar)
- [ ] Performance monitoring setup (Vercel Analytics)
- [ ] SSL certificate verified (HTTPS)
- [ ] DNS configured (domain mapping)
- [ ] Robots.txt updated (allow indexing)
- [ ] Sitemap updated (include /pricing)

---

## Sales Enablement Docs

### Sales One-Pager
Create a 1-page sales sheet:
```
C3BAI PRICING
═════════════

STARTER ($2,500/mo)
└─ MVPs and proof-of-concepts
└─ 100K tokens + 100 docs
└─ Email support
└─ Best for: Bootstrapped founders

PROFESSIONAL ($7,500/mo) ⭐ MOST POPULAR
└─ Production AI systems
└─ 1M tokens + 2K docs
└─ Priority support + Slack
└─ Best for: Series A/B startups

ENTERPRISE (Custom)
└─ Mission-critical systems
└─ Unlimited everything
└─ 24/7 support + engineer
└─ Best for: Large enterprises

OVERAGE PRICING:
• Tokens: $0.02 per 1K (input), $0.06 per 1K (output)
• Documents: $0.50 standard, $2.00 complex
• 20% discount for annual

READY TO START?
→ Free consultation: c3bai.com/pricing/consultation
→ 14-day free trial on all plans
```

---

## Next Step After Launch

After Week 3 (first customers acquired):
1. Create case study with first 3 paying customers
2. Document their ROI (time saved, tokens reduced, etc.)
3. Add testimonial + logo to pricing page
4. Create product walkthrough video (5 min)
5. Expand FAQ based on real customer questions

---

## Emergency Contacts & Escalation

| Issue | Action | Contact |
|-------|--------|---------|
| Stripe checkout broken | Page unavailable, disable checkout | Stripe Support + Engineering |
| Email not sending | Leads lost, check logs | Gmail/SendGrid Support |
| Database down | Can't create subscriptions | Database provider support |
| DDoS attack | Site slow/unavailable | Vercel support + DDoS mitigation |
| Data breach | Privacy incident | Security team + Legal |

---

## Sign-Off Before Launch

- [ ] CEO/Founder: Pricing strategy approved
- [ ] Engineering: All APIs tested, no known bugs
- [ ] Sales: Team trained, process documented
- [ ] Finance: Revenue tracking configured
- [ ] Marketing: Launch communications ready
- [ ] Legal: Terms of Service updated (billing terms)

---

**Launch Date Target**: February 11, 2025  
**Estimated Build Time**: 5-7 business days  
**Go/No-Go Decision**: Friday, February 7, 2025

✅ **Ready to ship after Week 1 testing**
