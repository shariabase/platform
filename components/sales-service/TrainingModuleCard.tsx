// ============================================
// TRAINING MODULE CARD
// Display training materials for sales team
// ============================================

import React, { useState } from 'react';
import { Button, Card, Badge, Modal } from '../shared';
import { TrainingModule, TrainingProgress } from '../../types/sales';

interface TrainingModuleCardProps {
  module: TrainingModule;
  progress?: TrainingProgress;
  onStart?: (moduleId: string) => void;
  onContinue?: (moduleId: string) => void;
  compact?: boolean;
}

// Mock training modules for demo
export const MOCK_TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'train-1',
    productId: 'prod-1',
    title: 'Murabaha Home Financing Fundamentals',
    description: 'Learn the basics of Murabaha home financing, how it works, and how to explain it to customers.',
    type: 'interactive',
    duration: 30,
    content: [
      {
        id: 'c1',
        order: 1,
        type: 'text',
        title: 'What is Murabaha?',
        content: 'Murabaha is a cost-plus financing structure...',
      },
      {
        id: 'c2',
        order: 2,
        type: 'video',
        title: 'Customer Conversation Guide',
        content: 'https://example.com/video.mp4',
      },
      {
        id: 'c3',
        order: 3,
        type: 'quiz',
        title: 'Knowledge Check',
        content: JSON.stringify({ questions: [] }),
      },
    ],
    targetAudience: 'both',
    status: 'published',
    completionRequired: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 'train-2',
    title: 'Sharia Compliance Basics',
    description: 'Understand the fundamental principles of Islamic finance and why our products are Sharia-compliant.',
    type: 'video',
    duration: 45,
    content: [
      {
        id: 'c4',
        order: 1,
        type: 'video',
        title: 'Islamic Finance Principles',
        content: 'https://example.com/sharia-basics.mp4',
      },
    ],
    targetAudience: 'both',
    status: 'published',
    completionRequired: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: 'train-3',
    title: 'Customer Objection Handling',
    description: 'Learn how to address common customer questions and concerns about Islamic finance.',
    type: 'document',
    duration: 20,
    content: [
      {
        id: 'c5',
        order: 1,
        type: 'text',
        title: 'Common Objections',
        content: '# Common Customer Objections...',
      },
    ],
    targetAudience: 'sales',
    status: 'published',
    completionRequired: false,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: 'train-4',
    productId: 'prod-2',
    title: 'Sukuk Investment Products',
    description: 'Deep dive into sukuk structures and how to present them to investors.',
    type: 'interactive',
    duration: 40,
    content: [],
    targetAudience: 'sales',
    status: 'published',
    completionRequired: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: 'train-5',
    title: 'KYC Process Training',
    description: 'Master the KYC documentation requirements and verification process.',
    type: 'quiz',
    duration: 25,
    content: [],
    targetAudience: 'customer-service',
    status: 'published',
    completionRequired: true,
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-10'),
  },
];

const MOCK_PROGRESS: Record<string, TrainingProgress> = {
  'train-1': {
    moduleId: 'train-1',
    userId: 'user-1',
    startedAt: new Date('2024-01-08'),
    completedAt: new Date('2024-01-09'),
    progress: 100,
    quizScore: 85,
  },
  'train-2': {
    moduleId: 'train-2',
    userId: 'user-1',
    startedAt: new Date('2024-01-10'),
    progress: 60,
  },
};

