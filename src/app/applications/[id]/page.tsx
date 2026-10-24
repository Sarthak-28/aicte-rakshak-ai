'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { InstitutionalApplication } from '@/types';
import { 
  ValidationStatusBadge, 
  VerificationStatusBadge, 
  ReviewStatusBadge 
} from '@/components/common/Badge';
import { DocumentIntelligence } from '@/components/scrutiny/DocumentIntelligence';
import { ValidationFindings } from '@/components/scrutiny/ValidationFindings';
import { VerificationHub } from '@/components/scrutiny/VerificationHub';
import { ComplianceChecklist } from '@/components/scrutiny/ComplianceChecklist';
import { InfrastructureReview } from '@/components/scrutiny/InfrastructureReview';
import { AuditTrail } from '@/components/scrutiny/AuditTrail';
import { ReportView } from '@/components/scrutiny/ReportView';
import { 
  Building, 
  FileText, 
  ShieldCheck, 
  CheckCircle, 
  Clock, 
  Layers, 
  ArrowLeft, 
  RotateCw, 
  ChevronRight,
  ExternalLink,
  BookOpen,
  Camera,
  History,
  FileBarChart2
} from 'lucide-react';

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [application, setApplication] = useState<InstitutionalApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'docs' | 'findings' | 'verify' | 'compliance' | 'infra' | 'audit' | 'report'>('docs');
  const [reviewStatusUpdating, setReviewStatusUpdating] = useState(false);

  const fetchApplication = async () => {
    try {
      const res = await fetch(`/api/applications/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setApplication(data);
      } else {
        router.push('/registry');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [params.id]);

  const handleUpdateReviewStatus = async (newStatus: string) => {
    if (!application) return;
    setReviewStatusUpdating(true);
    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewStatus: newStatus }),
      });
      if (res.ok) {
        fetchApplication();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReviewStatusUpdating(false);
    }
  };

  if (loading || !application) {
    return (
      <div className="py-24 text-center space-y-3">
        <RotateCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Loading institutional application & regulatory findings...
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'docs', label: 'Document Intelligence', icon: FileText, count: application.documents.length },
    { id: 'findings', label: 'Validation Findings', icon: ShieldCheck, count: application.findings.length, hasCritical: application.findings.some(f => f.severity === 'CRITICAL' && f.reviewStatus === 'OPEN') },
    { id: 'verify', label: 'Authority Verification', icon: ExternalLink, count: application.verificationRecords.length },
    { id: 'compliance', label: 'Compliance Assistant', icon: BookOpen, count: application.complianceChecks.length },
    { id: 'infra', label: 'Infrastructure Review', icon: Camera, count: application.infrastructurePhotos.length },
    { id: 'audit', label: 'Audit Trail', icon: History, count: application.auditTrail.length },
    { id: 'report', label: 'Scrutiny Report', icon: FileBarChart2 },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="no-print flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Link href="/registry" className="hover:text-teal-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Registry
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono font-semibold text-slate-800">{application.id}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600">{application.institutionName}</span>
        </div>

        {/* Quick Scenario Jump */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500">Quick Scenario Switcher:</span>
          {['APP-2026-ENG-8491', 'APP-2026-ENG-3042', 'APP-2026-ENG-9182', 'APP-2026-ENG-5120', 'APP-2026-ENG-7731'].map((id, idx) => (
            <Link
              key={id}
              href={`/applications/${id}`}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                application.id === id
                  ? 'bg-[#0f2942] text-white font-bold'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              S{idx + 1}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Institutional Header Card */}
      <div className="no-print bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#0f2942] text-white">
                {application.id}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {application.institutionType}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                {application.applicationCategory}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {application.institutionName}
            </h1>
            <p className="text-xs text-slate-500">
              Promoted by: <strong className="text-slate-700">{application.trustName}</strong> &bull; {application.address}, {application.district}, {application.state} - {application.pinCode}
            </p>
          </div>

          {/* Review Status Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
            <div className="space-y-1 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Officer Recommendation:</span>
              <select
                value={application.reviewStatus}
                disabled={reviewStatusUpdating}
                onChange={(e) => handleUpdateReviewStatus(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                <option value="PENDING_SCRUTINY">Pending Scrutiny Assignment</option>
                <option value="UNDER_REVIEW">Under Active Scrutiny</option>
                <option value="CLARIFICATION_REQUESTED">Clarification Requested</option>
                <option value="RECOMMENDED_FOR_APPROVAL">Recommended for Approval</option>
                <option value="RECOMMENDED_FOR_PHYSICAL_INSPECTION">Physical Inspection Recommended</option>
                <option value="RECOMMENDED_FOR_REJECTION">Recommended for Rejection</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status Indicators Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Validation Engine</span>
            <ValidationStatusBadge status={application.validationStatus} />
          </div>
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Source Verification</span>
            <VerificationStatusBadge status={application.verificationStatus} />
          </div>
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Submission Date</span>
            <span className="font-semibold text-slate-800">
              {new Date(application.submissionDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Assigned Scrutiny Officer</span>
            <span className="font-semibold text-slate-800 truncate block" title={application.assignedOfficer}>
              {application.assignedOfficer}
            </span>
          </div>
        </div>
      </div>

      {/* Scrutiny Module Tabs */}
      <div className="no-print border-b border-slate-200 flex space-x-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-teal-600 text-[#0f2942] bg-white rounded-t-md shadow-2xs font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    tab.hasCritical
                      ? 'bg-rose-100 text-rose-800'
                      : isActive
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div>
        {activeTab === 'docs' && (
          <DocumentIntelligence application={application} onRefresh={fetchApplication} />
        )}
        {activeTab === 'findings' && (
          <ValidationFindings application={application} onRefresh={fetchApplication} />
        )}
        {activeTab === 'verify' && (
          <VerificationHub application={application} onRefresh={fetchApplication} />
        )}
        {activeTab === 'compliance' && (
          <ComplianceChecklist application={application} />
        )}
        {activeTab === 'infra' && (
          <InfrastructureReview application={application} onRefresh={fetchApplication} />
        )}
        {activeTab === 'audit' && (
          <AuditTrail application={application} onRefresh={fetchApplication} />
        )}
        {activeTab === 'report' && (
          <ReportView application={application} />
        )}
      </div>
    </div>
  );
}
