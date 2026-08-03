'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Nav() {
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
          <a href="#offers" className="text-slate-400 hover:text-white transition">Offers</a>
          <a href="#case-study" className="text-slate-400 hover:text-white transition">Case Study</a>
          <Link href="/services" className="text-slate-400 hover:text-white transition">Services</Link>
          <a
            href="#audit"
            className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-[#0a0a0f] rounded-lg hover:opacity-90 transition font-semibold"
          >
            Free Audit
          </a>
        </div>
      </div>
    </nav>
  );
}
