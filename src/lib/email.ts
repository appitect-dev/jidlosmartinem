import {Resend} from 'resend';
import {prisma} from '@/lib/prisma';
import { createClientGoogleDoc } from '@/lib/google-docs';

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
    googleDocUrl?: string; // Optional Google Doc URL
    raynetClientId?: number; // Optional Raynet client ID
}

/**
 * Send a generic email using Resend
 */
export async function sendEmail({to, subject, html, from = 'info@jidlosmartinem.cz'}: EmailData) {
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
        return {success: true, id: result.data?.id};
    } catch (error) {
        console.error('Failed to send email:', error);
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
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
    dotaznikData,
    googleDocUrl
}: DotaznikEmailData) {
    const subject = `Nová rezervace konzultace - ${inviteeName}`;

    const html = generateBookingEmailHTML({
        inviteeName,
        inviteeEmail,
        eventStartTime,
        eventName,
        sessionId,
        dotaznikData,
        googleDocUrl
    });    // Send only to Martin
    const result = await sendEmail({
        to: 'martin@cidlinsky.com',
        //to: 'jan.vandlicek@appitect.eu',
        subject,
        html,
        from: 'info@jidlosmartinem.cz'
    });

    console.log('Booking notification sent to Martin:', result);
    return result;
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
                                      dotaznikData,
                                      googleDocUrl,
                                      raynetClientId
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

    const googleDocSection = googleDocUrl ? `
      <div class="section" style="background: #E8F5E8; border: 2px solid #4CAF50;">
        <h3>📄 Google Dokument klienta</h3>
        <div class="field"><strong>Odkaz na dokument:</strong> <a href="${googleDocUrl}" target="_blank" style="color: #2E7D32; font-weight: bold;">${googleDocUrl}</a></div>
        <p style="color: #2E7D32; font-weight: bold;">✅ Dokument s kompletními daty dotazníku je připraven pro konzultaci!</p>
      </div>
    ` : '';

    const raynetSection = raynetClientId ? `
      <div class="section" style="background: #E3F2FD; border: 2px solid #2196F3;">
        <h3>🏢 Raynet CRM</h3>
        <div class="field"><strong>Client ID:</strong> <span style="color: #1976D2; font-weight: bold;">${raynetClientId}</span></div>
        <p style="color: #1976D2; font-weight: bold;">✅ Klient byl automaticky vytvořen v CRM systému!</p>
      </div>
    ` : '';

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
        .goals { background: #E8F5E8; }
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

      ${googleDocSection}

      ${raynetSection}

      <div class="section">
        <h3>📋 Základní informace</h3>
        <div class="field"><strong>Jméno:</strong> ${dotaznikData.jmeno || 'Neuvedeno'}</div>
        <div class="field"><strong>Email:</strong> ${dotaznikData.email || 'Neuvedeno'}</div>
        <div class="field"><strong>Telefon:</strong> ${dotaznikData.telefon || 'Neuvedeno'}</div>
      </div>

      <div class="section goals">
        <h3>🎯 Cíle</h3>
        <div class="field"><strong>Hlavní cíl:</strong> ${dotaznikData.hlavniCil || 'Neuvedeno'}</div>
      </div>

      <div class="section">
        <h3>💭 Motivace a očekávání</h3>
        <div class="field"><strong>Důvod poradenství:</strong> ${dotaznikData.duvodPoradenstvi || 'Neuvedeno'}</div>
        <div class="field"><strong>Připravenost na změnu:</strong> ${dotaznikData.pripravenost || 'Neuvedeno'}/10</div>
      </div>

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
        <p><strong>Email:</strong> info@jidlosmartinem.cz</p>
        
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
 * Send notification email to Martin only
 */
export async function sendTeamNotificationEmail(subject: string, html: string) {
    // Send only to Martin
    const result = await sendEmail({
        to: 'martin@cidlinsky.com',
        //to: 'jan.vandlicek@appitect.eu',
        subject: `[Jídlo s Martinem] ${subject}`,
        html,
        from: 'info@jidlosmartinem.cz'
    });

    console.log('Team notification sent to Martin:', result);
    return [result];
}

/**
 * Send form submission notification to the team
 */
export async function sendFormSubmissionNotification(clientName: string, clientEmail: string, sessionId: string) {
    const subject = `Nový dotazník vyplněn - ${clientName}`;

    // Fetch the complete form data from database using sessionId
    const dotaznikData = await prisma.dotaznik.findFirst({
        where: {sessionId: sessionId}
    });

    if (!dotaznikData) {
        console.error(`No dotaznik data found for sessionId: ${sessionId}`);
        return await sendTeamNotificationEmail(subject, `
      <p>Nebyla nalezena data dotazníku pro Session ID: ${sessionId}</p>
      <p>Klient: ${clientName} (${clientEmail})</p>
    `);
    }

    // Create Google Doc for the client
    let googleDocInfo = '';
    let raynetInfo = '';
    try {
        const docResult = await createClientGoogleDoc(sessionId);
        if (docResult.success && docResult.documentUrl) {
            googleDocInfo = `
        <div class="section" style="background: #E8F5E8; padding: 15px; border: 1px solid #4CAF50; border-radius: 8px; margin: 20px 0;">
          <h3>📄 Google Dokument vytvořen</h3>
          <div class="field"><strong>Odkaz na dokument:</strong> <a href="${docResult.documentUrl}" target="_blank">${docResult.documentUrl}</a></div>
          <p style="font-size: 14px; color: #666;">Dokument obsahuje všechna data z dotazníku a je připraven pro konzultaci.</p>
        </div>
        `;
            console.log(`Google Doc created for client ${clientEmail}: ${docResult.documentUrl}`);
            
            // Add Raynet info if client was created
            if (docResult.raynetClientId) {
                raynetInfo = `
        <div class="section" style="background: #E3F2FD; padding: 15px; border: 1px solid #2196F3; border-radius: 8px; margin: 20px 0;">
          <h3>🏢 Raynet CRM klient vytvořen</h3>
          <div class="field"><strong>Client ID:</strong> ${docResult.raynetClientId}</div>
          <p style="font-size: 14px; color: #666;">Klient byl automaticky vytvořen v CRM systému s odkazem na Google dokument.</p>
        </div>
        `;
                console.log(`Raynet client created for ${clientEmail} with ID: ${docResult.raynetClientId}`);
            }
        } else {
            console.error('Failed to create Google Doc:', docResult.error);
            googleDocInfo = `
        <div class="section" style="background: #FFE5E5; padding: 15px; border: 1px solid #FF6B6B; border-radius: 8px; margin: 20px 0;">
          <h3>⚠️ Chyba při vytváření Google dokumentu</h3>
          <p>Nepodařilo se vytvořit Google dokument: ${docResult.error || 'Neznámá chyba'}</p>
        </div>
        `;
        }
    } catch (error) {
        console.error('Error creating Google Doc:', error);
        googleDocInfo = `
      <div class="section" style="background: #FFE5E5; padding: 15px; border: 1px solid #FF6B6B; border-radius: 8px; margin: 20px 0;">
        <h3>⚠️ Chyba při vytváření Google dokumentu</h3>
        <p>Nepodařilo se vytvořit Google dokument: ${error instanceof Error ? error.message : 'Neznámá chyba'}</p>
      </div>
      `;
    }

    const html = `
    <!DOCTYPE html>
    <html lang="cs">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nový dotazník vyplněn</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
        .section { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
        .section h3 { margin-top: 0; color: #4CAF50; }
        .field { margin-bottom: 10px; }
        .field strong { color: #2E7D32; }
        .basic-info { background: #F3E5F5; }
        .goals { background: #E8F5E8; }
        .health-info { background: #FFF3E0; }
        .body-composition { background: #E3F2FD; }
        .sleep-info { background: #FCE4EC; }
        .eating-habits { background: #F1F8E9; }
        .eating-history { background: #FFF8E1; }
        .psychology { background: #E8EAF6; }
        .food-diary { background: #EFEBE9; }
        .motivation { background: #E0F2F1; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 8px; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🥗 Jídlo s Martinem</h1>
        <h2>Nový dotazník vyplněn</h2>
        <p><strong>Klient:</strong> ${clientName} (${clientEmail})</p>
        <p><strong>Datum:</strong> ${new Date().toLocaleString('cs-CZ')}</p>
        <p><strong>Session ID:</strong> ${sessionId}</p>
      </div>

      ${googleDocInfo}

      ${raynetInfo}

      <div class="section basic-info">
        <h3>👤 Základní údaje</h3>
        <div class="field"><strong>Jméno:</strong> ${dotaznikData.jmeno || 'Neuvedeno'}</div>
        <div class="field"><strong>Email:</strong> ${dotaznikData.email || 'Neuvedeno'}</div>
        <div class="field"><strong>Telefon:</strong> ${dotaznikData.telefon || 'Neuvedeno'}</div>
        <div class="field"><strong>Věk:</strong> ${dotaznikData.vek || 'Neuvedeno'}</div>
        <div class="field"><strong>Výška:</strong> ${dotaznikData.vyska ? dotaznikData.vyska + ' cm' : 'Neuvedeno'}</div>
        <div class="field"><strong>Hmotnost:</strong> ${dotaznikData.hmotnost ? dotaznikData.hmotnost + ' kg' : 'Neuvedeno'}</div>
        <div class="field"><strong>Pohlaví:</strong> ${dotaznikData.pohlavi || 'Neuvedeno'}</div>
      </div>

      <div class="section goals">
        <h3>🎯 Cíle klienta</h3>
        <div class="field"><strong>Hlavní cíl:</strong> ${dotaznikData.hlavniCil || 'Neuvedeno'}</div>
        ${dotaznikData.vedlejsiCile ? `<div class="field"><strong>Vedlejší cíle:</strong> ${dotaznikData.vedlejsiCile}</div>` : ''}
        ${dotaznikData.terminalCile ? `<div class="field"><strong>Terminální cíle:</strong> ${dotaznikData.terminalCile}</div>` : ''}
      </div>

      <div class="section health-info">
        <h3>🏥 Zdravotní stav</h3>
        ${dotaznikData.zdravotniDiagnozy ? `<div class="field"><strong>Zdravotní diagnózy:</strong> ${dotaznikData.zdravotniDiagnozy}</div>` : ''}
        ${dotaznikData.lekyDoplnky ? `<div class="field"><strong>Léky a doplňky:</strong> ${dotaznikData.lekyDoplnky}</div>` : ''}
        ${dotaznikData.alergie ? `<div class="field"><strong>Alergie:</strong> ${dotaznikData.alergie}</div>` : ''}
        <div class="field"><strong>Celkový zdravotní stav:</strong> ${dotaznikData.zdravotniStav || 'Neuvedeno'}</div>
        ${dotaznikData.krevniTesty ? `<div class="field"><strong>Krevní testy:</strong> ${dotaznikData.krevniTesty}</div>` : ''}
        ${dotaznikData.bolesti ? `<div class="field"><strong>Bolesti:</strong> ${dotaznikData.bolesti}</div>` : ''}
      </div>

      <div class="section body-composition">
        <h3>🏋️‍♂️ Tělesná kompozice a pohyb</h3>
        ${dotaznikData.telesnaKonstituce ? `<div class="field"><strong>Tělesná konstituce:</strong> ${dotaznikData.telesnaKonstituce}</div>` : ''}
        ${dotaznikData.pohybovyRezim ? `<div class="field"><strong>Pohybový režim:</strong> ${dotaznikData.pohybovyRezim}</div>` : ''}
        ${dotaznikData.tydennieakitivty ? `<div class="field"><strong>Týdenní aktivity:</strong> ${dotaznikData.tydennieakitivty}</div>` : ''}
        ${dotaznikData.sedaveZamestnani ? `<div class="field"><strong>Sedavé zaměstnání:</strong> ${dotaznikData.sedaveZamestnani}</div>` : ''}
        ${dotaznikData.pohybovaOmezeni ? `<div class="field"><strong>Pohybová omezení:</strong> ${dotaznikData.pohybovaOmezeni}</div>` : ''}
      </div>

      <div class="section sleep-info">
        <h3>😴 Spánek</h3>
        ${dotaznikData.hodinySpanek ? `<div class="field"><strong>Hodiny spánku:</strong> ${dotaznikData.hodinySpanek}</div>` : ''}
        ${dotaznikData.odpocaty ? `<div class="field"><strong>Odpočatý po probuzení:</strong> ${dotaznikData.odpocaty}</div>` : ''}
        ${dotaznikData.spankoveNavyky ? `<div class="field"><strong>Spánkové návyky:</strong> ${dotaznikData.spankoveNavyky}</div>` : ''}
        ${dotaznikData.problemySpanek ? `<div class="field"><strong>Problémy se spánkem:</strong> ${dotaznikData.problemySpanek}</div>` : ''}
      </div>

      <div class="section eating-habits">
        <h3>🍽️ Stravovací návyky</h3>
        ${dotaznikData.pocetJidel ? `<div class="field"><strong>Počet jídel denně:</strong> ${dotaznikData.pocetJidel}</div>` : ''}
        ${dotaznikData.typJidel ? `<div class="field"><strong>Typ jídel:</strong> ${dotaznikData.typJidel}</div>` : ''}
        ${dotaznikData.castostMaso ? `<div class="field"><strong>Četnost masa:</strong> ${dotaznikData.castostMaso}</div>` : ''}
        ${dotaznikData.pravidelnost ? `<div class="field"><strong>Pravidelnost jídel:</strong> ${dotaznikData.pravidelnost}</div>` : ''}
        ${dotaznikData.voda ? `<div class="field"><strong>Pitný režim:</strong> ${dotaznikData.voda}</div>` : ''}
        ${dotaznikData.zachvaty ? `<div class="field"><strong>Záchvaty hladu/přejídání:</strong> ${dotaznikData.zachvaty}</div>` : ''}
        ${dotaznikData.spokojenostJidlo ? `<div class="field"><strong>Spokojenost s jídlem:</strong> ${dotaznikData.spokojenostJidlo}</div>` : ''}
      </div>

      <div class="section eating-history">
        <h3>📋 Stravovací minulost</h3>
        ${dotaznikData.minuleDiety ? `<div class="field"><strong>Minulé diety:</strong> ${dotaznikData.minuleDiety}</div>` : ''}
        ${dotaznikData.fungovaloNefungovalo ? `<div class="field"><strong>Co fungovalo/nefungovalo:</strong> ${dotaznikData.fungovaloNefungovalo}</div>` : ''}
        ${dotaznikData.vztahKJidlu ? `<div class="field"><strong>Vztah k jídlu:</strong> ${dotaznikData.vztahKJidlu}</div>` : ''}
      </div>

      <div class="section psychology">
        <h3>🧠 Psychika a životní styl</h3>
        ${dotaznikData.aktualniStres ? `<div class="field"><strong>Aktuální stres:</strong> ${dotaznikData.aktualniStres}</div>` : ''}
        ${dotaznikData.hlavniStresor ? `<div class="field"><strong>Hlavní stresor:</strong> ${dotaznikData.hlavniStresor}</div>` : ''}
        ${dotaznikData.ritualyRelaxace ? `<div class="field"><strong>Rituály relaxace:</strong> ${dotaznikData.ritualyRelaxace}</div>` : ''}
        ${dotaznikData.koureniAlkohol ? `<div class="field"><strong>Kouření/alkohol:</strong> ${dotaznikData.koureniAlkohol}</div>` : ''}
        ${dotaznikData.volnyCas ? `<div class="field"><strong>Volný čas:</strong> ${dotaznikData.volnyCas}</div>` : ''}
        ${dotaznikData.podporaOkoli ? `<div class="field"><strong>Podpora okolí:</strong> ${dotaznikData.podporaOkoli}</div>` : ''}
      </div>

      ${dotaznikData.zaznamJidelnicku ? `
      <div class="section food-diary">
        <h3>📝 Záznam jídelníčku</h3>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; white-space: pre-line;">${dotaznikData.zaznamJidelnicku}</div>
      </div>
      ` : ''}

      <div class="section motivation">
        <h3>💭 Motivace a očekávání</h3>
        <div class="field"><strong>Důvod poradenství:</strong> ${dotaznikData.duvodPoradenstvi || 'Neuvedeno'}</div>
        ${dotaznikData.ocekavani ? `<div class="field"><strong>Očekávání:</strong> ${dotaznikData.ocekavani}</div>` : ''}
        <div class="field"><strong>Připravenost:</strong> ${dotaznikData.pripravenost || 'Neuvedeno'}</div>
        ${dotaznikData.prekazy ? `<div class="field"><strong>Překáže:</strong> ${dotaznikData.prekazy}</div>` : ''}
      </div>

      <div class="footer">
        <p><strong>Session ID:</strong> ${sessionId}</p>
        <p>Klient bude přesměrován na rezervaci konzultace.</p>
        <p>Tento email obsahuje všechna data z vyplněného dotazníku.</p>
      </div>
    </body>
    </html>
  `;

    return await sendTeamNotificationEmail(subject, html);
}
