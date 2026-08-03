'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Mail, Check, Loader2, Sparkles, Bot, TrendingUp, Shield } from 'lucide-react';

const benefits = [
  {
    icon: Bot,
    title: 'AI follow-up scripts',
    description: 'Turn cold leads into booked calls with the exact 5-message sequence we use for clients.',
  },
  {
    icon: TrendingUp,
    title: 'Landing page template',
    description: 'Copy the headline, bullets, and CTA structure that converts visitors into email subscribers.',
  },
  {
    icon: Sparkles,
    title: 'Prompt pack included',
    description: 'Get 5+ ready-to-run AI prompts for acquisition, follow-up, copy, email, and social proof.',
  },
  {
    icon: Shield,
    title: 'Built for small business',
    description: 'No enterprise jargon. Designed for food, retail, and service owners with limited tech help.',
  },
];

export default function LeadMagnetPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setMessage(data.message || 'Check your inbox for the download link.');
    } catch (err) {
      setStatus('error');
      setMessage(err?.message || 'Something went wrong. Please try again.');
    }
  }

  const pdfUrl = '/downloads/ai-client-acquisition-playbook.pdf';
  const mdUrl = '/downloads/ai-client-acquisition-playbook.md';
  const txtUrl = '/downloads/ai-client-acquisition-playbook.txt';
  const promptUrl = '/downloads/prompt-pack.md';

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-300 transition mb-10"
        >
          <ArrowLeft size={16} />
          Back to c3bai
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full glass text-sm font-medium text-cyan-300">
            <Sparkles size={16} />
            Free resource
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
            AI Client Acquisition Playbook
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The exact checklist, prompts, and follow-up system we use to turn a local business website into a 24/7 lead-capture machine.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="glass-card rounded-xl p-5 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 ring-1 ring-white/10">
                  <Icon className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {status === 'success' ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5 ring-1 ring-green-500/30">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">You are in — check your inbox.</h2>
            <p className="text-slate-400 mb-8">{message}</p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a
                href={pdfUrl}
                download
                className="px-6 py-3.5 bg-gradient-to-r from-cyan-400 to-purple-500 text-[#0a0a0f] font-bold rounded-xl hover:shadow-[0_0_40px_rgba(168,85,247,0.35)] transition inline-flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download PDF
              </a>
              <a
                href={mdUrl}
                download
                className="px-6 py-3.5 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition inline-flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download Markdown
              </a>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 text-left">
              <h3 className="font-semibold text-white mb-3">Also grab the prompt pack</h3>
              <p className="text-sm text-slate-400 mb-4">
                5+ ready-to-use AI prompts for client acquisition, follow-up, landing page copy, email sequences, and social proof collection.
              </p>
              <a
                href={promptUrl}
                download
                className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 font-medium"
              >
                <Download size={16} />
                Download Prompt Pack (.md)
              </a>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="glass-card rounded-2xl p-6 sm:p-10"
            aria-label="Lead magnet download form"
          >
            <div className="mb-6">
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-2">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="Alex"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email address <span className="text-cyan-300">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="alex@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12"
                />
              </div>
            </div>

            {status === 'error' && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-[#0a0a0f] font-bold rounded-xl hover:shadow-[0_0_40px_rgba(168,85,247,0.35)] transition inline-flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {status === 'loading' ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending your copy...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Download size={18} />
                  Get the free playbook
                </span>
              )}
            </button>

            <p className="mt-4 text-xs text-slate-500 text-center">
              No spam. Unsubscribe anytime. We use your email only to deliver this resource and occasional updates.
            </p>
          </form>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            Living case study:{' '}
            <a
              href="https://tasteofgratitude.shop"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:text-cyan-200"
            >
              tasteofgratitude.shop
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
