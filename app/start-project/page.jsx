'use client';

import { useState } from 'react';
import { CheckCircle, ArrowRight, Zap, Loader2 } from 'lucide-react';

const projectTypes = [
  { value: 'website', label: 'Website' },
  { value: 'web-app', label: 'Web Application' },
  { value: 'ecommerce', label: 'E-commerce / Online Store' },
  { value: 'funnel', label: 'Sales Funnel / Landing Page' },
  { value: 'automation', label: 'Automation / AI Workflow' },
  { value: 'dashboard', label: 'Admin Dashboard' },
  { value: 'redesign', label: 'Redesign / Refresh' },
  { value: 'integration', label: 'Integration / API' },
  { value: 'other', label: 'Something else' },
];

const budgetRanges = [
  { value: 'under-2500', label: 'Under $2,500' },
  { value: '2500-5000', label: '$2,500 – $5,000' },
  { value: '5000-10000', label: '$5,000 – $10,000' },
  { value: '10000-plus', label: '$10,000+' },
  { value: 'not-sure', label: 'Not sure yet' },
];

const timelineOptions = [
  { value: 'asap', label: 'ASAP — within 2 weeks' },
  { value: '1-month', label: 'Within a month' },
  { value: '1-3-months', label: '1–3 months' },
  { value: '3-plus', label: '3+ months' },
  { value: 'exploring', label: 'Just exploring options' },
];

const referralSources = [
  { value: 'search', label: 'Google / Search' },
  { value: 'social', label: 'Social media' },
  { value: 'referral', label: 'Referred by someone' },
  { value: 'previous', label: 'Previous client' },
  { value: 'other', label: 'Other' },
];

