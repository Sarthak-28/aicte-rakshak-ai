'use client';

import React from 'react';
import { InstitutionalApplication } from '@/types';
import { 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  FileText 
} from 'lucide-react';

export function ReportView({ application }: { application: InstitutionalApplication }) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(application, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AICTE_Scrutiny_Report_${application.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const missingDocs = application.findings.filter((f) => f.category === 'DOCUMENT_PRESENCE');
  const anomalies = application.findings.filter((f) => f.category !== 'DOCUMENT_PRESENCE');
  const criticalFindings = application.findings.filter((f) => f.severity === 'CRITICAL');

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="no-print bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Official Scrutiny Validation Report</h3>
          <p className="text-xs text-slate-500">
            Formally formatted regulatory summary ready for committee tabling or PDF archive
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Data (JSON)
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#0f2942] hover:bg-teal-700 text-white transition-colors cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Printable Report Sheet */}
      <div className="report-sheet bg-white p-8 sm:p-12 rounded-lg border border-slate-300 shadow-md max-w-4xl mx-auto text-slate-900 font-sans space-y-6">
        {/* Institutional Header */}
        <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1">
          <p className="text-xs font-bold tracking-widest uppercase text-slate-700">
            Government of India &bull; Ministry of Education
          </p>
          <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[#0f2942]">
            All India Council for Technical Education (AICTE)
          </h2>
          <p className="text-xs font-semibold text-slate-600">
            Preliminary Scrutiny & Regulatory Compliance Assessment Report
          </p>
          <div className="inline-block mt-2 px-3 py-0.5 rounded bg-slate-100 border border-slate-300 text-[11px] font-mono font-bold text-slate-800">
            RECORD IDENTIFIER: {application.id} &bull; ACADEMIC YEAR {application.academicYear}
          </div>
        </div>

        {/* Prototype Watermark Disclaimer */}
        <div className="p-2.5 rounded bg-amber-50 border border-amber-300 text-[10px] text-amber-900 text-center font-medium">
          <strong>DECISION-SUPPORT NOTICE:</strong> This document represents an AI-assisted preliminary advisory review. Final regulatory approval or rejection remains strictly vested in the Competent Authority / AICTE Executive Council.
        </div>

        {/* 1. Institution Profile */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
            1. Institutional Profile & Filing Details
          </h3>
          <div className="grid grid-cols-2 gap-y-2 text-xs">
            <div><span className="text-slate-500">Institution Name:</span> <strong>{application.institutionName}</strong></div>
            <div><span className="text-slate-500">Application Category:</span> <strong>{application.applicationCategory}</strong></div>
            <div><span className="text-slate-500">Sponsoring Trust/Society:</span> <strong>{application.trustName}</strong></div>
            <div><span className="text-slate-500">Technical Stream:</span> <strong>{application.institutionType}</strong></div>
            <div><span className="text-slate-500">Campus Location:</span> {application.address}, {application.district}, {application.state} - {application.pinCode}</div>
            <div><span className="text-slate-500">Submission Date:</span> {new Date(application.submissionDate).toLocaleDateString()}</div>
          </div>
        </div>

        {/* 2. Executive Scrutiny Status Summary */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
            2. Executive Scrutiny Findings Summary
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block">Validation Status</span>
              <strong className="text-xs">{application.validationStatus}</strong>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block">Source Verification</span>
              <strong className="text-xs">{application.verificationStatus}</strong>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block">Review Recommendation</span>
              <strong className="text-xs">{application.reviewStatus}</strong>
            </div>
          </div>
        </div>

        {/* 3. Document Inventory Examined */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
            3. Document Inventory & Cryptographic Hashes
          </h3>
          <table className="w-full text-left text-[11px] border border-slate-200">
            <thead className="bg-slate-100 font-semibold text-slate-700">
              <tr>
                <th className="p-2 border-b">Document Type</th>
                <th className="p-2 border-b">File Name</th>
                <th className="p-2 border-b">SHA-256 Digest</th>
                <th className="p-2 border-b">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {application.documents.map((d) => (
                <tr key={d.id}>
                  <td className="p-2 font-medium">{d.documentType}</td>
                  <td className="p-2">{d.fileName}</td>
                  <td className="p-2 font-mono text-[10px]">{d.fileHash.slice(0, 20)}...</td>
                  <td className="p-2 font-semibold">{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. Advisory Regulatory Findings */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
            4. Advisory Findings & Evidence References ({application.findings.length})
          </h3>
          {application.findings.length === 0 ? (
            <p className="text-xs text-emerald-800 bg-emerald-50 p-2 rounded">
              Zero findings generated. Application complies with all 8 deterministic rules.
            </p>
          ) : (
            <div className="space-y-2">
              {application.findings.map((f) => (
                <div key={f.id} className="p-2.5 rounded border border-slate-200 bg-slate-50 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">[{f.severity}] {f.title}</span>
                    <span className="font-mono text-[10px] text-slate-500">{f.id} ({f.ruleId})</span>
                  </div>
                  <p className="text-slate-700 text-[11px]">{f.explanation}</p>
                  {f.evidence.excerpt && (
                    <p className="text-[10px] text-slate-500 italic bg-white p-1 rounded border border-slate-200">
                      Citation: &ldquo;{f.evidence.excerpt}&rdquo;
                    </p>
                  )}
                  <p className="text-[10px] font-semibold text-teal-800">
                    Recommended Action: {f.recommendedAction} &bull; Officer Review: {f.reviewStatus}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Issuing Authority Verification Audit */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
            5. Issuing Authority Verification Outcomes
          </h3>
          <table className="w-full text-left text-[11px] border border-slate-200">
            <thead className="bg-slate-100 font-semibold text-slate-700">
              <tr>
                <th className="p-2 border-b">Document Type</th>
                <th className="p-2 border-b">Issuing Authority Queried</th>
                <th className="p-2 border-b">Status Outcome</th>
                <th className="p-2 border-b">Response Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {application.verificationRecords.map((vr) => (
                <tr key={vr.id}>
                  <td className="p-2 font-medium">{vr.documentType}</td>
                  <td className="p-2">{vr.issuingAuthority}</td>
                  <td className="p-2 font-bold">{vr.status}</td>
                  <td className="p-2 text-slate-600">{vr.sourceResponse.statusNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 6. Officer Signature Block */}
        <div className="pt-8 border-t-2 border-slate-800 grid grid-cols-2 gap-8 text-xs">
          <div>
            <p className="font-semibold text-slate-600">Assigned Scrutiny Officer:</p>
            <p className="font-bold text-slate-900 mt-1">{application.assignedOfficer}</p>
            <p className="text-[11px] text-slate-500">Bureau of Approval, AICTE Headquarters</p>
            <div className="mt-8 border-b border-slate-400 w-48"></div>
            <p className="text-[10px] text-slate-400 mt-0.5">Signature / Digital Token Timestamp</p>
          </div>

          <div className="text-right">
            <p className="font-semibold text-slate-600">Regional Scrutiny Committee:</p>
            <p className="font-bold text-slate-900 mt-1">Confirmed for Table Presentation</p>
            <p className="text-[11px] text-slate-500">Date: {new Date().toLocaleDateString()}</p>
            <div className="mt-8 border-b border-slate-400 w-48 ml-auto"></div>
            <p className="text-[10px] text-slate-400 mt-0.5">Regional Officer Counter-Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
