// ============================================
// PRODUCT OVERVIEW
// Customer view of their active products
// ============================================

import React, { useState } from 'react';
import { Card, Badge, Button, Modal } from '../shared';
import {
  CustomerProduct,
  CustomerProductStatus,
  getProductStatusLabel,
  getProductStatusColor,
  getAssetTypeDescription,
} from '../../types/customer';

interface ProductOverviewProps {
  products?: CustomerProduct[];
  onViewDetails?: (product: CustomerProduct) => void;
  onMakePayment?: (product: CustomerProduct) => void;
}

// Mock customer products
export const MOCK_CUSTOMER_PRODUCTS: CustomerProduct[] = [
  {
    id: 'cp-1',
    name: 'Home Financing - Marina View',
    type: 'murabaha',
    typeLabel: 'Murabaha Home Financing',
    status: 'active',
    jurisdiction: 'UAE',
    principalAmount: 1500000,
    currency: 'AED',
    profitRate: 4.5,
    tenor: 240,
    startDate: new Date('2023-06-15'),
    maturityDate: new Date('2043-06-15'),
    shariaStructure: 'The bank purchased the property and sold it to you at a disclosed profit margin. Your monthly payments include both the cost and the agreed profit.',
    shariaApprovalDate: new Date('2023-06-01'),
    fatwaReference: 'FSB-2023-HM-001',
    totalPaid: 180000,
    remainingBalance: 1620000,
    nextPaymentAmount: 9375,
    nextPaymentDate: new Date('2024-02-01'),
    contractSigned: true,
    contractSignedAt: new Date('2023-06-14'),
  },
  {
    id: 'cp-2',
    name: 'Sukuk Investment Portfolio',
    type: 'sukuk',
    typeLabel: 'Sukuk Investment',
    status: 'active',
    jurisdiction: 'UAE',
    principalAmount: 100000,
    currency: 'AED',
    profitRate: 5.2,
    tenor: 36,
    startDate: new Date('2023-09-01'),
    maturityDate: new Date('2026-09-01'),
    shariaStructure: 'Your investment represents ownership in real assets generating halal returns. Profits are distributed from actual asset performance, not interest.',
    shariaApprovalDate: new Date('2023-08-15'),
    fatwaReference: 'FSB-2023-SK-042',
    totalPaid: 0,
    remainingBalance: 100000,
    contractSigned: true,
    contractSignedAt: new Date('2023-08-30'),
  },
  {
    id: 'cp-3',
    name: 'Vehicle Financing - BMW X5',
    type: 'ijara',
    typeLabel: 'Ijara Vehicle Lease',
    status: 'active',
    jurisdiction: 'UAE',
    principalAmount: 350000,
    currency: 'AED',
    profitRate: 3.8,
    tenor: 60,
    startDate: new Date('2023-11-01'),
    maturityDate: new Date('2028-11-01'),
    shariaStructure: 'The bank owns the vehicle and leases it to you. At the end of the lease, ownership transfers to you through a separate gift contract.',
    shariaApprovalDate: new Date('2023-10-20'),
    fatwaReference: 'FSB-2023-IJ-088',
    totalPaid: 17500,
    remainingBalance: 332500,
    nextPaymentAmount: 7000,
    nextPaymentDate: new Date('2024-02-01'),
    contractSigned: true,
    contractSignedAt: new Date('2023-10-30'),
  },
];

