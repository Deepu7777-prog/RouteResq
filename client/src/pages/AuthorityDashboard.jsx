import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import GoogleMapView from '../components/GoogleMapView';
import RiskScoreCard from '../components/RiskScoreCard';
import {
  Shield, AlertTriangle, Route, Truck, RefreshCw, CheckCircle2, XCircle,
  Clock, Eye, UserCheck, FileText, Activity, Server, MapPin, Search, Filter,
  ShieldCheck, Check, X, Ban, Settings, BarChart2, Bell, Map, AlertCircle
} from 'lucide-react';

const INITIAL_DEMO_USERS = [
  {
    id: 101,
    full_name: 'Arjun Kumar',
    email: 'driver.demo@routeresq.com',
    mobile: '+91 9000000002',
    role: 'DRIVER',
    verification_status: 'PENDING',
    officer_id: 'DL-AS-2024-9981',
    vehicle_number: 'AS-01-EQ-9921 (Ambulance)',
    organization: 'Assam Emergency Medical Transport',
    department: 'Emergency Transit Division',
    location_name: 'Nongpoh, Meghalaya',
    documents: ['Driving License (DL-AS-2024)', 'Vehicle Registration (AS-01-EQ-9921)', 'Medical Fitness Cert'],
    created_at: '2026-09-10T10:30:00'
  },
  {
    id: 102,
    full_name: 'Priya Sharma',
    email: 'logistics.demo@routeresq.com',
    mobile: '+91 9000000003',
    role: 'LOGISTICS_OFFICER',
    verification_status: 'PENDING',
    officer_id: 'LOG-NER-4402',
    vehicle_number: 'N/A',
    organization: 'NER Relief Cargo Dispatch Corp',
    department: 'Relief Logistics Command',
    location_name: 'Guwahati Hub, Assam',
    documents: ['Organization ID (LOG-NER-4402)', 'Govt Transport Permit', 'Aadhaar Card'],
    created_at: '2026-09-10T11:15:00'
  },
  {
    id: 103,
    full_name: 'Ravi Kumar',
    email: 'field.demo@routeresq.com',
    mobile: '+91 9000000004',
    role: 'FIELD_OFFICER',
    verification_status: 'VERIFIED',
    officer_id: 'FLD-SHG-8812',
    vehicle_number: 'N/A',
    organization: 'State Disaster Response Force (SDRF)',
    department: 'East Khasi Hills Field Division',
    location_name: 'Shillong, Meghalaya',
    documents: ['Field Officer Badge (FLD-SHG-8812)', 'Disaster Response Cert'],
    created_at: '2026-09-09T14:20:00'
  },
  {
    id: 104,
    full_name: 'Sunita Roy',
    email: 'citizen.demo@routeresq.com',
    mobile: '+91 9000000001',
    role: 'CITIZEN',
    verification_status: 'PENDING',
    officer_id: 'N/A',
    vehicle_number: 'N/A',
    organization: 'Public Citizen',
    department: 'Resident User',
    location_name: 'Silchar, Assam',
    documents: ['Aadhaar Identity Proof'],
    created_at: '2026-09-11T09:00:00'
  },
  {
    id: 105,
    full_name: 'Rajesh Nath',
    email: 'rajesh.field@routeresq.com',
    mobile: '+91 9000000009',
    role: 'FIELD_OFFICER',
    verification_status: 'REJECTED',
    officer_id: 'FLD-EXP-0001',
    vehicle_number: 'N/A',
    organization: 'Highway Police Division',
    department: 'Jowai Patrol Sector',
    location_name: 'Jowai, Meghalaya',
    documents: ['Expired Department ID'],
    created_at: '2026-09-08T16:45:00'
  }
];

