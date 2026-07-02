import { Resend } from 'resend';
import { env } from './env';

let resend = null;

function getClient() {
  if (resend) return resend;
  if (!env.isResendConfigured()) {
    return null;
  }
  resend = new Resend(env.resend.apiKey);
  return resend;
}

function estimateSummary(estimate) {
  if (!estimate) return '';
  return `
Estimated hours: ${estimate.estimatedHours || 'N/A'}
Tier: ${estimate.tier || 'N/A'}
Hourly rate: $${estimate.hourlyRate || 'N/A'}
Monthly retainer: $${estimate.monthlyRate || 'N/A'}
Setup fee: $${estimate.setupFee || 'N/A'}
Estimated duration: ${estimate.estimatedDuration || 'N/A'}
  `.trim();
}

export async function sendInquiryNotifications(formData, estimate, inquiryId) {
  const client = getClient();
  if (!client) {
    console.warn('[resend] Not configured; skipping email notifications.');
    return { success: false, reason: 'not_configured' };
  }

  const prospectSubject = `We received your inquiry — ${formData.projectName || 'Project'}`;
  const prospectHtml = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1f2937;">
      <h1 style="color: #2563eb; font-size: 24px;">Thanks for reaching out, ${formData.name || 'there'}.</h1>
      <p>We received your inquiry for <strong>${formData.projectName || 'your project'}</strong>.</p>
      <p>Here's a rough estimate based on what you shared:</p>
      <pre style="background: #f3f4f6; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${estimateSummary(estimate)}</pre>
      <p>We review every inquiry by hand and will follow up within 24 hours to confirm scope and next steps.</p>
      <p>Your inquiry ID: <code>${inquiryId}</code></p>
      <p>- Cod3Black Agency</p>
    </div>
  `;

  const internalSubject = `New inquiry: ${formData.projectName || 'Project'} — ${formData.email || 'no email'}`;
  const internalHtml = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1f2937;">
      <h1 style="color: #2563eb; font-size: 24px;">New inquiry received</h1>
      <p><strong>Inquiry ID:</strong> ${inquiryId}</p>
      <p><strong>Name:</strong> ${formData.name || 'N/A'}</p>
      <p><strong>Email:</strong> ${formData.email || 'N/A'}</p>
      <p><strong>Company:</strong> ${formData.company || 'N/A'}</p>
      <p><strong>Project:</strong> ${formData.projectName || 'N/A'}</p>
      <p><strong>Type:</strong> ${formData.projectType || 'N/A'}</p>
      <p><strong>Budget:</strong> ${formData.budgetExpectation || 'N/A'}</p>
      <p><strong>Timeline:</strong> ${formData.timeline || 'N/A'}</p>
      <pre style="background: #f3f4f6; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${estimateSummary(estimate)}</pre>
      <p><a href="${env.appUrl}/admin" style="color: #2563eb;">View in admin dashboard</a></p>
    </div>
  `;

  const results = [];

  try {
    const prospectResult = await client.emails.send({
      from: env.resend.fromEmail,
      to: formData.email,
      subject: prospectSubject,
      html: prospectHtml,
    });
    results.push({ recipient: 'prospect', result: prospectResult });
  } catch (error) {
    console.error('[resend] Failed to send prospect email:', error);
    results.push({ recipient: 'prospect', error: error.message });
  }

  try {
    const internalResult = await client.emails.send({
      from: env.resend.fromEmail,
      to: env.resend.toEmail,
      subject: internalSubject,
      html: internalHtml,
    });
    results.push({ recipient: 'internal', result: internalResult });
  } catch (error) {
    console.error('[resend] Failed to send internal email:', error);
    results.push({ recipient: 'internal', error: error.message });
  }

  const allSuccess = results.every((r) => !r.error);
  return { success: allSuccess, results };
}
