'use client';

import React, { useState } from 'react';
import { InstitutionalApplication, ValidationFinding } from '@/types';
import { SeverityBadge } from '@/components/common/Badge';
import { 
  ShieldAlert, 
  RotateCw, 
  CheckCircle, 
  FileCheck, 
  MessageSquare, 
  HelpCircle, 
  ArrowRight,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export function ValidationFindings({
  application,
  onRefresh,
}: {
  application: InstitutionalApplication;
  onRefresh: () => void;
}) {
  const [revalidating, setRevalidating] = useState(false);
  const [actingFindingId, setActingFindingId] = useState<string | null>(null);
  const [waiveNotes, setWaiveNotes] = useState<Record<string, string>>({});
  const [activeWaiveModal, setActiveWaiveModal] = useState<string | null>(null);

  const handleRevalidate = async () => {
    setRevalidating(true);
    try {
      const res = await fetch(`/api/applications/${application.id}/validate`, {
        method: 'POST',
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRevalidating(false);
    }
  };

  const handleUpdateFinding = async (findingId: string, status: 'RESOLVED' | 'WAIVED', notes?: string) => {
    setActingFindingId(findingId);
    try {
      const res = await fetch(`/api/applications/${application.id}/findings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          findingId,
          status,
          notes: notes || (status === 'RESOLVED' ? 'Officer confirmed corrective evidence submitted' : 'Waived under delegated scrutiny discretionary powers'),
        }),
      });

      if (res.ok) {
        setActiveWaiveModal(null);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActingFindingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Banner */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-teal-600" />
            Deterministic Validation Engine & Evidence Review
          </h3>
          <p className="text-xs text-slate-500">
            Advisory findings generated from objective cross-document and temporal validation checks
          </p>
        </div>

        <button
          onClick={handleRevalidate}
          disabled={revalidating}
          className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold bg-[#0f2942] text-white hover:bg-teal-700 transition-colors cursor-pointer shadow-2xs"
        >
          <RotateCw className={`w-3.5 h-3.5 ${revalidating ? 'animate-spin' : ''}`} />
          {revalidating ? 'Re-Evaluating Rules...' : 'Re-Run Validation Engine'}
        </button>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {application.findings.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-900">Zero Compliance Anomalies Detected</h4>
            <p className="text-xs text-emerald-700 max-w-md mx-auto">
              All 8 deterministic validation rules passed successfully. Sponsoring trust names, land metrics, certificates, and dates are fully consistent.
            </p>
          </div>
        ) : (
          application.findings.map((finding) => {
            const isOpen = finding.reviewStatus === 'OPEN';
            return (
              <div
                key={finding.id}
                className={`bg-white rounded-lg border shadow-2xs transition-all overflow-hidden ${
                  !isOpen
                    ? 'border-slate-200 opacity-80 bg-slate-50/50'
                    : finding.severity === 'CRITICAL'
                    ? 'border-rose-200 border-l-4 border-l-rose-600'
                    : 'border-amber-200 border-l-4 border-l-amber-500'
                }`}
              >
                {/* Header */}
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <SeverityBadge severity={finding.severity} />
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {finding.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Rule: <code className="font-mono text-slate-800">{finding.ruleId}</code>
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        Category: {finding.category.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          finding.reviewStatus === 'OPEN'
                            ? 'bg-rose-100 text-rose-800'
                            : finding.reviewStatus === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        Status: {finding.reviewStatus}
                      </span>
                    </div>
                  </div>

                  {/* Title & Explanation */}
                  <div className="mt-3 space-y-2">
                    <h4 className="text-sm font-bold text-slate-900">{finding.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{finding.explanation}</p>
                  </div>

                  {/* Evidence Box */}
                  <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wide">
                        Underlying Document Evidence
                      </span>
                      {finding.evidence.documentName && (
                        <span className="font-mono text-[11px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {finding.evidence.documentName}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {finding.evidence.expectedValue && (
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Expected Regulatory Value</span>
                          <p className="font-medium text-emerald-800 bg-emerald-50/70 p-1.5 rounded border border-emerald-200">
                            {finding.evidence.expectedValue}
                          </p>
                        </div>
                      )}
                      {finding.evidence.extractedValue && (
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Extracted Submitted Value</span>
                          <p className="font-medium text-rose-800 bg-rose-50/70 p-1.5 rounded border border-rose-200">
                            {finding.evidence.extractedValue}
                          </p>
                        </div>
                      )}
                    </div>

                    {finding.evidence.excerpt && (
                      <div className="pt-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Document Excerpt Citation:</span>
                        <p className="italic text-slate-700 bg-white p-2 rounded border border-slate-200 text-[11px]">
                          &ldquo;{finding.evidence.excerpt}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Recommended Action & Officer Controls */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div className="text-xs text-slate-600">
                      <strong className="text-slate-800">Recommended Action:</strong> {finding.recommendedAction}
                    </div>

                    {isOpen ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleUpdateFinding(finding.id, 'RESOLVED')}
                          disabled={actingFindingId === finding.id}
                          className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                        >
                          Resolve Finding
                        </button>
                        <button
                          onClick={() => setActiveWaiveModal(finding.id)}
                          disabled={actingFindingId === finding.id}
                          className="px-2.5 py-1 rounded text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer"
                        >
                          Waive with Justification
                        </button>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500 italic">
                        {finding.reviewerNotes || `Actioned by scrutiny officer`}
                      </div>
                    )}
                  </div>

                  {/* Waive Modal */}
                  {activeWaiveModal === finding.id && (
                    <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200 space-y-2">
                      <label className="block text-xs font-bold text-purple-900">
                        Official Justification for Waiving Regulatory Finding:
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Enter gazette exemption reference, executive order, or scrutiny committee discretion basis..."
                        value={waiveNotes[finding.id] || ''}
                        onChange={(e) => setWaiveNotes({ ...waiveNotes, [finding.id]: e.target.value })}
                        className="w-full text-xs p-2 bg-white border border-purple-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-600"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setActiveWaiveModal(null)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateFinding(finding.id, 'WAIVED', waiveNotes[finding.id])}
                          className="px-3 py-1 bg-purple-700 text-white rounded text-xs font-semibold hover:bg-purple-800"
                        >
                          Confirm Waiver
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
