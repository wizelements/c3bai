import { getProjectRequests, getInquiries, getAuditLogs, getClient } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';

/**
 * GET /api/backup
 * Exports all data as JSON. Admin-only.
 *
 * POST /api/backup/restore
 * Restores data from a JSON export. Admin-only.
 * Body: { data: { project_requests: [...], inquiries: [...], audit_logs: [...] } }
 */

export async function GET(request) {
  if (!isAdminAuthenticated()) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [requestsResult, inquiriesResult, auditResult] = await Promise.all([
      getProjectRequests(),
      getInquiries(),
      getAuditLogs(10000),
    ]);

    const backup = {
      exportedAt: new Date().toISOString(),
      version: '3.0.0',
      data: {
        project_requests: requestsResult.success ? (requestsResult.data || []) : [],
        inquiries: inquiriesResult.success ? (inquiriesResult.data || []) : [],
        audit_logs: auditResult.success ? (auditResult.data || []) : [],
      },
      counts: {
        project_requests: requestsResult.success ? (requestsResult.data || []).length : 0,
        inquiries: inquiriesResult.success ? (inquiriesResult.data || []).length : 0,
        audit_logs: auditResult.success ? (auditResult.data || []).length : 0,
      },
    };

    return Response.json({ success: true, backup });
  } catch (error) {
    console.error('[api/backup] GET error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAdminAuthenticated()) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { data } = body;

    if (!data) {
      return Response.json({ success: false, error: 'No data provided' }, { status: 400 });
    }

    const db = getClient();
    if (!db) {
      return Response.json({ success: false, error: 'Database not configured' }, { status: 500 });
    }

    const results = { project_requests: 0, inquiries: 0, audit_logs: 0 };
    const errors = [];

    // Restore project_requests
    if (Array.isArray(data.project_requests) && data.project_requests.length > 0) {
      for (const row of data.project_requests) {
        try {
          await db.execute({
            sql: `INSERT OR REPLACE INTO project_requests (
              id, status, qualification_status, name, email, company, phone,
              project_name, project_type, description, current_website,
              desired_outcome, timeline, budget_range, referral_source,
              additional_info, source, source_url, triage_summary, triage_json,
              follow_up_draft, follow_up_sent, follow_up_sent_at, follow_up_approved,
              owner_notes, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              row.id, row.status || 'new', row.qualification_status || 'NEW',
              row.name, row.email, row.company || '', row.phone || '',
              row.project_name, row.project_type || '', row.description || '',
              row.current_website || '', row.desired_outcome || '',
              row.timeline || '', row.budget_range || '', row.referral_source || '',
              row.additional_info || '', row.source || 'web', row.source_url || '',
              row.triage_summary || '', row.triage_json || '',
              row.follow_up_draft || '', row.follow_up_sent || 0,
              row.follow_up_sent_at || '', row.follow_up_approved || 0,
              row.owner_notes || '', row.created_at, row.updated_at,
            ],
          });
          results.project_requests++;
        } catch (err) {
          errors.push({ table: 'project_requests', id: row.id, error: err.message });
        }
      }
    }

    // Restore inquiries
    if (Array.isArray(data.inquiries) && data.inquiries.length > 0) {
      for (const row of data.inquiries) {
        try {
          await db.execute({
            sql: `INSERT OR REPLACE INTO inquiries (
              id, status, name, email, company, website, contact_method,
              project_name, project_type, description, problem_statement,
              design_scope, database_needed, integration_count, deployment_requirements,
              special_requirements, timeline, budget_expectation, existing_code,
              team_level, tech_stack, additional_info, partner_qualification,
              partner_details, estimate_json, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              row.id, row.status || 'new', row.name, row.email,
              row.company || '', row.website || '', row.contact_method || '',
              row.project_name || '', row.project_type || '', row.description || '',
              row.problem_statement || '', row.design_scope || '',
              row.database_needed || '', row.integration_count || '',
              row.deployment_requirements || '', row.special_requirements || '',
              row.timeline || '', row.budget_expectation || '', row.existing_code || '',
              row.team_level || '', row.tech_stack || '', row.additional_info || '',
              row.partner_qualification || '', row.partner_details || '',
              row.estimate_json || '', row.created_at, row.updated_at,
            ],
          });
          results.inquiries++;
        } catch (err) {
          errors.push({ table: 'inquiries', id: row.id, error: err.message });
        }
      }
    }

    // Restore audit_logs
    if (Array.isArray(data.audit_logs) && data.audit_logs.length > 0) {
      for (const row of data.audit_logs) {
        try {
          await db.execute({
            sql: `INSERT OR REPLACE INTO audit_log (
              id, event_type, entity_type, entity_id, actor, summary, details_json, severity, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              row.id, row.event_type, row.entity_type || null, row.entity_id || null,
              row.actor || 'system', row.summary, row.details_json || null,
              row.severity || 'info', row.created_at,
            ],
          });
          results.audit_logs++;
        } catch (err) {
          errors.push({ table: 'audit_log', id: row.id, error: err.message });
        }
      }
    }

    return Response.json({
      success: true,
      restored: results,
      errors: errors.length > 0 ? errors : undefined,
      totalRestored: results.project_requests + results.inquiries + results.audit_logs,
    });
  } catch (error) {
    console.error('[api/backup] POST error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
