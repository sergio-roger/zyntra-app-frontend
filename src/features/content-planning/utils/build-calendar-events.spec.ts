import { describe, it, expect } from 'vitest';
import { buildCalendarEvents } from '@features/content-planning/utils/build-calendar-events';
import { ContentPlanPlatform } from '@features/content-planning/enums/content-plan-platform.enum';
import { ContentPostStatus } from '@features/content-planning/enums/content-post-status.enum';

describe('buildCalendarEvents', () => {
  it('maps each post to a FullCalendar event with platform and date', () => {
    const events = buildCalendarEvents([
      {
        id: 'post-1',
        planId: 'plan-1',
        platform: ContentPlanPlatform.INSTAGRAM,
        scheduledAt: '2026-08-04T13:00:00.000Z',
        copyText: 'Descubrí los beneficios',
        mediaType: 'image',
        imageUrl: null,
        status: ContentPostStatus.DRAFT,
      },
    ]);

    expect(events).toEqual([
      {
        id: 'post-1',
        title: 'instagram · Descubrí los beneficios',
        date: '2026-08-04T13:00:00.000Z',
      },
    ]);
  });
});
