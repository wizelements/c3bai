'use client';

import { useState } from 'react';

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-purple-100 text-purple-800',
  proposal: 'bg-orange-100 text-orange-800',
  closed: 'bg-green-100 text-green-800',
  lost: 'bg-gray-100 text-gray-800',
};

const statusOptions = ['new', 'contacted', 'qualified', 'proposal', 'closed', 'lost'];

function formatDate(iso) {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleString();
}

export default function AdminDashboardClient({ inquiries }) {
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState(inquiries);

  const filtered = filter === 'all' ? items : items.filter((i) => i.status === filter);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const result = await response.json();
      if (result.success) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
      } else {
        alert('Failed to update status: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Failed to update status: ' + error.message);
    }
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cod3Black Admin</h1>
            <p className="text-sm text-gray-500">Lead and project management</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm font-medium"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Inquiries</h2>
              <p className="text-sm text-gray-500">
                {items.length} total · {items.filter((i) => i.status === 'new').length} new
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All
              </button>
              {statusOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No inquiries found. Leads submitted through the site will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((inquiry) => (
              <div key={inquiry.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{inquiry.project_name || 'Untitled project'}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[inquiry.status] || 'bg-gray-100 text-gray-800'}`}>
                          {inquiry.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {inquiry.name} · {inquiry.email} · {inquiry.company || 'No company'}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">{formatDate(inquiry.created_at)}</div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-gray-500 text-xs uppercase">Type</div>
                      <div className="font-medium text-gray-900 capitalize">{inquiry.project_type || 'N/A'}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-gray-500 text-xs uppercase">Budget</div>
                      <div className="font-medium text-gray-900">{inquiry.budget_expectation || 'N/A'}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-gray-500 text-xs uppercase">Timeline</div>
                      <div className="font-medium text-gray-900">{inquiry.timeline || 'N/A'}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-gray-500 text-xs uppercase">Contact</div>
                      <div className="font-medium text-gray-900 capitalize">{inquiry.contact_method || 'N/A'}</div>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4">{inquiry.description}</p>

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <select
                      value={inquiry.status}
                      onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>

                    {inquiry.estimate_json && (
                      <div className="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-lg p-3">
                        <strong>Estimate:</strong>{' '}
                        {(() => {
                          try {
                            const est = JSON.parse(inquiry.estimate_json);
                            return `${est.tier} · $${est.monthlyRate}/mo · ${est.estimatedHours} hrs · ${est.estimatedDuration}`;
                          } catch {
                            return 'Estimate unavailable';
                          }
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
