import { NextRequest, NextResponse } from 'next/server';

interface RezervaceData {
  dotaznikId: string;
  userEmail: string;
  userName: string;
  date: string;
  time: string;
  service: string;
}

// Simulace databáze rezervací
const rezervace: { [id: string]: RezervaceData & { createdAt: string } } = {};

export async function POST(request: NextRequest) {
  try {
    const data: RezervaceData = await request.json();
    
    // Validace povinných polí
    if (!data.userEmail || !data.userName || !data.date || !data.time) {
      return NextResponse.json(
        { error: 'Chybí povinné údaje pro rezervaci' },
        { status: 400 }
      );
    }

    // Kontrola dostupnosti termínu (simulace)
    const existingReservation = Object.values(rezervace).find(
      r => r.date === data.date && r.time === data.time
    );
    
    if (existingReservation) {
      return NextResponse.json(
        { error: 'Termín je již obsazen' },
        { status: 409 }
      );
    }

    // Generování ID pro rezervaci
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    // Uložení rezervace
    rezervace[id] = {
      ...data,
      createdAt: new Date().toISOString()
    };

    // Simulace odeslání potvrzovacího emailu
    console.log(`Rezervace vytvořena pro ${data.userEmail} na ${data.date} ${data.time}`);
    
    // V produkci by zde bylo:
    // - Uložení do databáze
    // - Odeslání emailu klientovi
    // - Vytvoření události v kalendáři (např. Calendly, Google Calendar)
    // - Odeslání notifikace poradci

    return NextResponse.json({ 
      success: true, 
      id,
      message: 'Rezervace byla úspěšně vytvořena',
      reservation: {
        id,
        date: data.date,
        time: data.time,
        email: data.userEmail,
        name: data.userName
      }
    });

  } catch (error) {
    console.error('Chyba při vytváření rezervace:', error);
    return NextResponse.json(
      { error: 'Chyba serveru při vytváření rezervace' },
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
  
  const rezervace_data = rezervace[id];
  if (!rezervace_data) {
    return NextResponse.json({ error: 'Rezervace nenalezena' }, { status: 404 });
  }
  
  return NextResponse.json(rezervace_data);
}
