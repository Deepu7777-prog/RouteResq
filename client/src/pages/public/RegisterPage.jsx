import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/StateContext';
import { Navigation, ArrowRight, Shield, Truck, MapPin, UserCheck, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { setCurrentView, t } = useAppState();

  const [selectedRole, setSelectedRole] = useState('DRIVER');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile: '',
    password: '',
    licenseNumber: '',
    vehicleNumber: '',
    employeeId: '',
    department: '',
    district: '',
    designation: '',
    organization: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const roles = [
    { id: 'DRIVER', label: 'Truck Driver', icon: Navigation, desc: 'Receive real-time route guidance and road alerts.' },
    { id: 'LOGISTICS', label: 'Logistics Manager', icon: Truck, desc: 'Track essential supply vehicles and manage deliveries.' },
    { id: 'FIELD_OFFICER', label: 'Field Officer', icon: MapPin, desc: 'Report landslides, floods, and road damage directly.' },
    { id: 'AUTHORITY', label: 'Government Authority', icon: Shield, desc: 'Monitor regional road accessibility and incident response.' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const payload = {
      full_name: formData.full_name,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
      role: selectedRole,
      organization: formData.organization || formData.department || 'RouteResQ Network',
      district: formData.district || 'Kamrup Metro'
    };

    const res = await register(payload);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Account registered successfully! Redirecting...');
      setTimeout(() => {
        if (selectedRole === 'AUTHORITY') setCurrentView('authority');
        else if (selectedRole === 'LOGISTICS') setCurrentView('logistics');
        else if (selectedRole === 'DRIVER') setCurrentView('driver');
        else if (selectedRole === 'FIELD_OFFICER') setCurrentView('field');
      }, 1000);
    } else {
      setErrorMsg(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6 animate-fade-in">
      
      <div className="text-center space-y-1">
        <div className="w-10 h-10 rounded-xl bg-gov-blue text-white flex items-center justify-center mx-auto shadow-sm">
          <Navigation className="w-5 h-5 font-bold transform -rotate-45" />
        </div>
        <h1 className="text-2xl font-extrabold text-gov-navy">Create Your RouteResQ Account</h1>
        <p className="text-xs text-slate-500">Government of India • MDoNER Smart Logistics Network</p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-center">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* STEP 1: ROLE SELECTION */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider text-center">
            Step 1: Select your operational role
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;

              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all space-y-3 ${
                    isSelected
                      ? 'bg-blue-50/80 border-gov-blue shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                      isSelected ? 'bg-gov-blue text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && <UserCheck className="w-5 h-5 text-gov-blue" />}
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-gov-navy">{r.label}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3 rounded-lg bg-gov-blue hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue to Form Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: ROLE-SPECIFIC FORM */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="card-clean p-6 space-y-4 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-gov-blue">Role: {selectedRole}</span>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-slate-500 hover:underline"
            >
              ← Change Role
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Full Name *</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="e.g. Rajesh Kumar"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Mobile Number *</label>
              <input
                type="tel"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="official@gov.in or email@domain.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            {/* Role-Specific Fields */}
            {selectedRole === 'DRIVER' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Driver License Number</label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    placeholder="DL-14201100"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Assigned Vehicle Number</label>
                  <input
                    type="text"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    placeholder="AS-01-HC-4092"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </>
            )}

            {selectedRole === 'FIELD_OFFICER' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Employee ID</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    placeholder="FLD-9901"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Assigned District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="Ri-Bhoi / East Khasi Hills"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </>
            )}

            {selectedRole === 'LOGISTICS' && (
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Logistics Organization</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="NER Essential Supplies Fleet Ltd"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>
            )}

            {selectedRole === 'AUTHORITY' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Govt Employee ID</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    placeholder="MDoNER-8812"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Department / Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="Disaster Preparedness Cell"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </>
            )}

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Account Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Choose a secure password"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gov-blue hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      <div className="text-center text-xs text-slate-500">
        Already registered?{' '}
        <button
          onClick={() => setCurrentView('login')}
          className="font-bold text-gov-blue hover:underline"
        >
          Login here
        </button>
      </div>

    </div>
  );
}
