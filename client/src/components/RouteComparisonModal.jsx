import React from 'react';
import { useAppState } from '../context/StateContext';
import { AlertTriangle, CheckCircle2, ArrowRight, X, Clock, Navigation, ShieldCheck } from 'lucide-react';

export default function RouteComparisonModal({ vehicle, onClose }) {
  const { acceptAlternativeRoute } = useAppState();

  if (!vehicle) return null;

  const handleAccept = async () => {
    await acceptAlternativeRoute(vehicle.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-navy-900 border border-navy-700 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-navy-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xs font-extrabold text-cyan-400 tracking-wider uppercase">Dijkstra Route Engine Recalculation</span>
              <h3 className="text-base font-bold text-white">Route Analysis: Vehicle {vehicle.id}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cargo & Destination summary */}
        <div className="grid grid-cols-3 gap-3 bg-navy-950 p-3.5 rounded-xl border border-navy-800 text-xs">
          <div>
            <span className="text-slate-400">Cargo Payload</span>
            <p className="font-bold text-white mt-0.5">{vehicle.cargo}</p>
          </div>
          <div>
            <span className="text-slate-400">Driver</span>
            <p className="font-bold text-white mt-0.5">{vehicle.driverName}</p>
          </div>
          <div>
            <span className="text-slate-400">Destination</span>
            <p className="font-bold text-cyan-300 mt-0.5">{vehicle.destination}</p>
          </div>
        </div>

        {/* Old Route vs New Route Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Old Disrupted Route */}
          <div className="bg-red-950/30 border border-red-500/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-extrabold text-red-400 uppercase tracking-wider">Original Route</span>
              <span className="bg-red-500/20 text-red-400 text-3xs font-bold px-2 py-0.5 rounded border border-red-500/40">
                BLOCKED
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-200">Path Sequence:</div>
              <div className="text-xs font-mono text-slate-300 flex flex-wrap items-center gap-1.5 bg-navy-950 p-2 rounded border border-navy-800">
                <span>Guwahati (A)</span>
                <ArrowRight className="w-3 h-3 text-red-400" />
                <span className="text-red-400 font-bold">Nongpoh (B)</span>
                <ArrowRight className="w-3 h-3 text-red-400" />
                <span className="text-red-400 font-bold">Shillong (C)</span>
                <ArrowRight className="w-3 h-3 text-red-400" />
                <span>Silchar (D)</span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Distance:</span>
                <span className="font-bold text-white">310 km</span>
              </div>
              <div className="flex justify-between">
                <span>Original ETA:</span>
                <span className="font-bold text-slate-400">3h 20m</span>
              </div>
              <div className="p-2 bg-red-500/10 text-red-300 text-2xs rounded border border-red-500/20 mt-2">
                ⚠ Disrupted by Landslide on Road R02 (Nongpoh-Shillong Pass).
              </div>
            </div>
          </div>

          {/* New Recalculated Bypass Route */}
          <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-extrabold text-emerald-400 uppercase tracking-wider">Alternative Route (Dijkstra)</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-3xs font-bold px-2 py-0.5 rounded border border-emerald-500/40">
                SAFE & ACCESSIBLE
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-200">Recalculated Path Sequence:</div>
              <div className="text-xs font-mono text-slate-300 flex flex-wrap items-center gap-1.5 bg-navy-950 p-2 rounded border border-navy-800">
                <span>Guwahati (A)</span>
                <ArrowRight className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300 font-bold">Nagaon (E)</span>
                <ArrowRight className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300 font-bold">Haflong (F)</span>
                <ArrowRight className="w-3 h-3 text-emerald-400" />
                <span>Silchar (D)</span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Bypass Distance:</span>
                <span className="font-bold text-white">375 km</span>
              </div>
              <div className="flex justify-between">
                <span>New ETA:</span>
                <span className="font-bold text-emerald-400">4h 05m</span>
              </div>
              <div className="p-2 bg-emerald-500/10 text-emerald-300 text-2xs rounded border border-emerald-500/20 mt-2">
                ✓ Avoids all landslide high-risk zones. All road segments verified SAFE.
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-navy-700 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-navy-800 hover:bg-navy-700 border border-navy-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleAccept}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-navy-950 font-extrabold text-xs rounded-lg shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>ACCEPT & COMMMIT NEW ROUTE</span>
          </button>
        </div>

      </div>
    </div>
  );
}
