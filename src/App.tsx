import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';

// Import pages
import { 
  ProductOwnerPage, 
  ShariaBoardPage, 
  DocumentsPage,
  LegalCompliancePage,
  RiskAuditPage,
  SalesServicePage,
  CustomerPortalPage,
  RegulatorPage,
} from '../pages';

// Import shared components
import { Avatar, Badge, NotificationCenter } from '../components/shared';
import { UserRole } from '../types';

// Role configuration for navigation
const ROLE_CONFIGS: Record<UserRole, { label: string; path: string; color: string }> = {
  'product-owner': { label: 'Product Owner', path: '/product-owner', color: 'bg-blue-500' },
  'sharia-scholar': { label: 'Sharia Board', path: '/sharia-board', color: 'bg-emerald-500' },
  'legal-compliance': { label: 'Legal & Compliance', path: '/legal-compliance', color: 'bg-purple-500' },
  'risk-audit': { label: 'Risk & Audit', path: '/risk-audit', color: 'bg-orange-500' },
  'engineering': { label: 'Engineering', path: '/engineering', color: 'bg-cyan-500' },
  'sales-service': { label: 'Sales & Service', path: '/sales-service', color: 'bg-pink-500' },
  'regulator': { label: 'Regulator', path: '/regulator', color: 'bg-slate-500' },
  'customer': { label: 'Customer Portal', path: '/customer', color: 'bg-indigo-500' },
};

// Navigation component
const Navigation: React.FC<{ currentRole: UserRole; onRoleChange: (role: UserRole) => void }> = ({
  currentRole,
  onRoleChange,
}) => {
  const location = useLocation();
  
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-gray-900">Sharia Platform</span>
              <p className="text-xs text-gray-500">Islamic Finance Management</p>
            </div>
          </Link>

          {/* Role Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">View as:</span>
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {Object.entries(ROLE_CONFIGS).map(([role, config]) => (
                  <option key={role} value={role}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Notifications */}
            <NotificationCenter />

            {/* User Avatar */}
            <div className="flex items-center gap-2">
              <Avatar name="Demo User" size="sm" />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">Demo User</p>
                <p className="text-xs text-gray-500">{ROLE_CONFIGS[currentRole].label}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Landing page with role selection
const LandingPage: React.FC<{ onRoleSelect: (role: UserRole) => void }> = ({ onRoleSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Sharia-Compliant Financial Platform
          </h1>
          <p className="text-xl text-primary-100">
            Multi-role platform for Islamic finance product management
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(Object.entries(ROLE_CONFIGS) as [UserRole, typeof ROLE_CONFIGS[UserRole]][]).map(([role, config]) => (
            <Link
              key={role}
              to={config.path}
              onClick={() => onRoleSelect(role)}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all hover:scale-105 cursor-pointer group"
            >
              <div className={`w-12 h-12 ${config.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-white mb-1">{config.label}</h3>
              <p className="text-sm text-primary-200">
                {role === 'product-owner' && 'Create & manage products'}
                {role === 'sharia-scholar' && 'Review Sharia compliance'}
                {role === 'legal-compliance' && 'Legal & regulatory review'}
                {role === 'risk-audit' && 'Risk assessment & audit'}
                {role === 'engineering' && 'Technical implementation'}
                {role === 'sales-service' && 'Customer onboarding'}
                {role === 'regulator' && 'Audit & compliance view'}
                {role === 'customer' && 'Self-service portal'}
              </p>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-primary-200 text-sm">
            Demo Mode • All data is simulated
          </p>
        </div>
      </div>
    </div>
  );
};

// Layout wrapper for pages with navigation
const MainLayout: React.FC<{ 
  children: React.ReactNode; 
  currentRole: UserRole; 
  onRoleChange: (role: UserRole) => void 
}> = ({ children, currentRole, onRoleChange }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentRole={currentRole} onRoleChange={onRoleChange} />
      <main>{children}</main>
    </div>
  );
};

// Engineering placeholder
const EngineeringPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-12 text-center">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Engineering Portal</h1>
    <p className="text-gray-500">Coming soon - Smart contract deployment interface</p>
  </div>
);

// Main App component
const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('product-owner');

  return (
    <Router>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<LandingPage onRoleSelect={setCurrentRole} />} />
        
        {/* Customer portal - standalone layout */}
        <Route path="/customer" element={<CustomerPortalPage />} />
        
        {/* Regulator portal - standalone layout */}
        <Route path="/regulator" element={<RegulatorPage />} />
        
        {/* Pages with shared navigation */}
        <Route path="/product-owner" element={
          <MainLayout currentRole={currentRole} onRoleChange={setCurrentRole}>
            <ProductOwnerPage />
          </MainLayout>
        } />
        <Route path="/sharia-board" element={
          <MainLayout currentRole={currentRole} onRoleChange={setCurrentRole}>
            <ShariaBoardPage />
          </MainLayout>
        } />
        <Route path="/legal-compliance" element={
          <MainLayout currentRole={currentRole} onRoleChange={setCurrentRole}>
            <LegalCompliancePage />
          </MainLayout>
        } />
        <Route path="/risk-audit" element={
          <MainLayout currentRole={currentRole} onRoleChange={setCurrentRole}>
            <RiskAuditPage />
          </MainLayout>
        } />
        <Route path="/sales-service" element={
          <MainLayout currentRole={currentRole} onRoleChange={setCurrentRole}>
            <SalesServicePage />
          </MainLayout>
        } />
        <Route path="/documents" element={
          <MainLayout currentRole={currentRole} onRoleChange={setCurrentRole}>
            <DocumentsPage />
          </MainLayout>
        } />
        <Route path="/engineering" element={
          <MainLayout currentRole={currentRole} onRoleChange={setCurrentRole}>
            <EngineeringPage />
          </MainLayout>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
