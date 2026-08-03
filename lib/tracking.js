// Lightweight conversion and event tracking for c3bai.
// No external analytics required; events are stored in Turso when available,
// and logged otherwise so they can be replayed or piped elsewhere.

import { getClient } from './db';

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function ensureEventsTable(db) {
  try {
    await db.executeMultiple(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        event_type TEXT NOT NULL,
        event_name TEXT NOT NULL,
        entity_type TEXT,
        entity_id TEXT,
        source TEXT,
        source_url TEXT,
        metadata_json TEXT,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type, event_name);
      CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at);
      CREATE INDEX IF NOT EXISTS idx_events_entity ON events(entity_type, entity_id);
    `);
    return { success: true };
  } catch (error) {
    console.error('[tracking] Failed to ensure events table:', error);
    return { success: false, error: error.message };
  }
}

export async function trackEvent({
  eventType = 'conversion',
  eventName,
  entityType = null,
  entityId = null,
  source = 'web',
  sourceUrl = '',
  metadata = {},
}) {
  if (!eventName) {
    console.warn('[tracking] eventName is required');
    return { success: false, reason: 'missing_event_name' };
  }

  const db = getClient();
  const id = generateId('evt');
  const now = new Date().toISOString();

  // Always log so events are not lost if Turso is missing.
  console.log('[tracking]', { eventType, eventName, entityType, entityId, source, metadata });

  if (!db) {
    return {
      success: true,
      persisted: false,
      reason: 'not_configured',
      id,
    };
  }

  const ensureResult = await ensureEventsTable(db);
  if (!ensureResult.success) {
    return { success: false, error: ensureResult.error, id };
  }

  try {
    await db.execute({
      sql: `
        INSERT INTO events (id, event_type, event_name, entity_type, entity_id, source, source_url, metadata_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        eventType,
        eventName,
        entityType,
        entityId,
        source,
        sourceUrl,
        JSON.stringify(metadata || {}),
        now,
      ],
    });
    return { success: true, persisted: true, id };
  } catch (error) {
    console.error('[tracking] Failed to insert event:', error);
    return { success: false, error: error.message, id };
  }
}

export async function getEvents({ eventType, eventName, limit = 100 } = {}) {
  const db = getClient();
  if (!db) return { success: false, reason: 'not_configured', data: [] };

  await ensureEventsTable(db);

  try {
    let sql = 'SELECT * FROM events';
    const conditions = [];
    const args = [];

    if (eventType) {
      conditions.push('event_type = ?');
      args.push(eventType);
    }
    if (eventName) {
      conditions.push('event_name = ?');
      args.push(eventName);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC LIMIT ?';
    args.push(limit);

    const result = await db.execute({ sql, args });
    return { success: true, data: result.rows || [] };
  } catch (error) {
    console.error('[tracking] getEvents failed:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function getEventCounts() {
  const db = getClient();
  if (!db) return { success: false, reason: 'not_configured', data: null };

  await ensureEventsTable(db);

  try {
    const result = await db.execute({
      sql: `
        SELECT
          event_name,
          COUNT(*) as count,
          SUM(CASE WHEN julianday('now') - julianday(created_at) <= 1 THEN 1 ELSE 0 END) as last_24h
        FROM events
        GROUP BY event_name
        ORDER BY count DESC
      `,
      args: [],
    });
    return { success: true, data: result.rows || [] };
  } catch (error) {
    console.error('[tracking] getEventCounts failed:', error);
    return { success: false, error: error.message, data: null };
  }
}
