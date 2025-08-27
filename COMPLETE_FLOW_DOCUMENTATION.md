# Complete User Flow Documentation

This document describes the complete user flow from landing page to consultation booking.

## User Flow Overview

```
Landing Page (/) 
    ↓ [Click "Chci konzultaci zdarma"]
Dotaznik Form (/dotaznik)
    ↓ [Submit form → API saves data with sessionId]
Rezervace Page (/rezervace?sessionId=xyz)
    ↓ [Book meeting via Calendly]
Calendly Webhook (/api/calendly-webhook)
    ↓ [Email notification to Martin]
```

## Detailed Flow Steps

### 1. Landing Page (`/`)
- User clicks "Chci konzultaci zdarma" button
- Redirects to `/dotaznik`

### 2. Dotaznik Form (`/dotaznik`)
- User fills out comprehensive nutrition questionnaire
- Form has multiple sections with progress tracking
- **"Dokončit" button functionality**:
  - Calls `handleSubmit()` function
  - Sends POST request to `/api/dotaznik`
  - API validates data and generates unique `sessionId`
  - API saves form data with `sessionId` as identifier
  - Redirects to `/rezervace?sessionId=xyz`

### 3. Rezervace Page (`/rezervace?sessionId=xyz`)
- Validates `sessionId` parameter exists
- If missing, redirects back to `/dotaznik`
- Displays Calendly embed widget
- Passes `sessionId` as query parameter to Calendly booking URL
- User selects meeting time slot

### 4. Calendly Booking
- User books consultation slot
- Calendly receives `sessionId` in booking metadata
- Calendly sends webhook to `/api/calendly-webhook`

### 5. Webhook Processing (`/api/calendly-webhook`)
- Receives Calendly `invitee.created` event
- Extracts meeting details and `sessionId`
- Fetches dotaznik data using `sessionId`
- Sends comprehensive email to Martin with:
  - Meeting information (time, link, participant)
  - Complete dotaznik form data

## API Endpoints

### `/api/dotaznik` (POST)
**Purpose**: Save dotaznik form data and generate session ID

**Request Body**: Complete form data object
```typescript
{
  jmeno: string,
  email: string,
  vek: string,
  // ... all form fields
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "sessionId": "uuid-generated-id",
  "message": "Dotazník byl úspěšně uložen"
}
```

**Response Error (400)**:
```json
{
  "error": "Validation failed",
  "errors": ["Jméno je povinné pole", "Email je povinné pole"]
}
```

### `/api/calendly-webhook` (POST)
**Purpose**: Process Calendly booking confirmations

**Request Body**: Calendly webhook payload (automatic)

**Functionality**:
- Validates webhook event type
- Extracts meeting and participant information
- Retrieves dotaznik data using sessionId
- Sends notification email to Martin
- Returns processing status

## Data Storage

### Current Implementation
- **Development**: In-memory storage (Map object)
- **Production**: Replace with actual database

### Required Database Schema
```sql
CREATE TABLE dotaznik (
  sessionId VARCHAR(36) PRIMARY KEY,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  jmeno VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  vek VARCHAR(10),
  vyska VARCHAR(10),
  hmotnost VARCHAR(10),
  pohlavi VARCHAR(20),
  telefon VARCHAR(50),
  hlavniCil TEXT,
  vedlejsiCile TEXT,
  -- ... all other form fields
);
```

## Error Handling

### Form Submission Errors
- **Validation errors**: Shows field-specific error messages
- **Network errors**: Shows generic retry message
- **Server errors**: Shows user-friendly error message

### Rezervace Page Errors
- **Missing sessionId**: Automatic redirect to `/dotaznik`
- **Invalid sessionId**: Redirect with error message
- **Calendly loading errors**: Fallback error display

### Webhook Errors
- **Missing sessionId**: Logs error, returns 400
- **Database errors**: Logs error, returns 500
- **Email errors**: Logs warning, continues processing

## Required Setup for Production

### 1. Database Integration
Replace mock functions in `/api/dotaznik/route.ts`:
```typescript
// Replace this function with actual database save
async function saveDotaznikData(sessionId: string, formData: DotaznikFormData) {
  // Your database implementation
}
```

Replace mock function in `/api/calendly-webhook/route.ts`:
```typescript
// Replace this function with actual database query
async function getDotaznikBySessionId(sessionId: string): Promise<DotaznikData | null> {
  // Your database implementation
}
```

### 2. Email Service Integration
Update the `sendEmail` function in `/api/calendly-webhook/route.ts` with your email service (Resend, SendGrid, etc.)

### 3. Environment Variables
```env
MARTIN_EMAIL=martin@example.com
RESEND_API_KEY=your_api_key
# or
SENDGRID_API_KEY=your_api_key
```

### 4. Calendly Configuration
- Set webhook URL: `https://yourdomain.com/api/calendly-webhook`
- Select "Invitee Created" event
- Ensure booking URL includes sessionId parameter

## Testing the Complete Flow

### Manual Testing
1. Navigate to landing page
2. Click "Chci konzultaci zdarma"
3. Fill out dotaznik form completely
4. Click "Dokončit"
5. Should redirect to `/rezervace?sessionId=xyz`
6. Should see Calendly widget
7. Book a test meeting
8. Check server logs for webhook processing
9. Check Martin's email for notification

### Debug Information
- Check browser console for any JavaScript errors
- Check server logs for API call details
- Verify sessionId is properly passed through the flow
- Test with incomplete form data to verify validation

## Security Considerations

### Data Protection
- All form data is transmitted over HTTPS
- SessionId acts as unique identifier (no sequential IDs)
- Personal data is only stored temporarily for consultation purposes

### Webhook Security
- Consider adding Calendly webhook signature verification
- Implement rate limiting on webhook endpoint
- Validate all incoming webhook data

### Error Information
- Don't expose sensitive database errors to users
- Log detailed errors server-side for debugging
- Provide user-friendly error messages

## Known Limitations

1. **In-Memory Storage**: Current implementation uses in-memory storage which will reset on server restart
2. **No Data Persistence**: Data is lost when server restarts (development only)
3. **Mock Email**: Email function is currently mocked for development
4. **No User Authentication**: No login system, relies on sessionId only

These limitations should be addressed before production deployment.
