'use client';

import React, { useState } from 'react';
import { InstitutionalApplication, AuthorityVerificationStatus, VerificationRecord } from '@/types';
import { VerificationStatusBadge } from '@/components/common/Badge';
import { 
  Building2, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  RotateCw, 
  SlidersHorizontal, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export function VerificationHub({
  application,
  onRefresh,
}: {
  application: InstitutionalApplication;
  onRefresh: () => void;
}) {
  const [verifyingDocId, setVerifyingDocId] = useState<string | null>(null);
  const [selectedOverride, setSelectedOverride] = useState<AuthorityVerificationStatus>('VERIFIED');
  const [showTesterPanel, setShowTesterPanel] = useState(false);
  const [message, setMessage] = useState('');

  const handleVerify = async (documentId: string, forcedStatus?: AuthorityVerificationStatus) => {
    setVerifyingDocId(documentId);
    setMessage('');
    try {
      const res = await fetch(`/api/applications/${application.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          forcedStatus,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`Simulated query completed for document!`);
        onRefresh();
      } else {
        setMessage(data.error || 'Verification query failed');
      }
    } catch (e) {
      setMessage('Network error during simulated verification.');
    } finally {
      setVerifyingDocId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Banner & Watermark */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-500/20 text-amber-700">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-900 tracking-wide uppercase">
              Simulated Issuing Authority Verification Hub &bull; DEMO SIMULATION
            </h4>
            <p className="text-[11px] text-amber-800">
              Mock integration with simulated State Revenue, Municipal Urban Planning, and Fire Safety portals. No real external government agencies are contacted.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowTesterPanel(!showTesterPanel)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 transition-colors shadow-2xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
          {showTesterPanel ? 'Hide Evaluator Overrides' : 'Evaluator Simulation Controls'}
        </button>
      </div>

      {/* Evaluator Simulation Control Drawer (for Hackathon Testing of all 6 statuses) */}
      {showTesterPanel && (
        <div className="bg-slate-900 text-slate-200 p-4 rounded-lg border border-slate-700 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h5 className="text-xs font-bold text-teal-400 uppercase tracking-wide flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
              Evaluator Test Controls: Force Simulated Issuing Authority Response
            </h5>
            <span className="text-[10px] text-slate-400">Allows judges to test any verification scenario instantly</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">Target Response Status:</span>
            {(['VERIFIED', 'MISMATCH_DETECTED', 'EXPIRED', 'SOURCE_UNAVAILABLE', 'MANUAL_REVIEW_REQUIRED'] as AuthorityVerificationStatus[]).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedOverride(st)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  selectedOverride === st
                    ? 'bg-teal-500 text-slate-950 shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 italic">
            Select a target status above, then click &ldquo;Trigger Verify (Override)&rdquo; next to any document below to test the pipeline behavior.
          </p>
        </div>
      )}

      {message && (
        <div className="p-3 bg-blue-50 text-blue-900 border border-blue-200 rounded text-xs">
          {message}
        </div>
      )}

      {/* Document Verification Cards */}
      <div className="grid grid-cols-1 gap-4">
        {application.documents.map((doc) => {
          const record = application.verificationRecords.find((r) => r.documentId === doc.id);
          const isVerifying = verifyingDocId === doc.id;

          return (
            <div
              key={doc.id}
              className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                      {doc.documentType.replace(/_/g, ' ')}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{doc.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500">
                    File: <code className="font-mono text-slate-700">{doc.fileName}</code> &bull; Ref: <code className="font-mono text-slate-700">{doc.extractedFields['referenceNumber']?.value || 'N/A'}</code>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {record ? (
                    <VerificationStatusBadge status={record.status} />
                  ) : (
                    <span className="text-xs text-slate-400 italic">Unverified</span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVerify(doc.id)}
                      disabled={isVerifying}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#0f2942] text-white hover:bg-teal-700 transition-colors cursor-pointer shadow-2xs"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                      {isVerifying ? 'Simulating Query...' : 'Verify Source'}
                    </button>

                    {showTesterPanel && (
                      <button
                        onClick={() => handleVerify(doc.id, selectedOverride)}
                        disabled={isVerifying}
                        className="px-2.5 py-1.5 rounded text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors cursor-pointer"
                        title={`Force ${selectedOverride} response`}
                      >
                        Force {selectedOverride.slice(0, 8)}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Verification Record Details */}
              {record ? (
                <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-slate-600">
                    <div>
                      <strong className="text-slate-800">Target Issuing Authority:</strong> {record.issuingAuthority}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Queried: {new Date(record.verifiedAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                      Simulated Authority Response Note:
                    </span>
                    <p className="text-slate-800 font-medium">{record.sourceResponse.statusNote}</p>
                    {record.sourceResponse.authorizedSignatory && (
                      <p className="text-[11px] text-teal-700 mt-1">
                        Signatory: <strong>{record.sourceResponse.authorizedSignatory}</strong>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Method: {record.verificationMethod}</span>
                    <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono font-bold">
                      TAG: DEMO SIMULATION ONLY
                    </span>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-400 italic">
                  Document has not yet been queried against issuing authority registry. Click &ldquo;Verify Source&rdquo; to initiate simulated API exchange.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
