"use client";

import Image from "next/image";
import { User, Award, CheckCircle, Target } from "lucide-react";

export default function About() {
  return (
    <section id="o-mne" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center space-y-12">
          <div className="flex items-center justify-center mb-6">
            <User className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
              Kdo jsem
            </h2>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200 max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-8 mb-6">
              {/* Profile Image - Made Larger */}
              <div className="relative">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-xl border-4 border-white">
                  <Image
                    src="/me.png"
                    alt="Martin Cidlinský - Certifikovaný výživový poradce"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Name and Title */}
              <div className="text-center lg:text-left">
                <h3 className="text-3xl font-bold text-gray-900">
                  Martin Cidlinský
                </h3>
                <p className="text-green-700 font-semibold text-lg">
                  Certifikovaný výživový poradce
                </p>
              </div>
            </div>
          </div>

          <div className="text-left max-w-3xl mx-auto space-y-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              Jmenuji se{" "}
              <strong className="text-green-700">Martin Cidlinský</strong> a jsem{" "}
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                certifikovaný výživový poradce
              </span>
              .
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              Více než{" "}
              <strong className="text-green-700">
                5 let pomáhám lidem, kteří nemají čas na složité jídelníčky a
                hodiny v posilovně, zhubnout zdravě a udržitelně
              </strong>
              .
            </p>

            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <p className="text-lg text-gray-700 leading-relaxed">
                Můj přístup{" "}
                <strong className="text-green-700">je jednoduchý</strong> – místo
                univerzálních diet stavím{" "}
                <strong className="text-green-700">
                  efektivní plány na míru
                </strong>
                , které se přizpůsobí vašemu pracovnímu i rodinnému životu.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center">
                <Target className="w-6 h-6 text-green-600 mr-3" />
                <p className="text-lg text-gray-700 font-medium">
                  Proto moji klienti dokážou:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    Shodit přebytečná kila{" "}
                    <strong>bez drastických změn</strong>.
                  </span>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    Najít <strong>rovnováhu</strong> mezi zdravím a povinnostmi.
                  </span>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    Udržet výsledky <strong>dlouhodobě</strong>
                  </span>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    Bez toho, abyste{" "}
                    <strong>počítali každou kalorii</strong>
                  </span>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    Bez toho, abyste{" "}
                    <strong>museli chodit do posilovny</strong>
                  </span>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    Bez <strong>hladovění a jojo efektu</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 text-white rounded-xl p-6 text-center">
              <p className="text-lg leading-relaxed">
                Místo univerzálních rad dostanete{" "}
                <span className="text-yellow-400 font-bold">
                  30denní program na míru
                </span>
                , který zapadne do vašeho běžného dne.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
