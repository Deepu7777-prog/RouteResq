import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import GoogleMapView from '../components/GoogleMapView';
import { MapPin, Send, AlertTriangle, Camera, CheckCircle2, Mountain, CloudRain, Construction, Car, WifiOff, Wifi, Route } from 'lucide-react';

export default function FieldOfficerPortal() {
  const { state, submitIncident, t } = useAppState();

  const [form, setForm] = useState({
    type: 'Landslide',
    roadId: 'R02',
    severity: 'High',
    description: 'Debris blocking Nongpoh-Shillong Pass (R02).',
    reportedBy: 'Officer T. Sangma'
  });

  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [pickedCoords, setPickedCoords] = useState([25.90, 91.88]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!state) return <div className="p-8 text-center text-slate-500">Loading Field Portal...</div>;

  const incidentTypes = [
    { label: '⛰ Landslide', value: 'Landslide', icon: Mountain },
    { label: '🌧 Flood', value: 'Flood', icon: CloudRain },
    { label: '🚧 Road Damage', value: 'Road Damage', icon: Construction },
    { label: '🚗 Accident', value: 'Traffic Blockage', icon: Car }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.type || !form.roadId || !form.severity) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setSubmitting(true);

    const payload = {
      ...form,
      locationCoords: pickedCoords
    };

    const res = await submitIncident(payload);
    setSubmitting(false);

    if (res.success) {
      setSubmittedSuccess(true);
    } else {
      setErrorMsg(res.error || 'Failed to submit report.');
    }
  };

  const handleResetForm = () => {
    setSubmittedSuccess(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="card-clean p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-gov-navy">{t('field_title')}</h1>
            <p className="text-xs text-slate-500">Field Incident Reporting & Command GIS</p>
          </div>
        </div>

        <button
          onClick={() => setIsOfflineMode(!isOfflineMode)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-3xs font-bold border transition-colors ${
            isOfflineMode ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          {isOfflineMode ? <WifiOff className="w-3 h-3 text-amber-600" /> : <Wifi className="w-3 h-3 text-emerald-600" />}
          <span>{isOfflineMode ? 'Offline Mode' : 'Online Sync'}</span>
        </button>
      </div>

      {/* SIDE-BY-SIDE SPLIT CONTAINER: MAP ON LEFT, FORM ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: LIVE GIS MAP (IMMEDIATELY VISIBLE AT TOP) */}
        <div className="lg:col-span-7 card-clean p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-gov-navy flex items-center gap-2">
              <Route className="w-4 h-4 text-purple-600" />
              <span>Field Incident Location Map</span>
            </h3>
            <span className="text-3xs font-bold text-slate-500">Interactive Pins & Vulnerable Zones</span>
          </div>

          <GoogleMapView
            roads={state.roads}
            nodes={state.nodes}
            vehicles={state.vehicles}
            incidents={state.incidents}
            height="520px"
          />
        </div>

        {/* RIGHT COLUMN: INCIDENT REPORT FORM */}
        <div className="lg:col-span-5">
          {submittedSuccess ? (
            <div className="card-clean p-6 space-y-4 text-center border-2 border-emerald-500 bg-emerald-50/50">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-emerald-900">{t('field_success_title')}</h3>
                <p className="text-xs text-slate-600">{t('field_success_desc')}</p>
              </div>

              <button
                onClick={handleResetForm}
                className="w-full py-2.5 rounded-lg bg-gov-blue text-white font-bold text-xs shadow-sm"
              >
                Report Another Issue
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card-clean p-5 space-y-4">
              
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Question 1: What happened? */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gov-navy block">{t('field_what_happened')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {incidentTypes.map((item) => (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() => setForm({ ...form, type: item.value })}
                      className={`p-2.5 rounded-lg text-xs font-bold border transition-all text-left flex items-center gap-2 ${
                        form.type === item.value
                          ? 'bg-gov-blue text-white border-gov-blue'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Where is it? */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gov-navy block">{t('field_where')}</label>
                <select
                  value={form.roadId}
                  onChange={(e) => setForm({ ...form, roadId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none"
                >
                  {state.roads.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question 3: How serious? */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gov-navy block">{t('field_severity')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Low', 'Medium', 'High'].map((sev) => (
                    <button
                      type="button"
                      key={sev}
                      onClick={() => setForm({ ...form, severity: sev })}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                        form.severity === sev
                          ? sev === 'High'
                            ? 'bg-red-600 text-white border-red-600'
                            : sev === 'Medium'
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Mock */}
              <div className="p-3 bg-slate-50 rounded-lg border border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-purple-600" />
                  <span>{t('field_photo')}</span>
                </div>
                <span className="text-3xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold">
                  landslide.jpg
                </span>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">{t('field_notes')}</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Add optional notes..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg bg-gov-blue hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending Report...' : t('field_btn_submit')}</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