export default function StartProjectPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    projectName: '',
    projectType: '',
    description: '',
    desiredOutcome: '',
    currentWebsite: '',
    timeline: '',
    budgetRange: '',
    referralSource: '',
    name: '',
    email: '',
    company: '',
    phone: '',
    additionalInfo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateStep = (s) => {
    const errs = {};
    if (s === 1) {
      if (!formData.projectName.trim()) errs.projectName = 'Project name is required';
      if (!formData.description.trim() || formData.description.trim().length < 10)
        errs.description = 'Please describe your project in at least 10 characters';
    }
    if (s === 2) {
      if (!formData.name.trim()) errs.name = 'Your name is required';
      if (!formData.email.trim()) errs.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        errs.email = 'Please enter a valid email';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    setLoading(true);

    try {
      const response = await fetch('/api/start-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'web',
          sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setResult(data);
        setSubmitted(true);
      } else {
        setErrors({ form: data.error || 'Something went wrong. Please try again.' });
      }
    } catch (err) {
      setErrors({ form: 'Network error. Please check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <div className="max-w-lg w-full glass-card rounded-2xl p-8 sm:p-12 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Request received ✓
          </h1>
          <p className="text-slate-400 mb-6 leading-relaxed">
            Thanks, {formData.name.split(' ')[0] || 'there'}. We received your request for{' '}
            <strong className="text-slate-200">{formData.projectName}</strong>.
            We review every request personally and will follow up within 24 hours.
          </p>
          {result?.requestId && (
            <p className="text-sm text-slate-500 mb-6">
              Reference: <code className="text-cyan-400 bg-cyan-400/5 px-2 py-0.5 rounded">{result.requestId}</code>
            </p>
          )}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 text-left mb-8">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
              What happens next
            </h3>
            <ol className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold mt-0.5">1.</span>
                <span>We review your project details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold mt-0.5">2.</span>
                <span>We may reach out with clarifying questions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold mt-0.5">3.</span>
                <span>We prepare a scope and proposal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold mt-0.5">4.</span>
                <span>You review and approve</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold mt-0.5">5.</span>
                <span>We build your system</span>
              </li>
            </ol>
          </div>
          {!result?.emailSent && (
            <p className="text-xs text-yellow-500/80 bg-yellow-400/5 border border-yellow-400/10 rounded-lg p-3">
              Note: We could not send a confirmation email right now, but your request is saved.
              We will follow up within 24 hours.
            </p>
          )}
          <a
            href="/"
            className="inline-flex items-center gap-2 mt-6 text-cyan-400 hover:text-cyan-300 font-medium transition"
          >
            Back to home <ArrowRight size={16} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-white">Cod3Black</span>
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Progress */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                    s < step
                      ? 'bg-cyan-400 text-[#0a0a0f]'
                      : s === step
                        ? 'bg-cyan-400/20 border-2 border-cyan-400 text-cyan-400'
                        : 'bg-white/5 border border-white/10 text-slate-500'
                  }`}
                >
                  {s < step ? <CheckCircle size={16} /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition ${
                      s < step ? 'bg-cyan-400' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-500 px-1">
            <span>Project details</span>
            <span>Your info</span>
            <span>Review & submit</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Project Details */}
          {step === 1 && (
            <div className="animate-fadeIn space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Tell us about your project
                </h1>
                <p className="text-slate-400">
                  The more detail you share, the better we can prepare.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Project name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="e.g. My Business Website"
                  className="w-full"
                />
                {errors.projectName && (
                  <p className="text-red-400 text-xs mt-1">{errors.projectName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  What type of project is this?
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full"
                >
                  <option value="">Select a type...</option>
                  {projectTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Describe your project <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="What do you need built? What should it do? Who is it for?"
                  className="w-full resize-y"
                />
                {errors.description && (
                  <p className="text-red-400 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  What outcome are you looking for?
                </label>
                <textarea
                  name="desiredOutcome"
                  value={formData.desiredOutcome}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g. Get more bookings, sell products online, automate follow-ups..."
                  className="w-full resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Do you have an existing website or platform?
                </label>
                <input
                  type="text"
                  name="currentWebsite"
                  value={formData.currentWebsite}
                  onChange={handleChange}
                  placeholder="e.g. https://mycurrentsite.com"
                  className="w-full"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Timeline
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full"
                  >
                    <option value="">Select...</option>
                    {timelineOptions.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Budget range
                  </label>
                  <select
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleChange}
                    className="w-full"
                  >
                    <option value="">Select...</option>
                    {budgetRanges.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Your Info */}
          {step === 2 && (
            <div className="animate-fadeIn space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  How can we reach you?
                </h1>
                <p className="text-slate-400">
                  We will follow up within 24 hours to discuss your project.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Your name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    className="w-full"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Company / Business name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="My Business LLC"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  How did you hear about us?
                </label>
                <select
                  name="referralSource"
                  value={formData.referralSource}
                  onChange={handleChange}
                  className="w-full"
                >
                  <option value="">Select...</option>
                  {referralSources.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Anything else we should know?
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Technical requirements, design preferences, existing materials..."
                  className="w-full resize-y"
                />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="animate-fadeIn space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Review your request
                </h1>
                <p className="text-slate-400">
                  Please review before submitting. You can go back to make changes.
                </p>
              </div>

              <div className="glass-card rounded-xl p-6 space-y-4">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                    Project
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">Name:</span>{' '}
                      <span className="text-slate-200">{formData.projectName}</span>
                    </div>
                    {formData.projectType && (
                      <div>
                        <span className="text-slate-500">Type:</span>{' '}
                        <span className="text-slate-200 capitalize">
                          {projectTypes.find((t) => t.value === formData.projectType)?.label || formData.projectType}
                        </span>
                      </div>
                    )}
                    {formData.timeline && (
                      <div>
                        <span className="text-slate-500">Timeline:</span>{' '}
                        <span className="text-slate-200">
                          {timelineOptions.find((t) => t.value === formData.timeline)?.label || formData.timeline}
                        </span>
                      </div>
                    )}
                    {formData.budgetRange && (
                      <div>
                        <span className="text-slate-500">Budget:</span>{' '}
                        <span className="text-slate-200">
                          {budgetRanges.find((b) => b.value === formData.budgetRange)?.label || formData.budgetRange}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                    Contact
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">Name:</span>{' '}
                      <span className="text-slate-200">{formData.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Email:</span>{' '}
                      <span className="text-slate-200">{formData.email}</span>
                    </div>
                    {formData.company && (
                      <div>
                        <span className="text-slate-500">Company:</span>{' '}
                        <span className="text-slate-200">{formData.company}</span>
                      </div>
                    )}
                    {formData.phone && (
                      <div>
                        <span className="text-slate-500">Phone:</span>{' '}
                        <span className="text-slate-200">{formData.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {errors.form && (
                <div className="bg-red-400/5 border border-red-400/10 rounded-lg p-4 text-red-400 text-sm">
                  {errors.form}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-[#0a0a0f] font-bold text-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit project request <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition font-medium"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            {step < 3 && (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 rounded-xl bg-cyan-400 text-[#0a0a0f] font-bold hover:bg-cyan-300 transition flex items-center gap-2"
              >
                Continue <ArrowRight size={18} />
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
