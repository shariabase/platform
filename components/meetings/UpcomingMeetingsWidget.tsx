import React from 'react';
import { Card, CardHeader, CardBody, Button, Badge } from '../shared';
import { MeetingCard } from './MeetingCard';
import { MeetingWithDetails, isMeetingToday, isMeetingUpcoming, getMeetingTypeConfig } from '../../types/meetings';

interface UpcomingMeetingsWidgetProps {
  meetings: MeetingWithDetails[];
  onScheduleNew: () => void;
  onViewMeeting: (meeting: MeetingWithDetails) => void;
  onJoinMeeting?: (meeting: MeetingWithDetails) => void;
  maxItems?: number;
}

/**
 * UpcomingMeetingsWidget - Meeting Management Component
 * 
 * Purpose: Dashboard widget showing upcoming meetings
 * Location: /components/meetings/
 * Used by: Dashboard pages for all roles
 * Shared: Yes
 */
export const UpcomingMeetingsWidget: React.FC<UpcomingMeetingsWidgetProps> = ({
  meetings,
  onScheduleNew,
  onViewMeeting,
  onJoinMeeting,
  maxItems = 5,
}) => {
  // Filter and sort upcoming meetings
  const upcomingMeetings = meetings
    .filter((m) => isMeetingUpcoming(m.scheduledAt) || m.status === 'in-progress')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, maxItems);

  const todayMeetings = upcomingMeetings.filter((m) => isMeetingToday(m.scheduledAt));
  const inProgressMeetings = meetings.filter((m) => m.status === 'in-progress');

  return (
    <Card>
      <CardHeader
        action={
          <div className="flex items-center space-x-2">
            {inProgressMeetings.length > 0 && (
              <Badge variant="success" size="sm">
                {inProgressMeetings.length} Live
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={onScheduleNew}>
              + Schedule
            </Button>
          </div>
        }
      >
        Upcoming Meetings
      </CardHeader>
      <CardBody>
        {upcomingMeetings.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500 mb-4">No upcoming meetings</p>
            <Button variant="outline" size="sm" onClick={onScheduleNew}>
              Schedule a Meeting
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Today's Meetings Header */}
            {todayMeetings.length > 0 && (
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-blue-600">Today</span>
                <Badge variant="info" size="sm">{todayMeetings.length}</Badge>
              </div>
            )}

            {/* Meeting Cards */}
            {upcomingMeetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onViewDetails={() => onViewMeeting(meeting)}
                onJoin={onJoinMeeting ? () => onJoinMeeting(meeting) : undefined}
                compact
              />
            ))}

            {meetings.length > maxItems && (
              <Button variant="ghost" className="w-full" size="sm">
                View All ({meetings.length}) →
              </Button>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default UpcomingMeetingsWidget;
