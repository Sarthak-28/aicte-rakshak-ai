'use client';

import React from 'react';
import { InstitutionalApplication } from '@/types';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  FileCheck, 
  ExternalLink,
  BookOpen
} from 'lucide-react';

export function ComplianceChecklist({ application }: { application: InstitutionalApplication }) {
  const checks = application.complianceChecks || [];

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-600" />
            AICTE Regulatory Compliance Assistant (APH 2026-27 Norms)
          </h3>
          <p className="text-xs text-slate-500">
            Checklist-driven cross-validation against Approval Process Handbook statutory requirements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-semibold border border-slate-200">
            {checks.filter(c => c.result === 'COMPLIANT').length} / {checks.length} Norms Satisfied
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {checks.map((check, idx) => {
          let statusBadge = (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Compliant
            </span>
          );

          if (check.result === 'NON_COMPLIANT') {
            statusBadge = (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                <XCircle className="w-3.5 h-3.5 text-rose-600" /> Non-Compliant
              </span>
            );
          } else if (check.result === 'PENDING_DOCUMENT') {
            statusBadge = (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Document Omitted
              </span>
            );
          }

          return (
            <div
              key={idx}
              className={`bg-white rounded-lg border shadow-2xs p-5 transition-all ${
                check.result === 'NON_COMPLIANT'
                  ? 'border-rose-200 border-l-4 border-l-rose-600'
                  : check.result === 'PENDING_DOCUMENT'
                  ? 'border-amber-200 border-l-4 border-l-amber-500'
                  : 'border-slate-200 border-l-4 border-l-emerald-600'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {check.ruleId}
                  </span>
                  <span className="text-xs font-bold text-slate-800">{check.title}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-medium">
                    {check.category}
                  </span>
                </div>

                <div>{statusBadge}</div>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <p className="text-slate-600 leading-relaxed">{check.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
                      Statutory Evidence Required:
                    </span>
                    <p className="text-slate-800">{check.requiredEvidence}</p>
                  </div>

                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
                      Evaluator Assessment & Regulatory Basis:
                    </span>
                    <p className="text-slate-800 font-medium">{check.explanation}</p>
                  </div>
                </div>

                {check.supportingQuote && (
                  <div className="pt-2 text-[11px]">
                    <span className="text-slate-400 font-medium">Supporting Extraction Citation: </span>
                    <span className="italic text-teal-900 bg-teal-50/70 px-2 py-0.5 rounded border border-teal-200 font-serif">
                      &ldquo;{check.supportingQuote}&rdquo;
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Rule Version: {check.ruleVersion}</span>
                <span>Effective Date: {check.effectiveDate}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
