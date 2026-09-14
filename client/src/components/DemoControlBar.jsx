import React from 'react';
import { useAppState } from '../context/StateContext';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, XCircle, Sparkles, MessageSquare } from 'lucide-react';

export default function DemoControlBar() {
  const { state, isDemoMode, setDemoStep, resetDemo, isAutoPlayingDemo, setIsAutoPlayingDemo, setCurrentView } = useAppState();

  // ONLY SHOW DEMO CONTROL BAR WHEN DEMO MODE IS ACTIVATED
  if (!isDemoMode || !state) return null;

  const currentStepNum = state.demoStep || 1;
  const currentStepDetails = state.demoStepDetails?.[currentStepNum] || {
    title: `STEP ${currentStepNum} — SCENARIO EXECUTION`,
    description: "Monitoring logistics accessibility across North Eastern Region transit corridors."
  };

  const handleNext = () => {
    if (currentStepNum < 13) {
      setDemoStep(currentStepNum + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepNum > 1) {
      setDemoStep(currentStepNum - 1);
    }
  };

  return (
    <div className="sticky top-16 z-30 bg-gov-navy border-b border-slate-700 px-4 py-2.5 shadow-md text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Step Indicator & Story Narrative Panel */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 rounded-md text-amber-300 font-bold text-xs shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            <span>JUDGE DEMO • STEP {currentStepNum} OF 13</span>
          </div>

          <div className="truncate bg-slate-900 px-3 py-1 rounded-md border border-slate-800 flex items-center gap-2 max-w-xl">
            <MessageSquare className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <div className="truncate">
              <span className="text-3xs font-extrabold text-sky-400 uppercase tracking-wider block">{currentStepDetails.title}</span>
              <p className="text-2xs text-slate-300 truncate font-medium">{currentStepDetails.description}</p>
            </div>
          </div>
        </div>

        {/* Right: Stepper Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentStepNum <= 1}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepNum >= 13}
            className="flex items-center gap-1 px-3 py-1 rounded bg-gov-blue hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs text-white shadow-sm transition-all"
          >
            <span>Next Step</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsAutoPlayingDemo(!isAutoPlayingDemo)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-semibold transition-colors ${
              isAutoPlayingDemo
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            {isAutoPlayingDemo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoPlayingDemo ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button
            onClick={resetDemo}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            title="Reset to safe baseline data state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={() => {
              setDemoStep(1);
              setCurrentView('landing');
            }}
            className="p-1 rounded bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-700 transition-colors"
            title="Exit Demo"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
