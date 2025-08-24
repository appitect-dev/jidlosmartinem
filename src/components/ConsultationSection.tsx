"use client";

import { ArrowRight, MessageCircle, CheckCircle, Clock, Target, FileText } from "lucide-react";

export default function ConsultationSection() {
  return (
    <section id="konzultace" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center space-y-12">
          <div className="flex items-center justify-center mb-6">
            <MessageCircle className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
              Co je{" "}
              <span className="text-green-600">konzultace zdarma</span>
            </h2>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
              <p className="text-lg text-gray-800 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600 mr-3" />
                Na konzultaci{" "}
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold mx-2">
                  (30–40 minut)
                </span>
                :
              </p>
            </div>

            <div className="grid md:grid-cols-1 gap-6 max-w-3xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-400 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold text-lg">1</span>
                  </div>
                  <p className="text-lg text-gray-700 text-center">
                    <strong className="text-green-700">
                      Probereme váš současný režim a cíle.
                    </strong>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-400 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold text-lg">2</span>
                  </div>
                  <p className="text-lg text-gray-700 text-center">
                    Na základě vyplněného dotazníku rovnou dostanete{" "}
                    <strong className="text-green-700">konkrétní doporučení</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-400 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold text-lg">3</span>
                  </div>
                  <p className="text-lg text-gray-700 text-center">
                    Ukážu vám, jak by mohl vypadat váš{" "}
                    <strong className="text-green-700">30denní plán</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 max-w-3xl mx-auto">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">💡</span>
                <p className="text-lg text-gray-700">
                  <em>
                    Díky krátkému dotazníku se{" "}
                    <strong>nebudeme zdržovat obecnými otázkami</strong> – rovnou
                    půjdeme k věci.
                  </em>
                </p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Připraveni začít?</h3>
              <a
                href="/rezervace"
                className="inline-flex items-center justify-center px-12 py-6 text-xl font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-300 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Rezervovat konzultaci zdarma
                <ArrowRight className="ml-3 h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
