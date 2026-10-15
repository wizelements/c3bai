'use client';

import { useState } from 'react';
import { CheckCircle, Loader2, ShieldCheck } from 'lucide-react';

const initialForm = {
  name: '',
  email: '',
  company: '',
  environmentType: '',
  googleHomeStatus: '',
  deviceSummary: '',
  desiredOutcome: '',
  timeline: '',
  budgetRange: '',
  authorizationConfirmed: false,
};

export default function PilotQualificationForm() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!formData.authorizationConfirmed) {
      setError('Please confirm you are authorized to evaluate the property or environment.');
      return;
    }

    if (!formData.name || !formData.email || !formData.environmentType || !formData.deviceSummary || !formData.desiredOutcome) {
      setError('Please complete the required fields.');
      return;
    }

    setLoading(true);

    const environmentLabel = formData.environmentType.replaceAll('-', ' ');
    const googleHomeLabel = formData.googleHomeStatus || 'not provided';
    const projectName = `Intelligent Environment Pilot — ${formData.company || formData.name}`;

    try {
      const response = await fetch('/api/start-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          projectName,
          projectType: 'automation',
          description: `Environment: ${environmentLabel}. Google Home status: ${googleHomeLabel}. Current devices/setup: ${formData.deviceSummary}`,
          desiredOutcome: formData.desiredOutcome,
          timeline: formData.timeline,
          budgetRange: formData.budgetRange,
          referralSource: 'intelligent-environment-pilot',
          additionalInfo: 'Qualification-only pilot. Applicant confirmed authority to evaluate the environment. Google Home MCP is Early Access; supported scope must be verified before implementation.',
          source: 'intelligent-environment-pilot',
          sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.error || 'We could not submit your request. Please try again.');
        return;
      }

      setResult(data);
      setSubmitted(true);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="text-green-400" size={28} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Pilot qualification received</h3>
        <p className="text-slate-400 mb-4">
          We will review the environment, device mix, and current Google Home eligibility before quoting implementation.
        </p>
        {result?.requestId && (
          <p className="text-sm text-slate-500">
            Reference: <code className="text-cyan-300">{result.requestId}</code>
          </p>
        )}
        <p className="text-xs text-slate-500 mt-5">
          Submission does not guarantee Google Home MCP eligibility or device-control support.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-5">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-400/5 border border-cyan-400/10">
        <ShieldCheck className="text-cyan-300 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <div className="text-sm font-semibold text-slate-200">Qualification first</div>
          <p className="text-xs text-slate-500 mt-1">
            We verify account eligibility, supported devices, permissions, and safety boundaries before implementation.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-300">Name *</span>
          <input name="name" value={formData.name} onChange={handleChange} className="w-full" required />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-300">Email *</span>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full" required />
        </label>
      </div>

      <label className="space-y-1.5 block">
        <span className="text-sm font-medium text-slate-300">Business / property name</span>
        <input name="company" value={formData.company} onChange={handleChange} className="w-full" />
      </label>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-300">Environment *</span>
          <select name="environmentType" value={formData.environmentType} onChange={handleChange} className="w-full" required>
            <option value="">Select...</option>
            <option value="short-term-rental">Short-term rental / property</option>
            <option value="office">Office</option>
            <option value="retail">Retail / storefront</option>
            <option value="residential">Residential</option>
            <option value="multi-location">Multi-location operation</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-300">Google Home status</span>
          <select name="googleHomeStatus" value={formData.googleHomeStatus} onChange={handleChange} className="w-full">
            <option value="">Select...</option>
            <option value="premium-advanced">Google Home Premium Advanced</option>
            <option value="google-home-plan-unknown">Google Home — plan not sure</option>
            <option value="not-set-up">Not set up yet</option>
            <option value="different-platform">Different smart-home platform</option>
          </select>
        </label>
      </div>

      <label className="space-y-1.5 block">
        <span className="text-sm font-medium text-slate-300">Current devices and setup *</span>
        <textarea
          name="deviceSummary"
          value={formData.deviceSummary}
          onChange={handleChange}
          rows={3}
          className="w-full resize-y"
          placeholder="Example: 3 Nest cameras, 8 lights, 2 thermostats across one property..."
          required
        />
      </label>

      <label className="space-y-1.5 block">
        <span className="text-sm font-medium text-slate-300">Operational outcome *</span>
        <textarea
          name="desiredOutcome"
          value={formData.desiredOutcome}
          onChange={handleChange}
          rows={3}
          className="w-full resize-y"
          placeholder="What should become easier, safer, faster, or more measurable?"
          required
        />
      </label>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-300">Timeline</span>
          <select name="timeline" value={formData.timeline} onChange={handleChange} className="w-full">
            <option value="">Select...</option>
            <option value="asap">ASAP</option>
            <option value="1-month">Within a month</option>
            <option value="1-3-months">1–3 months</option>
            <option value="exploring">Exploring</option>
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-300">Implementation budget</span>
          <select name="budgetRange" value={formData.budgetRange} onChange={handleChange} className="w-full">
            <option value="">Select...</option>
            <option value="under-2500">Under $2,500</option>
            <option value="2500-5000">$2,500–$5,000</option>
            <option value="5000-10000">$5,000–$10,000</option>
            <option value="10000-plus">$10,000+</option>
            <option value="not-sure">Not sure yet</option>
          </select>
        </label>
      </div>

      <label className="flex items-start gap-3 text-sm text-slate-400">
        <input
          type="checkbox"
          name="authorizationConfirmed"
          checked={formData.authorizationConfirmed}
          onChange={handleChange}
          className="mt-1"
          required
        />
        <span>
          I control, own, manage, or am otherwise authorized to evaluate this property/environment and its connected devices. *
        </span>
      </label>

      {error && (
        <div className="text-sm text-red-300 bg-red-400/5 border border-red-400/10 rounded-lg p-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3.5 bg-gradient-to-r from-cyan-400 to-cyan-500 text-[#0a0a0f] rounded-xl font-bold hover:shadow-[0_0_40px_rgba(34,211,238,0.28)] transition disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading ? <><Loader2 size={18} className="animate-spin" /> Submitting…</> : 'Request Pilot Qualification'}
      </button>

      <p className="text-xs text-slate-500 text-center">
        Qualification is free. A full Environment Automation Readiness Audit is $500 when the scope is a fit.
      </p>
    </form>
  );
}
