import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ContentPost } from '@features/content-planning/interfaces/content-post.interface';
import { buildCalendarEvents } from '@features/content-planning/utils/build-calendar-events';

interface ContentPlanCalendarViewProps {
  posts: ContentPost[];
  onDayClick: (date: string) => void;
}

export const ContentPlanCalendarView: React.FC<ContentPlanCalendarViewProps> = ({ posts, onDayClick }) => (
  <FullCalendar
    plugins={[dayGridPlugin, interactionPlugin]}
    initialView="dayGridMonth"
    timeZone="UTC"
    events={buildCalendarEvents(posts)}
    dateClick={(info) => onDayClick(info.dateStr)}
    eventClick={(info) => onDayClick(info.event.startStr.slice(0, 10))}
    height="auto"
  />
);

export default ContentPlanCalendarView;
