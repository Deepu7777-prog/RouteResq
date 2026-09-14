import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StateProvider, useAppState } from './context/StateContext';
import Navbar from './components/Navbar';
import DemoControlBar from './components/DemoControlBar';
import Sidebar from './components/Sidebar';
import AlertToastContainer from './components/AlertToastContainer';
import ErrorBoundary from './components/ErrorBoundary';
import PanelDemoOverlay from './components/PanelDemoOverlay';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

import LandingPage from './pages/LandingPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

import AuthorityDashboard from './pages/AuthorityDashboard';
import LogisticsDashboard from './pages/LogisticsDashboard';
import DriverDashboard from './pages/DriverDashboard';
import FieldOfficerPortal from './pages/FieldOfficerPortal';
import CitizenDashboard from './pages/CitizenDashboard';
import IncidentsPage from './pages/IncidentsPage';
import RoadsPage from './pages/RoadsPage';
import RiskZonesPage from './pages/RiskZonesPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import GisMapPage from './pages/GisMapPage';
import MyRoute from './pages/driver/MyRoute';
import DemoVideoPage from './pages/DemoVideoPage';

function MainContent() {
  const { currentView } = useAppState();
  const { user } = useAuth();

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'role-selection':
        return <RoleSelectionPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'demo-video':
        return <DemoVideoPage />;

      // Protected Role Routes
      case 'authority':
      case 'admin':
      case 'user-verification':
      case 'settings':
        return (
          <ProtectedRoute>
            <RoleRoute allowedRoles={['AUTHORITY', 'ADMIN']}>
              <AuthorityDashboard />
            </RoleRoute>
          </ProtectedRoute>
        );

      case 'gis-map':
        return (
          <ProtectedRoute>
            <RoleRoute allowedRoles={['AUTHORITY', 'ADMIN', 'LOGISTICS']}>
              <GisMapPage />
            </RoleRoute>
          </ProtectedRoute>
        );

      case 'citizen':
        return <CitizenDashboard />;

      case 'incidents':
      case 'roads':
      case 'risk-zones':
      case 'alerts':
      case 'reports':
        return (
          <ProtectedRoute>
            {currentView === 'incidents' && <IncidentsPage />}
            {currentView === 'roads' && <RoadsPage />}
            {currentView === 'risk-zones' && <RiskZonesPage />}
            {currentView === 'alerts' && <AlertsPage />}
            {currentView === 'reports' && <ReportsPage />}
          </ProtectedRoute>
        );

      case 'logistics':
      case 'fleet':
      case 'tracking':
      case 'vehicles':
      case 'deliveries':
        return (
          <ProtectedRoute>
            <RoleRoute allowedRoles={['LOGISTICS', 'LOGISTICS_OFFICER', 'AUTHORITY', 'ADMIN']}>
              <LogisticsDashboard />
            </RoleRoute>
          </ProtectedRoute>
        );

      case 'driver':
        return (
          <ProtectedRoute>
            <RoleRoute allowedRoles={['DRIVER', 'ADMIN']}>
              <DriverDashboard />
            </RoleRoute>
          </ProtectedRoute>
        );

      case 'driver-route':
        return (
          <ProtectedRoute>
            <RoleRoute allowedRoles={['DRIVER', 'ADMIN']}>
              <MyRoute />
            </RoleRoute>
          </ProtectedRoute>
        );

      case 'field':
      case 'field-officer':
      case 'field-report':
        return (
          <ProtectedRoute>
            <RoleRoute allowedRoles={['FIELD_OFFICER', 'FIELD', 'AUTHORITY', 'ADMIN']}>
              <FieldOfficerPortal />
            </RoleRoute>
          </ProtectedRoute>
        );

      default:
        return <LandingPage />;
    }
  };

  const isFullWidthView = currentView === 'landing' || currentView === 'login' || currentView === 'register' || currentView === 'role-selection' || currentView === 'citizen' || !user;

  return (
    <div className="min-h-screen bg-gov-light text-slate-800 flex flex-col font-sans">
      <Navbar />
      <DemoControlBar />

      <div className="flex-1 flex w-full">
        {!isFullWidthView && <Sidebar />}

        <main className={`flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full ${isFullWidthView ? 'max-w-none' : ''}`}>
          {renderView()}
        </main>
      </div>

      <AlertToastContainer />

      <ErrorBoundary>
        <PanelDemoOverlay />
      </ErrorBoundary>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StateProvider>
        <MainContent />
      </StateProvider>
    </AuthProvider>
  );
}
