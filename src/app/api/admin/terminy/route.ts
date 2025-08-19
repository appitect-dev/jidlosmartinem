import { NextRequest, NextResponse } from 'next/server';

interface AvailableSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
  createdAt: string;
}

// Simulace databáze dostupných termínů
const availableSlots: AvailableSlot[] = [
  {
    id: '1',
    date: '2025-08-26',
    time: '09:00',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    date: '2025-08-26',
    time: '11:00',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    date: '2025-08-27',
    time: '10:00',
    available: true,
    createdAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    // Seřadit termíny podle data a času
    const sortedSlots = availableSlots.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

    return NextResponse.json(sortedSlots);
  } catch (error) {
    console.error('Chyba při načítání termínů:', error);
    return NextResponse.json(
      { error: 'Chyba serveru' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { date, time, available = true } = await request.json();
    
    // Validace
    if (!date || !time) {
      return NextResponse.json(
        { error: 'Datum a čas jsou povinné' },
        { status: 400 }
      );
    }

    // Kontrola, zda termín už neexistuje
    const existingSlot = availableSlots.find(
      slot => slot.date === date && slot.time === time
    );

    if (existingSlot) {
      return NextResponse.json(
        { error: 'Termín už existuje' },
        { status: 409 }
      );
    }

    // Vytvoření nového termínu
    const newSlot: AvailableSlot = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      date,
      time,
      available,
      createdAt: new Date().toISOString()
    };

    availableSlots.push(newSlot);

    return NextResponse.json(newSlot, { status: 201 });
  } catch (error) {
    console.error('Chyba při vytváření termínu:', error);
    return NextResponse.json(
      { error: 'Chyba serveru' },
      { status: 500 }
    );
  }
}
