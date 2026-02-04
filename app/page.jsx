'use client';

import InquiryForm from './inquiry-form';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Custom Web Design, Apps & Software</h1>
          <p className="text-xl mb-8 text-blue-100">
            You're not buying API access. You're buying experienced engineering hours at fair, transparent rates.
          </p>
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-blue-700 rounded-lg p-4">
              <div className="text-3xl font-bold">$2,500</div>
              <div className="text-sm">Starter (20 hrs/mo)</div>
            </div>
            <div className="bg-blue-700 rounded-lg p-4">
              <div className="text-3xl font-bold">$7,500</div>
              <div className="text-sm">Professional (60 hrs/mo)</div>
            </div>
            <div className="bg-blue-700 rounded-lg p-4">
              <div className="text-3xl font-bold">$20K+</div>
              <div className="text-sm">Enterprise (160+ hrs/mo)</div>
            </div>
          </div>
          <p className="text-sm mt-6 text-blue-200">
            Or $65/hour for partners (referrals, relationships, early supporters)
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">What We Build</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-2">Web Design & Development</h3>
              <p className="text-gray-700">Marketing sites, portfolios, SaaS dashboards, and custom web applications.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Mobile Apps</h3>
              <p className="text-gray-700">iOS & Android apps, cross-platform development, and app store launches.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Integrations & APIs</h3>
              <p className="text-gray-700">Connect systems, third-party APIs, webhooks, and data pipelines.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">MVPs & Redesigns</h3>
              <p className="text-gray-700">Proof of concepts, existing site improvements, and tech modernization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Proof of Work */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Real Projects We've Shipped</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Beltline Golf</h3>
              <p className="text-gray-600 mb-3">Booking system with online payments, leaderboard, and digital waivers.</p>
              <p className="text-sm"><strong>Result:</strong> 3x bookings, $15K/month revenue, 4.8/5 stars</p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">TradeAlerts</h3>
              <p className="text-gray-600 mb-3">React Native app fixes, TypeScript compliance, PWA optimization.</p>
              <p className="text-sm"><strong>Result:</strong> 0 errors, 3.2s→1.1s load, 98 Lighthouse score</p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Gratog</h3>
              <p className="text-gray-600 mb-3">Project management tool with real-time collaboration and dashboard.</p>
              <p className="text-sm"><strong>Result:</strong> 90% adoption, 95% on-time tasks, 80% fewer meetings</p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Image-to-SVG</h3>
              <p className="text-gray-600 mb-3">Batch image converter with AI tracing.</p>
              <p className="text-sm"><strong>Result:</strong> 2,500 hrs work → 1 hr, saved $50K+</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <a href="/docs/PROJECTS_DEEP_DIVE.md" className="text-blue-600 hover:underline">
              Read full case studies →
            </a>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <InquiryForm />
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Learn More</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a href="/docs/BEST_PRACTICES_WEB_DESIGN.md" className="border rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="font-semibold text-lg mb-2">Web Design Guide</h3>
              <p className="text-gray-600 text-sm">Complete guide to designing and building effective websites.</p>
            </a>
            <a href="/docs/BEST_PRACTICES_MOBILE_APPS.md" className="border rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="font-semibold text-lg mb-2">Mobile Apps Guide</h3>
              <p className="text-gray-600 text-sm">How to build, launch, and monetize mobile applications.</p>
            </a>
            <a href="/docs/PROJECTS_DEEP_DIVE.md" className="border rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="font-semibold text-lg mb-2">Case Studies</h3>
              <p className="text-gray-600 text-sm">Real projects with problem, solution, and actual results.</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-semibold mb-2">Cod3Black Agency</h3>
          <p className="text-gray-400 mb-4">Custom web design, apps, and software. $125/hour transparent pricing.</p>
          <p className="text-gray-500 text-sm">
            Questions? <a href="mailto:hello@c3bai.com" className="text-blue-400 hover:underline">hello@c3bai.com</a>
          </p>
          <p className="text-gray-500 text-sm mt-8">© 2026 Cod3Black Agency. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
