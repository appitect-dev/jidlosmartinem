# Prisma Database Integration Setup

This guide will help you complete the Prisma integration for your Next.js project.

## Prerequisites

- PostgreSQL database instance created in Vercel
- `DATABASE_URL` environment variable configured in Vercel and `.env.local`

## Installation Steps

### 1. Install Prisma Dependencies

Run these commands in your project root:

```bash
npm install prisma @prisma/client
npm install -D prisma
```

### 2. Initialize Prisma (if needed)

If this is the first time setting up Prisma:

```bash
npx prisma init
```

Note: The `prisma/schema.prisma` file has already been created for you.

### 3. Generate Prisma Client

After installing the dependencies, generate the Prisma client:

```bash
npx prisma generate
```

### 4. Database Migration

Push the schema to your database:

```bash
npx prisma db push
```

Or create and run migrations:

```bash
npx prisma migrate dev --name init
```

### 5. Update Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "postinstall": "prisma generate"
  }
}
```

### 6. Environment Variables

Ensure your `.env.local` contains:

```env
# Database
DATABASE_URL="your-postgres-connection-string"

# Other environment variables
MARTIN_EMAIL=martin@example.com
RESEND_API_KEY=your_resend_api_key
```

### 7. Vercel Deployment Setup

In your Vercel dashboard:

1. Add `DATABASE_URL` to environment variables
2. Add build command: `npx prisma generate && npm run build`
3. The `postinstall` script will automatically run `prisma generate`

## Code Updates After Installation

### 1. Enable Real Prisma Queries

Once Prisma is installed, update `/src/app/api/calendly-webhook/route.ts`:

**Replace the mock function call:**
```typescript
// Replace this line:
dotaznikData = await getDotaznikBySessionIdMock(sessionId);

// With this line:
dotaznikData = await getDotaznikBySessionId(sessionId);
```

**Remove the import comment and use real import:**
```typescript
// Uncomment and use:
import { getDotaznikBySessionId } from '@/lib/queries';
```

### 2. Optional: Use Prisma Types

You can replace the custom `DotaznikData` interface with Prisma types:

```typescript
import { Dotaznik } from '@prisma/client';

// Replace DotaznikData with Dotaznik in function signatures
```

## Database Schema

The schema includes:

- **Primary Model**: `Dotaznik`
- **Key Fields**: 
  - `id` (CUID primary key)
  - `sessionId` (unique identifier for linking with Calendly)
  - All form fields from the questionnaire
  - Timestamps (`createdAt`, `updatedAt`)

## Available Query Functions

Located in `lib/queries.ts`:

- `saveDotaznik(data)` - Save new dotaznik form data
- `getDotaznikBySessionId(sessionId)` - Fetch dotaznik by session ID
- `getAllDotaznik()` - Get all dotaznik records (admin)
- `deleteDotaznikBySessionId(sessionId)` - Delete dotaznik record

## Testing the Database Integration

### 1. Local Testing

```bash
# Start development server
npm run dev

# In another terminal, open Prisma Studio to view data
npx prisma studio
```

### 2. Test the Flow

1. Fill out dotaznik form at `/dotaznik`
2. Submit form → should save to database
3. Check Prisma Studio to see the saved record
4. Navigate to `/rezervace?sessionId=xyz` → should work
5. Test Calendly webhook with the sessionId

### 3. Verify Database Connection

Create a simple API route to test database connection:

```typescript
// pages/api/test-db.ts
import { getAllDotaznik } from '@/lib/queries';

export default async function handler(req, res) {
  try {
    const records = await getAllDotaznik();
    res.json({ success: true, count: records.length });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
}
```

## Troubleshooting

### Common Issues

1. **"Cannot find module '@prisma/client'"**
   - Run `npm install @prisma/client`
   - Run `npx prisma generate`

2. **Database connection errors**
   - Verify `DATABASE_URL` is correct
   - Check database is accessible from your IP
   - Test connection with `npx prisma db push`

3. **Type errors**
   - Run `npx prisma generate` after schema changes
   - Restart TypeScript server in your IDE

4. **Migration issues**
   - Use `npx prisma db push` for prototyping
   - Use `npx prisma migrate dev` for production

### Prisma Studio

View and edit your data:
```bash
npx prisma studio
```

### Reset Database (Development)

```bash
npx prisma migrate reset
```

## Production Considerations

1. **Environment Variables**: Ensure all env vars are set in Vercel
2. **Database Migrations**: Use `prisma migrate deploy` in production
3. **Connection Pooling**: Consider using Prisma Data Proxy for serverless
4. **Error Handling**: All queries include proper try/catch blocks
5. **Logging**: Enable query logging in development only

## Next Steps

After completing the setup:

1. Install dependencies and run migrations
2. Test the complete flow from form submission to webhook
3. Set up proper email service integration
4. Configure Calendly webhook endpoint
5. Deploy to Vercel and test in production

The integration is ready for production use with proper error handling, type safety, and modular architecture.
