import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { useAuth } from '../context/AuthContext';
import GoogleMapView from '../components/GoogleMapView';
import { Shield, AlertTriangle, PhoneCall, Clock, MapPin, Truck, CheckCircle2, Send, Navigation, HeartHandshake, Route } from 'lucide-react';

export default function CitizenDashboard() {
  const { state, t } = useAppState();
  const { user } = useAuth();

  const [sosActive, setSosActive] = useState(false);
  const [selectedService, setSelectedService] = useState('medical');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  if (!state) return <div className="p-8 text-center text-slate-500">Loading Citizen Emergency Portal...</div>;

  const demoRequests = [
    { id: 'REQ-DEMO-001', type: 'Accident', service: 'Ambulance + Police', status: 'Dispatched', eta: '8 minutes', vehicle: 'TS-DEMO-108', driver: 'Arjun Kumar' },
    { id: 'REQ-DEMO-002', type: 'Medical Emergency', service: 'Ambulance', status: 'Responding', eta: '5 minutes', vehicle: 'TS-DEMO-108', driver: 'Arjun Kumar' },
    { id: 'REQ-DEMO-003', type: 'Fire Emergency', service: 'Fire Response', status: 'Resolved', eta: '0 minutes', vehicle: 'FIRE-DEMO-99', driver: 'Fire Crew' }
  ];

  const handleTriggerSOS = () => {
    setSosActive(true);
    setTimeout(() => {
      setRequestSubmitted(true);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header Banner */}
      <div className="card-clean p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gov-navy">Citizen Emergency Dashboard</h1>
            <p className="text-xs text-slate-500">Welcome, {user?.full_name || 'RouteResQ Demo Citizen'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Emergency Helpline Connected (108 / 112)</span>
        </div>
      </div>

      {/* 1-CLICK SOS TRIGGER BANNER */}
      <div className="card-clean p-6 bg-gradient-to-r from-red-600 to-rose-700 text-white space-y-4 shadow-lg rounded-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-3xs font-extrabold bg-red-800/80 uppercase px-2.5 py-0.5 rounded tracking-wider text-rose-200">
              Immediate Assistance
            </span>
            <h2 className="text-2xl font-extrabold">Instant 1-Click SOS Signal</h2>
            <p className="text-xs text-rose-100 max-w-md">
              Broadcasts your GPS location instantly to nearest rescue dispatchers, medical teams, and emergency officers.
            </p>
          </div>

          <button
            onClick={handleTriggerSOS}
            className={`px-8 py-4 rounded-xl font-black text-sm shadow-xl transition-all flex items-center gap-2 shrink-0 ${
              sosActive
                ? 'bg-amber-400 text-slate-900 animate-pulse'
                : 'bg-white text-red-700 hover:bg-rose-50 hover:scale-105'
            }`}
          >
            <PhoneCall className="w-5 h-5 fill-current" />
            <span>{sosActive ? 'SOS DISPATCHING...' : 'TRIGGER 1-CLICK SOS'}</span>
          </button>
        </div>

        {requestSubmitted && (
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-xs flex items-center justify-between">
            <span className="font-bold text-white">✓ SOS Signal Broadcasted • Emergency ID: REQ-DEMO-001</span>
            <span className="text-3xs bg-amber-400 text-slate-900 font-extrabold px-2 py-0.5 rounded">ETA: 8 minutes</span>
          </div>
        )}
      </div>

      {/* SIDE-BY-SIDE SPLIT CONTAINER: MAP ON LEFT, EMERGENCY CONTROLS ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: LIVE EMERGENCY GOOGLE MAP (IMMEDIATELY VISIBLE AT TOP) */}
        <div className="lg:col-span-7 card-clean p-4 space-y-3 bg-white border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-gov-navy flex items-center gap-2">
              <Route className="w-4 h-4 text-rose-600" />
              <span>Live Rescue Dispatch & Safety Map</span>
            </h3>
            <span className="text-3xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Helpline 108 Online
            </span>
          </div>

          <GoogleMapView
            roads={state.roads}
            nodes={state.nodes}
            vehicles={state.vehicles}
            incidents={state.incidents}
            height="500px"
          />
        </div>

        {/* RIGHT COLUMN: REQUEST ASSISTANCE & TRACKING STATUS */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Request Form */}
          <div className="card-clean p-5 space-y-4 bg-white border border-slate-200">
            <h3 className="text-sm font-bold text-gov-navy flex items-center gap-2">
              <Send className="w-4 h-4 text-gov-blue" />
              <span>Request Assistance</span>
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Emergency Type</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                <option value="medical">🚑 Medical Ambulance Emergency</option>
                <option value="police">🚓 Police Emergency Assistance</option>
                <option value="fire">🚒 Fire Response Request</option>
                <option value="accident">🚗 Road Accident Incident</option>
              </select>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 text-xs text-slate-600">
              <span className="text-3xs font-bold text-slate-500 uppercase">Current Location</span>
              <p className="font-bold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>Nongpoh Pass, Meghalaya (GPS 25.9000, 91.8800)</span>
              </p>
            </div>

            <button
              onClick={() => setRequestSubmitted(true)}
              className="w-full py-2.5 rounded-lg bg-gov-blue hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              Submit Request
            </button>
          </div>

          {/* Live Active Emergency Tracking */}
          <div className="card-clean p-5 space-y-4 bg-white border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-gov-navy flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Active Emergency Response Tracking</span>
              </h3>
              <span className="text-3xs font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                DISPATCHED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-0.5">
                <span className="text-3xs font-bold text-slate-400 uppercase">Request ID</span>
                <p className="font-bold text-gov-navy">REQ-DEMO-001</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-0.5">
                <span className="text-3xs font-bold text-slate-400 uppercase">Service Unit</span>
                <p className="font-bold text-gov-blue">AS-01-EQ-9921</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-0.5">
                <span className="text-3xs font-bold text-slate-400 uppercase">Assigned Driver</span>
                <p className="font-bold text-slate-800">Arjun Kumar</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-0.5">
                <span className="text-3xs font-bold text-slate-400 uppercase">Estimated ETA</span>
                <p className="font-bold text-emerald-600">8 minutes</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* RECENT REQUEST HISTORY TABLE */}
      <div className="card-clean p-5 space-y-3 bg-white border border-slate-200">
        <h3 className="text-sm font-bold text-gov-navy">My Recent Emergency Requests</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-3xs font-extrabold uppercase border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Request ID</th>
                <th className="py-2.5 px-3">Emergency Type</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Assigned Vehicle</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {demoRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-gov-navy">{req.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{req.type}</td>
                  <td className="py-3 px-3 text-gov-blue">{req.service}</td>
                  <td className="py-3 px-3">{req.vehicle} ({req.driver})</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 text-3xs font-bold rounded ${
                      req.status === 'Dispatched' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      req.status === 'Responding' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-800">{req.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
