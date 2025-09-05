import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { saveDotaznik, CreateDotaznikData } from '@/lib/queries';
import { sendEmail, sendFormSubmissionNotification } from '@/lib/email';

// Type definition for the simplified form data
interface DotaznikFormData {
  // Základní údaje
  jmeno: string;
  email: string;
  telefon: string;

  // Cíl klienta
  hlavniCil: string;

  // Motivace a očekávání
  duvodPoradenstvi: string;
  pripravenost: string;
}

// In-memory storage for development - replace with actual database
// const dotaznikStorage = new Map<string, DotaznikFormData & { sessionId: string; createdAt: Date }>();

// Mock function to save dotaznik data - replace with your actual database implementation
async function saveDotaznikData(sessionId: string, formData: DotaznikFormData) {
  // Convert simplified form data to database format
  const numericData: CreateDotaznikData = {
    sessionId,
    jmeno: formData.jmeno,
    email: formData.email,
    telefon: formData.telefon || undefined,
    hlavniCil: formData.hlavniCil || undefined,
    duvodPoradenstvi: formData.duvodPoradenstvi || undefined,
    pripravenost: formData.pripravenost || undefined,
    // All other fields will be undefined/null since they're not in the simplified form
  };

  // Save to database using Prisma
  const result = await saveDotaznik(numericData);
  console.log('Dotaznik data saved with sessionId:', sessionId);
  return result.sessionId;
}

// Validation function
function validateFormData(data: Partial<DotaznikFormData>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Required fields validation - simplified to only 6 fields
  const requiredFields = [
    { field: 'jmeno' as keyof DotaznikFormData, name: 'Jméno' },
    { field: 'email' as keyof DotaznikFormData, name: 'Email' },
    { field: 'telefon' as keyof DotaznikFormData, name: 'Telefon' },
    { field: 'hlavniCil' as keyof DotaznikFormData, name: 'Hlavní cíl' },
    { field: 'duvodPoradenstvi' as keyof DotaznikFormData, name: 'Důvod poradenství' },
    { field: 'pripravenost' as keyof DotaznikFormData, name: 'Připravenost' }
  ];
  
  for (const { field, name } of requiredFields) {
    const value = data[field];
    if (!value || value.trim() === '') {
      errors.push(`${name} je povinné pole`);
    }
  }
  
  // Email validation
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Neplatný email formát');
  }
  
  // Pripravenost validation (should be 0-10)
  if (data.pripravenost && (isNaN(Number(data.pripravenost)) || parseInt(data.pripravenost) < 0 || parseInt(data.pripravenost) > 10)) {
    errors.push('Připravenost musí být číslo mezi 0 a 10');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Generate confirmation email HTML
function generateConfirmationEmail(jmeno: string, sessionId: string): string {
  return `
    <!DOCTYPE html>
    <html lang="cs">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Potvrzení vyplnění dotazníku</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .content { padding: 20px; }
        .highlight { background: #E8F5E8; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 8px; font-size: 14px; }
        .next-steps { background: #FFF3E0; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🥗 Jídlo s Martinem</h1>
        <h2>Děkujeme za vyplnění dotazníku!</h2>
      </div>
      
      <div class="content">
        <p>Dobrý den ${jmeno},</p>
        
        <p>děkujeme za důvěru a vyplnění komplexního dotazníku. Vaše odpovědi nám pomohou připravit co nejlepší individuální konzultaci.</p>
        
        <div class="highlight">
          <h3>✅ Co se stalo:</h3>
          <ul>
            <li>Váš dotazník byl úspěšně uložen</li>
            <li>Všechna data jsou v bezpečí</li>
            <li>Martin má k dispozici všechny potřebné informace</li>
          </ul>
        </div>
        
        <div class="next-steps">
          <h3>🗓️ Další kroky:</h3>
          <ol>
            <li><strong>Rezervujte si konzultaci</strong> - Pokud jste tak ještě neučinili, rezervujte si termín konzultace</li>
            <li><strong>Připravte se na setkání</strong> - Můžete si připravit dodatečné dotazy</li>
            <li><strong>Vezměte si dokumenty</strong> - Pokud máte výsledky zdravotních vyšetření, vezměte je s sebou</li>
          </ol>
        </div>
        
        <p>Na základě vašich odpovědí si Martin připraví individuální plán a doporučení, která prodiskutujeme při osobní konzultaci.</p>
        
        <h3>📞 Máte dotazy?</h3>
        <p>V případě jakýchkoli dotazů nebo potřeby upřesnění něčeho z dotazníku se neváhejte ozvat:</p>
        <p><strong>Email:</strong> info@jidlosmartinem.cz</p>
        
        <p>Těším se na naše setkání!</p>
        <p><strong>Martin</strong><br>Výživový poradce</p>
      </div>
      
      <div class="footer">
        <p>🌱 Jídlo s Martinem - Váš průvodce zdravou výživou</p>
        <p><small>Session ID: ${sessionId}</small></p>
        <p><small>Tento email byl vygenerován automaticky po vyplnění dotazníku.</small></p>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const formData: DotaznikFormData = await request.json();
    
    console.log('Received dotaznik submission:', {
      jmeno: formData.jmeno,
      email: formData.email,
      timestamp: new Date().toISOString()
    });
    
    // Validate the form data
    const validation = validateFormData(formData);
    
    if (!validation.isValid) {
      return NextResponse.json({
        error: 'Validation failed',
        errors: validation.errors
      }, { status: 400 });
    }
    
    // Generate a unique session ID
    const sessionId = randomUUID();
    
    // Save the dotaznik data
    try {
      await saveDotaznikData(sessionId, formData);
      
      console.log(`Dotaznik successfully saved with sessionId: ${sessionId}`);
      
      // Send confirmation email to the client
      try {
        const confirmationResult = await sendEmail({
          to: formData.email,
          subject: 'Potvrzení vyplnění dotazníku - Jídlo s Martinem',
          html: generateConfirmationEmail(formData.jmeno, sessionId),
          from: 'info@jidlosmartinem.cz'
        });

        if (confirmationResult.success) {
          console.log('Confirmation email sent successfully to:', formData.email);
        } else {
          console.error('Failed to send confirmation email:', confirmationResult.error);
        }
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the form submission if email fails
      }

      // Send notification to the team (Martin, Adam, Vandl)
      try {
        await sendFormSubmissionNotification(formData.jmeno, formData.email, sessionId);
        console.log('Team notification sent successfully');
      } catch (emailError) {
        console.error('Error sending team notification:', emailError);
        // Don't fail the form submission if email fails
      }
      
      return NextResponse.json({
        success: true,
        sessionId,
        message: 'Dotazník byl úspěšně uložen'
      }, { status: 200 });
      
    } catch (saveError) {
      console.error('Error saving dotaznik data:', saveError);
      
      return NextResponse.json({
        error: 'Database error',
        message: 'Nepodařilo se uložit data dotazníku'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error processing dotaznik submission:', error);
    
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Nepodařilo se zpracovat dotazník'
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
