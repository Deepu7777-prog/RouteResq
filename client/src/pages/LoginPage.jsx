import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { Navigation, ArrowRight, Key, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { login, setCurrentView, t } = useAppState();
  const [selectedUsername, setSelectedUsername] = useState('driver_demo');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const accounts = [
    { username: 'driver_demo', label: '🚛 Driver Portal (Rajesh Kumar)' },
    { username: 'logistics_demo', label: '🚚 Logistics Manager (Animesh Das)' },
    { username: 'authority_demo', label: '🏛 Government Authority (Commander P. Baruah)' },
    { username: 'field_demo', label: '📍 Field Officer (Officer T. Sangma)' }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const res = await login(selectedUsername);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Login failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6 animate-fade-in">
      
      {/* Brand Logo & Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-gov-blue text-white flex items-center justify-center mx-auto shadow-sm">
          <Navigation className="w-6 h-6 font-bold transform -rotate-45" />
        </div>
        <h1 className="text-2xl font-extrabold text-gov-navy tracking-tight">Welcome to RouteResQ</h1>
        <p className="text-xs text-slate-600">Select a demo account to access your role dashboard.</p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-center">
          {errorMsg}
        </div>
      )}

      {/* Clean Login Card */}
      <form onSubmit={handleLogin} className="card-clean p-6 space-y-5">
        
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Select Demo User Role Account</label>
          <select
            value={selectedUsername}
            onChange={(e) => setSelectedUsername(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-xs text-slate-800 font-medium focus:border-gov-blue focus:outline-none"
          >
            {accounts.map(acc => (
              <option key={acc.username} value={acc.username}>
                {acc.label}
              </option>
            ))}
          </select>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-3xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-gov-blue" />
            <span>Prototype Demo Authentication</span>
          </div>
          <p>Authenticates instantly with centralized real-time regional state.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gov-blue hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          <span>{loading ? 'Accessing Dashboard...' : 'Continue to Dashboard'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </form>

      {/* Return to Role Selector */}
      <div className="text-center">
        <button
          onClick={() => setCurrentView('role-selection')}
          className="text-xs font-semibold text-gov-blue hover:underline"
        >
          ← Choose Role Options
        </button>
      </div>

    </div>
  );
}
