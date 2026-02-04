# c3bai.vercel.app Pricing Implementation Guide
## Step-by-step technical & UX implementation

---

## Part 1: Pricing Page Structure

### New Routes
```
/pricing                    # Main pricing page
/pricing/consultation       # Free consultation booking
/pricing/invoice            # Invoice history (authenticated)
/api/pricing/plans          # API endpoint for plan data
/api/pricing/checkout       # Stripe checkout session
/api/webhook/stripe         # Webhook for subscription events
```

### Page Component Architecture
```tsx
// app/pricing/page.tsx
export default function PricingPage() {
  return (
    <main>
      <Hero />
      <PricingComparison />
      <FAQSection />
      <ConsultationCTA />
      <Footer />
    </main>
  )
}

// Components:
// - PricingCard (Starter, Professional, Enterprise)
// - FeatureComparison (table view)
// - ConsultationForm (email, project desc, phone)
// - PricingFAQ (common questions)
```

---

## Part 2: Pricing Cards Component

### Design System
```tsx
// components/PricingCard.tsx
interface PricingTierProps {
  name: "Starter" | "Professional" | "Enterprise"
  price: number | "Custom"
  period: "month" | "year"
  description: string
  features: string[]
  cta: string
  ctaAction: () => void
  highlighted?: boolean
  badge?: string
}

const PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "AI Integration",
    price: 2500,
    period: "month",
    annualPrice: 25000,
    annualDiscount: 0.20, // 20%
    description: "Perfect for MVPs and proof-of-concepts",
    features: [
      "Up to 3 concurrent projects",
      "100K tokens/month included",
      "Document processing (100 docs/mo)",
      "Email support (24-48hr)",
      "Weekly check-ins",
      "Basic monitoring",
      "2 deployment environments"
    ],
    cta: "Start Free Trial",
    priceUnit: "/month or $25,000/year",
    highlighted: false
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Production Systems",
    price: 7500,
    period: "month",
    annualPrice: 75000,
    annualDiscount: 0.20,
    description: "For Series A/B startups and mid-market",
    features: [
      "Unlimited projects",
      "1M tokens/month included",
      "Document processing (2K docs/mo)",
      "Priority support (4-8hr)",
      "Bi-weekly strategy sessions",
      "Advanced monitoring & optimization",
      "5 deployment environments",
      "Custom prompt engineering"
    ],
    cta: "Get Started",
    priceUnit: "/month or $75,000/year",
    highlighted: true,
    badge: "Most Popular"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Bespoke Solutions",
    price: null,
    period: "custom",
    description: "For large enterprises with custom needs",
    features: [
      "Everything in Professional",
      "Unlimited tokens & documents",
      "24/7 support + on-call engineer",
      "99.9% uptime SLA",
      "Custom model fine-tuning",
      "Multi-provider orchestration",
      "Audit logging & compliance",
      "Quarterly business reviews"
    ],
    cta: "Contact Sales",
    priceUnit: "$15,000+/month",
    highlighted: false
  }
]
```

