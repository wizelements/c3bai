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

export async function sendProjectRequestNotifications(formData, requestId) {
  const client = getClient();
  if (!client) {
    console.warn('[resend] Not configured; skipping project request notifications.');
    return { success: false, reason: 'not_configured' };
  }

  const appUrl = env.appUrl || 'https://c3bai-nu.vercel.app';

  // ── Customer confirmation ──
  const customerSubject = `We received your project request — ${formData.projectName || 'Project'}`;
  const customerHtml = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1f2937;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #0a0a0f; font-size: 28px; margin: 0;">Request received ✓</h1>
        <p style="color: #64748b; font-size: 16px; margin-top: 8px;">Cod3Black Agency</p>
      </div>

      <p style="font-size: 16px; line-height: 1.6;">Hi <strong>${formData.name || 'there'}</strong>,</p>
      <p style="font-size: 16px; line-height: 1.6;">
        We received your project request for <strong>${formData.projectName || 'your project'}</strong>.
        Every request is reviewed personally, and we will follow up within <strong>24 hours</strong>.
      </p>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h3 style="color: #0a0a0f; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">What happens next</h3>
        <ol style="color: #334155; line-height: 1.8; padding-left: 20px; margin: 0;">
          <li>We review your project details</li>
          <li>We may reach out with clarifying questions</li>
          <li>We prepare a scope and proposal</li>
          <li>You review and approve</li>
          <li>We build your system</li>
        </ol>
      </div>

      <p style="font-size: 14px; color: #64748b;">
        Reference: <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${requestId}</code>
      </p>

      <p style="font-size: 16px; line-height: 1.6; margin-top: 24px;">
        — Cod3Black Agency<br>
        <a href="${appUrl}" style="color: #2563eb;">${appUrl}</a>
      </p>
    </div>
  `;

  // ── Owner notification ──
  const ownerSubject = `New project request: ${formData.projectName || 'Project'} — ${formData.name || 'Unknown'}`;
  const ownerHtml = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1f2937;">
      <div style="background: #2563eb; color: white; padding: 16px 24px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 20px;">New project request</h1>
      </div>
      <div style="border: 1px solid #e2e8f0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #64748b; width: 120px;"><strong>Request ID</strong></td><td style="padding: 8px 0;"><code>${requestId}</code></td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Name</strong></td><td style="padding: 8px 0;">${formData.name || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Email</strong></td><td style="padding: 8px 0;">${formData.email || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Company</strong></td><td style="padding: 8px 0;">${formData.company || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Phone</strong></td><td style="padding: 8px 0;">${formData.phone || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Project</strong></td><td style="padding: 8px 0;">${formData.projectName || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Type</strong></td><td style="padding: 8px 0;">${formData.projectType || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Timeline</strong></td><td style="padding: 8px 0;">${formData.timeline || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Budget</strong></td><td style="padding: 8px 0;">${formData.budgetRange || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Website</strong></td><td style="padding: 8px 0;">${formData.currentWebsite || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Source</strong></td><td style="padding: 8px 0;">${formData.source || 'web'}</td></tr>
        </table>

        <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 8px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #0a0a0f;">Description</h3>
          <p style="color: #334155; line-height: 1.6; margin: 0;">${formData.description || 'No description provided'}</p>
        </div>

        ${formData.desiredOutcome ? `
        <div style="margin-top: 12px; padding: 16px; background: #f8fafc; border-radius: 8px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #0a0a0f;">Desired outcome</h3>
          <p style="color: #334155; line-height: 1.6; margin: 0;">${formData.desiredOutcome}</p>
        </div>
` : ''}

        <p style="margin-top: 20px;">
          <a href="${appUrl}/admin/requests" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">View in admin dashboard</a>
        </p>
      </div>
    </div>
  `;

  const results = [];

  try {
    const customerResult = await client.emails.send({
      from: env.resend.fromEmail,
      to: formData.email,
      subject: customerSubject,
      html: customerHtml,
    });
    results.push({ recipient: 'customer', result: customerResult });
  } catch (error) {
    console.error('[resend] Failed to send customer confirmation:', error);
    results.push({ recipient: 'customer', error: error.message });
  }

  try {
    const ownerResult = await client.emails.send({
      from: env.resend.fromEmail,
      to: env.resend.toEmail,
      subject: ownerSubject,
      html: ownerHtml,
    });
    results.push({ recipient: 'owner', result: ownerResult });
  } catch (error) {
    console.error('[resend] Failed to send owner notification:', error);
    results.push({ recipient: 'owner', error: error.message });
  }

  const allSuccess = results.every((r) => !r.error);
  return { success: allSuccess, results };
}
