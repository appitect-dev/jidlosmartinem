import { NextRequest, NextResponse } from 'next/server';

// Jednoduchá simulace databáze
interface AvailableSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

const availableSlots: AvailableSlot[] = [];

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Najít index termínu
    const index = availableSlots.findIndex(slot => slot.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Termín nenalezen' },
        { status: 404 }
      );
    }

    // Smazat termín
    availableSlots.splice(index, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Chyba při mazání termínu:', error);
    return NextResponse.json(
      { error: 'Chyba serveru' },
      { status: 500 }
    );
  }
}
