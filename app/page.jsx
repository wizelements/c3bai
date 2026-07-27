'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Zap,
  Calendar,
  Mail,
  BarChart3,
  Bot,
  Sparkles,
  TrendingUp,
  Users,
  ExternalLink,
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
    url: '/docs/projects',
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
      'Customer/member/orders database',
      'Analytics + conversion tracking setup',
      '90 days of support',
    ],
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
    highlighted: false,
  },
];

const socialProof = [
  { number: '4+', label: 'Systems shipped' },
  { number: '$0', label: 'Starting infra cost' },
  { number: '24h', label: 'First response' },
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
          <a href="#systems" className="text-slate-400 hover:text-white transition">Systems</a>
          <a href="#projects" className="text-slate-400 hover:text-white transition">Projects</a>
          <Link href="/services" className="text-slate-400 hover:text-white transition">Services</Link>
          <Link
            href="/start-project"
            className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-[#0a0a0f] rounded-lg hover:opacity-90 transition font-semibold"
          >
            Start Project
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f] pt-24 pb-16 px-4 sm:px-6">
      <div className="absolute inset-0 bg-grid opacity-50"></div>
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-glow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] animate-pulse-glow"></div>

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full glass text-sm font-medium text-cyan-300">
          <Sparkles size={16} />
          Done-for-you AI business systems
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.05]">
          Stop manually
          <br />
          <span className="text-gradient">chasing customers.</span>
        </h1>

        <p className="text-lg sm:text-xl mb-12 text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Cod3Black Agency installs the website, funnel, admin dashboard, automation, and AI workflow that lets your business capture leads, take orders, and manage operations while you sleep.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <a
            href="/start-project"
            className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-[#0a0a0f] font-bold rounded-xl hover:shadow-[0_0_40px_rgba(168,85,247,0.35)] transition inline-flex items-center justify-center gap-2 text-lg"
          >
            Start Your Project <ArrowRight size={20} />
          </a>
          <a
            href="#inquiry"
            className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition inline-flex items-center justify-center gap-2"
          >
            Get Your Free Systems Audit
          </a>
          <Link
            href="/services"
            className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition inline-flex items-center justify-center gap-2"
          >
            See Packages
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-16">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`glass-card rounded-xl p-5 text-left ${pkg.highlighted ? 'ring-1 ring-cyan-400/40' : ''}`}
            >
              <div className="text-xs text-slate-400 mb-1">{pkg.name}</div>
              <div className="text-lg font-bold text-white mb-1">{pkg.price}</div>
              <div className="text-xs text-slate-500 line-clamp-2">{pkg.description}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-12">
          {socialProof.map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white">{item.number}</div>
              <div className="text-sm text-slate-500">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SystemsSection() {
  return (
    <section id="systems" className="py-28 px-4 sm:px-6 bg-[#0a0a0f] relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">The systems we install</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            We don't just build websites. We build connected systems that run your business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {systems.map((system, idx) => {
            const Icon = system.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl p-8 hover:border-cyan-400/30 hover:bg-white/[0.04] transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-5 ring-1 ring-white/10">
                  <Icon className="w-6 h-6 text-cyan-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{system.title}</h3>
                <p className="text-slate-400 leading-relaxed">{system.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="py-28 px-4 sm:px-6 bg-[#0a0a0f] relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">Real systems we've built</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Proof of work for food brands, nonprofits, service providers, and creators.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {projects.map((project, idx) => {
            const isExternal = project.url.startsWith('http');
            return (
              <a
                key={idx}
                href={project.url}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="group glass-card rounded-2xl p-8 hover:border-cyan-400/30 hover:bg-white/[0.04] transition"
              >
                <div className="flex justify-between items-start mb-5">
                  <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition">
                    {project.name}
                  </h3>
                  {isExternal && (
                    <ExternalLink size={18} className="text-slate-500 group-hover:text-cyan-300 transition" />
                  )}
                </div>

                <p className="text-slate-400 mb-6 line-clamp-2">{project.description}</p>

                <div className="space-y-2.5 mb-6">
                  {project.stats.map((stat, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check size={16} className="text-cyan-400 flex-shrink-0" />
                      <span className="font-medium">{stat}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white/5 text-slate-300 text-xs font-medium rounded-full ring-1 ring-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/docs/projects"
            className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 font-semibold text-lg"
          >
            Read full case studies <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function InquirySection() {
  return (
    <section id="inquiry" className="py-28 px-4 sm:px-6 bg-[#0a0a0f] relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full glass text-sm font-medium text-cyan-300">
            <TrendingUp size={16} />
            Free systems audit
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">Get your free systems audit</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Tell us about your business. We'll identify the highest-leverage system to build or automate first.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-2">
          <div className="bg-[#0a0a0f] rounded-xl p-6 sm:p-10">
            <InquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0a0a0f] border-t border-white/10 py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">Cod3Black</span>
            </div>
            <p className="text-slate-400 max-w-sm">
              Done-for-you AI business systems for small businesses, creators, and local brands.
            </p>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#systems" className="hover:text-cyan-300 transition">Systems</a></li>
              <li><a href="#projects" className="hover:text-cyan-300 transition">Projects</a></li>
              <li><Link href="/services" className="hover:text-cyan-300 transition">Services</Link></li>
              <li><a href="#inquiry" className="hover:text-cyan-300 transition">Get Started</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-4">Resources</h5>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/docs/web-design" className="hover:text-cyan-300 transition">Web Design</Link></li>
              <li><Link href="/docs/mobile-apps" className="hover:text-cyan-300 transition">Mobile Apps</Link></li>
              <li><Link href="/docs/projects" className="hover:text-cyan-300 transition">Case Studies</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">© 2026 Cod3Black Agency. All rights reserved.</p>
          <a href="mailto:hello@c3bai.com" className="text-sm text-cyan-300 hover:text-cyan-200 transition">hello@c3bai.com</a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Nav />
      <Hero />
      <SystemsSection />
      <ProjectsSection />
      <InquirySection />
      <Footer />
    </div>
  );
}
