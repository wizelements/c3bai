/**
 * Cod3Black Agency Project Inquiry Form
 * 
 * Purpose: Collect structured project information for fair, transparent pricing
 * Features:
 * - Multi-section form for custom web design, apps, and software projects
 * - Works for non-technical founders and experienced teams
 * - Automatic scope estimation and rough pricing
 * - Mobile-responsive and PWA-ready
 * - 10-minute completion time
 */

'use client';

import { useState } from 'react';
import { CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const InquiryForm = () => {
  const [section, setSection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    // Section 1: Basics
    projectName: '',
    description: '',
    problemStatement: '',
    projectType: '', // web design, app, software, integration, mvp, redesign
    
    // Section 2: Scope Estimation
    designScope: '', // simple, moderate, complex
    integrationCount: '', // how many third-party integrations
    databaseNeeded: '', // yes/no
    integrationTypes: [], // Stripe, Slack, etc
    deploymentRequirements: [], // mobile, web, both
    
    // Section 3: Timeline & Budget
    timeline: '',
    budgetExpectation: '',
    
    // Section 4: Team & Complexity
    techStack: '',
    existingCode: '',
    teamLevel: '', // non-tech, mixed, strong-dev, enterprise
    specialRequirements: [],
    
    // Section 5: Contact
    name: '',
    email: '',
    company: '',
    website: '',
    contactMethod: '',
    additionalInfo: '',
    
    // Section 6: Partner Qualification
    partnerQualification: '',
    partnerDetails: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e, fieldName) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const currentArray = prev[fieldName] || [];
      return {
        ...prev,
        [fieldName]: checked
          ? [...currentArray, value]
          : currentArray.filter(item => item !== value)
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSection = () => {
    if (section < 6) setSection(section + 1);
  };

  const prevSection = () => {
    if (section > 1) setSection(section - 1);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-3">Thanks! We got your inquiry.</h2>
        <p className="text-lg text-gray-600 mb-4">
          We'll review your project scope and send you a preliminary estimate within 24 hours.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
          <h3 className="font-semibold mb-3">What happens next:</h3>
          <ol className="space-y-2 text-gray-700">
            <li>✓ <strong>Immediate:</strong> Auto-response email with rough scope estimate</li>
            <li>✓ <strong>Within 24 hours:</strong> We review your details and validate estimates</li>
            <li>✓ <strong>Within 48 hours:</strong> We call to confirm scope and answer questions</li>
            <li>✓ <strong>Follow-up:</strong> Formal quote via email (valid for 30 days)</li>
          </ol>
        </div>
        <p className="text-gray-600 mb-6">
          Check your email for the initial response. Questions? Reply directly or call us.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Project Inquiry</h1>
        <p className="text-gray-600 mb-4">
          Help us understand your project so we can give you an accurate estimate.
          This takes about 10 minutes.
        </p>
        
        {/* Progress indicator */}
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className={`h-2 flex-1 rounded ${
                num <= section ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Section {section} of 6
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* SECTION 1: Project Basics */}
        {section === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-semibold mb-2">
                What's your project called?
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                placeholder="e.g., Booking Platform, Mobile App, SaaS Dashboard"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                What type of project is this?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'website', label: 'Website (marketing, portfolio, content)' },
                  { value: 'web-app', label: 'Web App (dashboard, SaaS, tool)' },
                  { value: 'mobile-app', label: 'Mobile App (iOS/Android)' },
                  { value: 'integration', label: 'Integration (connecting systems)' },
                  { value: 'redesign', label: 'Redesign (existing site/app)' },
                  { value: 'mvp', label: 'MVP (proof of concept)' },
                  { value: 'other', label: 'Something else' }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="projectType"
                      value={option.value}
                      checked={formData.projectType === option.value}
                      onChange={handleInputChange}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Describe your project briefly
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="What does it do? Who uses it? (2-3 sentences)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg h-24"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                What's the core problem you're solving?
              </label>
              <input
                type="text"
                name="problemStatement"
                value={formData.problemStatement}
                onChange={handleInputChange}
                placeholder="What pain point does this solve?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />
              <p className="text-xs text-gray-600 mt-1">
                Example: "Founders waste 4 hours/week managing invoices manually"
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Tip:</strong> Clear problem statements lead to better estimates. The more detail, the more accurate our pricing.
              </p>
            </div>
          </div>
        )}

        {/* SECTION 2: Scope & Features */}
        {section === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-semibold mb-3">
                How much design work is needed?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'template', label: 'Use template/existing design (minimal design)' },
                  { value: 'moderate', label: 'Moderate design (customized layouts, colors, fonts)' },
                  { value: 'custom', label: 'Custom design (unique UI, brand identity)' },
                  { value: 'unsure', label: "Not sure yet" }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="designScope"
                      value={option.value}
                      checked={formData.designScope === option.value}
                      onChange={handleInputChange}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">
                Will this need a database or backend?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'no', label: 'No (static site, marketing page)' },
                  { value: 'simple', label: 'Simple (basic storage, forms)' },
                  { value: 'complex', label: 'Complex (user accounts, real-time data, analytics)' },
                  { value: 'unsure', label: "Not sure yet" }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="databaseNeeded"
                      value={option.value}
                      checked={formData.databaseNeeded === option.value}
                      onChange={handleInputChange}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">
                How many third-party integrations? (Stripe, Slack, APIs, etc)
              </label>
              <div className="space-y-2">
                {[
                  { value: 'none', label: 'None (standalone project)' },
                  { value: '1-2', label: '1-2 integrations' },
                  { value: '3-5', label: '3-5 integrations' },
                  { value: '5-plus', label: '5+ integrations' },
                  { value: 'unsure', label: "Not sure yet" }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="integrationCount"
                      value={option.value}
                      checked={formData.integrationCount === option.value}
                      onChange={handleInputChange}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">
                Which platforms do you need?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'web', label: 'Web (desktop & mobile browsers)' },
                  { value: 'ios', label: 'iOS app' },
                  { value: 'android', label: 'Android app' },
                  { value: 'both-mobile', label: 'Both iOS & Android' }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={formData.deploymentRequirements.includes(option.value)}
                      onChange={(e) => handleCheckboxChange(e, 'deploymentRequirements')}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">
                Any special requirements?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'compliance', label: 'Compliance/Security (HIPAA, GDPR, PCI)' },
                  { value: 'performance', label: 'Performance (fast load times, high traffic)' },
                  { value: 'seo', label: 'SEO optimization' },
                  { value: 'training', label: 'Training/Documentation' },
                  { value: 'none', label: 'None listed' }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={formData.specialRequirements.includes(option.value)}
                      onChange={(e) => handleCheckboxChange(e, 'specialRequirements')}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: Timeline & Budget */}
        {section === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-semibold mb-3">
                When do you need this?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'flexible', label: 'Flexible (no rush)' },
                  { value: '3-months', label: '3 months' },
                  { value: '6-weeks', label: '6 weeks' },
                  { value: '4-weeks', label: '4 weeks' },
                  { value: 'urgent', label: 'ASAP (2-3 weeks)' }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="timeline"
                      value={option.value}
                      checked={formData.timeline === option.value}
                      onChange={handleInputChange}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">
                What's your budget expectation?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'under-5k', label: 'Under $5,000' },
                  { value: '5k-15k', label: '$5,000 - $15,000' },
                  { value: '15k-50k', label: '$15,000 - $50,000' },
                  { value: '50k-plus', label: '$50,000+' },
                  { value: 'unsure', label: "Not sure yet" }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="budgetExpectation"
                      value={option.value}
                      checked={formData.budgetExpectation === option.value}
                      onChange={handleInputChange}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900">
                <strong>Our approach:</strong> We charge $125/hour or $65/hour for partners. A small website might be 20-40 hours. A custom app could be 100-200+ hours. We'll estimate based on your scope.
              </p>
            </div>
          </div>
        )}

        {/* SECTION 4: Team & Technical */}
        {section === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-semibold mb-3">
                Do you have existing code or a live site?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'none', label: 'Starting from scratch' },
                  { value: 'partial', label: 'Have some code/prototype' },
                  { value: 'existing', label: 'Have a live site/app to improve' },
                  { value: 'legacy', label: 'Have legacy code to maintain' }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="existingCode"
                      value={option.value}
                      checked={formData.existingCode === option.value}
                      onChange={handleInputChange}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">
                Your team's technical level
              </label>
              <div className="space-y-2">
                {[
                  { value: 'non-tech', label: 'Non-technical founder (need full support)' },
                  { value: 'mixed', label: 'Mixed team (designer + developer)' },
                  { value: 'strong-dev', label: 'Strong dev team (need help on specific parts)' },
                  { value: 'enterprise', label: 'Enterprise team' }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="teamLevel"
                      value={option.value}
                      checked={formData.teamLevel === option.value}
                      onChange={handleInputChange}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                What tech stack do you prefer? (optional)
              </label>
              <input
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={handleInputChange}
                placeholder="e.g., React, Node.js, Python, or leave blank if no preference"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* SECTION 5: Contact */}
        {section === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Your company"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">
                Best way to reach you?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'email', label: 'Email' },
                  { value: 'phone', label: 'Phone' },
                  { value: 'slack', label: 'Slack' },
                  { value: 'calendar', label: 'Calendar link' }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="contactMethod"
                      value={option.value}
                      checked={formData.contactMethod === option.value}
                      onChange={handleInputChange}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Anything else we should know?
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Share project links, add requirements, describe your vision..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg h-24"
              />
            </div>
          </div>
        )}

        {/* SECTION 6: Partner Qualification */}
        {section === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">Do You Qualify for Our Partner Rate?</h3>
              <p className="text-amber-800 text-sm mb-4">
                We offer special pricing for referral partners, early supporters, and established relationships. 
                Check if you qualify below.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">
                How do you know us?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'none', label: 'First time hearing about us' },
                  { value: 'referral', label: 'Referred by a partner or client' },
                  { value: 'ongoing', label: 'Existing customer or long-term contact' },
                  { value: 'partner', label: 'We discussed a partnership' },
                  { value: 'community', label: 'Active in our community/network' }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="partnerQualification"
                      value={option.value}
                      checked={formData.partnerQualification === option.value}
                      onChange={handleInputChange}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {(formData.partnerQualification && formData.partnerQualification !== 'none') && (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Tell us more (optional)
                </label>
                <textarea
                  name="partnerDetails"
                  value={formData.partnerDetails}
                  onChange={handleInputChange}
                  placeholder="Who referred you? What partnership did we discuss? Any context that helps us understand your relationship..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg h-20"
                />
                <p className="text-xs text-gray-600 mt-1">
                  This helps us validate your eligibility for partner pricing.
                </p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Partner Rate:</strong> $65/hour instead of $125/hour — available to qualified partners, referral sources, and long-term relationships.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {section > 1 && (
            <button
              type="button"
              onClick={prevSection}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← Back
            </button>
          )}
          
          {section < 6 ? (
            <button
              type="button"
              onClick={nextSection}
              className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;
