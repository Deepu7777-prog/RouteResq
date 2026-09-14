import React, { useState, useEffect, useRef } from 'react';
import LeafletMap from './LeafletMap';
import { MapPin, AlertTriangle, ShieldCheck, Info, X, Filter, Navigation, Truck, UserCheck, Activity } from 'lucide-react';

const NER_DEMO_LOCATIONS = [
  { id: 'LOC-1', name: 'Guwahati Transit Hub', coords: [26.14, 91.73], state: 'Assam', riskLevel: 'Safe', color: '#10B981', status: 'Corridor Open 🟢', incidentType: 'Central Logistics Hub', description: 'Central supply distribution center. All outgoing corridors operational.' },
  { id: 'LOC-2', name: 'Nongpoh Pass (KM 34)', coords: [25.90, 91.88], state: 'Meghalaya', riskLevel: 'Critical', color: '#EF4444', status: 'Blocked 🔴', incidentType: 'Landslide Closure', description: 'Major landslide blocking dual lanes on NH-39 Nongpoh corridor.' },
  { id: 'LOC-3', name: 'Shillong Disaster Command', coords: [25.57, 91.88], state: 'Meghalaya', riskLevel: 'High', color: '#F97316', status: 'Caution 🟠', incidentType: 'Heavy Rainfall Warning', description: 'Heavy monsoon downpour causing urban waterlogging and high landslide vulnerability.' },
  { id: 'LOC-4', name: 'Silchar Relief Depot', coords: [24.83, 92.77], state: 'Assam', riskLevel: 'Moderate', color: '#F59E0B', status: 'Watch 🟡', incidentType: 'River Overflow Warning', description: 'Barak river approach road monitored for flash flood risk.' },
  { id: 'LOC-5', name: 'Imphal Supply Pass', coords: [24.81, 93.93], state: 'Manipur', riskLevel: 'Safe', color: '#10B981', status: 'Corridor Open 🟢', incidentType: 'Convoy Clearance', description: 'NH-37 supply route active with armed convoy escort clearance.' },
  { id: 'LOC-6', name: 'Aizawl Slope Corridor', coords: [23.72, 92.71], state: 'Mizoram', riskLevel: 'Moderate', color: '#F59E0B', status: 'Caution 🟡', incidentType: 'Mudslide Vulnerability', description: 'Hill slope erosion monitored during active rainfall.' },
  { id: 'LOC-7', name: 'Kohima Expressway', coords: [25.67, 94.10], state: 'Nagaland', riskLevel: 'Safe', color: '#10B981', status: 'Corridor Open 🟢', incidentType: 'Normal Transit', description: 'Dimapur-Kohima 4-lane highway operating smoothly.' },
  { id: 'LOC-8', name: 'Agartala Freight Depot', coords: [23.83, 91.28], state: 'Tripura', riskLevel: 'Safe', color: '#10B981', status: 'Corridor Open 🟢', incidentType: 'Cross-Border Relief', description: 'Relief freight transit depot operating at full capacity.' },
  { id: 'LOC-9', name: 'Gangtok Teesta Pass', coords: [27.33, 88.61], state: 'Sikkim', riskLevel: 'High', color: '#F97316', status: 'Caution 🟠', incidentType: 'Teesta Rockfall Warning', description: 'Teesta river section NH-10 subject to periodic rockfalls.' },
  { id: 'LOC-10', name: 'Itanagar Airport Road', coords: [27.08, 93.60], state: 'Arunachal Pradesh', riskLevel: 'Safe', color: '#10B981', status: 'Corridor Open 🟢', incidentType: 'Normal Transit', description: 'Holongi airport transit corridor open for emergency flights.' }
];

const DEMO_FIELD_OFFICERS = [
  { id: 'OFF-1', name: 'Officer Rajesh Nath', role: 'Field Officer', coords: [25.90, 91.88], location: 'Nongpoh Pass', status: 'ON_SCENE', phone: '+91 9000000009' },
  { id: 'OFF-2', name: 'Officer Ravi Kumar', role: 'Field Responder', coords: [25.57, 91.88], location: 'Shillong Sector', status: 'PATROLLING', phone: '+91 9000000004' }
];

const DEMO_VEHICLES = [
  { id: 'TRK001', cargo: 'Medical & Oxygen Supplies', driver: 'Arjun Kumar', coords: [25.90, 91.88], status: 'REROUTED', speed: '35 km/h' },
  { id: 'TRK002', cargo: 'Ration & Food Packs', driver: 'Vikram Singh', coords: [26.14, 91.73], status: 'ON_ROUTE', speed: '48 km/h' }
];

