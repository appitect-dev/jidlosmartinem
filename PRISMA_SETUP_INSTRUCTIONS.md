# Prisma Database Setup Instructions

## Overview
This document explains how to complete the Prisma database setup for your "Jídlo s Martinem" project.

## Prerequisites
✅ Prisma schema created (`prisma/schema.prisma`)
✅ Prisma Client generated (`lib/prisma.ts`)
✅ Database queries implemented (`lib/queries.ts`)
✅ API routes updated to use Prisma
✅ Prisma packages installed

## Required: Database Configuration

### Step 1: Update Environment Variables

You need to update the `DATABASE_URL` in your `.env.local` file with your actual Vercel Postgres database URL.

**For Local Development:**
1. Go to your Vercel dashboard
2. Navigate to your project → Settings → Environment Variables
3. Copy the `DATABASE_URL` value
4. Update `.env.local`:

```env
DATABASE_URL="your_actual_postgres_url_from_vercel"
```

**Example format:**
```env
DATABASE_URL="postgresql://username:password@host:5432/database_name?schema=public"
```

### Step 2: Deploy Database Schema

Once you have the correct `DATABASE_URL`, run:

```bash
# Push schema to database (creates tables)
npx prisma db push

# Optional: Open Prisma Studio to view data
npx prisma studio
```

### Step 3: Verify Database Connection

Test the connection by running:

```bash
# Generate Prisma Client (if needed)
npx prisma generate

# Check database status
npx prisma db pull
```

## Deployment on Vercel

### Environment Variables on Vercel

Make sure these environment variables are set in your Vercel project:

1. **Database**:
   - `DATABASE_URL` (should already be set from Vercel Postgres)

2. **Email Service**:
   - `MARTIN_EMAIL` (Martin's email address)
   - `RESEND_API_KEY` (if using Resend) OR `SENDGRID_API_KEY` (if using SendGrid)

3. **Calendly**:
   - `NEXT_PUBLIC_CALENDLY_USERNAME` (your Calendly username)

### Vercel Build Configuration

The project should build automatically on Vercel. The `postinstall` script will run `prisma generate` during build.

## Database Schema

The `Dotaznik` model includes these fields:

```prisma
model Dotaznik {
  id                    String   @id @default(cuid())
  sessionId             String   @unique
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  // Basic Info
  jmeno                 String
  email                 String
  vek                   Int?
  vyska                 Int?
  hmotnost              Int?
  pohlavi               String?
  telefon               String?
  
  // Goals
  hlavniCil             String?
  vedlejsiCile          String?
  terminalCile          String?
  
  // Health
  zdravotniDiagnozy     String?
  lekyDoplnky           String?
  alergie               String?
  zdravotniStav         String?
  
  // Additional fields...
}
```

## Testing the Integration

### 1. Test Form Submission

1. Navigate to `/dotaznik`
2. Fill out the form
3. Click "Dokončit"
4. Should redirect to `/rezervace?sessionId=xyz`

### 2. Verify Database Storage

```bash
# Open Prisma Studio
npx prisma studio
```

Check that dotaznik records are being created with the correct data.

### 3. Test Calendly Webhook

1. Book a test meeting through the Calendly widget
2. Check server logs for webhook processing
3. Verify that the webhook can fetch dotaznik data by sessionId

## Troubleshooting

### Common Issues

**1. "Environment variable not found: DATABASE_URL"**
- Ensure `.env.local` has the correct `DATABASE_URL`
- For Vercel deployment, ensure environment variable is set in dashboard

**2. "Can't connect to database"**
- Verify the DATABASE_URL format is correct
- Check that the database exists and is accessible
- Ensure IP allowlisting if required by your database provider

**3. "Table 'Dotaznik' doesn't exist"**
- Run `npx prisma db push` to create tables
- Check that the schema.prisma file is correctly formatted

**4. Build errors on Vercel**
- Ensure all environment variables are set in Vercel dashboard
- Check build logs for specific Prisma errors

### Debug Commands

```bash
# Check Prisma version
npx prisma --version

# Validate schema
npx prisma validate

# Check database connection
npx prisma db pull

# Reset database (development only)
npx prisma db push --force-reset
```

## Production Considerations

### Security
- Never commit `.env.local` to git
- Use strong database passwords
- Regularly rotate API keys

### Performance
- Consider connection pooling for high traffic
- Monitor database performance
- Implement proper indexing if needed

### Backup
- Set up automated database backups
- Test backup restoration procedures

## Next Steps

After completing the database setup:

1. **Email Integration**: Update the `sendEmail` function in the webhook with your actual email service
2. **Error Handling**: Add comprehensive error handling for database operations
3. **Validation**: Implement additional form validation as needed
4. **Monitoring**: Set up logging and monitoring for database operations

## File Changes Summary

The following files have been created/modified for Prisma integration:

- ✅ `prisma/schema.prisma` - Database schema
- ✅ `lib/prisma.ts` - Prisma client singleton
- ✅ `lib/queries.ts` - Database query functions
- ✅ `src/app/api/dotaznik/route.ts` - Updated to use Prisma
- ✅ `src/app/api/calendly-webhook/route.ts` - Updated to use Prisma
- ✅ `package.json` - Added Prisma dependencies
- ✅ `.env.example` - Environment variable template

**Remember**: Update your actual `DATABASE_URL` in `.env.local` and Vercel environment variables!
