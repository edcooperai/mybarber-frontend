export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

export interface CalendarCredentials {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}