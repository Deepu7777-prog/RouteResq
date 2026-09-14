import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../context/StateContext';
import { DEMO_CONFIG, DEMO_STEPS } from '../utils/panelDemoData';
import LeafletMap from './LeafletMap';
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, X, Volume2, VolumeX, 
  Shield, AlertTriangle, Route, Truck, MapPin, CheckCircle2, 
  Layers, Radio, Activity, ArrowRight, Zap, FileText
} from 'lucide-react';

export default function PanelDemoOverlay() {
  const { isPanelDemoActive, exitPanelDemo, panelDemoStep, setPanelDemoStep } = useAppState();
  
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [driverAccepted, setDriverAccepted] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  
  const speechRef = useRef(null);
  const timerRef = useRef(null);

  // Sync internal index with context if changed externally
  useEffect(() => {
    if (typeof panelDemoStep === 'number' && panelDemoStep >= 1 && panelDemoStep <= DEMO_STEPS.length) {
      setCurrentStepIdx(panelDemoStep - 1);
    }
  }, [panelDemoStep]);

  // Check speech synthesis support
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const currentStep = DEMO_STEPS[currentStepIdx] || DEMO_STEPS[0];
  const isFinalStep = currentStepIdx === DEMO_STEPS.length - 1;

  // Speak step narration
  const speakCurrentStep = () => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();

    if (isMuted) return;

    const fullText = currentStep.narration.join(' ');
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick English voice if available
    const voices = window.speechSynthesis.getVoices();
    const engVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('India') || v.name.includes('UK') || v.name.includes('Natural')));
    if (engVoice) {
      utterance.voice = engVoice;
    }

    utterance.onend = () => {
      if (isPlaying && !isFinalStep) {
        // Pause briefly after speech before advancing
        timerRef.current = setTimeout(() => {
          handleNext();
        }, 1500);
      }
    };

    utterance.onerror = (err) => {
      console.warn('SpeechSynthesis error:', err);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Step change effect
  useEffect(() => {
    if (!isPanelDemoActive) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    // Auto driver acceptance simulation on Step 7
    if (currentStepIdx === 6) {
      const driverTimer = setTimeout(() => {
        setDriverAccepted(true);
      }, 2500);
      return () => clearTimeout(driverTimer);
    }

    if (isPlaying) {
      speakCurrentStep();
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [currentStepIdx, isPlaying, isMuted, isPanelDemoActive]);

  if (!isPanelDemoActive) return null;

  const handleNext = () => {
    if (currentStepIdx < DEMO_STEPS.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      if (setPanelDemoStep) setPanelDemoStep(nextIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      if (setPanelDemoStep) setPanelDemoStep(prevIdx + 1);
    }
  };

  const handleRestart = () => {
    setCurrentStepIdx(0);
    setDriverAccepted(false);
    setIsPlaying(true);
    if (setPanelDemoStep) setPanelDemoStep(1);
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!isMuted) {
      setIsMuted(true);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      setIsMuted(false);
    }
  };

  // Map state configuration based on step
  const getMapPropsForStep = () => {
    const demoNodes = {
      'A': { id: 'A', name: 'Guwahati Central Hub', coords: [26.14, 91.73], district: 'Kamrup Metro' },
      'B': { id: 'B', name: 'Nongpoh Pass (R-17 Block)', coords: [25.90, 91.88], district: 'Ri-Bhoi' },
      'C': { id: 'C', name: 'Shillong Control Hub', coords: [25.57, 91.88], district: 'East Khasi' },
      'D': { id: 'D', name: 'Silchar Relief Depot', coords: [24.83, 92.77], district: 'Cachar' },
      'J': { id: 'J', name: 'Jowai Bypass Corridor', coords: [25.44, 92.20], district: 'West Jaintia' }
    };

    const isBlockedState = currentStepIdx >= 1; // Blocked from step 2 onwards
    const isReroutedState = currentStepIdx >= 4; // Rerouted from step 5 onwards

    const demoRoads = [
      { id: 'R01', name: 'Guwahati - Nongpoh Expressway (NH-39)', status: 'SAFE', riskScore: 12, u: 'A', v: 'B', distanceKm: 52 },
      { id: 'R-17', name: 'Nongpoh Pass Segment R-17', status: isBlockedState ? 'BLOCKED' : 'SAFE', riskScore: isBlockedState ? 85 : 18, u: 'B', v: 'C', distanceKm: 48 },
      { id: 'R03', name: 'Shillong - Silchar Highway (NH-44)', status: 'MEDIUM_RISK', riskScore: 42, u: 'C', v: 'D', distanceKm: 165 },
      { id: 'R04', name: 'Jowai Safe Bypass Corridor', status: 'SAFE', riskScore: 18, u: 'B', v: 'J', distanceKm: 110 },
      { id: 'R05', name: 'Jowai - Silchar Express Link', status: 'SAFE', riskScore: 15, u: 'J', v: 'D', distanceKm: 70 }
    ];

    const vehiclePos = isReroutedState ? [25.44, 92.20] : (isBlockedState ? [25.88, 91.85] : [26.00, 91.80]);

    const demoVehicles = [
      {
        id: DEMO_CONFIG.vehicle.number,
        cargo: DEMO_CONFIG.delivery.cargo,
        driverName: DEMO_CONFIG.vehicle.driverName,
        status: isReroutedState ? 'REROUTED_SAFE' : (isBlockedState ? 'AFFECTED' : 'ON_ROUTE'),
        originNode: 'A',
        destination: DEMO_CONFIG.delivery.destination,
        isAffected: isBlockedState && !isReroutedState,
        coords: vehiclePos
      }
    ];

    const demoIncidents = isBlockedState ? [
      {
        id: 'INC-DEMO-2026',
        type: DEMO_CONFIG.incident.type,
        roadName: DEMO_CONFIG.incident.road,
        severity: DEMO_CONFIG.incident.severity,
        description: `Landslide blocking dual carriageway at ${DEMO_CONFIG.incident.location}`,
        reportedBy: DEMO_CONFIG.incident.reportedBy,
        locationCoords: [25.75, 91.88]
      }
    ] : [];

    const activeRoute = isReroutedState
      ? [[26.14, 91.73], [25.90, 91.88], [25.44, 92.20], [24.83, 92.77]]
      : [[26.14, 91.73], [25.90, 91.88], [25.57, 91.88], [24.83, 92.77]];

    const alternativeRoute = isBlockedState ? [[25.90, 91.88], [25.44, 92.20], [24.83, 92.77]] : null;

    return {
      nodes: demoNodes,
      roads: demoRoads,
      vehicles: demoVehicles,
      incidents: demoIncidents,
      activeRouteCoords: activeRoute,
      alternativeRouteCoords: alternativeRoute,
      center: currentStepIdx === 1 || currentStepIdx === 2 ? [25.75, 91.88] : [25.6, 92.2],
      zoom: currentStepIdx === 1 || currentStepIdx === 2 ? 9 : 8
    };
  };

  const mapProps = getMapPropsForStep();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col font-sans overflow-hidden animate-fade-in">
      
      {/* 1. TOP DEMO NAVBAR & CONTROL BAR */}
      <header className="bg-slate-900/95 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md shadow-lg shrink-0">
        
        {/* Left: Branding & Step Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-extrabold shadow-md shadow-blue-600/40">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">RouteResQ Panel Presentation</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-3xs font-extrabold uppercase tracking-wider">
                SIH 2026 Live Demo
              </span>
            </div>
            <p className="text-3xs text-slate-400">Automated Disruption-Aware Routing Demonstration</p>
          </div>
        </div>

        {/* Center: Step Progress Stepper Bar */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          {DEMO_STEPS.map((s, idx) => {
            const isActive = idx === currentStepIdx;
            const isPassed = idx < currentStepIdx;
            return (
              <button
                key={s.step}
                onClick={() => {
                  setCurrentStepIdx(idx);
                  if (setPanelDemoStep) setPanelDemoStep(idx + 1);
                }}
                title={s.title}
                className={`px-2.5 py-1 rounded-lg text-3xs font-extrabold transition-all flex items-center gap-1 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-1 ring-blue-400'
                    : isPassed
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-900 text-slate-600 hover:bg-slate-850'
                }`}
              >
                <span>{s.step === 9 ? '★' : s.step}</span>
                <span className="hidden xl:inline text-3xs truncate max-w-[80px]">
                  {s.step === 9 ? 'Solution' : `Step ${s.step}`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Media Controls */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 transition-colors"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-xs shadow-md transition-all ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={isFinalStep}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 transition-colors"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={toggleMute}
            className={`p-2 rounded-lg transition-colors ${
              isMuted
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute Audio Narration' : 'Mute Audio Narration'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleRestart}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Restart Presentation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-6 w-px bg-slate-800 mx-1" />

          <button
            onClick={exitPanelDemo}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold transition-all"
            title="Exit Presentation Mode"
          >
            <X className="w-4 h-4" />
            <span>Exit Demo</span>
          </button>

        </div>

      </header>

      {/* 2. MAIN PRESENTATION BODY */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT / TOP: DYNAMIC INTERACTIVE DISPLAY AREA */}
        <div className="flex-1 p-4 flex flex-col overflow-y-auto relative">
          
          {/* Step Header Badge */}
          <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 text-xs font-extrabold">
                {currentStep.title}
              </span>
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                {currentStep.heading}
              </h2>
            </div>
            
            <div className="flex items-center gap-2 text-3xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>STEP {currentStepIdx + 1} OF {DEMO_STEPS.length}</span>
            </div>
          </div>

          {/* STEP 9: FINAL SOLUTION SCREEN OVERLAY */}
          {isFinalStep ? (
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between overflow-y-auto shadow-2xl space-y-6">
              
              <div className="text-center space-y-2 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                  <Shield className="w-4 h-4" />
                  <span>SIH 2026 Solution Summary</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  ROUTERESQ – From Road Disruptions to Actionable Intelligence
                </h1>
                <p className="text-xs text-slate-300">
                  Moving logistics from reactive navigation to disruption-aware, resilient decision making across the North Eastern Region.
                </p>
              </div>

              {/* 5 SOLUTION CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 my-2">
                
                {/* 1. DATA SIGNALS */}
                <div className="bg-slate-950/80 border border-blue-500/30 p-4 rounded-xl space-y-2 hover:border-blue-500/60 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <Radio className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-wide">1. Data Signals</h3>
                  <p className="text-3xs text-slate-300 leading-relaxed">
                    Ground-level geo-tagged field reporting, landslide alerts & sensor inputs captured in real-time.
                  </p>
                </div>

                {/* 2. RISK INTELLIGENCE */}
                <div className="bg-slate-950/80 border border-amber-500/30 p-4 rounded-xl space-y-2 hover:border-amber-500/60 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wide">2. Risk Intelligence</h3>
                  <p className="text-3xs text-slate-300 leading-relaxed">
                    Dynamic hazard scoring (SAFE / MEDIUM / HIGH / BLOCKED) evaluating corridor safety.
                  </p>
                </div>

                {/* 3. ACCESSIBILITY */}
                <div className="bg-slate-950/80 border border-red-500/30 p-4 rounded-xl space-y-2 hover:border-red-500/60 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-extrabold text-red-400 uppercase tracking-wide">3. Accessibility</h3>
                  <p className="text-3xs text-slate-300 leading-relaxed">
                    Instant graph edge penalty updates, marking damaged routes as impassable before bottlenecks occur.
                  </p>
                </div>

                {/* 4. SMART ROUTING */}
                <div className="bg-slate-950/80 border border-emerald-500/30 p-4 rounded-xl space-y-2 hover:border-emerald-500/60 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Route className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wide">4. Smart Routing</h3>
                  <p className="text-3xs text-slate-300 leading-relaxed">
                    Dijkstra-weighted pathfinding finding safe bypass corridors (+17m vs total block).
                  </p>
                </div>

                {/* 5. ACTIONABLE LOGISTICS */}
                <div className="bg-slate-950/80 border border-cyan-500/30 p-4 rounded-xl space-y-2 hover:border-cyan-500/60 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wide">5. Action</h3>
                  <p className="text-3xs text-slate-300 leading-relaxed">
                    Automated driver HUD reroute popups, logistics fleet tracking & authority command oversight.
                  </p>
                </div>

              </div>

              {/* CLOSING BOX */}
              <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-emerald-900/40 border border-slate-700 p-4 rounded-xl text-center space-y-2">
                <p className="text-xs font-semibold text-slate-200 italic max-w-2xl mx-auto">
                  "When a road disruption occurs, information should not stop at reporting the problem. It should support a decision — which roads are accessible, which deliveries are affected, what safer alternative exists, and who needs to be alerted."
                </p>
                <div className="text-xs font-extrabold text-cyan-400 pt-1">
                  Thank You • Open for Panel Questions & Live Interactions
                </div>
              </div>

            </div>
          ) : (
            /* MAP + STEP SPECIFIC VISUAL OVERLAYS (STEPS 1 TO 8) */
            <div className="flex-1 flex flex-col space-y-3 min-h-[380px]">
              
              {/* GIS LEAFLET MAP DISPLAY */}
              <div className="flex-1 relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                <LeafletMap
                  nodes={mapProps.nodes}
                  roads={mapProps.roads}
                  vehicles={mapProps.vehicles}
                  incidents={mapProps.incidents}
                  activeRouteCoords={mapProps.activeRouteCoords}
                  alternativeRouteCoords={mapProps.alternativeRouteCoords}
                  center={mapProps.center}
                  zoom={mapProps.zoom}
                  height="100%"
                />

                {/* STEP-SPECIFIC VISUAL CARDS OVERLAYING THE MAP */}
                
                {/* STEP 2: INCIDENT REPORT POPUP */}
                {currentStepIdx === 1 && (
                  <div className="absolute top-4 right-4 z-[1000] max-w-xs bg-slate-900/95 border-2 border-red-500 rounded-xl p-3 shadow-2xl backdrop-blur-md animate-bounce-short">
                    <div className="flex items-center gap-2 text-red-400 font-extrabold text-xs mb-1">
                      <AlertTriangle className="w-4 h-4 animate-ping" />
                      <span>LIVE DISRUPTION REPORTED</span>
                    </div>
                    <p className="text-3xs text-slate-200">
                      <strong>Incident:</strong> {DEMO_CONFIG.incident.type} on {DEMO_CONFIG.incident.road}
                    </p>
                    <p className="text-3xs text-slate-300">
                      <strong>Location:</strong> {DEMO_CONFIG.incident.location}
                    </p>
                    <p className="text-3xs text-slate-400 mt-1">
                      Reported by {DEMO_CONFIG.incident.reportedBy} ({DEMO_CONFIG.incident.time})
                    </p>
                  </div>
                )}

                {/* STEP 3: RISK INTELLIGENCE BADGE */}
                {currentStepIdx === 2 && (
                  <div className="absolute top-4 right-4 z-[1000] max-w-xs bg-slate-900/95 border-2 border-amber-500 rounded-xl p-3 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center justify-between text-xs font-extrabold text-amber-400 mb-1">
                      <span>RISK ENGINE EVALUATION</span>
                      <span className="px-2 py-0.5 bg-red-500 text-white rounded font-mono">85 / 100</span>
                    </div>
                    <div className="text-3xs space-y-1 text-slate-200">
                      <p>• Corridor Status: <strong className="text-red-400">BLOCKED</strong></p>
                      <p>• Accessibility Penalty: <strong className="text-amber-300">Infinite Weight Added</strong></p>
                      <p>• Risk Classifier: <strong className="text-red-400">HIGH HAZARD ZONE</strong></p>
                    </div>
                  </div>
                )}

                {/* STEP 4: AFFECTED DELIVERY ALERT */}
                {currentStepIdx === 3 && (
                  <div className="absolute top-4 right-4 z-[1000] max-w-xs bg-slate-900/95 border-2 border-cyan-500 rounded-xl p-3 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs mb-1">
                      <Truck className="w-4 h-4 animate-pulse" />
                      <span>AFFECTED FLEET IDENTIFIED</span>
                    </div>
                    <p className="text-3xs text-slate-200">
                      <strong>Vehicle:</strong> {DEMO_CONFIG.vehicle.number} ({DEMO_CONFIG.delivery.id})
                    </p>
                    <p className="text-3xs text-slate-200">
                      <strong>Cargo:</strong> {DEMO_CONFIG.delivery.cargo}
                    </p>
                    <p className="text-3xs text-slate-300">
                      <strong>Destination:</strong> {DEMO_CONFIG.delivery.destination}
                    </p>
                    <div className="mt-2 bg-red-500/20 text-red-300 border border-red-500/40 text-3xs font-bold p-1 rounded text-center">
                      ⚠ Delivery Trapped on Segment R-17
                    </div>
                  </div>
                )}

                {/* STEP 5: DIJKSTRA REROUTE COMPARISON */}
                {currentStepIdx === 4 && (
                  <div className="absolute top-4 right-4 z-[1000] max-w-sm bg-slate-900/95 border-2 border-emerald-500 rounded-xl p-3 shadow-2xl backdrop-blur-md space-y-2">
                    <div className="flex items-center justify-between text-xs font-extrabold text-emerald-400">
                      <span>DIJKSTRA PATHFINDING</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded">
                        Optimal Bypass Found
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-3xs">
                      <div className="p-2 bg-red-500/10 border border-red-500/30 rounded">
                        <span className="text-red-400 font-bold block">Original Route</span>
                        <span className="text-slate-300 block">R-17 (BLOCKED)</span>
                        <span className="text-red-400 font-mono font-bold block mt-1">ETA: IMPASSABLE</span>
                      </div>
                      <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded">
                        <span className="text-emerald-400 font-bold block">Jowai Bypass</span>
                        <span className="text-slate-300 block">Clear Road Network</span>
                        <span className="text-emerald-400 font-mono font-bold block mt-1">ETA: 2h 32m (+17m)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6: ROLE-SPECIFIC ALERTS DEMO */}
                {currentStepIdx === 5 && (
                  <div className="absolute top-4 right-4 z-[1000] max-w-sm bg-slate-900/95 border border-slate-700 rounded-xl p-3 shadow-2xl backdrop-blur-md space-y-2">
                    <div className="text-xs font-extrabold text-purple-400 border-b border-slate-800 pb-1">
                      MULTI-ROLE TARGETED ALERTS
                    </div>
                    <div className="space-y-1.5 text-3xs">
                      <div className="bg-slate-800/80 p-1.5 rounded border border-blue-500/30 text-blue-300">
                        <strong>🚚 Driver Alert:</strong> Landslide ahead on R-17. Alternative calculated.
                      </div>
                      <div className="bg-slate-800/80 p-1.5 rounded border border-emerald-500/30 text-emerald-300">
                        <strong>📦 Logistics Alert:</strong> Delivery RR-1042 rerouted via Jowai (+17m ETA).
                      </div>
                      <div className="bg-slate-800/80 p-1.5 rounded border border-amber-500/30 text-amber-300">
                        <strong>🏛️ Authority Alert:</strong> Emergency traffic redirected away from KM 34.
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 7: DRIVER HUD ACCEPTANCE MOCKUP */}
                {currentStepIdx === 6 && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-slate-900 border-2 border-emerald-500 rounded-2xl p-5 shadow-2xl space-y-4 animate-scale-in">
                      
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <Truck className="w-5 h-5 text-emerald-400" />
                          <span className="font-extrabold text-sm text-white">DRIVER MOBILE HUD</span>
                        </div>
                        <span className="text-3xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                          TR-09-DEMO-21
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-red-400 font-bold">
                            <AlertTriangle className="w-4 h-4" />
                            <span>PLANNED ROUTE BLOCKED (R-17 Landslide)</span>
                          </div>
                          <p className="text-3xs text-slate-300">Original ETA: 2h 15m (Impassable)</p>
                        </div>

                        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>RECOMMENDED SAFER ROUTE AVAILABLE</span>
                          </div>
                          <p className="text-3xs text-slate-200">
                            <strong>Corridor:</strong> Jowai Safe Bypass Corridor
                          </p>
                          <p className="text-3xs text-emerald-300 font-mono">
                            New ETA: 2h 32m (+17 min delay vs total blockage)
                          </p>
                        </div>
                      </div>

                      <div className="pt-2">
                        {driverAccepted ? (
                          <div className="w-full py-3 bg-emerald-600 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>SAFER ROUTE ACCEPTED • NAVIGATION UPDATED</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDriverAccepted(true)}
                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/40 animate-pulse"
                          >
                            <ArrowRight className="w-4 h-4" />
                            <span>ACCEPT SAFER ROUTE NOW</span>
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                )}

                {/* STEP 8: AUTHORITY ECOSYSTEM MONITORING */}
                {currentStepIdx === 7 && (
                  <div className="absolute top-4 left-4 right-4 z-[1000] bg-slate-900/95 border border-slate-700 rounded-xl p-3 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className="font-extrabold text-xs text-white">CENTRALIZED AUTHORITY COMMAND OVERVIEW</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-3xs font-bold rounded">
                        ALL DELIVERIES SAFE
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-2 text-center text-3xs">
                      <div className="bg-slate-800/80 p-2 rounded">
                        <span className="text-slate-400 block">Incidents Reported</span>
                        <span className="text-red-400 font-extrabold text-sm block">1 Blocked</span>
                      </div>
                      <div className="bg-slate-800/80 p-2 rounded">
                        <span className="text-slate-400 block">Active Fleet</span>
                        <span className="text-emerald-400 font-extrabold text-sm block">1 Rerouted</span>
                      </div>
                      <div className="bg-slate-800/80 p-2 rounded">
                        <span className="text-slate-400 block">Bypass Risk Score</span>
                        <span className="text-cyan-400 font-extrabold text-sm block">18 / 100</span>
                      </div>
                      <div className="bg-slate-800/80 p-2 rounded">
                        <span className="text-slate-400 block">Response Time</span>
                        <span className="text-amber-400 font-extrabold text-sm block font-mono">&lt; 3 Seconds</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>

        {/* RIGHT / BOTTOM: NARRATION CAPTION BOX & EXPLANATION PANEL */}
        <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="font-extrabold text-xs text-white uppercase tracking-wider">Live Presentation Script</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-3xs text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>NARRATING</span>
              </div>
            </div>

            {/* Narrated Paragraphs Display */}
            <div className="space-y-3">
              {currentStep.narration.map((para, idx) => (
                <div 
                  key={idx} 
                  className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed font-sans shadow-inner"
                >
                  <p>{para}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FICTIONAL DEMO FOOTER BADGE */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-3xs text-slate-400">
              <span>Vehicle: {DEMO_CONFIG.vehicle.number}</span>
              <span>Corridor: NER R-17 / Jowai</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
              <span className="text-3xs text-slate-500 font-mono block">
                DEMO MODE – Fictional Presentation Data (SIH 2026)
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
