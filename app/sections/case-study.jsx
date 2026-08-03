'use client';

import Link from 'next/link';
import {
  ExternalLink,
  Check,
  CreditCard,
  MessageCircle,
  Mail,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

const flows = [
  {
    icon: CreditCard,
    title: 'Square payments live',
    description: 'Customers order wellness beverages online. Square handles checkout, inventory sync, and secure payment capture.',
  },
  {
    icon: MessageCircle,
    title: 'Telegram owner alerts',
    description: 'Every new order triggers an instant Telegram alert to the owner with order details, amount, and customer info.',
  },
  {
    icon: Mail,
    title: 'Resend email notifications',
    description: 'Order confirmations and customer-facing emails route through Resend using a verified domain for deliverability.',
  },
  {
    icon: ShieldCheck,
    title: 'No-SMS remediation',
    description: 'Removed Twilio SMS dependency and replaced fragile SMS flows with reliable email + Telegram alerts.',
  },
  {
    icon: TrendingUp,
    title: 'Daily revenue reports',
    description: 'Automated daily report cron summarizes orders, revenue, and health — delivered every morning.',
  },
];

const stats = [
  { value: 'Square', label: 'Payment processor' },
  { value: 'Telegram', label: 'Owner alerts' },
  { value: 'Resend', label: 'Customer email' },
  { value: 'Daily', label: 'Revenue report' },
];

export default function CaseStudy() {
  return (
    <section id="case-study" className="py-28 px-4 sm:px-6 bg-[#0a0a0f] relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full glass text-sm font-medium text-cyan-300">
            <TrendingUp size={16} />
            Living case study
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
            How Gratog runs on autopilot
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Taste of Gratitude is a real Atlanta wellness beverage brand. Here is the AI revenue system we built and operate for them.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 sm:p-10 mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">Taste of Gratitude</h3>
              <p className="text-slate-400">Atlanta wellness beverage brand · tasteofgratitude.shop</p>
            </div>
            <a
              href="https://tasteofgratitude.shop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/20 text-white hover:bg-white/5 transition font-medium"
            >
              Visit live site <ExternalLink size={16} />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-5 text-center">
                <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {flows.map((flow) => {
              const Icon = flow.icon;
              return (
                <div key={flow.title} className="flex gap-4 p-5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10 flex-shrink-0">
                    <Icon className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{flow.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{flow.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8 sm:p-10">
          <h4 className="text-2xl font-bold text-white mb-6">What this means for your business</h4>
          <ul className="grid sm:grid-cols-2 gap-4 mb-8">
            {[
              'Capture orders while you sleep',
              'Instant alerts on every sale',
              'No SMS bill or deliverability risk',
              'Daily visibility into revenue',
              'Same system, your brand',
              'Built in days, not quarters',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2.5 text-slate-300">
                <Check size={18} className="text-cyan-400 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#audit"
              className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-[#0a0a0f] font-bold rounded-xl hover:shadow-[0_0_40px_rgba(168,85,247,0.35)] transition inline-flex items-center justify-center gap-2"
            >
              Get Your Free Revenue Systems Audit <ArrowRight size={20} />
            </a>
            <Link
              href="/docs/projects"
              className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition inline-flex items-center justify-center gap-2"
            >
              Read More Case Studies
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
