import { NextResponse } from 'next/server';

interface Reservation {
  id: string;
  dotaznikId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  date: string;
  time: string;
  service: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
  notes?: string;
}

// Simulace databáze rezervací
const reservations: Reservation[] = [
  {
    id: '1',
    dotaznikId: 'test123',
    userEmail: 'test@example.com',
    userName: 'Jan Novák',
    userPhone: '+420 123 456 789',
    date: '2025-08-26',
    time: '09:00',
    service: 'konzultace-zdarma',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    notes: 'První konzultace'
  },
  {
    id: '2',
    dotaznikId: 'test456',
    userEmail: 'marie@example.com',
    userName: 'Marie Svobodová',
    date: '2025-08-27',
    time: '10:00',
    service: 'konzultace-zdarma',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    // Seřadit rezervace podle data a času
    const sortedReservations = reservations.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

    return NextResponse.json(sortedReservations);
  } catch (error) {
    console.error('Chyba při načítání rezervací:', error);
    return NextResponse.json(
      { error: 'Chyba serveru' },
      { status: 500 }
    );
  }
}
