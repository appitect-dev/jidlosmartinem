# Rezervace Page Setup

This document explains how to set up the `/rezervace` page with Calendly integration.

## Implementation Details

The `/rezervace` page has been implemented with the following features:

1. **URL Parameter Validation**: Checks for `sessionId` query parameter
2. **Calendly Widget Integration**: Embedded inline Calendly widget
3. **Responsive Design**: Mobile-friendly and properly styled with Tailwind
4. **Error Handling**: Redirects to `/dotaznik` if sessionId is missing
5. **Loading States**: Shows loading spinners during initialization

## Required Setup

### 1. Calendly Username Configuration

You need to set your actual Calendly username. You have two options:

**Option A: Environment Variable (Recommended)**
Add to your `.env.local` file:
```
NEXT_PUBLIC_CALENDLY_USERNAME=your-actual-calendly-username
```

**Option B: Direct Code Update**
Update line 25 in `/src/app/rezervace/page.tsx`:
```typescript
const calendlyUsername = 'your-actual-calendly-username';
```

### 2. Calendly Event Type

Make sure your Calendly event URL matches the pattern:
```
https://calendly.com/[username]/free-consultation
```

If your event has a different name, update line 26 in the component:
```typescript
const calendlyUrl = `https://calendly.com/${calendlyUsername}/your-event-name?hide_gdpr_banner=1&sessionId=${sessionId}`;
```

## User Flow

1. User visits landing page and clicks "Chci konzultaci zdarma"
2. User is redirected to `/dotaznik`
3. User fills out the form and submits
4. After successful submission, user is redirected to `/rezervace?sessionId=xyz`
5. The rezervace page validates the sessionId and displays Calendly widget
6. User selects a time slot through Calendly
7. Calendly receives the sessionId as a query parameter for later webhook processing

## Features

- **Session Validation**: Ensures user came from the dotaznik form
- **Progress Indicator**: Shows completion status
- **Responsive Design**: Works on all screen sizes
- **Professional UI**: Consistent with the rest of the site
- **Error Handling**: Graceful fallbacks and redirects
- **Loading States**: Smooth user experience

## Next Steps

To complete the integration, you'll need to:

1. Set up your Calendly username (see setup above)
2. Configure Calendly webhooks to point to `/api/calendly-webhook` (when implemented)
3. Implement the webhook handler to process bookings and send emails
4. Test the complete flow from dotaznik to reservation

## Testing

To test the page:

1. Navigate to `/rezervace?sessionId=test123`
2. Verify the Calendly widget loads correctly
3. Test mobile responsiveness
4. Verify navigation and error handling

If you navigate to `/rezervace` without sessionId, you should be redirected to `/dotaznik`.
