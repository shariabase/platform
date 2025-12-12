// ============================================
// COMPLIANCE REPORT VIEWER
// Read-only compliance reports for regulators
// ============================================

import React, { useState } from 'react';
import { Card, Badge, Button, Modal } from '../shared';
import { ComplianceCheck, ComplianceStandard, Product, ProductStatus } from '../../types';

interface ComplianceReportViewerProps {
  productId?: string;
}

// Mock compliance data
const MOCK_PRODUCTS_COMPLIANCE: Array<{
  product: Partial<Product>;
  compliance: ComplianceCheck[];
  score: number;
  status: 'compliant' | 'non-compliant' | 'under-review';
}> = [
  {
    product: {
      id: 'prod-1',
      name: 'Home Murabaha Financing',
      assetType: 'murabaha',
      jurisdiction: 'UAE',
      status: 'active',
    },
    compliance: [
      { id: 'c1', productId: 'prod-1', standard: 'AAOIFI', rule: 'FAS 2 - Murabaha', status: 'compliant', checkedBy: 'user-1', checkedAt: new Date('2024-01-15') },
      { id: 'c2', productId: 'prod-1', standard: 'AAOIFI', rule: 'FAS 4 - Musharaka', status: 'not-applicable', checkedBy: 'user-1', checkedAt: new Date('2024-01-15') },
      { id: 'c3', productId: 'prod-1', standard: 'IFSB', rule: 'IFSB-1 Risk Management', status: 'compliant', checkedBy: 'user-2', checkedAt: new Date('2024-01-16') },
      { id: 'c4', productId: 'prod-1', standard: 'Central Bank', rule: 'CBUAE Circular 2023-01', status: 'compliant', checkedBy: 'user-2', checkedAt: new Date('2024-01-16') },
    ],
    score: 100,
    status: 'compliant',
  },
  {
    product: {
      id: 'prod-2',
      name: 'Sukuk Investment Fund',
      assetType: 'sukuk',
      jurisdiction: 'UAE',
      status: 'active',
    },
    compliance: [
      { id: 'c5', productId: 'prod-2', standard: 'AAOIFI', rule: 'FAS 17 - Investment Sukuk', status: 'compliant', checkedBy: 'user-1', checkedAt: new Date('2024-01-10') },
      { id: 'c6', productId: 'prod-2', standard: 'IFSB', rule: 'IFSB-7 Capital Adequacy', status: 'compliant', checkedBy: 'user-2', checkedAt: new Date('2024-01-11') },
      { id: 'c7', productId: 'prod-2', standard: 'Central Bank', rule: 'Securities Regulation', status: 'compliant', checkedBy: 'user-2', checkedAt: new Date('2024-01-11') },
    ],
    score: 100,
    status: 'compliant',
  },
  {
    product: {
      id: 'prod-3',
      name: 'Working Capital Murabaha',
      assetType: 'murabaha',
      jurisdiction: 'UAE',
      status: 'pending-legal-review',
    },
    compliance: [
      { id: 'c8', productId: 'prod-3', standard: 'AAOIFI', rule: 'FAS 2 - Murabaha', status: 'pending-review', checkedBy: 'user-1', checkedAt: new Date('2024-01-18') },
      { id: 'c9', productId: 'prod-3', standard: 'IFSB', rule: 'IFSB-1 Risk Management', status: 'pending-review', checkedBy: 'user-2', checkedAt: new Date('2024-01-18') },
    ],
    score: 0,
    status: 'under-review',
  },
];

