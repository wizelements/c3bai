import { createClient } from '@libsql/client/web';
import { env } from './env';

let client = null;

function getClient() {
  if (client) return client;
  if (!env.isTursoConfigured()) {
    return null;
  }
  client = createClient({
    url: env.turso.url,
    authToken: env.turso.authToken,
  });
  return client;
}

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'new',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  website TEXT,
  contact_method TEXT,
  project_name TEXT,
  project_type TEXT,
  description TEXT,
  problem_statement TEXT,
  design_scope TEXT,
  database_needed TEXT,
  integration_count TEXT,
  deployment_requirements TEXT,
  special_requirements TEXT,
  timeline TEXT,
  budget_expectation TEXT,
  existing_code TEXT,
  team_level TEXT,
  tech_stack TEXT,
  additional_info TEXT,
  partner_qualification TEXT,
  partner_details TEXT,
  estimate_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  client_name TEXT,
  client_email TEXT,
  tags TEXT,
  url TEXT,
  stats TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at);

CREATE TABLE IF NOT EXISTS project_requests (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'new',
  qualification_status TEXT NOT NULL DEFAULT 'NEW',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  project_name TEXT NOT NULL,
  project_type TEXT,
  description TEXT NOT NULL,
  current_website TEXT,
  desired_outcome TEXT,
  timeline TEXT,
  budget_range TEXT,
  referral_source TEXT,
  additional_info TEXT,
  source TEXT NOT NULL DEFAULT 'web',
  source_url TEXT,
  triage_summary TEXT,
  triage_json TEXT,
  follow_up_draft TEXT,
  follow_up_sent INTEGER NOT NULL DEFAULT 0,
  follow_up_sent_at TEXT,
  follow_up_approved INTEGER NOT NULL DEFAULT 0,
  owner_notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_project_requests_status ON project_requests(status);
CREATE INDEX IF NOT EXISTS idx_project_requests_qualification ON project_requests(qualification_status);
CREATE INDEX IF NOT EXISTS idx_project_requests_created ON project_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_project_requests_email ON project_requests(email);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  actor TEXT NOT NULL DEFAULT 'system',
  summary TEXT NOT NULL,
  details_json TEXT,
  severity TEXT NOT NULL DEFAULT 'info',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_event_type ON audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_severity ON audit_log(severity);
`;

export async function setupSchema() {
  const db = getClient();
  if (!db) {
    console.warn('[db] Turso not configured; skipping schema setup.');
    return { success: false, reason: 'not_configured' };
  }
  try {
    await db.executeMultiple(SCHEMA_SQL);
    return { success: true };
  } catch (error) {
    console.error('[db] Schema setup failed:', error);
    return { success: false, error: error.message };
  }
}

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function insertInquiry(formData, estimate) {
  const db = getClient();
  if (!db) {
    console.warn('[db] Turso not configured; inquiry not persisted.');
    return { success: false, reason: 'not_configured' };
  }

  await setupSchema();

  const id = generateId('inq');
  const now = new Date().toISOString();

  try {
    await db.execute({
      sql: `
        INSERT INTO inquiries (
          id, status, name, email, company, website, contact_method,
          project_name, project_type, description, problem_statement,
          design_scope, database_needed, integration_count, deployment_requirements,
          special_requirements, timeline, budget_expectation, existing_code,
          team_level, tech_stack, additional_info, partner_qualification,
          partner_details, estimate_json, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        'new',
        formData.name || '',
        formData.email || '',
        formData.company || '',
        formData.website || '',
        formData.contactMethod || '',
        formData.projectName || '',
        formData.projectType || '',
        formData.description || '',
        formData.problemStatement || '',
        formData.designScope || '',
        formData.databaseNeeded || '',
        formData.integrationCount || '',
        Array.isArray(formData.deploymentRequirements) ? formData.deploymentRequirements.join(',') : formData.deploymentRequirements || '',
        Array.isArray(formData.specialRequirements) ? formData.specialRequirements.join(',') : formData.specialRequirements || '',
        formData.timeline || '',
        formData.budgetExpectation || '',
        formData.existingCode || '',
        formData.teamLevel || '',
        formData.techStack || '',
        formData.additionalInfo || '',
        formData.partnerQualification || '',
        formData.partnerDetails || '',
        JSON.stringify(estimate || {}),
        now,
        now,
      ],
    });
    return { success: true, id };
  } catch (error) {
    console.error('[db] insertInquiry failed:', error);
    return { success: false, error: error.message };
  }
}

