# Google Docs Integration - Jídlo s Martinem

## Přehled implementace

Implementovali jsme automatické vytváření Google dokumentů pro každého klienta, který dokončí dotazník a provede rezervaci konzultace.

## Funkčnost

### 1. Automatické vytváření dokumentů
- **Kdy**: Dokument se vytvoří při dokončení dotazníku (během odesílání notifikačního emailu)
- **Název**: `Dotazník - [email klienta]`
- **Obsah**: Všechna data z vyplněného dotazníku strukturovaně uspořádána

### 2. Integrace s email notifikacemi
- Email pro tým nyní obsahuje odkaz na vytvořený Google dokument
- Při rezervaci přes Calendly se také vytváří dokument a odkaz se posílá v notifikačním emailu

## Technická implementace

### Nové soubory
- `src/lib/google-docs.ts` - hlavní logika pro vytváření Google dokumentů

### Upravené soubory
- `src/lib/email.ts` - přidána integrace s Google Docs
- `src/app/api/calendly-webhook/route.ts` - přidáno vytváření dokumentů při rezervaci

### Environment variables
```env
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...} # JSON klíč pro Google Service Account
GOOGLE_DRIVE_FOLDER_ID=your_folder_id # Volitelné - ID sdílené složky
```

## Požadované API přístupy
- Google Docs API - povoleno ✅
- Google Drive API - povoleno ✅
- Google Service Account - vytvořen ✅

## Struktura dokumentu

Vytvořený dokument obsahuje:

1. **Základní údaje** - jméno, email, telefon, věk, výška, hmotnost, pohlaví
2. **Cíle klienta** - hlavní, vedlejší a terminální cíle
3. **Zdravotní stav** - diagnózy, léky, alergie, celkový stav, testy, bolesti
4. **Tělesná kompozice a pohyb** - konstituce, pohybový režim, aktivity, omezení
5. **Spánek** - hodiny spánku, odpočinek, návyky, problémy
6. **Stravovací návyky** - počet jídel, typ, pitný režim, záchvaty
7. **Stravovací minulost** - diety, zkušenosti, vztah k jídlu
8. **Psychika a životní styl** - stres, relaxace, kouření, volný čas, podpora
9. **Záznam jídelníčku** - pokud byl vyplněn
10. **Motivace a očekávání** - důvody, očekávání, připravenost, překáže
11. **Poznámky pro konzultaci** - prázdná sekce pro doplnění během konzultace

## Error handling

- Funkčnost je navržena jako non-blocking - pokud se dokument nepovede vytvořit, systém pokračuje v odesílání emailů
- Při build time se Google APIs inicializují pouze pokud jsou environment variables dostupné
- Všechny chyby se logují do konzole

## Výhody

1. **Kompletní přehled** - všechna data klienta na jednom místě
2. **Připravenost na konzultaci** - Martin má vše potřebné v jednom dokumentu
3. **Možnost poznámek** - během konzultace může doplňovat poznámky přímo do dokumentu
4. **Organizace** - všechny dokumenty jsou centrálně umístěny ve sdílené složce
5. **Backup** - data jsou uložena jak v databázi, tak v Google Docs

## Jak to funguje

1. Klient vyplní dotazník → dokument se vytvoří → email s odkazem se pošle týmu
2. Klient provede rezervaci → dokument se vytvoří/aktualizuje → email s odkazem se pošle týmu
3. Tým má okamžitý přístup k dokumentu pro přípravu na konzultaci

Implementace je hotová a funkční! 🎉
