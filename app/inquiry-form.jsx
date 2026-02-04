/**
 * c3bai Inquiry Form Component
 * 
 * Purpose: Collect structured project information for fair pricing
 * Integration: Add to /pages/consultation page or /pages/inquiry
 * 
 * Features:
 * - Multi-section form that guides users through scope estimation
 * - Automatic response email with rough estimate
 * - Data saved to database for manual review
 * - Mobile-responsive
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
    
    // Section 2: Scope Estimation
    tokenVolume: '',
    llmProviders: [],
    documentsPerMonth: '',
    documentTypes: [],
    webhooksNeeded: '',
    integrationType: '',
    integratedSystems: [],
    
    // Section 3: Timeline & Budget
    timeline: '',
    budgetExpectation: '',
    
    // Section 4: Team & Complexity
    techStack: '',
    existingCode: '',
    teamLevel: '',
    specialRequirements: [],
    
    // Section 5: Contact
    name: '',
    email: '',
    company: '',
    website: '',
    contactMethod: '',
    additionalInfo: '',
    
    // Section 6: Partner Qualification (optional discount tier)
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
      // Call your API to save inquiry and send email
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
          Help us understand your scope so we can give you an accurate estimate.
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
        {/* SECTION 1: Basics */}
        {section === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Project Name
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                placeholder="e.g., AI-Powered Document Processor"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Brief Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="What does your product do? (2-3 sentences)"
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
                placeholder="One sentence problem statement"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />
              <p className="text-xs text-gray-600 mt-1">
                Example: "Founders waste 4 hours/week manually extracting data from emails"
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Tip:</strong> Clear problem statements lead to better estimates. 
                The more detail here, the more accurate our pricing.
              </p>
            </div>
          </div>
        )}

        {/* SECTION 2: Scope Estimation */}
        {section === 2 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Token Volume */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Estimated LLM token volume per month
              </label>
              <div className="space-y-2">
                {[
                  { value: 'under-100k', label: '<100K tokens (testing/MVP)' },
                  { value: '100k-1m', label: '100K-1M tokens (light use)' },
                  { value: '1m-10m', label: '1M-10M tokens (moderate)' },
                  { value: '10m-100m', label: '10M-100M tokens (heavy)' },
                  { value: 'over-100m', label: '100M+ tokens (massive scale)' },
                  { value: 'unsure', label: "Not sure yet" }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="tokenVolume"
                      value={option.value}
                      checked={formData.tokenVolume === option.value}
                      onChange={handleInputChange}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* LLM Providers */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Which LLM providers? (select all that apply)
              </label>
              <div className="space-y-2">
                {[
                  { value: 'openai', label: 'OpenAI (GPT-4, GPT-3.5)' },
                  { value: 'anthropic', label: 'Anthropic (Claude)' },
                  { value: 'google', label: 'Google (Gemini)' },
                  { value: 'local', label: 'Local model (self-hosted)' },
                  { value: 'multi', label: 'Multiple providers' },
                  { value: 'unsure', label: "Not sure yet" }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={formData.llmProviders.includes(option.value)}
                      onChange={(e) => handleCheckboxChange(e, 'llmProviders')}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Data Processing */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Documents to process per month
              </label>
              <div className="space-y-2">
                {[
                  { value: 'none', label: 'None' },
                  { value: 'under-100', label: '<100 documents' },
                  { value: '100-1k', label: '100-1K documents' },
                  { value: '1k-10k', label: '1K-10K documents' },
                  { value: 'over-10k', label: '10K+ documents' }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="documentsPerMonth"
                      value={option.value}
                      checked={formData.documentsPerMonth === option.value}
                      onChange={handleInputChange}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Document Types */}
            {formData.documentsPerMonth !== 'none' && (
              <div>
                <label className="block text-sm font-semibold mb-3">
                  What types of documents?
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'pdf-scanned', label: 'PDFs (scanned images)' },
                    { value: 'pdf-searchable', label: 'PDFs (searchable text)' },
                    { value: 'images', label: 'Images' },
                    { value: 'web', label: 'Web pages' },
                    { value: 'database', label: 'Database exports' },
                    { value: 'other', label: 'Other' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={formData.documentTypes.includes(option.value)}
                        onChange={(e) => handleCheckboxChange(e, 'documentTypes')}
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Integrations */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Need webhooks or API integrations?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'none', label: 'No integrations' },
                  { value: 'simple', label: 'Simple (1-3 integrations)' },
                  { value: 'moderate', label: 'Moderate (3-10)' },
                  { value: 'complex', label: 'Complex (10+)' }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="webhooksNeeded"
                      value={option.value}
                      checked={formData.webhooksNeeded === option.value}
                      onChange={handleInputChange}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Integrated Systems */}
            {formData.webhooksNeeded !== 'none' && (
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Which systems?
                </label>
                <div className="space-y-2">
                  {[
                    'Slack', 'Zapier', 'Make', 'Custom API', 
                    'Database', 'Email', 'Payment processor', 'Other'
                  ].map(system => (
                    <label key={system} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        value={system}
                        checked={formData.integratedSystems.includes(system)}
                        onChange={(e) => handleCheckboxChange(e, 'integratedSystems')}
                      />
                      <span className="text-gray-700">{system}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: Timeline & Budget */}
        {section === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-semibold mb-3">
                When do you need this built?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'asap', label: 'ASAP (2-4 weeks)' },
                  { value: 'soon', label: 'Soon (1-2 months)' },
                  { value: 'flexible', label: 'Flexible (3+ months)' },
                  { value: 'exploring', label: 'Just exploring' }
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
                Budget expectation
              </label>
              <div className="space-y-2">
                {[
                  { value: 'under-5k', label: 'Under $5K' },
                  { value: '5-10k', label: '$5K-$10K' },
                  { value: '10-25k', label: '$10K-$25K' },
                  { value: 'over-25k', label: '$25K+' },
                  { value: 'unsure', label: "No idea yet" }
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Note on budgeting:</strong> Our estimate will be based on actual scope. 
                If your timeline or budget doesn't align, we'll explain trade-offs (features vs. timeline vs. budget).
              </p>
            </div>
          </div>
        )}

        {/* SECTION 4: Team & Complexity */}
        {section === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-semibold mb-2">
                What's your tech stack?
              </label>
              <textarea
                name="techStack"
                value={formData.techStack}
                onChange={handleInputChange}
                placeholder="e.g., Next.js, React, Python, PostgreSQL, Supabase..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg h-20"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">
                Do you have existing code?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'yes', label: 'Yes (please share link/access)' },
                  { value: 'no', label: 'No, starting fresh' }
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
                  { value: 'non-tech', label: 'Non-technical founder' },
                  { value: 'mixed', label: 'Designer/PM with technical cofounders' },
                  { value: 'strong-dev', label: 'Strong dev team (just need help)' },
                  { value: 'enterprise', label: 'Enterprise with dedicated engineers' }
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
              <label className="block text-sm font-semibold mb-3">
                Special requirements?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'compliance', label: 'Compliance (HIPAA, GDPR, SOC2)' },
                  { value: 'high-availability', label: 'High availability (99.9%+ uptime)' },
                  { value: 'training', label: 'Custom training/documentation' },
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
                placeholder="Paste project links, add requirements, share your vision..."
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
