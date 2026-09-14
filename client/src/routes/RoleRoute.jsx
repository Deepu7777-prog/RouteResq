import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function RoleRoute({ allowedRoles = [], children }) {
  const { user } = useAuth();

  const storedUser = user || (() => {
    try {
      const saved = localStorage.getItem('routeresq_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  if (!storedUser) return children; // If no user object, pass through in demo mode

  const userRole = (storedUser.role || '').toUpperCase();
  const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());

  const hasAccess =
    normalizedAllowed.includes(userRole) ||
    userRole === 'ADMIN' ||
    (userRole.includes('LOGISTICS') && normalizedAllowed.some(r => r.includes('LOGISTICS'))) ||
    (userRole.includes('FIELD') && normalizedAllowed.some(r => r.includes('FIELD'))) ||
    (userRole.includes('AUTHORITY') && normalizedAllowed.some(r => r.includes('AUTHORITY'))) ||
    (userRole.includes('CITIZEN') && normalizedAllowed.some(r => r.includes('CITIZEN')));

  if (!hasAccess) {
    return (
      <div className="max-w-md mx-auto my-12 card-clean p-6 text-center space-y-3 border-2 border-red-200 bg-red-50/50">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-base font-extrabold text-red-900">Access Restricted</h3>
        <p className="text-xs text-slate-600">
          Your account role (<span className="font-bold uppercase">{storedUser.role}</span>) does not have permission to view this section.
        </p>
      </div>
    );
  }

  return children;
}
