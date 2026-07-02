const requiredServerVars = [
  'TURSO_DATABASE_URL',
  'TURSO_AUTH_TOKEN',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'RESEND_TO_EMAIL',
  'ADMIN_PASSWORD',
  'ADMIN_SECRET',
];

const requiredPublicVars = ['NEXT_PUBLIC_APP_URL'];

function missingVars() {
  if (typeof process === 'undefined') return [];
  const missing = [];
  for (const key of requiredServerVars) {
    if (!process.env[key]) missing.push(key);
  }
  for (const key of requiredPublicVars) {
    if (!process.env[key]) missing.push(key);
  }
  return missing;
}

function warnMissing() {
  const missing = missingVars();
  if (missing.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn('[env] Missing environment variables:', missing.join(', '));
  }
}

warnMissing();

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://c3bai-nu.vercel.app',
  turso: {
    url: process.env.TURSO_DATABASE_URL || '',
    authToken: process.env.TURSO_AUTH_TOKEN || '',
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
    fromEmail: process.env.RESEND_FROM_EMAIL || 'hello@c3bai.com',
    toEmail: process.env.RESEND_TO_EMAIL || 'hello@c3bai.com',
  },
  admin: {
    password: process.env.ADMIN_PASSWORD || '',
    secret: process.env.ADMIN_SECRET || '',
  },
  isTursoConfigured() {
    return !!(this.turso.url && this.turso.authToken);
  },
  isResendConfigured() {
    return !!(this.resend.apiKey && this.resend.fromEmail && this.resend.toEmail);
  },
  isAdminConfigured() {
    return !!(this.admin.password && this.admin.secret);
  },
};
