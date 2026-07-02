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
