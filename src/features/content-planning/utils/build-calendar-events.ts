import { ContentPost } from '@features/content-planning/interfaces/content-post.interface';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
}

export function buildCalendarEvents(posts: ContentPost[]): CalendarEvent[] {
  return posts.map((post) => ({
    id: post.id,
    title: `${post.platform} · ${post.copyText.slice(0, 40)}`,
    date: post.scheduledAt,
  }));
}
