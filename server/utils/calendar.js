import ical from 'node-ical';
import icalGenerator from 'ical-generator';
import { google } from 'googleapis';
import axios from 'axios';
import { logger } from './logger.js';

// Google Calendar setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.FRONTEND_URL}/calendar/google/callback`
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// Calendar sync functions
export const syncWithGoogle = async (accessToken, appointments) => {
  try {
    oauth2Client.setCredentials({ access_token: accessToken });

    for (const appointment of appointments) {
      await createGoogleEvent(appointment);
    }

    logger.info('Google Calendar sync completed');
  } catch (error) {
    logger.error('Google Calendar sync failed:', error);
    throw error;
  }
};

export const syncWithOutlook = async (accessToken, appointments) => {
  try {
    for (const appointment of appointments) {
      await createOutlookEvent(accessToken, appointment);
    }

    logger.info('Outlook Calendar sync completed');
  } catch (error) {
    logger.error('Outlook Calendar sync failed:', error);
    throw error;
  }
};

// Export calendar data
export const exportCalendar = (appointments) => {
  const calendar = icalGenerator({
    name: 'MyBarber.ai Appointments',
    timezone: 'Europe/London'
  });

  appointments.forEach(appointment => {
    calendar.createEvent({
      start: new Date(appointment.date),
      end: new Date(new Date(appointment.date).getTime() + appointment.service.duration * 60000),
      summary: `${appointment.service.name} with ${appointment.clientName}`,
      description: appointment.notes,
      location: appointment.location
    });
  });

  return calendar.toString();
};

// Helper functions
const createGoogleEvent = async (appointment) => {
  const event = {
    summary: `${appointment.service.name} with ${appointment.clientName}`,
    description: appointment.notes,
    start: {
      dateTime: new Date(appointment.date).toISOString(),
      timeZone: 'Europe/London'
    },
    end: {
      dateTime: new Date(new Date(appointment.date).getTime() + appointment.service.duration * 60000).toISOString(),
      timeZone: 'Europe/London'
    }
  };

  await calendar.events.insert({
    calendarId: 'primary',
    resource: event
  });
};

const createOutlookEvent = async (accessToken, appointment) => {
  const event = {
    subject: `${appointment.service.name} with ${appointment.clientName}`,
    body: {
      contentType: 'HTML',
      content: appointment.notes
    },
    start: {
      dateTime: new Date(appointment.date).toISOString(),
      timeZone: 'Europe/London'
    },
    end: {
      dateTime: new Date(new Date(appointment.date).getTime() + appointment.service.duration * 60000).toISOString(),
      timeZone: 'Europe/London'
    }
  };

  await axios.post('https://graph.microsoft.com/v1.0/me/events', event, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
};