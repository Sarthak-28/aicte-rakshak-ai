import React from 'react';
import { 
  ValidationStatus, 
  VerificationStatus, 
  ReviewStatus, 
  FindingSeverity, 
  AuthorityVerificationStatus 
} from '@/types';
import { CheckCircle2, AlertTriangle, XCircle, Clock, ShieldAlert, FileQuestion } from 'lucide-react';

export function ValidationStatusBadge({ status }: { status: ValidationStatus }) {
  switch (status) {
    case 'VALIDATED_CLEAN':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Validated Clean
        </span>
      );
    case 'VALIDATION_WARNINGS':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          Validation Warnings
        </span>
      );
    case 'ANOMALIES_DETECTED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          Anomalies Detected
        </span>
      );
    case 'AWAITING_VALIDATION':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          Awaiting Validation
        </span>
      );
  }
}

export function VerificationStatusBadge({ status }: { status: VerificationStatus | AuthorityVerificationStatus }) {
  switch (status) {
    case 'ALL_VERIFIED':
    case 'VERIFIED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
          <CheckCircle2 className="w-3 h-3 text-teal-600" />
          Verified
        </span>
      );
    case 'MISMATCH_DETECTED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
          <XCircle className="w-3 h-3 text-rose-600" />
          Mismatch Detected
        </span>
      );
    case 'EXPIRED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-50 text-orange-800 border border-orange-200">
          <AlertTriangle className="w-3 h-3 text-orange-600" />
          Expired in Source
        </span>
      );
    case 'SOURCE_UNAVAILABLE':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600" />
          Source Unavailable (503)
        </span>
      );
    case 'PARTIALLY_VERIFIED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          <Clock className="w-3 h-3 text-blue-600" />
          Partially Verified
        </span>
      );
    case 'MANUAL_REVIEW_REQUIRED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
          <FileQuestion className="w-3 h-3 text-purple-600" />
          Manual Review Req.
        </span>
      );
    case 'PENDING':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <Clock className="w-3 h-3 text-slate-500" />
          Pending Source Verification
        </span>
      );
  }
}

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  switch (status) {
    case 'RECOMMENDED_FOR_APPROVAL':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
          Recommended for Approval
        </span>
      );
    case 'RECOMMENDED_FOR_PHYSICAL_INSPECTION':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-900 border border-indigo-300">
          Physical Inspection Recommended
        </span>
      );
    case 'CLARIFICATION_REQUESTED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
          Clarification Requested
        </span>
      );
    case 'UNDER_REVIEW':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-300">
          Under Active Scrutiny
        </span>
      );
    case 'RECOMMENDED_FOR_REJECTION':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-900 border border-rose-300">
          Rejection Recommended
        </span>
      );
    case 'PENDING_SCRUTINY':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
          Pending Scrutiny Assignment
        </span>
      );
  }
}

export function SeverityBadge({ severity }: { severity: FindingSeverity }) {
  switch (severity) {
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-600 text-white uppercase tracking-wider">
          Critical
        </span>
      );
    case 'WARNING':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-white uppercase tracking-wider">
          Warning
        </span>
      );
    case 'INFO':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-500 text-white uppercase tracking-wider">
          Advisory
        </span>
      );
  }
}
