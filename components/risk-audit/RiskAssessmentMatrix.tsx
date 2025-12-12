import React from 'react';
import { Card, CardHeader, CardBody, Badge } from '../shared';
import { RiskAssessment, RiskCategory, RiskLevel } from '../../types';
import { RISK_LEVEL_CONFIG } from '../../utils/constants';

interface RiskAssessmentMatrixProps {
  productId: string;
  assessments: RiskAssessment[];
  onAddAssessment: () => void;
  onUpdateAssessment: (assessmentId: string) => void;
}

/**
 * RiskAssessmentMatrix - Risk Management Component
 * 
 * Purpose: Displays risk matrix for product risk evaluation
 * Location: /components/risk-audit/
 * Used by: RiskAuditPage
 */
export const RiskAssessmentMatrix: React.FC<RiskAssessmentMatrixProps> = ({
  productId,
  assessments,
  onAddAssessment,
  onUpdateAssessment,
}) => {
  const getRiskBadge = (level: RiskLevel) => {
    const config = RISK_LEVEL_CONFIG[level];
    const variants: Record<RiskLevel, 'success' | 'warning' | 'danger' | 'default'> = {
      low: 'success',
      medium: 'warning',
      high: 'danger',
      critical: 'danger',
    };
    return (
      <Badge variant={variants[level]} size="sm">
        {config.label}
      </Badge>
    );
  };

  const categories: RiskCategory[] = [
    'sharia-compliance',
    'credit',
    'market',
    'operational',
    'liquidity',
    'legal',
    'reputational',
  ];

  return (
    <Card>
      <CardHeader
        action={
          <button
            onClick={onAddAssessment}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Assessment
          </button>
        }
      >
        Risk Assessment Matrix
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {categories.map((category) => {
            const assessment = assessments.find((a) => a.category === category);
            return (
              <div
                key={category}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => assessment && onUpdateAssessment(assessment.id)}
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {category.replace('-', ' ')} Risk
                  </p>
                  {assessment?.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {assessment.description}
                    </p>
                  )}
                </div>
                {assessment ? (
                  getRiskBadge(assessment.level)
                ) : (
                  <Badge variant="default" size="sm">Not Assessed</Badge>
                )}
              </div>
            );
          })}
        </div>

        {/* Risk Summary */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Risk Summary</h4>
          <div className="grid grid-cols-4 gap-2 text-center">
            {(['low', 'medium', 'high', 'critical'] as RiskLevel[]).map((level) => {
              const count = assessments.filter((a) => a.level === level).length;
              return (
                <div key={level} className="p-2 bg-gray-50 rounded">
                  <p className="text-lg font-bold" style={{ color: RISK_LEVEL_CONFIG[level].color }}>
                    {count}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{level}</p>
                </div>
              );
            })}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default RiskAssessmentMatrix;
