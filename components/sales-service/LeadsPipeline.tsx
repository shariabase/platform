// ============================================
// LEADS PIPELINE
// Sales lead management and tracking
// ============================================

import React, { useState } from 'react';
import { Button, Card, Badge, Modal, Avatar } from '../shared';
import {
  Lead,
  LeadStatus,
  LeadNote,
  CustomerType,
  getLeadStatusColor,
} from '../../types/sales';

interface LeadsPipelineProps {
  leads?: Lead[];
  onLeadSelect?: (lead: Lead) => void;
  onStatusChange?: (leadId: string, status: LeadStatus) => void;
  onAddNote?: (leadId: string, note: string) => void;
  onConvertToCustomer?: (lead: Lead) => void;
}

// Mock leads for demo
const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-1',
    customerName: 'Mohammed Al Farsi',
    customerEmail: 'mohammed.alfarsi@email.com',
    customerPhone: '+971 50 987 6543',
    customerType: 'individual',
    productInterest: ['prod-1'],
    status: 'qualified',
    source: 'website',
    assignedTo: 'user-1',
    assignedToName: 'Sara Ahmed',
    notes: [
      {
        id: 'note-1',
        leadId: 'lead-1',
        authorId: 'user-1',
        authorName: 'Sara Ahmed',
        content: 'Customer inquired about home financing. Looking for property in Dubai Marina.',
        createdAt: new Date('2024-01-10'),
      },
      {
        id: 'note-2',
        leadId: 'lead-1',
        authorId: 'user-1',
        authorName: 'Sara Ahmed',
        content: 'Follow-up call completed. Customer very interested, wants to proceed.',
        createdAt: new Date('2024-01-12'),
      },
    ],
    nextFollowUp: new Date('2024-01-15'),
    expectedValue: 1500000,
    probability: 70,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: 'lead-2',
    customerName: 'Gulf Trading Corp',
    customerEmail: 'cfo@gulftrading.ae',
    customerPhone: '+971 4 234 5678',
    customerType: 'corporate',
    productInterest: ['prod-3', 'prod-4'],
    status: 'proposal-sent',
    source: 'referral',
    assignedTo: 'user-2',
    assignedToName: 'Ali Hassan',
    notes: [
      {
        id: 'note-3',
        leadId: 'lead-2',
        authorId: 'user-2',
        authorName: 'Ali Hassan',
        content: 'Referral from existing client. Need working capital financing.',
        createdAt: new Date('2024-01-05'),
      },
    ],
    nextFollowUp: new Date('2024-01-14'),
    expectedValue: 5000000,
    probability: 50,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: 'lead-3',
    customerName: 'Fatima Al Mazroui',
    customerEmail: 'fatima.m@email.com',
    customerPhone: '+971 55 123 4567',
    customerType: 'individual',
    productInterest: ['prod-2'],
    status: 'new',
    source: 'campaign',
    assignedTo: 'user-1',
    assignedToName: 'Sara Ahmed',
    notes: [],
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
  },
  {
    id: 'lead-4',
    customerName: 'Sunrise Real Estate LLC',
    customerEmail: 'info@sunrisere.ae',
    customerPhone: '+971 4 456 7890',
    customerType: 'corporate',
    productInterest: ['prod-1'],
    status: 'negotiation',
    source: 'walk-in',
    assignedTo: 'user-2',
    assignedToName: 'Ali Hassan',
    notes: [],
    nextFollowUp: new Date('2024-01-16'),
    expectedValue: 8000000,
    probability: 80,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-13'),
  },
  {
    id: 'lead-5',
    customerName: 'Hassan Enterprises',
    customerEmail: 'finance@hassan.ae',
    customerPhone: '+971 4 321 0987',
    customerType: 'sme',
    productInterest: ['prod-3'],
    status: 'contacted',
    source: 'call-center',
    assignedTo: 'user-1',
    assignedToName: 'Sara Ahmed',
    notes: [],
    expectedValue: 500000,
    probability: 30,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-12'),
  },
];