const INITIAL_AUDIT_LOGS = [
  { id: 1, timestamp: '2026-09-11 18:30', action: 'User Verified', details: 'Admin verified Officer Ravi Kumar (FLD-SHG-8812)' },
  { id: 2, timestamp: '2026-09-11 17:45', action: 'Incident Reported', details: 'Landslide reported on Nongpoh-Shillong Pass (R02)' },
  { id: 3, timestamp: '2026-09-11 16:20', action: 'Route Dispatched', details: 'TRK001 rerouted via Jowai Safe Bypass (R04)' },
  { id: 4, timestamp: '2026-09-11 15:10', action: 'Dashboard Access Granted', details: 'Logistics Dispatcher authenticated successfully' }
];

export default function AuthorityDashboard() {
  const { state, currentView, setCurrentView, fetchState, t } = useAppState();
  
  // Sync tab with currentView if routed from Sidebar
  const getInitialTab = () => {
    if (currentView === 'user-verification') return 'verification';
    if (currentView === 'gis-map') return 'map';
    if (currentView === 'settings') return 'system';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [users, setUsers] = useState(INITIAL_DEMO_USERS);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoadForRisk, setSelectedRoadForRisk] = useState(null);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'approve' | 'reject' | 'suspend', user: object }
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [currentView]);

  // Sync users with backend if available
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const data = await res.json();
          if (data.users && data.users.length > 0) setUsers(data.users);
        }
      } catch (err) {
        console.warn('API users polling fallback:', err);
      }
    }
    loadUsers();
  }, []);

  const handleApprove = async (targetUser) => {
    setUsers(prev => prev.map(u => u.id === targetUser.id ? { ...u, verification_status: 'VERIFIED' } : u));
    setAuditLogs(prev => [
      { id: Date.now(), timestamp: new Date().toLocaleString(), action: 'User Verified', details: `Admin approved ${targetUser.full_name} (${targetUser.role})` },
      ...prev
    ]);
    if (selectedUser?.id === targetUser.id) {
      setSelectedUser(prev => prev ? { ...prev, verification_status: 'VERIFIED' } : null);
    }
    setConfirmAction(null);
    try { await fetch(`/api/users/${targetUser.id}/approve`, { method: 'POST' }); } catch (e) {}
  };

  const handleReject = async (targetUser) => {
    setUsers(prev => prev.map(u => u.id === targetUser.id ? { ...u, verification_status: 'REJECTED' } : u));
    setAuditLogs(prev => [
      { id: Date.now(), timestamp: new Date().toLocaleString(), action: 'User Access Rejected', details: `Admin rejected ${targetUser.full_name} (${targetUser.role})` },
      ...prev
    ]);
    if (selectedUser?.id === targetUser.id) {
      setSelectedUser(prev => prev ? { ...prev, verification_status: 'REJECTED' } : null);
    }
    setConfirmAction(null);
    try { await fetch(`/api/users/${targetUser.id}/reject`, { method: 'POST' }); } catch (e) {}
  };

  const handleSuspend = async (targetUser) => {
    setUsers(prev => prev.map(u => u.id === targetUser.id ? { ...u, verification_status: 'SUSPENDED' } : u));
    setAuditLogs(prev => [
      { id: Date.now(), timestamp: new Date().toLocaleString(), action: 'User Suspended', details: `Admin suspended ${targetUser.full_name} (${targetUser.role})` },
      ...prev
    ]);
    if (selectedUser?.id === targetUser.id) {
      setSelectedUser(prev => prev ? { ...prev, verification_status: 'SUSPENDED' } : null);
    }
    setConfirmAction(null);
  };

  // Demo stats derived dynamically
  const safeRoadsCount = state?.roads?.filter(r => r.status === 'SAFE').length || 4;
  const blockedRoadsCount = state?.roads?.filter(r => r.status === 'BLOCKED').length || 5;

  const totalUsers = 248;
  const pendingCount = users.filter(u => u.verification_status === 'PENDING').length + 14;
  const verifiedDriversCount = 96;
  const verifiedLogisticsCount = 42;
  const verifiedFieldCount = 35;
  const activeIncidentsCount = 12;
  const highRiskAreasCount = 8;

  const filteredUsers = users.filter(u => {
    if (filterRole !== 'ALL' && u.role !== filterRole) return false;
    if (filterStatus !== 'ALL' && u.verification_status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="card-clean p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gov-blue text-white flex items-center justify-center font-bold shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-gov-navy">Government Authority Command Center</h1>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-3xs font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                GOVT ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-600">Central User Verification Queue & NER Disaster Intelligence Surveillance</p>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'overview' ? 'bg-gov-blue text-white shadow-sm' : 'text-slate-700 hover:text-gov-navy'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'verification' ? 'bg-gov-blue text-white shadow-sm' : 'text-slate-700 hover:text-gov-navy'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Verification ({pendingCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'map' ? 'bg-gov-blue text-white shadow-sm' : 'text-slate-700 hover:text-gov-navy'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Live GIS Map</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'system' ? 'bg-gov-blue text-white shadow-sm' : 'text-slate-700 hover:text-gov-navy'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Audit & System</span>
          </button>
        </div>
      </div>

      {/* SECTION 3: ADMIN OVERVIEW STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="card-clean p-3 space-y-1">
          <span className="text-3xs font-extrabold text-slate-500 uppercase">Total Users</span>
          <div className="text-lg font-extrabold text-gov-navy">{totalUsers}</div>
          <p className="text-3xs text-slate-500">Registered</p>
        </div>

        <div className="card-clean p-3 space-y-1 border-l-4 border-amber-500">
          <span className="text-3xs font-extrabold text-amber-700 uppercase">Pending Verification</span>
          <div className="text-lg font-extrabold text-amber-600">{pendingCount}</div>
          <p className="text-3xs text-amber-800 font-bold">Needs Review</p>
        </div>

        <div className="card-clean p-3 space-y-1 border-l-4 border-emerald-500">
          <span className="text-3xs font-extrabold text-emerald-700 uppercase">Verified Drivers</span>
          <div className="text-lg font-extrabold text-emerald-600">{verifiedDriversCount}</div>
          <p className="text-3xs text-emerald-700">Ambulance & Truck</p>
        </div>

        <div className="card-clean p-3 space-y-1">
          <span className="text-3xs font-extrabold text-slate-500 uppercase">Logistics Officers</span>
          <div className="text-lg font-extrabold text-purple-700">{verifiedLogisticsCount}</div>
          <p className="text-3xs text-slate-500">Dispatch Verified</p>
        </div>

        <div className="card-clean p-3 space-y-1">
          <span className="text-3xs font-extrabold text-slate-500 uppercase">Field Officers</span>
          <div className="text-lg font-extrabold text-sky-700">{verifiedFieldCount}</div>
          <p className="text-3xs text-slate-500">Ground Responders</p>
        </div>

        <div className="card-clean p-3 space-y-1 border-l-4 border-red-500">
          <span className="text-3xs font-extrabold text-red-700 uppercase">Active Incidents</span>
          <div className="text-lg font-extrabold text-red-600">{activeIncidentsCount}</div>
          <p className="text-3xs text-red-700 font-bold">Monsoon Reports</p>
        </div>

        <div className="card-clean p-3 space-y-1">
          <span className="text-3xs font-extrabold text-slate-500 uppercase">High Risk Areas</span>
          <div className="text-lg font-extrabold text-orange-600">{highRiskAreasCount}</div>
          <p className="text-3xs text-slate-500">Vulnerable Pass</p>
        </div>

        <div className="card-clean p-3 space-y-1 border-l-4 border-rose-600">
          <span className="text-3xs font-extrabold text-rose-700 uppercase">Blocked Roads</span>
          <div className="text-lg font-extrabold text-rose-600">{blockedRoadsCount}</div>
          <p className="text-3xs text-rose-700 font-bold">Landslide Closure</p>
        </div>
      </div>

      {/* OVERVIEW TAB CONTENT: SIDE-BY-SIDE SPLIT SCREEN */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: GOOGLE MAP SURVEILLANCE CENTERPIECE (VISIBLE IMMEDIATELY) */}
          <div className="lg:col-span-7 card-clean p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-gov-navy flex items-center gap-2">
                <Route className="w-4 h-4 text-gov-blue" />
                <span>North Eastern Region Disaster & Route Surveillance Map</span>
              </h3>
              <div className="flex items-center gap-2 text-3xs font-semibold">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Safe</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Moderate</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> High</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Blocked</span>
              </div>
            </div>

            <GoogleMapView
              roads={state?.roads || []}
              nodes={state?.nodes || {}}
              vehicles={state?.vehicles || []}
              incidents={state?.incidents || []}
              height="520px"
            />
          </div>

          {/* RIGHT COLUMN: PENDING REGISTRATIONS & ACTIVE INCIDENTS */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* PENDING VERIFICATION QUEUE */}
            <div className="card-clean p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-gov-navy flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-600" />
                  <span>Pending Registrations Queue</span>
                </h3>
                <button onClick={() => setActiveTab('verification')} className="text-3xs font-bold text-gov-blue hover:underline">
                  View All ({pendingCount}) →
                </button>
              </div>

              <div className="space-y-2">
                {users.filter(u => u.verification_status === 'PENDING').slice(0, 3).map((u) => (
                  <div key={u.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gov-navy text-xs">{u.full_name}</span>
                        <span className="text-3xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 font-mono">
                          {u.role}
                        </span>
                      </div>
                      <p className="text-3xs text-slate-500">{u.organization} • {u.location_name}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="px-2.5 py-1 bg-gov-blue hover:bg-blue-700 text-white rounded text-3xs font-bold transition-colors shadow-sm"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTIVE DISASTER INCIDENTS */}
            <div className="card-clean p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-gov-navy flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Active Disaster Incidents</span>
                </h3>
                <span className="text-3xs font-semibold text-slate-500">12 Logged Reports</span>
              </div>

              <div className="space-y-2">
                {(state?.incidents || []).slice(0, 3).map((inc) => (
                  <div key={inc.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gov-navy text-xs">⛰ {inc.type}</span>
                        <span className="text-3xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                          {inc.severity} Severity
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{inc.roadName}</p>
                    </div>
                    <span className="text-3xs font-mono text-slate-400">Reported by {inc.reportedBy}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VERIFICATION QUEUE TAB */}
      {activeTab === 'verification' && (
        <div className="card-clean p-5 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-gov-navy flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-gov-blue" />
                <span>User Registration & Access Verification System</span>
              </h3>
              <p className="text-xs text-slate-500">
                Verify driver licenses, logistics permits, and field officer credentials before granting dashboard access.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
              >
                <option value="ALL">All Roles</option>
                <option value="DRIVER">Driver</option>
                <option value="LOGISTICS_OFFICER">Logistics Officer</option>
                <option value="FIELD_OFFICER">Field Officer</option>
                <option value="CITIZEN">Citizen</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending Only</option>
                <option value="VERIFIED">Verified Only</option>
                <option value="REJECTED">Rejected Only</option>
                <option value="SUSPENDED">Suspended Only</option>
              </select>
            </div>
          </div>

          {/* VERIFICATION QUEUE TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 text-3xs font-extrabold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Applicant Name</th>
                  <th className="py-3 px-4">Target Role</th>
                  <th className="py-3 px-4">Vehicle / Organization</th>
                  <th className="py-3 px-4">Submitted Documents</th>
                  <th className="py-3 px-4">Submitted Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gov-navy text-xs">{u.full_name}</div>
                      <div className="text-3xs text-slate-500 font-mono">{u.email} • {u.mobile}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-3xs font-extrabold px-2 py-0.5 rounded bg-blue-50 text-gov-blue border border-blue-200">
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                      <div>{u.organization || u.department}</div>
                      {u.vehicle_number !== 'N/A' && (
                        <div className="text-3xs font-mono text-gov-blue">{u.vehicle_number}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        {u.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-3xs text-slate-600">
                            <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-3xs font-mono">
                      {(() => {
                        try {
                          const d = new Date(u.created_at);
                          return isNaN(d.getTime()) ? '2026-09-10' : d.toLocaleDateString();
                        } catch {
                          return '2026-09-10';
                        }
                      })()}
                    </td>

                    <td className="py-3.5 px-4">
                      {u.verification_status === 'VERIFIED' && (
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-3xs font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>VERIFIED ✓</span>
                        </span>
                      )}
                      {u.verification_status === 'PENDING' && (
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-3xs font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 animate-pulse">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>PENDING ⏳</span>
                        </span>
                      )}
                      {u.verification_status === 'REJECTED' && (
                        <span className="bg-red-100 text-red-800 border border-red-300 text-3xs font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-red-600" />
                          <span>REJECTED ✕</span>
                        </span>
                      )}
                      {u.verification_status === 'SUSPENDED' && (
                        <span className="bg-slate-200 text-slate-800 border border-slate-400 text-3xs font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Ban className="w-3 h-3 text-slate-600" />
                          <span>SUSPENDED 🚫</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded text-3xs font-bold transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>Details</span>
                        </button>

                        {u.verification_status !== 'VERIFIED' && (
                          <button
                            onClick={() => setConfirmAction({ type: 'approve', user: u })}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-3xs font-bold shadow-sm transition-all flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Verify</span>
                          </button>
                        )}

                        {u.verification_status !== 'REJECTED' && (
                          <button
                            onClick={() => setConfirmAction({ type: 'reject', user: u })}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-3xs font-bold shadow-sm transition-all flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        )}

                        {u.verification_status === 'VERIFIED' && (
                          <button
                            onClick={() => setConfirmAction({ type: 'suspend', user: u })}
                            className="px-2 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded text-3xs font-bold shadow-sm transition-all"
                            title="Suspend user"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* LIVE MAP TAB */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <div className="card-clean p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-gov-navy flex items-center gap-2">
                <Map className="w-4 h-4 text-gov-blue" />
                <span>Dedicated GIS Live Map Surveillance</span>
              </h3>
              <div className="flex items-center gap-3 text-3xs font-semibold">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Safe</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Caution</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Blocked</span>
              </div>
            </div>

            <GoogleMapView
              roads={state?.roads || []}
              nodes={state?.nodes || {}}
              vehicles={state?.vehicles || []}
              incidents={state?.incidents || []}
              height="550px"
            />
          </div>
        </div>
      )}

      {/* SYSTEM AUDIT & MONITORING TAB */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card-clean p-5 space-y-4">
            <h3 className="text-base font-bold text-gov-navy flex items-center gap-2">
              <Server className="w-5 h-5 text-gov-blue" />
              <span>System Operational Status</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <span className="font-semibold text-emerald-900">Python Flask Backend</span>
                <span className="font-bold font-mono text-emerald-700 text-3xs bg-emerald-200 px-2 py-0.5 rounded">ONLINE 🟢</span>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <span className="font-semibold text-emerald-900">GIS Tile Server</span>
                <span className="font-bold font-mono text-emerald-700 text-3xs bg-emerald-200 px-2 py-0.5 rounded">ACTIVE 🟢</span>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <span className="font-semibold text-emerald-900">Dijkstra Routing Engine</span>
                <span className="font-bold font-mono text-emerald-700 text-3xs bg-emerald-200 px-2 py-0.5 rounded">READY 🟢</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 card-clean p-5 space-y-4">
            <h3 className="text-base font-bold text-gov-navy flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              <span>System Verification Audit Log</span>
            </h3>

            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-gov-navy text-xs">{log.action}</span>
                    <p className="text-slate-600 text-xs">{log.details}</p>
                  </div>
                  <span className="text-3xs font-mono text-slate-500 shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* USER DETAILS MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-clean bg-white max-w-xl w-full p-6 space-y-5 animate-scale-in shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gov-blue text-white flex items-center justify-center font-bold text-xs">
                  {selectedUser.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gov-navy">{selectedUser.full_name}</h3>
                  <p className="text-3xs font-mono text-slate-500">{selectedUser.email} • {selectedUser.mobile}</p>
                </div>
              </div>

              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-3xs text-slate-500 uppercase font-bold">Applicant Role</span>
                <p className="font-extrabold text-gov-blue">{selectedUser.role}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-3xs text-slate-500 uppercase font-bold">ID / License Number</span>
                <p className="font-extrabold font-mono text-slate-800">{selectedUser.officer_id || 'N/A'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-3xs text-slate-500 uppercase font-bold">Vehicle Number</span>
                <p className="font-extrabold text-gov-navy">{selectedUser.vehicle_number || 'N/A'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-3xs text-slate-500 uppercase font-bold">Organization / Dept</span>
                <p className="font-semibold text-slate-700">{selectedUser.organization || selectedUser.department}</p>
              </div>
            </div>

            {/* Submitted Document Verification Placeholders */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider">Submitted Document Verification Records</h4>
              <div className="space-y-2">
                {selectedUser.documents.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gov-blue" />
                      <span className="text-xs font-semibold text-slate-700">{doc}</span>
                    </div>
                    <span className="text-3xs font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                      SUBMITTED ✓
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Status: <strong className="uppercase font-mono text-gov-navy">{selectedUser.verification_status}</strong>
              </span>

              <div className="flex items-center gap-2">
                {selectedUser.verification_status !== 'REJECTED' && (
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setConfirmAction({ type: 'reject', user: selectedUser });
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                  >
                    Reject Access
                  </button>
                )}

                {selectedUser.verification_status !== 'VERIFIED' && (
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setConfirmAction({ type: 'approve', user: selectedUser });
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                  >
                    Verify & Grant Access
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION ACTION DIALOG */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-clean bg-white max-w-md w-full p-6 space-y-4 animate-scale-in text-center shadow-2xl">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
              confirmAction.type === 'approve' ? 'bg-emerald-100 text-emerald-600' :
              confirmAction.type === 'reject' ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-700'
            }`}>
              {confirmAction.type === 'approve' ? <Check className="w-6 h-6" /> :
               confirmAction.type === 'reject' ? <X className="w-6 h-6" /> : <Ban className="w-6 h-6" />}
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-gov-navy uppercase">
                Confirm {confirmAction.type} User
              </h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to {confirmAction.type === 'approve' ? 'verify and grant dashboard access to' : confirmAction.type === 'reject' ? 'reject system access for' : 'suspend dashboard access for'}{' '}
                <strong>{confirmAction.user.full_name}</strong> ({confirmAction.user.role})?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (confirmAction.type === 'approve') handleApprove(confirmAction.user);
                  else if (confirmAction.type === 'reject') handleReject(confirmAction.user);
                  else handleSuspend(confirmAction.user);
                }}
                className={`flex-1 py-2 text-white font-extrabold text-xs rounded-lg shadow-sm transition-all ${
                  confirmAction.type === 'approve' ? 'bg-emerald-600 hover:bg-emerald-500' :
                  confirmAction.type === 'reject' ? 'bg-red-600 hover:bg-red-500' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                Confirm {confirmAction.type.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Risk Score Modal */}
      {selectedRoadForRisk && (
        <RiskScoreCard
          road={selectedRoadForRisk}
          onClose={() => setSelectedRoadForRisk(null)}
        />
      )}

    </div>
  );
}
