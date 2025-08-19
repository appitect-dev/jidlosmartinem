'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, User, Mail, Phone, Trash2 } from 'lucide-react';

interface AvailableSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'terminy' | 'rezervace'>('terminy');
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Formulář pro nový termín
  const [newSlot, setNewSlot] = useState({ date: '', time: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Načtení dostupných termínů
      const slotsResponse = await fetch('/api/admin/terminy');
      if (slotsResponse.ok) {
        const slots = await slotsResponse.json();
        setAvailableSlots(slots);
      }

      // Načtení rezervací
      const reservationsResponse = await fetch('/api/admin/rezervace');
      if (reservationsResponse.ok) {
        const reservations = await reservationsResponse.json();
        setReservations(reservations);
      }
    } catch (error) {
      console.error('Chyba při načítání dat:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNewSlot = async () => {
    if (!newSlot.date || !newSlot.time) return;
    
    try {
      const response = await fetch('/api/admin/terminy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: newSlot.date,
          time: newSlot.time,
          available: true
        })
      });

      if (response.ok) {
        const newSlotData = await response.json();
        setAvailableSlots([...availableSlots, newSlotData]);
        setNewSlot({ date: '', time: '' });
      }
    } catch (error) {
      console.error('Chyba při přidávání termínu:', error);
    }
  };

  const deleteSlot = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tento termín?')) return;
    
    try {
      const response = await fetch(`/api/admin/terminy/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setAvailableSlots(availableSlots.filter(slot => slot.id !== id));
      }
    } catch (error) {
      console.error('Chyba při mazání termínu:', error);
    }
  };

  const updateReservationStatus = async (id: string, status: 'confirmed' | 'pending' | 'cancelled') => {
    try {
      const response = await fetch(`/api/admin/rezervace/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setReservations(reservations.map(r => 
          r.id === id ? { ...r, status } : r
        ));
      }
    } catch (error) {
      console.error('Chyba při aktualizaci rezervace:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Potvrzeno';
      case 'pending': return 'Čeká na potvrzení';
      case 'cancelled': return 'Zrušeno';
      default: return 'Neznámý';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Načítám data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Administrace</h1>
          <p className="text-gray-600">Správa termínů a rezervací</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('terminy')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'terminy'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Calendar className="h-5 w-5 inline mr-2" />
                Dostupné termíny ({availableSlots.length})
              </button>
              <button
                onClick={() => setActiveTab('rezervace')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'rezervace'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <User className="h-5 w-5 inline mr-2" />
                Rezervace ({reservations.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'terminy' && (
              <div>
                {/* Formulář pro nový termín */}
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Přidat nový termín</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Datum</label>
                      <input
                        type="date"
                        value={newSlot.date}
                        onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Čas</label>
                      <input
                        type="time"
                        value={newSlot.time}
                        onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={addNewSlot}
                        className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Přidat termín
                      </button>
                    </div>
                  </div>
                </div>

                {/* Seznam termínů */}
                <div className="space-y-4">
                  {availableSlots.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Žádné dostupné termíny</p>
                  ) : (
                    availableSlots.map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{formatDate(slot.date)}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {slot.time}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            slot.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {slot.available ? 'Dostupný' : 'Obsazen'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => deleteSlot(slot.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'rezervace' && (
              <div className="space-y-4">
                {reservations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Žádné rezervace</p>
                ) : (
                  reservations.map((reservation) => (
                    <div key={reservation.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{reservation.userName}</h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2" />
                                {reservation.userEmail}
                              </div>
                              {reservation.userPhone && (
                                <div className="flex items-center">
                                  <Phone className="h-4 w-4 mr-2" />
                                  {reservation.userPhone}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="font-medium">{formatDate(reservation.date)}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                <span>{reservation.time}</span>
                              </div>
                              <div className="flex items-center">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(reservation.status)}`}>
                                  {getStatusText(reservation.status)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          <select
                            value={reservation.status}
                            onChange={(e) => updateReservationStatus(reservation.id, e.target.value as 'confirmed' | 'pending' | 'cancelled')}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1"
                          >
                            <option value="pending">Čeká na potvrzení</option>
                            <option value="confirmed">Potvrzeno</option>
                            <option value="cancelled">Zrušeno</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          Rezervováno: {new Date(reservation.createdAt).toLocaleString('cs-CZ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          Služba: {reservation.service}
                        </p>
                        {reservation.dotaznikId && (
                          <p className="text-xs text-gray-500">
                            Dotazník ID: {reservation.dotaznikId}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
