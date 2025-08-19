'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, CreditCard, Shield, Clock } from 'lucide-react';

interface ServiceInfo {
  nazev: string;
  cena: number;
  popis: string;
}

const services: { [key: string]: ServiceInfo } = {
  jidelnicek: {
    nazev: 'Individuální jídelníček',
    cena: 2000,
    popis: '7denní detailní jídelníček s recepty přesně na míru'
  },
  transformace: {
    nazev: '30denní transformace',
    cena: 5000,
    popis: 'Komplexní program s průběžným vedením'
  }
};

export default function PlatbaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typ = searchParams.get('typ') || 'jidelnicek';
  const dotaznikId = searchParams.get('dotaznik');
  
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const service = services[typ];

  const fetchUserEmail = async () => {
    try {
      const response = await fetch(`/api/dotaznik?id=${dotaznikId}`);
      if (response.ok) {
        const data = await response.json();
        setUserEmail(data.email);
      }
    } catch (error) {
      console.error('Chyba při načítání emailu:', error);
    }
  };

  useEffect(() => {
    if (dotaznikId) {
      fetchUserEmail();
    }
  }, [dotaznikId]);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const paymentData = {
        merchant: process.env.NEXT_PUBLIC_COMGATE_MERCHANT || 'TEST_MERCHANT',
        test: process.env.NODE_ENV !== 'production' ? 'true' : 'false',
        price: service.cena * 100,
        curr: 'CZK',
        label: service.nazev,
        refId: `ORDER_${Date.now()}`,
        email: userEmail,
        method: 'ALL',
        prepareOnly: 'true',
        lang: 'cs',
        rurl: `${window.location.origin}/platba/vysledek?success=true&dotaznik=${dotaznikId}`,
        furl: `${window.location.origin}/platba/vysledek?success=false&dotaznik=${dotaznikId}`,
      };

      const response = await fetch('/api/platba/vytvorit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      if (response.ok) {
        const { gatewayUrl } = await response.json();
        window.location.href = gatewayUrl;
      } else {
        throw new Error('Chyba při vytváření platby');
      }
    } catch (error) {
      console.error('Chyba při platbě:', error);
      alert('Nastala chyba při vytváření platby. Zkuste to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Služba nenalezena</h1>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Dokončení objednávky</h1>
          <p className="text-xl text-gray-600">
            Zbývá už jen platba a vaše cesta ke zdraví může začít!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shrnutí objednávky</h2>
          
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{service.nazev}</h3>
                <p className="text-gray-600 mt-1">{service.popis}</p>
                {userEmail && (
                  <p className="text-sm text-gray-500 mt-2">E-mail: {userEmail}</p>
                )}
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">
                  {service.cena.toLocaleString()} Kč
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xl font-bold">
            <span>Celková cena:</span>
            <span className="text-green-600">{service.cena.toLocaleString()} Kč</span>
          </div>
        </div>

        <div className="bg-green-50 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Co získáte po platbě:</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700">Detailní jídelníček do 7 dnů na e-mail</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700">Kompletní recepty a nákupní seznam</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700">Nutriční hodnoty všech jídel</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700">Doporučení pro suplementy</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-8 mb-8 text-sm text-gray-600">
          <div className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            <span>Zabezpečená platba</span>
          </div>
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            <span>Visa, Mastercard</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            <span>Okamžité potvrzení</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-green-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-6"
        >
          {loading ? 'Připravuji platbu...' : `Zaplatit ${service.cena.toLocaleString()} Kč`}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Platba zajištěna službou</p>
          <div className="inline-block bg-white px-4 py-2 rounded-lg shadow">
            <span className="font-bold text-blue-600">ComGate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
