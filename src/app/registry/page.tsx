import React from 'react';
import { getApplications } from '@/lib/storage/db';
import { ApplicationRegistryTable } from '@/components/registry/ApplicationRegistryTable';
import { Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ApplicationRegistryPage() {
  const applications = getApplications();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 uppercase">
              AICTE Institutional Registry &bull; AY 2026-27
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0f2942] tracking-tight mt-1 flex items-center gap-2">
            <Layers className="w-6 h-6 text-teal-600" />
            Application Scrutiny Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl mt-0.5">
            Searchable repository of all technical institutions submitting applications for New Approval, Extension of Approval (EoA), Intake Expansion, or Program Introduction.
          </p>
        </div>
      </div>

      <ApplicationRegistryTable initialApplications={applications} />
    </div>
  );
}
