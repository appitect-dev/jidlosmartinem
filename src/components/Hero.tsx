"use client";

import { ArrowRight, Star, Award, Users } from "lucide-react";
import Header from "./Header";
import Image from "next/image";

export default function Hero() {
  const scrollToContact = () => {
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 items-center flex justify-center">
      <Header />

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/4 opacity-5"
          width="500"
          height="500"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#22c55e"
            d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,89.2,-0.5C88.4,15.3,84.2,30.6,76.8,44.2C69.4,57.8,58.8,69.7,45.8,77.2C32.8,84.7,16.4,87.8,0.7,86.7C-15,85.6,-30,-19.6,-42.1,-32.8C-54.2,-46,-63.4,-47.8,-70.2,-45.2C-77,-42.6,-81.4,-35.6,-82.7,-27.9C-84,-20.2,-82.2,-11.8,-80.4,-3.4C-78.6,5,-76.8,13.4,-71.8,19.6C-66.8,25.8,-58.6,29.8,-49.8,32.2C-41,34.6,-31.6,35.4,-22.2,34.4C-12.8,33.4,-3.4,30.6,5.2,24.2C13.8,17.8,21.6,7.8,28.2,-4.2C34.8,-16.2,40.2,-30.2,44.7,-76.4Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <section className="relative pt-32 pb-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="space-y-8">
              {/* Trust indicators */}
              <div className="flex items-center space-x-6 text-sm text-green-700">
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4" />
                  <span>Certifikovaný poradce</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>500+ klientů</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>4.9/5 hodnocení</span>
                </div>
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-gray-900">
                  Transformujte svůj život
                  <span className="block text-green-600">zdravou výživou</span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Jsem Martin Cidlinský, certifikovaný nutriční poradce s 10+
                  lety zkušeností. Pomáhám lidem dosáhnout jejich zdravotních
                  cílů prostřednictvom personalizované výživy.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={scrollToContact}
                    className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Začít transformaci
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>

                  <a
                    href="/bmi"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-green-700 bg-white border-2 border-green-200 hover:border-green-300 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Bezplatná BMI analýza
                  </a>
                </div>

                <p className="text-sm text-gray-500">
                  ✓ Bez závazků ✓ Individuální přístup ✓ Ověřená metodika
                </p>
              </div>
            </div>

            {/* Professional Photo & Visual Elements */}
            <div className="relative">
              <div className="relative">
                {/* Main photo container */}
                <div className="relative aspect-square rounded-full shadow-2xl overflow-hidden w-3/4 h-3/4">
                  {/* Professional nutritionist photo */}
                  <div className="w-full h-full relative">
                    <Image
                      src="/me.png"
                      alt="Martin Cidlinský - Nutriční poradce"
                      fill
                      className="object-cover"
                      priority
                    />
                    {/* Overlay with info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white">
                          Martin Cidlinský
                        </h3>
                        <p className="text-green-400 font-semibold">
                          Nutriční poradce
                        </p>
                        <div className="flex items-center justify-center space-x-1 mt-3">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating credentials */}
                <div className="absolute -top-4 left-2 bg-white rounded-xl shadow-lg p-4 border border-green-100">
                  <div className="flex items-center space-x-2">
                    <Award className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Certifikace
                      </p>
                      <p className="text-xs text-gray-500">ISCED Level 6</p>
                    </div>
                  </div>
                </div>

                {/* Floating testimonial */}
                <div className="absolute -bottom-4 -right-2 bg-white rounded-xl shadow-lg p-4 max-w-xs border border-green-100">
                  <div className="flex items-start space-x-3">
                    {/* <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div> */}
                    <Image
                      className="w-10 h-10 rounded-full"
                      src="/woman.png"
                      alt="Testimonial Avatar"
                      width={40}
                      height={40}
                    />
                    <div>
                      <p className="text-sm text-gray-700">
                        &ldquo;Za 3 měsíce jsem zhubla 12 kg!&rdquo;
                      </p>
                      <p className="text-xs text-gray-500 mt-1">- Jana K.</p>
                    </div>
                  </div>
                </div>

                {/* Background healthy food illustration */}
                <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-10">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <circle
                      cx="100"
                      cy="80"
                      r="30"
                      fill="#22c55e"
                      opacity="0.3"
                    />
                    <circle
                      cx="70"
                      cy="120"
                      r="20"
                      fill="#ef4444"
                      opacity="0.3"
                    />
                    <circle
                      cx="130"
                      cy="110"
                      r="25"
                      fill="#f97316"
                      opacity="0.3"
                    />
                    <circle
                      cx="90"
                      cy="140"
                      r="15"
                      fill="#8b5cf6"
                      opacity="0.3"
                    />
                    <circle
                      cx="120"
                      cy="70"
                      r="18"
                      fill="#06b6d4"
                      opacity="0.3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
