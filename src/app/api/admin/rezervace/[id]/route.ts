import { NextRequest, NextResponse } from 'next/server';

interface Reservation {
  id: string;
  status: string;
  updatedAt?: string;
  [key: string]: unknown;
}

// Simulace databáze
const reservations: Reservation[] = [];

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();
    
    // Najít rezervaci
    const reservation = reservations.find(r => r.id === id);
    
    if (!reservation) {
      return NextResponse.json(
        { error: 'Rezervace nenalezena' },
        { status: 404 }
      );
    }

    // Aktualizovat status
    reservation.status = status;
    reservation.updatedAt = new Date().toISOString();

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Chyba při aktualizaci rezervace:', error);
    return NextResponse.json(
      { error: 'Chyba serveru' },
      { status: 500 }
    );
  }
}
