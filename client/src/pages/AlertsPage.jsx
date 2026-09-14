import React from 'react';
import { useAppState } from '../context/StateContext';
import { Bell, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export default function AlertsPage() {
  const { state } = useAppState();

  if (!state) return <div className="p-8 text-center text-slate-400">Loading System Alerts Log...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-navy-900 border border-navy-700 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">System Broadcast & Role Notifications Log</h1>
            <p className="text-xs text-slate-300">Synchronized cross-role emergency alerts and reroute logs</p>
          </div>
        </div>

        <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-500/40">
          {state.alerts.length} Total Alerts Logged
        </span>
      </div>

      <div className="space-y-3">
        {state.alerts.map((alt) => {
          const isDanger = alt.type === 'danger' || alt.type === 'warning';
          const isSuccess = alt.type === 'success';

          return (
            <div
              key={alt.id}
              className={`p-4 rounded-xl border shadow-lg flex items-start gap-4 ${
                isDanger
                  ? 'bg-red-950/40 border-red-500/40 text-red-100'
                  : isSuccess
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                  : 'bg-navy-900 border-navy-700 text-slate-200'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDanger ? (
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                ) : isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Info className="w-5 h-5 text-cyan-400" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{alt.title}</h4>
                  <span className="font-mono text-3xs text-slate-400">
                    {new Date(alt.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{alt.message}</p>
                <div className="pt-1 flex items-center gap-2">
                  <span className="text-3xs font-mono uppercase bg-navy-950 px-2 py-0.5 rounded border border-navy-800 text-slate-400">
                    Target: {alt.targetRole}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
