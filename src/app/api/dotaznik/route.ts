import { NextRequest, NextResponse } from 'next/server';

interface DotaznikData {
  // Základní údaje
  jmeno: string;
  vek: string;
  vyska: string;
  hmotnost: string;
  pohlavi: string;
  email: string;
  telefon: string;
  serviceType: string;
  
  // Ostatní pole z dotazníku...
  [key: string]: string;
}

// Simulace databáze - v produkci použít skutečnou databázi
const dotazniky: { [id: string]: DotaznikData } = {};

export async function POST(request: NextRequest) {
  try {
    const data: DotaznikData = await request.json();
    
    // Validace povinných polí
    if (!data.jmeno || !data.email || !data.vek || !data.vyska || !data.hmotnost) {
      return NextResponse.json(
        { error: 'Chybí povinné údaje' },
        { status: 400 }
      );
    }

    // Generování ID pro dotazník
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    // Uložení dotazníku
    dotazniky[id] = {
      ...data,
      createdAt: new Date().toISOString()
    };

    // Odeslání potvrzovacího emailu (simulace)
    console.log(`Dotazník uložen pro ${data.email}, typ služby: ${data.serviceType}`);
    
    return NextResponse.json({ 
      success: true, 
      id,
      message: 'Dotazník byl úspěšně uložen' 
    });

  } catch (error) {
    console.error('Chyba při zpracování dotazníku:', error);
    return NextResponse.json(
      { error: 'Chyba serveru' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'ID je povinné' }, { status: 400 });
  }
  
  const dotaznik = dotazniky[id];
  if (!dotaznik) {
    return NextResponse.json({ error: 'Dotazník nenalezen' }, { status: 404 });
  }
  
  return NextResponse.json(dotaznik);
}
