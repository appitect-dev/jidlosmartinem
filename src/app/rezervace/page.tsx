'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Clock, CheckCircle, User, Mail } from 'lucide-react';

interface AvailableSlot {
  date: string;
  time: string;
  available: boolean;
}

export default function RezervacePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dotaznikId = searchParams.get('dotaznik');
  
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Simulace dostupných termínů
  const [availableSlots] = useState<AvailableSlot[]>([
    { date: '2025-08-26', time: '09:00', available: true },
    { date: '2025-08-26', time: '11:00', available: true },
    { date: '2025-08-26', time: '14:00', available: false },
    { date: '2025-08-27', time: '10:00', available: true },
    { date: '2025-08-27', time: '15:00', available: true },
    { date: '2025-08-28', time: '09:00', available: true },
    { date: '2025-08-28', time: '13:00', available: true },
    { date: '2025-08-29', time: '11:00', available: true },
    { date: '2025-08-30', time: '09:00', available: true },
    { date: '2025-08-30', time: '16:00', available: true },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (dotaznikId) {
        try {
          const response = await fetch(`/api/dotaznik?id=${dotaznikId}`);
          if (response.ok) {
            const data = await response.json();
            setUserEmail(data.email);
            setUserName(data.jmeno);
          }
        } catch (error) {
          console.error('Chyba při načítání uživatelských dat:', error);
        }
      }
    };

    fetchUserData();
  }, [dotaznikId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleReservation = async () => {
    if (!selectedSlot) return;
    
    setLoading(true);
    
    try {
      // Simulace rezervace - v produkci by zde bylo volání API
      const reservationData = {
        dotaznikId,
        userEmail,
        userName,
        date: selectedSlot.date,
        time: selectedSlot.time,
        service: 'konzultace-zdarma'
      };

      const response = await fetch('/api/rezervace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData)
      });

      if (response.ok) {
        // Přesměrování na potvrzení rezervace
        router.push(`/rezervace/potvrzeni?datum=${selectedSlot.date}&cas=${selectedSlot.time}&dotaznik=${dotaznikId}`);
      } else {
        throw new Error('Chyba při rezervaci');
      }
    } catch (error) {
      console.error('Chyba při rezervaci:', error);
      alert('Nastala chyba při rezervaci. Zkuste to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  // Seskupení termínů podle data
  const groupedSlots = availableSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, AvailableSlot[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Rezervace bezplatné konzultace
          </h1>
          <p className="text-xl text-gray-600">
            Vyberte si termín pro první konzultaci k 30denní transformaci
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kalendář termínů */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="h-6 w-6 mr-3 text-green-500" />
                Dostupné termíny
              </h2>
              
              <div className="space-y-6">
                {Object.entries(groupedSlots).map(([date, slots]) => (
                  <div key={date}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {formatDate(date)}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {slots.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => slot.available && setSelectedSlot(slot)}
                          disabled={!slot.available}
                          className={`p-3 rounded-lg text-center font-medium transition-colors ${
                            selectedSlot?.date === slot.date && selectedSlot?.time === slot.time
                              ? 'bg-green-500 text-white'
                              : slot.available
                              ? 'bg-gray-100 text-gray-900 hover:bg-green-100'
                              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {slot.time}
                          </div>
                          {!slot.available && (
                            <div className="text-xs mt-1">Obsazeno</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shrnutí rezervace */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Shrnutí rezervace</h3>
              
              {userName && (
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{userName}</span>
                </div>
              )}
              
              {userEmail && (
                <div className="flex items-center mb-4">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{userEmail}</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Vybraný termín:</h4>
                {selectedSlot ? (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-medium text-gray-900">
                      {formatDate(selectedSlot.date)}
                    </div>
                    <div className="text-green-600 font-semibold">
                      {selectedSlot.time}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 italic">
                    Vyberte termín ze seznamu
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Co vás čeká:</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>60minutová konzultace</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Analýza vašich cílů</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Plán transformace</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Online/osobně dle dohody</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleReservation}
                disabled={!selectedSlot || loading}
                className="w-full mt-6 bg-green-500 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Rezervuji...' : 'Potvrdit rezervaci'}
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Konzultace je zcela zdarma a nezávazná
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
