import React from 'react';
import { Badge, Avatar, AvatarGroup, Button } from '../shared';
import { MeetingWithDetails, getMeetingTypeConfig, formatMeetingTime, formatMeetingDate, isMeetingToday } from '../../types/meetings';

interface MeetingCardProps {
  meeting: MeetingWithDetails;
  onJoin?: () => void;
  onViewDetails: () => void;
  onEdit?: () => void;
  compact?: boolean;
}

/**
 * MeetingCard - Meeting Management Component
 * 
 * Purpose: Display individual meeting with details and actions
 * Location: /components/meetings/
 * Used by: MeetingList, Dashboard widgets
 * Shared: Yes - used across multiple role pages
 */
export const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  onJoin,
  onViewDetails,
  onEdit,
  compact = false,
}) => {
  const typeConfig = getMeetingTypeConfig(meeting.type);
  const isToday = isMeetingToday(meeting.scheduledAt);
  const isUpcoming = new Date(meeting.scheduledAt) > new Date();
  const isInProgress = meeting.status === 'in-progress';

  if (compact) {
    return (
      <div
        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
          isInProgress
            ? 'border-green-300 bg-green-50'
            : isToday
            ? 'border-blue-200 bg-blue-50'
            : 'border-gray-200 hover:bg-gray-50'
        }`}
        onClick={onViewDetails}
      >
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
            style={{ backgroundColor: `${typeConfig.color}20` }}
          >
            {typeConfig.icon}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{meeting.title}</p>
            <p className="text-xs text-gray-500">
              {formatMeetingTime(meeting.scheduledAt, meeting.duration)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <AvatarGroup size="xs" max={3}>
            {meeting.attendees.map((attendee) => (
              <Avatar key={attendee.userId} name={attendee.name} size="xs" />
            ))}
          </AvatarGroup>
          {isInProgress && (
            <Badge variant="success" size="sm">Live</Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border overflow-hidden ${
        isInProgress
          ? 'border-green-300 bg-green-50'
          : isToday
          ? 'border-blue-200'
          : 'border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: `${typeConfig.color}20` }}
            >
              {typeConfig.icon}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                {isInProgress && (
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                    <Badge variant="success" size="sm">Live</Badge>
                  </span>
                )}
                {isToday && !isInProgress && (
                  <Badge variant="info" size="sm">Today</Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">{typeConfig.label}</p>
            </div>
          </div>

          <Badge
            variant={
              meeting.status === 'completed'
                ? 'success'
                : meeting.status === 'cancelled'
                ? 'danger'
                : 'default'
            }
            size="sm"
          >
            {meeting.status}
          </Badge>
        </div>

        {/* Time & Date */}
        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatMeetingDate(meeting.scheduledAt)}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatMeetingTime(meeting.scheduledAt, meeting.duration)}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {meeting.attendees.length} attendees
          </div>
        </div>

        {/* Attendees */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">Attendees</p>
          <div className="flex items-center justify-between">
            <AvatarGroup size="sm" max={5}>
              {meeting.attendees.map((attendee) => (
                <Avatar
                  key={attendee.userId}
                  name={attendee.name}
                  size="sm"
                  showStatus
                  status={attendee.status === 'accepted' ? 'online' : 'away'}
                />
              ))}
            </AvatarGroup>
            {meeting.attendees.length > 5 && (
              <span className="text-xs text-gray-500">
                +{meeting.attendees.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Agenda Preview */}
        {meeting.agenda.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Agenda ({meeting.agenda.length} items)</p>
            <div className="space-y-1">
              {meeting.agenda.slice(0, 3).map((item, index) => (
                <div key={item.id} className="flex items-center text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs mr-2">
                    {index + 1}
                  </span>
                  <span className="truncate">{item.title}</span>
                  <span className="ml-auto text-xs text-gray-400">{item.duration}m</span>
                </div>
              ))}
              {meeting.agenda.length > 3 && (
                <p className="text-xs text-gray-400 ml-7">
                  +{meeting.agenda.length - 3} more items
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="flex space-x-2">
          {isInProgress && onJoin && (
            <Button size="sm" variant="primary" onClick={onJoin}>
              Join Now
            </Button>
          )}
          {isUpcoming && !isInProgress && onJoin && (
            <Button size="sm" variant="outline" onClick={onJoin}>
              Join
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onViewDetails}>
            View Details
          </Button>
        </div>
        {onEdit && isUpcoming && (
          <Button size="sm" variant="ghost" onClick={onEdit}>
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default MeetingCard;
