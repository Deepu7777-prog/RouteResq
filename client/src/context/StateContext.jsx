import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../utils/i18n';

const StateContext = createContext();

const DEFAULT_STATE = {
  demoStep: 1,
  demoStepDetails: {
    1: { title: "STEP 1 — SAFE BASELINE MONITORING", description: "All major transit corridors in NER are open. Vehicles operating normally." },
    2: { title: "STEP 2 — WEATHER WARNING", description: "Heavy rainfall alert issued for Meghalaya-Assam border districts." },
    3: { title: "STEP 3 — LANDSLIDE DISRUPTION", description: "Landslide reported on Nongpoh-Shillong Pass (R02). Corridor blocked." },
    4: { title: "STEP 4 — AI REROUTING DISPATCH", description: "AI engine calculates safer alternative route via Jowai Bypass (R04)." },
    5: { title: "STEP 5 — DRIVER ROUTE ACCEPTANCE", description: "Driver Arjun Kumar accepts reroute notification on mobile HUD." }
  },
  roads: [
    { id: 'R01', name: 'Guwahati - Nongpoh Expressway', status: 'SAFE', riskScore: 15, u: 'A', v: 'B', distanceKm: 52 },
    { id: 'R02', name: 'Nongpoh - Shillong Pass', status: 'BLOCKED', riskScore: 92, u: 'B', v: 'C', distanceKm: 48 },
    { id: 'R03', name: 'Shillong - Silchar Highway', status: 'MEDIUM_RISK', riskScore: 45, u: 'C', v: 'D', distanceKm: 165 },
    { id: 'R04', name: 'Jowai Bypass Corridor', status: 'SAFE', riskScore: 20, u: 'B', v: 'D', distanceKm: 180 },
    { id: 'R05', name: 'Guwahati Outer Bypass', status: 'SAFE', riskScore: 10, u: 'A', v: 'D', distanceKm: 210 }
  ],
  nodes: {
    'A': { id: 'A', name: 'Guwahati Central Hub', coords: [26.14, 91.73], district: 'Kamrup Metropolitan' },
    'B': { id: 'B', name: 'Nongpoh Transit Hub', coords: [25.90, 91.88], district: 'Ri-Bhoi' },
    'C': { id: 'C', name: 'Shillong Command Center', coords: [25.57, 91.88], district: 'East Khasi Hills' },
    'D': { id: 'D', name: 'Silchar Relief Depot', coords: [24.83, 92.77], district: 'Cachar' }
  },
  vehicles: [
    {
      id: 'TRK001',
      cargo: 'Medical & Oxygen Supplies',
      driverName: 'Arjun Kumar',
      driverPhone: '9000000002',
      status: 'AFFECTED',
      originNode: 'B',
      destinationNode: 'D',
      destination: 'Silchar Relief Depot',
      isAffected: true,
      activeRoute: {
        etaFormatted: '4h 15m',
        distanceKm: 196,
        coords: [[25.90, 91.88], [25.57, 91.88], [24.83, 92.77]]
      },
      alternativeRoute: {
        success: true,
        routeName: 'Jowai Safe Bypass',
        etaFormatted: '3h 40m',
        distanceKm: 180,
        riskScore: 22,
        coords: [[25.90, 91.88], [25.44, 92.20], [24.83, 92.77]]
      }
    },
    {
      id: 'TRK002',
      cargo: 'Ration & Food Supplies',
      driverName: 'Vikram Singh',
      driverPhone: '9000000008',
      status: 'ON_ROUTE',
      originNode: 'A',
      destinationNode: 'B',
      destination: 'Nongpoh Transit Hub',
      isAffected: false,
      activeRoute: {
        etaFormatted: '1h 10m',
        distanceKm: 52,
        coords: [[26.14, 91.73], [25.90, 91.88]]
      }
    }
  ],
  incidents: [
    {
      id: 'INC-101',
      type: 'LANDSLIDE',
      roadId: 'R02',
      roadName: 'Nongpoh - Shillong Pass (R02)',
      severity: 'High',
      description: 'Major landslide blocking both lanes near KM 34.',
      reportedBy: 'Field Officer Rajesh',
      locationCoords: [25.75, 91.88]
    }
  ],
  alerts: [
    {
      id: 'ALT-101',
      type: 'warning',
      title: 'Monsoon Heavy Rainfall Alert',
      message: 'Heavy rainfall warning issued for Meghalaya-Assam border transit corridors.',
      targetRole: 'all',
      timestamp: '2026-09-11T18:00:00Z'
    },
    {
      id: 'ALT-102',
      type: 'danger',
      title: 'Landslide Disruption on R02',
      message: 'Nongpoh-Shillong Pass (R02) is blocked due to landslide near KM 34.',
      targetRole: 'all',
      timestamp: '2026-09-11T17:30:00Z'
    }
  ]
};

