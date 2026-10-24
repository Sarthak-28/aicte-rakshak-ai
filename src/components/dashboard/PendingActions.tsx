import React from 'react';
import Link from 'next/link';
import { DashboardMetrics } from '@/types';
import { SeverityBadge } from '@/components/common/Badge';
import { AlertCircle, ChevronRight, History, ArrowUpRight } from 'lucide-react';

export function PendingActions({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* High-Priority Pending Actions */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-rose-50 border border-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">High-Priority Scrutiny Actions</h3>
              <p className="text-xs text-slate-500">Unresolved critical anomalies requiring officer intervention</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
            {metrics.highPriorityPendingActions.length} Pending
          </span>
        </div>

        <div className="mt-3 divide-y divide-slate-100 max-h-80 overflow-y-auto">
          {metrics.highPriorityPendingActions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No unresolved critical findings in queue.
            </div>
          ) : (
            metrics.highPriorityPendingActions.map((action, idx) => (
              <div key={idx} className="py-3 flex items-start justify-between gap-3 group hover:bg-slate-50 p-2 rounded transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={action.severity} />
                    <span className="text-xs font-bold text-[#0f2942]">{action.applicationId}</span>
                    <span className="text-xs text-slate-500 truncate max-w-xs">&bull; {action.institutionName}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800">{action.issueTitle}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{action.recommendedAction}</p>
                </div>
                <Link
                  href={`/applications/${action.applicationId}`}
                  className="shrink-0 flex items-center gap-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1.5 rounded border border-teal-200 transition-colors"
                >
                  Scrutinize <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Validation & Scrutiny Activity */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-blue-50 border border-blue-200">
              <History className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Recent Scrutiny & Validation Activity</h3>
              <p className="text-xs text-slate-500">Chronological pipeline events & audit logs</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            Live Stream
          </span>
        </div>

        <div className="mt-3 divide-y divide-slate-100 max-h-80 overflow-y-auto">
          {metrics.recentActivity.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No recent activity recorded.
            </div>
          ) : (
            metrics.recentActivity.map((activity) => (
              <div key={activity.id} className="py-2.5 flex items-start justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{activity.institutionName}</span>
                    <span className="text-[10px] text-slate-400">({activity.applicationId})</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-snug">{activity.description}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 whitespace-nowrap">
                  {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
