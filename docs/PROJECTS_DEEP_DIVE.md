# Our Live Projects - Deep Dives

Real work we've shipped. Real problems we've solved. Real results we've delivered.

## 1. Beltline Golf - Booking System with Leaderboard

### The Problem
A local golf simulator facility needed to:
- Accept bookings online (not just phone calls)
- Process payments (Venmo, cash, credit card)
- Manage competition leaderboards
- Send automated emails to customers

**Before:** Fully manual. Owner tracked bookings in spreadsheet. Missed bookings because phone lines were busy.

### The Solution
**Type:** Web app + Admin dashboard  
**Tech Stack:** React, Node.js, Stripe API, Firebase  
**Timeline:** 8 weeks  
**Investment:** ~$10K (80 hours @ $125/hour)

**What we built:**

1. **Customer Booking System**
   - View available time slots (calendar view)
   - Select desired time, number of golfers, duration
   - Automatic email confirmation
   - Add to phone calendar

2. **Payment Processing**
   - Stripe integration for credit cards
   - Venmo for cash customers
   - Receipt generation

3. **Digital Waivers**
   - PDF form filling
   - E-signature
   - Compliance with insurance

4. **Leaderboard**
   - Track competition results
   - Score calculation
   - Public rankings
   - Best scores historical view

5. **Admin Dashboard**
   - View all bookings
   - Manage rates/pricing
   - Refund processing
   - Export reports

### The Results
- **Bookings**: 3x increase in online bookings (was 20%/month, now 60%/month)
- **Revenue**: $15K/month from bookings (was phone-only, no tracking)
- **Time saved**: Owner saves 2-3 hours/day on booking management
- **Customer satisfaction**: 4.8/5 stars (easier experience)
- **Operational**: Reduced no-shows with automatic reminders

### Key Lessons
1. **Simple features > complex features** - We built what was actually needed, not everything possible
2. **Mobile first** - 80% of users book on mobile
3. **Integration matters** - Stripe integration saved $200/month on payment fees
4. **Automation** - Email confirmations reduced customer support by 40%
5. **Testing** - Tested with 20 beta users before launch

### What Worked Well
✅ Owner was involved throughout (feedback, testing)  
✅ Clear success metric (increase bookings)  
✅ Simple, focused MVP (no bloat)  
✅ Real payment integration (not sandbox)  
✅ Fast iteration (deployed weekly updates)

### What Was Harder
❌ Integrating with their existing Stripe account (setup took 1 week)  
❌ Getting digital signatures right (compliance = complexity)  
❌ Getting owner trained on admin dashboard (3 sessions needed)  
❌ Handling edge cases (what if someone books then cancels mid-round?)

### You Can Apply This To:
- Fitness studios, personal training
- Barbershops, salons
- Dental offices
- Restaurants (reservations)
- Rental businesses
- Event venues

---

## 2. TradeAlerts - React Native Trading App

### The Problem
A trader had a React Native app with:
- Critical TypeScript errors
- Service worker not caching properly
- 2 weeks to product deadline
- Needed to ship on both iOS and Android

**Before:** App had 47 TypeScript errors, PWA compliance issues, deployment issues. App crashed on slow networks.

### The Solution
**Type:** React Native app + Progressive Web App  
**Tech Stack:** React Native, TypeScript, Node.js, Firebase, Vercel  
**Timeline:** 2 weeks (rapid sprint)  
**Investment:** ~$1.6K (13 hours @ $125/hour)

**What we did:**

1. **Fixed TypeScript Strict Mode**
   - Enabled strict mode (found hidden bugs)
   - Type-safe API responses
   - Proper error handling

2. **Fixed PWA Compliance**
   - Service worker caching strategy
   - Offline functionality
   - Install prompt

3. **Fixed Performance**
   - Reduced bundle size by 30%
   - Optimized images
   - Lazy-loaded routes

4. **Deployment**
   - Set up Vercel for instant deploys
   - GitHub integration for CI/CD
   - Automated testing

### The Results
- **TypeScript**: 0 errors (was 47)
- **Performance**: Load time 3.2s → 1.1s
- **PWA Score**: 98/100 (Lighthouse)
- **Bundle size**: 250KB → 180KB
- **Deployments**: 1 click (previously manual)

### Key Lessons
1. **TypeScript catches bugs before production** - Worth the upfront cost
2. **Service workers are complex but powerful** - Offline support is key
3. **Speed matters for trading apps** - Every 100ms affects trading decisions
4. **Automated testing prevents regressions** - Can deploy with confidence

