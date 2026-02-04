# Cod3Black Agency - Custom Web Design, Apps & Software

Transparent pricing platform for custom software development: web design, mobile apps, integrations, and more. $125/hour, structured inquiry forms, and automatic scope estimation.

## What We Build

- **Web Design** - Marketing sites, portfolios, content platforms
- **Web Apps** - SaaS dashboards, tools, interactive platforms  
- **Mobile Apps** - iOS/Android apps (native or cross-platform)
- **Integrations** - Connect systems, APIs, third-party services
- **Redesigns** - Improve existing sites and apps
- **MVPs** - Launch proof-of-concept projects fast

## Our Approach

**$125/hour rate** (or $65/hour for partners) - clear, transparent, no hidden costs.

**Three tiers:**
- **Starter**: 20 hours/month ($2,500 or $1,300 partner)
- **Professional**: 60 hours/month ($7,500 or $3,900 partner)
- **Enterprise**: 160+ hours/month ($20K+ negotiated, or $10.4K+ partner)

**Proof:** We've shipped Beltline Golf, TradeAlerts, Gratog, etc-app, Image-to-SVG and more.

## Features

- **6-section inquiry form** (10-minute completion)
  - Project basics and type
  - Scope estimation (design, database, integrations)
  - Timeline and budget
  - Team technical level
  - Contact information
  - Partner qualification for discounts

- **Automatic scope estimation** - API calculates hours, tier, and pricing based on your answers

- **PWA (Progressive Web App)** - Works offline, installable on home screen

- **Mobile-responsive** - Works perfectly on phone, tablet, desktop

- **Partner pricing** - $65/hour for referrals, relationships, and community members

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Live Deployment

**Site is live:** https://cod3blackagency.vercel.app/c3bai (Vercel)

**GitHub:** https://github.com/wizelements/c3bai

Auto-deploys on `git push origin master` via GitHub integration.

## Project Structure

```
c3bai/
├── app/
│   ├── layout.jsx              # Root layout with PWA setup
│   ├── globals.css             # Tailwind styles
│   ├── inquiry-form.jsx        # 6-section form component
│   ├── offline.jsx             # Offline fallback page
│   ├── pwa-install.jsx         # Install prompt component
│   └── api/
│       └── inquiry/
│           └── route.js        # POST endpoint for form submissions
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service worker
│   ├── icon-192x192.png        # App icon
│   ├── icon-512x512.png        # Large app icon
│   └── offline.html            # Offline page
├── docs/                       # Reference documentation
├── package.json
└── vercel.json
```

## Key Features Explained

### Inquiry Form (6 Sections)

**Section 1: Basics**
- Project name, description, problem statement
- Project type (website, app, integration, redesign, MVP, etc)

**Section 2: Scope**
- Design complexity (template, moderate, custom)
- Database needs (none, simple, complex)
- Number of integrations (Stripe, Slack, APIs, etc)
- Platforms needed (web, iOS, Android)
- Special requirements (compliance, performance, SEO, training)

**Section 3: Timeline & Budget**
- When you need it (flexible, 3 months, 6 weeks, 4 weeks, ASAP)
- Budget range ($5K, $15K, $50K, $50K+)

**Section 4: Team & Technical**
- Existing code (starting fresh, partial, existing, legacy)
- Team technical level (non-tech, mixed, strong dev, enterprise)
- Tech stack preference (React, Node, Python, etc)

**Section 5: Contact**
- Name, email, company, website
- Preferred contact method (email, phone, Slack, calendar)
- Additional info

**Section 6: Partner Qualification**
- Relationship type (first time, referred, existing, partnership, community)
- Details about the relationship
- Partner pricing: $65/hour instead of $125/hour

### Scope Estimation Algorithm

The API estimates hours based on:

1. **Project type baseline** (20-100 hours)
   - Website: 20 hrs
   - Web App: 60 hrs
   - Mobile App: 100 hrs
   - MVP: 40 hrs
   - Redesign: 30 hrs
   - Integration: 20 hrs

2. **Design complexity** (+15-40 hours)
   - Template: 0 hrs
   - Moderate: +15 hrs
   - Custom: +40 hrs

3. **Database/Backend** (+10-30 hours)
   - None: 0 hrs
   - Simple: +10 hrs
   - Complex: +30 hrs

4. **Integrations** (+5-30 hours)
   - None: 0 hrs
   - 1-2: +5 hrs
   - 3-5: +15 hrs
   - 5+: +30 hrs

5. **Mobile platforms** (+30 hours each)
   - iOS: +30 hrs
   - Android: +30 hrs

6. **Special requirements** (+10-20 hours)
   - Compliance: +20 hrs
   - Performance: +15 hrs
   - SEO: +10 hrs
   - Training: +15 hrs

7. **Team adjustments**
   - Non-tech founder: +10 hrs (more guidance needed)

