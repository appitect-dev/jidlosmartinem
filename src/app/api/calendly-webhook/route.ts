import { NextRequest, NextResponse } from 'next/server';
import { getDotaznikBySessionId } from '@/lib/queries';
import { sendBookingNotificationEmail, sendWelcomeEmail } from '@/lib/email';
import { createClientGoogleDoc } from '@/lib/google-docs';
import { sendDiscordAlert } from '@/lib/alerts';

// Type definitions for Calendly webhook payload
interface CalendlyInvitee {
  name: string;
  email: string;
  text_reminder_number?: string;
  timezone: string;
  created_at: string;
  updated_at: string;
  canceled: boolean;
  cancellation?: {
    canceled_by: string;
    reason: string;
  };
  payment?: {
    external_id: string;
    provider: string;
    amount: number;
    currency: string;
    terms: string;
    successful: boolean;
  };
  questions_and_answers?: Array<{
    question: string;
    answer: string;
    position: number;
  }>;
  tracking?: {
    utm_campaign?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_content?: string;
    utm_term?: string;
    salesforce_uuid?: string;
  };
  uri: string;
}

interface CalendlyEvent {
  kind: string;
  slug: string;
  name: string;
  booking_method: string;
  internal_note: string;
  profile_owner: string;
  profile_owner_name: string;
  profile_slug: string;
  profile_name: string;
  start_time: string;
  end_time: string;
  start_time_pretty: string;
  end_time_pretty: string;
  invitee_start_time: string;
  invitee_end_time: string;
  invitee_start_time_pretty: string;
  invitee_end_time_pretty: string;
  timezone: string;
  location?: {
    type: string;
    location?: string;
    join_url?: string;
    phone_number?: string;
    additional_info?: string;
  };
  high_value_content?: {
    enabled: boolean;
    tags: string[];
  };
  uri: string;
  event_memberships: Array<{
    user: string;
    user_name: string;
    user_email: string;
  }>;
  event_guests: Array<{
    email: string;
    created_at: string;
  }>;
  assigned_to: string[];
  extended_assigned_to: Array<{
    name: string;
    email: string;
    primary: boolean;
  }>;
}

interface CalendlyWebhookPayload {
  created_at: string;
  created_by: string;
  event: string;
  payload: {
    event_type: {
      uuid: string;
      kind: string;
      slug: string;
      name: string;
      duration: number;
      owner: {
        type: string;
        uuid: string;
      };
    };
    event: CalendlyEvent;
    invitee: CalendlyInvitee;
    questions_and_responses: Array<{
      question: string;
      response: string;
    }>;
    questions_and_answers: Array<{
      question: string;
      answer: string;
      position: number;
    }>;
    tracking: {
      utm_campaign?: string;
      utm_source?: string;
      utm_medium?: string;
      utm_content?: string;
      utm_term?: string;
      salesforce_uuid?: string;
    };
    old_event?: CalendlyEvent;
    old_invitee?: CalendlyInvitee;
    new_event?: CalendlyEvent;
    new_invitee?: CalendlyInvitee;
  };
}