const LEAD_STATUSES: { status: LeadStatus; label: string }[] = [
  { status: 'new', label: 'New' },
  { status: 'contacted', label: 'Contacted' },
  { status: 'qualified', label: 'Qualified' },
  { status: 'proposal-sent', label: 'Proposal Sent' },
  { status: 'negotiation', label: 'Negotiation' },
  { status: 'won', label: 'Won' },
  { status: 'lost', label: 'Lost' },
];

export const LeadsPipeline: React.FC<LeadsPipelineProps> = ({
  leads = MOCK_LEADS,
  onLeadSelect,
  onStatusChange,
  onAddNote,
  onConvertToCustomer,
}) => {
  const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState('');
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'all'>('all');

  const getLeadsByStatus = (status: LeadStatus) =>
    leads.filter(lead => lead.status === status);

  const filteredLeads = filterStatus === 'all'
    ? leads
    : leads.filter(l => l.status === filterStatus);

  const totalPipelineValue = leads
    .filter(l => l.status !== 'won' && l.status !== 'lost')
    .reduce((sum, l) => sum + (l.expectedValue || 0), 0);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(amount);

  const handleAddNote = () => {
    if (selectedLead && newNote.trim()) {
      onAddNote?.(selectedLead.id, newNote);
      setNewNote('');
    }
  };

  const LeadCard = ({ lead, compact = false }: { lead: Lead; compact?: boolean }) => (
    <div
      className={`bg-white border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow ${
        compact ? '' : 'mb-2'
      }`}
      onClick={() => {
        setSelectedLead(lead);
        onLeadSelect?.(lead);
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar name={lead.customerName} size="sm" />
          <div>
            <p className="font-medium text-gray-900 text-sm">{lead.customerName}</p>
            <p className="text-xs text-gray-500 capitalize">{lead.customerType}</p>
          </div>
        </div>
        {lead.probability && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            lead.probability >= 70 ? 'bg-green-100 text-green-700' :
            lead.probability >= 40 ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {lead.probability}%
          </span>
        )}
      </div>
      
      {lead.expectedValue && (
        <p className="text-sm font-semibold text-primary-600 mb-2">
          {formatCurrency(lead.expectedValue)}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {lead.assignedToName}
        </span>
        {lead.nextFollowUp && (
          <span className={`flex items-center gap-1 ${
            new Date(lead.nextFollowUp) < new Date() ? 'text-red-500' : ''
          }`}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(lead.nextFollowUp).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Sales Pipeline</h2>
          <p className="text-sm text-gray-500">
            {leads.length} leads • Pipeline Value: {formatCurrency(totalPipelineValue)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'pipeline' ? 'bg-white shadow' : 'text-gray-600'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'list' ? 'bg-white shadow' : 'text-gray-600'
              }`}
            >
              List
            </button>
          </div>
          <Button>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Lead
          </Button>
        </div>
      </div>

      {viewMode === 'pipeline' ? (
        /* Kanban Pipeline View */
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max pb-4">
            {LEAD_STATUSES.filter(s => s.status !== 'won' && s.status !== 'lost').map(({ status, label }) => {
              const statusLeads = getLeadsByStatus(status);
              const stageValue = statusLeads.reduce((sum, l) => sum + (l.expectedValue || 0), 0);
              
              return (
                <div key={status} className="w-72 flex-shrink-0">
                  <div className="bg-gray-100 rounded-t-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getLeadStatusColor(status) }}
                        />
                        <span className="font-medium text-gray-900">{label}</span>
                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                          {statusLeads.length}
                        </span>
                      </div>
                    </div>
                    {stageValue > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatCurrency(stageValue)}
                      </p>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-b-lg p-2 min-h-[200px]">
                    {statusLeads.map(lead => (
                      <LeadCard key={lead.id} lead={lead} />
                    ))}
                    {statusLeads.length === 0 && (
                      <p className="text-center text-sm text-gray-400 py-8">
                        No leads
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Won/Lost columns */}
            <div className="w-72 flex-shrink-0">
              <div className="bg-green-100 rounded-t-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="font-medium text-green-900">Won</span>
                  <span className="bg-green-200 text-green-700 text-xs px-2 py-0.5 rounded-full">
                    {getLeadsByStatus('won').length}
                  </span>
                </div>
              </div>
              <div className="bg-green-50 rounded-b-lg p-2 min-h-[100px]">
                {getLeadsByStatus('won').map(lead => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
              </div>
            </div>
            
            <div className="w-72 flex-shrink-0">
              <div className="bg-gray-200 rounded-t-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500" />
                  <span className="font-medium text-gray-700">Lost</span>
                  <span className="bg-gray-300 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                    {getLeadsByStatus('lost').length}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-b-lg p-2 min-h-[100px]">
                {getLeadsByStatus('lost').map(lead => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <Card className="overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Filter:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as LeadStatus | 'all')}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                {LEAD_STATUSES.map(s => (
                  <option key={s.status} value={s.status}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Follow-up</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLeads.map(lead => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={lead.customerName} size="sm" />
                      <div>
                        <p className="font-medium text-gray-900">{lead.customerName}</p>
                        <p className="text-sm text-gray-500">{lead.customerEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      style={{ backgroundColor: `${getLeadStatusColor(lead.status)}20`, color: getLeadStatusColor(lead.status) }}
                    >
                      {LEAD_STATUSES.find(s => s.status === lead.status)?.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {lead.expectedValue ? formatCurrency(lead.expectedValue) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {lead.assignedToName}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {lead.nextFollowUp ? (
                      <span className={new Date(lead.nextFollowUp) < new Date() ? 'text-red-600' : 'text-gray-600'}>
                        {new Date(lead.nextFollowUp).toLocaleDateString()}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Lead Detail Modal */}
      <Modal
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title="Lead Details"
        size="lg"
      >
        {selectedLead && (
          <div className="space-y-6">
            {/* Lead Info */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar name={selectedLead.customerName} size="lg" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedLead.customerName}
                  </h3>
                  <p className="text-gray-500 capitalize">{selectedLead.customerType}</p>
                </div>
              </div>
              <Badge
                style={{ backgroundColor: `${getLeadStatusColor(selectedLead.status)}20`, color: getLeadStatusColor(selectedLead.status) }}
              >
                {LEAD_STATUSES.find(s => s.status === selectedLead.status)?.label}
              </Badge>
            </div>

            {/* Contact & Value */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedLead.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{selectedLead.customerPhone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expected Value</p>
                <p className="font-semibold text-primary-600">
                  {selectedLead.expectedValue ? formatCurrency(selectedLead.expectedValue) : 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Probability</p>
                <p className="font-medium">{selectedLead.probability || 0}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Source</p>
                <p className="font-medium capitalize">{selectedLead.source.replace('-', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Assigned To</p>
                <p className="font-medium">{selectedLead.assignedToName}</p>
              </div>
            </div>

            {/* Status Change */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {LEAD_STATUSES.map(({ status, label }) => (
                  <button
                    key={status}
                    onClick={() => onStatusChange?.(selectedLead.id, status)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      selectedLead.status === status
                        ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
              <div className="space-y-3 max-h-48 overflow-y-auto mb-3">
                {selectedLead.notes.length > 0 ? (
                  selectedLead.notes.map(note => (
                    <div key={note.id} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{note.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {note.authorName} • {note.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No notes yet</p>
                )}
              </div>
              <div className="flex gap-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  rows={2}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                />
                <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                  Add
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedLead(null)}>
                Close
              </Button>
              {selectedLead.status !== 'won' && selectedLead.status !== 'lost' && (
                <Button
                  variant="success"
                  className="flex-1"
                  onClick={() => {
                    onConvertToCustomer?.(selectedLead);
                    setSelectedLead(null);
                  }}
                >
                  Convert to Customer
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LeadsPipeline;
