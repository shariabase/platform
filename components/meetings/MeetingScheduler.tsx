import React, { useState } from 'react';
import { Modal, Button, Badge, Avatar } from '../shared';
import { MeetingType, MeetingAttendee, AgendaItem, UserRole } from '../../types';
import { MEETING_TEMPLATES, MEETING_TYPE_CONFIGS, getMeetingTemplate } from '../../types/meetings';

interface MeetingSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (meetingData: NewMeetingData) => Promise<void>;
  productId?: string;
  defaultType?: MeetingType;
  availableAttendees: { id: string; name: string; role: UserRole }[];
}

export interface NewMeetingData {
  title: string;
  type: MeetingType;
  productId?: string;
  scheduledAt: Date;
  duration: number;
  agenda: AgendaItem[];
  attendeeIds: string[];
  notes?: string;
}

/**
 * MeetingScheduler - Meeting Management Component
 * 
 * Purpose: Schedule new meetings with agenda and attendees
 * Location: /components/meetings/
 * Used by: All role pages
 * Shared: Yes
 */
export const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({
  isOpen,
  onClose,
  onSchedule,
  productId,
  defaultType,
  availableAttendees,
}) => {
  const [step, setStep] = useState<'type' | 'details' | 'agenda' | 'attendees'>('type');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<NewMeetingData>>({
    type: defaultType,
    productId,
    duration: 60,
    agenda: [],
    attendeeIds: [],
  });

  const [newAgendaItem, setNewAgendaItem] = useState({ title: '', duration: 15, description: '' });

  // Handle type selection
  const handleSelectType = (type: MeetingType) => {
    const template = MEETING_TEMPLATES.find((t) => t.type === type);
    setFormData({
      ...formData,
      type,
      title: template?.name || '',
      duration: template?.defaultDuration || 60,
      agenda: template?.defaultAgenda || [],
    });
    setStep('details');
  };

  // Add agenda item
  const addAgendaItem = () => {
    if (newAgendaItem.title) {
      const item: AgendaItem = {
        id: `agenda-${Date.now()}`,
        title: newAgendaItem.title,
        duration: newAgendaItem.duration,
        description: newAgendaItem.description || undefined,
      };
      setFormData({
        ...formData,
        agenda: [...(formData.agenda || []), item],
      });
      setNewAgendaItem({ title: '', duration: 15, description: '' });
    }
  };

  // Remove agenda item
  const removeAgendaItem = (id: string) => {
    setFormData({
      ...formData,
      agenda: formData.agenda?.filter((a) => a.id !== id) || [],
    });
  };

  // Toggle attendee
  const toggleAttendee = (id: string) => {
    const current = formData.attendeeIds || [];
    setFormData({
      ...formData,
      attendeeIds: current.includes(id)
        ? current.filter((a) => a !== id)
        : [...current, id],
    });
  };

  // Submit
  const handleSubmit = async () => {
    if (!formData.title || !formData.type || !formData.scheduledAt) return;

    setIsSubmitting(true);
    try {
      await onSchedule(formData as NewMeetingData);
      onClose();
      // Reset form
      setFormData({
        type: defaultType,
        productId,
        duration: 60,
        agenda: [],
        attendeeIds: [],
      });
      setStep('type');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAgendaDuration = formData.agenda?.reduce((acc, a) => acc + a.duration, 0) || 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Meeting"
      size="lg"
    >
      <div className="min-h-[400px]">
        {/* Progress */}
        <div className="flex items-center justify-center mb-6">
          {(['type', 'details', 'agenda', 'attendees'] as const).map((s, index) => (
            <React.Fragment key={s}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s
                    ? 'bg-blue-600 text-white'
                    : index < ['type', 'details', 'agenda', 'attendees'].indexOf(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              {index < 3 && (
                <div
                  className={`w-12 h-1 ${
                    index < ['type', 'details', 'agenda', 'attendees'].indexOf(step)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        {step === 'type' && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Select Meeting Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(MEETING_TYPE_CONFIGS).map((config) => (
                <button
                  key={config.type}
                  onClick={() => handleSelectType(config.type)}
                  className={`p-4 border-2 rounded-lg text-left transition-colors hover:border-blue-300 ${
                    formData.type === config.type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{config.label}</p>
                      <p className="text-xs text-gray-500">{config.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Meeting Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Meeting title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.scheduledAt ? new Date(formData.scheduledAt).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: new Date(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                placeholder="Additional notes..."
              />
            </div>
          </div>
        )}

        {step === 'agenda' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Agenda</h3>
              <span className="text-sm text-gray-500">
                Total: {totalAgendaDuration} min / {formData.duration} min
              </span>
            </div>

            {/* Existing Agenda Items */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {formData.agenda?.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-gray-500">{item.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default" size="sm">{item.duration}m</Badge>
                    <button
                      onClick={() => removeAgendaItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Agenda Item */}
            <div className="p-3 border border-dashed border-gray-300 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Add Agenda Item</p>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newAgendaItem.title}
                  onChange={(e) => setNewAgendaItem({ ...newAgendaItem, title: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Item title"
                />
                <select
                  value={newAgendaItem.duration}
                  onChange={(e) => setNewAgendaItem({ ...newAgendaItem, duration: parseInt(e.target.value) })}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value={5}>5m</option>
                  <option value={10}>10m</option>
                  <option value={15}>15m</option>
                  <option value={30}>30m</option>
                  <option value={45}>45m</option>
                  <option value={60}>60m</option>
                </select>
                <Button size="sm" onClick={addAgendaItem} disabled={!newAgendaItem.title}>
                  Add
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 'attendees' && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Attendees ({formData.attendeeIds?.length || 0} selected)
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableAttendees.map((attendee) => {
                const isSelected = formData.attendeeIds?.includes(attendee.id);
                return (
                  <div
                    key={attendee.id}
                    onClick={() => toggleAttendee(attendee.id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50 border-2 border-blue-300'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar name={attendee.name} size="sm" />
                      <div>
                        <p className="font-medium text-gray-900">{attendee.name}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {attendee.role.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={() => {
              if (step === 'type') {
                onClose();
              } else {
                const steps: typeof step[] = ['type', 'details', 'agenda', 'attendees'];
                const currentIndex = steps.indexOf(step);
                setStep(steps[currentIndex - 1]);
              }
            }}
          >
            {step === 'type' ? 'Cancel' : 'Back'}
          </Button>

          {step === 'attendees' ? (
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={!formData.title || !formData.scheduledAt || (formData.attendeeIds?.length || 0) === 0}
            >
              Schedule Meeting
            </Button>
          ) : (
            <Button
              onClick={() => {
                const steps: typeof step[] = ['type', 'details', 'agenda', 'attendees'];
                const currentIndex = steps.indexOf(step);
                setStep(steps[currentIndex + 1]);
              }}
              disabled={step === 'type' && !formData.type}
            >
              Continue
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MeetingScheduler;
