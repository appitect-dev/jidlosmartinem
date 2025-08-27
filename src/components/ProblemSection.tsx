"use client";

import { ArrowRight, AlertTriangle, Clock, Zap } from "lucide-react";

export default function ProblemSection() {
  const scrollToConsultation = () => {
    document
      .getElementById("konzultace")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center space-y-12">
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
              Možná se v tom <span className="text-red-600">poznáváte</span>:
            </h2>
          </div>

          <div className="grid md:grid-cols-1 gap-6 max-w-3xl mx-auto">
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

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-3xl mx-auto">
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
    </section>
  );
}
