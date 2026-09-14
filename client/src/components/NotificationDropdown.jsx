import React, { useState, useRef, useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import { Bell, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export default function NotificationDropdown() {
  const { state, currentUser, setCurrentView } = useAppState();
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState([]);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!state || !state.alerts || !currentUser) return null;

  const role = currentUser.role;

  // Filter notifications by user role
  const roleAlerts = state.alerts.filter((alert) => {
    if (alert.targetRole === 'all') return true;
    if (role === 'authority' && (alert.targetRole === 'authority' || alert.type === 'danger' || alert.type === 'warning')) return true;
    if (role === 'logistics' && (alert.targetRole === 'logistics' || alert.type === 'danger')) return true;
    if (role === 'driver' && alert.targetRole === 'driver') return true;
    if (role === 'field' && (alert.targetRole === 'field' || alert.targetRole === 'all')) return true;
    return false;
  });

  const unreadAlerts = roleAlerts.filter(a => !readIds.includes(a.id));
  const unreadCount = unreadAlerts.length;

  const markAllRead = () => {
    setReadIds(roleAlerts.map(a => a.id));
  };

  const handleNotificationClick = (alert) => {
    setReadIds(prev => [...prev, alert.id]);
    setIsOpen(false);
    if (role === 'driver') setCurrentView('driver');
    else if (role === 'logistics') setCurrentView('logistics');
    else if (role === 'authority') setCurrentView('authority');
    else if (role === 'field') setCurrentView('field');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors"
        title="Notifications"
      >
        <Bell className="w-4 h-4 text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-3xs font-extrabold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-sm animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
          
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-gov-blue" />
              <h4 className="text-xs font-bold text-gov-navy">Notifications</h4>
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-gov-blue text-3xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-3xs font-semibold text-gov-blue hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {roleAlerts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No notifications for your role.
              </div>
            ) : (
              roleAlerts.map((alert) => {
                const isRead = readIds.includes(alert.id);
                const isDanger = alert.type === 'danger' || alert.type === 'warning';
                const isSuccess = alert.type === 'success';

                return (
                  <div
                    key={alert.id}
                    onClick={() => handleNotificationClick(alert)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                      !isRead ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {isDanger ? (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      ) : isSuccess ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Info className="w-4 h-4 text-gov-blue" />
                      )}
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h5 className={`text-xs font-bold ${!isRead ? 'text-gov-navy' : 'text-slate-700'}`}>
                          {alert.title}
                        </h5>
                        <span className="text-3xs text-slate-400 font-mono">
                          {(() => {
                            try {
                              const d = new Date(alert.timestamp);
                              return isNaN(d.getTime()) ? 'Recently' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            } catch {
                              return 'Recently';
                            }
                          })()}
                        </span>
                      </div>
                      <p className="text-2xs text-slate-600 line-clamp-2 leading-relaxed">{alert.message}</p>
                    </div>

                    {!isRead && (
                      <span className="w-2 h-2 rounded-full bg-gov-blue shrink-0 mt-1.5" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                setCurrentView('alerts');
              }}
              className="text-3xs font-bold text-gov-blue hover:underline uppercase tracking-wider"
            >
              View All System Alerts →
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