export const ComplianceReportViewer: React.FC<ComplianceReportViewerProps> = ({
  productId,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<typeof MOCK_PRODUCTS_COMPLIANCE[0] | null>(null);
  const [filterStandard, setFilterStandard] = useState<ComplianceStandard | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const data = productId
    ? MOCK_PRODUCTS_COMPLIANCE.filter(p => p.product.id === productId)
    : MOCK_PRODUCTS_COMPLIANCE;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-700';
      case 'non-compliant': return 'bg-red-100 text-red-700';
      case 'under-review': return 'bg-yellow-100 text-yellow-700';
      case 'pending-review': return 'bg-yellow-100 text-yellow-700';
      case 'not-applicable': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCheckStatusIcon = (status: ComplianceCheck['status']) => {
    switch (status) {
      case 'compliant':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'non-compliant':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'pending-review':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'not-applicable':
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        );
    }
  };

  // Summary stats
  const totalProducts = data.length;
  const compliantProducts = data.filter(d => d.status === 'compliant').length;
  const underReviewProducts = data.filter(d => d.status === 'under-review').length;
  const nonCompliantProducts = data.filter(d => d.status === 'non-compliant').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <p className="text-blue-100 text-sm">Total Products</p>
          <p className="text-3xl font-bold">{totalProducts}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <p className="text-green-100 text-sm">Compliant</p>
          <p className="text-3xl font-bold">{compliantProducts}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <p className="text-yellow-100 text-sm">Under Review</p>
          <p className="text-3xl font-bold">{underReviewProducts}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white">
          <p className="text-red-100 text-sm">Non-Compliant</p>
          <p className="text-3xl font-bold">{nonCompliantProducts}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Standard</label>
            <select
              value={filterStandard}
              onChange={(e) => setFilterStandard(e.target.value as ComplianceStandard | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Standards</option>
              <option value="AAOIFI">AAOIFI</option>
              <option value="IFSB">IFSB</option>
              <option value="Central Bank">Central Bank</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="compliant">Compliant</option>
              <option value="under-review">Under Review</option>
              <option value="non-compliant">Non-Compliant</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
            <Button variant="outline" className="w-full">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Report
            </Button>
          </div>
        </div>
      </Card>

      {/* Products List */}
      <div className="space-y-4">
        {data
          .filter(d => filterStatus === 'all' || d.status === filterStatus)
          .map((item) => (
            <Card key={item.product.id} className="overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500 capitalize">{item.product.assetType}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{item.product.jurisdiction}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Compliance Score</p>
                      <p className="text-2xl font-bold text-gray-900">{item.score}%</p>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status === 'compliant' ? 'Compliant' :
                       item.status === 'under-review' ? 'Under Review' : 'Non-Compliant'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 uppercase">
                      <th className="pb-2">Standard</th>
                      <th className="pb-2">Rule/Requirement</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Checked By</th>
                      <th className="pb-2">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {item.compliance
                      .filter(c => filterStandard === 'all' || c.standard === filterStandard)
                      .map((check) => (
                        <tr key={check.id}>
                          <td className="py-2">
                            <Badge variant="info" className="text-xs">{check.standard}</Badge>
                          </td>
                          <td className="py-2 text-sm text-gray-700">{check.rule}</td>
                          <td className="py-2">
                            <div className="flex items-center gap-2">
                              {getCheckStatusIcon(check.status)}
                              <span className={`text-sm ${
                                check.status === 'compliant' ? 'text-green-600' :
                                check.status === 'non-compliant' ? 'text-red-600' :
                                check.status === 'pending-review' ? 'text-yellow-600' :
                                'text-gray-500'
                              }`}>
                                {check.status === 'compliant' ? 'Compliant' :
                                 check.status === 'non-compliant' ? 'Non-Compliant' :
                                 check.status === 'pending-review' ? 'Pending' : 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 text-sm text-gray-600">{check.checkedBy}</td>
                          <td className="py-2 text-sm text-gray-500">
                            {check.checkedAt.toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="px-4 py-3 bg-gray-50 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProduct(item)}
                >
                  View Full Report →
                </Button>
              </div>
            </Card>
          ))}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title="Compliance Report"
        size="lg"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">{selectedProduct.product.name}</h3>
                <p className="text-sm text-gray-500">
                  {selectedProduct.product.assetType} • {selectedProduct.product.jurisdiction}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{selectedProduct.score}%</p>
                <Badge className={getStatusColor(selectedProduct.status)}>
                  {selectedProduct.status}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Compliance Checks</h4>
              <div className="space-y-2">
                {selectedProduct.compliance.map((check) => (
                  <div key={check.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getCheckStatusIcon(check.status)}
                      <div>
                        <p className="font-medium text-gray-900">{check.rule}</p>
                        <p className="text-sm text-gray-500">{check.standard}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-gray-600">{check.checkedBy}</p>
                      <p className="text-gray-400">{check.checkedAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedProduct(null)}>
                Close
              </Button>
              <Button variant="outline" className="flex-1">
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ComplianceReportViewer;
