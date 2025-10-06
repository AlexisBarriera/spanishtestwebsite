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

  // Check for missing environment variables early
  const googleCredentials = process.env.GOOGLE_CREDENTIALS;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!googleCredentials || !calendarId) {
    console.error('Missing environment variables:', {
      hasCredentials: !!googleCredentials,
      hasCalendarId: !!calendarId,
      credentialsLength: googleCredentials?.length,
      calendarIdValue: calendarId?.substring(0, 20) + '...'
    });

    return res.status(500).json({
      error: 'Server configuration error',
      details: 'Missing required environment variables: GOOGLE_CREDENTIALS or GOOGLE_CALENDAR_ID. Please set these in Vercel project settings.',
      debug: {
        hasCredentials: !!googleCredentials,
        hasCalendarId: !!calendarId,
        credentialsKeys: googleCredentials ? Object.keys(JSON.parse(googleCredentials)) : null
      }
    });
  }

  // Validate Google credentials JSON
  let parsedCredentials;
  try {
    parsedCredentials = JSON.parse(googleCredentials);
    if (!parsedCredentials.type || !parsedCredentials.project_id) {
      throw new Error('Invalid credentials format');
    }
  } catch (parseError) {
    console.error('Invalid GOOGLE_CREDENTIALS JSON:', parseError);
    return res.status(500).json({
      error: 'Invalid Google API credentials format',
      details: 'GOOGLE_CREDENTIALS must be valid JSON from your service account key file.'
    });
  }

  try {
    // Get query parameters for date range (optional)
    const { startDate, endDate } = req.query;

// Default to current month if no dates provided
    const now = new Date();
    let startOfMonth: string;
    let endOfMonth: string;

    if (startDate && endDate) {
      // Convert date strings to full datetime strings with start of day and end of day
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      // Set start time to beginning of day (00:00:00)
      startDateObj.setHours(0, 0, 0, 0);
      // Set end time to end of day (23:59:59.999)
      endDateObj.setHours(23, 59, 59, 999);

      startOfMonth = startDateObj.toISOString();
      endOfMonth = endDateObj.toISOString();
    } else {
      startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    }

    console.log('Fetching calendar events:', { calendarId, startOfMonth, endOfMonth });


    // Fetch events from Google Calendar
    const response = await calendar.events.list({
      calendarId,
      timeMin: startOfMonth,
      timeMax: endOfMonth,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    console.log(`Found ${events.length} calendar events`);

    // Convert Google Calendar events to booking format
    const bookings = events
      .filter(event => event.start?.dateTime && event.end?.dateTime)
      .map(event => {
        // Parse the datetime from Google Calendar
        // Google Calendar returns times in UTC, but if no explicit timezone was set,
        // we need to interpret them in the calendar's timezone context
        const startDateTimeUTC = new Date(event.start!.dateTime!);

        // For events without explicit timezone, assume they're in Puerto Rico time
        // and convert from UTC to local time for display
        const startDateTimePR = new Date(startDateTimeUTC.getTime() - (4 * 60 * 60 * 1000));

        // Convert 24-hour format to 12-hour format for display
        const timeString = startDateTimePR.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

        return {
          id: event.id || `GC${Date.now()}`,
          date: startDateTimePR.toISOString().split('T')[0],
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

    console.log(`Converted to ${bookings.length} bookings`);

    res.status(200).json({
      success: true,
      bookings,
      count: bookings.length
    });

  } catch (error) {
    console.error('Calendar fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Return more specific error messages for common issues
    if (errorMessage.includes('invalid_grant')) {
      return res.status(500).json({
        error: 'Invalid Google API credentials',
        details: 'Check GOOGLE_CREDENTIALS environment variable. Service account may have expired or been revoked.'
      });
    }

    if (errorMessage.includes('Calendar ID')) {
      return res.status(500).json({
        error: 'Invalid calendar ID',
        details: 'Check GOOGLE_CALENDAR_ID environment variable. Ensure the calendar exists and is accessible.'
      });
    }

    if (errorMessage.includes('insufficient_scope')) {
      return res.status(500).json({
        error: 'Insufficient Google API permissions',
        details: 'Service account needs read access to the calendar. Share calendar with service account email.'
      });
    }

    res.status(500).json({
      error: 'Failed to fetch calendar events',
      details: errorMessage
    });
  }
}