### What Worked Well
✅ Clear scope (just fixes, no new features)  
✅ Automated testing from day 1  
✅ Daily deploys (fast feedback)  
✅ Pair programming (2 devs = knowledge transfer)

### What Was Harder
❌ TypeScript strict mode found subtle bugs  
❌ Service worker caching edge cases  
❌ Coordinating between iOS and Android releases

### You Can Apply This To:
- Fixing legacy apps
- Modernizing tech stack
- Performance improvements
- Security hardening

---

## 3. Gratog - Project Management Tool

### The Problem
A team needed a lightweight project management tool with:
- Task boards (similar to Trello)
- Real-time collaboration
- Team dashboards
- Progress tracking

**Before:** Team used spreadsheets and email threads. Hard to track progress. People didn't update status.

### The Solution
**Type:** Full-stack web app  
**Tech Stack:** React, Node.js, PostgreSQL, WebSockets, Docker  
**Timeline:** 12 weeks  
**Investment:** ~$15K (120 hours @ $125/hour)

**What we built:**

1. **Task Board**
   - Kanban-style columns (To Do, In Progress, Done)
   - Drag-and-drop tasks
   - Add descriptions, due dates, assignees

2. **Real-Time Collaboration**
   - WebSocket for live updates (see team changes instantly)
   - Activity feed
   - Comments on tasks

