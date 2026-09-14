import React from 'react';
import { ShieldAlert, AlertTriangle, CloudRain, Mountain, Info, X } from 'lucide-react';

export default function RiskScoreCard({ road, onClose }) {
  if (!road) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-navy-900 border border-navy-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-navy-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xs font-extrabold text-amber-400 tracking-wider uppercase">Prototype Risk Intelligence Model</span>
              <h3 className="text-base font-bold text-white">{road.name}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Display */}
        <div className="grid grid-cols-2 gap-4 bg-navy-950 p-4 rounded-xl border border-navy-800">
          <div>
            <span className="text-xs text-slate-400">Calculated Risk Index</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-amber-400">{road.riskScore}</span>
              <span className="text-xs text-slate-500">/ 100 pts</span>
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-400">Road Status</span>
            <div className="mt-1">
              <span className={`inline-block px-3 py-1 text-xs font-bold rounded-lg border ${
                road.status === 'BLOCKED' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                road.status === 'HIGH_RISK' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                road.status === 'MEDIUM_RISK' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}>
                {road.status}
              </span>
            </div>
          </div>
        </div>

        {/* Transparent Formula Breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Risk Factors Breakdown</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded bg-navy-800 border border-navy-700 text-slate-200">
              <span className="flex items-center gap-2"><Info className="w-3.5 h-3.5 text-cyan-400" /> Base Vulnerability Index</span>
              <span className="font-mono text-cyan-400">+15 pts</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-navy-800 border border-navy-700 text-slate-200">
              <span className="flex items-center gap-2"><CloudRain className="w-3.5 h-3.5 text-blue-400" /> Monsoon Weather Warning (Heavy Rain)</span>
              <span className="font-mono text-blue-400">+25 pts</span>
            </div>
            {road.status === 'BLOCKED' && (
              <div className="flex justify-between p-2 rounded bg-red-950/40 border border-red-500/40 text-red-300 font-semibold">
                <span className="flex items-center gap-2"><Mountain className="w-3.5 h-3.5 text-red-400" /> Landslide Debris Report (High Severity)</span>
                <span className="font-mono text-red-400">+50 pts</span>
              </div>
            )}
          </div>
        </div>

        {/* Threshold Legend */}
        <div className="p-3 bg-navy-950/60 rounded-xl border border-navy-800 text-3xs text-slate-400 space-y-1">
          <div className="font-bold text-slate-300">Risk Level Thresholds:</div>
          <div className="flex justify-between">
            <span>0–30: SAFE</span>
            <span>31–60: MEDIUM RISK</span>
            <span>61–100: HIGH RISK</span>
            <span className="text-red-400 font-bold">&gt; 75: BLOCKED</span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-3xs text-slate-500 italic text-center">
          * Prototype Risk Intelligence Model — Transparent evaluation logic ready for future ML sensor integration.
        </p>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-navy-800 hover:bg-navy-700 border border-navy-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Close Analysis
          </button>
        </div>

      </div>
    </div>
  );
}