### Visual Component
```tsx
// components/PricingCard.tsx
export function PricingCard({ tier, isAnnual }: Props) {
  const displayPrice = isAnnual 
    ? Math.round(tier.price * 12 * (1 - tier.annualDiscount))
    : tier.price

  return (
    <div className={`
      border rounded-lg p-8 
      ${tier.highlighted ? 'border-blue-500 bg-blue-900/10 ring-2 ring-blue-500' : 'border-slate-700'}
    `}>
      {tier.badge && (
        <div className="mb-4 text-sm font-semibold text-blue-400">{tier.badge}</div>
      )}
      
      <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
      <p className="text-slate-400 mb-6">{tier.tagline}</p>
      
      <div className="mb-6">
        {tier.price ? (
          <>
            <div className="text-4xl font-bold">${displayPrice.toLocaleString()}</div>
            <div className="text-sm text-slate-400">{tier.priceUnit}</div>
            {isAnnual && tier.annualDiscount > 0 && (
              <div className="text-sm text-green-400 mt-2">
                Save ${Math.round((tier.price * 12) - displayPrice).toLocaleString()} annually
              </div>
            )}
          </>
        ) : (
          <div className="text-3xl font-bold">Custom Pricing</div>
        )}
      </div>

      <button className={`
        w-full py-3 rounded font-semibold mb-8
        ${tier.highlighted 
          ? 'bg-blue-600 hover:bg-blue-700 text-white'
          : 'border border-slate-600 hover:border-slate-400 text-white'
        }
      `}>
        {tier.cta}
      </button>

      <ul className="space-y-3">
        {tier.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-slate-300">
            <CheckIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

## Part 3: Pricing Comparison Table

```tsx
// components/PricingComparison.tsx
const COMPARISON_FEATURES = [
  {
    category: "Project Management",
    items: [
      { name: "Concurrent Projects", starter: "Up to 3", pro: "Unlimited", ent: "Unlimited" },
      { name: "Deployment Environments", starter: "2", pro: "5", ent: "Unlimited" },
    ]
  },
  {
    category: "LLM Inference",
    items: [
      { name: "Tokens/Month", starter: "100K", pro: "1M", ent: "Unlimited" },
      { name: "Provider Routing", starter: "No", pro: "Yes", ent: "Yes" },
      { name: "Rate Limit Optimization", starter: "No", pro: "Yes", ent: "Yes" },
    ]
  },
  {
    category: "Document Processing",
    items: [
      { name: "Docs/Month", starter: "100", pro: "2,000", ent: "Unlimited" },
      { name: "OCR Included", starter: "Basic", pro: "Advanced", ent: "Advanced" },
    ]
  },
  {
    category: "Support",
    items: [
      { name: "Response Time", starter: "24-48 hours", pro: "4-8 hours", ent: "1 hour / 24/7" },
      { name: "Support Channel", starter: "Email", pro: "Email + Slack", ent: "Email + Slack + Phone" },
      { name: "Dedicated Engineer", starter: "No", pro: "Optional", ent: "Yes" },
    ]
  },
  {
    category: "Monitoring & Analytics",
    items: [
      { name: "Basic Monitoring", starter: "✓", pro: "✓", ent: "✓" },
      { name: "Advanced Analytics", starter: "No", pro: "Yes", ent: "Yes" },
      { name: "Cost Optimization Reports", starter: "No", pro: "Yes", ent: "Yes" },
    ]
  }
]
```

---

## Part 4: Free Consultation Form & Flow

### Component
```tsx
// components/ConsultationForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ConsultationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email'),
      name: formData.get('name'),
      company: formData.get('company'),
      projectDescription: formData.get('projectDescription'),
      phone: formData.get('phone'),
    }

    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        setSubmitted(true)
        // Calendar booking redirect
        router.push(`/consultation/book?email=${data.email}`)
      }
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded text-white"
      />
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        required
        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded text-white"
      />
      <input
        type="text"
        name="company"
        placeholder="Company (optional)"
        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded text-white"
      />
      <textarea
        name="projectDescription"
        placeholder="Describe your AI project or problem..."
        required
        rows={4}
        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded text-white"
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone (optional)"
        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded text-white"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold text-white disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Book Free Consultation'}
      </button>
    </form>
  )
}
```

### API Endpoint
```typescript
// app/api/consultation/route.ts
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { email, name, company, projectDescription, phone } = await req.json()

    // Save to database
    await db.consultation.create({
      email,
      name,
      company,
      projectDescription,
      phone,
      status: 'pending',
      createdAt: new Date()
    })

    // Send email notification to sales
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    })

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.SALES_EMAIL,
      subject: `New Consultation Request: ${name}`,
      html: `
        <h2>New Consultation Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <h3>Project Description:</h3>
        <p>${projectDescription}</p>
        <p><a href="https://calendly.com/codethree/consultation?email=${email}">Send Calendar Link</a></p>
      `
    })

    return NextResponse.json(
      { success: true, message: 'Consultation request submitted' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Consultation API error:', error)
    return NextResponse.json(
      { error: 'Failed to submit consultation request' },
      { status: 500 }
    )
  }
}
```

---

## Part 5: Stripe Integration

### Setup Billing Portal
```typescript
// lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10'
})

export async function createCheckoutSession(customerId: string, priceId: string) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_URL}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
    billing_address_collection: 'required',
    subscription_data: {
      trial_settings: {
        trial_period_days: 14 // 2-week free trial
      }
    }
  })

  return session
}

export async function createBillingPortalSession(customerId: string) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_URL}/pricing/invoice`
  })
}
```

### Webhook Handler
```typescript
// app/api/webhook/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (error) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      await db.subscription.upsert({
        where: { stripeSubscriptionId: subscription.id },
        create: {
          customerId: subscription.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000)
        },
        update: {
          status: subscription.status,
          stripePriceId: subscription.items.data[0].price.id,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000)
        }
      })
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await db.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: { status: 'canceled' }
      })
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      // Log successful payment, trigger access provisioning
      await db.invoice.create({
        customerId: invoice.customer as string,
        stripeInvoiceId: invoice.id,
        amount: invoice.total,
        paidAt: new Date(invoice.paid_at! * 1000)
      })
      break
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
```

---

## Part 6: Usage Tracking for Overages

### Database Schema
```prisma
// prisma/schema.prisma
model Subscription {
  id String @id @default(cuid())
  customerId String
  stripeSubscriptionId String @unique
  stripePriceId String
  status String // active, trialing, past_due, canceled
  tier String // starter, professional, enterprise
  currentPeriodStart DateTime
  currentPeriodEnd DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  usage UsageMetric[]
  invoices Invoice[]
}

model UsageMetric {
  id String @id @default(cuid())
  subscriptionId String
  subscription Subscription @relation(fields: [subscriptionId], references: [id])
  
  // Usage counters
  tokensUsed Int @default(0)
  documentsProcessed Int @default(0)
  webhookCalls Int @default(0)
  
  // Billing period
  billingPeriodStart DateTime
  billingPeriodEnd DateTime
  
  // Overages
  tokenOverage Int @default(0)
  docOverage Int @default(0)
  overageCharged Decimal @default(0)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Invoice {
  id String @id @default(cuid())
  customerId String
  subscriptionId String
  subscription Subscription @relation(fields: [subscriptionId], references: [id])
  
  stripeInvoiceId String
  amount Decimal
  overageAmount Decimal @default(0)
  paidAt DateTime?
  
  createdAt DateTime @default(now())
}
```

