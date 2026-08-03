'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, Users, DollarSign, Bot } from 'lucide-react';

const proofPoints = [
  { icon: DollarSign, label: 'Square payments', value: 'Live orders' },
  { icon: Bot, label: 'Telegram alerts', value: 'Instant ops' },
  { icon: TrendingUp, label: 'Daily reports', value: 'No guesswork' },
  { icon: Users, label: 'Built for Gratog', value: 'Real case study' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f] pt-24 pb-16 px-4 sm:px-6">
      <div className="absolute inset-0 bg-grid opacity-50"></div>
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-glow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] animate-pulse-glow"></div>

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full glass text-sm font-medium text-cyan-300">
          <Sparkles size={16} />
          Done-for-you AI revenue systems
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.05]">
          AI revenue systems
          <br />
          <span className="text-gradient">built for small businesses.</span>
        </h1>

        <p className="text-lg sm:text-xl mb-12 text-slate-400 max-w-2xl mx-auto leading-relaxed">
          We install the client acquisition, payment, and operations system that lets food, retail, and service businesses capture leads, take orders, and follow up automatically — without hiring a tech team.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <a
            href="#audit"
            className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-[#0a0a0f] font-bold rounded-xl hover:shadow-[0_0_40px_rgba(168,85,247,0.35)] transition inline-flex items-center justify-center gap-2 text-lg"
          >
            Get Your Free Revenue Systems Audit <ArrowRight size={20} />
          </a>
          <Link
            href="/services"
            className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition inline-flex items-center justify-center gap-2"
          >
            See the Offer Ladder
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16">
          {proofPoints.map((point) => {
            const Icon = point.icon;
            return (
              <div key={point.label} className="glass-card rounded-xl p-5 text-center">
                <Icon className="w-6 h-6 text-cyan-300 mx-auto mb-3" />
                <div className="text-sm font-bold text-white">{point.value}</div>
                <div className="text-xs text-slate-500">{point.label}</div>
              </div>
            );
          })}
        </div>


        <p className="text-sm text-slate-500">
          Living proof:{' '}
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
    </section>
  );
}
