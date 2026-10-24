'use client';

import React, { useState } from 'react';
import { InstitutionalApplication, InfrastructureEvidence } from '@/types';
import { 
  Camera, 
  UploadCloud, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  MapPin, 
  Info, 
  Eye,
  Sliders,
  Sparkles
} from 'lucide-react';

export function InfrastructureReview({
  application,
  onRefresh,
}: {
  application: InstitutionalApplication;
  onRefresh: () => void;
}) {
  const [photos, setPhotos] = useState<InfrastructureEvidence[]>(application.infrastructurePhotos || []);
  const [selectedPhoto, setSelectedPhoto] = useState<InfrastructureEvidence | null>(
    photos.length > 0 ? photos[0] : null
  );
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [physicalInspectionFlag, setPhysicalInspectionFlag] = useState(
    application.reviewStatus === 'RECOMMENDED_FOR_PHYSICAL_INSPECTION'
  );

  const handleTogglePhysicalInspection = async () => {
    const nextFlag = !physicalInspectionFlag;
    setPhysicalInspectionFlag(nextFlag);

    try {
      await fetch(`/api/applications/${application.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewStatus: nextFlag ? 'RECOMMENDED_FOR_PHYSICAL_INSPECTION' : 'UNDER_REVIEW',
          remarks: nextFlag
            ? 'Flagged for On-Site Physical Inspection by Regional Expert Committee based on infrastructure photograph assessment'
            : 'Reverted physical inspection recommendation',
        }),
      });
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSamplePhoto = (areaType: InfrastructureEvidence['areaType']) => {
    const newEvidence: InfrastructureEvidence = {
      id: `INFRA-${Date.now().toString().slice(-4)}`,
      title: `${areaType} Site Inspection Photo`,
      areaType,
      imageUrl: '/images/demo/comp-center.jpg',
      uploadedAt: new Date().toISOString(),
      detectedObjects: [
        { label: 'Workstation Terminal', confidence: 0.94, box: [20, 15, 65, 45] },
        { label: 'CO2 Fire Extinguisher', confidence: 0.89, box: [35, 80, 75, 92] },
        { label: 'Smoke Detector', confidence: 0.91, box: [10, 50, 18, 58] },
      ],
      aiObservation: `Computer vision detected standard educational furniture, active safety suppression device, and network infrastructure. Lighting and floor space meet APH norms.`,
      recommendPhysicalInspection: false,
    };

    setPhotos([newEvidence, ...photos]);
    setSelectedPhoto(newEvidence);
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner Required by Specification 5.H */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 text-xs text-blue-900">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">
            Preliminary Computer Vision Infrastructure Observation Norm (AICTE Protocol)
          </p>
          <p className="text-blue-800 leading-relaxed">
            <strong>Critical Policy Note:</strong> Visual asset detection provides preliminary assistance only. An institution shall <strong>never</strong> be inferred to be non-compliant solely because an object or piece of laboratory equipment is not visible within a photograph frame. Where photographic evidence is inconclusive, officers may recommend an Expert Visiting Committee (EVC) on-site physical inspection.
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-teal-600" />
            Infrastructure Photographic Evidence Review
          </h4>
          <p className="text-[11px] text-slate-500">
            Automated asset recognition & physical inspection recommendation panel
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleAddSamplePhoto('Computer Center')}
            className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
          >
            + Add Computer Lab Photo
          </button>
          <button
            onClick={() => handleAddSamplePhoto('Fire Safety System')}
            className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
          >
            + Add Safety Extinguisher Photo
          </button>
          <button
            onClick={handleTogglePhysicalInspection}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              physicalInspectionFlag
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-white border border-indigo-300 text-indigo-900 hover:bg-indigo-50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            {physicalInspectionFlag ? 'Physical Inspection Recommended (Active)' : 'Recommend Physical Inspection'}
          </button>
        </div>
      </div>

      {/* Main Review Area */}
      {photos.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center space-y-3">
          <Camera className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">No Infrastructure Photos Uploaded Yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click one of the quick test photo buttons above to load sample infrastructure photographs and examine automated object detections.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Photo Gallery List */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide pb-2 border-b border-slate-100">
              Photographs ({photos.length})
            </h5>
            <div className="space-y-2">
              {photos.map((item) => {
                const isSelected = selectedPhoto?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPhoto(item)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.areaType}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.detectedObjects.length} objects detected
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 mt-1.5">{item.title}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Image & Detections Inspector */}
          {selectedPhoto && (
            <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedPhoto.title}</h4>
                  <p className="text-xs text-slate-500">Area Category: {selectedPhoto.areaType}</p>
                </div>
                <span className="text-[11px] text-slate-400">
                  Uploaded: {new Date(selectedPhoto.uploadedAt).toLocaleDateString()}
                </span>
              </div>

              {/* Simulated Computer Vision Visual Canvas */}
              <div className="relative rounded-lg bg-slate-900 text-slate-300 p-8 flex flex-col items-center justify-center min-h-[220px] border border-slate-800 overflow-hidden">
                <div className="absolute inset-0 bg-radial from-slate-800 to-slate-950 opacity-90"></div>
                
                {/* Visual mock overlay bounding boxes */}
                <div className="relative z-10 w-full max-w-md bg-slate-800/80 rounded border border-teal-500/50 p-4 backdrop-blur-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                    <span className="text-xs font-mono text-teal-400 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                      Vision Model Inference Layer
                    </span>
                    <span className="text-[10px] bg-teal-950 text-teal-300 px-1.5 py-0.5 rounded border border-teal-800">
                      High Confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {selectedPhoto.detectedObjects.map((obj, i) => (
                      <div key={i} className="p-1.5 rounded bg-slate-900/80 border border-slate-700 flex items-center justify-between">
                        <span className="text-slate-200">&bull; {obj.label}</span>
                        <span className="text-teal-400 font-mono font-bold">{(obj.confidence * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Observation Text */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Automated Visual Analysis Observation:
                </span>
                <p className="text-slate-800 leading-relaxed">{selectedPhoto.aiObservation}</p>
              </div>

              {/* Scrutiny Officer Observation Note */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  Scrutiny Officer Inspection Notes:
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter manual observation on laboratory equipment layout, power points, or verification request..."
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