**Tier assignment:**
- 20-60 hours: **Starter** ($2.5K/month)
- 60-100 hours: **Professional** ($7.5K/month)
- 100+ hours: **Enterprise** ($20K+/month)

**Partner discount:**
- If qualified: $65/hour instead of $125/hour
- Example: Professional goes from $7.5K to $3.9K/month

## PWA Features

The app works as a PWA (Progressive Web App):

✅ **Installable** - Add to home screen on mobile  
✅ **Offline support** - Service worker caches key pages  
✅ **Fast loading** - Cached assets load instantly  
✅ **Native feel** - Full-screen, no browser chrome  
✅ **Background sync** - Form data queues for submission when online

### How to Install

**iOS:**
1. Open in Safari
2. Tap Share → Add to Home Screen
3. Tap Add

**Android:**
1. Open in Chrome
2. Tap menu (three dots) → "Install app"
3. Or: Tap "Install" when prompt appears

## Environment Variables

Create `.env.local`:

```env
# Email service (optional, for auto-responses)
EMAIL_API_KEY=xxxxx
EMAIL_FROM=hello@c3bai.com

# Database (optional, for storing inquiries)
DATABASE_URL=postgres://...

# Slack notifications (optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/...

# Stripe (future, for payments)
STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
```

## Implementation Status

- ✅ Inquiry form component (6 sections)
- ✅ API endpoint for scope estimation
- ✅ PWA manifest and service worker
- ✅ Offline page
- ✅ Mobile-responsive design
- ✅ Partner qualification system
- ⏳ Database integration (for storing inquiries)
- ⏳ Email service (for auto-responses)
- ⏳ Slack notifications
- ⏳ Project gallery (Beltline Golf, TradeAlerts, etc)
- ⏳ Best practices documentation
- ⏳ Stripe payment integration

## What's Next

1. **Database** - Store inquiries in Postgres or MongoDB
2. **Email** - Auto-responses with scope estimate
3. **Slack** - Team notifications when inquiries arrive
4. **Projects page** - Link to live projects with deep dives
5. **Best practices** - Documentation on web design, apps, and software
6. **Stripe** - Process payments for services

## Our Live Projects

**Real work we've shipped:**

- **Beltline Golf** - Booking system with leaderboard and waivers
- **TradeAlerts** - React Native trading app
- **Gratog** - Project management tool
- **etc-app** - [Description]
- **Image-to-SVG** - Batch image conversion tool

Each project showcases our approach to solving real problems.

## Pricing Transparency

**The math is simple:**

```
$125/hour ÷ hourly rate
= Your professional engineering time

Example 1: Simple Website
20 hours × $125 = $2,500 (Starter tier)

Example 2: Web App with Integrations
60 hours × $125 = $7,500 (Professional tier)

Example 3: Complex Multi-Platform System
160+ hours × $125 = $20K+ (Enterprise tier)

Partner Rate (48% discount):
Same hours, $65/hour instead of $125/hour
- Starter: $1,300/month instead of $2,500
- Professional: $3,900/month instead of $7,500
- Enterprise: $10,400/month instead of $20K+
```

**No hidden fees. No API markup. Just hours × rate.**

## FAQ

**Q: Why hourly rate instead of flat price?**  
A: Because we don't know your exact scope until we talk. An hourly rate is fair to both of us.

**Q: Can I see examples?**  
A: Yes. Check our projects page for Beltline Golf, TradeAlerts, Gratog, etc-app, and Image-to-SVG.

**Q: How do you estimate?**  
A: We ask about your project (type, design, integrations, team level) and run it through our estimation algorithm. You get a rough estimate instantly, then we refine during discovery.

**Q: What if I go over estimate?**  
A: We'll call you before going over 20% above estimate. Monthly tiers cap your spend automatically.

**Q: Do you do ongoing support?**  
A: Yes. Our tiers include monthly hours. Starter = 20 hrs/month, Professional = 60 hrs/month, Enterprise = 160+ hrs/month. Use them for new features, bug fixes, optimization, whatever you need.

**Q: Can I switch tiers?**  
A: Yes. 30-day notice for downgrade. Upgrades anytime.

**Q: What if I don't use all my hours?**  
A: Hours don't roll over, but you can bank unused hours for up to 2 months.

## Status

**Current:** MVP form + API estimation + PWA support  
**Deployed:** c3bai.vercel.app  
**Next:** Database, email, projects page, best practices

**Expected launch features:**
- [ ] Email auto-responses with scope estimate
- [ ] Project gallery with deep dives
- [ ] Best practices guides for web design, apps, software
- [ ] Slack team notifications
- [ ] Database storage for inquiries

---

**Built by:** Cod3Black Agency  
**Rate:** $125/hour (or $65/hour for partners)  
**Proof:** Real projects shipped. Real results delivered.
