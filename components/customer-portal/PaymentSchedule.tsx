// ============================================
// PAYMENT SCHEDULE & HISTORY
// Customer payment tracking
// ============================================

import React, { useState } from 'react';
import { Card, Badge, Button, Modal } from '../shared';
import { CustomerPayment, CustomerTransaction } from '../../types/customer';

interface PaymentScheduleProps {
  productId?: string;
  payments?: CustomerPayment[];
  transactions?: CustomerTransaction[];
  onMakePayment?: (payment: CustomerPayment) => void;
}

// Mock payments
const MOCK_PAYMENTS: CustomerPayment[] = [
  { id: 'pay-1', productId: 'cp-1', type: 'profit', amount: 9375, currency: 'AED', dueDate: new Date('2024-02-01'), status: 'upcoming' },
  { id: 'pay-2', productId: 'cp-1', type: 'profit', amount: 9375, currency: 'AED', dueDate: new Date('2024-01-01'), paidDate: new Date('2023-12-30'), status: 'paid', reference: 'PAY-2024-001' },
  { id: 'pay-3', productId: 'cp-1', type: 'profit', amount: 9375, currency: 'AED', dueDate: new Date('2023-12-01'), paidDate: new Date('2023-11-28'), status: 'paid', reference: 'PAY-2023-012' },
  { id: 'pay-4', productId: 'cp-1', type: 'profit', amount: 9375, currency: 'AED', dueDate: new Date('2023-11-01'), paidDate: new Date('2023-10-30'), status: 'paid', reference: 'PAY-2023-011' },
  { id: 'pay-5', productId: 'cp-3', type: 'profit', amount: 7000, currency: 'AED', dueDate: new Date('2024-02-01'), status: 'upcoming' },
  { id: 'pay-6', productId: 'cp-3', type: 'profit', amount: 7000, currency: 'AED', dueDate: new Date('2024-01-01'), paidDate: new Date('2023-12-29'), status: 'paid', reference: 'PAY-2024-002' },
];

const MOCK_TRANSACTIONS: CustomerTransaction[] = [
  { id: 'txn-1', productId: 'cp-1', type: 'disbursement', amount: 1500000, currency: 'AED', description: 'Initial Disbursement', date: new Date('2023-06-15'), balance: 1500000 },
  { id: 'txn-2', productId: 'cp-1', type: 'payment', amount: -9375, currency: 'AED', description: 'Monthly Payment - Jul 2023', date: new Date('2023-07-01'), balance: 1490625 },
  { id: 'txn-3', productId: 'cp-1', type: 'payment', amount: -9375, currency: 'AED', description: 'Monthly Payment - Aug 2023', date: new Date('2023-08-01'), balance: 1481250 },
];

export const PaymentSchedule: React.FC<PaymentScheduleProps> = ({
  productId,
  payments = MOCK_PAYMENTS,
  transactions = MOCK_TRANSACTIONS,
  onMakePayment,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'transactions'>('upcoming');
  const [selectedPayment, setSelectedPayment] = useState<CustomerPayment | null>(null);

  const filteredPayments = productId
    ? payments.filter(p => p.productId === productId)
    : payments;

  const upcomingPayments = filteredPayments.filter(p => p.status === 'upcoming' || p.status === 'overdue');
  const paidPayments = filteredPayments.filter(p => p.status === 'paid');

  const filteredTransactions = productId
    ? transactions.filter(t => t.productId === productId)
    : transactions;

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat('en-AE', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Math.abs(amount));

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);

  const totalUpcoming = upcomingPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <p className="text-blue-100 text-sm">Next Payment</p>
          <p className="text-2xl font-bold">
            {upcomingPayments[0] ? formatCurrency(upcomingPayments[0].amount, upcomingPayments[0].currency) : 'None'}
          </p>
          {upcomingPayments[0] && (
            <p className="text-blue-100 text-xs mt-1">
              Due {formatDate(upcomingPayments[0].dueDate)}
            </p>
          )}
        </Card>
        <Card className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <p className="text-emerald-100 text-sm">Total Upcoming</p>
          <p className="text-2xl font-bold">
            {formatCurrency(totalUpcoming, 'AED')}
          </p>
          <p className="text-emerald-100 text-xs mt-1">
            {upcomingPayments.length} payments
          </p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-gray-500 to-gray-600 text-white">
          <p className="text-gray-100 text-sm">Total Paid (YTD)</p>
          <p className="text-2xl font-bold">
            {formatCurrency(paidPayments.reduce((sum, p) => sum + p.amount, 0), 'AED')}
          </p>
          <p className="text-gray-100 text-xs mt-1">
            {paidPayments.length} payments
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex gap-4">
          {([
            { id: 'upcoming', label: 'Upcoming', count: upcomingPayments.length },
            { id: 'history', label: 'Payment History', count: paidPayments.length },
            { id: 'transactions', label: 'Transactions', count: filteredTransactions.length },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'upcoming' && (
        <div className="space-y-3">
          {upcomingPayments.length > 0 ? (
            upcomingPayments.map((payment) => (
              <Card key={payment.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      payment.status === 'overdue' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 capitalize">
                        {payment.type} Payment
                      </p>
                      <p className="text-sm text-gray-500">
                        Due {formatDate(payment.dueDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(payment.amount, payment.currency)}
                      </p>
                      <Badge variant={payment.status === 'overdue' ? 'danger' : 'info'}>
                        {payment.status === 'overdue' ? 'Overdue' : 'Upcoming'}
                      </Badge>
                    </div>
                    <Button onClick={() => {
                      setSelectedPayment(payment);
                      onMakePayment?.(payment);
                    }}>
                      Pay Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500">No upcoming payments</p>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paidPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {payment.paidDate ? formatDate(payment.paidDate) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                    {payment.type}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-500">
                    {payment.reference || '-'}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    {formatCurrency(payment.amount, payment.currency)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="success">Paid</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {activeTab === 'transactions' && (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(txn.date)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {txn.description}
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${
                    txn.amount < 0 ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {txn.amount < 0 ? '-' : '+'}{formatCurrency(txn.amount, txn.currency)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {formatCurrency(txn.balance, txn.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Payment Modal */}
      <Modal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        title="Make Payment"
        size="md"
      >
        {selectedPayment && (
          <div className="space-y-6">
            <div className="text-center p-6 bg-primary-50 rounded-lg">
              <p className="text-sm text-primary-600 mb-2">Amount Due</p>
              <p className="text-4xl font-bold text-primary-700">
                {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
              </p>
              <p className="text-sm text-primary-600 mt-2">
                Due Date: {formatDate(selectedPayment.dueDate)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                <option>Bank Account - XXXX1234</option>
                <option>Credit Card - XXXX5678</option>
                <option>Apple Pay</option>
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Payment Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Principal</span>
                  <span>{formatCurrency(selectedPayment.amount * 0.6, selectedPayment.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Profit</span>
                  <span>{formatCurrency(selectedPayment.amount * 0.4, selectedPayment.currency)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(selectedPayment.amount, selectedPayment.currency)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedPayment(null)}>
                Cancel
              </Button>
              <Button className="flex-1">
                Confirm Payment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PaymentSchedule;
