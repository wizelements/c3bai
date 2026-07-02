'use client';

import Link from 'next/link';
import {
  ExternalLink,
  ArrowRight,
  Check,
  Zap,
  Calendar,
  Mail,
  BarChart3,
  Bot,
} from 'lucide-react';
import InquiryForm from './inquiry-form';

const projects = [
  {
    name: 'Taste of Gratitude',
    description:
      'Wellness beverage brand with weekly menu system, e-commerce, market funnel, and order alert automations.',
    stats: ['E-commerce + menu', 'Order alerts', 'Market funnel'],
    url: 'https://tasteofgratitude.shop',
    tags: ['Next.js', 'Stripe', 'Square', 'SMS'],
  },
  {
    name: 'Atlanta Saddle Club',
    description:
      'Nonprofit community site with events calendar, gallery, member intake, and admin content controls.',
    stats: ['Events + calendar', 'Member intake', 'Admin dashboard'],
    url: 'https://asca-pwa.vercel.app',
    tags: ['Next.js', 'Turso', 'Admin'],
  },
  {
    name: 'She Drives Smart',
    description:
      'Survey-driven brand funnel that qualifies leads and routes them into the right offer automatically.',
    stats: ['Lead qualification', 'Auto-routing', 'Brand system'],
    url: '#',
    tags: ['Funnel', 'Automation', 'Brand'],
  },
  {
    name: 'Gratog',
    description:
      'E-commerce and marketplace platform with payments, SMS, admin controls, and operations dashboards.',
    stats: ['Payments', 'Operations', 'Dashboard'],
    url: 'https://gratog.vercel.app',
    tags: ['Next.js', 'Square', 'Twilio', 'Sentry'],
  },
];

const systems = [
  {
    icon: Bot,
    title: 'AI Workflows',
    description:
      'Automate repetitive tasks: lead follow-up, intake, content drafts, report generation, and customer support.',
  },
  {
    icon: Calendar,
    title: 'Booking & Scheduling',
    description:
      'Online booking, appointment scheduling, calendar sync, and automated reminders for service providers.',
  },
  {
    icon: Mail,
    title: 'Funnels & Email Capture',
    description:
      'Landing pages, lead magnets, email sequences, and qualification flows that turn visitors into customers.',
  },
  {
    icon: BarChart3,
    title: 'Admin Dashboards',
    description:
      'Custom internal tools to manage customers, orders, members, content, and operations in one place.',
  },
];