export function StateProvider({ children }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Selected email passed from Role Selection to Login
  const [selectedDemoEmail, setSelectedDemoEmail] = useState(() => {
    return localStorage.getItem('routeresq_selected_email') || 'driver@routeresq.demo';
  });

  // Language i18n State (English, Hindi, Assamese, Bengali)
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem('routeresq_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('routeresq_lang', newLang);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  const t = (key) => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  // Navigation & Role State with LocalStorage Persistence
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('routeresq_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState(() => {
    try {
      const savedView = localStorage.getItem('routeresq_view');
      return savedView || 'landing';
    } catch {
      return 'landing';
    }
  });

  const [selectedVehicleId, setSelectedVehicleId] = useState('TRK001');
  const [activeModal, setActiveModal] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isAutoPlayingDemo, setIsAutoPlayingDemo] = useState(false);
  const [isPanelDemoActive, setIsPanelDemoActive] = useState(false);
  const [panelDemoStep, setPanelDemoStep] = useState(1);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('routeresq_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('routeresq_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('routeresq_view', currentView);
  }, [currentView]);

  // Fetch state from server API
  const fetchState = async () => {
    try {
      const res = await fetch('/api/state');
      if (!res.ok) throw new Error('Failed to fetch state from server');
      const data = await res.json();
      setState(data);
      setLoading(false);
    } catch (err) {
      console.warn('Backend API polling fallback, using default state:', err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 3000); // Live poll updates every 3s
    return () => clearInterval(interval);
  }, []);

  // Login handler using backend /api/auth/login
  const login = async (username, password = 'demo123') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        if (data.token) {
          localStorage.setItem('routeresq_token', data.token);
        }
        setCurrentUser(data.user);

        const roleLower = (data.user.role || '').toLowerCase();
        if (roleLower === 'authority') setCurrentView('authority');
        else if (roleLower === 'logistics') setCurrentView('logistics');
        else if (roleLower === 'driver') setCurrentView('driver');
        else if (roleLower === 'field_officer' || roleLower === 'field') setCurrentView('field');
        else setCurrentView('landing');

        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed.' };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
    setIsDemoMode(false);
    setIsAutoPlayingDemo(false);
    localStorage.removeItem('routeresq_user');
    localStorage.removeItem('routeresq_token');
    localStorage.setItem('routeresq_view', 'landing');
  };

  // Submit Incident Handler
  const submitIncident = async (incidentForm) => {
    try {
      const token = localStorage.getItem('routeresq_token');
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(incidentForm)
      });
      const data = await res.json();
      if (data.success) {
        fetchState();
        return { success: true, data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Resolve Incident Handler
  const resolveIncident = async (incidentId) => {
    try {
      const token = localStorage.getItem('routeresq_token');
      const res = await fetch(`/api/incidents/${incidentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: 'RESOLVED' })
      });
      const data = await res.json();
      if (data.success) {
        fetchState();
        return { success: true };
      }
    } catch (err) {
      console.error('Resolve incident error:', err);
    }
  };

  // Accept Alternative Route Handler
  const acceptAlternativeRoute = async (vehicleId = 'TRK001') => {
    try {
      const token = localStorage.getItem('routeresq_token');
      const res = await fetch('/api/routes/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ vehicleId })
      });
      const data = await res.json();
      if (data.success) {
        fetchState();
        return { success: true };
      }
    } catch (err) {
      console.error('Accept route error:', err);
    }
  };

  // Live Demo Stepper Handler
  const handleSetDemoStep = async (stepNumber) => {
    setIsDemoMode(true);
    if (stepNumber === 4 || stepNumber === 5) {
      await submitIncident({
        incident_type: 'LANDSLIDE',
        road_id: 'R02',
        severity: 'HIGH',
        description: 'High severity landslide reported on Nongpoh-Shillong Pass (R02).'
      });
    }
  };

  // Reset Demo State
  const resetDemo = async () => {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchState();
        setIsDemoMode(false);
        setIsAutoPlayingDemo(false);
      }
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  const startLiveDemo = () => {
    setIsDemoMode(true);
    handleSetDemoStep(1);
  };

  const startPanelDemo = () => {
    setIsPanelDemoActive(true);
    setPanelDemoStep(1);
  };

  const exitPanelDemo = () => {
    setIsPanelDemoActive(false);
  };

  return (
    <StateContext.Provider
      value={{
        state,
        loading,
        error,
        lang,
        setLang,
        t,
        selectedDemoEmail,
        setSelectedDemoEmail,
        currentUser,
        setCurrentUser,
        currentView,
        setCurrentView,
        selectedVehicleId,
        setSelectedVehicleId,
        activeModal,
        setActiveModal,
        isDemoMode,
        isAutoPlayingDemo,
        setIsAutoPlayingDemo,
        isPanelDemoActive,
        panelDemoStep,
        setPanelDemoStep,
        startPanelDemo,
        exitPanelDemo,
        login,
        logout,
        submitIncident,
        resolveIncident,
        acceptAlternativeRoute,
        setDemoStep: handleSetDemoStep,
        resetDemo,
        startLiveDemo,
        fetchState
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  return useContext(StateContext);
}
