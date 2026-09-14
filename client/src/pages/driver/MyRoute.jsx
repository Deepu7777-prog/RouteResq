import React from 'react';
import { useAppState } from '../../context/StateContext';
import LeafletMap from '../../components/LeafletMap';
import { Navigation, Clock, ShieldCheck, MapPin } from 'lucide-react';

export default function MyRoute() {
  const { state } = useAppState();

  if (!state) return <div className="p-8 text-center text-slate-500">Loading Route...</div>;

  const vehicle = state.vehicles.find(v => v.id === 'TRK001') || state.vehicles[0];

  return (
    <div className="space-y-5 max-w-2xl mx-auto animate-fade-in">
      <div className="card-clean p-5 space-y-2">
        <h2 className="text-lg font-bold text-gov-navy flex items-center gap-2">
          <Navigation className="w-5 h-5 text-gov-blue" />
          <span>Active Delivery Route: Guwahati → Silchar</span>
        </h2>
        <p className="text-xs text-slate-600">Transit Corridor NH-40 / NH-27 Bypass Highway</p>
      </div>

      <div className="card-clean p-4 space-y-3">
        <LeafletMap
          roads={state.roads}
          nodes={state.nodes}
          vehicles={[vehicle]}
          incidents={state.incidents}
          height="380px"
        />
      </div>
    </div>
  );
}
