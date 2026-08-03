'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
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
              Done-for-you AI revenue systems for food, retail, and service businesses.
            </p>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#offers" className="hover:text-cyan-300 transition">Offers</a></li>
              <li><a href="#case-study" className="hover:text-cyan-300 transition">Case Study</a></li>
              <li><Link href="/services" className="hover:text-cyan-300 transition">Services</Link></li>
              <li><a href="#audit" className="hover:text-cyan-300 transition">Free Audit</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-4">Resources</h5>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/docs/projects" className="hover:text-cyan-300 transition">Case Studies</Link></li>
              <li><Link href="/docs/web-design" className="hover:text-cyan-300 transition">Web Design</Link></li>
              <li><Link href="/docs/mobile-apps" className="hover:text-cyan-300 transition">Mobile Apps</Link></li>
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
