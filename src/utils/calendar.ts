import { useCalendarStore } from '../store/calendarStore';

export const createCalendarEvent = async (event: {
  summary: string;
  description?: string;
  start: { dateTime: string };
  end: { dateTime: string };
}) => {
  const { accessToken, setError } = useCalendarStore.getState();

  if (!accessToken) {
    setError('Calendar not connected');
    return null;
  }

  try {
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error('Failed to create calendar event');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating calendar event:', error);
    setError('Failed to create calendar event');
    return null;
  }
};

export const listCalendarEvents = async (
  timeMin: string,
  timeMax: string
) => {
  const { accessToken, setError } = useCalendarStore.getState();

  if (!accessToken) {
    setError('Calendar not connected');
    return [];
  }

  try {
    const params = new URLSearchParams({
      timeMin,
      timeMax,
      singleEvents: 'true',
      orderBy: 'startTime',
    });

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch calendar events');
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    setError('Failed to fetch calendar events');
    return [];
  }
};

export const updateCalendarEvent = async (
  eventId: string,
  event: {
    summary?: string;
    description?: string;
    start?: { dateTime: string };
    end?: { dateTime: string };
  }
) => {
  const { accessToken, setError } = useCalendarStore.getState();

  if (!accessToken) {
    setError('Calendar not connected');
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update calendar event');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating calendar event:', error);
    setError('Failed to update calendar event');
    return null;
  }
};

export const deleteCalendarEvent = async (eventId: string) => {
  const { accessToken, setError } = useCalendarStore.getState();

  if (!accessToken) {
    setError('Calendar not connected');
    return false;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    setError('Failed to delete calendar event');
    return false;
  }
};