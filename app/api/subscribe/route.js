import { z } from 'zod';
import { insertLead } from '@/lib/db';
import { env } from '@/lib/env';
import { trackEvent } from '@/lib/tracking';
import { Resend } from 'resend';

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  firstName: z.string().max(100, 'First name is too long.').optional().default(''),
});

function getResendClient() {
  if (!env.isResendConfigured()) return null;
  return new Resend(env.resend.apiKey);
}

async function sendWelcomeEmail(email, firstName) {
  const client = getResendClient();
  if (!client) {
    console.warn('[api/subscribe] Resend not configured; skipping welcome email.');
    return { success: false, reason: 'not_configured' };
  }

  const appUrl = env.appUrl;
  const playbookUrl = `${appUrl}/downloads/ai-client-acquisition-playbook.pdf`;
  const promptUrl = `${appUrl}/downloads/prompt-pack.md`;
  const mdUrl = `${appUrl}/downloads/ai-client-acquisition-playbook.md`;

  const subject = `${firstName ? `${firstName}, y` : 'Y'}our AI Client Acquisition Playbook is here`;
  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1f2937;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #0a0a0f; font-size: 28px; margin: 0;">Your playbook is ready ✓</h1>
        <p style="color: #64748b; font-size: 16px; margin-top: 8px;">Cod3Black Agency</p>
      </div>

      <p style="font-size: 16px; line-height: 1.6;">
        Hi ${firstName ? `<strong>${firstName}</strong>` : 'there'},
      </p>
      <p style="font-size: 16px; line-height: 1.6;">
        Thanks for downloading the <strong>AI Client Acquisition Playbook</strong>.
        Inside you will find the exact checklist, prompts, and follow-up system we use to turn local business websites into 24/7 lead-capture machines.
      </p>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h3 style="color: #0a0a0f; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Download your resources</h3>
        <ul style="color: #334155; line-height: 1.8; padding-left: 20px; margin: 0;">
          <li><a href="${playbookUrl}" style="color: #2563eb;">AI Client Acquisition Playbook (PDF)</a></li>
          <li><a href="${mdUrl}" style="color: #2563eb;">Playbook (Markdown source)</a></li>
          <li><a href="${promptUrl}" style="color: #2563eb;">AI Prompt Pack</a></li>
        </ul>
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h3 style="color: #0a0a0f; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">What to do next</h3>
        <ol style="color: #334155; line-height: 1.8; padding-left: 20px; margin: 0;">
          <li>Read the playbook in 15 minutes.</li>
          <li>Pick one offer to promote this week.</li>
          <li>Use the prompts to draft your landing page and follow-up messages.</li>
          <li>Book a free audit if you want us to install the system for you.</li>
        </ol>
      </div>

      <p style="font-size: 16px; line-height: 1.6; margin-top: 24px;">
        — Cod3Black Agency<br>
        <a href="${appUrl}" style="color: #2563eb;">${appUrl}</a>
      </p>

      <p style="font-size: 12px; color: #94a3b8; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
        You received this because you downloaded a resource from our website. If you did not request this, you can safely ignore it.
      </p>
    </div>
  `;

  try {
    const result = await client.emails.send({
      from: env.resend.fromEmail,
      to: email,
      subject,
      html,
    });
    return { success: true, result };
  } catch (error) {
    console.error('[api/subscribe] Failed to send welcome email:', error);
    return { success: false, error: error.message };
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const firstError = Object.values(errors).flat()[0] || 'Validation failed.';
      return Response.json(
        { success: false, error: firstError, fieldErrors: errors },
        { status: 400 }
      );
    }

    const { email, firstName } = parsed.data;
    const sourceUrl = request.headers.get('referer') || '';

    // Persist lead
    const dbResult = await insertLead({ email, firstName, source: 'lead_magnet', sourceUrl });

    if (!dbResult.success && dbResult.reason !== 'not_configured') {
      console.error('[api/subscribe] Database insert failed:', dbResult.error);
      return Response.json(
        { success: false, error: 'Failed to save your subscription. Please try again.' },
        { status: 500 }
      );
    }

    // Track conversion event
    await trackEvent({
      eventType: 'conversion',
      eventName: 'lead_magnet_submit',
      entityType: 'lead',
      entityId: dbResult.id || null,
      source: 'lead_magnet_page',
      sourceUrl,
      metadata: { email, firstName, dbSaved: dbResult.success },
    });

    // Send welcome email best-effort; do not roll back the lead if email fails.
    let emailResult = { success: false, reason: 'not_attempted' };
    try {
      emailResult = await sendWelcomeEmail(email, firstName);
    } catch (emailError) {
      console.error('[api/subscribe] Welcome email error:', emailError);
      emailResult = { success: false, error: emailError.message };
    }

    return Response.json(
      {
        success: true,
        leadId: dbResult.id || null,
        dbSaved: dbResult.success,
        emailSent: emailResult.success,
        message: emailResult.success
          ? 'Check your inbox — your playbook and prompt pack are on the way.'
          : 'You are subscribed. Download your copy above.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[api/subscribe] Subscription error:', error);
    return Response.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
