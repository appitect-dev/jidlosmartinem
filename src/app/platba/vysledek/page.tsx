'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Mail } from 'lucide-react';

export default function VysledekPlatbyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const dotaznikId = searchParams.get('dotaznik');
  
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchUserEmail = async () => {
      if (dotaznikId) {
        try {
          const response = await fetch(`/api/dotaznik?id=${dotaznikId}`);
          if (response.ok) {
            const data = await response.json();
            setUserEmail(data.email);
          }
        } catch (error) {
          console.error('Chyba při načítání emailu:', error);
        }
      }
    };

    fetchUserEmail();
  }, [dotaznikId]);

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Platba byla úspěšná!
            </h1>
            <p className="text-xl text-gray-600">
              Děkujeme za vaši objednávku. Vaše cesta ke zdraví může začít!
            </p>
          </div>

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
                  <h3 className="text-lg font-semibold text-gray-900">Zpracování dotazníku</h3>
                  <p className="text-gray-600">
                    Během 24 hodin projdu váš dotazník a připravím personalizovaný jídelníček.
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
                  <h3 className="text-lg font-semibold text-gray-900">Odeslání jídelníčku</h3>
                  <p className="text-gray-600">
                    Do 7 dnů obdržíte kompletní jídelníček s recepty na váš e-mail.
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
                  <h3 className="text-lg font-semibold text-gray-900">Začínáte s novým jídelníčkem</h3>
                  <p className="text-gray-600">
                    Můžete začít následovat doporučení a dosahovat svých cílů.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {userEmail && (
            <div className="bg-green-50 rounded-2xl p-8 mb-8">
              <div className="flex items-center mb-4">
                <Mail className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Potvrzení odeslané na e-mail</h3>
              </div>
              <p className="text-gray-700">
                Potvrzení objednávky bylo odesláno na adresu <strong>{userEmail}</strong>
              </p>
            </div>
          )}

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

  // Neúspěšná platba
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Platba se nezdařila
          </h1>
          <p className="text-xl text-gray-600">
            Bohužel došlo k chybě při zpracování platby.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Co můžete udělat?</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700">Zkuste platbu opakovat</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700">Zkontrolujte stav vašeho účtu</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700">Kontaktujte nás pro pomoc</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push(`/platba?typ=jidelnicek&dotaznik=${dotaznikId}`)}
            className="flex-1 bg-green-500 text-white px-6 py-4 rounded-xl font-semibold hover:bg-green-600 transition-colors"
          >
            Zkusit znovu
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 bg-gray-500 text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
          >
            Zpět na hlavní stránku
          </button>
        </div>
      </div>
    </div>
  );
}
