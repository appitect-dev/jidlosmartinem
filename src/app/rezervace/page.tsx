'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface CalendlyEmbedProps {
  sessionId: string;
}

function CalendlyEmbed({ sessionId }: CalendlyEmbedProps) {
  useEffect(() => {
    // Load Calendly script if not already loaded
    if (!document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.type = 'text/javascript';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // You'll need to replace this with your actual Calendly username
  // or set NEXT_PUBLIC_CALENDLY_USERNAME environment variable
  // const calendlyUsername = process.env.NEXT_PUBLIC_CALENDLY_USERNAME || 'your-calendly-username';
  const calendlyUrl = `https://calendly.com/martin-h-g/30min?hide_gdpr_banner=1&sessionId=${sessionId}`;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className="calendly-inline-widget"
        data-url={calendlyUrl}
        style={{ minWidth: '320px', height: '700px' }}
      />
    </div>
  );
}

function RezervaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get('sessionId');
    
    if (!id) {
      // Redirect back to dotaznik if sessionId is missing
      router.push('/dotaznik');
      return;
    }
    
    setSessionId(id);
    setIsLoading(false);
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Načítám rezervační systém...</p>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Zpět
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">
                Jídlo s Martinem
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Rezervace konzultace s Martinem
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nejprve jste vyplnili dotazník, nyní si prosím vyberte termín, který vám vyhovuje.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="ml-2 text-sm font-medium text-emerald-600">Dotazník vyplněn</span>
            </div>
            <div className="w-8 h-0.5 bg-emerald-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">2</span>
              </div>
              <span className="ml-2 text-sm font-medium text-emerald-600">Výběr termínu</span>
            </div>
          </div>
        </div>

        {/* Calendly Widget Container */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <CalendlyEmbed sessionId={sessionId} />
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <div className="bg-emerald-50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-emerald-900 mb-2">
              Co vás čeká během konzultace?
            </h3>
            <ul className="text-emerald-800 space-y-2 text-left">
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">•</span>
                Analýza vašeho dotazníku a stanovení individuálního plánu
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">•</span>
                Konzultace trvá 45-60 minut přes video hovor
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">•</span>
                Získáte personalizované doporučení pro dosažení vašich cílů
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">•</span>
                24 hodin před konzultací dostanete připomínku na e-mail
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RezervacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Načítám...</p>
        </div>
      </div>
    }>
      <RezervaceContent />
    </Suspense>
  );
}