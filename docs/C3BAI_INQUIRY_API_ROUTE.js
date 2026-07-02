/**
 * API Route: /api/inquiry
 * 
 * Handles inquiry form submissions:
 * 1. Saves inquiry to database/spreadsheet
 * 2. Sends automated response email with preliminary estimate
 * 3. Logs for manual review queue
 * 4. Returns success/error to frontend
 */

import { sendEmail } from '@/lib/email';
import { saveInquiry } from '@/lib/database';
import { estimateProjectScope } from '@/lib/pricing';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;

    // 1. ESTIMATE PROJECT SCOPE
    // This generates a rough tier recommendation based on responses
    const estimate = estimateProjectScope(formData);

    // 2. SAVE INQUIRY TO DATABASE
    const inquiryId = await saveInquiry({
      ...formData,
      estimate,
      submittedAt: new Date().toISOString(),
      status: 'new', // For manual review queue
    });

    // 3. SEND AUTOMATED RESPONSE EMAIL
    const emailContent = generateAutoResponseEmail(formData, estimate);
    await sendEmail({
      to: formData.email,
      subject: `[c3bai] Your project estimate: ${estimate.tier}`,
      html: emailContent,
      replyTo: 'projects@c3bai.com',
    });

    // 4. NOTIFY SALES TEAM (internal)
    await sendEmail({
      to: 'team@c3bai.com',
      subject: `[NEW INQUIRY] ${formData.projectName} - ${estimate.tier} tier`,
      html: generateInternalNotification(formData, estimate, inquiryId),
    });

    return res.status(200).json({
      success: true,
      inquiryId,
      message: 'Inquiry submitted. Check your email for next steps.',
    });
  } catch (error) {
    console.error('Inquiry submission error:', error);
    return res.status(500).json({
      error: 'Failed to submit inquiry. Please try again.',
    });
  }
}

/**
 * Generate preliminary scope estimate based on form responses
 * Returns: { tier, hoursEstimate, description, caveats }
 */
function estimateProjectScope(data) {
  let estimatedHours = 20; // baseline
  let tier = 'Starter';
  let complexity = 'simple';

  // Token volume impact
  if (data.tokenVolume === '10m-100m') estimatedHours += 20;
  if (data.tokenVolume === 'over-100m') estimatedHours += 40;

  // Data processing impact
  if (data.documentsPerMonth === '1k-10k') estimatedHours += 15;
  if (data.documentsPerMonth === 'over-10k') estimatedHours += 30;

  // Integration complexity
  if (data.webhooksNeeded === 'moderate') estimatedHours += 15;
  if (data.webhooksNeeded === 'complex') {
    estimatedHours += 40;
    tier = 'Professional';
    complexity = 'complex';
  }

  // Total scope assessment
  if (estimatedHours > 60 && estimatedHours <= 120) {
    tier = 'Professional';
    complexity = 'moderate';
  } else if (estimatedHours > 120) {
    tier = 'Enterprise';
    complexity = 'complex';
  }

  return {
    estimatedHours: Math.ceil(estimatedHours / 10) * 10, // Round to nearest 10
    tier,
    complexity,
    monthlyRate: tier === 'Starter' ? '$2,500' : tier === 'Professional' ? '$7,500' : 'Custom',
    estimatedDuration:
      estimatedHours <= 40 ? '2-4 weeks' :
      estimatedHours <= 80 ? '4-8 weeks' :
      '8+ weeks',
  };
}

/**
 * Generate automated response email
 * This goes to the prospect immediately
 */
