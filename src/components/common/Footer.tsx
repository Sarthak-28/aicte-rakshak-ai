import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Info } from 'lucide-react';

export function Footer() {
  return (
    <footer className="no-print bg-[#0a1d30] text-slate-400 text-xs mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              <span className="font-bold text-white text-sm">AICTE Rakshak AI</span>
              <span className="bg-teal-900/60 text-teal-300 border border-teal-700/50 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                Advisory Decision Support
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-xl text-[12px]">
              AI-assisted preliminary validation, document extraction, anomaly detection, and regulatory compliance verification engine engineered for scrutiny officers of the All India Council for Technical Education, Ministry of Education, Government of India.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-300/90 bg-amber-950/30 p-2.5 rounded border border-amber-800/40 max-w-xl">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Regulatory Disclaimer:</strong> This platform is a prototype decision-support tool. It does not make binding statutory decisions, nor does it claim authorized live connection to issuing authority repositories. All simulated responses are synthetic.
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Synthetic Scenarios</h4>
            <ul className="space-y-1.5 text-[12px]">
              <li><Link href="/applications/APP-2026-ENG-8491" className="hover:text-teal-400 transition-colors">Scenario 1: Clean Passing Application</Link></li>
              <li><Link href="/applications/APP-2026-ENG-3042" className="hover:text-teal-400 transition-colors">Scenario 2: Missing Mandatory Document</Link></li>
              <li><Link href="/applications/APP-2026-ENG-9182" className="hover:text-teal-400 transition-colors">Scenario 3: Expired Fire Certificate</Link></li>
              <li><Link href="/applications/APP-2026-ENG-5120" className="hover:text-teal-400 transition-colors">Scenario 4: Name & Reg Mismatches</Link></li>
              <li><Link href="/applications/APP-2026-ENG-7731" className="hover:text-teal-400 transition-colors">Scenario 5: Duplicate Document & Outage</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">System Specifications</h4>
            <ul className="space-y-1.5 text-[12px]">
              <li className="flex items-center justify-between"><span className="text-slate-400">Framework:</span> <span className="text-slate-200">Next.js 14 App Router</span></li>
              <li className="flex items-center justify-between"><span className="text-slate-400">Rule Engine:</span> <span className="text-slate-200">Deterministic APH v1.4</span></li>
              <li className="flex items-center justify-between"><span className="text-slate-400">AI Adapter:</span> <span className="text-slate-200">Gemini & Offline Heuristics</span></li>
              <li className="flex items-center justify-between"><span className="text-slate-400">Data Mode:</span> <span className="text-teal-400 font-medium">Local JSON Persistence</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500">
          <p>&copy; {new Date().getFullYear()} AICTE Rakshak AI &bull; National Technical Education Decision Support Initiative</p>
          <p className="mt-2 sm:mt-0">Designed for Scrutiny Committees & Council Officers</p>
        </div>
      </div>
    </footer>
  );
}
