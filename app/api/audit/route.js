import { getAuditLogs, getAuditLogStats, insertAuditLog } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';

/**
 * GET /api/audit
 * Returns audit log entries. Admin-only.
 *
 * Query params: limit, severity, eventType
 *
 * POST /api/audit
 * Creates an audit log entry. Used by other services to record events.
 * Body: { eventType, entityType, entityId, actor, summary, detailsJson, severity }
 */

export async function GET(request) {
  if (!isAdminAuthenticated()) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const severity = url.searchParams.get('severity') || null;
    const eventType = url.searchParams.get('eventType') || null;
    const stats = url.searchParams.get('stats') === 'true';

    if (stats) {
      const result = await getAuditLogStats();
      return Response.json(result);
    }

    const result = await getAuditLogs(limit, severity, eventType);
    return Response.json(result);
  } catch (error) {
    console.error('[api/audit] GET error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { eventType, entityType, entityId, actor, summary, detailsJson, severity } = body;

    if (!eventType || !summary) {
      return Response.json(
        { success: false, error: 'eventType and summary are required' },
        { status: 400 }
      );
    }

    const result = await insertAuditLog({
      eventType,
      entityType: entityType || null,
      entityId: entityId || null,
      actor: actor || 'system',
      summary,
      detailsJson: detailsJson || null,
      severity: severity || 'info',
    });

    return Response.json(result);
  } catch (error) {
    console.error('[api/audit] POST error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
