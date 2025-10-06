
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

// Parse the credentials from environment variable
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');

// Initialize Google auth
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/calendar'],
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
        const { booking } = req.body;

    // Parse date and time
    const year = booking.date.split('-').map(Number)[0];
    const month = booking.date.split('-').map(Number)[1] - 1; // 0-indexed
    const day = booking.date.split('-').map(Number)[2];
    const [time, period] = booking.time.split(' ');
    const [hour, minute] = time.split(':').map(Number);

    let hour24 = hour;
    if (period === 'PM' && hour !== 12) hour24 += 12;
    if (period === 'AM' && hour === 12) hour24 = 0;

    // Format local time without timezone offset
    const monthStr = (month + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const hourStr = hour24.toString().padStart(2, '0');
    const minuteStr = (minute || 0).toString().padStart(2, '0');

    const startDateTimeLocal = `${year}-${monthStr}-${dayStr}T${hourStr}:${minuteStr}:00`;
    const endDateTimeLocal = `${year}-${monthStr}-${dayStr}T${(hour24 + 1).toString().padStart(2, '0')}:${minuteStr}:00`;

    // Create calendar event with explicit local time and timezone
    const event = {
      summary: `${booking.service} - ${booking.name}`,
      description: `
Client: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone}
Service: ${booking.service}
Notes: ${booking.notes || 'No additional notes'}
Booking ID: ${booking.id}
      `.trim(),
      start: {
        dateTime: startDateTimeLocal,
        timeZone: 'America/Puerto_Rico',
      },
      end: {
        dateTime: endDateTimeLocal,
        timeZone: 'America/Puerto_Rico',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 hours before
          { method: 'popup', minutes: 60 }, // 1 hour before
        ],
      },
      colorId: '11', // Red color for visibility
    };

    // Insert event to calendar
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
    });

    // Send confirmation email (optional - you can add SendGrid here later)
    
    res.status(200).json({ 
      success: true, 
      eventId: response.data.id,
      eventLink: response.data.htmlLink 
    });

  } catch (error) {
    console.error('Calendar sync error:', error);
    res.status(500).json({ 
      error: 'Failed to sync with calendar',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
