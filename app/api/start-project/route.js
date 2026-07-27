import { insertProjectRequest, getProjectRequestsByEmail, insertAuditLog } from '@/lib/db';
import { sendProjectRequestNotifications } from '@/lib/resend';
import { z } from 'zod';

const requestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  company: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  projectName: z.string().min(1, 'Project name is required'),
  projectType: z.string().optional().default(''),
  description: z.string().min(10, 'Please describe your project in at least 10 characters'),
  currentWebsite: z.string().optional().default(''),
  desiredOutcome: z.string().optional().default(''),
  timeline: z.string().optional().default(''),
  budgetRange: z.string().optional().default(''),
  referralSource: z.string().optional().default(''),
  additionalInfo: z.string().optional().default(''),
  source: z.string().optional().default('web'),
  sourceUrl: z.string().optional().default(''),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return Response.json(
        { success: false, error: 'Validation failed', fieldErrors: errors },
        { status: 400 }
      );
    }

    const formData = parsed.data;

    // Check for recent duplicate (same email + project name within 24h)
    const existing = await getProjectRequestsByEmail(formData.email);
    const recentDuplicate = existing.data?.some((r) => {
      if (r.project_name !== formData.projectName) return false;
      const created = new Date(r.created_at);
      const now = new Date();
      const hoursDiff = (now - created) / (1000 * 60 * 60);
      return hoursDiff < 24;
    });

    if (recentDuplicate) {
      return Response.json(
        {
          success: true,
          duplicate: true,
          message: 'We already have your request. We will follow up within 24 hours.',
        },
        { status: 200 }
      );
    }

    // Save to database first — source of truth
    const dbResult = await insertProjectRequest(formData);
    const requestId = dbResult.success ? dbResult.id : null;

    // Audit log the lead capture
    if (requestId) {
      await insertAuditLog({
        eventType: 'lead.captured',
        entityType: 'project_request',
        entityId: requestId,
        actor: 'system',
        summary: `New lead: ${formData.name} — ${formData.projectName}`,
        detailsJson: JSON.stringify({ email: formData.email, source: formData.source, projectType: formData.projectType }),
        severity: 'info',
      }).catch((err) => console.error('[audit] Failed to log lead capture:', err));
    }

    if (!dbResult.success && dbResult.reason !== 'not_configured') {
      console.error('[api/start-project] Database insert failed:', dbResult.error);
      return Response.json(
        { success: false, error: 'Failed to save your request. Please try again.' },
        { status: 500 }
      );
    }

    // Send notifications (best-effort, never rolls back the save)
    let emailResult = { success: false, reason: 'not_attempted' };
    if (requestId) {
      try {
        emailResult = await sendProjectRequestNotifications(formData, requestId);
      } catch (emailError) {
        console.error('[api/start-project] Email notification error:', emailError);
        emailResult = { success: false, error: emailError.message };
      }
    }

    return Response.json(
      {
        success: true,
        requestId,
        dbSaved: dbResult.success,
        emailSent: emailResult.success,
        message: 'Your project request has been received. We will review and contact you within 24 hours.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[api/start-project] Submission error:', error);
    return Response.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
