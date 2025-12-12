// ============================================
// SALES & CUSTOMER SERVICE PAGE
// Main workspace for sales and service teams
// ============================================

import React, { useState } from 'react';
import { DashboardLayout, RecentActivityWidget } from '../components/dashboard';
import { Card, Button, Badge, Avatar } from '../components/shared';
import {
  CustomerOnboarding,
  ProductNarrativeCard,
  TrainingDashboard,
  LeadsPipeline,
  ApplicationTracker,
  MOCK_NARRATIVES,
} from '../components/sales-service';

type TabId = 'overview' | 'leads' | 'applications' | 'customers' | 'training' | 'products';

export const SalesServicePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  // Mock metrics
  const metrics = {
    newLeads: 12,
    activeApplications: 8,
    pendingKYC: 5,
    conversionRate: 32,
    monthlyTarget: 5000000,
    monthlyAchieved: 3200000,
    trainingProgress: 75,
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(amount);

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'leads',
      label: 'Sales Pipeline',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'customers',
      label: 'KYC & Onboarding',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
    },
    {
      id: 'training',
      label: 'Training',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: 'products',
      label: 'Product Info',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">New Leads</p>
              <p className="text-3xl font-bold">{metrics.newLeads}</p>
              <p className="text-blue-100 text-xs mt-1">This week</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Active Applications</p>
              <p className="text-3xl font-bold">{metrics.activeApplications}</p>
              <p className="text-emerald-100 text-xs mt-1">In progress</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Pending KYC</p>
              <p className="text-3xl font-bold">{metrics.pendingKYC}</p>
              <p className="text-amber-100 text-xs mt-1">Requires action</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Conversion Rate</p>
              <p className="text-3xl font-bold">{metrics.conversionRate}%</p>
              <p className="text-purple-100 text-xs mt-1">This month</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Monthly Target */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Monthly Sales Target</h3>
          <Badge variant="info">
            {Math.round((metrics.monthlyAchieved / metrics.monthlyTarget) * 100)}% Achieved
          </Badge>
        </div>
        <div className="flex items-center gap-4 mb-2">
          <span className="text-sm text-gray-500">Achieved</span>
          <span className="text-xl font-bold text-primary-600">
            {formatCurrency(metrics.monthlyAchieved)}
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-lg text-gray-600">{formatCurrency(metrics.monthlyTarget)}</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all"
            style={{ width: `${(metrics.monthlyAchieved / metrics.monthlyTarget) * 100}%` }}
          />
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Quick Actions & Pipeline */}
        <div className="col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'New Lead', icon: '👤', color: 'bg-blue-50 hover:bg-blue-100 text-blue-600', onClick: () => setActiveTab('leads') },
                { label: 'New Application', icon: '📝', color: 'bg-green-50 hover:bg-green-100 text-green-600', onClick: () => setActiveTab('applications') },
                { label: 'Start KYC', icon: '🆔', color: 'bg-amber-50 hover:bg-amber-100 text-amber-600', onClick: () => setActiveTab('customers') },
                { label: 'Product Info', icon: '📦', color: 'bg-purple-50 hover:bg-purple-100 text-purple-600', onClick: () => setActiveTab('products') },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className={`p-4 rounded-lg ${action.color} transition-colors text-center`}
                >
                  <span className="text-2xl mb-2 block">{action.icon}</span>
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Priority Items */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Priority Follow-ups</h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('leads')}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Mohammed Al Farsi', product: 'Home Financing', amount: 1500000, due: 'Today', urgent: true },
                { name: 'Gulf Trading Corp', product: 'Working Capital', amount: 5000000, due: 'Tomorrow', urgent: false },
                { name: 'Sunrise Real Estate', product: 'Commercial Property', amount: 8000000, due: 'In 2 days', urgent: false },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar name={item.name} size="sm" />
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.product}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">{formatCurrency(item.amount)}</p>
                    <Badge variant={item.urgent ? 'danger' : 'warning'} className="text-xs">
                      {item.due}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <RecentActivityWidget />
        </div>

        {/* Right Column - Training & Products */}
        <div className="space-y-6">
          <TrainingDashboard />

          {/* Popular Products */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Top Products</h3>
            <div className="space-y-3">
              {[
                { name: 'Home Murabaha', applications: 45, trend: '+12%' },
                { name: 'Sukuk Fund', applications: 32, trend: '+8%' },
                { name: 'Working Capital', applications: 28, trend: '+5%' },
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-900">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">{product.applications} apps</span>
                    <span className="text-xs text-green-600 ml-2">{product.trend}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-3"
              onClick={() => setActiveTab('products')}
            >
              View All Products
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderTraining = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Training Center</h2>
          <p className="text-gray-500">Complete required trainings to stay certified</p>
        </div>
        <Badge variant="info">
          {metrics.trainingProgress}% Complete
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <TrainingDashboard />
        </div>
        <div>
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Certifications</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-green-900">Islamic Finance Certified</p>
                  <p className="text-xs text-green-700">Valid until Dec 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-yellow-900">AML Certification</p>
                  <p className="text-xs text-yellow-700">Renewal due in 30 days</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Product Information</h2>
          <p className="text-gray-500">Approved product narratives for customer discussions</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search products..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {MOCK_NARRATIVES.map((narrative) => (
          <ProductNarrativeCard key={narrative.id} narrative={narrative} />
        ))}
      </div>
    </div>
  );

  return (
    <DashboardLayout
      title="Sales & Customer Service"
      subtitle="Manage leads, applications, and customer onboarding"
      role="sales"
    >
      {/* Tab Navigation */}
      <div className="border-b mb-6">
        <nav className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'leads' && <LeadsPipeline />}
      {activeTab === 'applications' && <ApplicationTracker />}
      {activeTab === 'customers' && <CustomerOnboarding />}
      {activeTab === 'training' && renderTraining()}
      {activeTab === 'products' && renderProducts()}
    </DashboardLayout>
  );
};

export default SalesServicePage;