export const TrainingModuleCard: React.FC<TrainingModuleCardProps> = ({
  module,
  progress,
  onStart,
  onContinue,
  compact = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getTypeIcon = () => {
    switch (module.type) {
      case 'video':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'document':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'quiz':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case 'interactive':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        );
    }
  };

  const getStatusInfo = () => {
    if (progress?.completedAt) {
      return { label: 'Completed', variant: 'success' as const };
    }
    if (progress?.startedAt) {
      return { label: `${progress.progress}% Complete`, variant: 'warning' as const };
    }
    return { label: 'Not Started', variant: 'default' as const };
  };

  const statusInfo = getStatusInfo();

  if (compact) {
    return (
      <div
        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
            {getTypeIcon()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{module.title}</p>
            <p className="text-sm text-gray-500">{module.duration} min</p>
          </div>
        </div>
        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
      </div>
    );
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        {/* Header with type indicator */}
        <div className={`h-2 ${
          module.type === 'video' ? 'bg-purple-500' :
          module.type === 'document' ? 'bg-blue-500' :
          module.type === 'quiz' ? 'bg-orange-500' :
          'bg-green-500'
        }`} />
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                module.type === 'video' ? 'bg-purple-100 text-purple-600' :
                module.type === 'document' ? 'bg-blue-100 text-blue-600' :
                module.type === 'quiz' ? 'bg-orange-100 text-orange-600' :
                'bg-green-100 text-green-600'
              }`}>
                {getTypeIcon()}
              </div>
              <span className="text-xs font-medium text-gray-500 uppercase">
                {module.type}
              </span>
            </div>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>

          <h4 className="font-semibold text-gray-900 mb-1">{module.title}</h4>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{module.description}</p>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {module.duration} min
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {module.targetAudience === 'both' ? 'All Teams' : 
                module.targetAudience === 'sales' ? 'Sales' : 'Customer Service'}
            </span>
          </div>

          {/* Progress bar */}
          {progress && (
            <div className="mb-3">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    progress.completedAt ? 'bg-green-500' : 'bg-primary-500'
                  }`}
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              {progress.quizScore !== undefined && (
                <p className="text-xs text-gray-500 mt-1">
                  Quiz Score: {progress.quizScore}%
                </p>
              )}
            </div>
          )}

          {/* Badges */}
          <div className="flex items-center gap-2 mb-3">
            {module.completionRequired && (
              <Badge variant="danger" className="text-xs">Required</Badge>
            )}
            {module.productId && (
              <Badge variant="info" className="text-xs">Product Specific</Badge>
            )}
          </div>

          {/* Action button */}
          {progress?.completedAt ? (
            <Button variant="outline" className="w-full" size="sm" onClick={() => setShowDetails(true)}>
              Review
            </Button>
          ) : progress?.startedAt ? (
            <Button className="w-full" size="sm" onClick={() => onContinue?.(module.id)}>
              Continue
            </Button>
          ) : (
            <Button className="w-full" size="sm" onClick={() => onStart?.(module.id)}>
              Start Training
            </Button>
          )}
        </div>
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={module.title}
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">{module.description}</p>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-semibold">{module.duration} minutes</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-semibold capitalize">{module.type}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Audience</p>
              <p className="font-semibold capitalize">
                {module.targetAudience === 'both' ? 'All Teams' : module.targetAudience}
              </p>
            </div>
          </div>

          {progress?.completedAt && progress.quizScore !== undefined && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-green-900">Training Completed!</p>
                  <p className="text-sm text-green-700">
                    Quiz Score: {progress.quizScore}% • Completed on {progress.completedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {module.content.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Course Content</h4>
              <div className="space-y-2">
                {module.content.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                    </div>
                    {progress?.completedAt ? (
                      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowDetails(false)}>
              Close
            </Button>
            {!progress?.completedAt && (
              <Button className="flex-1" onClick={() => {
                progress?.startedAt ? onContinue?.(module.id) : onStart?.(module.id);
                setShowDetails(false);
              }}>
                {progress?.startedAt ? 'Continue' : 'Start Training'}
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

// Training Dashboard Widget
export const TrainingDashboard: React.FC<{
  modules?: TrainingModule[];
  progress?: Record<string, TrainingProgress>;
}> = ({ modules = MOCK_TRAINING_MODULES, progress = MOCK_PROGRESS }) => {
  const completedCount = Object.values(progress).filter(p => p.completedAt).length;
  const requiredCount = modules.filter(m => m.completionRequired).length;
  const requiredCompleted = modules
    .filter(m => m.completionRequired && progress[m.id]?.completedAt)
    .length;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Training Progress</h3>
        <Badge variant={requiredCompleted === requiredCount ? 'success' : 'warning'}>
          {requiredCompleted}/{requiredCount} Required
        </Badge>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
          <span>Overall Completion</span>
          <span>{completedCount}/{modules.length} modules</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all"
            style={{ width: `${(completedCount / modules.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {modules.slice(0, 4).map(module => (
          <TrainingModuleCard
            key={module.id}
            module={module}
            progress={progress[module.id]}
            compact
          />
        ))}
      </div>

      {modules.length > 4 && (
        <Button variant="ghost" className="w-full mt-3">
          View All Trainings ({modules.length - 4} more)
        </Button>
      )}
    </Card>
  );
};

export default TrainingModuleCard;
