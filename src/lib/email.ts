import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

// Get the type from Prisma client
type DotaznikType = Awaited<ReturnType<typeof prisma.dotaznik.findFirst>>;

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface DotaznikEmailData {
  inviteeName: string;
  inviteeEmail: string;
  eventStartTime: string;
  eventName: string;
  sessionId: string;
  dotaznikData: NonNullable<DotaznikType>;
}

/**
 * Send a generic email using Resend
 */
export async function sendEmail({ to, subject, html, from = 'info@jidlosmartinem.cz' }: EmailData) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    console.log('Email sent successfully:', result);
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Send notification email about new consultation booking with dotaznik data
 */
export async function sendBookingNotificationEmail({
  inviteeName,
  inviteeEmail,
  eventStartTime,
  eventName,
  sessionId,
  dotaznikData
}: DotaznikEmailData) {
  const subject = `Nová rezervace konzultace - ${inviteeName}`;
  
  const html = generateBookingEmailHTML({
    inviteeName,
    inviteeEmail,
    eventStartTime,
    eventName,
    sessionId,
    dotaznikData
  });

  // Prepare email recipients
  const recipients: string[] = [
    process.env.MARTIN_EMAIL || 'martin@jidlosmartinem.cz',
    process.env.ADAM_EMAIL,
    process.env.VANDL_EMAIL
  ].filter((email): email is string => Boolean(email)); // Remove any undefined values

  // Send to all recipients
  const results = await Promise.allSettled(
    recipients.map(recipient => 
      sendEmail({
        to: recipient,
        subject,
        html,
        from: 'info@jidlosmartinem.cz'
      })
    )
  );

  // Log results
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`Email sent successfully to ${recipients[index]}`);
    } else {
      console.error(`Failed to send email to ${recipients[index]}:`, result.reason);
    }
  });

  // Return the first result (Martin's email) for backward compatibility
  const martinResult = results[0];
  return martinResult.status === 'fulfilled' ? martinResult.value : { success: false, error: 'Failed to send to Martin' };
}

/**
 * Generate HTML content for booking notification email
 */
