'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Calendar, Clock, Mail, Video } from 'lucide-react';

export default function PotvrzeniRezervacePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const datum = searchParams.get('datum');
  const cas = searchParams.get('cas');
  const dotaznikId = searchParams.get('dotaznik');
  
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

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
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!datum || !cas) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chybí údaje o rezervaci</h1>
          <button 
            onClick={() => router.push('/')}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
          >
            Zpět na hlavní stránku
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Rezervace potvrzena!
          </h1>
          <p className="text-xl text-gray-600">
            Těšíme se na naši první konzultaci, {userName ? userName.split(' ')[0] : ''}!
          </p>
        </div>

        {/* Detaily rezervace */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detaily vaší rezervace</h2>
          
          <div className="space-y-6">
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Datum</h3>
                <p className="text-gray-700">{formatDate(datum)}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <Clock className="h-6 w-6 text-green-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Čas</h3>
                <p className="text-gray-700">{cas}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <Video className="h-6 w-6 text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Způsob konzultace</h3>
                <p className="text-gray-700">Online (Google Meet) nebo osobně dle dohody</p>
              </div>
            </div>

            {userEmail && (
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Mail className="h-6 w-6 text-gray-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">E-mail pro potvrzení</h3>
                  <p className="text-gray-700">{userEmail}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Co bude následovat */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Co bude následovat?</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                  <span className="text-sm font-bold text-green-600">1</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Potvrzovací e-mail</h3>
                <p className="text-gray-600">
                  Během několika minut obdržíte potvrzovací e-mail s detaily konzultace.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                  <span className="text-sm font-bold text-green-600">2</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Připrava na konzultaci</h3>
                <p className="text-gray-600">
                  24 hodin před konzultací vám pošleme připomínku a instrukce pro připojení.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                  <span className="text-sm font-bold text-green-600">3</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">První konzultace</h3>
                <p className="text-gray-600">
                  Probereme váš dotazník, stanovíme cíle a vytvoříme plán vaší transformace.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kontakt */}
        <div className="bg-blue-50 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Potřebujete změnit termín?</h3>
          <p className="text-gray-700 mb-4">
            Pokud potřebujete termín přesunout nebo máte jakékoliv dotazy, neváhejte nás kontaktovat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:info@jidlosmartinem.cz"
              className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Mail className="h-5 w-5 mr-2" />
              info@jidlosmartinem.cz
            </a>
          </div>
        </div>

        {/* Akční tlačítka */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="bg-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-600 transition-colors"
          >
            Zpět na hlavní stránku
          </button>
        </div>
      </div>
    </div>
  );
}
