import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Eye,
  History,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from 'lucide-react';
import PilotQualificationForm from './PilotQualificationForm';

export const metadata = {
  title: 'Intelligent Environment Automation Pilot | Cod3Black',
  description:
    'A qualification-only pilot for governed AI automation across supported Google Home environments, properties, offices, and operational spaces.',
  robots: {
    index: false,
    follow: false,
  },
};

const useCases = [
  'Property and short-term-rental operational checks',
  'Office or retail opening/closing verification',
  'Environmental and equipment-state monitoring',
  'Multi-location owner/operator visibility',
  'Evidence-backed alerts and exception handling',
  'Governed device workflows after separate action certification',
];

const process = [
  ['1', 'Qualify', 'Confirm ownership, platform eligibility, devices, desired outcomes, and safety boundaries.'],
  ['2', 'Audit', 'Map the environment, permissions, supported telemetry, risks, and highest-value workflows.'],
  ['3', 'Implement', 'Connect approved adapters and build policy-gated workflows with evidence and verification.'],
  ['4', 'Operate', 'Monitor health, failures, drift, and recurring operational checks through Managed AgentOps.'],
];

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-white">Cod3Black</span>
        </Link>
        <Link href="/services" className="text-sm text-slate-400 hover:text-white transition">
          Services
        </Link>
      </div>
    </nav>
  );
}

export default function IntelligentEnvironmentsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Nav />

      <section className="relative pt-36 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[680px] h-[420px] bg-cyan-500/10 rounded-full blur-[130px]" />
        <div className="relative max-w-5xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full glass text-sm font-medium text-cyan-300">
              <Sparkles size={16} />
              Qualification-only Early Access pilot
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.05]">
              Governed AI for
              <br />
              <span className="text-gradient">real environments.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed mb-8">
              Cod3Black evaluates and builds controlled agent workflows for supported homes, properties, offices, and operational spaces—starting read-only and proving every capability before device control is enabled.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-slate-300">$500 readiness audit</span>
              <span className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-slate-300">Implementation from $1,500</span>
              <span className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-slate-300">Managed AgentOps from $250/mo</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="text-sm font-semibold text-cyan-300 uppercase tracking-wider mb-4">What we verify first</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Observe first. Control later.</h2>
            <div className="grid gap-4">
              {[
                [Eye, 'Structure & device discovery', 'Confirm exactly which homes, rooms, devices, traits, and resources are exposed.'],
                [SlidersHorizontal, 'Real-time state', 'Verify connectivity and current device states before automating decisions.'],
                [History, 'Historical evidence', 'Use supported event/state history to understand what happened and validate workflows.'],
                [ShieldCheck, 'Policy and approval boundaries', 'Keep sensitive or unsupported actions denied until separately authorized and certified.'],
              ].map(([Icon, title, description]) => (
                <div key={title} className="glass-card rounded-xl p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={19} className="text-cyan-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{title}</h3>
                    <p className="text-sm text-slate-400">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-7">
            <h3 className="text-xl font-bold text-white mb-4">Current pilot boundary</h3>
            <p className="text-slate-400 mb-5">
              Google Home MCP is currently Early Access. We qualify the actual account and device environment before committing to implementation.
            </p>
            <ul className="space-y-3 text-sm text-slate-300">
              {[
                'Google Home Premium Advanced is currently a prerequisite for supported access.',
                'Google documents occasional latency and experimental traits.',
                'Home MCP does not currently create or manage Google Home-native automations.',
                'Sensitive actions such as door unlocking are blocked upstream.',
                'Household/property authorization and consent are required where applicable.',
                'No physical control is enabled during the initial read-only certification.',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <Check size={17} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Where this can create value</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We prioritize environments where missed checks, repetitive monitoring, or slow response create real operational cost.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((item) => (
              <div key={item} className="glass-card rounded-xl p-5 text-sm text-slate-300 flex gap-3">
                <Check size={17} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-5">
            {process.map(([step, title, description]) => (
              <div key={step} className="glass-card rounded-xl p-5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 text-white flex items-center justify-center font-bold mb-4">
                  {step}
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-sm font-semibold text-cyan-300 uppercase tracking-wider mb-3">Pilot intake</div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-5">See if your environment qualifies</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Submit the current setup and outcome you want. We review fit before recommending a paid audit or implementation.
            </p>
          </div>
          <PilotQualificationForm />
        </div>
      </section>

      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-slate-500 mb-4">
            Need a broader AI or automation system instead?
          </p>
          <Link href="/services" className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 font-medium">
            View Cod3Black services <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
