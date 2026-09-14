import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { AlertTriangle, Search, Filter, CheckCircle2, Clock } from 'lucide-react';

export default function IncidentsPage() {
  const { state, resolveIncident } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  if (!state) return <div className="p-8 text-center text-slate-400">Loading Incidents Log...</div>;

  const filteredIncidents = state.incidents.filter((inc) => {
    const matchesSearch = inc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.roadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;
    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const handleResolve = async (incidentId) => {
    await resolveIncident(incidentId);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-900 border border-navy-700 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">NER Regional Ground Incidents Directory</h1>
            <p className="text-xs text-slate-300">Live feed of landslide, flood, and road blockage reports</p>
          </div>
        </div>

        <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-500/40">
          {state.incidents.length} Total Logged Reports
        </span>
      </div>

      {/* Filter & Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-navy-900 border border-navy-700 p-4 rounded-xl shadow-lg">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search incident type or road..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-cyan focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-cyan focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Disruption</option>
            <option value="RESOLVED">Cleared / Resolved</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-cyan focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="High">High Severity</option>
            <option value="Medium">Medium Severity</option>
            <option value="Low">Low Severity</option>
          </select>
        </div>

      </div>

      {/* Incidents Table */}
      <div className="bg-navy-900 border border-navy-700 rounded-2xl shadow-xl p-5 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-950 text-slate-400 text-3xs font-extrabold uppercase tracking-wider border-b border-navy-800">
              <tr>
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Disruption Type</th>
                <th className="py-3 px-4">Road Corridor</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Reported By</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 font-medium">
              {filteredIncidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-navy-800/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">{inc.id}</td>
                  <td className="py-3 px-4 text-white font-bold">{inc.type}</td>
                  <td className="py-3 px-4 text-slate-200">{inc.roadName}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-3xs font-bold ${
                      inc.severity === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-3xs font-bold ${
                      inc.status === 'ACTIVE' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}>
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{inc.reportedBy}</td>
                  <td className="py-3 px-4 font-mono text-3xs text-slate-400">
                    {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {inc.status === 'ACTIVE' ? (
                      <button
                        onClick={() => handleResolve(inc.id)}
                        className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded text-3xs font-bold transition-colors"
                      >
                        Mark as Resolved
                      </button>
                    ) : (
                      <span className="text-3xs text-emerald-400 font-bold">✓ Cleared</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
