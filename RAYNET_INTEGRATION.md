# Raynet CRM Integration

## ✅ Implementace dokončena!

Přidali jsme integraci s Raynet CRM, která automaticky vytváří nové klienty při vyplnění dotazníku.

## 🔧 Co bylo implementováno:

### 1. **Raynet CRM API funkce** (`src/lib/raynet-crm.ts`)
- `createRaynetClient()` - vytvoří nového klienta (fyzickou osobu) v Raynet CRM
- `testRaynetConnection()` - testuje připojení k Raynet API

### 2. **Rozšíření Google Docs integrace** (`src/lib/google-docs.ts`)
- Po vytvoření Google dokumentu se automaticky vytvoří klient v Raynet CRM
- Google Doc URL se vloží do pole "notice" v Raynet CRM
- Funkce vrací také `raynetClientId` pro další použití

### 3. **Aktualizace email notifikací** (`src/lib/email.ts`)
- Email notifikace nyní obsahují informace o vytvořeném Raynet klientovi
- Přidána sekce s Raynet Client ID a odkazem do CRM

### 4. **Webhooks aktualizace**
- Calendly webhook (`src/app/api/calendly-webhook/route.ts`) předává Raynet informace
- Form submission notifikace obsahují Raynet CRM informace

## 📋 Environment Variables potřebné v Vercel:

```bash
# Existující Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=https://jidlosmartinem.cz/api/auth/google/callback
GOOGLE_REFRESH_TOKEN=your_refresh_token
GOOGLE_DRIVE_FOLDER_ID=your_folder_id

# NOVÉ - Raynet CRM credentials
RAYNET_USERNAME=your_raynet_username
RAYNET_API_KEY=your_raynet_api_key
```

## 🎯 Jak to funguje:

### **Workflow při vyplnění dotazníku:**

1. **Klient vyplní dotazník** na webu
2. **Google Doc se vytvoří** ve specifikované složce
3. **Raynet klient se vytvoří** s následujícími daty:
   ```json
   {
     "name": "Jméno Příjmení",
     "firstName": "Jméno",
     "lastName": "Příjmení", 
     "email": "email@example.com",
     "person": true,
     "state": "A_POTENTIAL",
     "rating": "A",
     "role": "A_SUBSCRIBER",
     "notice": "https://docs.google.com/document/d/DOCUMENT_ID/edit"
   }
   ```
4. **Email notifikace se pošle** s odkazy na:
   - Google dokument s kompletními daty
   - Raynet CRM profil klienta

### **Email notifikace obsahují:**
- ✅ **Google Docs sekci** - odkaz na dokument s daty
- ✅ **Raynet CRM sekci** - Client ID a odkaz do CRM
- ✅ **Kompletní data z dotazníku** pro rychlý přehled

## 🚀 Testování:

### 1. **Test Raynet připojení:**
Funkce `testRaynetConnection()` ověří credentials

### 2. **Fallback chování:**
- Pokud Google Docs selže, Raynet se nepokoušá vytvořit
- Pokud Raynet selže, Google Docs se stále vytvoří
- Email notifikace se pošlou vždy (i když některá integrace selže)

### 3. **Logging:**
Všechne operace jsou logované pro debugging:
- Google Docs vytváření
- Raynet API volání
- Email posílání

## 🔗 Raynet CRM odkazy:

Automaticky se generují odkazy typu:
`https://app.raynet.cz/company/{clientId}`

## ✅ Výsledek:

**Kompletně automatizovaný systém:**
1. ✅ Google dokument s klientskými daty
2. ✅ Raynet CRM klient s odkazem na dokument  
3. ✅ Email notifikace s odkazy na oboje
4. ✅ Fallback handling pro robustnost

**Připraveno k nasazení!** 🚀
