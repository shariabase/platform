import React from 'react';
import { Link } from 'react-router-dom';
import { UserRole } from '../../types';
import { getRoleConfig } from '../../types/roles';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: UserRole;
  userName?: string;
  title?: string;
  subtitle?: string;
  role?: string;
  onLogout?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userRole = 'product-owner',
  userName = 'Demo User',
  title,
  subtitle,
  onLogout = () => {},
}) => {
  const roleConfig = getRoleConfig(userRole);

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Secondary Navigation for Dashboard */}
      <nav className="bg-[#0d1320] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            {/* Breadcrumb & Title */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div className="h-6 w-px bg-gray-700"></div>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: roleConfig.primaryColor }}
                ></div>
                <span className="text-white font-medium">{roleConfig.displayName}</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="hidden md:flex items-center space-x-1">
              <a href="#dashboard" className="px-3 py-1.5 text-sm text-blue-400 bg-blue-500/10 rounded-lg">
                Dashboard
              </a>
              <a href="#products" className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
                Products
              </a>
              <a href="#documents" className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
                Documents
              </a>
              <a href="#meetings" className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
                Meetings
              </a>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-white relative transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500" />
              </button>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{userName}</p>
                  <p className="text-xs text-gray-500">{roleConfig.displayName}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{userName.charAt(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
