import { getProjectRequests, getProjectRequestById, updateProjectRequestFollowUp, markProjectRequestFollowUpSent } from '@/lib/db';

/**
 * GET /api/follow-up
 * Returns project requests that need follow-up attention.
 *
 * Query params:
 *   - status: 'pending' (has draft, not approved, not sent)
 *             'ready' (approved, not sent)
 *             'sent' (sent)
 *             'all' (default)
 *
 * POST /api/follow-up
 * Body: { requestId, action: 'draft' | 'approve' | 'send' | 'resend' }
 *   - draft: Generate or update a follow-up draft
 *   - approve: Mark draft as approved by owner
 *   - send: Mark follow-up as sent
 *   - resend: Reset sent status to allow re-sending
 */

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'all';

    const result = await getProjectRequests();
    if (!result.success) {
      return Response.json({ success: false, error: result.error }, { status: 500 });
    }

    let filtered = result.data || [];

    switch (status) {
      case 'pending':
        // Has a draft, not approved, not sent
        filtered = filtered.filter(
          (r) => r.follow_up_draft && r.follow_up_approved === 0 && r.follow_up_sent === 0
        );
        break;
      case 'ready':
        // Approved but not sent
        filtered = filtered.filter(
          (r) => r.follow_up_approved === 1 && r.follow_up_sent === 0
        );
        break;
      case 'sent':
        // Already sent
        filtered = filtered.filter((r) => r.follow_up_sent === 1);
        break;
      case 'needs-review':
        // New leads that haven't been triaged
        filtered = filtered.filter(
          (r) => r.qualification_status === 'NEW' || !r.triage_summary
        );
        break;
      case 'all':
      default:
        break;
    }

    return Response.json({
      success: true,
      count: filtered.length,
      data: filtered.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        projectName: r.project_name,
        status: r.status,
        qualificationStatus: r.qualification_status,
        hasDraft: !!r.follow_up_draft,
        draftApproved: r.follow_up_approved === 1,
        draftSent: r.follow_up_sent === 1,
        sentAt: r.follow_up_sent_at,
        createdAt: r.created_at,
      })),
    });
  } catch (error) {
    console.error('[api/follow-up] GET error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { requestId, action } = await request.json();

    if (!requestId || !action) {
      return Response.json(
        { success: false, error: 'requestId and action are required' },
        { status: 400 }
      );
    }

    const validActions = ['draft', 'approve', 'send', 'resend'];
    if (!validActions.includes(action)) {
      return Response.json(
        { success: false, error: `Invalid action. Must be one of: ${validActions.join(', ')}` },
        { status: 400 }
      );
    }

    // Fetch the request
    const result = await getProjectRequestById(requestId);
    if (!result.success || !result.data) {
      return Response.json(
        { success: false, error: 'Project request not found' },
        { status: 404 }
      );
    }

    const req = result.data;

    switch (action) {
      case 'draft': {
        // Generate a follow-up draft based on missing info
        const missingInfo = [];
        if (!req.company) missingInfo.push('Business/company name');
        if (!req.project_type) missingInfo.push('Project type');
        if (!req.current_website) missingInfo.push('Current website or platform');
        if (!req.desired_outcome) missingInfo.push('Desired outcome');
        if (!req.timeline) missingInfo.push('Timeline');
        if (!req.budget_range) missingInfo.push('Budget range');

        const name = req.name || 'there';
        const firstName = name.split(' ')[0];

        let draft;
        if (missingInfo.length > 0) {
          draft = `Hi ${firstName},\n\nThanks again for reaching out about "${req.project_name || 'your project'}".\n\nTo prepare the best proposal, could you share:\n\n`;
          missingInfo.forEach((info) => {
            draft += `- ${info}\n`;
          });
          draft += `\nThe more we know upfront, the more accurate our proposal will be.\n\nLooking forward to learning more!\n\n— Cod3Black Agency`;
        } else {
          draft = `Hi ${firstName},\n\nThanks for your interest in working with Cod3Black Agency on "${req.project_name || 'your project'}".\n\nWe've reviewed your project details and would love to schedule a quick discovery call to discuss your goals and prepare a proposal.\n\nWhat time works best for you this week?\n\n— Cod3Black Agency`;
        }

        const saveResult = await updateProjectRequestFollowUp(requestId, draft);
        if (!saveResult.success) {
          return Response.json({ success: false, error: 'Failed to save draft' }, { status: 500 });
        }

        return Response.json({ success: true, action: 'draft_created', draft });
      }

      case 'approve': {
        if (!req.follow_up_draft) {
          return Response.json(
            { success: false, error: 'No draft to approve. Create a draft first.' },
            { status: 400 }
          );
        }

        // Import and use the approve function
        const { approveProjectRequestFollowUp } = await import('@/lib/db');
        const approveResult = await approveProjectRequestFollowUp(requestId);
        if (!approveResult.success) {
          return Response.json({ success: false, error: 'Failed to approve draft' }, { status: 500 });
        }

        return Response.json({
          success: true,
          action: 'approved',
          message: 'Follow-up draft approved. Ready to send.',
          draft: req.follow_up_draft,
        });
      }

      case 'send': {
        if (req.follow_up_approved !== 1) {
          return Response.json(
            { success: false, error: 'Draft must be approved before sending.' },
            { status: 400 }
          );
        }

        const sendResult = await markProjectRequestFollowUpSent(requestId);
        if (!sendResult.success) {
          return Response.json({ success: false, error: 'Failed to mark as sent' }, { status: 500 });
        }

        return Response.json({
          success: true,
          action: 'sent',
          message: 'Follow-up marked as sent.',
        });
      }

      case 'resend': {
        // Reset sent status so it can be re-sent
        const { updateProjectRequestFollowUp } = await import('@/lib/db');
        const resetResult = await updateProjectRequestFollowUp(requestId, req.follow_up_draft || '');
        if (!resetResult.success) {
          return Response.json({ success: false, error: 'Failed to reset follow-up' }, { status: 500 });
        }

        return Response.json({
          success: true,
          action: 'reset',
          message: 'Follow-up reset. Re-approve and send when ready.',
        });
      }

      default:
        return Response.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[api/follow-up] POST error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
