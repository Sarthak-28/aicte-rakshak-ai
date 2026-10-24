'use client';

import React, { useState, useRef } from 'react';
import { ApplicationDocument, InstitutionalApplication } from '@/types';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Eye, 
  Copy, 
  Hash, 
  Calendar, 
  Building, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export function DocumentIntelligence({ 
  application, 
  onRefresh 
}: { 
  application: InstitutionalApplication; 
  onRefresh: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<ApplicationDocument | null>(
    application.documents.length > 0 ? application.documents[0] : null
  );
  const [uploadMessage, setUploadMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [expandedText, setExpandedText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setUploadMessage({ text: 'Please select a valid PDF file.', isError: true });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadMessage({ text: 'File exceeds 10MB limit.', isError: true });
      return;
    }

    setUploading(true);
    setUploadMessage({ text: 'Processing PDF & extracting fields with AI engine...' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/applications/${application.id}/documents`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setUploadMessage({ text: `Document "${file.name}" parsed successfully! Generated validation updates.` });
        onRefresh();
      } else {
        setUploadMessage({ text: data.error || 'Failed to process document', isError: true });
      }
    } catch (err) {
      setUploadMessage({ text: 'Network or server error during upload.', isError: true });
    } finally {
      setUploading(false);
    }
  };

  const handleQuickLoadPreset = async (presetKey: string) => {
    setUploading(true);
    setUploadMessage({ text: `Generating and ingesting synthetic ${presetKey} PDF...` });

    try {
      const res = await fetch(`/api/applications/${application.id}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preset: presetKey }),
      });

      const data = await res.json();
      if (res.ok) {
        setUploadMessage({ text: `Synthetic sample document loaded! Extraction engine executed.` });
        onRefresh();
      } else {
        setUploadMessage({ text: data.error || 'Failed to load sample', isError: true });
      }
    } catch (err) {
      setUploadMessage({ text: 'Failed to load synthetic document.', isError: true });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload and Quick-Sample Drawer */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-teal-600" />
              Document Ingestion & Server-Side Text Extraction
            </h3>
            <p className="text-xs text-slate-500">
              Upload institution-submitted PDFs for cryptographic hashing, layout parsing, and AI field extraction
            </p>
          </div>

          {/* Quick-Load Sample Buttons for Rapid Hackathon Evaluation */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              1-Click Test Samples:
            </span>
            <button
              onClick={() => handleQuickLoadPreset('validLandDeed')}
              disabled={uploading}
              className="px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              + Land Deed (Clean)
            </button>
            <button
              onClick={() => handleQuickLoadPreset('expiredFireNoc')}
              disabled={uploading}
              className="px-2 py-1 rounded text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              + Fire NOC (Expired)
            </button>
            <button
              onClick={() => handleQuickLoadPreset('mismatchStateNoc')}
              disabled={uploading}
              className="px-2 py-1 rounded text-xs font-medium bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
            >
              + State NOC (Mismatch)
            </button>
          </div>
        </div>

        {/* Drag and Drop Box */}
        <div className="mt-4">
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              uploading
                ? 'border-teal-400 bg-teal-50/50'
                : 'border-slate-300 hover:border-teal-500 hover:bg-slate-50/70'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-teal-600">
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700">
                Click to browse or drop an institutional PDF document here
              </p>
              <p className="text-[11px] text-slate-400">
                Supports official PDF documents up to 10MB. Computes SHA-256 for duplicate checks.
              </p>
            </div>
          </div>

          {uploadMessage && (
            <div
              className={`mt-3 p-2.5 rounded text-xs flex items-center gap-2 ${
                uploadMessage.isError
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {uploadMessage.isError ? (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span>{uploadMessage.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Documents List & Extracted Field Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document List (Left Column) */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Document Inventory ({application.documents.length})
            </h4>
            <span className="text-[10px] text-slate-500 font-medium">Click to scrutinize</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {application.documents.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No documents uploaded yet.
              </div>
            ) : (
              application.documents.map((doc) => {
                const isSelected = selectedDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => { setSelectedDoc(doc); setExpandedText(false); }}
                    className={`p-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50/70 border-l-4 border-l-[#0f2942]'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {doc.documentType.replace(/_/g, ' ')}
                        </span>
                        <p className="text-xs font-semibold text-slate-900 leading-tight">
                          {doc.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {doc.fileName} &bull; {(doc.fileSize / 1024).toFixed(0)} KB
                        </p>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0 ${
                        doc.status === 'VERIFIED'
                          ? 'bg-teal-50 text-teal-800 border border-teal-200'
                          : doc.status === 'FLAGGED'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-blue-50 text-blue-800'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Document Metadata & Extracted Text (Right 2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-2xs p-5">
          {selectedDoc ? (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{selectedDoc.title}</h4>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {selectedDoc.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                    <Hash className="w-3 h-3 text-slate-400" />
                    SHA-256: {selectedDoc.fileHash}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-500">
                    Uploaded: {new Date(selectedDoc.uploadedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
              </div>

              {/* Extracted Structured Fields Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    Structured Regulatory Metadata Extracted
                  </h5>
                  <span className="text-[11px] text-slate-500">
                    {Object.keys(selectedDoc.extractedFields).length} fields detected
                  </span>
                </div>

                {Object.keys(selectedDoc.extractedFields).length === 0 ? (
                  <p className="text-xs text-slate-400 p-4 bg-slate-50 rounded">
                    No structured metadata extracted yet. Run extraction engine.
                  </p>
                ) : (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3">Field Name</th>
                          <th className="py-2 px-3">Extracted Value</th>
                          <th className="py-2 px-2 text-center">Confidence</th>
                          <th className="py-2 px-3">Source Citation / Page</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {Object.entries(selectedDoc.extractedFields).map(([key, field]) => (
                          <tr key={key} className="hover:bg-slate-50/70">
                            <td className="py-2.5 px-3 font-semibold text-slate-700 capitalize">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </td>
                            <td className="py-2.5 px-3 font-medium text-slate-900">
                              {field.value}
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <span
                                className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  field.confidence >= 0.95
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : field.confidence >= 0.85
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {(field.confidence * 100).toFixed(0)}%
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-[11px] text-slate-500 italic max-w-xs">
                              {field.sourceQuote ? `"${field.sourceQuote}"` : 'Direct text sequence'}
                              {field.pageNumber ? ` (p. ${field.pageNumber})` : ''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Raw Parsed Text Inspector (Expandable) */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setExpandedText(!expandedText)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 p-2.5 rounded border border-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    Inspect Raw Server-Side Extracted PDF Text Buffer
                  </span>
                  {expandedText ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {expandedText && (
                  <div className="mt-2 p-3 bg-slate-900 text-slate-200 font-mono text-[11px] rounded max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {selectedDoc.extractedText}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              Select a document from the inventory to inspect extracted fields.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
