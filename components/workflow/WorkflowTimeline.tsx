import React from 'react';
import { Card, CardHeader, CardBody, Avatar, Badge } from '../shared';
import { Workflow, WorkflowStage, Approval } from '../../types';
import { WORKFLOW_STAGE_LABELS } from '../../utils/constants';

interface WorkflowTimelineProps {
  workflow: Workflow;
  onStageClick?: (stage: WorkflowStage) => void;
}

/**
 * WorkflowTimeline - Workflow Component
 * 
 * Purpose: Visual timeline of workflow progression with approvals
 * Location: /components/workflow/
 * Used by: Multiple pages (Product Owner, Sharia Board, Legal, etc.)
 * Shared: Yes - used across multiple role pages
 */
export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({
  workflow,
  onStageClick,
}) => {
  const getStageStatus = (stage: WorkflowStage) => {
    const stageRecord = workflow.stages.find((s) => s.stage === stage);
    return stageRecord?.status || 'pending';
  };

  const getStageApprovals = (stage: WorkflowStage): Approval[] => {
    const stageRecord = workflow.stages.find((s) => s.stage === stage);
    return stageRecord?.approvals || [];
  };

  const stages: WorkflowStage[] = [
    'initiation',
    'sharia-review',
    'legal-review',
    'risk-review',
    'engineering-implementation',
    'deployment',
    'completed',
  ];

  return (
    <Card>
      <CardHeader>Workflow Timeline</CardHeader>
      <CardBody>
        <div className="relative">
          {stages.map((stage, index) => {
            const status = getStageStatus(stage);
            const approvals = getStageApprovals(stage);
            const isLast = index === stages.length - 1;
            const isCurrent = workflow.currentStage === stage;

            return (
              <div
                key={stage}
                className={`relative pb-8 ${isLast ? 'pb-0' : ''} ${
                  onStageClick ? 'cursor-pointer hover:bg-gray-50 -mx-4 px-4 rounded' : ''
                }`}
                onClick={() => onStageClick?.(stage)}
              >
                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={`absolute left-4 top-8 w-0.5 h-full -ml-px ${
                      status === 'approved' ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}

                <div className="flex items-start">
                  {/* Status Icon */}
                  <div className="relative flex-shrink-0">
                    {status === 'approved' ? (
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center ring-4 ring-white">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : status === 'in-progress' ? (
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center ring-4 ring-white animate-pulse">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                    ) : status === 'rejected' ? (
                      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center ring-4 ring-white">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ring-4 ring-white">
                        <div className="w-3 h-3 bg-gray-400 rounded-full" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-medium ${
                          isCurrent ? 'text-blue-600' : status === 'approved' ? 'text-green-600' : 'text-gray-500'
                        }`}
                      >
                        {WORKFLOW_STAGE_LABELS[stage]}
                      </h4>
                      {isCurrent && (
                        <Badge variant="info" size="sm">Current</Badge>
                      )}
                    </div>

                    {/* Approvals */}
                    {approvals.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {approvals.map((approval) => (
                          <div key={approval.id} className="flex items-center text-xs text-gray-500">
                            <Avatar name={approval.userName} size="xs" className="mr-2" />
                            <span>{approval.userName}</span>
                            <span className="mx-1">•</span>
                            <span className="capitalize">{approval.decision}</span>
                            <span className="mx-1">•</span>
                            <span>{new Date(approval.timestamp).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};

export default WorkflowTimeline;
