"use client";

import {ArrowRight, Target, Clock, Users} from "lucide-react";
import Header from "./Header";

export default function Hero() {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
            <Header/>

            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-15"></div>
            </div>

            <section className="relative pt-32 pb-20 px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Trust indicator */}
                    <div
                        className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-8">
                        <Users className="w-4 h-4 mr-2"/>
                        Důvěřuje nám 150+ klientů
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-8">
                        <span className="text-green-600">Zhubněte 5 kg</span> za 30 dní –
                        <br/>i když máte <span className="underline decoration-yellow-400 decoration-4">práci, rodinu a minimum času</span>
                    </h1>

                    <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-12">
                        <div
                            className="flex items-center bg-white px-2 md:px-4 py-2 rounded-full shadow-sm border border-gray-200 text-xs md:text-base whitespace-nowrap">
                            <Target className="md:w-5 md:h-5 w-4 h-4 text-green-600 mr-2"/>
                            <span className="text-gray-700 font-medium">Bez posilovny</span>
                        </div>
                        <div
                            className="flex items-center bg-white px-2 md:px-4 py-2 rounded-full shadow-sm border border-gray-200 text-xs md:text-base whitespace-nowrap">
                            <Clock className="md:w-5 md:h-5 w-4 h-4 text-green-600 mr-2"/>
                            <span className="text-gray-700 font-medium">Bez počítání kalorií</span>
                        </div>
                        <div
                            className="flex items-center bg-white px-2 md:px-4 py-2 rounded-full shadow-sm border border-gray-200 text-xs md:text-base whitespace-nowrap">
                            <span className="text-green-600 font-bold mr-2">✓</span>
                            <span className="text-gray-700 font-medium">Bez drastických diet</span>
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-2xl shadow-lg p-4 md:p-8 border border-gray-100 max-w-3xl mx-auto mb-8">
                        <p className="text-xl text-gray-700 leading-relaxed">
                            👉 <em>Rezervujte si svou <span
                            className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">konzultaci zdarma</span> a
                            zjistěte, jak může vypadat váš <strong>30denní plán na míru</strong>.</em>
                        </p>
                    </div>

                    <a
                        href="/rezervace"
                        className="inline-flex items-center justify-center px-12 py-6 text-xl font-bold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Rezervovat konzultaci zdarma
                        <ArrowRight className="ml-3 h-6 w-6"/>
                    </a>

                    <p className="text-sm text-gray-500 mt-4">
                        ✅ 100% zdarma • ✅ Bez závazků • ✅ Online konzultace
                    </p>
                </div>
            </section>
        </div>
    );
}
