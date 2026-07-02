import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { getInquiries } from '@/lib/db';
import AdminDashboardClient from './AdminDashboardClient';

export const metadata = {
  title: 'Admin Dashboard - Cod3Black Agency',
};

export default async function AdminPage() {
  if (!isAdminAuthenticated()) {
    redirect('/admin/login');
  }

  const result = await getInquiries();
  const inquiries = result.success ? result.data : [];

  return <AdminDashboardClient inquiries={inquiries} />;
}