export const ProductOverview: React.FC<ProductOverviewProps> = ({
  products = MOCK_CUSTOMER_PRODUCTS,
  onViewDetails,
  onMakePayment,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<CustomerProduct | null>(null);

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat('en-AE', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);

  const getProgressPercent = (product: CustomerProduct) => {
    if (!product.totalPaid) return 0;
    return Math.round((product.totalPaid / (product.principalAmount + (product.principalAmount * (product.profitRate || 0) / 100 * (product.tenor / 12)))) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">My Products</h2>
        <span className="text-sm text-gray-500">{products.length} active products</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Status Header */}
            <div className={`px-4 py-2 ${
              product.status === 'active' ? 'bg-green-500' :
              product.status === 'pending-approval' ? 'bg-yellow-500' :
              'bg-gray-500'
            } text-white`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{product.typeLabel}</span>
                <Badge
                  className="bg-white/20 text-white border-0"
                >
                  {getProductStatusLabel(product.status)}
                </Badge>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
              
              {/* Principal & Rate */}
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(product.principalAmount, product.currency)}
                </span>
                {product.profitRate && (
                  <span className="text-sm text-gray-500">
                    {product.profitRate}% profit rate
                  </span>
                )}
              </div>

              {/* Progress (for financing products) */}
              {product.totalPaid !== undefined && product.remainingBalance !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Paid: {formatCurrency(product.totalPaid, product.currency)}</span>
                    <span>{getProgressPercent(product)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${getProgressPercent(product)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Next Payment */}
              {product.nextPaymentDate && product.nextPaymentAmount && (
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-600 mb-1">Next Payment</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-900">
                      {formatCurrency(product.nextPaymentAmount, product.currency)}
                    </span>
                    <span className="text-sm text-blue-700">
                      {formatDate(product.nextPaymentDate)}
                    </span>
                  </div>
                </div>
              )}

              {/* Sharia Compliance Badge */}
              <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg mb-4">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm text-emerald-700">Sharia Compliant</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedProduct(product)}
                >
                  View Details
                </Button>
                {product.nextPaymentAmount && (
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => onMakePayment?.(product)}
                  >
                    Pay Now
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Product Detail Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name || ''}
        size="lg"
      >
        {selectedProduct && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">{selectedProduct.typeLabel}</p>
                <p className="text-2xl font-bold text-primary-600">
                  {formatCurrency(selectedProduct.principalAmount, selectedProduct.currency)}
                </p>
              </div>
              <Badge
                style={{
                  backgroundColor: `${getProductStatusColor(selectedProduct.status)}20`,
                  color: getProductStatusColor(selectedProduct.status),
                }}
              >
                {getProductStatusLabel(selectedProduct.status)}
              </Badge>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Profit Rate</p>
                <p className="font-semibold">{selectedProduct.profitRate}% per annum</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tenor</p>
                <p className="font-semibold">{selectedProduct.tenor} months</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-semibold">{formatDate(selectedProduct.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Maturity Date</p>
                <p className="font-semibold">{formatDate(selectedProduct.maturityDate)}</p>
              </div>
              {selectedProduct.remainingBalance !== undefined && (
                <div>
                  <p className="text-sm text-gray-500">Remaining Balance</p>
                  <p className="font-semibold">
                    {formatCurrency(selectedProduct.remainingBalance, selectedProduct.currency)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Jurisdiction</p>
                <p className="font-semibold">{selectedProduct.jurisdiction}</p>
              </div>
            </div>

            {/* Sharia Information */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h4 className="font-semibold text-emerald-900">Sharia Compliance</h4>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">How This Product Works</p>
                  <p className="text-gray-700">{selectedProduct.shariaStructure}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">What is {selectedProduct.type.charAt(0).toUpperCase() + selectedProduct.type.slice(1)}?</p>
                  <p className="text-gray-700">{getAssetTypeDescription(selectedProduct.type)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Fatwa Reference</p>
                    <p className="font-mono text-sm">{selectedProduct.fatwaReference}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sharia Approval Date</p>
                    <p className="text-sm">{formatDate(selectedProduct.shariaApprovalDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedProduct.contractSigned ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {selectedProduct.contractSigned ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedProduct.contractSigned ? 'Contract Signed' : 'Contract Pending'}
                  </p>
                  {selectedProduct.contractSignedAt && (
                    <p className="text-sm text-gray-500">
                      Signed on {formatDate(selectedProduct.contractSignedAt)}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Contract
              </Button>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedProduct(null)}>
                Close
              </Button>
              <Button variant="outline" className="flex-1">
                Download Statement
              </Button>
              {selectedProduct.nextPaymentAmount && (
                <Button className="flex-1" onClick={() => onMakePayment?.(selectedProduct)}>
                  Make Payment
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductOverview;