function generateBookingEmailHTML({
  inviteeName,
  inviteeEmail,
  eventStartTime,
  eventName,
  sessionId,
  dotaznikData
}: DotaznikEmailData): string {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('cs-CZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return `
    <!DOCTYPE html>
    <html lang="cs">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nová rezervace konzultace</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .section { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
        .section h3 { margin-top: 0; color: #4CAF50; }
        .field { margin-bottom: 10px; }
        .field strong { color: #2E7D32; }
        .health-info { background: #FFF3E0; }
        .goals { background: #E8F5E8; }
        .lifestyle { background: #F3E5F5; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🥗 Nová rezervace konzultace</h1>
        <p><strong>Klient:</strong> ${inviteeName} (${inviteeEmail})</p>
        <p><strong>Termín:</strong> ${formatDate(eventStartTime)}</p>
        <p><strong>Typ konzultace:</strong> ${eventName}</p>
      </div>

      <div class="section">
        <h3>📋 Základní informace</h3>
        <div class="field"><strong>Jméno:</strong> ${dotaznikData.jmeno || 'Neuvedeno'}</div>
        <div class="field"><strong>Email:</strong> ${dotaznikData.email || 'Neuvedeno'}</div>
        <div class="field"><strong>Telefon:</strong> ${dotaznikData.telefon || 'Neuvedeno'}</div>
        <div class="field"><strong>Věk:</strong> ${dotaznikData.vek || 'Neuvedeno'}</div>
        <div class="field"><strong>Výška:</strong> ${dotaznikData.vyska ? dotaznikData.vyska + ' cm' : 'Neuvedeno'}</div>
        <div class="field"><strong>Hmotnost:</strong> ${dotaznikData.hmotnost ? dotaznikData.hmotnost + ' kg' : 'Neuvedeno'}</div>
        <div class="field"><strong>Pohlaví:</strong> ${dotaznikData.pohlavi || 'Neuvedeno'}</div>
      </div>

      <div class="section goals">
        <h3>🎯 Cíle</h3>
        <div class="field"><strong>Hlavní cíl:</strong> ${dotaznikData.hlavniCil || 'Neuvedeno'}</div>
        ${dotaznikData.vedlejsiCile ? `<div class="field"><strong>Vedlejší cíle:</strong> ${dotaznikData.vedlejsiCile}</div>` : ''}
        ${dotaznikData.terminalCile ? `<div class="field"><strong>Terminální cíle:</strong> ${dotaznikData.terminalCile}</div>` : ''}
      </div>

      <div class="section health-info">
        <h3>🏥 Zdravotní informace</h3>
        ${dotaznikData.zdravotniDiagnozy ? `<div class="field"><strong>Zdravotní diagnózy:</strong> ${dotaznikData.zdravotniDiagnozy}</div>` : ''}
        ${dotaznikData.lekyDoplnky ? `<div class="field"><strong>Léky a doplňky:</strong> ${dotaznikData.lekyDoplnky}</div>` : ''}
        ${dotaznikData.alergie ? `<div class="field"><strong>Alergie:</strong> ${dotaznikData.alergie}</div>` : ''}
        <div class="field"><strong>Celkový zdravotní stav:</strong> ${dotaznikData.zdravotniStav || 'Neuvedeno'}</div>
        ${dotaznikData.bolesti ? `<div class="field"><strong>Bolesti:</strong> ${dotaznikData.bolesti}</div>` : ''}
      </div>

      <div class="section lifestyle">
        <h3>🏃‍♂️ Životní styl</h3>
        <div class="field"><strong>Pohybový režim:</strong> ${dotaznikData.pohybovyRezim || 'Neuvedeno'}</div>
        <div class="field"><strong>Hodiny spánku:</strong> ${dotaznikData.hodinySpanek || 'Neuvedeno'}</div>
        <div class="field"><strong>Počet jídel denně:</strong> ${dotaznikData.pocetJidel || 'Neuvedeno'}</div>
        <div class="field"><strong>Typ jídel:</strong> ${dotaznikData.typJidel || 'Neuvedeno'}</div>
        ${dotaznikData.aktualniStres ? `<div class="field"><strong>Aktuální stres:</strong> ${dotaznikData.aktualniStres}</div>` : ''}
      </div>

      <div class="section">
        <h3>💭 Motivace a očekávání</h3>
        <div class="field"><strong>Důvod poradenství:</strong> ${dotaznikData.duvodPoradenstvi || 'Neuvedeno'}</div>
        ${dotaznikData.ocekavani ? `<div class="field"><strong>Očekávání:</strong> ${dotaznikData.ocekavani}</div>` : ''}
        <div class="field"><strong>Pripravenost:</strong> ${dotaznikData.pripravenost || 'Neuvedeno'}</div>
      </div>

      ${dotaznikData.zaznamJidelnicku ? `
      <div class="section">
        <h3>📝 Záznam jídelníčku</h3>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; white-space: pre-line;">${dotaznikData.zaznamJidelnicku}</div>
      </div>
      ` : ''}

      <div class="footer">
        <p><strong>Session ID:</strong> ${sessionId}</p>
        <p>Tento email byl vygenerován automaticky po rezervaci konzultace přes Calendly.</p>
        <p>Pro zobrazení kompletních dat můžete použít databázový dotaz se Session ID výše.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send welcome email to client after booking
 */
export async function sendWelcomeEmail(inviteeName: string, inviteeEmail: string, eventStartTime: string) {
  const subject = `Potvrzení rezervace konzultace - ${inviteeName}`;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('cs-CZ', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const html = `
    <!DOCTYPE html>
    <html lang="cs">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Potvrzení rezervace</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .content { padding: 20px; }
        .highlight { background: #E8F5E8; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 8px; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🥗 Jídlo s Martinem</h1>
        <h2>Potvrzení rezervace konzultace</h2>
      </div>
      
      <div class="content">
        <p>Dobrý den ${inviteeName},</p>
        
        <p>děkujeme za rezervaci konzultace! Vaše rezervace byla úspěšně potvrzena.</p>
        
        <div class="highlight">
          <h3>📅 Detaily konzultace:</h3>
          <p><strong>Datum a čas:</strong> ${formatDate(eventStartTime)}</p>
          <p><strong>Klient:</strong> ${inviteeName}</p>
          <p><strong>Email:</strong> ${inviteeEmail}</p>
        </div>
        
        <h3>📋 Co dál?</h3>
        <ul>
          <li>Připravte si případné dotazy, které byste chtěli probrat</li>
          <li>Vezměte si s sebou výsledky případných zdravotních vyšetření</li>
          <li>Buďte připraveni diskutovat o svých stravovacích návycích</li>
        </ul>
        
        <h3>📞 Kontakt</h3>
        <p>V případě jakýchkoli dotazů nebo potřeby změny termínu mě neváhejte kontaktovat:</p>
        <p><strong>Email:</strong> martin@jidlosmartinem.cz</p>
        
        <p>Těším se na naše setkání!</p>
        <p><strong>Martin</strong><br>Výživový poradce</p>
      </div>
      
      <div class="footer">
        <p>🌱 Jídlo s Martinem - Váš průvodce zdravou výživou</p>
        <p>Tento email byl vygenerován automaticky po rezervaci konzultace.</p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: inviteeEmail,
    subject,
    html,
    from: 'info@jidlosmartinem.cz'
  });
}

/**
 * Send notification email to the entire team (Martin, Adam, Vandl)
 */
export async function sendTeamNotificationEmail(subject: string, html: string) {
  const recipients: string[] = [
    process.env.MARTIN_EMAIL || 'martin@jidlosmartinem.cz',
    process.env.ADAM_EMAIL,
    process.env.VANDL_EMAIL
  ].filter((email): email is string => Boolean(email));

  const results = await Promise.allSettled(
    recipients.map(recipient => 
      sendEmail({
        to: recipient,
        subject: `[Jídlo s Martinem] ${subject}`,
        html,
        from: 'info@jidlosmartinem.cz'
      })
    )
  );

  // Log results
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`Team notification sent successfully to ${recipients[index]}`);
    } else {
      console.error(`Failed to send team notification to ${recipients[index]}:`, result.reason);
    }
  });

  return results;
}
