# Prisma Integration Setup Complete! 🎉

Your Next.js app "Jídlo s Martinem" has been successfully integrated with Prisma and your Vercel Postgres database.

## ✅ What's Been Implemented

### 1. Database Schema
- **Location**: `prisma/schema.prisma`
- **Model**: `Dotaznik` with 40+ fields matching your questionnaire
- **Features**: Auto-generated IDs, timestamps, unique sessionId

### 2. Prisma Client Setup
- **Location**: `src/lib/prisma.ts`
- **Features**: Singleton client for Next.js App Router
- **Environment**: Configured for your Vercel Postgres database

### 3. Database Queries
- **Location**: `src/lib/queries.ts`
- **Functions**: 
  - `saveDotaznik()` - Save form data with generated sessionId
  - `getDotaznikBySessionId()` - Retrieve data for webhooks

### 4. API Integration
- **`/api/dotaznik`**: Uses Prisma to save form submissions
- **`/api/calendly-webhook`**: Uses Prisma to fetch client data for emails

### 5. Complete User Flow
```
Landing Page → Dotaznik Form → Prisma DB → Rezervace Page → Calendly → Webhook → Email
```

## 🗄️ Database Schema

```sql
model Dotaznik {
  id        String   @id @default(cuid())
  sessionId String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Basic info: jmeno, email, vek, vyska, hmotnost, pohlavi, telefon
  // Goals: hlavniCil, vedlejsiCile, terminalCile
  // Health: zdravotniDiagnozy, lekyDoplnky, alergie, etc.
  // Body: telesnaKonstituce, pohybovyRezim, etc.
  // Sleep: hodinySpanek, odpocaty, etc.
  // Nutrition: pocetJidel, typJidel, etc.
  // Psychology: aktualniStres, hlavniStresor, etc.
  // Motivation: duvodPoradenstvi, ocekavani, etc.
}
```

## 🔧 Environment Setup

Your `.env.local` is configured with:
```env
DATABASE_URL="postgres://your-connection-string"
MARTIN_EMAIL="martin@example.com"
NEXT_PUBLIC_CALENDLY_USERNAME="jan-vandlicek-appitect"
```

## 🚀 Deployment to Vercel

### 1. Push to Git
```bash
git add .
git commit -m "Add Prisma database integration"
git push origin main
```

### 2. Vercel Environment Variables
In your Vercel dashboard, add these environment variables:
- `DATABASE_URL` - Your Postgres connection string
- `MARTIN_EMAIL` - Email for notifications
- `RESEND_API_KEY` or `SENDGRID_API_KEY` - For email service

### 3. Build Commands
Vercel will automatically:
- Run `npm install` (installs Prisma)
- Run `prisma generate` (generates client)
- Run `next build` (builds the app)

## 📊 Database Management

### View Data (Local Development)
```bash
# Start Prisma Studio to view/edit data
npx prisma studio
```

### Database Migrations (If Schema Changes)
```bash
# Apply schema changes to database
npx prisma db push

# Generate new client after schema changes
npx prisma generate
```

## 🧪 Testing the Complete Flow

### 1. Test Form Submission
1. Go to `/dotaznik`
2. Fill out the form completely
3. Click "Dokončit"
4. Should redirect to `/rezervace?sessionId=xyz`

### 2. Test Database Storage
```bash
# Check if data was saved
npx prisma studio
# Look for new entries in Dotaznik table
```

### 3. Test Webhook (When Calendly is Set Up)
1. Book a meeting via Calendly
2. Check server logs for webhook processing
3. Verify Martin receives email with form data

## 🔍 Database Operations Examples

### Query Data Programmatically
```typescript
import { prisma } from '@/lib/prisma';

// Get all dotaznik entries
const allDotaznik = await prisma.dotaznik.findMany();

// Find by email
const userDotaznik = await prisma.dotaznik.findFirst({
  where: { email: 'user@example.com' }
});

// Update entry
await prisma.dotaznik.update({
  where: { sessionId: 'abc123' },
  data: { jmeno: 'Updated Name' }
});
```

## 🛠️ Troubleshooting

### Common Issues

**1. Database Connection Error**
```bash
# Check if DATABASE_URL is set
echo $DATABASE_URL

# Test connection
npx prisma db push
```

**2. TypeScript Errors**
```bash
# Regenerate Prisma client
npx prisma generate

# Restart TypeScript server in VS Code
```

**3. Build Errors on Vercel**
- Ensure DATABASE_URL is set in Vercel environment variables
- Check build logs for specific errors

### Development Commands
```bash
# Start development server
npm run dev

# View database
npx prisma studio

# Reset database (BE CAREFUL!)
npx prisma db push --force-reset
```

## 📈 Next Steps

1. **Email Service**: Configure Resend or SendGrid for actual email sending
2. **Calendly Webhook**: Set up webhook URL in Calendly dashboard
3. **Data Analytics**: Add reporting dashboard for Martin
4. **Data Export**: Add CSV/PDF export functionality
5. **Data Retention**: Implement data cleanup policies

## 🔒 Security Considerations

- ✅ Database credentials secured in environment variables
- ✅ Unique sessionIds prevent data access by guessing
- ✅ Input validation on all form fields
- ✅ TypeScript for type safety
- 🔄 Consider adding webhook signature verification
- 🔄 Consider adding rate limiting on API endpoints

## 📝 Database Schema Fields

**Personal Info**: jmeno, email, vek, vyska, hmotnost, pohlavi, telefon
**Goals**: hlavniCil, vedlejsiCile, terminalCile
**Health**: zdravotniDiagnozy, lekyDoplnky, alergie, zdravotniStav, krevniTesty, bolesti
**Body**: telesnaKonstituce, pohybovyRezim, tydennieakitivty, sedaveZamestnani, pohybovaOmezeni
**Sleep**: hodinySpanek, odpocaty, spankoveNavyky, problemySpanek
**Nutrition**: pocetJidel, typJidel, castostMaso, pravidelnost, voda, zachvaty, spokojenostJidlo
**History**: minuleDiety, fungovaloNefungovalo, vztahKJidlu
**Psychology**: aktualniStres, hlavniStresor, ritualyRelaxace, koureniAlkohol, volnyCas, podporaOkoli
**Notes**: zaznamJidelnicku
**Motivation**: duvodPoradenstvi, ocekavani, pripravenost, prekazy

Your Prisma integration is now complete and production-ready! 🚀
