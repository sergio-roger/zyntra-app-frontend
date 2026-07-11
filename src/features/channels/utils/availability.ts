import { DayKey, WebChannelFormValues, WidgetStatus } from '@features/channels/schemas/web-channel.schema';

const WEEKDAY_TO_DAY_KEY: Record<string, DayKey> = {
  Mon: 'mon',
  Tue: 'tue',
  Wed: 'wed',
  Thu: 'thu',
  Fri: 'fri',
  Sat: 'sat',
  Sun: 'sun',
};

/** Día (clave corta) y hora "HH:mm" actuales en la zona horaria indicada. */
export const getNowInTimezone = (
  timezone: string,
): { day: DayKey; time: string } => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date());

    const weekday = parts.find((p) => p.type === 'weekday')?.value ?? 'Mon';
    const hour = parts.find((p) => p.type === 'hour')?.value ?? '00';
    const minute = parts.find((p) => p.type === 'minute')?.value ?? '00';

    return { day: WEEKDAY_TO_DAY_KEY[weekday] ?? 'mon', time: `${hour}:${minute}` };
  } catch {
    const now = new Date();
    const weekday = now.toLocaleDateString('en-US', { weekday: 'short' });
    const time = now.toTimeString().slice(0, 5);
    return { day: WEEKDAY_TO_DAY_KEY[weekday] ?? 'mon', time };
  }
};

export const isWithinBusinessHours = (
  businessHours: WebChannelFormValues['businessHours'],
): boolean => {
  if (businessHours.is24x7) return true;

  const { day, time } = getNowInTimezone(businessHours.timezone);
  const entry = businessHours.schedule.find((d) => d.day === day);
  if (!entry || !entry.enabled) return false;

  return time >= entry.from && time < entry.to;
};

/** Estado efectivo del widget: directo en modo manual, calculado en modo horario. */
export const getEffectiveWidgetStatus = (
  values: Pick<WebChannelFormValues, 'availabilityMode' | 'manualStatus' | 'businessHours'>,
): WidgetStatus => {
  if (values.availabilityMode === 'manual') return values.manualStatus;
  return isWithinBusinessHours(values.businessHours) ? 'available' : 'offline';
};
