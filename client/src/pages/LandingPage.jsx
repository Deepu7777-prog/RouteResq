import React from 'react';
import { useAppState } from '../context/StateContext';
import GoogleMapView from '../components/GoogleMapView';
import { Shield, ArrowRight, CloudRain, Mountain, Truck, MapPin, Route, CheckCircle2, UserPlus, LogIn, Play } from 'lucide-react';

export default function LandingPage() {
  const { state, setCurrentView, startPanelDemo, t } = useAppState();

  const handleGetStarted = () => {
    setCurrentView('role-selection');
  };

  const handleLogin = () => {
    setCurrentView('login');
  };

  const handleWatchDemo = () => {
    setCurrentView('demo-video');
  };

  return (
    <div className="space-y-16 pb-20 animate-fade-in">
      
      {/* 1. HERO SECTION */}
      <section className="pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-gov-blue text-xs font-bold">
                <Shield className="w-4 h-4 text-gov-blue" />
                <span>Smart India Hackathon Solution • NER Region</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gov-navy leading-tight">
                {t('hero_title')}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                {t('hero_subtitle')}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleGetStarted}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gov-blue hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
                >
                  <span>{t('hero_btn_start')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleLogin}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-sm shadow-sm transition-all"
                >
                  <LogIn className="w-4 h-4 text-slate-500" />
                  <span>Login Portal</span>
                </button>
              </div>

            </div>

            {/* Right Hero Visual Illustration — ORIGINAL COLORFUL MAP */}
            <div className="lg:col-span-6">
              <div className="card-clean p-4 space-y-3 shadow-xl bg-white border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-extrabold text-gov-navy">NER Emergency Transport Corridors (Guwahati → Silchar)</span>
                  </div>
                  <span className="text-3xs font-extrabold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    Live GIS Active
                  </span>
                </div>

                {/* Live Google Map on Starting Page */}
                <GoogleMapView
                  roads={state?.roads || []}
                  nodes={state?.nodes || {}}
                  vehicles={state?.vehicles || []}
                  incidents={state?.incidents || []}
                  height="340px"
                />

                {/* Accurate Road Labels Legend */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-3xs font-bold text-center pt-1">
                  <div className="p-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    🟢 R01: Guwahati-Nongpoh (NH-39)
                  </div>
                  <div className="p-1 rounded bg-red-50 text-red-700 border border-red-200">
                    🔴 R02: Nongpoh-Shillong (Blocked)
                  </div>
                  <div className="p-1 rounded bg-amber-50 text-amber-900 border border-amber-200">
                    🟡 R03: Shillong-Silchar (NH-44)
                  </div>
                  <div className="p-1 rounded bg-blue-50 text-gov-blue border border-blue-200">
                    🔵 R04: Jowai Safe Bypass (NH-44)
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM BEING SOLVED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gov-navy">{t('problem_title')}</h2>
          <p className="text-xs text-slate-600">{t('problem_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-clean p-6 space-y-3 border-l-4 border-l-blue-500">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <CloudRain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gov-navy">{t('problem_rain_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('problem_rain_desc')}</p>
          </div>

          <div className="card-clean p-6 space-y-3 border-l-4 border-l-amber-500">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Mountain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gov-navy">{t('problem_landslide_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('problem_landslide_desc')}</p>
          </div>

          <div className="card-clean p-6 space-y-3 border-l-4 border-l-red-500">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gov-navy">{t('problem_delay_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('problem_delay_desc')}</p>
          </div>
        </div>
      </section>

      {/* 3. HOW ROUTERESQ WORKS (5-STEP JOURNEY) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center space-y-1 max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gov-navy">{t('how_title')}</h2>
          <p className="text-xs text-slate-600">Five simple steps to keep essential goods moving safely.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="card-clean p-4 text-center space-y-2 border-t-4 border-t-blue-600">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mx-auto">
              1
            </div>
            <h4 className="text-xs font-bold text-gov-navy">{t('how_step1_title')}</h4>
            <p className="text-3xs text-slate-600">{t('how_step1_desc')}</p>
          </div>

          <div className="card-clean p-4 text-center space-y-2 border-t-4 border-t-amber-600">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center mx-auto">
              2
            </div>
            <h4 className="text-xs font-bold text-gov-navy">{t('how_step2_title')}</h4>
            <p className="text-3xs text-slate-600">{t('how_step2_desc')}</p>
          </div>

          <div className="card-clean p-4 text-center space-y-2 border-t-4 border-t-sky-600">
            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center mx-auto">
              3
            </div>
            <h4 className="text-xs font-bold text-gov-navy">{t('how_step3_title')}</h4>
            <p className="text-3xs text-slate-600">{t('how_step3_desc')}</p>
          </div>

          <div className="card-clean p-4 text-center space-y-2 border-t-4 border-t-purple-600">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center mx-auto">
              4
            </div>
            <h4 className="text-xs font-bold text-gov-navy">{t('how_step4_title')}</h4>
            <p className="text-3xs text-slate-600">{t('how_step4_desc')}</p>
          </div>

          <div className="card-clean p-4 text-center space-y-2 border-t-4 border-t-emerald-600">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center mx-auto">
              5
            </div>
            <h4 className="text-xs font-bold text-gov-navy">{t('how_step5_title')}</h4>
            <p className="text-3xs text-slate-600">{t('how_step5_desc')}</p>
          </div>
        </div>
      </section>

      {/* 4. KEY FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-gov-navy">Built for Authorities, Logistics & Drivers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card-clean p-5 space-y-2">
            <Shield className="w-6 h-6 text-gov-blue" />
            <h4 className="text-sm font-bold text-gov-navy">Authority Overview</h4>
            <p className="text-xs text-slate-600">Monitor regional road accessibility and response status.</p>
          </div>
          <div className="card-clean p-5 space-y-2">
            <Truck className="w-6 h-6 text-emerald-600" />
            <h4 className="text-sm font-bold text-gov-navy">Logistics Tracking</h4>
            <p className="text-xs text-slate-600">Track essential medical and food supply vehicles.</p>
          </div>
          <div className="card-clean p-5 space-y-2">
            <Route className="w-6 h-6 text-sky-600" />
            <h4 className="text-sm font-bold text-gov-navy">Driver Guidance</h4>
            <p className="text-xs text-slate-600">Simple mobile route alerts and alternative path guidance.</p>
          </div>
          <div className="card-clean p-5 space-y-2">
            <MapPin className="w-6 h-6 text-purple-600" />
            <h4 className="text-sm font-bold text-gov-navy">Field Reporting</h4>
            <p className="text-xs text-slate-600">Field officers submit landslide and flood reports directly.</p>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION / GET STARTED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gov-navy text-white p-8 rounded-2xl text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to Access RouteResQ?</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Select your role to access real-time road accessibility tools and fleet tracking.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handleGetStarted}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gov-blue hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
