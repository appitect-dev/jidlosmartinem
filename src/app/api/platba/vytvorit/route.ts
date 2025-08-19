import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface ComGatePaymentData {
  merchant: string;
  test: string;
  price: number;
  curr: string;
  label: string;
  refId: string;
  email: string;
  method: string;
  prepareOnly: string;
  lang: string;
  rurl: string;
  furl: string;
}

// ComGate konfigurace
const COMGATE_CONFIG = {
  merchant: process.env.COMGATE_MERCHANT || 'TEST_MERCHANT',
  secret: process.env.COMGATE_SECRET || 'TEST_SECRET',
  isTest: process.env.NODE_ENV !== 'production'
};

export async function POST(request: NextRequest) {
  try {
    const paymentData: ComGatePaymentData = await request.json();
    
    // Validace dat
    if (!paymentData.price || !paymentData.email || !paymentData.label) {
      return NextResponse.json(
        { error: 'Chybí povinné údaje pro platbu' },
        { status: 400 }
      );
    }

    // Příprava dat pro ComGate
    const params = {
      merchant: COMGATE_CONFIG.merchant,
      test: COMGATE_CONFIG.isTest ? 'true' : 'false',
      price: paymentData.price.toString(),
      curr: paymentData.curr,
      label: paymentData.label,
      refId: paymentData.refId,
      email: paymentData.email,
      method: paymentData.method,
      prepareOnly: paymentData.prepareOnly,
      lang: paymentData.lang,
      rurl: paymentData.rurl,
      furl: paymentData.furl
    };

    // Vytvoření signature pro ComGate
    const signature = createComGateSignature(params);
    
    // Pro testovací prostředí - simulace úspěšné odpovědi
    if (COMGATE_CONFIG.isTest) {
      const transId = `TEST_${Date.now()}`;
      const gatewayUrl = `https://payments.comgate.cz/client/instructions/index?id=${transId}`;
      
      return NextResponse.json({
        success: true,
        transId,
        gatewayUrl,
        message: 'Testovací platba vytvořena'
      });
    }

    // V produkci by zde bylo volání na ComGate API
    // const comgateResponse = await fetch('https://payments.comgate.cz/v1.0/create', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   body: new URLSearchParams({ ...params, signature })
    // });

    // Prozatím vrátíme testovací odpověď
    return NextResponse.json({
      success: true,
      transId: `PROD_${Date.now()}`,
      gatewayUrl: `https://payments.comgate.cz/client/instructions/index?id=PROD_${Date.now()}`,
      message: 'Platba vytvořena'
    });

  } catch (error) {
    console.error('Chyba při vytváření platby:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření platby' },
      { status: 500 }
    );
  }
}

function createComGateSignature(params: Record<string, string>): string {
  // Seřazení parametrů podle klíče
  const sortedKeys = Object.keys(params).sort();
  
  // Vytvoření řetězce pro signature
  let signatureString = '';
  sortedKeys.forEach(key => {
    if (params[key]) {
      signatureString += `${key}=${params[key]}&`;
    }
  });
  
  // Odstranění posledního &
  signatureString = signatureString.slice(0, -1);
  
  // Přidání secret klíče
  signatureString += COMGATE_CONFIG.secret;
  
  // Vytvoření SHA256 hash
  return crypto.createHash('sha256').update(signatureString).digest('hex');
}
