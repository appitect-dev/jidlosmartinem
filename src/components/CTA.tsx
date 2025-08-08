'use client';

import { Phone, Mail, MapPin, Clock, Shield, Award, ArrowRight } from 'lucide-react';

export default function CTA() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Telefon",
      value: "+420 777 123 456",
      description: "Po-Pá 9:00-18:00",
      action: "tel:+420777123456",
      available: true
    },
    {
      icon: Mail,
      title: "Email",
      value: "martin@jidlosmartinem.cz", 
      description: "Odpovídám do 24 hodin",
      action: "mailto:martin@jidlosmartinem.cz",
      available: true
    },
    {
      icon: MapPin,
      title: "Konzultace",
      value: "Praha nebo online",
      description: "Flexibilní možnosti",
      action: "#",
      available: true
    }
  ];

  const guarantees = [
    {
      icon: Shield,
      title: "Záruka spokojenosti",
      description: "30 dní na vyzkoušení"
    },
    {
      icon: Award,
      title: "Profesionální přístup", 
      description: "Certifikovaný odborník"
    },
    {
      icon: Clock,
      title: "Rychlá odezva",
      description: "Odpovídám do 24h"
    }
  ];

  const process = [
    {
      step: "1",
      title: "Kontaktujte mě",
      description: "Zavolejte, napište email nebo vyplňte formulář"
    },
    {
      step: "2", 
      title: "Konzultace zdarma",
      description: "20minutová úvodní konzultace bez závazků"
    },
    {
      step: "3",
      title: "Začneme spolupráci",
      description: "Sestavím váš personalizovaný plán"
    }
  ];

  return (
    <section id="kontakt" className="py-24 bg-gradient-to-br from-green-600 to-emerald-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main CTA */}
        <div className="text-center text-white mb-20">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            Začněte svou transformaci
            <span className="block text-green-200">již dnes</span>
          </h2>
          <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Získejte bezplatnou 20minutovou konzultaci a zjistěte, jak vám mohu pomoci dosáhnout vašich cílů
          </p>
          
          {/* Primary CTA button */}
          <div className="mb-12">
            <a
              href="tel:+420777123456"
              className="inline-flex items-center px-8 py-4 bg-white text-green-700 rounded-xl font-bold text-xl hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <Phone className="h-6 w-6 mr-3" />
              Zavolat nyní: +420 777 123 456
              <ArrowRight className="h-6 w-6 ml-3" />
            </a>
          </div>

          <div className="text-green-200 text-lg">
            ✓ Bezplatná konzultace  ✓ Bez závazků  ✓ Okamžitá dostupnost
          </div>
        </div>

        {/* Contact methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center text-white hover:bg-white/20 transition-all duration-300">
                <div className="inline-flex p-4 bg-white/20 rounded-xl mb-6">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                <div className="text-lg font-medium mb-2">{method.value}</div>
                <p className="text-green-200 text-sm mb-4">{method.description}</p>
                <a
                  href={method.action}
                  className="inline-flex items-center px-6 py-3 bg-white text-green-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                >
                  Kontaktovat
                </a>
              </div>
            );
          })}
        </div>

        {/* Process */}
        <div className="bg-white rounded-3xl p-12 mb-20">
          <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">
            Jak to funguje?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 z-0"></div>
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h4>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantees */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Proč si vybrat právě mě?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guarantees.map((guarantee, index) => {
              const Icon = guarantee.icon;
              return (
                <div key={index} className="text-center text-white">
                  <div className="inline-flex p-3 bg-white/20 rounded-xl mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold mb-2">{guarantee.title}</h4>
                  <p className="text-green-200 text-sm">{guarantee.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <p className="text-white/80 text-lg mb-6">
            Připojte se k více než 500 spokojeným klientům
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+420777123456"
              className="inline-flex items-center px-8 py-4 bg-white text-green-700 rounded-xl font-bold hover:bg-gray-100 transition-colors duration-200"
            >
              <Phone className="h-5 w-5 mr-2" />
              Zavolat nyní
            </a>
            <a
              href="mailto:martin@jidlosmartinem.cz"
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-green-700 transition-all duration-200"
            >
              <Mail className="h-5 w-5 mr-2" />
              Napsat email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
