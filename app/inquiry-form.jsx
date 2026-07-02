/**
 * Cod3Black Agency Systems Audit Form
 *
 * Collects structured business information so we can recommend
 * the highest-leverage website, funnel, dashboard, automation, or AI workflow.
 */

'use client';

import { useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

const InquiryForm = () => {
  const [section, setSection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    problemStatement: '',
    projectType: '',
    designScope: '',
    integrationCount: '',
    databaseNeeded: '',
    deploymentRequirements: [],
    specialRequirements: [],
    timeline: '',
    budgetExpectation: '',
    techStack: '',
    existingCode: '',
    teamLevel: '',
    name: '',
    email: '',
    company: '',
    website: '',
    contactMethod: '',
    additionalInfo: '',
    partnerQualification: '',
    partnerDetails: '',
    packageInterest: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e, fieldName) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const currentArray = prev[fieldName] || [];
      return {
        ...prev,
        [fieldName]: checked
          ? [...currentArray, value]
          : currentArray.filter((item) => item !== value),
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

      const result = await response.json();
      if (response.ok && result.success) {
        setEstimate(result.estimate);
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
        <h2 className="text-3xl font-bold mb-3">Thanks! We got your audit request.</h2>
        <p className="text-lg text-gray-600 mb-4">
          We'll review your business and recommend the highest-leverage system to build or automate first.
        </p>

        {estimate && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold mb-3">Rough estimate based on your answers:</h3>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Project type:</strong> {estimate.projectTypeLabel}</li>
              <li><strong>Estimated hours:</strong> {estimate.estimatedHours}</li>
              <li><strong>Suggested package:</strong> {estimate.tier}</li>
              <li><strong>Estimated duration:</strong> {estimate.estimatedDuration}</li>
              <li><strong>Monthly system investment:</strong> ${estimate.monthlyRate?.toLocaleString?.() || estimate.monthlyRate}</li>
            </ul>
            <p className="text-sm text-gray-500 mt-4">{estimate.disclaimer}</p>
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 text-left">
          <h3 className="font-semibold mb-3">What happens next:</h3>
          <ol className="space-y-2 text-gray-700">
            <li>✓ <strong>Immediate:</strong> Confirmation email with your estimate</li>
            <li>✓ <strong>Within 24 hours:</strong> We review and recommend the right package</li>
            <li>✓ <strong>Within 48 hours:</strong> We schedule a 15-minute systems call</li>
            <li>✓ <strong>After the call:</strong> Fixed-scope proposal valid for 30 days</li>
          </ol>
        </div>

        <a href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Systems Audit</h1>
        <p className="text-gray-600 mb-4">
          Help us understand your business and where a system would save you the most time. Takes about 8 minutes.
        </p>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className={`h-2 flex-1 rounded ${num <= section ? 'bg-blue-600' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">Section {section} of 6</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* SECTION 1: Project Basics */}
        {section === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-semibold mb-2">What's your business or project called?</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                placeholder="e.g., Taste of Gratitude, Atlanta Saddle Club"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">What kind of system do you need most?</label>
              <div className="space-y-2">
                {[
                  { value: 'website', label: 'Website + funnel (capture leads and sales)' },
                  { value: 'web-app', label: 'Web app / admin dashboard (manage operations)' },
                  { value: 'mobile-app', label: 'Mobile app (iOS/Android)' },
                  { value: 'integration', label: 'Integration / automation (connect tools)' },
                  { value: 'redesign', label: 'Redesign / improve an existing site or app' },
                  { value: 'mvp', label: 'MVP (prove a new product idea fast)' },
                  { value: 'other', label: 'Something else' },
                ].map((option) => (
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
              <label className="block text-sm font-semibold mb-2">Describe what your business does</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="What do you sell? Who do you serve? How do customers find you today?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg h-24"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">What's the biggest time-waster or bottleneck right now?</label>
              <input
                type="text"
                name="problemStatement"
                value={formData.problemStatement}
                onChange={handleInputChange}
                placeholder="e.g., I spend 3 hours/day answering booking DMs"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
        )}

        {/* SECTION 2: Scope & Features */}
        {section === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-semibold mb-3">How much design work is needed?</label>
              <div className="space-y-2">
                {[
                  { value: 'template', label: 'Use a clean template (move fast)' },
                  { value: 'moderate', label: 'Customized design (brand colors, layouts)' },
                  { value: 'custom', label: 'Fully custom design (unique identity)' },
                  { value: 'unsure', label: "Not sure yet" },
                ].map((option) => (
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
              <label className="block text-sm font-semibold mb-3">Will this need a database or backend?</label>
              <div className="space-y-2">
                {[
                  { value: 'no', label: 'No (static site, marketing page)' },
                  { value: 'simple', label: 'Simple (forms, contacts, orders)' },
                  { value: 'complex', label: 'Complex (accounts, real-time data, reports)' },
                  { value: 'unsure', label: "Not sure yet" },
                ].map((option) => (
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
              <label className="block text-sm font-semibold mb-3">How many third-party integrations?</label>
              <div className="space-y-2">
                {[
                  { value: 'none', label: 'None (standalone)' },
                  { value: '1-2', label: '1-2 integrations' },
                  { value: '3-5', label: '3-5 integrations' },
                  { value: '5-plus', label: '5+ integrations' },
                  { value: 'unsure', label: "Not sure yet" },
                ].map((option) => (
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
              <label className="block text-sm font-semibold mb-3">Which platforms do you need?</label>
              <div className="space-y-2">
                {[
                  { value: 'web', label: 'Web (desktop & mobile browsers)' },
                  { value: 'ios', label: 'iOS app' },
                  { value: 'android', label: 'Android app' },
                  { value: 'both-mobile', label: 'Both iOS & Android' },
                ].map((option) => (
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
              <label className="block text-sm font-semibold mb-3">Any special requirements?</label>
              <div className="space-y-2">
                {[
                  { value: 'compliance', label: 'Compliance/Security (HIPAA, GDPR, PCI)' },
                  { value: 'performance', label: 'Performance (fast load, high traffic)' },
                  { value: 'seo', label: 'SEO optimization' },
                  { value: 'training', label: 'Training/Documentation' },
                  { value: 'none', label: 'None listed' },
                ].map((option) => (
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
              <label className="block text-sm font-semibold mb-3">When do you need this live?</label>
              <div className="space-y-2">
                {[
                  { value: 'flexible', label: 'Flexible (no rush)' },
                  { value: '3-months', label: '3 months' },
                  { value: '6-weeks', label: '6 weeks' },
                  { value: '4-weeks', label: '4 weeks' },
                  { value: 'urgent', label: 'ASAP (2-3 weeks)' },
                ].map((option) => (
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
              <label className="block text-sm font-semibold mb-3">What's your budget range?</label>
              <div className="space-y-2">
                {[
                  { value: 'under-5k', label: 'Under $5,000' },
                  { value: '5k-15k', label: '$5,000 - $15,000' },
                  { value: '15k-50k', label: '$15,000 - $50,000' },
                  { value: '50k-plus', label: '$50,000+' },
                  { value: 'unsure', label: "Not sure yet" },
                ].map((option) => (
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
          </div>
        )}

        {/* SECTION 4: Team & Complexity */}
        {section === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-semibold mb-3">Do you have existing code or a live site?</label>
              <div className="space-y-2">
                {[
                  { value: 'none', label: 'Starting from scratch' },
                  { value: 'partial', label: 'Have some code/prototype' },
                  { value: 'existing', label: 'Have a live site/app to improve' },
                  { value: 'legacy', label: 'Have legacy code to maintain' },
                ].map((option) => (
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
              <label className="block text-sm font-semibold mb-3">Your team's technical level</label>
              <div className="space-y-2">
                {[
                  { value: 'non-tech', label: 'Non-technical founder (need full support)' },
                  { value: 'mixed', label: 'Mixed team (some technical help)' },
                  { value: 'strong-dev', label: 'Strong dev team (need targeted help)' },
                  { value: 'enterprise', label: 'Enterprise team' },
                ].map((option) => (
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
              <label className="block text-sm font-semibold mb-2">Preferred tech stack? (optional)</label>
              <input
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={handleInputChange}
                placeholder="e.g., Next.js, Shopify, WordPress, or leave blank"
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
              <label className="block text-sm font-semibold mb-3">Best way to reach you?</label>
              <div className="space-y-2">
                {[
                  { value: 'email', label: 'Email' },
                  { value: 'phone', label: 'Phone' },
                  { value: 'slack', label: 'Slack' },
                  { value: 'calendar', label: 'Calendar link' },
                ].map((option) => (
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
          </div>
        )}

        {/* SECTION 6: Partner + Package */}
        {section === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-semibold mb-3">Which package interests you most?</label>
              <div className="space-y-2">
                {[
                  { value: 'starter', label: 'Starter System ($1,500–$2,500)' },
                  { value: 'growth', label: 'Growth System ($4,000–$6,000)' },
                  { value: 'retainer', label: 'Automation Retainer ($500–$1,500/mo)' },
                  { value: 'not-sure', label: "Not sure — let's recommend" },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="packageInterest"
                      value={option.value}
                      checked={formData.packageInterest === option.value}
                      onChange={handleInputChange}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">Do you qualify for our partner rate?</label>
              <div className="space-y-2">
                {[
                  { value: 'none', label: 'First time hearing about us' },
                  { value: 'referral', label: 'Referred by a partner or client' },
                  { value: 'ongoing', label: 'Existing customer or long-term contact' },
                  { value: 'partner', label: 'We discussed a partnership' },
                  { value: 'community', label: 'Active in our community/network' },
                ].map((option) => (
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
                <label className="block text-sm font-semibold mb-2">Tell us more (optional)</label>
                <textarea
                  name="partnerDetails"
                  value={formData.partnerDetails}
                  onChange={handleInputChange}
                  placeholder="Who referred you? What partnership did we discuss?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg h-20"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">Anything else we should know?</label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Share project links, competitors, deadlines, or special requirements..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg h-24"
              />
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
              {loading ? 'Submitting...' : 'Submit Audit Request'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;
