# Google OAuth2 Setup Guide

## ✅ Kód je připraven!

OAuth2 implementace pro Google Docs je hotová. Zde jsou kroky pro získání refresh_token:

## 📋 Postup získání refresh_token:

### 1. Deploy kód do Vercel
```bash
git add .
git commit -m "Add Google OAuth2 for Docs integration"
git push
```

### 2. Ujisti se, že máš v Vercel environment variables:
```
GOOGLE_CLIENT_ID=your_client_id_from_google_cloud
GOOGLE_CLIENT_SECRET=your_client_secret_from_google_cloud
GOOGLE_REDIRECT_URI=https://jidlosmartinem.vercel.app/api/auth/google/callback
```

### 3. Získej refresh_token:

1. **Navštiv:** `https://jidlosmartinem.vercel.app/api/auth/google`
2. **Zkopíruj authUrl** z odpovědi
3. **Otevři authUrl** v prohlížeči
4. **Autorizuj aplikaci** - přihlaš se svým Google účtem (jan.vandlicek@gmail.com)
5. **Zkopíruj refresh_token** z callback stránky

### 4. Přidej refresh_token do Vercel:
```
GOOGLE_REFRESH_TOKEN=your_refresh_token_here
```

### 5. Redeploy aplikaci

## 🎯 Co se stane po nastavení:

- ✅ Automatické vytváření Google Docs pro každý dotazník
- ✅ Dokumenty se vytvoří ve tvém Google Drive
- ✅ Dokumenty budou dostupné přes link (anyone with link can view)
- ✅ Email notifikace budou obsahovat odkazy na dokumenty

## 🔧 Troubleshooting:

Pokud něco nefunguje, zkontroluj logy ve Vercel Functions.

## 🚀 Ready to go!

Po dokončení těchto kroků bude Google Docs integrace plně funkční s OAuth2 autentizací.
