"use client";

import { ArrowRight, AlertTriangle, Clock, Zap } from "lucide-react";
import Image from "next/image";

export default function ProblemSection() {
  const scrollToConsultation = () => {
    document
      .getElementById("konzultace")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Right column - Image */}
          <div className="relative lg:order-first hidden lg:block">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/zadumanej.jpg"
                alt="Zamyšlená žena nad hubnutím a životním stylem"
                width={500}
                height={600}
                className="object-cover w-full h-auto"
              />
              {/* Optional overlay for better visual effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
            </div>
          </div>
          {/* Left column - Text content */}
          <div className="space-y-12">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-8">
                Možná se v tom <span className="text-red-600">poznáváte</span>:
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border-l-4 border-red-400 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-start space-x-4">
                  <ArrowRight className="w-6 h-6 text-red-700 mt-0.5 flex-shrink-0 hidden md:block" />
                  <p className="text-lg text-gray-700 text-start">
                    <strong className="text-red-700">
                      Máte práci, rodinu, povinnosti
                    </strong>{" "}
                    a už nezbývá energie řešit složité diety.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border-l-4 border-red-400 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-start space-x-4">
                  <ArrowRight className="w-6 h-6 text-red-700 mt-0.5 flex-shrink-0 hidden md:block" />
                  <p className="text-lg text-gray-700 text-start">
                    <strong className="text-red-700">Nemáte čas</strong> trávit
                    hodiny v posilovně.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border-l-4 border-red-400 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-start space-x-4">
                  <ArrowRight className="w-6 h-6 text-red-700 mt-0.5 flex-shrink-0 hidden md:block" />
                  <p className="text-lg text-gray-700 text-start">
                    Už jste{" "}
                    <strong className="text-red-700">
                      vyzkoušeli počítání kalorií nebo populární diety
                    </strong>
                    , ale nikdy to dlouho nevydrželo.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="space-y-8">
                <p className="text-3xl lg:text-4xl font-black text-gray-700 leading-tight">
                  <strong className="text-green-700">
                    Pravda je, že zhubnout jde i jinak.
                  </strong>
                </p>

                <button
                  onClick={scrollToConsultation}
                  className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Jak?
                  <ArrowRight className="ml-3 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
