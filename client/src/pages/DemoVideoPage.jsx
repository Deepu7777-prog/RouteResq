import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../context/StateContext';
import GoogleMapView from '../components/GoogleMapView';
import { Play, Pause, RotateCcw, Maximize2 } from 'lucide-react';

const VIDEO_SCENES = [
  {
    id: 1,
    incidents: [],
    vehicleCoords: [26.14, 91.73], // Guwahati Central Hub
    highlightRoute: 'NORMAL'
  },
  {
    id: 2,
    incidents: [],
    vehicleCoords: [26.00, 91.80], // Transit along NH-39
    highlightRoute: 'NORMAL'
  },
  {
    id: 3,
    incidents: [
      {
        id: 'INC-DEMO-1',
        type: 'LANDSLIDE',
        roadId: 'R02',
        roadName: 'Nongpoh - Shillong Pass (R02)',
        severity: 'High',
        description: 'Landslide debris blocking dual lanes near KM 34.',
        reportedBy: 'Field Officer Rajesh',
        locationCoords: [25.90, 91.88]
      }
    ],
    vehicleCoords: [25.90, 91.88], // Landslide Hazard at Nongpoh Pass
    highlightRoute: 'BLOCKED'
  },
  {
    id: 4,
    incidents: [
      {
        id: 'INC-DEMO-1',
        type: 'LANDSLIDE',
        roadId: 'R02',
        roadName: 'Nongpoh - Shillong Pass (R02)',
        severity: 'High',
        description: 'Landslide debris blocking dual lanes near KM 34.',
        reportedBy: 'Field Officer Rajesh',
        locationCoords: [25.90, 91.88]
      }
    ],
    vehicleCoords: [25.60, 92.05], // AI Reroute via Jowai Safe Bypass (R04)
    highlightRoute: 'BYPASS'
  },
  {
    id: 5,
    incidents: [],
    vehicleCoords: [25.10, 92.40], // Driver advancing along safe bypass
    highlightRoute: 'BYPASS'
  },
  {
    id: 6,
    incidents: [],
    vehicleCoords: [24.83, 92.77], // Arrived safely at Silchar Relief Depot
    highlightRoute: 'COMPLETED'
  }
];

export default function DemoVideoPage() {
  const { state } = useAppState();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // Auto-plays continuous video
  const containerRef = useRef(null);

  const activeScene = VIDEO_SCENES[currentSceneIndex];

  // Auto-play timer: advances every 3.5 seconds
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentSceneIndex((prev) => (prev + 1) % VIDEO_SCENES.length);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentSceneIndex(0);
    setIsPlaying(true);
  };

  const handleSeek = (index) => {
    setCurrentSceneIndex(index);
  };

  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.warn(err));
    } else {
      document.exitFullscreen().catch(err => console.warn(err));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 animate-fade-in pb-12">
      
      {/* PLAIN, CLEAN CINEMATIC VIDEO CONTAINER */}
      <div ref={containerRef} className="w-full bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col relative">
        
        {/* MAP VIDEO CANVAS (PLAIN & CLEAR, NO TOP TEXT BANNERS) */}
        <div className="relative w-full min-h-[520px] bg-slate-900 overflow-hidden">
          <GoogleMapView
            roads={state?.roads || []}
            nodes={state?.nodes || {}}
            vehicles={[
              {
                id: 'TRK001',
                cargo: 'Medical & Oxygen Supplies',
                driverName: 'Arjun Kumar',
                status: activeScene.highlightRoute,
                coords: activeScene.vehicleCoords
              }
            ]}
            incidents={activeScene.incidents}
            height="520px"
          />
        </div>

        {/* BOTTOM VIDEO CONTROLS BAR */}
        <div className="p-4 bg-slate-900/95 border-t border-slate-800 flex flex-col gap-3 z-20">
          
          {/* Continuous Video Timeline Bar */}
          <div className="flex items-center gap-2">
            {VIDEO_SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => handleSeek(idx)}
                className={`flex-1 h-2 rounded-full transition-all ${
                  idx === currentSceneIndex
                    ? 'bg-amber-400 ring-2 ring-amber-300 scale-y-125'
                    : idx < currentSceneIndex
                    ? 'bg-gov-blue'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Scene ${scene.id}`}
              />
            ))}
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayToggle}
                className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg transition-all"
                title={isPlaying ? 'Pause Demo' : 'Play Demo'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button
                onClick={handleRestart}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Restart Demo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 text-slate-400 text-xs font-mono">
              <span className="font-bold text-amber-400">{isPlaying ? '▶ PLAYING DEMO' : '⏸ PAUSED'}</span>
              <button onClick={toggleFullScreen} className="text-slate-400 hover:text-white p-1" title="Full Screen">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
