import { getProjectRequestById, updateProjectRequestFollowUp, approveProjectRequestFollowUp, markProjectRequestFollowUpSent } from '@/lib/db';

/**
 * POST /api/approve-follow-up
 *
 * Webhook endpoint designed for Tasker integration.
 * Allows approving or rejecting follow-up drafts from a phone notification.
 *
 * Body: {
 *   requestId: string,
 *   action: 'approve' | 'reject' | 'send',
 *   secret: string  // Simple shared secret for Tasker auth
 * }
 */

const TASKER_SECRET = process.env.TASKER_SECRET || 'cba-tasker-2026';

export async function POST(request) {
  try {
    const body = await request.json();
    const { requestId, action, secret } = body;

    // Simple auth check
    if (secret !== TASKER_SECRET) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!requestId || !action) {
      return Response.json(
        { success: false, error: 'requestId and action are required' },
        { status: 400 }
      );
    }

    const validActions = ['approve', 'reject', 'send'];
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
      case 'approve': {
        if (!req.follow_up_draft) {
          return Response.json(
            { success: false, error: 'No draft to approve' },
            { status: 400 }
          );
        }
        const approveResult = await approveProjectRequestFollowUp(requestId);
        if (!approveResult.success) {
          return Response.json({ success: false, error: 'Failed to approve' }, { status: 500 });
        }
        return Response.json({
          success: true,
          action: 'approved',
          message: `Follow-up for ${req.name || 'lead'} approved.`,
          draft: req.follow_up_draft,
        });
      }

      case 'reject': {
        // Clear the draft so it can be rewritten
        const clearResult = await updateProjectRequestFollowUp(requestId, '');
        if (!clearResult.success) {
          return Response.json({ success: false, error: 'Failed to reject draft' }, { status: 500 });
        }
        return Response.json({
          success: true,
          action: 'rejected',
          message: `Follow-up for ${req.name || 'lead'} rejected. Draft cleared.`,
        });
      }

      case 'send': {
        if (req.follow_up_approved !== 1) {
          return Response.json(
            { success: false, error: 'Draft must be approved before sending' },
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
          message: `Follow-up for ${req.name || 'lead'} marked as sent.`,
        });
      }

      default:
        return Response.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[api/approve-follow-up] Error:', error);
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
