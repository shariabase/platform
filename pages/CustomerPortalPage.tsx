// ============================================
// CUSTOMER PORTAL PAGE
// End-customer facing dashboard
// ============================================

import React, { useState } from 'react';
import { Card, Button, Badge, Avatar, Modal } from '../components/shared';
import {
  ProductOverview,
  PaymentSchedule,
  ShariaEducation,
  MOCK_CUSTOMER_PRODUCTS,
} from '../components/customer-portal';
import { CustomerDashboardSummary, CustomerPendingAction, SupportTicket } from '../types/customer';

type TabId = 'dashboard' | 'products' | 'payments' | 'documents' | 'learn' | 'support';

export const CustomerPortalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');

  // Mock dashboard summary
  const summary: CustomerDashboardSummary = {
    totalActiveProducts: 3,
    totalPortfolioValue: 1950000,
    nextPaymentDate: new Date('2024-02-01'),
    nextPaymentAmount: 16375,
    upcomingPaymentsCount: 2,
    unreadMessages: 1,
    pendingActions: [
      {
        id: 'action-1',
        type: 'make-payment',
        title: 'Monthly Payment Due',
        productId: 'cp-1',
        dueDate: new Date('2024-02-01'),
        priority: 'normal',
      },
    ],
  };

  // Mock support tickets
  const [tickets] = useState<SupportTicket[]>([
    {
      id: 'ticket-1',
      subject: 'Question about early settlement',
      category: 'payment',
      status: 'in-progress',
      priority: 'medium',
      messages: [
        {
          id: 'msg-1',
          ticketId: 'ticket-1',
          senderId: 'customer-1',
          senderName: 'You',
          senderType: 'customer',
          content: 'I would like to know if I can make an early settlement on my home financing. What would be the process?',
          createdAt: new Date('2024-01-10'),
        },
        {
          id: 'msg-2',
          ticketId: 'ticket-1',
          senderId: 'support-1',
          senderName: 'Support Team',
          senderType: 'support',
          content: 'Thank you for your inquiry. Yes, you can make an early settlement. You may be eligible for a rebate on the remaining profit. Please visit any branch with your Emirates ID, or we can arrange a callback. Would you prefer a callback?',
          createdAt: new Date('2024-01-11'),
        },
      ],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-11'),
    },
  ]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(amount);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);

  const tabs: { id: TabId; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'products',
      label: 'My Products',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      badge: summary.upcomingPaymentsCount,
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'learn',
      label: 'Learn',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: 'support',
      label: 'Support',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      badge: summary.unreadMessages,
    },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Ahmed</h1>
            <p className="text-primary-100">Here's your financial overview</p>
          </div>
          <div className="text-right">
            <p className="text-primary-100 text-sm">Total Portfolio Value</p>
            <p className="text-3xl font-bold">{formatCurrency(summary.totalPortfolioValue)}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{summary.totalActiveProducts}</p>
              <p className="text-sm text-gray-500">Active Products</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{summary.upcomingPaymentsCount}</p>
              <p className="text-sm text-gray-500">Upcoming Payments</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">100%</p>
              <p className="text-sm text-gray-500">Sharia Compliant</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{summary.unreadMessages}</p>
              <p className="text-sm text-gray-500">New Messages</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left - Next Payment & Actions */}
        <div className="col-span-2 space-y-6">
          {/* Next Payment Card */}
          {summary.nextPaymentDate && summary.nextPaymentAmount && (
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Next Payment Due</h3>
                  <p className="text-3xl font-bold text-blue-700">
                    {formatCurrency(summary.nextPaymentAmount)}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Due on {formatDate(summary.nextPaymentDate)}
                  </p>
                </div>
                <Button onClick={() => setActiveTab('payments')}>
                  Pay Now
                </Button>
              </div>
            </Card>
          )}

          {/* Products Overview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Your Products</h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('products')}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {MOCK_CUSTOMER_PRODUCTS.slice(0, 3).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.typeLabel}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(product.principalAmount)}
                    </p>
                    <Badge variant="success" className="text-xs">Active</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Pending Actions */}
          {summary.pendingActions.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Action Required</h3>
              <div className="space-y-3">
                {summary.pendingActions.map((action) => (
                  <div
                    key={action.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      action.priority === 'urgent' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        action.priority === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{action.title}</p>
                        {action.dueDate && (
                          <p className="text-sm text-gray-500">Due {formatDate(action.dueDate)}</p>
                        )}
                      </div>
                    </div>
                    <Button size="sm">Take Action</Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right - Learn & Support */}
        <div className="space-y-6">
          {/* Learn Card */}
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-200 text-emerald-700 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900">Learn About Islamic Finance</h3>
              </div>
            </div>
            <p className="text-sm text-emerald-700 mb-4">
              Understand how your products work and why they're Sharia compliant.
            </p>
            <Button
              variant="outline"
              className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-200"
              onClick={() => setActiveTab('learn')}
            >
              Explore Resources
            </Button>
          </Card>

          {/* Support Card */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="space-y-3">
              <button
                className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                onClick={() => setShowSupportModal(true)}
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Start a Conversation</p>
                  <p className="text-xs text-gray-500">Get help from our team</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Call Us</p>
                  <p className="text-xs text-gray-500">800-ISLAMIC (475264)</p>
                </div>
              </button>
            </div>
          </Card>

          {/* Recent Tickets */}
          {tickets.length > 0 && (
            <Card className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Recent Inquiries</h4>
              <div className="space-y-2">
                {tickets.slice(0, 2).map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => setActiveTab('support')}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{ticket.subject}</p>
                      <Badge
                        variant={ticket.status === 'resolved' ? 'success' : ticket.status === 'in-progress' ? 'info' : 'warning'}
                        className="text-xs"
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Updated {formatDate(ticket.updatedAt)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">My Documents</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Home Financing Contract', type: 'Contract', date: new Date('2023-06-14'), product: 'Home Financing - Marina View' },
          { title: 'Vehicle Lease Agreement', type: 'Contract', date: new Date('2023-10-30'), product: 'Vehicle Financing - BMW X5' },
          { title: 'Sukuk Investment Terms', type: 'Terms', date: new Date('2023-08-30'), product: 'Sukuk Investment Portfolio' },
          { title: 'Annual Statement 2023', type: 'Statement', date: new Date('2024-01-05'), product: 'All Products' },
          { title: 'Fatwa Certificate - Home Financing', type: 'Certificate', date: new Date('2023-06-01'), product: 'Home Financing - Marina View' },
          { title: 'Tax Certificate 2023', type: 'Certificate', date: new Date('2024-01-10'), product: 'All Products' },
        ].map((doc, index) => (
          <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{doc.title}</h4>
                <p className="text-sm text-gray-500">{doc.product}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="default" className="text-xs">{doc.type}</Badge>
                  <span className="text-xs text-gray-400">{formatDate(doc.date)}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Support Center</h2>
        <Button onClick={() => setShowSupportModal(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Inquiry
        </Button>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                <p className="text-sm text-gray-500">
                  Opened {formatDate(ticket.createdAt)} • {ticket.category}
                </p>
              </div>
              <Badge
                variant={
                  ticket.status === 'resolved' ? 'success' :
                  ticket.status === 'in-progress' ? 'info' :
                  'warning'
                }
              >
                {ticket.status.replace('-', ' ')}
              </Badge>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {ticket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg ${
                    msg.senderType === 'customer'
                      ? 'bg-primary-50 ml-8'
                      : 'bg-gray-50 mr-8'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {msg.senderName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{msg.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t flex gap-2">
              <input
                type="text"
                placeholder="Type your reply..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <Button>Send</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-bold text-gray-900">Islamic Finance Portal</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {summary.unreadMessages > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              <Avatar name="Ahmed Al Rashid" size="sm" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'products' && <ProductOverview />}
        {activeTab === 'payments' && <PaymentSchedule />}
        {activeTab === 'documents' && renderDocuments()}
        {activeTab === 'learn' && <ShariaEducation />}
        {activeTab === 'support' && renderSupport()}
      </main>

      {/* New Support Ticket Modal */}
      <Modal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        title="New Support Inquiry"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={newTicketSubject}
              onChange={(e) => setNewTicketSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="What do you need help with?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              <option value="general">General Inquiry</option>
              <option value="payment">Payment Related</option>
              <option value="document">Document Request</option>
              <option value="sharia">Sharia Question</option>
              <option value="technical">Technical Issue</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={newTicketMessage}
              onChange={(e) => setNewTicketMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Please describe your inquiry in detail..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowSupportModal(false)}>
              Cancel
            </Button>
            <Button className="flex-1">
              Submit Inquiry
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerPortalPage;