function extractSessionIdFromEvent(event: CalendlyEvent): string | null {
  try {
    // The sessionId should be in the meeting join URL as a query parameter
    if (event.location?.join_url) {
      const url = new URL(event.location.join_url);
      return url.searchParams.get('sessionId');
    }
    
    // Alternative: check if sessionId is in event URI or other fields
    // This depends on how Calendly passes the custom parameters
    const eventUri = event.uri;
    if (eventUri && eventUri.includes('sessionId=')) {
      const match = eventUri.match(/sessionId=([^&]+)/);
      return match ? match[1] : null;
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting sessionId:', error);
    sendDiscordAlert(
      `SessionId extraction failed:\n${error instanceof Error ? error.message : error}`
    ).catch(console.error);
    return null;
  }
}



export async function POST(request: NextRequest) {
  try {
    const body: CalendlyWebhookPayload = await request.json();
    
    console.log('Received Calendly webhook:', {
      event: body.event,
      created_at: body.created_at,
      invitee_email: body.payload?.invitee?.email
    });

    // Only process "invitee.created" events (new bookings)
    if (body.event !== 'invitee.created') {
      console.log(`Ignoring event type: ${body.event}`);
      return NextResponse.json({ 
        message: 'Event type not processed',
        event: body.event 
      }, { status: 200 });
    }

    const { event, invitee } = body.payload;
    
    if (!event || !invitee) {
      console.error('Missing event or invitee data in payload');
      return NextResponse.json({ 
        error: 'Invalid payload structure' 
      }, { status: 400 });
    }

    // Extract meeting information
    const meetingInfo = {
      startTime: event.start_time,
      endTime: event.end_time,
      startTimePretty: event.start_time_pretty,
      endTimePretty: event.end_time_pretty,
      timezone: event.timezone,
      joinUrl: event.location?.join_url || 'N/A',
      eventName: event.name,
      inviteeName: invitee.name,
      inviteeEmail: invitee.email,
    };

    console.log('Extracted meeting info:', meetingInfo);

    // Extract sessionId from the event
    const sessionId = extractSessionIdFromEvent(event);
    
    if (!sessionId) {
      console.error('SessionId not found in event data');
      return NextResponse.json({ 
        error: 'SessionId not found in booking' 
      }, { status: 400 });
    }

    console.log('Found sessionId:', sessionId);

    // Fetch dotaznik data using sessionId
    let dotaznikData;
    try {
      // TODO: Replace with actual Prisma query once dependencies are installed
      // dotaznikData = await getDotaznikBySessionId(sessionId);
      dotaznikData = await getDotaznikBySessionId(sessionId);
      
      if (!dotaznikData) {
        console.error(`No dotaznik data found for sessionId: ${sessionId}`);
        return NextResponse.json({ 
          error: 'Dotaznik data not found' 
        }, { status: 404 });
      }
    } catch (error) {
      console.error('Error fetching dotaznik data:', error);
      await sendDiscordAlert(
        `Dotaznik fetch in webhook failed:\n${error instanceof Error ? error.message : error}`
      );
      return NextResponse.json({ 
        error: 'Failed to fetch client data' 
      }, { status: 500 });
    }

    // Send emails
    try {
      // Create Google Doc for the client first
      let googleDocUrl = '';
      let raynetClientId: number | undefined;
      try {
        console.log(`Creating Google Doc for sessionId: ${sessionId}`);
        const docResult = await createClientGoogleDoc(sessionId);
        if (docResult.success && docResult.documentUrl) {
          googleDocUrl = docResult.documentUrl;
          raynetClientId = docResult.raynetClientId;
          console.log(`Google Doc created successfully: ${googleDocUrl}`);
          if (raynetClientId) {
            console.log(`Raynet client created with ID: ${raynetClientId}`);
          }
        } else {
          console.error('Failed to create Google Doc:', docResult.error);
        }
      } catch (docError) {
        console.error('Error creating Google Doc:', docError);
        // Continue with email sending even if Google Doc creation fails
      }

      // Send notification email to Martin with complete dotaznik data
      const martinResult = await sendBookingNotificationEmail({
        inviteeName: meetingInfo.inviteeName,
        inviteeEmail: meetingInfo.inviteeEmail,
        eventStartTime: meetingInfo.startTime,
        eventName: meetingInfo.eventName,
        sessionId,
        dotaznikData,
        googleDocUrl, // Include Google Doc URL if available
        raynetClientId // Include Raynet client ID if available
      });

      if (martinResult.success) {
        console.log('Notification email sent successfully to Martin');
      } else {
        console.error('Failed to send notification email to Martin:', martinResult.error);
      }

      // Send welcome email to client
      const clientResult = await sendWelcomeEmail(
        meetingInfo.inviteeName,
        meetingInfo.inviteeEmail,
        meetingInfo.startTime
      );

      if (clientResult.success) {
        console.log('Welcome email sent successfully to client');
      } else {
        console.error('Failed to send welcome email to client:', clientResult.error);
      }

    } catch (error) {
      console.error('Error sending emails:', error);
      await sendDiscordAlert(
        `Email sending in webhook failed:\n${error instanceof Error ? error.message : error}`
      );
      // Don't fail the webhook if email fails, just log it
    }

    // Log successful processing
    console.log(`Successfully processed booking for sessionId: ${sessionId}`);

    return NextResponse.json({
      message: 'Webhook processed successfully',
      sessionId,
      invitee: meetingInfo.inviteeName,
      meetingTime: meetingInfo.startTimePretty
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing Calendly webhook:', error);
    await sendDiscordAlert(
      `Calendly webhook processing failed:\n${error instanceof Error ? error.message : error}`
    );
    
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Handle non-POST requests
export async function GET() {
  return NextResponse.json({
    error: 'Method not allowed',
    message: 'This endpoint only accepts POST requests'
  }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({
    error: 'Method not allowed',
    message: 'This endpoint only accepts POST requests'
  }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({
    error: 'Method not allowed',
    message: 'This endpoint only accepts POST requests'
  }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({
    error: 'Method not allowed',
    message: 'This endpoint only accepts POST requests'
  }, { status: 405 });
}
