import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import GoogleMapView from '../components/GoogleMapView';
import { Truck, Navigation, AlertTriangle, CheckCircle2, Clock, MapPin, ArrowRight } from 'lucide-react';

export default function DriverDashboard() {
  const { state, acceptAlternativeRoute, t } = useAppState();
  const [showRerouteDetails, setShowRerouteDetails] = useState(false);

  if (!state) return <div className="p-8 text-center text-slate-500">Loading Driver Portal...</div>;

  const vehicle = state.vehicles.find(v => v.id === 'TRK001') || state.vehicles[0];
  const isDisrupted = vehicle.isAffected || (vehicle.alternativeRoute && vehicle.alternativeRoute.success);

  const handleAcceptRoute = async () => {
    await acceptAlternativeRoute(vehicle.id);
    setShowRerouteDetails(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-10">
      
      {/* SIDE-BY-SIDE SPLIT SCREEN: MAP ON LEFT, DRIVER HUD & ACTION PANEL ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: GOOGLE MAP LIVE GPS ROUTE GUIDANCE (IMMEDIATELY VISIBLE) */}
        <div className="lg:col-span-7 card-clean p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-gov-navy flex items-center gap-2">
              <Navigation className="w-4 h-4 text-gov-blue" />
              <span>Live Emergency Driver Navigation Map</span>
            </h3>
            <span className="text-3xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Live GPS Tracking
            </span>
          </div>

          <GoogleMapView
            roads={state.roads}
            nodes={state.nodes}
            vehicles={[vehicle]}
            incidents={state.incidents}
            height="500px"
          />
        </div>

        {/* RIGHT COLUMN: DRIVER HUD & ACTION CONTROL PANEL */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Driver Welcome Card */}
          <div className="card-clean p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-extrabold text-gov-navy">{t('driver_hello')}</h2>
                <p className="text-xs text-slate-500">{t('driver_current_delivery')}</p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                isDisrupted
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {isDisrupted ? '⚠ Road Problem Ahead' : '🟢 Route Safe'}
              </span>
            </div>

            {/* Essential Delivery Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-0.5">
                <span className="text-3xs font-semibold text-slate-500 uppercase">{t('driver_vehicle')}</span>
                <p className="font-bold text-gov-navy text-sm">{vehicle.id}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-0.5">
                <span className="text-3xs font-semibold text-slate-500 uppercase">{t('driver_cargo')}</span>
                <p className="font-bold text-gov-blue text-xs truncate">{vehicle.cargo}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-0.5">
                <span className="text-3xs font-semibold text-slate-500 uppercase">{t('driver_from')}</span>
                <p className="font-bold text-slate-800 text-xs">Guwahati</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-0.5">
                <span className="text-3xs font-semibold text-slate-500 uppercase">{t('driver_to')}</span>
                <p className="font-bold text-slate-800 text-xs">Silchar</p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gov-blue" />
                <span className="text-slate-700 font-semibold">{t('driver_eta')}:</span>
              </div>
              <span className="font-bold text-gov-blue text-sm">
                {vehicle.activeRoute?.etaFormatted || '3 hours 20 minutes'}
              </span>
            </div>
          </div>

          {/* DISRUPTION ALERT BANNER */}
          {isDisrupted && (
            <div className="card-clean p-5 space-y-4 border-2 border-red-500 bg-red-50/50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-red-800">⚠ Road Problem Ahead</h3>
                  <p className="text-xs text-slate-700">Landslide reported on your current route (Nongpoh-Shillong Pass).</p>
                </div>
              </div>

              {!showRerouteDetails ? (
                <button
                  onClick={() => setShowRerouteDetails(true)}
                  className="w-full py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>SEE SAFER ROUTE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="space-y-3 pt-2 border-t border-red-200">
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2 text-xs">
                    <span className="font-bold text-gov-navy block">🗺 Recommended safer bypass route</span>
                    <div className="flex items-center justify-between font-bold text-slate-700 text-3xs">
                      <span>Guwahati</span>
                      <span>→</span>
                      <span>Nagaon</span>
                      <span>→</span>
                      <span>Haflong</span>
                      <span>→</span>
                      <span>Silchar</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 pt-2 text-slate-600">
                      <span>New Travel Time:</span>
                      <span className="font-bold text-amber-700">4 hours 05 minutes</span>
                    </div>
                  </div>

                  <button
                    onClick={handleAcceptRoute}
                    className="w-full py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>ACCEPT NEW ROUTE</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
