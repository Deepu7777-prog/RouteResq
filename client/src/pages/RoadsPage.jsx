import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import RiskScoreCard from '../components/RiskScoreCard';
import { Route, ShieldAlert, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';

export default function RoadsPage() {
  const { state } = useAppState();
  const [selectedRoad, setSelectedRoad] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  if (!state) return <div className="p-8 text-center text-slate-400">Loading Road Accessibility Data...</div>;

  const filteredRoads = state.roads.filter(r => statusFilter === 'ALL' || r.status === statusFilter);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-900 border border-navy-700 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
            <Route className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">NER Transit Corridors & Road Accessibility</h1>
            <p className="text-xs text-slate-300">Detailed accessibility status, terrain risk scores, and distance vectors</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'SAFE', 'MEDIUM_RISK', 'BLOCKED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-3xs font-bold border transition-colors ${
                statusFilter === st
                  ? 'bg-brand-cyan/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-navy-950 text-slate-400 border-navy-800 hover:border-navy-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Roads Table */}
      <div className="bg-navy-900 border border-navy-700 rounded-2xl shadow-xl p-5 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-950 text-slate-400 text-3xs font-extrabold uppercase tracking-wider border-b border-navy-800">
              <tr>
                <th className="py-3 px-4">Road ID</th>
                <th className="py-3 px-4">Highway Name</th>
                <th className="py-3 px-4">Connects Nodes</th>
                <th className="py-3 px-4">Distance</th>
                <th className="py-3 px-4">Risk Index</th>
                <th className="py-3 px-4">Accessibility Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 font-medium">
              {filteredRoads.map((road) => (
                <tr key={road.id} className="hover:bg-navy-800/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-300">{road.id}</td>
                  <td className="py-3 px-4 text-white font-bold">{road.name}</td>
                  <td className="py-3 px-4 text-slate-300">Node {road.u} ↔ Node {road.v}</td>
                  <td className="py-3 px-4 font-mono text-slate-200">{road.distanceKm} km</td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">{road.riskScore} / 100</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-3xs font-bold ${
                      road.status === 'BLOCKED' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                      road.status === 'HIGH_RISK' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                      road.status === 'MEDIUM_RISK' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}>
                      {road.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedRoad(road)}
                      className="px-2.5 py-1 bg-navy-800 hover:bg-navy-700 text-cyan-400 border border-navy-700 rounded text-3xs font-semibold transition-colors"
                    >
                      Risk Analysis
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRoad && (
        <RiskScoreCard
          road={selectedRoad}
          onClose={() => setSelectedRoad(null)}
        />
      )}

    </div>
  );
}
