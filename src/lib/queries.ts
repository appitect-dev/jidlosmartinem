import {prisma} from './prisma';

// Define the data structure for creating a dotaznik entry
export interface CreateDotaznikData {
    sessionId: string;
    jmeno: string;
    email: string;
    vek?: number;
    vyska?: number;
    hmotnost?: number;
    pohlavi?: string;
    telefon?: string;
    hlavniCil?: string;
    vedlejsiCile?: string;
    terminalCile?: string;
    investice?: string;
    zdravotniDiagnozy?: string;
    lekyDoplnky?: string;
    alergie?: string;
    zdravotniStav?: string;
    krevniTesty?: string;
    bolesti?: string;
    telesnaKonstituce?: string;
    pohybovyRezim?: string;
    tydennieakitivty?: string;
    sedaveZamestnani?: string;
    pohybovaOmezeni?: string;
    hodinySpanek?: string;
    odpocaty?: string;
    spankoveNavyky?: string;
    problemySpanek?: string;
    pocetJidel?: string;
    typJidel?: string;
    castostMaso?: string;
    pravidelnost?: string;
    voda?: string;
    zachvaty?: string;
    spokojenostJidlo?: string;
    minuleDiety?: string;
    fungovaloNefungovalo?: string;
    vztahKJidlu?: string;
    aktualniStres?: string;
    hlavniStresor?: string;
    ritualyRelaxace?: string;
    koureniAlkohol?: string;
    volnyCas?: string;
    podporaOkoli?: string;
    zaznamJidelnicku?: string;
    duvodPoradenstvi?: string;
    ocekavani?: string;
    pripravenost?: string;
    prekazy?: string;
}

/**
 * Save dotaznik data to the database
 */
export async function saveDotaznik(data: CreateDotaznikData) {
    try {
        const result = await prisma.dotaznik.create({
            data: {
                sessionId: data.sessionId,
                jmeno: data.jmeno,
                email: data.email,
                vek: data.vek,
                vyska: data.vyska,
                hmotnost: data.hmotnost,
                pohlavi: data.pohlavi,
                telefon: data.telefon,
                hlavniCil: data.hlavniCil,
                vedlejsiCile: data.vedlejsiCile,
                terminalCile: data.terminalCile,
                investice: data.investice,
                zdravotniDiagnozy: data.zdravotniDiagnozy,
                lekyDoplnky: data.lekyDoplnky,
                alergie: data.alergie,
                zdravotniStav: data.zdravotniStav,
                krevniTesty: data.krevniTesty,
                bolesti: data.bolesti,
                telesnaKonstituce: data.telesnaKonstituce,
                pohybovyRezim: data.pohybovyRezim,
                tydennieakitivty: data.tydennieakitivty,
                sedaveZamestnani: data.sedaveZamestnani,
                pohybovaOmezeni: data.pohybovaOmezeni,
                hodinySpanek: data.hodinySpanek,
                odpocaty: data.odpocaty,
                spankoveNavyky: data.spankoveNavyky,
                problemySpanek: data.problemySpanek,
                pocetJidel: data.pocetJidel,
                typJidel: data.typJidel,
                castostMaso: data.castostMaso,
                pravidelnost: data.pravidelnost,
                voda: data.voda,
                zachvaty: data.zachvaty,
                spokojenostJidlo: data.spokojenostJidlo,
                minuleDiety: data.minuleDiety,
                fungovaloNefungovalo: data.fungovaloNefungovalo,
                vztahKJidlu: data.vztahKJidlu,
                aktualniStres: data.aktualniStres,
                hlavniStresor: data.hlavniStresor,
                ritualyRelaxace: data.ritualyRelaxace,
                koureniAlkohol: data.koureniAlkohol,
                volnyCas: data.volnyCas,
                podporaOkoli: data.podporaOkoli,
                zaznamJidelnicku: data.zaznamJidelnicku,
                duvodPoradenstvi: data.duvodPoradenstvi,
                ocekavani: data.ocekavani,
                pripravenost: data.pripravenost,
                prekazy: data.prekazy,
            },
        });

        console.log('Dotaznik saved successfully:', result.id);
        return result;
    } catch (error) {
        console.error('Error saving dotaznik:', error);
        throw new Error('Failed to save dotaznik data');
    }
}

/**
 * Get dotaznik data by sessionId
 */
export async function getDotaznikBySessionId(sessionId: string) {
    try {
        const dotaznik = await prisma.dotaznik.findUnique({
            where: {
                sessionId: sessionId,
            },
        });

        return dotaznik;
    } catch (error) {
        console.error('Error fetching dotaznik:', error);
        return null;
    }
}

