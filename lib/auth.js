import { cookies } from 'next/headers';
import { createHmac } from 'node:crypto';
import { env } from './env';

const COOKIE_NAME = 'admin_session';

function hashPassword(password) {
  const secret = env.admin.secret || 'fallback-secret';
  return createHmac('sha256', secret).update(password).digest('hex');
}

export function isAdminAuthenticated() {
  if (!env.isAdminConfigured()) return false;

  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;
    if (!sessionCookie) return false;

    const expected = hashPassword(env.admin.password);
    return sessionCookie === expected;
  } catch (error) {
    console.error('[auth] isAdminAuthenticated error:', error);
    return false;
  }
}

export function createAdminSession(password) {
  if (!env.isAdminConfigured()) return null;
  if (password !== env.admin.password) return null;
  return hashPassword(password);
}

export function getAdminLogoutCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function getAdminSessionCookie(token) {
  // 7 days
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`;
}