const packages = [
  {
    name: 'Starter System',
    price: '$1,500 – $2,500',
    description: 'Website + one funnel + contact/booking + basic automation.',
    features: [
      'Responsive website (5–7 pages)',
      'Lead-capture or booking form',
      'Email notifications',
      'Basic automation (1–2 flows)',
      '30 days of support',
    ],
    cta: 'Get a Starter Quote',
    href: '/services',
    highlighted: false,
  },
  {
    name: 'Growth System',
    price: '$4,000 – $6,000',
    description:
      'Website + admin dashboard + payments/booking + automation + AI workflow setup.',
    features: [
      'Everything in Starter',
      'Custom admin dashboard',
      'Payments or booking checkout',
      '3–5 automations + 1 AI workflow',
      '90 days of support',
    ],
    cta: 'Get a Growth Quote',
    href: '/services',
    highlighted: true,
  },
  {
    name: 'Automation Retainer',
    price: '$500 – $1,500/mo',
    description:
      'Ongoing optimization, new automations, monthly reports, and priority support.',
    features: [
      'Monthly optimization sprint',
      'New automation each month',
      'Performance report',
      'Priority bug fixes',
      'Quarterly strategy review',
    ],
    cta: 'Start a Retainer',
    href: '/services',
    highlighted: false,
  },
];

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <Zap size={28} className="text-blue-600" />
            Cod3Black
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#systems" className="text-gray-700 hover:text-blue-600 transition">Systems</a>
            <a href="#projects" className="text-gray-700 hover:text-blue-600 transition">Projects</a>
            <Link href="/services" className="text-gray-700 hover:text-blue-600 transition">Services</Link>
            <a href="#inquiry" className="text-gray-700 hover:text-blue-600 transition">Get Started</a>
          </div>
        </div>
      </nav>

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white pt-20 pb-32 px-4 sm:px-6">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full opacity-10 blur-3xl"></div>
          </div>

          <div className="relative max-w-5xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-blue-500 bg-opacity-30 border border-blue-300 rounded-full text-sm font-semibold">
              Done-for-you AI business systems
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              Stop Manually Chasing Customers
            </h1>

            <p className="text-lg sm:text-xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Cod3Black Agency installs the website, funnel, admin dashboard, automation, and AI workflow that lets your business capture leads, take orders, and manage operations while you sleep.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <a
                href="#inquiry"
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition shadow-lg inline-flex items-center justify-center gap-2"
              >
                Get Your Free Systems Audit <ArrowRight size={20} />
              </a>
              <Link
                href="/services"
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-blue-500 transition inline-flex items-center justify-center gap-2"
              >
                See Packages <ExternalLink size={20} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {packages.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 hover:border-opacity-40 transition ${pkg.highlighted ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}`}
                >
                  <div className="text-xs text-blue-200 mb-2">{pkg.name}</div>
                  <div className="text-3xl font-bold mb-2">{pkg.price}</div>
                  <div className="text-sm text-blue-100">{pkg.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Systems We Install */}
        <section id="systems" className="py-24 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">The Systems We Install</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We don't just build websites. We build the connected systems that run your business.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {systems.map((system, idx) => {
                const Icon = system.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition border border-gray-200"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{system.title}</h3>
                    <p className="text-gray-600">{system.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 px-4 sm:px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Real Systems We've Built</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Proof of work for food brands, nonprofits, service providers, and creators.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {projects.map((project, idx) => (
                <a
                  key={idx}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-600 hover:shadow-xl transition cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                      {project.name}
                    </h3>
                    {project.url !== '#' && (
                      <ExternalLink size={20} className="text-gray-400 group-hover:text-blue-600 transition" />
                    )}
                  </div>

                  <p className="text-gray-600 mb-6 line-clamp-2">{project.description}</p>

                  <div className="space-y-3 mb-6">
                    {project.stats.map((stat, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check size={16} className="text-green-600 flex-shrink-0" />
                        <span className="font-medium">{stat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/docs/projects"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-lg"
              >
                Read Full Case Studies <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* Inquiry Form Section */}
        <section id="inquiry" className="py-24 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Get Your Free Systems Audit</h2>
              <p className="text-lg text-gray-600">
                Tell us about your business. We'll identify the highest-leverage system to build or automate first.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12">
              <InquiryForm />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Zap size={20} className="text-blue-400" />
                  Cod3Black
                </h4>
                <p className="text-sm text-gray-400">Done-for-you AI business systems for small businesses and creators.</p>
              </div>
              <div>
                <h5 className="text-white font-semibold mb-4">Quick Links</h5>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#systems" className="text-gray-400 hover:text-white transition">Systems</a>
                  </li>
                  <li>
                    <a href="#projects" className="text-gray-400 hover:text-white transition">Projects</a>
                  </li>
                  <li>
                    <Link href="/services" className="text-gray-400 hover:text-white transition">Services</Link>
                  </li>
                  <li>
                    <a href="#inquiry" className="text-gray-400 hover:text-white transition">Get Started</a>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="text-white font-semibold mb-4">Resources</h5>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/docs/web-design" className="text-gray-400 hover:text-white transition">Web Design</Link>
                  </li>
                  <li>
                    <Link href="/docs/mobile-apps" className="text-gray-400 hover:text-white transition">Mobile Apps</Link>
                  </li>
                  <li>
                    <Link href="/docs/projects" className="text-gray-400 hover:text-white transition">Case Studies</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="text-white font-semibold mb-4">Contact</h5>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="mailto:hello@c3bai.com" className="text-blue-400 hover:text-blue-300 transition">hello@c3bai.com</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
              <p>© 2026 Cod3Black Agency. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
