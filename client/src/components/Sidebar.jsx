import React from 'react';
import { useAppState } from '../context/StateContext';
import {
  LayoutDashboard, Map, AlertTriangle, Route, Truck, ShieldAlert,
  Bell, FileText, Send, Navigation, ArrowLeft, UserCheck, Play, Video
} from 'lucide-react';

export default function Sidebar() {
  const { currentUser, currentView, setCurrentView } = useAppState();

  if (!currentUser || currentView === 'landing' || currentView === 'login' || currentView === 'role-selection') {
    return null;
  }

  const role = (currentUser?.role || '').toLowerCase();

  const authorityLinks = [
    { id: 'authority', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'demo-video', label: 'Demo Video', icon: Play },
    { id: 'user-verification', label: 'User Verification', icon: UserCheck },
    { id: 'incidents', label: 'Incidents Directory', icon: AlertTriangle },
    { id: 'risk-zones', label: 'Risk Monitoring', icon: ShieldAlert },
    { id: 'roads', label: 'Route Management', icon: Route },
    { id: 'gis-map', label: 'Live Map Surveillance', icon: Map },
    { id: 'alerts', label: 'Alerts Log', icon: Bell },
    { id: 'reports', label: 'Reports & Analytics', icon: FileText },
  ];

  const logisticsLinks = [
    { id: 'logistics', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'demo-video', label: 'Demo Video', icon: Play },
    { id: 'fleet', label: 'Fleet Deliveries', icon: Truck },
    { id: 'tracking', label: 'Vehicle Tracking', icon: Navigation },
    { id: 'alerts', label: 'Notifications', icon: Bell },
  ];

  const driverLinks = [
    { id: 'driver', label: 'Driver Dashboard', icon: LayoutDashboard },
    { id: 'demo-video', label: 'Demo Video', icon: Play },
    { id: 'driver-route', label: 'My Route Details', icon: Route },
    { id: 'alerts', label: 'Alerts', icon: Bell },
  ];

  const fieldLinks = [
    { id: 'field', label: 'Report a Problem', icon: Send },
    { id: 'demo-video', label: 'Demo Video', icon: Play },
    { id: 'incidents', label: 'Recent Reports', icon: AlertTriangle },
  ];

  const citizenLinks = [
    { id: 'citizen', label: 'Citizen Dashboard', icon: LayoutDashboard },
    { id: 'demo-video', label: 'Demo Video', icon: Play },
    { id: 'alerts', label: 'Emergency Alerts', icon: Bell },
  ];

  let links = authorityLinks;
  if (role.includes('logistics')) links = logisticsLinks;
  else if (role.includes('driver')) links = driverLinks;
  else if (role.includes('field')) links = fieldLinks;
  else if (role.includes('citizen')) links = citizenLinks;

  return (
    <aside className="w-60 bg-white border-r border-slate-200 shrink-0 hidden md:flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        
        {/* User Badge */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gov-blue text-white flex items-center justify-center font-bold text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-gov-navy truncate">{currentUser.name}</h4>
              <p className="text-3xs text-slate-500 capitalize">{currentUser.role}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-3xs font-extrabold text-slate-400 tracking-wider uppercase">
            Menu Navigation
          </div>
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-gov-blue border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-gov-navy'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gov-blue' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Return Button */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={() => setCurrentView('landing')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home Page</span>
        </button>
      </div>
    </aside>
  );
}
