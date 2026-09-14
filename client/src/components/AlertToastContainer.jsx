import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export default function AlertToastContainer() {
  const { state } = useAppState();
  const [activeAlert, setActiveAlert] = useState(null);
  const [lastAlertId, setLastAlertId] = useState(null);

  useEffect(() => {
    if (state?.alerts?.length > 0) {
      const latest = state.alerts[0];
      if (latest && latest.id !== lastAlertId) {
        setActiveAlert(latest);
        setLastAlertId(latest.id);

        const timer = setTimeout(() => {
          setActiveAlert(null);
        }, 4000); // Auto dismiss after 4s
        return () => clearTimeout(timer);
      }
    }
  }, [state?.alerts, lastAlertId]);

  if (!activeAlert) return null;

  const isDanger = activeAlert.type === 'danger' || activeAlert.type === 'warning';
  const isSuccess = activeAlert.type === 'success';

  return (
    <div className="fixed top-20 right-5 z-50 max-w-sm w-full pointer-events-none animate-fade-in">
      <div
        className={`pointer-events-auto p-3 rounded-lg border shadow-md flex items-center justify-between gap-3 ${
          isDanger
            ? 'bg-red-900 text-white border-red-700'
            : isSuccess
            ? 'bg-emerald-900 text-white border-emerald-700'
            : 'bg-slate-900 text-white border-slate-700'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {isDanger ? (
            <AlertTriangle className="w-4 h-4 text-red-300 shrink-0" />
          ) : isSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-sky-300 shrink-0" />
          )}

          <div className="truncate">
            <h5 className="text-xs font-bold truncate leading-snug">{activeAlert.title}</h5>
            <p className="text-3xs text-slate-200 truncate leading-normal">{activeAlert.message}</p>
          </div>
        </div>

        <button
          onClick={() => setActiveAlert(null)}
          className="text-slate-300 hover:text-white p-0.5 rounded shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
