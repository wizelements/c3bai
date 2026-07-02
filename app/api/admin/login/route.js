import { createAdminSession, getAdminSessionCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const token = createAdminSession(password);

    if (!token) {
      return Response.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': getAdminSessionCookie(token),
        },
      }
    );
  } catch (error) {
    console.error('[api/admin/login] Login error:', error);
    return Response.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
