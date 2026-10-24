'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, RotateCcw, AlertTriangle, Layers, FileText, LayoutDashboard, UserCheck } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleReset = async () => {
    if (!confirm('Reset all demo applications and audit trails back to the standard 5 synthetic scenarios?')) {
      return;
    }
    setResetting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      if (res.ok) {
        setResetMessage('Demo data restored!');
        setTimeout(() => {
          setResetMessage('');
          window.location.reload();
        }, 1000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResetting(false);
    }
  };

  const navLinks = [
    { label: 'Officer Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Application Registry', href: '/registry', icon: Layers },
    { label: 'Live Scrutiny Console', href: '/applications/APP-2026-ENG-8491', icon: ShieldCheck },
  ];

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Ministry Ribbon */}
      <div className="bg-[#0a1d30] text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center border-b border-blue-950">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-white"></span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          </div>
          <span className="font-medium tracking-wide text-slate-200">
            MINISTRY OF EDUCATION &bull; ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE)
          </span>
        </div>
        <div className="hidden sm:flex items-center space-x-4">
          <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-500/30 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            DECISION-SUPPORT HACKATHON PROTOTYPE
          </span>
          <span className="text-slate-400">National Scrutiny Portal v2.4</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand & Emblem */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#0f2942] text-teal-400 flex items-center justify-center font-bold text-lg shadow-sm border border-slate-700 group-hover:bg-[#153a5c] transition-colors">
              <ShieldCheck className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-[#0f2942] tracking-tight group-hover:text-teal-700 transition-colors">
                  AICTE Rakshak AI
                </span>
                <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 uppercase">
                  Gov-Tech
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Application Validation & Regulatory Compliance Verification
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-100 text-[#0f2942] border-b-2 border-teal-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Scrutiny Officer Badge & Reset Dataset */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleReset}
              disabled={resetting}
              title="Reset all applications to the original 5 demo scenarios"
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded border border-slate-300 transition-colors cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 text-slate-500 ${resetting ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{resetMessage || 'Reset Demo Data'}</span>
            </button>

            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
              <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-300 text-[#0f2942] flex items-center justify-center font-bold">
                <UserCheck className="w-4 h-4 text-blue-800" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-[11px] leading-tight">Dr. V. K. Malhotra</p>
                <p className="text-[10px] text-slate-500 leading-tight">Senior Scrutiny Officer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
