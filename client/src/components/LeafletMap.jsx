import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icon paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icons
const createCustomIcon = (svgString, size = [32, 32]) => {
  return L.divIcon({
    html: svgString,
    className: 'custom-leaflet-icon',
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1] / 2],
    popupAnchor: [0, -size[1] / 2]
  });
};

const vehicleIconSvg = `
  <div class="flex items-center justify-center w-9 h-9 bg-blue-600 border-2 border-cyan-300 rounded-full shadow-lg shadow-blue-500/50 text-white animate-pulse">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></svg>
  </div>
`;

const incidentIconSvg = `
  <div class="flex items-center justify-center w-9 h-9 bg-red-600 border-2 border-white rounded-full shadow-lg shadow-red-500/50 text-white animate-bounce">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  </div>
`;

const nodeIconSvg = (name, isHub) => `
  <div class="flex items-center gap-1.5 px-2.5 py-1 bg-navy-900/90 border border-slate-700 rounded-md text-xs font-semibold text-slate-200 shadow-md backdrop-blur-sm">
    <span class="w-2 h-2 rounded-full ${isHub ? 'bg-cyan-400 animate-ping' : 'bg-slate-400'}"></span>
    <span>${name}</span>
  </div>
`;

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom(), { duration: 1.2 });
    }
  }, [center, map]);
  return null;
}

function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return null;
}

export default function LeafletMap({
  roads = [],
  nodes = {},
  vehicles = [],
  incidents = [],
  highlightRoadId = null,
  activeRouteCoords = null,
  alternativeRouteCoords = null,
  onLocationSelect = null,
  center = [25.6, 92.2],
  zoom = 8,
  height = "550px"
}) {
  const getRoadColor = (status, riskScore) => {
    if (status === 'BLOCKED' || riskScore >= 80) return '#EF4444'; // Red
    if (status === 'HIGH_RISK' || riskScore >= 60) return '#F97316'; // Orange
    if (status === 'MEDIUM_RISK' || riskScore >= 30) return '#F59E0B'; // Amber
    return '#10B981'; // Green (Safe)
  };

  return (
    <div style={{ height }} className="w-full relative rounded-xl overflow-hidden border border-navy-700 shadow-2xl">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <MapRecenter center={center} />
        {onLocationSelect && <LocationPicker onLocationSelect={onLocationSelect} />}

        {/* Dark Mode GIS Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Render Road Network Polylines */}
        {roads.map((road) => {
          const uNode = nodes[road.u];
          const vNode = nodes[road.v];
          if (!uNode || !vNode) return null;

          const positions = [uNode.coords, vNode.coords];
          const isHighlighted = highlightRoadId === road.id;
          const color = getRoadColor(road.status, road.riskScore);

          return (
            <React.Fragment key={road.id}>
              <Polyline
                positions={positions}
                pathOptions={{
                  color,
                  weight: isHighlighted ? 7 : (road.status === 'BLOCKED' ? 6 : 4),
                  dashArray: road.status === 'BLOCKED' ? '8, 8' : undefined,
                  opacity: road.status === 'BLOCKED' ? 0.9 : 0.8
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1">
                    <div className="flex items-center justify-between gap-2 border-b border-navy-700 pb-1">
                      <span className="font-bold text-sm text-cyan-300">{road.name}</span>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                        road.status === 'BLOCKED' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                        road.status === 'HIGH_RISK' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                        road.status === 'MEDIUM_RISK' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}>
                        {road.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">Distance: <strong className="text-white">{road.distanceKm} km</strong></p>
                    <p className="text-xs text-slate-300">Risk Score: <strong className="text-amber-400">{road.riskScore} / 100</strong></p>
                  </div>
                </Popup>
              </Polyline>
            </React.Fragment>
          );
        })}

        {/* Render Active Vehicle Route Polyline if provided */}
        {activeRouteCoords && (
          <Polyline
            positions={activeRouteCoords}
            pathOptions={{ color: '#0284C7', weight: 6, opacity: 0.9 }}
          />
        )}

        {/* Render Alternative Bypass Route Polyline if provided */}
        {alternativeRouteCoords && (
          <Polyline
            positions={alternativeRouteCoords}
            pathOptions={{ color: '#10B981', weight: 6, dashArray: '10, 10', opacity: 1.0 }}
          />
        )}

        {/* Render Node Markers */}
        {Object.values(nodes).map((node) => (
          <Marker
            key={node.id}
            position={node.coords}
            icon={createCustomIcon(nodeIconSvg(node.name, node.id === 'A' || node.id === 'D'), [120, 30])}
          >
            <Popup>
              <div className="text-xs space-y-1">
                <p className="font-bold text-cyan-400 text-sm">{node.name}</p>
                <p className="text-slate-300">District: {node.district}</p>
                <p className="text-slate-400 font-mono">Node ID: {node.id}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Vehicle Markers */}
        {vehicles.map((v) => {
          // Position near origin node or along route
          const pos = nodes[v.originNode]?.coords || [26.14, 91.73];
          return (
            <Marker
              key={v.id}
              position={pos}
              icon={createCustomIcon(vehicleIconSvg, [36, 36])}
            >
              <Popup>
                <div className="space-y-1.5 p-1 text-xs">
                  <div className="flex items-center justify-between border-b border-navy-700 pb-1">
                    <span className="font-bold text-sm text-cyan-300">{v.id}</span>
                    <span className="text-slate-400">{v.status}</span>
                  </div>
                  <p className="text-slate-200">Cargo: <strong className="text-white">{v.cargo}</strong></p>
                  <p className="text-slate-200">Driver: <strong>{v.driverName}</strong></p>
                  <p className="text-slate-200">Destination: <strong>{v.destination}</strong></p>
                  <p className="text-slate-200">ETA: <strong className="text-emerald-400">{v.activeRoute?.etaFormatted || '3h 20m'}</strong></p>
                  {v.isAffected && (
                    <div className="bg-red-500/20 text-red-400 border border-red-500/40 p-1.5 rounded font-bold text-center">
                      ⚠ DISRUPTION AFFECTED
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Render Incident Markers */}
        {incidents.map((inc) => (
          <Marker
            key={inc.id}
            position={inc.locationCoords || [25.9, 91.88]}
            icon={createCustomIcon(incidentIconSvg, [36, 36])}
          >
            <Popup>
              <div className="space-y-1.5 p-1 text-xs">
                <div className="flex items-center justify-between border-b border-navy-700 pb-1">
                  <span className="font-bold text-sm text-red-400">⚠ {inc.type}</span>
                  <span className="bg-red-500/20 text-red-300 text-2xs px-1.5 py-0.5 rounded border border-red-500/30">
                    {inc.severity} Severity
                  </span>
                </div>
                <p className="text-slate-200">Road: <strong>{inc.roadName}</strong></p>
                <p className="text-slate-300">{inc.description}</p>
                <p className="text-slate-400 text-2xs">Reported by: {inc.reportedBy}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
