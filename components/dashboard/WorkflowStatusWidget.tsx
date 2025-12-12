import React from 'react';
import { Card, CardHeader, CardBody } from '../shared';
import { Workflow, WorkflowStage } from '../../types';
import { WORKFLOW_STAGE_LABELS } from '../../utils/constants';

interface WorkflowStatusWidgetProps {
  workflows: Workflow[];
  title?: string;
}

const STAGE_ORDER: WorkflowStage[] = [
  'initiation',
  'sharia-review',
  'legal-review',
  'risk-review',
  'engineering-implementation',
  'deployment',
  'completed',
];

const getStageIcon = (stage: WorkflowStage, status: string) => {
  if (status === 'approved' || status === 'completed') {
    return (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (status === 'in-progress') {
    return (
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
        <div className="w-3 h-3 bg-white rounded-full" />
      </div>
    );
  }
  if (status === 'rejected') {
    return (
      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
      <div className="w-3 h-3 bg-gray-400 rounded-full" />
    </div>
  );
};

export const WorkflowStatusWidget: React.FC<WorkflowStatusWidgetProps> = ({
  workflows,
  title = 'Workflow Status',
}) => {
  if (workflows.length === 0) {
    return (
      <Card>
        <CardHeader>{title}</CardHeader>
        <CardBody>
          <p className="text-gray-500 text-center py-4">No active workflows</p>
        </CardBody>
      </Card>
    );
  }

  const workflow = workflows[0]; // Show first workflow for now

  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardBody>
        <div className="relative">
          {STAGE_ORDER.map((stage, index) => {
            const stageRecord = workflow.stages.find((s) => s.stage === stage);
            const status = stageRecord?.status || 'pending';
            const isLast = index === STAGE_ORDER.length - 1;

            return (
              <div key={stage} className="flex items-start mb-4 last:mb-0">
                {/* Icon */}
                <div className="flex-shrink-0">
                  {getStageIcon(stage, status)}
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={`absolute left-4 mt-8 w-0.5 h-8 ${
                      status === 'approved' ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    style={{ transform: 'translateX(-50%)' }}
                  />
                )}

                {/* Content */}
                <div className="ml-4 flex-1">
                  <p
                    className={`text-sm font-medium ${
                      status === 'in-progress'
                        ? 'text-blue-600'
                        : status === 'approved'
                        ? 'text-green-600'
                        : status === 'rejected'
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {WORKFLOW_STAGE_LABELS[stage]}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">{status}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};

export default WorkflowStatusWidget;
