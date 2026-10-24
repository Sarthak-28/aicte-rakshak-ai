'use client';

import React, { useState } from 'react';
import { InstitutionalApplication, AuditLogEntry } from '@/types';
import { 
  History, 
  Send, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  FileEdit,
  ArrowRight
} from 'lucide-react';

export function AuditTrail({
  application,
  onRefresh,
}: {
  application: InstitutionalApplication;
  onRefresh: () => void;
}) {
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState('OFFICER_OBSERVATION_RECORDED');
  const [submitting, setSubmitting] = useState(false);
  const [role, setRole] = useState('Senior Scrutiny Officer');
  const [actorName, setActorName] = useState('Dr. V. K. Malhotra');

  const handleSubmitObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/applications/${application.id}/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          actor: actorName,
          role,
          remarks,
        }),
      });

      if (res.ok) {
        setRemarks('');
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Officer Observation Form */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 pb-3 border-b border-slate-100">
          <FileEdit className="w-4 h-4 text-teal-600" />
          Record Official Scrutiny Observation / Request Applicant Clarification
        </h4>

        <form onSubmit={handleSubmitObservation} className="mt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Action / Entry Type:
              </label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                <option value="OFFICER_OBSERVATION_RECORDED">Scrutiny Observation</option>
                <option value="CLARIFICATION_REQUESTED">Request Clarification from Applicant</option>
                <option value="PHYSICAL_INSPECTION_RECOMMENDED">Recommend Physical Inspection (EVC)</option>
                <option value="APPROVAL_RECOMMENDED">Recommend for Council Approval</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Authorized Official:
              </label>
              <input
                type="text"
                value={actorName}
                onChange={(e) => setActorName(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Designation / Role:
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                <option value="Senior Scrutiny Officer">Senior Scrutiny Officer</option>
                <option value="Technical Officer">Technical Officer</option>
                <option value="Regional Director">Regional Director</option>
                <option value="Scrutiny Committee Member">Scrutiny Committee Member</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Official Observation / Formal Directive Remarks:
            </label>
            <textarea
              rows={2}
              required
              placeholder="Record clear justification, queries to applicant, or compliance notes..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !remarks.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-semibold bg-[#0f2942] text-white hover:bg-teal-700 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Recording...' : 'Commit Immutable Audit Entry'}
            </button>
          </div>
        </form>
      </div>

      {/* Immutable Audit Trail Timeline */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <History className="w-4 h-4 text-teal-600" />
            Immutable Scrutiny Audit Log ({application.auditTrail.length} records)
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">
            Cryptographically Anchored Log
          </span>
        </div>

        <div className="mt-4 relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {application.auditTrail.map((log) => {
            const isSystem = log.role === 'System' || log.role === 'Automated Rule Engine';

            return (
              <div key={log.id} className="relative group">
                <span className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ring-2 ${
                  isSystem ? 'bg-teal-500 ring-teal-200' : 'bg-[#0f2942] ring-blue-200'
                }`} />

                <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/80 group-hover:bg-slate-50 transition-colors text-xs space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900">{log.actor}</strong>
                      <span className="px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-700 font-medium">
                        {log.role}
                      </span>
                    </div>
                    <span className="text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="font-semibold text-slate-800 pt-0.5">
                    Action: <span className="font-mono text-teal-800">{log.action}</span>
                  </p>

                  {(log.previousValue || log.newValue) && (
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 pt-0.5 font-mono">
                      {log.previousValue && (
                        <span className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                          {log.previousValue}
                        </span>
                      )}
                      {log.previousValue && log.newValue && <ArrowRight className="w-3 h-3 text-slate-400" />}
                      {log.newValue && (
                        <span className="bg-teal-100 text-teal-900 px-1.5 py-0.5 rounded font-bold">
                          {log.newValue}
                        </span>
                      )}
                    </div>
                  )}

                  {log.remarks && (
                    <p className="text-slate-700 text-xs italic bg-white p-2 rounded border border-slate-200/60 mt-1">
                      &ldquo;{log.remarks}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
