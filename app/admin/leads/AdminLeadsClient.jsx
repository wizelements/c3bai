'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  Users,
  Mail,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  FileText,
  BarChart3,
} from 'lucide-react';

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatusBadge({ status }) {
  const styles = {
    subscribed: 'bg-green-500/10 text-green-400 border-green-500/20',
    unsubscribed: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    contacted: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    converted: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.subscribed}`}>
      {status}
    </span>
  );
}

export default function AdminLeadsClient({ leads = [], eventCounts = [] }) {
  const [selected, setSelected] = useState(null);
  const [followUp, setFollowUp] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  const totalLeads = leads.length;
  const downloaded = leads.filter((l) => l.downloaded).length;
  const followUpSent = leads.filter((l) => l.follow_up_sent).length;

  const eventMap = {};
  for (const row of eventCounts) {
    eventMap[row.event_name] = row.count;
  }

  async function generateFollowUp(lead) {
    setSelected(lead);
    setFollowUp('');
    setSendResult(null);

    try {
      const res = await fetch('/api/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id, email: lead.email, firstName: lead.first_name }),
      });
      const data = await res.json();
      if (data.success) {
        setFollowUp(data.draft || '');
      } else {
        setSendResult({ error: data.error || 'Failed to generate follow-up.' });
      }
    } catch (err) {
      setSendResult({ error: err.message || 'Failed to generate follow-up.' });
    }
  }

  async function sendFollowUp() {
    if (!selected || !followUp) return;
    setSending(true);
    setSendResult(null);

    try {
      const res = await fetch('/api/follow-up/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: selected.id, draft: followUp }),
      });
      const data = await res.json();
      setSendResult(data);
    } catch (err) {
      setSendResult({ success: false, error: err.message });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-300 transition"
          >
            <ArrowLeft size={16} />
            Back to Admin
          </Link>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="text-cyan-400" size={32} />
            Lead Funnel
          </h1>
          <p className="text-slate-400">Leads captured from the AI Client Acquisition Playbook.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="glass-card rounded-xl p-5">
            <div className="text-2xl font-bold text-white">{totalLeads}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Users size={14} /> Total leads
            </div>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="text-2xl font-bold text-white">{downloaded}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Download size={14} /> Downloaded
            </div>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="text-2xl font-bold text-white">{followUpSent}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Send size={14} /> Follow-ups sent
            </div>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="text-2xl font-bold text-white">{eventMap['lead_magnet_submit'] || 0}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <BarChart3 size={14} /> Form submits
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.03] border-b border-white/10">
                <tr>
                  <th className="px-5 py-4 font-semibold text-slate-300">Name</th>
                  <th className="px-5 py-4 font-semibold text-slate-300">Email</th>
                  <th className="px-5 py-4 font-semibold text-slate-300">Source</th>
                  <th className="px-5 py-4 font-semibold text-slate-300">Status</th>
                  <th className="px-5 py-4 font-semibold text-slate-300">Downloaded</th>
                  <th className="px-5 py-4 font-semibold text-slate-300">Follow-up</th>
                  <th className="px-5 py-4 font-semibold text-slate-300">Created</th>
                  <th className="px-5 py-4 font-semibold text-slate-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-slate-500">
                      No leads yet. Share the lead magnet page to start capturing.
                    </td>
                  </tr>
                )}
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-4 text-white font-medium">
                      {lead.first_name || '—'}
                    </td>
                    <td className="px-5 py-4 text-slate-300">{lead.email}</td>
                    <td className="px-5 py-4 text-slate-400">{lead.source}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-5 py-4">
                      {lead.downloaded ? (
                        <span className="inline-flex items-center gap-1 text-green-400 text-xs">
                          <CheckCircle size={14} /> Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 text-xs">
                          <XCircle size={14} /> No
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {lead.follow_up_sent ? (
                        <span className="inline-flex items-center gap-1 text-green-400 text-xs">
                          <CheckCircle size={14} /> Sent
                        </span>
                      ) : lead.follow_up_draft ? (
                        <span className="inline-flex items-center gap-1 text-cyan-400 text-xs">
                          <FileText size={14} /> Draft
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 text-xs">
                          <Clock size={14} /> None
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-400">{formatDate(lead.created_at)}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => generateFollowUp(lead)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition text-xs font-medium"
                      >
                        <Mail size={14} />
                        Follow-up
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="mt-8 glass-card rounded-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Mail className="text-cyan-400" size={20} />
                Follow-up for {selected.first_name || selected.email}
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                Close
              </button>
            </div>

            <textarea
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              rows={8}
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl p-4 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50"
              placeholder="Click 'Follow-up' on a lead to generate a draft..."
            />

            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-slate-500">
                {sendResult?.success ? (
                  <span className="text-green-400">✓ Follow-up sent</span>
                ) : sendResult?.error ? (
                  <span className="text-red-400">Error: {sendResult.error}</span>
                ) : null}
              </div>
              <button
                onClick={sendFollowUp}
                disabled={!followUp || sending}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-purple-500 text-[#0a0a0f] font-bold rounded-xl hover:shadow-[0_0_40px_rgba(168,85,247,0.35)] transition inline-flex items-center gap-2 disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <Clock className="animate-spin" size={16} /> Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Send Follow-up
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
