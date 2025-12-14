import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Menu items configuration
const STARTUPS_MENU = {
  workflows: [
    { icon: '📤', label: 'Upload Contract', path: '/upload-contract', color: 'bg-blue-500' },
    { icon: '📋', label: 'Choose Template', path: '/templates', color: 'bg-emerald-500' },
    { icon: '✅', label: 'Quick Compliance Scan', path: '/compliance-scan', color: 'bg-green-500' },
    { icon: '👤', label: 'Ask a Scholar', path: '/ask-scholar', color: 'bg-yellow-500' },
    { icon: '⚖️', label: 'AI Legal Assistant', path: '/legal-assistant', color: 'bg-red-400' },
    { icon: '📖', label: 'AI Fiqh Assistant', path: '/fiqh-assistant', color: 'bg-blue-400' },
    { icon: '🕐', label: 'Version History', path: '/history', color: 'bg-gray-500' },
  ],
  modules: [
    { icon: '📄', label: 'Contracts Only', path: '/contracts', color: 'bg-blue-500' },
    { icon: '💎', label: 'Templates Hub', path: '/templates-hub', color: 'bg-purple-500' },
    { icon: '🏢', label: 'Single Department Mode', path: '/department', color: 'bg-emerald-500' },
    { icon: '👥', label: 'Collaboration', path: '/collaboration', color: 'bg-orange-500' },
    { icon: '💾', label: 'Saved Drafts', path: '/drafts', color: 'bg-red-400' },
  ],
  integrations: [
    { icon: '🔵', label: 'Google Drive', path: '/integrations/google-drive', color: 'bg-green-500' },
    { icon: '⬛', label: 'Notion', path: '/integrations/notion', color: 'bg-gray-400' },
    { icon: '🟣', label: 'Slack', path: '/integrations/slack', color: 'bg-red-500' },
    { icon: '✉️', label: 'Email Parser', path: '/integrations/email', color: 'bg-yellow-500' },
  ],
};

const NAV_ITEMS = [
  { label: 'Startups', hasDropdown: true },
  { label: 'Enterprise', path: '/enterprise' },
  { label: 'Templates', path: '/templates' },
  { label: 'Scholars', path: '/sharia-board' },
  { label: 'Tools', path: '/tools' },
  { label: 'Help', path: '/help' },
];

export const TopNavigation: React.FC = () => {
  const [isStartupsOpen, setIsStartupsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsStartupsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#0a0f1a] border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Shariabase</span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative" ref={item.hasDropdown ? dropdownRef : undefined}>
                {item.hasDropdown ? (
                  <button
                    onClick={() => setIsStartupsOpen(!isStartupsOpen)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isStartupsOpen 
                        ? 'text-blue-400 bg-blue-500/10' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    to={item.path || '/'}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'text-blue-400'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}

                {/* Startups Dropdown */}
                {item.hasDropdown && isStartupsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-[700px] bg-[#0d1320] border border-gray-800 rounded-xl shadow-2xl p-6 -translate-x-1/4">
                    <div className="grid grid-cols-3 gap-8">
                      {/* Workflows Column */}
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                          Workflows
                        </h3>
                        <div className="space-y-1">
                          {STARTUPS_MENU.workflows.map((menuItem) => (
                            <Link
                              key={menuItem.label}
                              to={menuItem.path}
                              onClick={() => setIsStartupsOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                            >
                              <div className={`w-8 h-8 ${menuItem.color} rounded-lg flex items-center justify-center text-sm`}>
                                {menuItem.icon}
                              </div>
                              <span className="text-gray-300 group-hover:text-white text-sm">
                                {menuItem.label}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Modules Column */}
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                          Modules
                        </h3>
                        <div className="space-y-1">
                          {STARTUPS_MENU.modules.map((menuItem) => (
                            <Link
                              key={menuItem.label}
                              to={menuItem.path}
                              onClick={() => setIsStartupsOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                            >
                              <div className={`w-8 h-8 ${menuItem.color} rounded-lg flex items-center justify-center text-sm`}>
                                {menuItem.icon}
                              </div>
                              <span className="text-gray-300 group-hover:text-white text-sm">
                                {menuItem.label}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Integrations Column */}
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                          Integrations
                        </h3>
                        <div className="space-y-1">
                          {STARTUPS_MENU.integrations.map((menuItem) => (
                            <Link
                              key={menuItem.label}
                              to={menuItem.path}
                              onClick={() => setIsStartupsOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                            >
                              <div className={`w-8 h-8 ${menuItem.color} rounded-full flex items-center justify-center text-sm`}>
                                {menuItem.icon}
                              </div>
                              <span className="text-gray-300 group-hover:text-white text-sm">
                                {menuItem.label}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side - Search, Notifications, Avatar */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 pl-10 pr-4 py-2 bg-[#1a2332] border border-gray-700 rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Avatar */}
            <button className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-700 hover:border-blue-500 transition-colors">
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;
