// ============================================
// AUDIT LOG VIEWER
// Immutable audit trail for regulators
// ============================================

import React, { useState } from 'react';
import { Card, Badge, Button, Modal } from '../shared';
import { AuditLog, UserRole } from '../../types';

interface AuditLogViewerProps {
  logs?: AuditLog[];
  productId?: string;
  showFilters?: boolean;
}

// Mock audit logs
const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: new Date('2024-01-15T10:30:00'),
    userId: 'user-1',
    userName: 'Ahmed Hassan',
    action: 'PRODUCT_CREATED',
    entityType: 'product',
    entityId: 'prod-1',
    details: {
      productName: 'Home Murabaha Financing',
      assetType: 'murabaha',
      jurisdiction: 'UAE',
    },
    ipAddress: '192.168.1.100',
    hash: 'abc123def456789',
  },
  {
    id: 'log-2',
    timestamp: new Date('2024-01-15T11:00:00'),
    userId: 'user-2',
    userName: 'Dr. Mohammed Al Rashid',
    action: 'DOCUMENT_UPLOADED',
    entityType: 'document',
    entityId: 'doc-1',
    details: {
      documentType: 'fatwa',
      documentTitle: 'Fatwa - Home Murabaha Structure',
      fileHash: 'sha256:789abc123def',
    },
    ipAddress: '192.168.1.101',
    hash: 'def456abc789012',
    previousHash: 'abc123def456789',
  },
  {
    id: 'log-3',
    timestamp: new Date('2024-01-15T14:00:00'),
    userId: 'user-3',
    userName: 'Sarah Al Noor',
    action: 'SHARIA_REVIEW_STARTED',
    entityType: 'workflow',
    entityId: 'wf-1',
    details: {
      productId: 'prod-1',
      stage: 'sharia-review',
    },
    ipAddress: '192.168.1.102',
    hash: 'ghi789jkl012345',
    previousHash: 'def456abc789012',
  },
  {
    id: 'log-4',
    timestamp: new Date('2024-01-16T09:00:00'),
    userId: 'user-2',
    userName: 'Dr. Mohammed Al Rashid',
    action: 'SHARIA_APPROVAL_GRANTED',
    entityType: 'workflow',
    entityId: 'wf-1',
    details: {
      productId: 'prod-1',
      decision: 'approved',
      comments: 'Structure complies with AAOIFI standards',
      signature: 'digital-sig-abc123',
    },
    ipAddress: '192.168.1.101',
    hash: 'jkl012mno345678',
    previousHash: 'ghi789jkl012345',
  },
  {
    id: 'log-5',
    timestamp: new Date('2024-01-16T10:30:00'),
    userId: 'user-4',
    userName: 'Legal Team',
    action: 'LEGAL_REVIEW_STARTED',
    entityType: 'workflow',
    entityId: 'wf-1',
    details: {
      productId: 'prod-1',
      stage: 'legal-review',
    },
    ipAddress: '192.168.1.103',
    hash: 'mno345pqr678901',
    previousHash: 'jkl012mno345678',
  },
  {
    id: 'log-6',
    timestamp: new Date('2024-01-17T11:00:00'),
    userId: 'user-4',
    userName: 'Legal Team',
    action: 'COMPLIANCE_CHECK_COMPLETED',
    entityType: 'compliance',
    entityId: 'comp-1',
    details: {
      productId: 'prod-1',
      standard: 'AAOIFI',
      result: 'compliant',
      checksCompleted: 15,
      checksPassed: 15,
    },
    ipAddress: '192.168.1.103',
    hash: 'pqr678stu901234',
    previousHash: 'mno345pqr678901',
  },
  {
    id: 'log-7',
    timestamp: new Date('2024-01-17T14:00:00'),
    userId: 'user-5',
    userName: 'Risk Officer',
    action: 'RISK_ASSESSMENT_COMPLETED',
    entityType: 'product',
    entityId: 'prod-1',
    details: {
      overallRisk: 'low',
      categories: {
        'sharia-compliance': 'low',
        credit: 'medium',
        market: 'low',
        operational: 'low',
      },
    },
    ipAddress: '192.168.1.104',
    hash: 'stu901vwx234567',
    previousHash: 'pqr678stu901234',
  },
  {
    id: 'log-8',
    timestamp: new Date('2024-01-18T09:00:00'),
    userId: 'user-1',
    userName: 'Ahmed Hassan',
    action: 'PRODUCT_DEPLOYED',
    entityType: 'product',
    entityId: 'prod-1',
    details: {
      status: 'deployed',
      contractAddress: '0x1234...5678',
      network: 'mainnet',
    },
    ipAddress: '192.168.1.100',
    hash: 'vwx234yza567890',
    previousHash: 'stu901vwx234567',
  },
];

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  'PRODUCT_CREATED': { label: 'Product Created', color: 'bg-blue-100 text-blue-700' },
  'PRODUCT_UPDATED': { label: 'Product Updated', color: 'bg-blue-100 text-blue-700' },
  'PRODUCT_DEPLOYED': { label: 'Product Deployed', color: 'bg-green-100 text-green-700' },
  'DOCUMENT_UPLOADED': { label: 'Document Uploaded', color: 'bg-purple-100 text-purple-700' },
  'DOCUMENT_UPDATED': { label: 'Document Updated', color: 'bg-purple-100 text-purple-700' },
  'SHARIA_REVIEW_STARTED': { label: 'Sharia Review Started', color: 'bg-yellow-100 text-yellow-700' },
  'SHARIA_APPROVAL_GRANTED': { label: 'Sharia Approved', color: 'bg-green-100 text-green-700' },
  'SHARIA_APPROVAL_REJECTED': { label: 'Sharia Rejected', color: 'bg-red-100 text-red-700' },
  'LEGAL_REVIEW_STARTED': { label: 'Legal Review Started', color: 'bg-yellow-100 text-yellow-700' },
  'LEGAL_APPROVAL_GRANTED': { label: 'Legal Approved', color: 'bg-green-100 text-green-700' },
  'COMPLIANCE_CHECK_COMPLETED': { label: 'Compliance Verified', color: 'bg-emerald-100 text-emerald-700' },
  'RISK_ASSESSMENT_COMPLETED': { label: 'Risk Assessed', color: 'bg-orange-100 text-orange-700' },
};

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  logs = MOCK_AUDIT_LOGS,
  productId,
  showFilters = true,
}) => {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterEntity, setFilterEntity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs
    .filter(log => !productId || log.details?.productId === productId || log.entityId === productId)
    .filter(log => filterAction === 'all' || log.action === filterAction)
    .filter(log => filterEntity === 'all' || log.entityType === filterEntity)
    .filter(log => 
      !searchTerm || 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const uniqueActions = [...new Set(logs.map(l => l.action))];
  const uniqueEntities = [...new Set(logs.map(l => l.entityType))];

  const formatTimestamp = (date: Date) =>
    date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  const verifyChain = () => {
    let isValid = true;
    for (let i = 1; i < filteredLogs.length; i++) {
      const currentLog = filteredLogs[i - 1];
      const previousLog = filteredLogs[i];
      if (currentLog.previousHash !== previousLog.hash) {
        isValid = false;
        break;
      }
    }
    return isValid;
  };

  const chainValid = verifyChain();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Audit Log</h2>
          <p className="text-sm text-gray-500">
            {filteredLogs.length} entries • Immutable chain {chainValid ? '✓ Verified' : '✗ Invalid'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={chainValid ? 'success' : 'danger'}>
            {chainValid ? 'Chain Integrity Verified' : 'Chain Integrity Failed'}
          </Badge>
          <Button variant="outline" size="sm">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Log
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search logs..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Actions</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action}>
                    {ACTION_LABELS[action]?.label || action}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
              <select
                value={filterEntity}
                onChange={(e) => setFilterEntity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Entities</option>
                {uniqueEntities.map(entity => (
                  <option key={entity} value={entity}>{entity}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500">
                <option>All Time</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Audit Log Table */}
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hash</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Chain</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredLogs.map((log, index) => {
              const actionInfo = ACTION_LABELS[log.action] || { label: log.action, color: 'bg-gray-100 text-gray-700' };
              const previousLog = filteredLogs[index + 1];
              const chainValid = !previousLog || log.previousHash === previousLog.hash;

              return (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${actionInfo.color}`}>
                      {actionInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {log.userName}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600 capitalize">{log.entityType}</span>
                    <p className="text-xs text-gray-400 font-mono">{log.entityId}</p>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {log.hash.slice(0, 12)}...
                    </code>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {index === filteredLogs.length - 1 ? (
                      <span className="text-gray-400">—</span>
                    ) : chainValid ? (
                      <svg className="w-5 h-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Log Detail Modal */}
      <Modal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="Audit Log Entry"
        size="lg"
      >
        {selectedLog && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Timestamp</p>
                <p className="font-medium">{formatTimestamp(selectedLog.timestamp)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Action</p>
                <p className="font-medium">{ACTION_LABELS[selectedLog.action]?.label || selectedLog.action}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">User</p>
                <p className="font-medium">{selectedLog.userName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">IP Address</p>
                <p className="font-mono text-sm">{selectedLog.ipAddress || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Entity Type</p>
                <p className="font-medium capitalize">{selectedLog.entityType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Entity ID</p>
                <p className="font-mono text-sm">{selectedLog.entityId}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Hash Chain</p>
              <div className="bg-gray-50 p-3 rounded-lg font-mono text-xs space-y-2">
                <div>
                  <span className="text-gray-500">Current Hash: </span>
                  <span className="text-gray-900">{selectedLog.hash}</span>
                </div>
                {selectedLog.previousHash && (
                  <div>
                    <span className="text-gray-500">Previous Hash: </span>
                    <span className="text-gray-900">{selectedLog.previousHash}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Details</p>
              <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-auto max-h-48">
                {JSON.stringify(selectedLog.details, null, 2)}
              </pre>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedLog(null)}>
                Close
              </Button>
              <Button variant="outline" className="flex-1">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Raw
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AuditLogViewer;
