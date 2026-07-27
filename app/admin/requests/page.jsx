'use client';

import { useState, useEffect } from 'react';
import { Zap, ArrowRight, Loader2, RefreshCw, Mail, CheckCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react';

const qualificationColors = {
  NEW: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',
  'NEEDS REVIEW': 'bg-yellow-400/10 text-yellow-300 border-yellow-400/20',
  'NEEDS CLIENT INFORMATION': 'bg-orange-400/10 text-orange-300 border-orange-400/20',
  QUALIFIED: 'bg-purple-400/10 text-purple-300 border-purple-400/20',
  'PROPOSAL READY': 'bg-blue-400/10 text-blue-300 border-blue-400/20',
  'PROPOSAL SENT': 'bg-indigo-400/10 text-indigo-300 border-indigo-400/20',
  'AWAITING DECISION': 'bg-pink-400/10 text-pink-300 border-pink-400/20',
  APPROVED: 'bg-green-400/10 text-green-300 border-green-400/20',
  'NOT A FIT': 'bg-white/5 text-slate-400 border-white/10',
  ARCHIVED: 'bg-white/5 text-slate-400 border-white/10',
};

const qualificationOptions = [
  'NEW', 'NEEDS REVIEW', 'NEEDS CLIENT INFORMATION', 'QUALIFIED',
  'PROPOSAL READY', 'PROPOSAL SENT', 'AWAITING DECISION', 'APPROVED',
  'NOT A FIT', 'ARCHIVED',
];

const statusColors = {
  new: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',
  contacted: 'bg-yellow-400/10 text-yellow-300 border-yellow-400/20',
  qualified: 'bg-purple-400/10 text-purple-300 border-purple-400/20',
  proposal: 'bg-orange-400/10 text-orange-300 border-orange-400/20',
  closed: 'bg-green-400/10 text-green-300 border-green-400/20',
  lost: 'bg-white/5 text-slate-400 border-white/10',
};

function formatDate(iso) {
  if (!iso) return 'N/A';
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor(diff / (1000 * 60));

  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateFull(iso) {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [qualFilter, setQualFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/requests');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (data.success) {
        setRequests(data.data || []);
      } else {
        setError(data.error || 'Failed to load requests');
      }
    } catch (err) {
      setError('Network error loading requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const updateStatus = async (id, field, value) => {
    setUpdating(id);
    try {
      const res = await fetch('/api/admin/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [field]: value }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
        );
        if (selected?.id === id) setSelected((prev) => ({ ...prev, [field]: value }));
      }
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = requests.filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (qualFilter !== 'all' && r.qualification_status !== qualFilter) return false;
    return true;
  });

  const counts = {
    total: requests.length,
    new: requests.filter((r) => r.status === 'new').length,
    needsReview: requests.filter((r) => r.qualification_status === 'NEEDS REVIEW' || r.qualification_status === 'NEW').length,
    qualified: requests.filter((r) => r.qualification_status === 'QUALIFIED' || r.qualification_status === 'APPROVED').length,
  };

  if (loading && requests.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Project Requests</h1>
              <p className="text-xs text-slate-500">Lead management dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/admin"
              className="text-sm text-slate-400 hover:text-slate-200 transition"
            >
              Inquiries
            </a>
            <button
              onClick={fetchRequests}
              className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{counts.total}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Total requests</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-2xl font-bold text-cyan-400">{counts.new}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">New / unread</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-2xl font-bold text-yellow-400">{counts.needsReview}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Needs review</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400">{counts.qualified}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Qualified / approved</div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200"
              >
                <option value="all">All statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="closed">Closed</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">Qualification</label>
              <select
                value={qualFilter}
                onChange={(e) => setQualFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200"
              >
                <option value="all">All stages</option>
                {qualificationOptions.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-400/5 border border-red-400/10 rounded-xl p-4 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Request list */}
        {filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <p className="text-slate-400">No project requests found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((req) => (
              <div
                key={req.id}
                className={`glass-card rounded-2xl overflow-hidden transition cursor-pointer hover:border-cyan-400/20 ${
                  selected?.id === req.id ? 'border-cyan-400/30' : ''
                }`}
                onClick={() => setSelected(selected?.id === req.id ? null : req)}
              >
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-lg font-bold text-white truncate">
                          {req.project_name || 'Untitled project'}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize border ${statusColors[req.status] || 'bg-white/5 text-slate-400 border-white/10'}`}>
                          {req.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${qualificationColors[req.qualification_status] || 'bg-white/5 text-slate-400 border-white/10'}`}>
                          {req.qualification_status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 truncate">
                        {req.name} · {req.email} · {req.company || 'No company'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
                      <Clock size={12} />
                      {formatDate(req.created_at)}
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm mt-3 line-clamp-2">
                    {req.description || 'No description'}
                  </p>

                  {/* Quick info chips */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {req.project_type && (
                      <span className="text-xs bg-white/5 px-2 py-1 rounded-full text-slate-400 capitalize">
                        {req.project_type}
                      </span>
                    )}
                    {req.budget_range && (
                      <span className="text-xs bg-white/5 px-2 py-1 rounded-full text-slate-400">
                        {budgetLabel(req.budget_range)}
                      </span>
                    )}
                    {req.timeline && (
                      <span className="text-xs bg-white/5 px-2 py-1 rounded-full text-slate-400">
                        {timelineLabel(req.timeline)}
                      </span>
                    )}
                    {req.follow_up_approved === 1 && !req.follow_up_sent && (
                      <span className="text-xs bg-yellow-400/10 text-yellow-300 px-2 py-1 rounded-full flex items-center gap-1">
                        <Mail size={10} /> Follow-up ready
                      </span>
                    )}
                    {req.follow_up_sent === 1 && (
                      <span className="text-xs bg-green-400/10 text-green-300 px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={10} /> Follow-up sent
                      </span>
                    )}
                  </div>

                  {/* Expanded detail */}
                  {selected?.id === req.id && (
                    <div className="mt-5 pt-5 border-t border-white/5 animate-fadeIn">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-5">
                        <div>
                          <span className="text-slate-500 text-xs uppercase block mb-1">Contact</span>
                          <p className="text-slate-200">{req.name}</p>
                          <p className="text-slate-400">{req.email}</p>
                          {req.phone && <p className="text-slate-400">{req.phone}</p>}
                          {req.company && <p className="text-slate-400">{req.company}</p>}
                        </div>
                        <div>
                          <span className="text-slate-500 text-xs uppercase block mb-1">Project</span>
                          <p className="text-slate-200">{req.project_name}</p>
                          {req.project_type && <p className="text-slate-400 capitalize">Type: {req.project_type}</p>}
                          {req.current_website && <p className="text-slate-400 truncate">Site: {req.current_website}</p>}
                        </div>
                        <div>
                          <span className="text-slate-500 text-xs uppercase block mb-1">Details</span>
                          {req.budget_range && <p className="text-slate-400">Budget: {budgetLabel(req.budget_range)}</p>}
                          {req.timeline && <p className="text-slate-400">Timeline: {timelineLabel(req.timeline)}</p>}
                          {req.referral_source && <p className="text-slate-400">Source: {req.referral_source}</p>}
                          <p className="text-slate-500 text-xs mt-1">ID: {req.id}</p>
                          <p className="text-slate-500 text-xs">Submitted: {formatDateFull(req.created_at)}</p>
                        </div>
                      </div>

                      {req.desired_outcome && (
                        <div className="mb-4">
                          <span className="text-slate-500 text-xs uppercase block mb-1">Desired outcome</span>
                          <p className="text-slate-300 text-sm bg-white/[0.03] rounded-lg p-3">{req.desired_outcome}</p>
                        </div>
                      )}

                      {req.additional_info && (
                        <div className="mb-4">
                          <span className="text-slate-500 text-xs uppercase block mb-1">Additional info</span>
                          <p className="text-slate-300 text-sm bg-white/[0.03] rounded-lg p-3">{req.additional_info}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-5 pt-4 border-t border-white/5">
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                          <div>
                            <label className="text-xs text-slate-500 block mb-1">Status</label>
                            <select
                              value={req.status}
                              onChange={(e) => updateStatus(req.id, 'status', e.target.value)}
                              disabled={updating === req.id}
                              className="px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-slate-200"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="qualified">Qualified</option>
                              <option value="proposal">Proposal</option>
                              <option value="closed">Closed</option>
                              <option value="lost">Lost</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-slate-500 block mb-1">Qualification</label>
                            <select
                              value={req.qualification_status}
                              onChange={(e) => updateStatus(req.id, 'qualification_status', e.target.value)}
                              disabled={updating === req.id}
                              className="px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-slate-200"
                            >
                              {qualificationOptions.map((q) => (
                                <option key={q} value={q}>{q}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {updating === req.id && (
                          <Loader2 size={16} className="animate-spin text-cyan-400 shrink-0" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function budgetLabel(value) {
  const labels = {
    'under-2500': 'Under $2,500',
    '2500-5000': '$2,500–$5,000',
    '5000-10000': '$5,000–$10,000',
    '10000-plus': '$10,000+',
    'not-sure': 'Not sure',
  };
  return labels[value] || value;
}

function timelineLabel(value) {
  const labels = {
    asap: 'ASAP',
    '1-month': 'Within a month',
    '1-3-months': '1–3 months',
    '3-plus': '3+ months',
    exploring: 'Exploring',
  };
  return labels[value] || value;
}
