'use client';

import Link from 'next/link';
import { Download, Wrench, RefreshCw, Check, ArrowRight } from 'lucide-react';

const offers = [
  {
    tier: 'Lead Magnet',
    name: 'AI Client Acquisition Playbook',
    price: '$0 – $27',
    description: 'The exact checklist and prompts we use to turn a local business website into a 24/7 lead-capture and follow-up machine.',
    icon: Download,
    cta: 'Download Free Playbook',
    features: [
      'Lead-capture page template',
      'AI follow-up message scripts',
      'Booking/quote funnel map',
      'Tool stack recommendations',
    ],
    highlighted: false,
  },
  {
    tier: 'Productized Setup',
    name: 'AI Revenue System Setup',
    price: '$500 – $2,000',
    description: 'We build and connect the website, payment/checkout, alerts, and automation so your revenue system is live in days, not months.',
    icon: Wrench,
    cta: 'Book Your Setup',
    features: [
      'Website or landing page',
      'Payments or booking checkout',
      'Order/lead alert automation',
      'Admin dashboard or daily report',
      '30 days of support',
    ],
    highlighted: true,
  },
  {
    tier: 'Retainer',
    name: 'Ongoing Revenue Optimization',
    price: '$2,000 – $5,000/mo',
    description: 'Continuous optimization: new automations, A/B tests, reporting, and priority fixes so the system keeps producing more revenue.',
    icon: RefreshCw,
    cta: 'Apply for Retainer',
    features: [
      'Monthly optimization sprint',
      'New automation or workflow each month',
      'Revenue and conversion reporting',
      'Priority bug fixes and support',
      'Quarterly strategy review',
    ],
    highlighted: false,
  },
];

export default function OfferLadder() {
  return (
    <section id="offers" className="py-28 px-4 sm:px-6 bg-[#0a0a0f] relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">Choose your growth level</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Start with the playbook, upgrade to a done-for-you setup, or let us run your revenue optimization month after month.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {offers.map((offer) => {
            const Icon = offer.icon;
            return (
              <div
                key={offer.name}
                className={`glass-card rounded-2xl p-8 flex flex-col ${offer.highlighted ? 'ring-1 ring-cyan-400/40' : ''}`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-5 ring-1 ring-white/10">
                  <Icon className="w-6 h-6 text-cyan-300" />
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-2">{offer.tier}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{offer.name}</h3>
                <div className="text-2xl font-bold text-gradient mb-4">{offer.price}</div>
                <p className="text-slate-400 mb-6 leading-relaxed flex-grow">{offer.description}</p>

                <ul className="space-y-3 mb-8">
                  {offer.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/lead-magnet"
                  className="w-full py-3.5 rounded-xl font-semibold inline-flex items-center justify-center gap-2 transition"
                  style={{
                    background: offer.highlighted
                      ? 'linear-gradient(to right, #22d3ee, #a855f7)'
                      : 'transparent',
                    color: offer.highlighted ? '#0a0a0f' : '#fff',
                    border: offer.highlighted ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {offer.cta} <ArrowRight size={18} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
