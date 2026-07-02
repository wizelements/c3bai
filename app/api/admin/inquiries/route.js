import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getInquiries, updateInquiryStatus } from '@/lib/db';

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const result = await getInquiries();
  return NextResponse.json(result);
}

export async function PATCH(request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Missing id or status' }, { status: 400 });
    }
    const result = await updateInquiryStatus(id, status);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[api/admin/inquiries] PATCH error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
