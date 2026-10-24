import React from 'react';
import { DashboardMetrics } from '@/types';
import { 
  FileText, 
  Clock, 
  FileWarning, 
  ShieldAlert, 
  ExternalLink, 
  UserCheck 
} from 'lucide-react';

export function MetricsCards({ metrics }: { metrics: DashboardMetrics }) {
  const cards = [
    {
      title: 'Total Applications',
      value: metrics.totalApplications,
      sublabel: 'Institutional submissions in active session',
      icon: FileText,
      color: 'border-l-blue-700 text-blue-900',
      bg: 'bg-white',
    },
    {
      title: 'Awaiting Validation',
      value: metrics.awaitingValidation,
      sublabel: 'Pending initial rule engine run',
      icon: Clock,
      color: 'border-l-slate-500 text-slate-800',
      bg: 'bg-white',
    },
    {
      title: 'Missing Documents',
      value: metrics.missingDocuments,
      sublabel: 'Omitted statutory approvals',
      icon: FileWarning,
      color: 'border-l-amber-500 text-amber-900',
      bg: 'bg-amber-50/40',
    },
    {
      title: 'Potential Anomalies',
      value: metrics.potentialAnomalies,
      sublabel: 'Data mismatches, expired, duplicates',
      icon: ShieldAlert,
      color: 'border-l-rose-600 text-rose-900',
      bg: 'bg-rose-50/40',
    },
    {
      title: 'Awaiting Verification',
      value: metrics.awaitingVerification,
      sublabel: 'Pending issuing authority confirmation',
      icon: ExternalLink,
      color: 'border-l-indigo-600 text-indigo-900',
      bg: 'bg-white',
    },
    {
      title: 'Requiring Manual Review',
      value: metrics.requiringManualReview,
      sublabel: 'Active scrutiny officer queue',
      icon: UserCheck,
      color: 'border-l-teal-600 text-teal-900',
      bg: 'bg-teal-50/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`p-4 rounded-lg border border-slate-200 border-l-4 shadow-2xs ${c.color} ${c.bg} transition-transform hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 tracking-tight">{c.title}</span>
              <Icon className="w-4 h-4 opacity-70" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight">{c.value}</span>
              <span className="text-[10px] text-slate-500 font-medium">apps</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 leading-tight truncate" title={c.sublabel}>
              {c.sublabel}
            </p>
          </div>
        );
      })}
    </div>
  );
}
