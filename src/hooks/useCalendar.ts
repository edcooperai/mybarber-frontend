import { useCallback } from 'react';
import { useCalendarStore } from '../store/calendarStore';
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../utils/calendar';

export const useCalendar = () => {
  const { isConnected, accessToken, error, setError } = useCalendarStore();

  const addEvent = useCallback(async (event: {
    summary: string;
    description?: string;
    start: { dateTime: string };
    end: { dateTime: string };
  }) => {
    if (!isConnected || !accessToken) {
      setError('Calendar not connected');
      return null;
    }

    try {
      return await createCalendarEvent(event);
    } catch (error) {
      setError('Failed to create calendar event');
      return null;
    }
  }, [isConnected, accessToken, setError]);

  const updateEvent = useCallback(async (eventId: string, event: {
    summary?: string;
    description?: string;
    start?: { dateTime: string };
    end?: { dateTime: string };
  }) => {
    if (!isConnected || !accessToken) {
      setError('Calendar not connected');
      return null;
    }

    try {
      return await updateCalendarEvent(eventId, event);
    } catch (error) {
      setError('Failed to update calendar event');
      return null;
    }
  }, [isConnected, accessToken, setError]);

  const removeEvent = useCallback(async (eventId: string) => {
    if (!isConnected || !accessToken) {
      setError('Calendar not connected');
      return false;
    }

    try {
      return await deleteCalendarEvent(eventId);
    } catch (error) {
      setError('Failed to delete calendar event');
      return false;
    }
  }, [isConnected, accessToken, setError]);

  return {
    isConnected,
    error,
    addEvent,
    updateEvent,
    removeEvent
  };
};