import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Zap,
  Bot,
  Calendar,
  Mail,
  BarChart3,
  CreditCard,
  Shield,
  Sparkles,
} from 'lucide-react';

const packages = [
  {
    name: 'Starter System',
    price: '$1,500 – $2,500',
    description: 'Get a professional website and your first lead-capture or booking flow live fast.',
    features: [
      'Responsive website (5–7 pages)',
      'Lead-capture or booking form',
      'Email notifications to you and the prospect',
      'Basic automation (1–2 flows)',
      'Mobile-optimized + fast',
      '30 days of support',
    ],
    highlighted: false,
    cta: 'Get a Starter Quote',
  },
  {
    name: 'Growth System',
    price: '$4,000 – $6,000',
    description:
      'The full business system: website, admin dashboard, payments/booking, automations, and one AI workflow.',
    features: [
      'Everything in Starter',
      'Custom admin dashboard',
      'Payments or booking checkout',
      '3–5 automations + 1 AI workflow',
      'Customer/member/orders database',
      'Analytics + conversion tracking setup',
      '90 days of support',
    ],
    highlighted: true,
    cta: 'Get a Growth Quote',
  },
  {
    name: 'Automation Retainer',
    price: '$500 – $1,500/mo',
    description:
      'Ongoing optimization and new automations so your system keeps improving without your daily attention.',
    features: [
      'Monthly optimization sprint',
      '1 new automation each month',
      'Performance + lead report',
      'Priority bug fixes',
      'Quarterly strategy review',
      'Cancel anytime with 30-day notice',
    ],
    highlighted: false,
    cta: 'Start a Retainer',
  },
];

const addOns = [
  { icon: Bot, title: 'AI Workflow Setup', description: 'Add an AI assistant, content generator, or decision router to any package.', price: 'From $500' },
  { icon: CreditCard, title: 'Payments Integration', description: 'Stripe, Square, or custom checkout connected to your dashboard and automations.', price: 'From $800' },
  { icon: Shield, title: 'Member/Auth System', description: 'User accounts, protected content, roles, and member-only areas.', price: 'From $1,200' },
  { icon: BarChart3, title: 'Analytics + Reporting', description: 'Conversion tracking, dashboards, and automated monthly reports.', price: 'From $600' },
];

const process = [
  { step: '1', title: 'Systems Audit', description: 'You describe your business and where time is being lost. We identify the highest-leverage system.' },
  { step: '2', title: 'Plan & Approve', description: 'We deliver a fixed-scope proposal with deliverables, timeline, and investment.' },
  { step: '3', title: 'Build & Configure', description: 'We build the website, dashboard, automation, and AI workflow in parallel.' },
  { step: '4', title: 'Launch & Optimize', description: 'We deploy, test, and hand off a system that runs with minimal daily input.' },
];

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-white group-hover:text-cyan-300 transition">Cod3Black</span>
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/" className="text-slate-400 hover:text-white transition">Home</Link>
          <Link href="/docs/projects" className="text-slate-400 hover:text-white transition">Projects</Link>
          <a href="/#inquiry" className="px-4 py-2 bg-white text-[#0a0a0f] rounded-lg hover:bg-cyan-300 transition font-semibold">
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Nav />

      <section className="relative pt-40 pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/15 rounded-full blur-[120px]"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full glass text-sm font-medium text-cyan-300">
            <Sparkles size={16} />
            Productized systems
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Clear packages.
            <br />
            <span className="text-gradient">Clear outcomes.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
            Choose the system that matches your stage. Every package ships with defined deliverables and a fixed investment.
          </p>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-2xl p-8 transition flex flex-col ${pkg.highlighted ? 'glass-card ring-1 ring-cyan-400/40 bg-gradient-to-b from-white/[0.06] to-white/[0.02]' : 'glass-card hover:border-cyan-400/20'}`}
              >
                {pkg.highlighted && (
                  <div className="inline-block self-start px-3 py-1 bg-cyan-400/10 text-cyan-300 text-xs font-bold rounded-full mb-4 ring-1 ring-cyan-400/20">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                <div className="text-3xl font-bold text-gradient mb-4">{pkg.price}</div>
                <p className="text-slate-400 mb-8">{pkg.description}</p>

                <ul className="space-y-3.5 mb-10 flex-1">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <Check size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="/#inquiry"
                  className={`block text-center px-6 py-3 rounded-xl font-semibold transition ${pkg.highlighted ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-[#0a0a0f] hover:shadow-[0_0_40px_rgba(34,211,238,0.35)]' : 'border border-white/20 text-white hover:bg-white/5'}`}
                >
                  {pkg.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">Add-on systems</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Extend any package with a specialized system based on your business model.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {addOns.map((addon, idx) => {
              const Icon = addon.icon;
              return (
                <div key={idx} className="glass-card rounded-2xl p-6 hover:border-cyan-400/20 transition">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10">
                      <Icon className="w-5 h-5 text-cyan-300" />
                    </div>
                    <div className="text-cyan-300 font-bold">{addon.price}</div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{addon.title}</h3>
                  <p className="text-slate-400">{addon.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">How it works</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              A controlled, repeatable process that turns your business need into a running system.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step) => (
              <div key={step.step} className="glass-card rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 text-white flex items-center justify-center font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 tracking-tight">Ready to stop manually chasing customers?</h2>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            Get a free systems audit. We'll identify the highest-leverage automation or system to build first.
          </p>
          <a
            href="/#inquiry"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-400 to-cyan-500 text-[#0a0a0f] font-bold rounded-xl hover:shadow-[0_0_40px_rgba(34,211,238,0.35)] transition"
          >
            Get Your Free Audit <ArrowRight size={20} />
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-slate-500">© 2026 Cod3Black Agency. Done-for-you AI business systems.</p>
        </div>
      </footer>
    </div>
  );
}