export async function getInquiries(status = null, limit = 200) {
  const db = getClient();
  if (!db) return { success: false, reason: 'not_configured', data: [] };

  await setupSchema();

  try {
    const sql = status
      ? 'SELECT * FROM inquiries WHERE status = ? ORDER BY created_at DESC LIMIT ?'
      : 'SELECT * FROM inquiries ORDER BY created_at DESC LIMIT ?';
    const args = status ? [status, limit] : [limit];
    const result = await db.execute({ sql, args });
    return { success: true, data: result.rows || [] };
  } catch (error) {
    console.error('[db] getInquiries failed:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function updateInquiryStatus(id, status) {
  const db = getClient();
  if (!db) return { success: false, reason: 'not_configured' };

  try {
    await db.execute({
      sql: 'UPDATE inquiries SET status = ?, updated_at = ? WHERE id = ?',
      args: [status, new Date().toISOString(), id],
    });
    return { success: true };
  } catch (error) {
    console.error('[db] updateInquiryStatus failed:', error);
    return { success: false, error: error.message };
  }
}

export async function getInquiryById(id) {
  const db = getClient();
  if (!db) return { success: false, reason: 'not_configured', data: null };

  try {
    const result = await db.execute({
      sql: 'SELECT * FROM inquiries WHERE id = ?',
      args: [id],
    });
    return { success: true, data: result.rows?.[0] || null };
  } catch (error) {
    console.error('[db] getInquiryById failed:', error);
    return { success: false, error: error.message, data: null };
  }
}

export async function seedProjectsIfEmpty(projects) {
  const db = getClient();
  if (!db) return { success: false, reason: 'not_configured' };

  await setupSchema();

  try {
    const existing = await db.execute({
      sql: 'SELECT COUNT(*) as count FROM projects',
      args: [],
    });
    const count = existing.rows?.[0]?.count || 0;
    if (Number(count) > 0) return { success: true, seeded: false };

    for (const project of projects) {
      const id = generateId('proj');
      const now = new Date().toISOString();
      await db.execute({
        sql: `
          INSERT INTO projects (
            id, name, description, status, client_name, client_email,
            tags, url, stats, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          id,
          project.name || '',
          project.description || '',
          'active',
          project.clientName || '',
          project.clientEmail || '',
          Array.isArray(project.tags) ? project.tags.join(',') : project.tags || '',
          project.url || '',
          Array.isArray(project.stats) ? project.stats.join('|') : project.stats || '',
          now,
          now,
        ],
      });
    }
    return { success: true, seeded: true };
  } catch (error) {
    console.error('[db] seedProjectsIfEmpty failed:', error);
    return { success: false, error: error.message };
  }
}

export async function getProjects(limit = 100) {
  const db = getClient();
  if (!db) return { success: false, reason: 'not_configured', data: [] };

  await setupSchema();

  try {
    const result = await db.execute({
      sql: 'SELECT * FROM projects ORDER BY created_at DESC LIMIT ?',
      args: [limit],
    });
    return { success: true, data: result.rows || [] };
  } catch (error) {
    console.error('[db] getProjects failed:', error);
    return { success: false, error: error.message, data: [] };
  }
}

// ─── Project Requests (Release 1) ────────────────────────────────────────────

export async function insertProjectRequest(formData) {
  const db = getClient();
  if (!db) {
    console.warn('[db] Turso not configured; project request not persisted.');
    return { success: false, reason: 'not_configured' };
  }

  await setupSchema();

  const id = generateId('req');
  const now = new Date().toISOString();

  try {
    await db.execute({
      sql: `
        INSERT INTO project_requests (
          id, status, qualification_status, name, email, company, phone,
          project_name, project_type, description, current_website,
          desired_outcome, timeline, budget_range, referral_source,
          additional_info, source, source_url, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        'new',
        'NEW',
        formData.name || '',
        formData.email || '',
        formData.company || '',
        formData.phone || '',
        formData.projectName || '',
        formData.projectType || '',
        formData.description || '',
        formData.currentWebsite || '',
        formData.desiredOutcome || '',
        formData.timeline || '',
        formData.budgetRange || '',
        formData.referralSource || '',
        formData.additionalInfo || '',
        formData.source || 'web',
        formData.sourceUrl || '',
        now,
        now,
      ],
    });
    return { success: true, id };
  } catch (error) {
    console.error('[db] insertProjectRequest failed:', error);
    return { success: false, error: error.message };
  }
}

export async function getProjectRequests(status = null, limit = 200) {
  const db = getClient();
  if (!db) return { success: false, reason: 'not_configured', data: [] };

  await setupSchema();

  try {
    let sql, args;
    if (status) {
      sql = 'SELECT * FROM project_requests WHERE status = ? ORDER BY created_at DESC LIMIT ?';
      args = [status, limit];
    } else {
      sql = 'SELECT * FROM project_requests ORDER BY created_at DESC LIMIT ?';
      args = [limit];
    }
    const result = await db.execute({ sql, args });
    return { success: true, data: result.rows || [] };
  } catch (error) {
    console.error('[db] getProjectRequests failed:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function getProjectRequestById(id) {
  const db = getClient();
  if (!db) return { success: false, reason: 'not_configured', data: null };

  try {
    const result = await db.execute({
      sql: 'SELECT * FROM project_requests WHERE id = ?',
      args: [id],
    });
    return { success: true, data: result.rows?.[0] || null };
  } catch (error) {
    console.error('[db] getProjectRequestById failed:', error);
    return { success: false, error: error.message, data: null };
  }
}

export async function updateProjectRequestStatus(id, status) {
  const db = getClient();
  if (!db) return { success: false, reason: 'not_configured' };

  try {
    await db.execute({
      sql: 'UPDATE project_requests SET status = ?, updated_at = ? WHERE id = ?',
      args: [status, new Date().toISOString(), id],
    });
    return { success: true };
  } catch (error) {
    console.error('[db] updateProjectRequestStatus failed:', error);
    return { success: false, error: error.message };
  }
}

export async function updateProjectRequestQualification(id, qualificationStatus, triageSummary, triageJson) {
  const db = getClient();
  if (!db) return { success: false, reason: 'not_configured' };

  try {
    await db.execute({
      sql: 'UPDATE project_requests SET qualification_status = ?, triage_summary = ?, triage_json = ?, updated_at = ? WHERE id = ?',
      args: [qualificationStatus, triageSummary || '', triageJson || '', new Date().toISOString(), id],
    });
    return { success: true };
  } catch (error) {
    console.error('[db] updateProjectRequestQualification failed:', error);
    return { success: false, error: error.message };
  }
}

export async function updateProjectRequestFollowUp(id, draft) {
  const db = getClient();
  if (!db) return { success: false, reason: 'not_configured' };

  try {
    await db.execute({
      sql: 'UPDATE project_requests SET follow_up_draft = ?, follow_up_approved = 0, updated_at = ? WHERE id = ?',
      args: [draft || '', new Date().toISOString(), id],
    });
    return { success: true };
  } catch (error) {
    console.error('[db] updateProjectRequestFollowUp failed:', error);
    return { success: false, error: error.message };
  }
}

export async function approveProjectRequestFollowUp(id) {
  const db = getClient();
  if (!db) return { success: false, reason: 'not_configured' };

  try {
    await db.execute({
      sql: 'UPDATE project_requests SET follow_up_approved = 1, updated_at = ? WHERE id = ?',
      args: [new Date().toISOString(), id],
    });
    return { success: true };
  } catch (error) {
    console.error('[db] approveProjectRequestFollowUp failed:', error);
    return { success: false, error: error.message };
  }
}

export async function markProjectRequestFollowUpSent(id) {
  const db = getClient();
  if (!db) return { success: false, reason: 'not_configured' };

  try {
    await db.execute({
      sql: 'UPDATE project_requests SET follow_up_sent = 1, follow_up_sent_at = ?, updated_at = ? WHERE id = ?',
      args: [new Date().toISOString(), new Date().toISOString(), id],
    });
    return { success: true };
  } catch (error) {
    console.error('[db] markProjectRequestFollowUpSent failed:', error);
    return { success: false, error: error.message };
  }
}

export async function updateProjectRequestOwnerNotes(id, notes) {
  const db = getClient();
  if (!db) return { success: false, reason: 'not_configured' };

  try {
    await db.execute({
      sql: 'UPDATE project_requests SET owner_notes = ?, updated_at = ? WHERE id = ?',
      args: [notes || '', new Date().toISOString(), id],
    });
    return { success: true };
  } catch (error) {
    console.error('[db] updateProjectRequestOwnerNotes failed:', error);
    return { success: false, error: error.message };
  }
}

export async function getProjectRequestsByEmail(email) {
  const db = getClient();
  if (!db) return { success: false, reason: 'not_configured', data: [] };

  try {
    const result = await db.execute({
      sql: 'SELECT * FROM project_requests WHERE email = ? ORDER BY created_at DESC',
      args: [email],
    });
    return { success: true, data: result.rows || [] };
  } catch (error) {
    console.error('[db] getProjectRequestsByEmail failed:', error);
    return { success: false, error: error.message, data: [] };
  }
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

export async function insertAuditLog({ eventType, entityType, entityId, actor, summary, detailsJson, severity }) {
  const db = getClient();
  if (!db) return { success: false, reason: 'not_configured' };

  await setupSchema();

  const id = generateId('aud');
  const now = new Date().toISOString();

  try {
    await db.execute({
      sql: `INSERT INTO audit_log (id, event_type, entity_type, entity_id, actor, summary, details_json, severity, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        eventType || 'unknown',
        entityType || null,
        entityId || null,
        actor || 'system',
        summary || '',
        detailsJson || null,
        severity || 'info',
        now,
      ],
    });
    return { success: true, id };
  } catch (error) {
    console.error('[db] insertAuditLog failed:', error);
    return { success: false, error: error.message };
  }
}

export async function getAuditLogs(limit = 100, severity = null, eventType = null) {
  const db = getClient();
  if (!db) return { success: false, reason: 'not_configured', data: [] };

  await setupSchema();

  try {
    let sql = 'SELECT * FROM audit_log';
    const conditions = [];
    const args = [];

    if (severity) {
      conditions.push('severity = ?');
      args.push(severity);
    }
    if (eventType) {
      conditions.push('event_type = ?');
      args.push(eventType);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC LIMIT ?';
    args.push(limit);

    const result = await db.execute({ sql, args });
    return { success: true, data: result.rows || [] };
  } catch (error) {
    console.error('[db] getAuditLogs failed:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function getAuditLogsByEntity(entityType, entityId, limit = 50) {
  const db = getClient();
  if (!db) return { success: false, reason: 'not_configured', data: [] };

  try {
    const result = await db.execute({
      sql: 'SELECT * FROM audit_log WHERE entity_type = ? AND entity_id = ? ORDER BY created_at DESC LIMIT ?',
      args: [entityType, entityId, limit],
    });
    return { success: true, data: result.rows || [] };
  } catch (error) {
    console.error('[db] getAuditLogsByEntity failed:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function getAuditLogStats() {
  const db = getClient();
  if (!db) return { success: false, reason: 'not_configured', data: null };

  await setupSchema();

  try {
    const result = await db.execute({
      sql: `SELECT
              COUNT(*) as total,
              SUM(CASE WHEN severity = 'error' THEN 1 ELSE 0 END) as errors,
              SUM(CASE WHEN severity = 'warn' THEN 1 ELSE 0 END) as warnings,
              SUM(CASE WHEN created_at >= datetime('now', '-24 hours') THEN 1 ELSE 0 END) as last_24h
            FROM audit_log`,
      args: [],
    });
    return { success: true, data: result.rows?.[0] || null };
  } catch (error) {
    console.error('[db] getAuditLogStats failed:', error);
    return { success: false, error: error.message, data: null };
  }
}
