import React from 'react';
import { Card, CardHeader, CardBody, Badge } from '../shared';
import { ComplianceCheck, ComplianceStandard } from '../../types';

interface ComplianceChecklistProps {
  productId: string;
  checks: ComplianceCheck[];
  onUpdateCheck: (checkId: string, status: ComplianceCheck['status']) => void;
}

/**
 * ComplianceChecklist - Legal & Compliance Component
 * 
 * Purpose: Displays AAOIFI/IFSB compliance checklist for legal review
 * Location: /components/legal-compliance/
 * Used by: LegalCompliancePage
 */
export const ComplianceChecklist: React.FC<ComplianceChecklistProps> = ({
  productId,
  checks,
  onUpdateCheck,
}) => {
  const groupedChecks = checks.reduce((acc, check) => {
    if (!acc[check.standard]) {
      acc[check.standard] = [];
    }
    acc[check.standard].push(check);
    return acc;
  }, {} as Record<ComplianceStandard, ComplianceCheck[]>);

  const getStatusBadge = (status: ComplianceCheck['status']) => {
    const config = {
      compliant: { variant: 'success' as const, label: 'Compliant' },
      'non-compliant': { variant: 'danger' as const, label: 'Non-Compliant' },
      'pending-review': { variant: 'warning' as const, label: 'Pending' },
      'not-applicable': { variant: 'default' as const, label: 'N/A' },
    };
    const { variant, label } = config[status];
    return <Badge variant={variant} size="sm">{label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>Compliance Checklist</CardHeader>
      <CardBody>
        {Object.entries(groupedChecks).map(([standard, standardChecks]) => (
          <div key={standard} className="mb-6 last:mb-0">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
              {standard} Standards
            </h4>
            <div className="space-y-2">
              {standardChecks.map((check) => (
                <div
                  key={check.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{check.rule}</p>
                    {check.findings && (
                      <p className="text-xs text-gray-500 mt-1">{check.findings}</p>
                    )}
                  </div>
                  {getStatusBadge(check.status)}
                </div>
              ))}
            </div>
          </div>
        ))}

        {checks.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No compliance checks defined for this product
          </p>
        )}
      </CardBody>
    </Card>
  );
};

export default ComplianceChecklist;
