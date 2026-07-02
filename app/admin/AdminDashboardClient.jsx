'use client';

import { useState } from 'react';
import { Zap } from 'lucide-react';

const statusColors = {
  new: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',
  contacted: 'bg-yellow-400/10 text-yellow-300 border-yellow-400/20',
  qualified: 'bg-purple-400/10 text-purple-300 border-purple-400/20',
  proposal: 'bg-orange-400/10 text-orange-300 border-orange-400/20',
  closed: 'bg-green-400/10 text-green-300 border-green-400/20',
  lost: 'bg-white/5 text-slate-400 border-white/10',
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
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Cod3Black Admin</h1>
              <p className="text-xs text-slate-500">Lead and project management</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 text-sm font-medium text-slate-300 transition"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Inquiries</h2>
              <p className="text-sm text-slate-400">
                {items.length} total · {items.filter((i) => i.status === 'new').length} new
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${filter === 'all' ? 'bg-cyan-400 text-[#0a0a0f]' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
              >
                All
              </button>
              {statusOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition ${filter === s ? 'bg-cyan-400 text-[#0a0a0f]' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <p className="text-slate-400">No inquiries found. Leads submitted through the site will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((inquiry) => (
              <div key={inquiry.id} className="glass-card rounded-2xl overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                    <div>
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 className="text-lg font-bold text-white">{inquiry.project_name || 'Untitled project'}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${statusColors[inquiry.status] || 'bg-white/5 text-slate-400 border-white/10'}`}>
                          {inquiry.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">
                        {inquiry.name} · {inquiry.email} · {inquiry.company || 'No company'}
                      </p>
                    </div>
                    <div className="text-sm text-slate-500">{formatDate(inquiry.created_at)}</div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5 text-sm">
                    <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
                      <div className="text-slate-500 text-xs uppercase">Type</div>
                      <div className="font-medium text-slate-200 capitalize">{inquiry.project_type || 'N/A'}</div>
                    </div>
                    <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
                      <div className="text-slate-500 text-xs uppercase">Budget</div>
                      <div className="font-medium text-slate-200">{inquiry.budget_expectation || 'N/A'}</div>
                    </div>
                    <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
                      <div className="text-slate-500 text-xs uppercase">Timeline</div>
                      <div className="font-medium text-slate-200">{inquiry.timeline || 'N/A'}</div>
                    </div>
                    <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
                      <div className="text-slate-500 text-xs uppercase">Contact</div>
                      <div className="font-medium text-slate-200 capitalize">{inquiry.contact_method || 'N/A'}</div>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm mb-5">{inquiry.description}</p>

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <select
                      value={inquiry.status}
                      onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                      className="px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-slate-200"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>

                    {inquiry.estimate_json && (
                      <div className="text-sm text-slate-400 bg-cyan-400/5 border border-cyan-400/10 rounded-lg p-3">
                        <strong className="text-slate-200">Estimate:</strong>{' '}
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
