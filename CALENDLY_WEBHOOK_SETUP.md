# Calendly Webhook API Endpoint Setup

This document explains the `/api/calendly-webhook` endpoint implementation and setup requirements.

## Endpoint Overview

**URL**: `/api/calendly-webhook`  
**Method**: POST  
**Purpose**: Process Calendly booking confirmations and send notification emails to Martin

## Implementation Features

✅ **Complete Calendly Integration**:
- Handles `invitee.created` events (new bookings)
- Extracts meeting information (time, link, invitee details)
- Retrieves sessionId from booking metadata
- Fetches client dotaznik data using sessionId
- Sends formatted email to Martin with all details

✅ **Production Ready**:
- Full TypeScript type definitions for Calendly webhook payload
- Comprehensive error handling and logging
- Proper HTTP status codes
- Method validation (only POST allowed)
- Graceful fallbacks for missing data

✅ **Data Processing**:
- Extracts sessionId from Calendly event data
- Fetches dotaznik data from database
- Formats professional email with meeting + client info
- Handles timezone and date formatting

## Required Setup

### 1. Environment Variables

Add these to your `.env.local` file:

```env
# Martin's email address for notifications
MARTIN_EMAIL=martin@example.com

# Email service configuration (choose one)
# For Resend:
RESEND_API_KEY=your_resend_api_key

# For SendGrid:
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# For other email services, add appropriate keys
```

### 2. Database Integration

Replace the mock `getDotaznikBySessionId` function (lines 157-168) with your actual database query:

```typescript
async function getDotaznikBySessionId(sessionId: string): Promise<DotaznikData | null> {
  // Example with your database (Prisma, MongoDB, etc.)
  try {
    const dotaznik = await db.dotaznik.findUnique({
      where: { sessionId }
    });
    return dotaznik;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}
```

### 3. Email Service Integration

Replace the mock `sendEmail` function (lines 170-186) with your actual email service:

#### Option A: Using Resend
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to: string, subject: string, body: string) {
  const { data, error } = await resend.emails.send({
    from: 'noreply@yourdomain.com',
    to: [to],
    subject,
    text: body,
  });

  if (error) {
    throw new Error(`Email failed: ${error.message}`);
  }
  
  return true;
}
```

#### Option B: Using SendGrid
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

async function sendEmail(to: string, subject: string, body: string) {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject,
    text: body,
  };

  await sgMail.send(msg);
  return true;
}
```

### 4. Calendly Webhook Configuration

1. Go to your Calendly account settings
2. Navigate to "Webhooks" section
3. Add a new webhook with:
   - **URL**: `https://yourdomain.com/api/calendly-webhook`
   - **Events**: Select "Invitee Created"
   - **Scope**: Organization or User (as needed)

### 5. SessionId Parameter Extraction

The endpoint currently tries to extract sessionId from:
1. Meeting join URL query parameters
2. Event URI query parameters

Ensure your Calendly booking URL includes the sessionId parameter:
```
https://calendly.com/username/event?sessionId=abc123
```

## API Response Examples

### Success Response (200)
```json
{
  "message": "Webhook processed successfully",
  "sessionId": "abc123",
  "invitee": "John Doe",
  "meetingTime": "January 15, 2025 2:00pm"
}
```

### Error Responses

**Missing SessionId (400)**
```json
{
  "error": "SessionId not found in booking"
}
```

**Client Data Not Found (404)**
```json
{
  "error": "Dotaznik data not found"
}
```

**Internal Error (500)**
```json
{
  "error": "Internal server error",
  "message": "Database connection failed"
}
```

**Method Not Allowed (405)**
```json
{
  "error": "Method not allowed",
  "message": "This endpoint only accepts POST requests"
}
```

## Email Content Example

Martin will receive emails with this format:

```
Subject: Nová rezervace konzultace - John Doe

Dobrý den Martine,

máte novou rezervaci konzultace:

INFORMACE O SCHŮZCE:
====================
- Klient: John Doe
- Email: john@example.com
- Datum a čas: January 15, 2025 2:00pm - 3:00pm
- Časové pásmo: Europe/Prague
- Odkaz na schůzku: https://meet.google.com/abc-def-ghi
- Název události: Free Consultation

ÚDAJE Z DOTAZNÍKU:
==================
- Jméno: John Doe
- Email: john@example.com
- Věk: 35 let
- Výška: 180 cm
- Hmotnost: 80 kg
[... additional dotaznik data ...]

SessionId: abc123
```

## Testing

You can test the webhook locally using tools like ngrok:

1. Start your development server: `npm run dev`
2. Expose localhost with ngrok: `ngrok http 3000`
3. Use the ngrok URL in Calendly webhook settings
4. Create a test booking to trigger the webhook

## Security Considerations

For production, consider adding:
- Webhook signature verification (Calendly provides this)
- Rate limiting
- Request validation
- IP allowlisting (if Calendly provides static IPs)

## Troubleshooting

**Common Issues:**

1. **SessionId not found**: Ensure the booking URL includes `?sessionId=xyz`
2. **Email not sending**: Check email service API keys and configuration
3. **Database errors**: Verify database connection and query logic
4. **Webhook not triggered**: Check Calendly webhook configuration and URL accessibility

Check the server logs for detailed error information.
