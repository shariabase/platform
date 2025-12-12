import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Badge, Button, Avatar } from '../shared';

interface Transaction {
  id: string;
  productId: string;
  productName: string;
  type: 'disbursement' | 'repayment' | 'profit-distribution' | 'fee';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'flagged' | 'reversed';
  flagReason?: string;
  timestamp: Date;
  parties: { name: string; role: string }[];
}

interface TransactionMonitorProps {
  transactions: Transaction[];
  onFlag: (transactionId: string, reason: string) => void;
  onClearFlag: (transactionId: string) => void;
  onViewDetails: (transaction: Transaction) => void;
}

/**
 * TransactionMonitor - Risk Management Component
 * 
 * Purpose: Monitor transactions and flag non-compliant ones
 * Location: /components/risk-audit/
 * Used by: RiskAuditPage
 */
export const TransactionMonitor: React.FC<TransactionMonitorProps> = ({
  transactions,
  onFlag,
  onClearFlag,
  onViewDetails,
}) => {
  const [filter, setFilter] = useState<'all' | 'flagged' | 'pending'>('all');
  const [showFlagModal, setShowFlagModal] = useState<string | null>(null);
  const [flagReason, setFlagReason] = useState('');

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'flagged') return t.status === 'flagged';
    if (filter === 'pending') return t.status === 'pending';
    return true;
  });

  const flaggedCount = transactions.filter((t) => t.status === 'flagged').length;

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'disbursement':
        return '💸';
      case 'repayment':
        return '💰';
      case 'profit-distribution':
        return '📈';
      case 'fee':
        return '🏷️';
      default:
        return '💳';
    }
  };

  const handleFlag = () => {
    if (showFlagModal && flagReason) {
      onFlag(showFlagModal, flagReason);
      setShowFlagModal(null);
      setFlagReason('');
    }
  };

  return (
    <Card>
      <CardHeader
        action={
          flaggedCount > 0 && (
            <Badge variant="danger" size="sm">
              {flaggedCount} Flagged
            </Badge>
          )
        }
      >
        Transaction Monitor
      </CardHeader>
      <CardBody>
        {/* Filters */}
        <div className="flex space-x-2 mb-4">
          {(['all', 'flagged', 'pending'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                filter === f
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f}
              {f === 'flagged' && flaggedCount > 0 && ` (${flaggedCount})`}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No transactions to display</p>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`p-4 border rounded-lg ${
                  transaction.status === 'flagged'
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getTypeIcon(transaction.type)}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">
                          {formatAmount(transaction.amount, transaction.currency)}
                        </p>
                        <Badge
                          variant={
                            transaction.status === 'flagged'
                              ? 'danger'
                              : transaction.status === 'completed'
                              ? 'success'
                              : transaction.status === 'pending'
                              ? 'warning'
                              : 'default'
                          }
                          size="sm"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 capitalize">
                        {transaction.type.replace('-', ' ')} • {transaction.productName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(transaction.timestamp)}
                      </p>

                      {/* Flag Reason */}
                      {transaction.flagReason && (
                        <div className="mt-2 p-2 bg-red-100 rounded text-sm text-red-700">
                          <span className="font-medium">Flag reason:</span> {transaction.flagReason}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    {transaction.status === 'flagged' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onClearFlag(transaction.id)}
                      >
                        Clear Flag
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowFlagModal(transaction.id)}
                      >
                        🚩 Flag
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onViewDetails(transaction)}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Flag Modal */}
        {showFlagModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Flag Transaction</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for flagging
                </label>
                <select
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
                >
                  <option value="">Select a reason...</option>
                  <option value="Potential riba (interest) element">Potential riba element</option>
                  <option value="Gharar (excessive uncertainty)">Gharar detected</option>
                  <option value="Non-compliant profit calculation">Non-compliant calculation</option>
                  <option value="Missing documentation">Missing documentation</option>
                  <option value="Unusual transaction pattern">Unusual pattern</option>
                  <option value="Other compliance concern">Other concern</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => setShowFlagModal(null)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleFlag} disabled={!flagReason}>
                  Flag Transaction
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default TransactionMonitor;