export default function GoogleMapView({
  roads = [],
  nodes = {},
  vehicles = [],
  incidents = [],
  height = '520px'
}) {
  const mapRef = useRef(null);
  const googleMapInstance = useRef(null);
  const infoWindowInstance = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);

  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'INCIDENTS' | 'RISK' | 'BLOCKED' | 'VEHICLES' | 'OFFICERS'
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Retrieve API key dynamically from environment
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const isRealKeyConfigured = apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE' && apiKey !== 'YOUR_API_KEY_HERE';

  // Dynamic script loader for Google Maps SDK
  useEffect(() => {
    // Register Google Maps official auth failure handler to prevent gray boxes
    window.gm_authFailure = () => {
      console.warn('Google Maps API authentication failed (Billing or Key restriction). Activating Leaflet fallback.');
      setMapError(true);
    };

    if (!isRealKeyConfigured) {
      setMapError(true);
      return;
    }

    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      return;
    }

    const scriptId = 'google-maps-js-sdk-routeresq';
    if (document.getElementById(scriptId)) {
      setMapsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.onload = () => setMapsLoaded(true);
    script.onerror = () => setMapError(true);
    document.head.appendChild(script);
  }, [apiKey, isRealKeyConfigured]);

  // Initialize Native Google Map when SDK loaded
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || !window.google || !window.google.maps) return;

    try {
      const nerCenter = { lat: 25.8, lng: 92.2 };
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 7,
        center: nerCenter,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [] // Use Google Maps default vibrant, original colorful terrain & roadmap
      });
      googleMapInstance.current = map;
      infoWindowInstance.current = new window.google.maps.InfoWindow();

      renderGoogleMapElements();
    } catch (err) {
      console.warn('Google Maps Initialization error:', err);
      setMapError(true);
    }
  }, [mapsLoaded, filter]);

  const renderGoogleMapElements = () => {
    const map = googleMapInstance.current;
    if (!map || !window.google || !window.google.maps) return;

    // Clear existing markers & polylines
    markersRef.current.forEach(m => m.setMap(null));
    polylinesRef.current.forEach(p => p.setMap(null));
    markersRef.current = [];
    polylinesRef.current = [];

    // Filter Locations
    const locsToRender = NER_DEMO_LOCATIONS.filter(loc => {
      if (filter === 'ALL') return true;
      if (filter === 'INCIDENTS' && (loc.incidentType !== 'Safe Transit' && loc.incidentType !== 'Central Logistics Hub')) return true;
      if (filter === 'RISK' && (loc.riskLevel === 'High' || loc.riskLevel === 'Critical')) return true;
      if (filter === 'BLOCKED' && loc.riskLevel === 'Critical') return true;
      return false;
    });

    locsToRender.forEach(loc => {
      const marker = new window.google.maps.Marker({
        position: { lat: loc.coords[0], lng: loc.coords[1] },
        map,
        title: loc.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: loc.riskLevel === 'Critical' ? 12 : 9,
          fillColor: loc.color,
          fillOpacity: 0.9,
          strokeWeight: 2,
          strokeColor: '#FFFFFF'
        }
      });

      marker.addListener('click', () => {
        const contentString = `
          <div style="color: #0f172a; font-family: sans-serif; padding: 6px; max-width: 260px;">
            <div style="font-weight: 800; font-size: 14px; color: #1d4ed8; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
              ${loc.name} (${loc.state})
            </div>
            <div style="font-size: 11px; margin-bottom: 4px;">
              <strong>Type:</strong> ${loc.incidentType}<br/>
              <strong>Status:</strong> ${loc.status}<br/>
              <strong>Risk Level:</strong> <span style="color: ${loc.color}; font-weight: 700;">${loc.riskLevel}</span>
            </div>
            <div style="font-size: 11px; color: #475569; leading: 1.4;">
              ${loc.description}
            </div>
          </div>
        `;
        infoWindowInstance.current.setContent(contentString);
        infoWindowInstance.current.open(map, marker);
        setSelectedLocation(loc);
      });

      markersRef.current.push(marker);
    });

    // Render Field Officer Markers if Filter matches
    if (filter === 'ALL' || filter === 'OFFICERS') {
      DEMO_FIELD_OFFICERS.forEach(off => {
        const marker = new window.google.maps.Marker({
          position: { lat: off.coords[0], lng: off.coords[1] },
          map,
          title: off.name,
          icon: {
            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: '#38bdf8',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF'
          }
        });

        marker.addListener('click', () => {
          infoWindowInstance.current.setContent(`
            <div style="color: #0f172a; font-family: sans-serif; padding: 6px;">
              <strong style="color: #0284c7;">👮 ${off.name}</strong><br/>
              <span style="font-size: 11px;">${off.role} • ${off.location}</span><br/>
              <span style="font-size: 11px; color: #059669; font-weight: 700;">${off.status}</span>
            </div>
          `);
          infoWindowInstance.current.open(map, marker);
        });

        markersRef.current.push(marker);
      });
    }

    // Render Vehicles Markers if Filter matches
    if (filter === 'ALL' || filter === 'VEHICLES') {
      DEMO_VEHICLES.forEach(v => {
        const marker = new window.google.maps.Marker({
          position: { lat: v.coords[0], lng: v.coords[1] },
          map,
          title: v.id,
          icon: {
            path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 7,
            fillColor: '#10b981',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF'
          }
        });

        marker.addListener('click', () => {
          infoWindowInstance.current.setContent(`
            <div style="color: #0f172a; font-family: sans-serif; padding: 6px;">
              <strong style="color: #059669;">🚚 Vehicle ${v.id}</strong><br/>
              <span style="font-size: 11px;">Cargo: ${v.cargo}</span><br/>
              <span style="font-size: 11px;">Driver: ${v.driver}</span>
            </div>
          `);
          infoWindowInstance.current.open(map, marker);
        });

        markersRef.current.push(marker);
      });
    }

    // Render Route Polylines
    const normalRouteCoords = [
      { lat: 26.14, lng: 91.73 }, // Guwahati
      { lat: 25.90, lng: 91.88 }, // Nongpoh
      { lat: 25.57, lng: 91.88 }  // Shillong
    ];

    const normalPolyline = new window.google.maps.Polyline({
      path: normalRouteCoords,
      geodesic: true,
      strokeColor: '#EF4444',
      strokeOpacity: 0.8,
      strokeWeight: 4
    });
    normalPolyline.setMap(map);
    polylinesRef.current.push(normalPolyline);

    const bypassRouteCoords = [
      { lat: 25.90, lng: 91.88 }, // Nongpoh
      { lat: 25.44, lng: 92.20 }, // Jowai Bypass
      { lat: 24.83, lng: 92.77 }  // Silchar
    ];

    const bypassPolyline = new window.google.maps.Polyline({
      path: bypassRouteCoords,
      geodesic: true,
      strokeColor: '#10B981',
      strokeOpacity: 0.9,
      strokeWeight: 4
    });
    bypassPolyline.setMap(map);
    polylinesRef.current.push(bypassPolyline);
  };

  return (
    <div style={{ height }} className="w-full relative rounded-xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 flex flex-col">
      
      {/* FILTER CHIPS CONTROL BAR */}
      <div className="bg-slate-900 border-b border-slate-800 p-2.5 px-4 flex flex-wrap items-center justify-between gap-2 z-20 shrink-0 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-300">
          <Filter className="w-3.5 h-3.5 text-gov-blue" />
          <span>Filter Map Layer:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 font-semibold text-3xs">
          {[
            { id: 'ALL', label: 'All Items' },
            { id: 'INCIDENTS', label: '⛰ Incidents' },
            { id: 'RISK', label: '⚠️ High Risk' },
            { id: 'BLOCKED', label: '⛔ Blocked Roads' },
            { id: 'VEHICLES', label: '🚚 Vehicles' },
            { id: 'OFFICERS', label: '👮 Field Officers' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filter === item.id
                  ? 'bg-gov-blue text-white shadow-sm font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* FALLBACK BANNER IF GOOGLE MAPS API KEY NOT CONFIGURED OR FAILED */}
      {(!isRealKeyConfigured || mapError) && (
        <div className="p-2.5 bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-3xs font-semibold px-4 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              Google Maps is currently unavailable. High-reliability interactive demo GIS map engine is active.
            </span>
          </div>
          <span className="font-mono text-3xs bg-amber-500/20 px-2 py-0.5 rounded text-amber-200">
            FALLBACK ENGINE ACTIVE
          </span>
        </div>
      )}

      {/* MAP ENGINE DISPLAY CONTAINER */}
      <div className="flex-1 relative w-full h-full">
        {mapsLoaded && !mapError ? (
          <div ref={mapRef} className="w-full h-full min-h-[380px]" />
        ) : (
          <LeafletMap
            roads={roads}
            nodes={nodes}
            vehicles={vehicles}
            incidents={incidents}
            height="100%"
          />
        )}

        {/* OVERLAY CARD FOR SELECTED LOCATION */}
        {selectedLocation && (
          <div className="absolute bottom-4 left-4 right-4 max-w-md z-30 card-clean bg-white p-4 space-y-2 shadow-2xl border-2 border-gov-blue animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <MapPin className={`w-4 h-4 ${
                  selectedLocation.riskLevel === 'Critical' ? 'text-red-600' :
                  selectedLocation.riskLevel === 'High' ? 'text-orange-600' :
                  selectedLocation.riskLevel === 'Moderate' ? 'text-amber-600' : 'text-emerald-600'
                }`} />
                <h4 className="text-xs font-bold text-gov-navy">{selectedLocation.name} ({selectedLocation.state})</h4>
              </div>

              <button onClick={() => setSelectedLocation(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-3xs">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 uppercase font-bold">Incident Type</span>
                <p className="font-extrabold text-gov-navy">{selectedLocation.incidentType}</p>
              </div>

              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 uppercase font-bold">Status</span>
                <p className="font-extrabold text-slate-800">{selectedLocation.status}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{selectedLocation.description}</p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-3xs text-slate-500 font-mono">
              <span>Coordinates: [{selectedLocation.coords.join(', ')}]</span>
              <span className="font-sans font-bold text-gov-blue">Action: Reroute Dispatched</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
