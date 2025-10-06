import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

// Parse the credentials from environment variable
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');

// Initialize Google auth
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});

const calendar = google.calendar({ version: 'v3', auth });

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get query parameters for date range (optional)
    const { startDate, endDate } = req.query;

    // Default to current month if no dates provided
    const now = new Date();
    const startOfMonth = startDate || new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

    // Fetch events from Google Calendar
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      timeMin: startOfMonth,
      timeMax: endOfMonth,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];

    // Convert Google Calendar events to booking format
    const bookings = events
      .filter(event => event.start?.dateTime && event.end?.dateTime)
      .map(event => {
        const startDateTime = new Date(event.start!.dateTime!);
        const endDateTime = new Date(event.end!.dateTime!);

        // Convert 24-hour format to 12-hour format
        const timeString = startDateTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

        return {
          id: event.id || `GC${Date.now()}`,
          date: startDateTime.toISOString().split('T')[0],
          time: timeString,
          name: 'Cliente Externo',
          email: 'externo@calendar.google.com',
          phone: '',
          service: event.summary || 'Cita Programada',
          notes: event.description || '',
          status: 'confirmed' as const,
          createdAt: event.created || new Date().toISOString(),
          eventId: event.id,
          isExternal: true
        };
      });

    res.status(200).json({
      success: true,
      bookings,
      count: bookings.length
    });

  } catch (error) {
    console.error('Calendar fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch calendar events',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
