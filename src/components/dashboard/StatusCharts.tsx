'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { DashboardMetrics } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  'Validated Clean': '#10b981',
  'Validation Warnings': '#f59e0b',
  'Anomalies Detected': '#ef4444',
  'Awaiting Validation': '#94a3b8',
};

const PIE_COLORS = ['#0d9488', '#0f2942', '#3b82f6', '#8b5cf6', '#f59e0b'];

export function StatusCharts({ metrics }: { metrics: DashboardMetrics }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statusData = [
    { name: 'Validated Clean', count: metrics.statusDistribution.clean },
    { name: 'Validation Warnings', count: metrics.statusDistribution.warnings },
    { name: 'Anomalies Detected', count: metrics.statusDistribution.anomalies },
    { name: 'Awaiting Validation', count: metrics.statusDistribution.awaiting },
  ];

  const typeData = Object.entries(metrics.categoryBreakdown).map(([name, value]) => ({
    name: name.replace(' & Technology', '').replace(' (MBA/MCA)', ''),
    count: value,
  }));

  if (!mounted) {
    return <div className="h-64 flex items-center justify-center text-slate-400 text-sm">Loading analytics...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Application Status Distribution */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Application Validation Status Distribution</h3>
            <p className="text-xs text-slate-500">Live breakdown based on 8 deterministic rule evaluations</p>
          </div>
          <span className="text-[11px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
            {metrics.totalApplications} Total
          </span>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                interval={0}
                angle={-10}
                textAnchor="end"
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f2942', color: '#fff', borderRadius: '6px', fontSize: '12px' }}
                cursor={{ fill: '#f1f5f9' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Category Breakdown */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Institutional Stream Representation</h3>
            <p className="text-xs text-slate-500">Distribution of applications by technical stream</p>
          </div>
          <span className="text-[11px] bg-teal-50 text-teal-800 border border-teal-200 font-semibold px-2 py-0.5 rounded">
            APH 2026-27
          </span>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={4}
                dataKey="count"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {typeData.map((entry, index) => (
                  <Cell key={`pie-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f2942', color: '#fff', borderRadius: '6px', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
