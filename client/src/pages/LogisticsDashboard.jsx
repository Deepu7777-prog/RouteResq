import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import GoogleMapView from '../components/GoogleMapView';
import RouteComparisonModal from '../components/RouteComparisonModal';
import { Truck, AlertTriangle, CheckCircle2, Clock, Navigation, ShieldCheck, ArrowRight, Route } from 'lucide-react';

export default function LogisticsDashboard() {
  const { state, t } = useAppState();
  const [selectedVehicleForReroute, setSelectedVehicleForReroute] = useState(null);

  if (!state) return <div className="p-8 text-center text-slate-500">Loading Operations...</div>;

  const affectedVehicles = state.vehicles.filter(v => v.isAffected || (v.alternativeRoute && v.alternativeRoute.success));
  const activeCount = state.vehicles.length;
  const onTimeCount = state.vehicles.filter(v => !v.isAffected).length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="card-clean p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gov-navy">Logistics Operations Command</h1>
            <p className="text-xs text-slate-600">Track relief cargo and manage delivery routes</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>NER Fleet Operations Active</span>
        </div>
      </div>

      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="card-clean p-5 space-y-1">
          <span className="text-3xs font-extrabold text-slate-500 uppercase tracking-wider">{t('logistics_active_deliveries')}</span>
          <div className="text-2xl font-extrabold text-gov-navy flex items-center justify-between">
            <span>{activeCount}</span>
            <Truck className="w-5 h-5 text-gov-blue" />
          </div>
          <p className="text-3xs text-slate-500">Essential Cargo Transits</p>
        </div>

        <div className="card-clean p-5 space-y-1">
          <span className="text-3xs font-extrabold text-slate-500 uppercase tracking-wider">{t('logistics_on_route')}</span>
          <div className="text-2xl font-extrabold text-emerald-600 flex items-center justify-between">
            <span>{onTimeCount}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xs text-emerald-700">Normal Travel Schedule</p>
        </div>

        <div className="card-clean p-5 space-y-1">
          <span className="text-3xs font-extrabold text-slate-500 uppercase tracking-wider">{t('logistics_affected')}</span>
          <div className="text-2xl font-extrabold text-red-600 flex items-center justify-between">
            <span>{affectedVehicles.length}</span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xs text-red-700">Action Required</p>
        </div>

      </div>

      {/* SIDE-BY-SIDE SPLIT SCREEN: MAP ON LEFT, FLEET CONTROL & DISRUPTIONS ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: LIVE FLEET GOOGLE MAP (IMMEDIATELY VISIBLE AT TOP) */}
        <div className="lg:col-span-6 card-clean p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-gov-navy flex items-center gap-2">
              <Route className="w-4 h-4 text-gov-blue" />
              <span>Live Fleet Transit & Alternative Corridor Map</span>
            </h3>
            <span className="text-3xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Live Fleet Active
            </span>
          </div>

          <GoogleMapView
            roads={state.roads}
            nodes={state.nodes}
            vehicles={state.vehicles}
            incidents={state.incidents}
            height="460px"
          />
        </div>

        {/* RIGHT COLUMN: DISRUPTIONS & DELIVERIES TABLE */}
        <div className="lg:col-span-6 space-y-4">

      {/* DELIVERY AFFECTED BANNER */}
      {affectedVehicles.length > 0 && (
        <div className="card-clean p-5 border-2 border-red-500 bg-red-50/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <span className="text-3xs font-extrabold text-red-700 uppercase bg-red-100 px-2 py-0.5 rounded">
                {t('logistics_delivery_affected')}
              </span>
              <h3 className="text-base font-extrabold text-gov-navy">
                Vehicle {affectedVehicles[0].id} Route Disrupted
              </h3>
              <p className="text-xs text-slate-700">
                Landslide blocked the Nongpoh-Shillong road. A safer alternative route has been calculated.
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedVehicleForReroute(affectedVehicles[0])}
            className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-sm transition-all shrink-0 flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            <span>{t('logistics_btn_view_alt')}</span>
          </button>
        </div>
      )}

      {/* MY DELIVERIES TABLE */}
      <div className="card-clean p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-gov-navy">{t('logistics_my_deliveries')}</h3>
          <span className="text-xs text-slate-500">Essential Fleet List</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 text-3xs font-extrabold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Truck ID</th>
                <th className="py-3 px-4">Cargo Payload</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">ETA</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {state.vehicles.map((v) => {
                const isDisrupted = v.isAffected || (v.alternativeRoute && v.alternativeRoute.success);

                return (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gov-navy">{v.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-gov-blue">{v.cargo}</td>
                    <td className="py-3.5 px-4 text-slate-600">Guwahati → Silchar</td>
                    <td className="py-3.5 px-4">
                      {isDisrupted ? (
                        <span className="bg-red-100 text-red-700 border border-red-200 text-3xs font-bold px-2 py-0.5 rounded-full">
                          ⚠ Route Affected
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-3xs font-bold px-2 py-0.5 rounded-full">
                          🟢 On Route
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {v.activeRoute?.etaFormatted || '3h 20m'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isDisrupted ? (
                        <button
                          onClick={() => setSelectedVehicleForReroute(v)}
                          className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded text-3xs font-bold transition-colors"
                        >
                          View Alternative
                        </button>
                      ) : (
                        <span className="text-3xs text-slate-400">Normal</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

        </div>
      </div>

      {/* Alternative Route Modal */}
      {selectedVehicleForReroute && (
        <RouteComparisonModal
          vehicle={selectedVehicleForReroute}
          onClose={() => setSelectedVehicleForReroute(null)}
        />
      )}

    </div>
  );
}
