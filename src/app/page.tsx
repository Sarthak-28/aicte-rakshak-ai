import React from 'react';
import Link from 'next/link';
import { computeDashboardMetrics, getApplications } from '@/lib/storage/db';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { StatusCharts } from '@/components/dashboard/StatusCharts';
import { PendingActions } from '@/components/dashboard/PendingActions';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle, 
  FileWarning, 
  AlertCircle, 
  Copy, 
  Layers,
  Sparkles
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function OfficerDashboardPage() {
  const metrics = computeDashboardMetrics();
  const applications = getApplications();

  const scenarios = [
    {
      id: 'APP-2026-ENG-8491',
      tag: 'Scenario 1',
      title: 'Complete Application (Clean Pass)',
      desc: 'All 5 mandatory documents present, consistent trust name, valid dates through 2028, 100% verified by state agencies.',
      status: 'VALIDATED_CLEAN',
      color: 'border-l-emerald-600 bg-emerald-50/20',
      icon: CheckCircle,
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'APP-2026-ENG-3042',
      tag: 'Scenario 2',
      title: 'Missing Mandatory Document',
      desc: 'Land Ownership Title Deed omitted from polytechnic filing. Checklist engine triggers critical omission finding.',
      status: 'MISSING_DOCUMENT',
      color: 'border-l-amber-500 bg-amber-50/20',
      icon: FileWarning,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'APP-2026-ENG-9182',
      tag: 'Scenario 3',
      title: 'Expired Fire Safety Certificate',
      desc: 'PMRDA Fire Safety NOC expired on 15-Jan-2026. Deterministic date validator immediately flags intake expansion request.',
      status: 'EXPIRED_CERT',
      color: 'border-l-rose-600 bg-rose-50/20',
      icon: AlertCircle,
      badgeColor: 'bg-rose-100 text-rose-800',
    },
    {
      id: 'APP-2026-ENG-5120',
      tag: 'Scenario 4',
      title: 'Name & Registration ID Mismatches',
      desc: 'Trust Deed cites "Drona Educational Trust (DET-4491)", but State NOC is issued to "Drona Vidya Samiti (DVS-9912)".',
      status: 'DATA_MISMATCH',
      color: 'border-l-purple-600 bg-purple-50/20',
      icon: AlertCircle,
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'APP-2026-ENG-7731',
      tag: 'Scenario 5',
      title: 'Duplicate Document Hash & Source Outage',
      desc: 'Building Plan byte-hash matches another institution; Municipal verification endpoint reports 503 Source Unavailable.',
      status: 'DUPLICATE_OUTAGE',
      color: 'border-l-red-800 bg-red-50/20',
      icon: Copy,
      badgeColor: 'bg-red-100 text-red-800',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Institutional Welcome & Headline */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 uppercase">
              AICTE Bureau of Approval &bull; AY 2026-27
            </span>
            <span className="text-xs text-slate-400 font-medium">Session: 2026-2027 Approval Cycle</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0f2942] tracking-tight mt-1">
            Officer Scrutiny & Regulatory Verification Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl mt-0.5">
            Advisory decision-support engine assisting AICTE scrutiny committees with automated document extraction, temporal checks, cross-entity reconciliation, and simulated issuing-authority authentication.
          </p>
        </div>

        <Link
          href="/registry"
          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[#0f2942] text-white hover:bg-teal-700 transition-colors shadow-2xs"
        >
          <Layers className="w-4 h-4" /> Open Application Registry
        </Link>
      </div>

      {/* 1. Dynamic Metric KPI Counters */}
      <MetricsCards metrics={metrics} />

      {/* 2. Graphical Status Breakdown */}
      <StatusCharts metrics={metrics} />

      {/* 3. High-Priority Actions & Recent Activity Stream */}
      <PendingActions metrics={metrics} />

      {/* 4. Quick Scenario Evaluator Launchpad */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Explore Pre-Configured Synthetic Scenarios
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            5 distinct test archetypes required by AICTE problem statement
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            return (
              <Link
                key={sc.id}
                href={`/applications/${sc.id}`}
                className={`p-3.5 rounded-lg border border-slate-200 border-l-4 ${sc.color} hover:shadow-xs transition-all flex flex-col justify-between group`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${sc.badgeColor}`}>
                      {sc.tag}
                    </span>
                    <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {sc.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-3">
                    {sc.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-slate-700 group-hover:text-teal-700">
                  <span className="font-mono">{sc.id}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