### Usage API
```typescript
// app/api/usage/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const period = req.nextUrl.searchParams.get('period') || 'current'

  let start = new Date()
  let end = new Date()

  if (period === 'current') {
    start.setDate(1) // Start of month
  } else if (period === 'previous') {
    start.setMonth(start.getMonth() - 1)
    start.setDate(1)
    end.setDate(0) // End of previous month
  }

  const usage = await db.usageMetric.findFirst({
    where: {
      subscription: { customerId: user.id },
      billingPeriodStart: { lte: start },
      billingPeriodEnd: { gte: end }
    }
  })

  return NextResponse.json({
    tokensUsed: usage?.tokensUsed || 0,
    documentsProcessed: usage?.documentsProcessed || 0,
    webhookCalls: usage?.webhookCalls || 0,
    tokenOverage: usage?.tokenOverage || 0,
    overageCharged: usage?.overageCharged || 0
  })
}
```

---

## Part 7: FAQ Component

```tsx
// components/PricingFAQ.tsx
const FAQS = [
  {
    q: "Can I change tiers mid-month?",
    a: "Yes. You'll be charged a prorated amount for the upgraded tier, and the remaining balance will be credited to your next billing cycle."
  },
  {
    q: "What happens if I exceed my token limit?",
    a: "Overages are billed at $0.02 per 1,000 tokens (input) and $0.06 per 1,000 tokens (output). You'll receive a warning at 80% usage."
  },
  {
    q: "Do you offer annual contracts?",
    a: "Yes. Annual prepayment saves 20%. For 2-year commitments, we offer 30% discount."
  },
  {
    q: "Is there a free trial?",
    a: "Yes. All paid tiers include a 14-day free trial. No credit card required for consultation."
  },
  {
    q: "What's your cancellation policy?",
    a: "Monthly plans can be canceled anytime with no penalty. Annual plans have a 30-day cancellation window."
  },
  {
    q: "Do you offer SLA guarantees?",
    a: "Enterprise tier includes 99.9% uptime SLA. Professional and Starter do not have SLA guarantees."
  },
  {
    q: "Can I get custom pricing?",
    a: "Yes. Enterprise tier is fully customizable. Contact our sales team for a custom quote."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept credit cards (Visa, Mastercard, Amex), ACH transfers, and wire transfers. Annual contracts can use invoicing."
  }
]

export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="max-w-2xl mx-auto py-20">
      <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {FAQS.map((faq, index) => (
          <div key={index} className="border border-slate-700 rounded-lg">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left p-6 flex justify-between items-center hover:bg-slate-900/50"
            >
              <span className="font-semibold">{faq.q}</span>
              <ChevronIcon className={`w-5 h-5 transition ${openIndex === index ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === index && (
              <div className="px-6 pb-6 text-slate-400">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
```

---

## Part 8: Configuration & Environment

### .env.local
```bash
# Stripe
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
GMAIL_USER=sales@c3bai.com
GMAIL_PASSWORD=app_password_here
SALES_EMAIL=sales@c3bai.com

# Database
DATABASE_URL=postgresql://...

# Calendar (Calendly API)
CALENDLY_API_TOKEN=...

# URLs
NEXT_PUBLIC_URL=https://c3bai.vercel.app
```

### Stripe Product IDs (create in Stripe Dashboard)
```
Starter Monthly: price_1O...
Starter Annual: price_1P...
Professional Monthly: price_1Q...
Professional Annual: price_1R...
Enterprise (custom pricing): N/A
```

---

## Part 9: Testing Checklist

- [ ] Free consultation form submits successfully
- [ ] Stripe checkout works in test mode
- [ ] Subscription creation in database
- [ ] Webhook events processed correctly
- [ ] Usage tracking increments properly
- [ ] Overage billing calculated correctly
- [ ] Email notifications sent on signup
- [ ] Pricing page responsive on mobile
- [ ] Annual discount applies correctly
- [ ] Trial period works (14 days)
- [ ] Cancellation workflow tested
- [ ] Payment method update works

---

## Part 10: Launch Sequence

**Week 1**:
- Deploy pricing page (live but hidden from nav)
- Setup Stripe in test mode
- Test entire checkout flow

**Week 2**:
- Switch Stripe to live mode
- Enable pricing page in main nav
- Launch free consultation form
- Send launch email to existing contacts

**Week 3+**:
- Monitor conversion rates
- Track CAC and LTV
- Iterate based on feedback
- Scale ad spend if CAC < $500

---

**Implementation Status**: Ready to code  
**Estimated Build Time**: 5-7 days  
**Go-Live Target**: February 11, 2025
