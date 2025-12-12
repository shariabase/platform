import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Badge, Button } from '../shared';
import { ComplianceCheck, ComplianceStandard } from '../../types';
import { AAOIFI_STANDARDS, IFSB_STANDARDS } from '../../types/compliance';

interface ComplianceChecklistProps {
  productId: string;
  checks: ComplianceCheck[];
  onUpdateCheck: (checkId: string, status: ComplianceCheck['status'], findings?: string) => void;
  canEdit?: boolean;
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
  canEdit = false,
}) => {
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null);
  const [editingFindings, setEditingFindings] = useState<string>('');

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

  // Calculate compliance score
  const compliantCount = checks.filter((c) => c.status === 'compliant').length;
  const totalApplicable = checks.filter((c) => c.status !== 'not-applicable').length;
  const complianceScore = totalApplicable > 0 ? Math.round((compliantCount / totalApplicable) * 100) : 100;

  return (
    <Card>
      <CardHeader
        action={
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Score:</span>
            <Badge
              variant={complianceScore >= 80 ? 'success' : complianceScore >= 60 ? 'warning' : 'danger'}
            >
              {complianceScore}%
            </Badge>
          </div>
        }
      >
        Compliance Checklist
      </CardHeader>
      <CardBody>
        {/* Summary Bar */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Compliance</span>
            <span className="text-sm text-gray-500">{compliantCount} / {totalApplicable} checks passed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                complianceScore >= 80 ? 'bg-green-500' : complianceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${complianceScore}%` }}
            />
          </div>
        </div>

        {/* Grouped Checks */}
        {Object.entries(groupedChecks).map(([standard, standardChecks]) => (
          <div key={standard} className="mb-6 last:mb-0">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
              {standard} Standards
              <Badge variant="default" size="sm" className="ml-2">
                {standardChecks.filter((c) => c.status === 'compliant').length}/{standardChecks.length}
              </Badge>
            </h4>
            <div className="space-y-2">
              {standardChecks.map((check) => (
                <div
                  key={check.id}
                  className={`border rounded-lg overflow-hidden ${
                    check.status === 'non-compliant' ? 'border-red-200' : 'border-gray-200'
                  }`}
                >
                  <div
                    className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 ${
                      check.status === 'non-compliant' ? 'bg-red-50' : 'bg-white'
                    }`}
                    onClick={() => setExpandedCheck(expandedCheck === check.id ? null : check.id)}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{check.rule}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(check.status)}
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          expandedCheck === check.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedCheck === check.id && (
                    <div className="p-3 bg-gray-50 border-t border-gray-200">
                      {check.findings && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-500 mb-1">Findings:</p>
                          <p className="text-sm text-gray-700">{check.findings}</p>
                        </div>
                      )}

                      {canEdit && (
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">
                              Update Status:
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {(['compliant', 'non-compliant', 'pending-review', 'not-applicable'] as const).map(
                                (status) => (
                                  <Button
                                    key={status}
                                    size="sm"
                                    variant={check.status === status ? 'primary' : 'outline'}
                                    onClick={() => onUpdateCheck(check.id, status)}
                                  >
                                    {status.replace('-', ' ')}
                                  </Button>
                                )
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">
                              Add Findings:
                            </label>
                            <textarea
                              value={editingFindings}
                              onChange={(e) => setEditingFindings(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              rows={2}
                              placeholder="Document any findings or observations..."
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="mt-2"
                              onClick={() => {
                                onUpdateCheck(check.id, check.status, editingFindings);
                                setEditingFindings('');
                              }}
                            >
                              Save Findings
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
