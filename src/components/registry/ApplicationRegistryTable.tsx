'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { InstitutionalApplication } from '@/types';
import { 
  ValidationStatusBadge, 
  VerificationStatusBadge, 
  ReviewStatusBadge 
} from '@/components/common/Badge';
import { 
  Search, 
  Filter, 
  FileText, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  FileWarning, 
  Copy, 
  Sparkles 
} from 'lucide-react';

export function ApplicationRegistryTable({ initialApplications }: { initialApplications: InstitutionalApplication[] }) {
  const [applications, setApplications] = useState<InstitutionalApplication[]>(initialApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedScenario, setSelectedScenario] = useState('ALL');

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.trustName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || app.validationStatus === selectedStatus;
    const matchesType = selectedType === 'ALL' || app.institutionType === selectedType;
    const matchesScenario = selectedScenario === 'ALL' || app.scenarioTag === selectedScenario;

    return matchesSearch && matchesStatus && matchesType && matchesScenario;
  });

  return (
    <div className="space-y-4">
      {/* Quick Scenario Preset Pills */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">
            Quick Scenario Evaluator Presets:
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => { setSelectedScenario('ALL'); setSelectedStatus('ALL'); }}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              selectedScenario === 'ALL'
                ? 'bg-[#0f2942] text-white shadow-xs'
                : 'bg-slate-100 text-slate-750 hover:bg-slate-200'
            }`}
          >
            All Applications ({applications.length})
          </button>
          <button
            onClick={() => setSelectedScenario('scenario-1')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1 ${
              selectedScenario === 'scenario-1'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle className="w-3 h-3" />
            Scenario 1: Clean Passing
          </button>
          <button
            onClick={() => setSelectedScenario('scenario-2')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1 ${
              selectedScenario === 'scenario-2'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <FileWarning className="w-3 h-3" />
            Scenario 2: Missing Mandatory Doc
          </button>
          <button
            onClick={() => setSelectedScenario('scenario-3')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1 ${
              selectedScenario === 'scenario-3'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <AlertCircle className="w-3 h-3" />
            Scenario 3: Expired Fire Certificate
          </button>
          <button
            onClick={() => setSelectedScenario('scenario-4')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1 ${
              selectedScenario === 'scenario-4'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100'
            }`}
          >
            <FileText className="w-3 h-3" />
            Scenario 4: Name & Reg Mismatches
          </button>
          <button
            onClick={() => setSelectedScenario('scenario-5')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1 ${
              selectedScenario === 'scenario-5'
                ? 'bg-red-800 text-white shadow-xs'
                : 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
            }`}
          >
            <Copy className="w-3 h-3" />
            Scenario 5: Duplicate Hash & Outage
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Application ID, Institution, Trust or State..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="ALL">All Validation Statuses</option>
              <option value="VALIDATED_CLEAN">Validated Clean</option>
              <option value="VALIDATION_WARNINGS">Validation Warnings</option>
              <option value="ANOMALIES_DETECTED">Anomalies Detected</option>
              <option value="AWAITING_VALIDATION">Awaiting Validation</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="ALL">All Streams</option>
              <option value="Engineering & Technology">Engineering & Technology</option>
              <option value="Polytechnic Diploma">Polytechnic Diploma</option>
              <option value="Management (MBA/MCA)">Management (MBA/MCA)</option>
              <option value="Pharmacy">Pharmacy</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 font-medium ml-auto">
            Showing <strong className="text-slate-800">{filtered.length}</strong> of {applications.length}
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f2942] text-slate-200 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Institution & Sponsoring Trust</th>
                <th className="py-3 px-4">Stream & Category</th>
                <th className="py-3 px-3">Submitted</th>
                <th className="py-3 px-3">Validation Status</th>
                <th className="py-3 px-3 text-center">Missing Docs</th>
                <th className="py-3 px-3 text-center">Anomalies</th>
                <th className="py-3 px-3">Authority Verif.</th>
                <th className="py-3 px-3">Review Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    No matching applications found. Adjust filters or reset demo data.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => {
                  const missingCount = app.findings.filter((f) => f.category === 'DOCUMENT_PRESENCE').length;
                  const anomalyCount = app.findings.filter((f) => f.category !== 'DOCUMENT_PRESENCE').length;

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0f2942]">
                        <Link href={`/applications/${app.id}`} className="hover:text-teal-600 underline decoration-slate-300">
                          {app.id}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-semibold text-slate-900 leading-snug">{app.institutionName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{app.trustName} &bull; {app.district}, {app.state}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-800">{app.institutionType}</p>
                        <p className="text-[11px] text-slate-500">{app.applicationCategory}</p>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                        {new Date(app.submissionDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <ValidationStatusBadge status={app.validationStatus} />
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold">
                        {missingCount > 0 ? (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                            {missingCount}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">0</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold">
                        {anomalyCount > 0 ? (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 text-xs font-bold">
                            {anomalyCount}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">0</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <VerificationStatusBadge status={app.verificationStatus} />
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <ReviewStatusBadge status={app.reviewStatus} />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          href={`/applications/${app.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-[#0f2942] text-white hover:bg-teal-700 transition-colors shadow-2xs"
                        >
                          Scrutinize <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
