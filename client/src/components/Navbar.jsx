import React from 'react';
import { useAppState } from '../context/StateContext';
import NotificationDropdown from './NotificationDropdown';
import { Navigation, Globe, LogIn, LogOut, UserPlus, Play } from 'lucide-react';

export default function Navbar() {
  const { currentUser, currentView, setCurrentView, startPanelDemo, logout, lang, setLang, t } = useAppState();

  const handleLogoClick = () => {
    if (currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'AUTHORITY' || currentUser.role === 'authority')) {
      setCurrentView('authority');
    } else {
      setCurrentView('role-selection');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ----------------------------------------------------
  // LOGGED-IN APPLICATION HEADER
  // ----------------------------------------------------
  if (currentUser) {
    return (
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div onClick={handleLogoClick} className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gov-blue text-white flex items-center justify-center font-bold">
              <Navigation className="w-4 h-4 transform -rotate-45" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-gov-navy">
              Route<span className="text-gov-blue">ResQ</span>
            </span>
          </div>

          {/* Center: Logged-in Header Badge & Play Demo Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={startPanelDemo}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-extrabold shadow-sm transition-all border border-blue-400/30"
            >
              <Play className="w-3.5 h-3.5 fill-current text-amber-300" />
              <span>▶ Play RouteResQ Demo</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="capitalize">{currentUser.role} Application Portal</span>
            </div>
          </div>

          {/* Right: Notifications, Language, Profile, Logout */}
          <div className="flex items-center gap-3">
            
            {/* Header Notification Bell Dropdown */}
            <NotificationDropdown />

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="en">EN</option>
                <option value="hi">HI (हिंदी)</option>
                <option value="as">AS (অসমীয়া)</option>
                <option value="bn">BN (বাংলা)</option>
              </select>
            </div>

            {/* Profile User Info */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <span className="text-xs font-bold text-gov-navy block">{currentUser.name}</span>
                <span className="text-3xs text-slate-500 capitalize block">{currentUser.role}</span>
              </div>

              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </header>
    );
  }

  // ----------------------------------------------------
  // MINIMAL PUBLIC WEBSITE NAVBAR (BEFORE LOGIN)
  // ----------------------------------------------------
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Logo (Acts as Home link) */}
        <div onClick={handleLogoClick} className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-9 h-9 rounded-lg bg-gov-blue text-white flex items-center justify-center font-bold shadow-sm">
            <Navigation className="w-5 h-5 transform -rotate-45" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-gov-navy">
              Route<span className="text-gov-blue">ResQ</span>
            </span>
          </div>
        </div>

        {/* Right: Auto Demo | Language Selector | Sign Up | Login */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Auto Panel Demo Button */}
          <button
            onClick={startPanelDemo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-extrabold shadow-sm transition-all border border-blue-400/30"
          >
            <Play className="w-3.5 h-3.5 fill-current text-amber-300" />
            <span>▶ Play RouteResQ Demo</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700">
            <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी Hindi</option>
              <option value="as">অসমীয়া Assamese</option>
              <option value="bn">বাংলা Bengali</option>
            </select>
          </div>

          {/* Sign Up Button */}
          <button
            onClick={() => setCurrentView('role-selection')}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-600" />
            <span>Sign Up</span>
          </button>

          {/* Login Button */}
          <button
            onClick={() => setCurrentView('login')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gov-blue hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>

        </div>

      </div>
    </header>
  );
}
