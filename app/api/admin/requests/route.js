import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import {
  getProjectRequests,
  updateProjectRequestStatus,
  updateProjectRequestQualification,
  updateProjectRequestOwnerNotes,
} from '@/lib/db';

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const result = await getProjectRequests();
  return NextResponse.json(result);
}

export async function PATCH(request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, qualification_status, owner_notes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }

    if (status) {
      const result = await updateProjectRequestStatus(id, status);
      if (!result.success) {
        return NextResponse.json(result, { status: 500 });
      }
    }

    if (qualification_status) {
      const result = await updateProjectRequestQualification(id, qualification_status, '', '');
      if (!result.success) {
        return NextResponse.json(result, { status: 500 });
      }
    }

    if (owner_notes !== undefined) {
      const result = await updateProjectRequestOwnerNotes(id, owner_notes);
      if (!result.success) {
        return NextResponse.json(result, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[api/admin/requests] PATCH error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