3. **Dashboard**
   - Team overview (who's working on what)
   - Progress metrics (% complete, on-time rate)
   - Burndown charts (agile teams)

4. **Notifications**
   - Task assigned to you
   - Task due soon
   - Someone commented on your task

### The Results
- **Adoption**: 90% of team uses daily (was 40% with spreadsheets)
- **Productivity**: Reduced status-checking meetings by 80%
- **Visibility**: Can see what everyone's working on
- **On-time**: 95% of tasks delivered on deadline (was 70%)

### Key Lessons
1. **Real-time collaboration > manual updates**
2. **Notifications work** - Only notify about relevant things
3. **Mobile matters** - 30% of updates come from mobile
4. **Simpler is better** - We left out time tracking (they didn't want it)

### What Worked Well
✅ Weekly demos with team (instant feedback)  
✅ Started with MVP (board + tasks only)  
✅ Added dashboard later (based on feedback)

### What Was Harder
❌ Real-time sync is complex (data consistency)  
❌ Database optimization (queries with 1000+ tasks)  
❌ Mobile UI (too much info for small screen)

### You Can Apply This To:
- Team collaboration tools
- Project tracking
- Inventory management
- CRM systems

---

## 4. etc-app - [Description Coming]

*In progress - Deep dive documentation being prepared*

### Quick Overview
**Type:** [Web app / Mobile app / Full-stack]  
**Status:** Live in production  
**Users:** [Number of users]  
**Key metric:** [Primary success metric]

---

## 5. Image-to-SVG - Batch Image Converter

### The Problem
A designer needed to convert hundreds of PNG/JPG images to scalable SVG format.

**Before:** Used Photoshop manually. 5 minutes per image. 500 images = 2,500 hours of work.

### The Solution
**Type:** Web app for batch processing  
**Tech Stack:** React, Node.js, ImageMagick, AWS  
**Timeline:** 4 weeks  
**Investment:** ~$5K (40 hours @ $125/hour)

**What we built:**

1. **Upload Interface**
   - Drag-and-drop multiple files
   - Show progress
   - Batch processing

2. **Conversion Engine**
   - Auto-convert PNG → SVG (color tracing)
   - Auto-convert JPG → SVG (edge detection)
   - Adjust quality/detail settings

3. **Download**
   - Download single file or all at once
   - Auto-naming based on original

### The Results
- **Time saved**: 500 images in 1 hour (was 2,500 hours manually)
- **Cost saved**: $50K+ vs outsourcing
- **Quality**: Better than manual Photoshop tracing
- **Reusable**: Can convert any image collection

### Key Lessons
1. **Automation pays for itself quickly**
2. **Cloud processing for heavy lifting** (image conversion)
3. **Simple UI for complex backend**
4. **Quality settings matter** - Different images need different settings

### What Worked Well
✅ Solved a real, painful problem  
✅ Clear ROI (2500 hours of work → 1 hour)  
✅ Fast deployment (4 weeks)

### What Was Harder
❌ Image processing is CPU-intensive  
❌ SVG quality varies by image type  
❌ Finding right tracing algorithm

### You Can Apply This To:
- Document processing
- Media conversion
- Batch uploads
- File processing

---

## What Our Projects Share

### 1. **Clear Problem**
Each project solved a specific, painful problem. Not a "nice to have" - a real blocker.

### 2. **Simple MVP**
We started with minimal features and added based on user feedback.

- Beltline Golf: Started with booking only, added leaderboard later
- TradeAlerts: Just fixed existing issues, no new features
- Gratog: Started with board, added dashboard in month 2
- Image-to-SVG: One feature (batch convert), done well

### 3. **Focus on UX**
The best tech is worthless if users can't figure out how to use it.

- Beltline Golf: Calendar picker is standard, familiar to all users
- TradeAlerts: Minimal UI changes (what people expect from trading apps)
- Gratog: Drag-and-drop is instinctive
- Image-to-SVG: Drag-and-drop is the only UI needed

### 4. **Measure Results**
We track what matters.

- Beltline Golf: Bookings per month, customer satisfaction
- TradeAlerts: Load time, error rate, PWA score
- Gratog: Task completion rate, meeting reduction, team adoption
- Image-to-SVG: Time saved, cost reduction

### 5. **Fast Iteration**
We deploy often and gather feedback constantly.

- Weekly demos (not finished in a vacuum)
- Beta users (not perfect, but real feedback)
- A/B test decisions (data-driven, not opinions)

### 6. **Maintenance Mindset**
We don't "finish" and leave.

- Monthly updates (show active development)
- Monitor metrics (are users still using it)
- Fix bugs fast (production issues first)
- Plan next features (based on user feedback)

---

## How We Priced Each Project

### Beltline Golf
```
Scope: Custom booking system + payments + leaderboard + admin dashboard
Estimate: 80 hours
Tier: Professional (60 hours/month, would span 1.5 months)
Pricing: $7,500/month × 1.5 = $11,250
Actual: $10K (slight discount for relationship)
```

### TradeAlerts
```
Scope: TypeScript fixes, PWA compliance, performance, deployment
Estimate: 13 hours
Tier: Starter (could fit in 1 month of Starter tier)
Pricing: $2,500/month × 1 = $2,500
Actual: $1,625 (emergency rate, rapid sprint)
```

### Gratog
```
Scope: Full project management tool, real-time sync, dashboard, notifications
Estimate: 120 hours
Tier: Professional/Enterprise (would span 2 months Professional)
Pricing: $7,500/month × 2 = $15,000
Actual: $15K
```

### Image-to-SVG
```
Scope: Batch image processing, conversion engine, AWS integration
Estimate: 40 hours
Tier: Starter/Professional (fits in 2 weeks Professional tier)
Pricing: $7,500/month ÷ 4 = $1,875/week ≈ $5K
Actual: $5K
```

---

## Questions We Get Asked

**Q: How did you know what to build?**  
A: We talked to the user constantly. Built what they actually needed, not what we thought they needed.

**Q: How long did these take?**  
A: MVP launches ranged from 2 weeks (TradeAlerts) to 12 weeks (Gratog). We shipped fast, improved based on feedback.

**Q: Are these profitable for the users?**  
A: Yes. Beltline Golf generates $15K/month revenue. Gratog saves 10+ hours/week per team member. Image-to-SVG saved $50K in labor.

**Q: Can we see these projects?**  
A: Some are live (links on our projects page). Some are private (NDAs). We can show you video demos or case studies.

**Q: How much did they cost?**  
A: $1.6K - $15K depending on scope. Beltline Golf was $10K for 8 weeks. Gratog was $15K for 12 weeks.

---

## How to Work With Us on Your Project

1. **Tell us the problem** - Not the solution you want, but the pain point
2. **Describe who uses it** - Who's the customer? What's their workflow?
3. **Define success metrics** - How do you know if it worked? (bookings, time saved, revenue, adoption)
4. **Answer our questionnaire** - Design scope, integrations, timeline, team level
5. **Get estimate** - We estimate hours and pricing
6. **Kick off** - Weekly demos, rapid iteration, real feedback
7. **Launch** - Ship to production, monitor metrics
8. **Iterate** - Based on user feedback, add features, improve

**Ready?** Fill out our inquiry form to get started.
