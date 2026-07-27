import { getProjectRequests, getAuditLogStats, getAuditLogs } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';

/**
 * GET /api/briefing
 *
 * Generates the daily Cod3Black Agency briefing answering the 10 required questions:
 *
 * 1. Did any new leads arrive?
 * 2. Which leads need a response?
 * 3. Which projects are blocked?
 * 4. Which clients owe information or approval?
 * 5. Which Cod3BlackAgency actions are overdue?
 * 6. Did any production system fail?
 * 7. Are any payments, agreements or proposals unresolved?
 * 8. Which automated jobs failed?
 * 9. What are today's three highest-value actions?
 * 10. Is owner approval required anywhere?
 *
 * Priority order: Revenue at risk > Client trust at risk > Production failure >
 * Deadline risk > Lead-response delay > Approval required > Routine maintenance > Informational
 */

function hoursSince(dateStr) {
  if (!dateStr) return Infinity;
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff / (1000 * 60 * 60);
}

export async function GET(request) {
  if (!isAdminAuthenticated()) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const requestsResult = await getProjectRequests();
    const requests = requestsResult.success ? (requestsResult.data || []) : [];

    const auditResult = await getAuditLogStats();
    const auditStats = auditResult.success ? auditResult.data : null;

    // Get recent errors from audit log
    const errorsResult = await getAuditLogs(20, 'error');
    const recentErrors = errorsResult.success ? (errorsResult.data || []) : [];

    // ── Question 1: New leads (last 24h) ──
    const newLeads = requests.filter((r) => hoursSince(r.created_at) < 24);
    const newLeadsToday = requests.filter((r) => {
      const d = new Date(r.created_at);
      const today = new Date();
      return d.toDateString() === today.toDateString();
    });

    // ── Question 2: Leads needing response ──
    const needsResponse = requests.filter((r) => {
      // New leads not yet contacted, or needs client info without follow-up sent
      return (
        (r.status === 'new' && hoursSince(r.created_at) > 2) ||
        (r.qualification_status === 'NEEDS CLIENT INFORMATION' && !r.follow_up_sent && hoursSince(r.created_at) > 4) ||
        (r.qualification_status === 'NEEDS REVIEW' && hoursSince(r.created_at) > 12)
      );
    });

    // ── Question 3: Blocked projects ──
    // (No project tracking yet in Release 1 — placeholder)
    const blockedProjects = [];

    // ── Question 4: Clients owing info ──
    const awaitingClient = requests.filter(
      (r) => r.qualification_status === 'NEEDS CLIENT INFORMATION' && r.follow_up_sent === 1 && hoursSince(r.follow_up_sent_at) > 48
    );

    // ── Question 5: Overdue actions ──
    const overdueActions = [];
    requests.forEach((r) => {
      if (r.status === 'new' && hoursSince(r.created_at) > 24) {
        overdueActions.push({ type: 'lead_response', requestId: r.id, name: r.name, project: r.project_name, hoursOld: Math.round(hoursSince(r.created_at)) });
      }
      if (r.qualification_status === 'NEEDS CLIENT INFORMATION' && !r.follow_up_sent && hoursSince(r.created_at) > 8) {
        overdueActions.push({ type: 'follow_up_draft', requestId: r.id, name: r.name, project: r.project_name, hoursOld: Math.round(hoursSince(r.created_at)) });
      }
      if (r.follow_up_approved === 1 && !r.follow_up_sent && hoursSince(r.created_at) > 2) {
        overdueActions.push({ type: 'send_follow_up', requestId: r.id, name: r.name, project: r.project_name, hoursOld: Math.round(hoursSince(r.created_at)) });
      }
    });

    // ── Question 6: Production failures ──
    const productionFailures = recentErrors.filter((e) => {
      const text = (e.summary || '').toLowerCase();
      return text.includes('deploy') || text.includes('crash') || text.includes('outage') || text.includes('500');
    });

    // ── Question 7: Unresolved proposals/payments ──
    const unresolvedProposals = requests.filter(
      (r) => r.qualification_status === 'PROPOSAL SENT' || r.qualification_status === 'AWAITING DECISION'
    );

    // ── Question 8: Failed automated jobs ──
    const failedJobs = recentErrors.filter((e) => {
      const text = (e.summary || '').toLowerCase();
      return text.includes('job') || text.includes('cron') || text.includes('automation') || text.includes('webhook');
    });

    // ── Question 9: Today's three highest-value actions ──
    const highValueActions = [];
    // Priority 1: Leads that have been waiting longest
    const oldestNew = requests.filter((r) => r.status === 'new').sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    if (oldestNew.length > 0) {
      highValueActions.push({
        priority: 1,
        action: `Respond to ${oldestNew[0].name} about "${oldestNew[0].project_name}"`,
        reason: `Lead waiting ${Math.round(hoursSince(oldestNew[0].created_at))}h — revenue at risk`,
        requestId: oldestNew[0].id,
      });
    }
    // Priority 2: Follow-up drafts that need approval
    const pendingApproval = requests.filter((r) => r.follow_up_draft && r.follow_up_approved === 0);
    if (pendingApproval.length > 0) {
      highValueActions.push({
        priority: 2,
        action: `Review and approve follow-up for ${pendingApproval[0].name}`,
        reason: 'Client waiting for response — trust at risk',
        requestId: pendingApproval[0].id,
      });
    }
    // Priority 3: Approved drafts that need sending
    const readyToSend = requests.filter((r) => r.follow_up_approved === 1 && r.follow_up_sent === 0);
    if (readyToSend.length > 0) {
      highValueActions.push({
        priority: 3,
        action: `Send approved follow-up to ${readyToSend[0].name}`,
        reason: 'Approved message waiting to go out',
        requestId: readyToSend[0].id,
      });
    }

    // ── Question 10: Owner approval required ──
    const needsApproval = requests.filter(
      (r) => r.follow_up_draft && r.follow_up_approved === 0
    ).map((r) => ({
      requestId: r.id,
      name: r.name,
      project: r.project_name,
      type: 'follow_up_draft',
    }));

    // ── Build the briefing ──
    const briefing = {
      generatedAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      summary: {
        totalLeads: requests.length,
        newLeadsToday: newLeadsToday.length,
        needsResponse: needsResponse.length,
        blockedProjects: blockedProjects.length,
        awaitingClient: awaitingClient.length,
        overdueActions: overdueActions.length,
        unresolvedProposals: unresolvedProposals.length,
        failedJobs: failedJobs.length,
        needsApproval: needsApproval.length,
        auditErrors24h: auditStats?.last_24h || 0,
      },
      questions: [
        {
          q: 1,
          question: 'Did any new leads arrive?',
          answer: newLeadsToday.length > 0
            ? `Yes, ${newLeadsToday.length} new lead(s) today.`
            : newLeads.length > 0
              ? `Yes, ${newLeads.length} lead(s) in the last 24 hours.`
              : 'No new leads.',
          leads: newLeadsToday.length > 0 ? newLeadsToday.map((r) => ({
            id: r.id, name: r.name, project: r.project_name, email: r.email, time: r.created_at,
          })) : undefined,
        },
        {
          q: 2,
          question: 'Which leads need a response?',
          answer: needsResponse.length > 0
            ? `${needsResponse.length} lead(s) need attention.`
            : 'All leads have been responded to.',
          leads: needsResponse.length > 0 ? needsResponse.map((r) => ({
            id: r.id, name: r.name, project: r.project_name, status: r.status, qualification: r.qualification_status,
          })) : undefined,
        },
        {
          q: 3,
          question: 'Which projects are blocked?',
          answer: blockedProjects.length > 0
            ? `${blockedProjects.length} project(s) blocked.`
            : 'No blocked projects. (Project tracking not yet active — Release 3)',
        },
        {
          q: 4,
          question: 'Which clients owe information or approval?',
          answer: awaitingClient.length > 0
            ? `${awaitingClient.length} client(s) have not responded to follow-up.`
            : 'No clients waiting on us.',
          leads: awaitingClient.length > 0 ? awaitingClient.map((r) => ({
            id: r.id, name: r.name, project: r.project_name,
          })) : undefined,
        },
        {
          q: 5,
          question: 'Which Cod3BlackAgency actions are overdue?',
          answer: overdueActions.length > 0
            ? `${overdueActions.length} action(s) overdue.`
            : 'No overdue actions.',
          actions: overdueActions.length > 0 ? overdueActions : undefined,
        },
        {
          q: 6,
          question: 'Did any production system fail?',
          answer: productionFailures.length > 0
            ? `${productionFailures.length} production issue(s) detected.`
            : 'No production failures detected.',
          errors: productionFailures.length > 0 ? productionFailures.map((e) => ({
            summary: e.summary, time: e.created_at,
          })) : undefined,
        },
        {
          q: 7,
          question: 'Are any payments, agreements or proposals unresolved?',
          answer: unresolvedProposals.length > 0
            ? `${unresolvedProposals.length} proposal(s) awaiting decision.`
            : 'No unresolved proposals.',
          proposals: unresolvedProposals.length > 0 ? unresolvedProposals.map((r) => ({
            id: r.id, name: r.name, project: r.project_name,
          })) : undefined,
        },
        {
          q: 8,
          question: 'Which automated jobs failed?',
          answer: failedJobs.length > 0
            ? `${failedJobs.length} automated job(s) failed.`
            : 'No automated job failures detected.',
          errors: failedJobs.length > 0 ? failedJobs.map((e) => ({
            summary: e.summary, time: e.created_at,
          })) : undefined,
        },
        {
          q: 9,
          question: "What are today's three highest-value actions?",
          answer: highValueActions.length > 0
            ? highValueActions.map((a) => `P${a.priority}: ${a.action}`).join(' | ')
            : 'No high-value actions identified.',
          actions: highValueActions,
        },
        {
          q: 10,
          question: 'Is owner approval required anywhere?',
          answer: needsApproval.length > 0
            ? `Yes, ${needsApproval.length} item(s) need your approval.`
            : 'No approvals needed.',
          items: needsApproval.length > 0 ? needsApproval : undefined,
        },
      ],
      priorityItems: [
        ...(highValueActions.map((a) => ({ ...a, category: 'revenue_risk' }))),
        ...(productionFailures.length > 0 ? [{ priority: 4, category: 'production_failure', action: 'Investigate production errors', count: productionFailures.length }] : []),
        ...(overdueActions.length > 0 ? [{ priority: 5, category: 'overdue', action: `${overdueActions.length} overdue action(s)`, items: overdueActions }] : []),
        ...(needsApproval.length > 0 ? [{ priority: 6, category: 'approval_required', action: `${needsApproval.length} item(s) need approval` }] : []),
      ],
    };

    return Response.json({ success: true, briefing });
  } catch (error) {
    console.error('[api/briefing] Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
