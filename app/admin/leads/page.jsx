import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { getLeads, getEventCounts } from '@/lib/db';
import AdminLeadsClient from './AdminLeadsClient';

export const metadata = {
  title: 'Leads - Cod3Black Admin',
};

export default async function AdminLeadsPage() {
  if (!isAdminAuthenticated()) {
    redirect('/admin/login');
  }

  const leadsResult = await getLeads();
  const eventsResult = await getEventCounts();

  const leads = leadsResult.success ? leadsResult.data : [];
  const eventCounts = eventsResult.success ? eventsResult.data : [];

  return <AdminLeadsClient leads={leads} eventCounts={eventCounts} />;
}
