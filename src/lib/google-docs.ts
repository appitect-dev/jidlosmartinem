import { google } from "googleapis";
import { prisma } from '@/lib/prisma';

// Get the type from Prisma client
type DotaznikType = Awaited<ReturnType<typeof prisma.dotaznik.findFirst>>;

// Initialize Google Auth only if the environment variable is available
let auth: InstanceType<typeof google.auth.GoogleAuth> | null = null;
let docs: ReturnType<typeof google.docs> | null = null;
// let drive: ReturnType<typeof google.drive> | null = null; // Not needed for root creation

try {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
      scopes: [
        "https://www.googleapis.com/auth/documents"  // Only Docs API needed
      ],
    });

    docs = google.docs({ version: "v1", auth });
    // drive = google.drive({ version: "v3", auth }); // Not needed for root creation
  }
} catch (error) {
  console.warn('Failed to initialize Google APIs - Google Docs functionality will be disabled:', error);
}

/**
 * Create a Google Doc with client's form data
 */
export async function createClientGoogleDoc(sessionId: string) {
  try {
    console.log('🔍 Starting Google Doc creation for sessionId:', sessionId);
    
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      console.error('❌ GOOGLE_SERVICE_ACCOUNT_KEY not found');
      return { success: false, error: 'GOOGLE_SERVICE_ACCOUNT_KEY not configured' };
    }

    if (!process.env.GOOGLE_DRIVE_FOLDER_ID) {
      console.error('❌ GOOGLE_DRIVE_FOLDER_ID not found');
      return { success: false, error: 'GOOGLE_DRIVE_FOLDER_ID not configured' };
    }

    // Parse credentials
    let credentials;
    try {
      credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      console.log('✅ Service account email:', credentials.client_email);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return { success: false, error: 'Invalid JSON in GOOGLE_SERVICE_ACCOUNT_KEY' };
    }

    // Initialize Google Auth
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        "https://www.googleapis.com/auth/documents"  // Only Docs API needed for root creation
      ],
    });

    const docs = google.docs({ version: "v1", auth });
    // const drive = google.drive({ version: "v3", auth }); // Not needed for root creation

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
    const documentTitle = `Dotazník - ${dotaznikData.email}`;

    // Create a new Google Doc
    const createResponse = await docs.documents.create({
      requestBody: {
        title: documentTitle,
      },
    });

    const documentId = createResponse.data.documentId;
    if (!documentId) {
      return { success: false, error: 'Failed to create document' };
    }

    // Generate content for the document
    const documentContent = generateDocumentContent(dotaznikData);

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

    // DISABLED: Share the document in the shared folder to avoid permission issues
    // Documents will be created in root Google Drive instead
    /*
    if (process.env.GOOGLE_DRIVE_FOLDER_ID && drive) {
      try {
        await drive.files.update({
          fileId: documentId,
          addParents: process.env.GOOGLE_DRIVE_FOLDER_ID,
          removeParents: 'root',
        });
        console.log(`Document moved to shared folder: ${process.env.GOOGLE_DRIVE_FOLDER_ID}`);
      } catch (folderError) {
        console.warn('Failed to move document to shared folder:', folderError);
        // Continue anyway, document is still created
      }
    }
    */

    const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;
    
    console.log(`Google Doc created successfully: ${documentUrl}`);
    return { 
      success: true, 
      documentId, 
      documentUrl 
    };

  } catch (error) {
    console.error('💥 Detailed Google Docs error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
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
