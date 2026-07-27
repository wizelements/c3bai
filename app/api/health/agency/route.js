import { getAuditLogStats } from '@/lib/db';
import { env } from '@/lib/env';

/**
 * GET /api/health/agency
 *
 * Returns the health status of all Cod3Black Agency systems.
 * This is the operational heartbeat — used by OpenClaw health monitoring
 * and the daily briefing to detect failures.
 *
 * Checks:
 * - Database connectivity
 * - Email service (Resend) configuration
 * - Environment variable presence
 * - Recent audit log errors
 */

async function checkDatabase() {
  try {
    const result = await getAuditLogStats();
    if (result.success) {
      return { status: 'healthy', stats: result.data };
    }
    return { status: 'degraded', message: 'Database responding but audit stats unavailable' };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
}

function checkEnvironment() {
  const checks = {
    appUrl: !!env.appUrl,
    tursoConfigured: env.isTursoConfigured(),
    resendConfigured: env.isResendConfigured(),
    adminConfigured: env.isAdminConfigured(),
  };

  const allConfigured = Object.values(checks).every(Boolean);
  const missing = Object.entries(checks)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  return {
    status: allConfigured ? 'healthy' : 'degraded',
    checks,
    missing: missing.length > 0 ? missing : undefined,
  };
}

export async function GET() {
  const startTime = Date.now();

  const [dbHealth, envHealth] = await Promise.all([
    checkDatabase(),
    Promise.resolve(checkEnvironment()),
  ]);

  const overallStatus =
    dbHealth.status === 'unhealthy' ? 'unhealthy' :
    dbHealth.status === 'degraded' || envHealth.status === 'degraded' ? 'degraded' :
    'healthy';

  const response = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    responseTimeMs: Date.now() - startTime,
    services: {
      database: dbHealth,
      environment: envHealth,
    },
    version: '3.0.0',
  };

  const httpStatus = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;
  return Response.json(response, { status: httpStatus });
}
