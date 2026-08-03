'use client';

import InquiryForm from '../inquiry-form';
import { TrendingUp } from 'lucide-react';

export default function AuditSection() {
  return (
    <section id="audit" className="py-28 px-4 sm:px-6 bg-[#0a0a0f] relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full glass text-sm font-medium text-cyan-300">
            <TrendingUp size={16} />
            Free revenue systems audit
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
            Get your free revenue systems audit
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Tell us about your business. We will identify the highest-leverage system to build or automate first — no pitch, no pressure.
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
