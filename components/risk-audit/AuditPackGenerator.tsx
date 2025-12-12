import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button, Badge } from '../shared';
import { Product, RiskAssessment } from '../../types';

interface AuditPackItem {
  id: string;
  category: string;
  name: string;
  description: string;
  status: 'included' | 'pending' | 'not-applicable';
  documentId?: string;
}

interface AuditPackGeneratorProps {
  product: Product;
  riskAssessments: RiskAssessment[];
  onGenerate: () => void;
  onExport: (format: 'pdf' | 'excel') => void;
}

/**
 * AuditPackGenerator - Risk Management Component
 * 
 * Purpose: Generate comprehensive audit packs for products
 * Location: /components/risk-audit/
 * Used by: RiskAuditPage
 */
export const AuditPackGenerator: React.FC<AuditPackGeneratorProps> = ({
  product,
  riskAssessments,
  onGenerate,
  onExport,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Default audit pack items
  const auditPackItems: AuditPackItem[] = [
    {
      id: 'item-1',
      category: 'Product Documentation',
      name: 'Product Specification',
      description: 'Detailed product structure and parameters',
      status: 'included',
    },
    {
      id: 'item-2',
      category: 'Product Documentation',
      name: 'Workflow History',
      description: 'Complete approval workflow with timestamps',
      status: 'included',
    },
    {
      id: 'item-3',
      category: 'Sharia Compliance',
      name: 'Fatwa Document',
      description: 'Sharia board approval and fatwa',
      status: product.status === 'sharia-approved' ? 'included' : 'pending',
    },
    {
      id: 'item-4',
      category: 'Sharia Compliance',
      name: 'Sharia Review Notes',
      description: 'Comments and discussions from Sharia review',
      status: 'included',
    },
    {
      id: 'item-5',
      category: 'Legal & Compliance',
      name: 'Compliance Checklist',
      description: 'AAOIFI/IFSB compliance verification',
      status: 'included',
    },
    {
      id: 'item-6',
      category: 'Legal & Compliance',
      name: 'Contract Review Report',
      description: 'Legal review findings and resolutions',
      status: 'pending',
    },
    {
      id: 'item-7',
      category: 'Risk Assessment',
      name: 'Risk Matrix',
      description: 'Comprehensive risk assessment by category',
      status: riskAssessments.length > 0 ? 'included' : 'pending',
    },
    {
      id: 'item-8',
      category: 'Risk Assessment',
      name: 'Mitigation Plans',
      description: 'Risk mitigation strategies and controls',
      status: riskAssessments.some((r) => r.mitigationPlan) ? 'included' : 'pending',
    },
    {
      id: 'item-9',
      category: 'Audit Trail',
      name: 'Approval History',
      description: 'All approvals with digital signatures',
      status: 'included',
    },
    {
      id: 'item-10',
      category: 'Audit Trail',
      name: 'Document Access Log',
      description: 'Record of document views and downloads',
      status: 'included',
    },
  ];

  // Group items by category
  const groupedItems = auditPackItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, AuditPackItem[]>);

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const selectAll = () => {
    setSelectedItems(auditPackItems.filter((i) => i.status === 'included').map((i) => i.id));
  };

  const includedCount = auditPackItems.filter((i) => i.status === 'included').length;
  const pendingCount = auditPackItems.filter((i) => i.status === 'pending').length;

  return (
    <Card>
      <CardHeader
        action={
          <div className="flex items-center space-x-2">
            <Badge variant="success" size="sm">{includedCount} Ready</Badge>
            {pendingCount > 0 && (
              <Badge variant="warning" size="sm">{pendingCount} Pending</Badge>
            )}
          </div>
        }
      >
        Audit Pack Generator
      </CardHeader>
      <CardBody>
        {/* Quick Actions */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <Button variant="ghost" size="sm" onClick={selectAll}>
            Select All Available
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('pdf')}
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              }
            >
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('excel')}
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            >
              Export Excel
            </Button>
          </div>
        </div>

        {/* Items by Category */}
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      item.status === 'pending'
                        ? 'border-yellow-200 bg-yellow-50'
                        : item.status === 'not-applicable'
                        ? 'border-gray-200 bg-gray-50 opacity-60'
                        : selectedItems.includes(item.id)
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItem(item.id)}
                        disabled={item.status !== 'included'}
                        className="h-4 w-4 text-green-600 rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        item.status === 'included'
                          ? 'success'
                          : item.status === 'pending'
                          ? 'warning'
                          : 'default'
                      }
                      size="sm"
                    >
                      {item.status === 'included' ? 'Ready' : item.status === 'pending' ? 'Pending' : 'N/A'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Generate Button */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button
            className="w-full"
            onClick={onGenerate}
            disabled={selectedItems.length === 0}
          >
            Generate Audit Pack ({selectedItems.length} items)
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default AuditPackGenerator;
