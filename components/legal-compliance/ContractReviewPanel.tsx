import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button, Badge, Avatar } from '../shared';
import { ContractReview, ContractClause, ContractIssue, getIssueSeverityColor } from '../../types/compliance';

interface ContractReviewPanelProps {
  review: ContractReview;
  onUpdateClause: (clauseId: string, updates: Partial<ContractClause>) => void;
  onAddIssue: (clauseId: string, issue: Omit<ContractIssue, 'id'>) => void;
  onResolveIssue: (clauseId: string, issueId: string) => void;
  onComplete: () => void;
  canEdit: boolean;
}

/**
 * ContractReviewPanel - Legal & Compliance Component
 * 
 * Purpose: Review contract clauses and flag compliance issues
 * Location: /components/legal-compliance/
 * Used by: LegalCompliancePage
 */
export const ContractReviewPanel: React.FC<ContractReviewPanelProps> = ({
  review,
  onUpdateClause,
  onAddIssue,
  onResolveIssue,
  onComplete,
  canEdit,
}) => {
  const [selectedClause, setSelectedClause] = useState<ContractClause | null>(null);
  const [showAddIssue, setShowAddIssue] = useState(false);
  const [newIssue, setNewIssue] = useState<Partial<ContractIssue>>({
    severity: 'minor',
    category: 'legal',
  });

  // Count issues by severity
  const issueCounts = review.clauses.reduce(
    (acc, clause) => {
      clause.issues.forEach((issue) => {
        if (!issue.resolved) {
          acc[issue.severity] = (acc[issue.severity] || 0) + 1;
        }
      });
      return acc;
    },
    {} as Record<string, number>
  );

  const totalUnresolvedIssues = Object.values(issueCounts).reduce((a, b) => a + b, 0);

  const handleAddIssue = () => {
    if (selectedClause && newIssue.description && newIssue.recommendation) {
      onAddIssue(selectedClause.id, {
        severity: newIssue.severity || 'minor',
        category: newIssue.category || 'legal',
        description: newIssue.description,
        recommendation: newIssue.recommendation,
        resolved: false,
      });
      setNewIssue({ severity: 'minor', category: 'legal' });
      setShowAddIssue(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Review Header */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Contract Review</h3>
              <p className="text-sm text-gray-500 mt-1">
                {review.clauses.length} clauses • {totalUnresolvedIssues} unresolved issues
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Issue Summary */}
              <div className="flex items-center space-x-2">
                {issueCounts.critical && (
                  <Badge variant="danger" size="sm">
                    {issueCounts.critical} Critical
                  </Badge>
                )}
                {issueCounts.major && (
                  <Badge variant="warning" size="sm">
                    {issueCounts.major} Major
                  </Badge>
                )}
                {issueCounts.minor && (
                  <Badge variant="info" size="sm">
                    {issueCounts.minor} Minor
                  </Badge>
                )}
              </div>

              {/* Complete Button */}
              {canEdit && (
                <Button
                  onClick={onComplete}
                  disabled={issueCounts.critical > 0}
                  variant={totalUnresolvedIssues === 0 ? 'primary' : 'outline'}
                >
                  {totalUnresolvedIssues === 0 ? 'Approve Contract' : 'Complete Review'}
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Clauses List */}
      <div className="space-y-4">
        {review.clauses.map((clause) => {
          const unresolvedIssues = clause.issues.filter((i) => !i.resolved);
          const hasIssues = unresolvedIssues.length > 0;

          return (
            <Card
              key={clause.id}
              className={`${
                hasIssues
                  ? 'border-l-4 border-l-yellow-500'
                  : clause.isShariahCompliant === true
                  ? 'border-l-4 border-l-green-500'
                  : clause.isShariahCompliant === false
                  ? 'border-l-4 border-l-red-500'
                  : ''
              }`}
            >
              <CardBody>
                {/* Clause Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">{clause.section}</span>
                      <h4 className="font-medium text-gray-900">{clause.title}</h4>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {clause.isShariahCompliant === true && (
                      <Badge variant="success" size="sm">Sharia Compliant</Badge>
                    )}
                    {clause.isShariahCompliant === false && (
                      <Badge variant="danger" size="sm">Non-Compliant</Badge>
                    )}
                    {hasIssues && (
                      <Badge variant="warning" size="sm">
                        {unresolvedIssues.length} Issues
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Clause Content */}
                <div className="p-3 bg-gray-50 rounded-lg mb-3">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{clause.content}</p>
                </div>

                {/* Issues */}
                {clause.issues.length > 0 && (
                  <div className="space-y-2 mb-3">
                    <p className="text-sm font-medium text-gray-700">Issues:</p>
                    {clause.issues.map((issue) => (
                      <div
                        key={issue.id}
                        className={`p-3 rounded-lg border-l-4 ${
                          issue.resolved ? 'bg-gray-50 opacity-60' : 'bg-white'
                        }`}
                        style={{ borderLeftColor: getIssueSeverityColor(issue.severity) }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge
                                variant={
                                  issue.severity === 'critical'
                                    ? 'danger'
                                    : issue.severity === 'major'
                                    ? 'warning'
                                    : 'default'
                                }
                                size="sm"
                              >
                                {issue.severity}
                              </Badge>
                              <Badge variant="default" size="sm">
                                {issue.category}
                              </Badge>
                              {issue.resolved && (
                                <Badge variant="success" size="sm">Resolved</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-700">{issue.description}</p>
                            <p className="text-sm text-blue-600 mt-1">
                              <span className="font-medium">Recommendation:</span>{' '}
                              {issue.recommendation}
                            </p>
                          </div>
                          {canEdit && !issue.resolved && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onResolveIssue(clause.id, issue.id)}
                            >
                              Mark Resolved
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {canEdit && (
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant={clause.isShariahCompliant === true ? 'primary' : 'outline'}
                        onClick={() =>
                          onUpdateClause(clause.id, { isShariahCompliant: true })
                        }
                      >
                        ✓ Compliant
                      </Button>
                      <Button
                        size="sm"
                        variant={clause.isShariahCompliant === false ? 'danger' : 'outline'}
                        onClick={() =>
                          onUpdateClause(clause.id, { isShariahCompliant: false })
                        }
                      >
                        ✗ Non-Compliant
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedClause(clause);
                        setShowAddIssue(true);
                      }}
                    >
                      + Add Issue
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Add Issue Modal */}
      {showAddIssue && selectedClause && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Issue to "{selectedClause.title}"</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity
                  </label>
                  <select
                    value={newIssue.severity}
                    onChange={(e) =>
                      setNewIssue({ ...newIssue, severity: e.target.value as ContractIssue['severity'] })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="observation">Observation</option>
                    <option value="minor">Minor</option>
                    <option value="major">Major</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newIssue.category}
                    onChange={(e) =>
                      setNewIssue({ ...newIssue, category: e.target.value as ContractIssue['category'] })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="sharia">Sharia</option>
                    <option value="legal">Legal</option>
                    <option value="regulatory">Regulatory</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newIssue.description || ''}
                  onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Describe the issue..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recommendation
                </label>
                <textarea
                  value={newIssue.recommendation || ''}
                  onChange={(e) => setNewIssue({ ...newIssue, recommendation: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Suggested resolution..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="ghost" onClick={() => setShowAddIssue(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddIssue}>Add Issue</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractReviewPanel;
