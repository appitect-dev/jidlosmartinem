import { google } from "googleapis";
import { prisma } from '@/lib/prisma';
import { createRaynetClient } from './raynet-crm';

// Get the type from Prisma client
type DotaznikType = Awaited<ReturnType<typeof prisma.dotaznik.findFirst>>;

// Initialize OAuth2 client
function getOAuth2Client() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Google OAuth credentials not configured');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // Set refresh token if available
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
  }

  return oauth2Client;
}

// Initialize Google APIs with OAuth2
let docs: ReturnType<typeof google.docs> | null = null;
let drive: ReturnType<typeof google.drive> | null = null;

try {
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_REFRESH_TOKEN) {
    const auth = getOAuth2Client();
    docs = google.docs({ version: "v1", auth });
    drive = google.drive({ version: "v3", auth });
    console.log('✅ Google APIs initialized with OAuth2');
  } else {
    console.warn('⚠️ Google OAuth credentials not complete');
  }
} catch (error) {
  console.error('❌ Failed to initialize Google APIs:', error);
}

/**
 * Create a Google Doc with client's form data using OAuth2
 */
export async function createClientGoogleDoc(sessionId: string): Promise<{ 
  success: boolean; 
  documentId?: string; 
  documentUrl?: string; 
  raynetClientId?: number;
  error?: string 
}> {
  try {
    console.log('🔍 Starting Google Doc creation for sessionId:', sessionId);
    
    // Check if Google OAuth is configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REFRESH_TOKEN) {
      console.error('❌ Google OAuth not configured');
      return { success: false, error: 'Google OAuth not configured' };
    }

    // Check if Google APIs are initialized
    if (!docs) {
      console.warn('❌ Google Docs API not initialized');
      return { success: false, error: 'Google APIs not configured' };
    }

    // Test OAuth2 authentication
    try {
      const auth = getOAuth2Client();
      await auth.getAccessToken();
      console.log('✅ OAuth2 token obtained successfully');
    } catch (authError) {
      console.error('❌ OAuth2 authentication failed:', authError);
      return { success: false, error: 'OAuth2 authentication failed' };
    }

    console.log('🔍 Fetching dotaznik data for sessionId:', sessionId);
    
    // Fetch the complete form data from database
    const dotaznikData = await prisma.dotaznik.findFirst({
      where: { sessionId: sessionId }
    });

    if (!dotaznikData) {
      console.error(`No dotaznik data found for sessionId: ${sessionId}`);
      return { success: false, error: 'No form data found' };
    }

    // Create document title with client email
    const documentTitle = `Dotazník - ${dotaznikData.email} - ${new Date().toLocaleDateString('cs-CZ')}`;

    console.log('🔍 Creating Google Doc with title:', documentTitle);

    let documentId: string;

    // If we have a folder ID, create the document directly in that folder
    if (process.env.GOOGLE_DRIVE_FOLDER_ID && drive) {
      console.log('🔍 Creating document in folder:', process.env.GOOGLE_DRIVE_FOLDER_ID);
      
      // Use Drive API to create document in specific folder
      const driveCreateResponse = await drive.files.create({
        requestBody: {
          name: documentTitle,
          parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
          mimeType: 'application/vnd.google-apps.document'
        }
      });

      const folderDocumentId = driveCreateResponse.data.id;
      if (!folderDocumentId) {
        return { success: false, error: 'Failed to get document ID from Google Drive' };
      }

      documentId = folderDocumentId;
      console.log('✅ Document created in folder with ID:', documentId);

    } else {
      // Fallback: Create in root
      console.log('🔍 Creating document in root (no folder specified)');
      
      const createResponse = await docs.documents.create({
        requestBody: {
          title: documentTitle,
        },
      });

      const rootDocumentId = createResponse.data.documentId;
      if (!rootDocumentId) {
        return { success: false, error: 'Failed to create document' };
      }

      documentId = rootDocumentId;
      console.log('✅ Document created with ID:', documentId);
    }

    // Generate content for the document
    const documentContent = generateDocumentContent(dotaznikData);

    console.log('🔍 Inserting content into document...');

    // Insert content into the document
    await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: {
                index: 1,
              },
              text: documentContent,
            },
          },
        ],
      },
    });

    console.log('✅ Content added to document');

    // Make document accessible (optional - sets sharing to anyone with link can view)
    if (drive) {
      try {
        await drive.permissions.create({
          fileId: documentId,
          requestBody: {
            role: 'reader',
            type: 'anyone'
          }
        });
        console.log('✅ Document sharing enabled');
      } catch (shareError) {
        console.warn('⚠️ Failed to set document sharing:', shareError);
        // Continue anyway
      }
    }

    const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;
    
    console.log(`✅ Google Doc created successfully: ${documentUrl}`);

    // Create client in Raynet CRM with Google Doc URL
    let raynetClientId: number | undefined;
    if (process.env.RAYNET_USERNAME && process.env.RAYNET_API_KEY) {
      console.log('🔍 Creating client in Raynet CRM...');
      
      // Extract first and last name from jmeno field
      const fullName = dotaznikData.jmeno || '';
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      try {
        const raynetResult = await createRaynetClient({
          firstName,
          lastName,
          email: dotaznikData.email || '',
          googleDocUrl: documentUrl
        });

        if (raynetResult.success && raynetResult.clientId) {
          raynetClientId = raynetResult.clientId;
          console.log('✅ Raynet client created with ID:', raynetClientId);
        } else {
          console.warn('⚠️ Failed to create Raynet client:', raynetResult.error);
          // Continue anyway - Google Doc was created successfully
        }
      } catch (raynetError) {
        console.warn('⚠️ Raynet client creation failed:', raynetError);
        // Continue anyway - Google Doc was created successfully
      }
    } else {
      console.log('ℹ️ Raynet credentials not configured, skipping CRM integration');
    }
    
    return { 
      success: true, 
      documentId, 
      documentUrl,
      raynetClientId 
    };

  } catch (error) {
    console.error('💥 Detailed Google Docs error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      code: (error as Record<string, unknown>).code,
      status: (error as Record<string, unknown>).status,
      statusText: (error as Record<string, unknown>).statusText,
      error: error
    });
    
    return { 
      success: false, 
      error: `Google Docs creation failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * Generate formatted content for the Google Doc
 */
function generateDocumentContent(dotaznikData: NonNullable<DotaznikType>): string {
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('cs-CZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return `DOTAZNÍK KLIENTA - JÍDLO S MARTINEM

Datum vyplnění: ${formatDate(dotaznikData.createdAt || new Date())}
Session ID: ${dotaznikData.sessionId}

=====================================
👤 ZÁKLADNÍ ÚDAJE
=====================================

Jméno: ${dotaznikData.jmeno || 'Neuvedeno'}
Email: ${dotaznikData.email || 'Neuvedeno'}
Telefon: ${dotaznikData.telefon || 'Neuvedeno'}
Věk: ${dotaznikData.vek || 'Neuvedeno'} let
Výška: ${dotaznikData.vyska ? dotaznikData.vyska + ' cm' : 'Neuvedeno'}
Hmotnost: ${dotaznikData.hmotnost ? dotaznikData.hmotnost + ' kg' : 'Neuvedeno'}
Pohlaví: ${dotaznikData.pohlavi || 'Neuvedeno'}

=====================================
🎯 CÍLE KLIENTA
=====================================

Hlavní cíl:
${dotaznikData.hlavniCil || 'Neuvedeno'}

${dotaznikData.vedlejsiCile ? `Vedlejší cíle:
${dotaznikData.vedlejsiCile}

` : ''}${dotaznikData.terminalCile ? `Terminální cíle:
${dotaznikData.terminalCile}

` : ''}=====================================
🏥 ZDRAVOTNÍ STAV
=====================================

${dotaznikData.zdravotniDiagnozy ? `Zdravotní diagnózy:
${dotaznikData.zdravotniDiagnozy}

` : ''}${dotaznikData.lekyDoplnky ? `Léky a doplňky:
${dotaznikData.lekyDoplnky}

` : ''}${dotaznikData.alergie ? `Alergie a intolerance:
${dotaznikData.alergie}

` : ''}Celkový zdravotní stav: ${dotaznikData.zdravotniStav || 'Neuvedeno'}

${dotaznikData.krevniTesty ? `Krevní testy:
${dotaznikData.krevniTesty}

` : ''}${dotaznikData.bolesti ? `Bolesti:
${dotaznikData.bolesti}

` : ''}=====================================
🏋️‍♂️ TĚLESNÁ KOMPOZICE A POHYB
=====================================

${dotaznikData.telesnaKonstituce ? `Tělesná konstituce: ${dotaznikData.telesnaKonstituce}

` : ''}${dotaznikData.pohybovyRezim ? `Pohybový režim:
${dotaznikData.pohybovyRezim}

` : ''}${dotaznikData.tydennieakitivty ? `Týdenní aktivity:
${dotaznikData.tydennieakitivty}

` : ''}${dotaznikData.sedaveZamestnani ? `Sedavé zaměstnání: ${dotaznikData.sedaveZamestnani}

` : ''}${dotaznikData.pohybovaOmezeni ? `Pohybová omezení:
${dotaznikData.pohybovaOmezeni}

` : ''}=====================================
😴 SPÁNEK
=====================================

${dotaznikData.hodinySpanek ? `Hodiny spánku: ${dotaznikData.hodinySpanek}

` : ''}${dotaznikData.odpocaty ? `Odpočatý po probuzení: ${dotaznikData.odpocaty}

` : ''}${dotaznikData.spankoveNavyky ? `Spánkové návyky:
${dotaznikData.spankoveNavyky}

` : ''}${dotaznikData.problemySpanek ? `Problémy se spánkem:
${dotaznikData.problemySpanek}

` : ''}=====================================
🍽️ STRAVOVACÍ NÁVYKY
=====================================

${dotaznikData.pocetJidel ? `Počet jídel denně: ${dotaznikData.pocetJidel}

` : ''}${dotaznikData.typJidel ? `Typ jídel: ${dotaznikData.typJidel}

` : ''}${dotaznikData.castostMaso ? `Četnost masa: ${dotaznikData.castostMaso}

` : ''}${dotaznikData.pravidelnost ? `Pravidelnost jídel: ${dotaznikData.pravidelnost}

` : ''}${dotaznikData.voda ? `Pitný režim:
${dotaznikData.voda}

` : ''}${dotaznikData.zachvaty ? `Záchvaty hladu/přejídání:
${dotaznikData.zachvaty}

` : ''}${dotaznikData.spokojenostJidlo ? `Spokojenost s jídlem:
${dotaznikData.spokojenostJidlo}

` : ''}=====================================
📋 STRAVOVACÍ MINULOST
=====================================

${dotaznikData.minuleDiety ? `Minulé diety:
${dotaznikData.minuleDiety}

` : ''}${dotaznikData.fungovaloNefungovalo ? `Co fungovalo/nefungovalo:
${dotaznikData.fungovaloNefungovalo}

` : ''}${dotaznikData.vztahKJidlu ? `Vztah k jídlu:
${dotaznikData.vztahKJidlu}

` : ''}=====================================
🧠 PSYCHIKA A ŽIVOTNÍ STYL
=====================================

${dotaznikData.aktualniStres ? `Aktuální stres: ${dotaznikData.aktualniStres}

` : ''}${dotaznikData.hlavniStresor ? `Hlavní stresor:
${dotaznikData.hlavniStresor}

` : ''}${dotaznikData.ritualyRelaxace ? `Rituály relaxace:
${dotaznikData.ritualyRelaxace}

` : ''}${dotaznikData.koureniAlkohol ? `Kouření/alkohol:
${dotaznikData.koureniAlkohol}

` : ''}${dotaznikData.volnyCas ? `Volný čas:
${dotaznikData.volnyCas}

` : ''}${dotaznikData.podporaOkoli ? `Podpora okolí: ${dotaznikData.podporaOkoli}

` : ''}${dotaznikData.zaznamJidelnicku ? `=====================================
📝 ZÁZNAM JÍDELNÍČKU
=====================================

${dotaznikData.zaznamJidelnicku}

` : ''}=====================================
💭 MOTIVACE A OČEKÁVÁNÍ
=====================================

Důvod poradenství:
${dotaznikData.duvodPoradenstvi || 'Neuvedeno'}

${dotaznikData.ocekavani ? `Očekávání:
${dotaznikData.ocekavani}

` : ''}Připravenost: ${dotaznikData.pripravenost || 'Neuvedeno'}

${dotaznikData.prekazy ? `Překáže:
${dotaznikData.prekazy}

` : ''}=====================================
📄 POZNÁMKY PRO KONZULTACI
=====================================

(Zde můžete doplnit poznámky během konzultace)




=====================================
Dokument vygenerován automaticky systémem Jídlo s Martinem
Datum: ${formatDate(new Date())}
`;
}
