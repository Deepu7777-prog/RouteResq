import React from 'react';
import { useAppState } from '../context/StateContext';
import { FileText, Download, BarChart2, CheckCircle2 } from 'lucide-react';

export default function ReportsPage() {
  const { state } = useAppState();

  if (!state) return <div className="p-8 text-center text-slate-400">Loading Reports...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-900 border border-navy-700 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Disaster Logistics & Accessibility Analytics</h1>
            <p className="text-xs text-slate-300">Exportable regional resilience reports and delay mitigation metrics</p>
          </div>
        </div>

        <button
          onClick={() => alert("Downloading RouteResQ Regional Report PDF...")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Regional PDF Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-navy-900 border border-navy-700 p-5 rounded-2xl space-y-2">
          <span className="text-2xs font-semibold text-slate-400 uppercase">Average Reroute Delay</span>
          <div className="text-3xl font-extrabold text-cyan-400">+45 mins</div>
          <p className="text-3xs text-emerald-400">✓ Prevented 12h+ complete supply stoppage</p>
        </div>

        <div className="bg-navy-900 border border-navy-700 p-5 rounded-2xl space-y-2">
          <span className="text-2xs font-semibold text-slate-400 uppercase">Emergency Medicines Delivered</span>
          <div className="text-3xl font-extrabold text-emerald-400">100%</div>
          <p className="text-3xs text-slate-400">Zero essential cargo stranded</p>
        </div>

        <div className="bg-navy-900 border border-navy-700 p-5 rounded-2xl space-y-2">
          <span className="text-2xs font-semibold text-slate-400 uppercase">Dijkstra Recalculation Speed</span>
          <div className="text-3xl font-extrabold text-amber-400">&lt; 120 ms</div>
          <p className="text-3xs text-slate-400">Instant graph path computation</p>
        </div>
      </div>
    </div>
  );
}
