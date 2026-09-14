import React from 'react';
import { useAppState } from '../context/StateContext';
import { ShieldAlert, CloudRain, Mountain, AlertTriangle } from 'lucide-react';

export default function RiskZonesPage() {
  const { state } = useAppState();

  if (!state) return <div className="p-8 text-center text-slate-400">Loading Risk Zones...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 bg-navy-900 border border-navy-700 p-5 rounded-2xl shadow-xl">
        <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center font-bold">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-white">Monsoon High Vulnerability Terrain Zones</h1>
          <p className="text-xs text-slate-300">Geospatial risk classification for North Eastern mountain sectors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {state.riskZones.map((zone) => (
          <div key={zone.id} className="bg-navy-900 border border-navy-700 p-5 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-3xs text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">
                {zone.id}
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-3xs font-bold px-2 py-0.5 rounded border border-amber-500/40">
                {zone.riskLevel} RISK
              </span>
            </div>

            <h3 className="text-sm font-bold text-white">{zone.name}</h3>
            <p className="text-xs text-slate-300">Primary Concern: <strong className="text-amber-400">{zone.vulnerability}</strong></p>

            <div className="p-3 bg-navy-950 rounded-xl border border-navy-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Active Incidents:</span>
                <span className="font-bold text-white">{zone.activeIncidents}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Monsoon Alert Status:</span>
                <span className="font-bold text-cyan-400">Active Monitoring</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
