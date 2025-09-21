"use client";

import Image from "next/image";
import { User, Award, CheckCircle, Target, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <section
      id="o-mne"
      className="py-24 bg-gradient-to-br from-green-50 via-white to-blue-50"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center space-y-16">
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
            Kdo jsem
          </h2>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg border border-gray-200">
            <div className="flex flex-col items-center space-y-8">
              {/* Profile Image */}
              <div className="relative w-full max-w-2xl">
                <div className="w-full overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src="/kdojsem.jpg"
                    alt="Martin Cidlinský - Certifikovaný výživový poradce"
                    width={800}
                    height={500}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Name and Title */}
              <div className="text-center">
                <h3 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3">
                  Martin Cidlinský
                </h3>
                <p className="text-green-700 font-bold text-xl mb-6">
                  Certifikovaný výživový poradce
                </p>
                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-3xl">
                  Více než{" "}
                  <strong className="text-green-700">
                    10 let pomáhám lidem, kteří nemají čas na složité jídelníčky
                    a hodiny v posilovně, zhubnout zdravě a udržitelně
                  </strong>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Cards */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-6 text-center">
                Můj přístup{" "}
                <span className="text-green-600">je jednoduchý</span>
              </h3>
              <p className="text-lg text-gray-700 text-center leading-relaxed mb-8">
                Místo univerzálních diet stavím{" "}
                <strong className="text-green-700">
                  efektivní plány na míru
                </strong>
                , které se přizpůsobí vašemu pracovnímu i rodinnému životu.
              </p>

              <div className="text-xl font-bold text-gray-900 text-center mb-8">
                Proto moji klienti dokážou:
              </div>

              <div className="grid gap-4 max-w-3xl mx-auto">
                <div className="flex items-start text-start space-x-4 bg-green-50 rounded-lg p-5 border-l-4 border-green-400">
                  <ArrowRight className="w-6 h-6  text-green-600 mt-0.5 flex-shrink-0 hidden md:block" />
                  <span className="text-gray-700 leading-relaxed">
                    <strong className="text-green-700">
                      Shodit přebytečná kila
                    </strong>{" "}
                    bez drastických změn
                  </span>
                </div>

                <div className="flex items-start text-start space-x-4 bg-green-50 rounded-lg p-5 border-l-4 border-green-400">
                  <ArrowRight className="w-6 h-6  text-green-600 mt-0.5 flex-shrink-0 hidden md:block" />
                  <span className="text-gray-700 leading-relaxed">
                    Najít <strong className="text-green-700">rovnováhu</strong>{" "}
                    mezi zdravým životním stylem a povinnostmi
                  </span>
                </div>

                <div className="flex items-start text-start space-x-4 bg-green-50 rounded-lg p-5 border-l-4 border-green-400">
                  <ArrowRight className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0 hidden md:block" />
                  <span className="text-gray-700 leading-relaxed">
                    <strong className="text-green-700">
                      Udržet výsledky dlouhodobě
                    </strong>
                  </span>
                </div>

                <div className="flex items-start text-start space-x-4 bg-green-50 rounded-lg p-5 border-l-4 border-green-400">
                  <ArrowRight className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0 hidden md:block" />
                  <span className="text-gray-700 leading-relaxed">
                    Bez toho, abyste{" "}
                    <strong className="text-green-700">
                      počítali každou kalorii
                    </strong>
                  </span>
                </div>

                <div className="flex items-start text-start space-x-4 bg-green-50 rounded-lg p-5 border-l-4 border-green-400">
                  <ArrowRight className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0 hidden md:block" />
                  <span className="text-gray-700 leading-relaxed">
                    Bez toho, abyste{" "}
                    <strong className="text-green-700">
                      museli chodit do posilovny
                    </strong>
                  </span>
                </div>

                <div className="flex items-start text-start space-x-4 bg-green-50 rounded-lg p-5 border-l-4 border-green-400">
                  <ArrowRight className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0 hidden md:block" />
                  <span className="text-gray-700 leading-relaxed">
                    Bez{" "}
                    <strong className="text-green-700">
                      hladovění a jojo efektu
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center">
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                Místo univerzálních rad dostanete{" "}
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-bold">
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
