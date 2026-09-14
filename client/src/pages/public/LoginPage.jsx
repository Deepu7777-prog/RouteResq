import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/StateContext';
import { Navigation, ArrowRight, ShieldCheck, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const { login: authLogin } = useAuth();
  const { setCurrentView, selectedDemoEmail, login: stateLogin } = useAppState();

  const [email, setEmail] = useState(selectedDemoEmail || 'driver@routeresq.demo');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (selectedDemoEmail) {
      setEmail(selectedDemoEmail);
    }
  }, [selectedDemoEmail]);

  const demoAccounts = [
    { label: '🚛 Truck Driver (Rajesh Kumar)', email: 'driver@routeresq.demo' },
    { label: '🚚 Logistics Manager (Animesh Das)', email: 'logistics@routeresq.demo' },
    { label: '🏛 Government Authority (Commander P. Baruah)', email: 'authority@routeresq.demo' },
    { label: '📍 Field Officer (Officer T. Sangma)', email: 'field@routeresq.demo' }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await authLogin(email, password);
    setLoading(false);

    if (res.success && res.user) {
      await stateLogin(email, password);
      const roleUpper = (res.user.role || '').toUpperCase();
      if (roleUpper === 'AUTHORITY') setCurrentView('authority');
      else if (roleUpper === 'LOGISTICS') setCurrentView('logistics');
      else if (roleUpper === 'DRIVER') setCurrentView('driver');
      else if (roleUpper === 'FIELD_OFFICER' || roleUpper === 'FIELD') setCurrentView('field');
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please check credentials.');
    }
  };

  const handleSelectDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6 animate-fade-in">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-gov-blue text-white flex items-center justify-center mx-auto shadow-sm">
          <Navigation className="w-6 h-6 font-bold transform -rotate-45" />
        </div>
        <h1 className="text-2xl font-extrabold text-gov-navy tracking-tight">RouteResQ Portal Login</h1>
        <p className="text-xs text-slate-500">Smart Logistics & Road Accessibility Intelligence Platform</p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-center">
          {errorMsg}
        </div>
      )}

      {/* Clean Login Form */}
      <form onSubmit={handleLogin} className="card-clean p-6 space-y-4 bg-white">
        
        {/* Demo Account Quick Selector */}
        <div className="space-y-1">
          <label className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider block">
            Selected Operational Role
          </label>
          <select
            onChange={(e) => handleSelectDemo(e.target.value)}
            value={email}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none"
          >
            {demoAccounts.map(acc => (
              <option key={acc.email} value={acc.email}>
                {acc.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-bold text-slate-700">Email Address / User ID</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. driver@routeresq.demo"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 font-medium focus:border-gov-blue focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-3xs text-gov-blue hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 font-medium focus:border-gov-blue focus:outline-none"
            />
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-3xs text-slate-600 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gov-blue shrink-0" />
          <span>Secured with JWT authentication & bcrypt password hashing.</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gov-blue hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </form>

      {/* Return to Role Selector & Registration CTAs */}
      <div className="flex items-center justify-between text-xs text-slate-600">
        <button
          onClick={() => setCurrentView('role-selection')}
          className="font-bold text-slate-500 hover:text-slate-800 hover:underline"
        >
          ← Role Selection
        </button>
        <button
          onClick={() => setCurrentView('register')}
          className="font-bold text-gov-blue hover:underline"
        >
          Create Account →
        </button>
      </div>

    </div>
  );
}