function generateAutoResponseEmail(data, estimate) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #003d99; color: white; padding: 30px; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 5px 0 0 0; opacity: 0.9; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
    .estimate-box { background: white; border-left: 4px solid #003d99; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .estimate-box h3 { margin: 0 0 10px 0; color: #003d99; }
    .estimate-box .price { font-size: 28px; font-weight: bold; color: #003d99; margin: 10px 0; }
    .estimate-box .description { color: #666; font-size: 14px; }
    .next-steps { background: white; padding: 20px; margin: 20px 0; border-radius: 4px; border: 1px solid #e0e0e0; }
    .next-steps h3 { margin-top: 0; }
    .next-steps ol { padding-left: 20px; }
    .next-steps li { margin: 10px 0; color: #333; }
    .next-steps strong { color: #003d99; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
    .button { display: inline-block; background: #003d99; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Got your project request!</h1>
      <p>Initial scope estimate included below</p>
    </div>
    
    <div class="content">
      <p>Hi ${data.name},</p>
      
      <p>Thanks for sharing details about <strong>${data.projectName}</strong>. 
      We reviewed your scope and put together a preliminary estimate.</p>
      
      <div class="estimate-box">
        <h3>Preliminary Estimate</h3>
        <div class="price">${estimate.monthlyRate}/month</div>
        <p><strong>Recommended Tier:</strong> ${estimate.tier}</p>
        <p><strong>Estimated Hours:</strong> ${estimate.estimatedHours} hours total</p>
        <p><strong>Estimated Duration:</strong> ${estimate.estimatedDuration}</p>
        <p class="description">
          This is a rough estimate based on your scope. 
          During our call, we'll refine this based on your specific requirements.
        </p>
      </div>

      <p><strong>What this tier includes:</strong></p>
      ${estimate.tier === 'Starter' ? `
        <ul>
          <li>20 hours of engineering per month</li>
          <li>100K LLM tokens included</li>
          <li>Email support (24-48 hour response)</li>
          <li>Monthly optimization reports</li>
          <li>Setup fee: $2,500 (one-time)</li>
        </ul>
      ` : estimate.tier === 'Professional' ? `
        <ul>
          <li>60 hours of engineering per month</li>
          <li>1M LLM tokens included</li>
          <li>Slack + Email support (4-8 hour response)</li>
          <li>Bi-weekly strategy calls</li>
          <li>Custom prompt engineering (10 hrs/month)</li>
          <li>Setup fee: $5,000 (one-time)</li>
        </ul>
      ` : `
        <ul>
          <li>160+ hours of dedicated engineering</li>
          <li>Unlimited tokens and usage</li>
          <li>24/7 support + dedicated account manager</li>
          <li>Weekly strategy sessions</li>
          <li>Custom integrations and development</li>
          <li>Setup fee: 10% of annual contract value</li>
        </ul>
      `}

      <div class="next-steps">
        <h3>Next Steps</h3>
        <ol>
          <li><strong>Within 24 hours:</strong> We review your detailed scope</li>
          <li><strong>Within 48 hours:</strong> We schedule a 15-30 min call to confirm</li>
          <li><strong>After call:</strong> Formal quote via email (valid 30 days)</li>
          <li><strong>If interested:</strong> Sign service agreement → we start building</li>
        </ol>
      </div>

      <p><strong>Questions or ready to move forward?</strong></p>
      <p>Reply to this email or <a href="https://c3bai.com/calendly" class="button">schedule a call</a></p>

      <p>Looking forward to working with you,<br/>
      The c3bai Team</p>
    </div>

    <div class="footer">
      <p>© 2026 c3bai — Production AI Systems</p>
      <p>
        <a href="https://c3bai.com/pricing" style="color: #999; text-decoration: none;">View Pricing</a> •
        <a href="https://c3bai.com/projects" style="color: #999; text-decoration: none;">See Our Work</a> •
        <a href="https://c3bai.com" style="color: #999; text-decoration: none;">Home</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate internal notification for sales team
 */
function generateInternalNotification(data, estimate, inquiryId) {
  const hasExistingCode = data.existingCode === 'yes' ? '✓ YES' : '✗ No';
  const specialRequirements = data.specialRequirements?.length > 0 ? 
    data.specialRequirements.join(', ') : 
    'None';

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: monospace; font-size: 12px; color: #333; }
    .container { max-width: 900px; margin: 0 auto; padding: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #333; color: white; padding: 10px; text-align: left; }
    td { padding: 8px; border-bottom: 1px solid #ddd; }
    .section { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 4px; }
    .section h3 { margin: 0 0 10px 0; }
    .priority { background: #fff3cd; padding: 10px; border-radius: 4px; margin: 10px 0; }
    .action { background: #d4edda; padding: 10px; border-radius: 4px; margin: 10px 0; }
    code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>[INQUIRY #${inquiryId.slice(0, 8)}] ${data.projectName}</h2>
    
    <div class="section">
      <h3>Quick Summary</h3>
      <table>
        <tr>
          <td><strong>Company</strong></td>
          <td>${data.company || 'N/A'}</td>
        </tr>
        <tr>
          <td><strong>Contact</strong></td>
          <td>${data.name} (${data.email})</td>
        </tr>
        <tr>
          <td><strong>Recommended Tier</strong></td>
          <td><strong style="color: #003d99; font-size: 14px;">${estimate.tier}</strong></td>
        </tr>
        <tr>
          <td><strong>Est. Hours</strong></td>
          <td>${estimate.estimatedHours} hours over ${estimate.estimatedDuration}</td>
        </tr>
        <tr>
          <td><strong>Complexity</strong></td>
          <td>${estimate.complexity}</td>
        </tr>
      </table>
    </div>

    <div class="section">
      <h3>Project Scope</h3>
      <p><strong>Description:</strong> ${data.description}</p>
      <p><strong>Problem:</strong> ${data.problemStatement}</p>
    </div>

    <div class="section">
      <h3>Technical Details</h3>
      <table>
        <tr>
          <td><strong>Tech Stack</strong></td>
          <td>${data.techStack || 'Not specified'}</td>
        </tr>
        <tr>
          <td><strong>Existing Code</strong></td>
          <td>${hasExistingCode}</td>
        </tr>
        <tr>
          <td><strong>Team Level</strong></td>
          <td>${data.teamLevel}</td>
        </tr>
        <tr>
          <td><strong>Token Volume</strong></td>
          <td>${data.tokenVolume}</td>
        </tr>
        <tr>
          <td><strong>LLM Providers</strong></td>
          <td>${data.llmProviders?.join(', ') || 'Not specified'}</td>
        </tr>
        <tr>
          <td><strong>Integrations</strong></td>
          <td>${data.webhooksNeeded} (${data.integratedSystems?.join(', ') || 'None'})</td>
        </tr>
        <tr>
          <td><strong>Documents/month</strong></td>
          <td>${data.documentsPerMonth}</td>
        </tr>
      </table>
    </div>

    <div class="section">
      <h3>Engagement Details</h3>
      <table>
        <tr>
          <td><strong>Timeline</strong></td>
          <td>${data.timeline}</td>
        </tr>
        <tr>
          <td><strong>Budget</strong></td>
          <td>${data.budgetExpectation}</td>
        </tr>
        <tr>
          <td><strong>Special Requirements</strong></td>
          <td>${specialRequirements}</td>
        </tr>
        <tr>
          <td><strong>Contact Method</strong></td>
          <td>${data.contactMethod}</td>
        </tr>
      </table>
    </div>

    ${data.additionalInfo ? `
    <div class="section">
      <h3>Additional Notes</h3>
      <p>${data.additionalInfo}</p>
    </div>
    ` : ''}

    <div class="action">
      <strong>ACTION REQUIRED:</strong>
      <ol>
        <li>Validate estimate (is ${estimate.estimatedHours} hours reasonable?)</li>
        <li>Review for red flags (compliance, security, custom requirements)</li>
        <li>Schedule qualification call within 24 hours</li>
        <li>Send formal quote after call</li>
      </ol>
    </div>

    <p>
      <strong>Inquiry ID:</strong> <code>${inquiryId}</code><br/>
      <strong>Submitted:</strong> ${new Date().toLocaleString()}<br/>
      <strong>Automated response sent to:</strong> ${data.email}
    </p>
  </div>
</body>
</html>
  `.trim();
}
