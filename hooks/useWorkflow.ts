import { useState, useCallback } from 'react';
import { Workflow, WorkflowStage, Product, Approval, Comment } from '../types';

interface UseWorkflowReturn {
  workflow: Workflow | null;
  isLoading: boolean;
  error: string | null;
  loadWorkflow: (workflowId: string) => Promise<void>;
  advanceStage: () => Promise<void>;
  addApproval: (approval: Omit<Approval, 'id' | 'timestamp'>) => Promise<void>;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => Promise<void>;
  requestChanges: (comments: string) => Promise<void>;
  getCurrentStageAssignees: () => string[];
  canUserApprove: (userId: string, userRole: string) => boolean;
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

const STAGE_ROLES: Record<WorkflowStage, string[]> = {
  initiation: ['product-owner'],
  'sharia-review': ['sharia-scholar'],
  'legal-review': ['legal-compliance'],
  'risk-review': ['risk-audit'],
  'engineering-implementation': ['engineering'],
  deployment: ['engineering', 'product-owner'],
  completed: [],
};

export const useWorkflow = (): UseWorkflowReturn => {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWorkflow = useCallback(async (workflowId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // Simulated workflow data
      const mockWorkflow: Workflow = {
        id: workflowId,
        productId: 'product-1',
        currentStage: 'sharia-review',
        stages: STAGE_ORDER.map((stage) => ({
          stage,
          status: stage === 'initiation' ? 'approved' : stage === 'sharia-review' ? 'in-progress' : 'pending',
          assignedTo: [],
          comments: [],
          approvals: [],
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setWorkflow(mockWorkflow);
    } catch (err) {
      setError('Failed to load workflow');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const advanceStage = useCallback(async () => {
    if (!workflow) return;

    const currentIndex = STAGE_ORDER.indexOf(workflow.currentStage);
    if (currentIndex === -1 || currentIndex >= STAGE_ORDER.length - 1) return;

    const nextStage = STAGE_ORDER[currentIndex + 1];

    // TODO: API call to advance stage
    setWorkflow({
      ...workflow,
      currentStage: nextStage,
      stages: workflow.stages.map((s) =>
        s.stage === workflow.currentStage
          ? { ...s, status: 'approved', completedAt: new Date() }
          : s.stage === nextStage
          ? { ...s, status: 'in-progress', startedAt: new Date() }
          : s
      ),
      updatedAt: new Date(),
    });
  }, [workflow]);

  const addApproval = useCallback(
    async (approval: Omit<Approval, 'id' | 'timestamp'>) => {
      if (!workflow) return;

      const newApproval: Approval = {
        ...approval,
        id: `approval-${Date.now()}`,
        timestamp: new Date(),
      };

      // TODO: API call to add approval
      setWorkflow({
        ...workflow,
        stages: workflow.stages.map((s) =>
          s.stage === workflow.currentStage
            ? { ...s, approvals: [...s.approvals, newApproval] }
            : s
        ),
        updatedAt: new Date(),
      });
    },
    [workflow]
  );

  const addComment = useCallback(
    async (comment: Omit<Comment, 'id' | 'createdAt'>) => {
      if (!workflow) return;

      const newComment: Comment = {
        ...comment,
        id: `comment-${Date.now()}`,
        createdAt: new Date(),
      };

      // TODO: API call to add comment
      setWorkflow({
        ...workflow,
        stages: workflow.stages.map((s) =>
          s.stage === workflow.currentStage
            ? { ...s, comments: [...s.comments, newComment] }
            : s
        ),
        updatedAt: new Date(),
      });
    },
    [workflow]
  );

  const requestChanges = useCallback(
    async (comments: string) => {
      if (!workflow) return;

      // TODO: API call to request changes
      // This would typically move the workflow back to a previous stage
      setWorkflow({
        ...workflow,
        stages: workflow.stages.map((s) =>
          s.stage === workflow.currentStage
            ? { ...s, status: 'rejected' }
            : s
        ),
        updatedAt: new Date(),
      });
    },
    [workflow]
  );

  const getCurrentStageAssignees = useCallback((): string[] => {
    if (!workflow) return [];
    const currentStageRecord = workflow.stages.find(
      (s) => s.stage === workflow.currentStage
    );
    return currentStageRecord?.assignedTo || [];
  }, [workflow]);

  const canUserApprove = useCallback(
    (userId: string, userRole: string): boolean => {
      if (!workflow) return false;
      const allowedRoles = STAGE_ROLES[workflow.currentStage];
      return allowedRoles.includes(userRole);
    },
    [workflow]
  );

  return {
    workflow,
    isLoading,
    error,
    loadWorkflow,
    advanceStage,
    addApproval,
    addComment,
    requestChanges,
    getCurrentStageAssignees,
    canUserApprove,
  };
};

export default useWorkflow;
