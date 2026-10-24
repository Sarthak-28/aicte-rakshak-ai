import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getApplicationById } from '@/lib/storage/db';
import { ReportView } from '@/components/scrutiny/ReportView';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function DedicatedReportPage({ params }: { params: { id: string } }) {
  const application = getApplicationById(params.id);

  if (!application) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="no-print">
        <Link
          href={`/applications/${application.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded border border-slate-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Scrutiny Console
        </Link>
      </div>

      <ReportView application={application} />
    </div>
  );
}
