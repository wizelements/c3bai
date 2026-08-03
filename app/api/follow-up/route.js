import { z } from 'zod';
import { getClient } from '@/lib/db';
import { env } from '@/lib/env';
import { Resend } from 'resend';

const followUpSchema = z.object({
  leadId: z.string().min(1, 'Lead ID is required.'),
  email: z.string().email('Valid email is required.'),
  firstName: z.string().max(100).optional().default(''),
});

const sendSchema = z.object({
  leadId: z.string().min(1, 'Lead ID is required.'),
  draft: z.string().min(1, 'Draft message is required.'),
});

function getResendClient() {
  if (!env.isResendConfigured()) return null;
  return new Resend(env.resend.apiKey);
}

function generateFollowUpDraft(firstName, email) {
  const name = firstName || 'there';
  return `Subject: Quick question about your AI playbook download

Hi ${name},

You downloaded the AI Client Acquisition Playbook from Cod3Black Agency — thanks for that.

Quick question: which part of the playbook felt most relevant to your business right now?

1. The landing page template?
2. The follow-up message sequence?
3. The prompt pack for AI copy?

I ask because the next step for most owners is not "do more marketing" — it's installing one system that captures and follows up with leads automatically.

If you want, I can do a free 10-minute revenue systems audit and show you exactly which system would move the needle first for your business.

No pitch, just a clear map.

Book it here: ${env.appUrl}/#audit

— Cod3Black Agency
${env.appUrl}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = followUpSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const firstError = Object.values(errors).flat()[0] || 'Validation failed.';
      return Response.json({ success: false, error: firstError }, { status: 400 });
    }

    const { leadId, email, firstName } = parsed.data;
    const draft = generateFollowUpDraft(firstName, email);

    // Persist draft to Turso if available
    const db = getClient();
    if (db) {
      try {
        await db.execute({
          sql: 'UPDATE leads SET follow_up_draft = ?, updated_at = ? WHERE id = ?',
          args: [draft, new Date().toISOString(), leadId],
        });
      } catch (dbError) {
        console.error('[api/follow-up] Failed to save draft:', dbError);
      }
    }

    return Response.json({ success: true, draft });
  } catch (error) {
    console.error('[api/follow-up] Error:', error);
    return Response.json({ success: false, error: 'Failed to generate follow-up.' }, { status: 500 });
  }
}

export async function PUT(request) {
  // Alias for POST to support some clients
  return POST(request);
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const parsed = sendSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const firstError = Object.values(errors).flat()[0] || 'Validation failed.';
      return Response.json({ success: false, error: firstError }, { status: 400 });
    }

    const { leadId, draft } = parsed.data;

    const db = getClient();
    if (!db) {
      return Response.json(
        { success: false, error: 'Database not configured. Cannot send follow-up.' },
        { status: 500 }
      );
    }

    const leadResult = await db.execute({
      sql: 'SELECT * FROM leads WHERE id = ?',
      args: [leadId],
    });
    const lead = leadResult.rows?.[0];

    if (!lead) {
      return Response.json({ success: false, error: 'Lead not found.' }, { status: 404 });
    }

    const client = getResendClient();
    if (!client) {
      return Response.json(
        { success: false, error: 'Resend not configured. Cannot send follow-up.' },
        { status: 500 }
      );
    }

    // Extract subject from draft if present
    const subjectMatch = draft.match(/^Subject:\s*(.+)$/m);
    const subject = subjectMatch ? subjectMatch[1].trim() : 'Follow-up from Cod3Black Agency';
    const html = draft
      .replace(/^Subject:.*$/m, '')
      .split('\n')
      .map((line) => {
        if (!line.trim()) return '<br />';
        return `<p style="margin:0 0 12px 0; line-height:1.6;">${escapeHtml(line)}</p>`;
      })
      .join('');

    try {
      const result = await client.emails.send({
        from: env.resend.fromEmail,
        to: lead.email,
        subject,
        html: `<div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1f2937;">
          ${html}
          <p style="font-size: 12px; color: #94a3b8; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            You received this because you downloaded a resource from our website.
          </p>
        </div>`,
      });

      await db.execute({
        sql: 'UPDATE leads SET follow_up_sent = 1, follow_up_sent_at = ?, updated_at = ? WHERE id = ?',
        args: [new Date().toISOString(), new Date().toISOString(), leadId],
      });

      return Response.json({ success: true, result });
    } catch (emailError) {
      console.error('[api/follow-up] Failed to send email:', emailError);
      return Response.json(
        { success: false, error: emailError.message || 'Failed to send follow-up email.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[api/follow-up/send] Error:', error);
    return Response.json({ success: false, error: 'Failed to send follow-up.' }, { status: 500 });
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
