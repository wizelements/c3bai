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
  {
    icon: Bot,
    title: 'AI Workflow Setup',
    description: 'Add an AI assistant, content generator, or decision router to any package.',
    price: 'From $500',
  },
  {
    icon: CreditCard,
    title: 'Payments Integration',
    description: 'Stripe, Square, or custom checkout connected to your dashboard and automations.',
    price: 'From $800',
  },
  {
    icon: Shield,
    title: 'Member/Auth System',
    description: 'User accounts, protected content, roles, and member-only areas.',
    price: 'From $1,200',
  },
  {
    icon: BarChart3,
    title: 'Analytics + Reporting',
    description: 'Conversion tracking, dashboards, and automated monthly reports.',
    price: 'From $600',
  },
];

const process = [
  {
    step: '1',
    title: 'Systems Audit',
    description: 'You describe your business and where time is being lost. We identify the highest-leverage system.',
  },
  {
    step: '2',
    title: 'Plan & Approve',
    description: 'We deliver a fixed-scope proposal with deliverables, timeline, and investment.',
  },
  {
    step: '3',
    title: 'Build & Configure',
    description: 'We build the website, dashboard, automation, and AI workflow in parallel.',
  },
  {
    step: '4',
    title: 'Launch & Optimize',
    description: 'We deploy, test, and hand off a system that runs with minimal daily input.',
  },
];

export default function ServicesPage() {
  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <Zap size={28} className="text-blue-600" />
            Cod3Black
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link>
            <Link href="/docs/projects" className="text-gray-700 hover:text-blue-600 transition">Projects</Link>
            <a href="/#inquiry" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white pt-20 pb-24 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Productized AI Business Systems</h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              Clear packages, clear deliverables, clear outcomes. Choose the system that matches your stage.
            </p>
          </div>
        </section>

        {/* Packages */}
        <section className="py-24 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`bg-white rounded-2xl p-8 shadow-sm border-2 transition flex flex-col ${pkg.highlighted ? 'border-blue-600 shadow-lg' : 'border-gray-200 hover:border-blue-300'}`}
                >
                  {pkg.highlighted && (
                    <div className="inline-block self-start px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-4">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-4">{pkg.price}</div>
                  <p className="text-gray-600 mb-6">{pkg.description}</p>

                  <ul className="space-y-3 mb-8 flex-1">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="/#inquiry"
                    className={`block text-center px-6 py-3 rounded-lg font-semibold transition ${pkg.highlighted ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'}`}
                  >
                    {pkg.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Add-ons */}
        <section className="py-24 px-4 sm:px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Add-On Systems</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Extend any package with a specialized system based on your business model.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {addOns.map((addon, idx) => {
                const Icon = addon.icon;
                return (
                  <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-blue-600 font-bold">{addon.price}</div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{addon.title}</h3>
                    <p className="text-gray-600">{addon.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-24 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A controlled, repeatable process that turns your business need into a running system.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((step) => (
                <div key={step.step} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Stop Manually Chasing Customers?</h2>
            <p className="text-lg mb-8 text-blue-100">
              Get a free systems audit. We'll identify the highest-leverage automation or system to build first.
            </p>
            <a
              href="/#inquiry"
              className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition shadow-lg"
            >
              Get Your Free Audit
            </a>
          </div>
        </section>

        <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-sm text-gray-400">© 2026 Cod3Black Agency. Done-for-you AI business systems.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
