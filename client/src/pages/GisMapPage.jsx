import React from 'react';
import { useAppState } from '../context/StateContext';
import GoogleMapView from '../components/GoogleMapView';
import { Map, Layers, Shield, AlertTriangle, Route, Activity } from 'lucide-react';

export default function GisMapPage() {
  const { state } = useAppState();

  if (!state) return <div className="p-8 text-center text-slate-400">Loading Fullscreen GIS Map...</div>;

  return (
    <div className="space-y-4 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gov-blue/10 text-gov-blue flex items-center justify-center font-bold">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-gov-navy">Full Command GIS Surveillance Map</h1>
            <p className="text-xs text-slate-500">Geospatial vector visualization of North Eastern Region roads, landslide zones & emergency transits</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-gov-blue bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
          <Activity className="w-4 h-4 text-gov-blue" />
          <span>Realtime Vector Engine Active</span>
        </div>
      </div>

      {/* SIDE-BY-SIDE SPLIT CONTAINER: MAP ON LEFT, TELEMETRY ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: GOOGLE MAP VECTOR SURVEILLANCE (IMMEDIATELY VISIBLE AT TOP) */}
        <div className="lg:col-span-8 card-clean p-4 space-y-3">
          <GoogleMapView
            roads={state.roads}
            nodes={state.nodes}
            vehicles={state.vehicles}
            incidents={state.incidents}
            height="620px"
          />
        </div>

        {/* RIGHT COLUMN: GIS TELEMETRY & NER CORRIDOR SUMMARY */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="card-clean p-4 space-y-3">
            <h3 className="text-sm font-bold text-gov-navy flex items-center gap-2 border-b border-slate-100 pb-2">
              <Layers className="w-4 h-4 text-gov-blue" />
              <span>NER Key Corridors Telemetry</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gov-navy">NH-39 Guwahati - Shillong</div>
                  <span className="text-3xs text-red-600 font-bold">Landslide at Nongpoh (KM 34)</span>
                </div>
                <span className="text-3xs font-extrabold bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200">🔴 BLOCKED</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gov-navy">NH-44 Jowai - Silchar Bypass</div>
                  <span className="text-3xs text-emerald-600 font-bold">Safe Relief Transit Corridor</span>
                </div>
                <span className="text-3xs font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">🟢 OPEN</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gov-navy">NH-37 Imphal Convoy Pass</div>
                  <span className="text-3xs text-amber-600 font-bold">Rainfall Waterlog Caution</span>
                </div>
                <span className="text-3xs font-extrabold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">🟡 CAUTION</span>
              </div>
            </div>
          </div>

          <div className="card-clean p-4 space-y-3">
            <h3 className="text-sm font-bold text-gov-navy flex items-center gap-2 border-b border-slate-100 pb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Active Geospatial Incidents</span>
            </h3>

            <div className="space-y-2 text-xs">
              {(state.incidents || []).map((inc) => (
                <div key={inc.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gov-navy">⛰ {inc.type}</span>
                    <span className="text-3xs font-bold text-red-600">{inc.severity} Severity</span>
                  </div>
                  <p className="text-3xs text-slate-600">{inc.roadName}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
