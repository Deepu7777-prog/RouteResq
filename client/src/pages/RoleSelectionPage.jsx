import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { useAuth } from '../context/AuthContext';
import { Shield, Truck, Navigation, MapPin, ArrowRight, Zap, ShieldCheck, UserPlus, LogIn, CheckCircle2 } from 'lucide-react';

export default function RoleSelectionPage() {
  const { setCurrentView, setCurrentUser, setSelectedDemoEmail, t } = useAppState();
  const { login: authLogin } = useAuth();
  const [activeTab, setActiveTab] = useState('demo'); // 'demo' | 'real'
  const [loadingRole, setLoadingRole] = useState(null);

  const roles = [
    {
      role: 'authority',
      title: 'Government Authority / Admin',
      icon: Shield,
      email: 'admin.demo@routeresq.com',
      username: 'admin.demo@routeresq.com',
      iconBg: 'bg-blue-100 text-blue-700',
      desc: 'Regional road accessibility monitoring, disaster risk intelligence, emergency resource dispatch.'
    },
    {
      role: 'logistics_officer',
      title: 'Logistics Officer',
      icon: Truck,
      email: 'logistics.demo@routeresq.com',
      username: 'logistics.demo@routeresq.com',
      iconBg: 'bg-emerald-100 text-emerald-700',
      desc: 'Track relief cargo transit, emergency supplies, and alternative route dispatches.'
    },
    {
      role: 'driver',
      title: 'Emergency Vehicle Driver',
      icon: Navigation,
      email: 'driver.demo@routeresq.com',
      username: 'driver.demo@routeresq.com',
      iconBg: 'bg-amber-100 text-amber-700',
      desc: 'Ambulance & relief driver mobile navigation, status updates, and route acceptance.'
    },
    {
      role: 'field_officer',
      title: 'Field Response Officer',
      icon: MapPin,
      email: 'field.demo@routeresq.com',
      username: 'field.demo@routeresq.com',
      iconBg: 'bg-purple-100 text-purple-700',
      desc: 'Field incident reporting for landslides, floods, road damage, and accidents.'
    },
    {
      role: 'citizen',
      title: 'Citizen Emergency User',
      icon: ShieldCheck,
      email: 'citizen.demo@routeresq.com',
      username: 'citizen.demo@routeresq.com',
      iconBg: 'bg-rose-100 text-rose-700',
      desc: '1-Click SOS emergency trigger, medical request, and family rescue tracking.'
    }
  ];

  // Hackathon Demo: Role Selection -> Demo Dashboard Directly
  const handleInstantDemoAccess = async (roleItem) => {
    setLoadingRole(roleItem.role);
    try {
      const res = await authLogin(roleItem.email, 'Demo@123');
      if (res.success && res.user) {
        if (setCurrentUser) setCurrentUser(res.user);
        const roleUpper = (res.user.role || '').toUpperCase();
        if (roleUpper === 'ADMIN' || roleUpper === 'AUTHORITY') setCurrentView('authority');
        else if (roleUpper.includes('LOGISTICS')) setCurrentView('logistics');
        else if (roleUpper === 'DRIVER') setCurrentView('driver');
        else if (roleUpper.includes('FIELD')) setCurrentView('field');
        else if (roleUpper === 'CITIZEN') setCurrentView('citizen');
        else setCurrentView('authority');
      } else {
        throw new Error('API login unsuccessful, falling back to mock user');
      }
    } catch {
      // Demo Fallback: initialize demo state without blocking the judge
      const mockUser = {
        name: roleItem.title,
        email: roleItem.email,
        role: roleItem.role.toUpperCase(),
        department: 'Emergency Operations Demo'
      };
      localStorage.setItem('routeresq_user', JSON.stringify(mockUser));
      localStorage.setItem('routeresq_token', 'demo-jwt-token-hackathon');
      if (setCurrentUser) setCurrentUser(mockUser);

      const roleUpper = roleItem.role.toUpperCase();
      if (roleUpper.includes('AUTHORITY') || roleUpper.includes('ADMIN')) setCurrentView('authority');
      else if (roleUpper.includes('LOGISTICS')) setCurrentView('logistics');
      else if (roleUpper.includes('DRIVER')) setCurrentView('driver');
      else if (roleUpper.includes('FIELD')) setCurrentView('field');
      else if (roleUpper.includes('CITIZEN')) setCurrentView('citizen');
      else setCurrentView('authority');
    } finally {
      setLoadingRole(null);
    }
  };

  // Real Application Flow: Select Role -> Proceed to Login / Registration with Verification
  const handleRealAppSelect = (email) => {
    if (setSelectedDemoEmail) setSelectedDemoEmail(email);
    localStorage.setItem('routeresq_selected_email', email);
    setCurrentView('login');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8 animate-fade-in">
      
      {/* Page Title & Dual Mode Tab Selector */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy tracking-tight">
          RouteResQ Platform Access
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Choose your presentation experience: Judge Quick Demo Mode or Production Real Application Authentication.
        </p>

        {/* Mode Toggle Switch */}
        <div className="inline-flex p-1 rounded-xl bg-slate-200/80 border border-slate-300 gap-1 text-xs font-bold shadow-inner">
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'demo'
                ? 'bg-gov-blue text-white shadow-sm'
                : 'text-slate-700 hover:text-gov-navy'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Hackathon Quick Demo (1-Click)</span>
          </button>

          <button
            onClick={() => setActiveTab('real')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'real'
                ? 'bg-gov-blue text-white shadow-sm'
                : 'text-slate-700 hover:text-gov-navy'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Real Application Flow (Registration & Verification)</span>
          </button>
        </div>
      </div>

      {/* MODE 1: HACKATHON DEMO (Role Selection -> Demo Dashboard Directly) */}
      {activeTab === 'demo' && (
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-medium">
                <strong>SIH Hackathon Presentation Mode:</strong> Click any role below to open that role's dashboard directly with pre-seeded prototype data.
              </span>
            </div>
            <span className="text-3xs font-mono font-bold bg-amber-200 px-2 py-0.5 rounded text-amber-900">
              1-Click Direct Access
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((item) => {
              const Icon = item.icon;
              const isLoading = loadingRole === item.role;

              return (
                <div
                  key={item.role}
                  onClick={() => handleInstantDemoAccess(item)}
                  className="card-clean p-5 flex flex-col justify-between cursor-pointer border-2 hover:border-gov-blue transition-all group hover:shadow-md bg-white"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${item.iconBg}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-3xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                        VERIFIED ✓
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-gov-navy group-hover:text-gov-blue transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-3xs text-slate-500 font-mono truncate">{item.email}</p>
                      <p className="text-xs text-slate-600 leading-relaxed pt-1">{item.desc}</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-gov-blue">
                    <span>{isLoading ? 'Opening Dashboard...' : 'Open Demo Dashboard'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: REAL PRODUCTION APPLICATION FLOW (Registration -> Profile -> Verification -> Login -> Dashboard) */}
      {activeTab === 'real' && (
        <div className="card-clean p-8 space-y-6 bg-white max-w-2xl mx-auto">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Production Security Flow</span>
            </div>
            <h3 className="text-lg font-extrabold text-gov-navy">
              Real Production Lifecycle Architecture
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Demonstrates real government onboarding: User Registration → Profile Creation → Authority Verification Badge → JWT Authentication → Role Dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => setCurrentView('register')}
              className="p-5 rounded-xl border border-slate-200 hover:border-gov-blue bg-slate-50 hover:bg-blue-50/40 text-left space-y-2 group transition-all"
            >
              <UserPlus className="w-6 h-6 text-gov-blue" />
              <h4 className="text-sm font-bold text-gov-navy group-hover:text-gov-blue">1. Register New Account</h4>
              <p className="text-xs text-slate-500">Submit employee ID, role details & department profile for authority verification.</p>
            </button>

            <button
              onClick={() => setCurrentView('login')}
              className="p-5 rounded-xl border border-slate-200 hover:border-gov-blue bg-slate-50 hover:bg-blue-50/40 text-left space-y-2 group transition-all"
            >
              <LogIn className="w-6 h-6 text-emerald-600" />
              <h4 className="text-sm font-bold text-gov-navy group-hover:text-gov-blue">2. Login to Account</h4>
              <p className="text-xs text-slate-500">Authenticate verified accounts with email & password via bcrypt and JWT session.</p>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
