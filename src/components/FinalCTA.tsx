"use client";

import {ArrowRight, Sparkles, Clock, CheckCircle} from "lucide-react";

export default function FinalCTA() {
    return (
        <section className="py-20 bg-gradient-to-br from-green-600 to-green-700 text-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-1/4 left-1/4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
                <div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-15"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 lg:px-8 relative">
                <div className="text-center space-y-8">
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-yellow-400 mr-3 hidden md:block"/>
                            <h2 className="text-4xl lg:text-5xl font-black leading-tight">
                                <strong>
                                    Udělejte první krok{" "}
                                    <span className="text-yellow-400">dnes</span>.
                                </strong>
                            </h2>
                        </div>
                    </div>

                    {/* Main message */}
                    <div
                        className="bg-white/10 backdrop-blur rounded-2xl p-4 md:p-6 border border-white/20 max-w-3xl mx-auto">
                        <p className="text-xl lg:text-2xl leading-relaxed">
                            <strong className="text-yellow-400">
                                Rezervujte si konzultaci zdarma
                            </strong>{" "}
                            a zjistěte, jak zhubnout{" "}
                            <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-lg font-bold">
                5&nbsp;kg&nbsp;za&nbsp;30&nbsp;dní
              </span>{" "}
                            – bez posilovny, bez počítání kalorií a bez drastických diet.
                        </p>
                    </div>

                    {/* Benefits grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                        <div
                            className="flex items-center justify-center bg-white/10 backdrop-blur rounded-xl py-3 px-4 border border-white/20">
                            <CheckCircle className="w-5 h-5 text-green-300 mr-2"/>
                            <span className="font-medium">100% zdarma</span>
                        </div>
                        <div
                            className="flex items-center justify-center bg-white/10 backdrop-blur rounded-xl py-3 px-4 border border-white/20">
                            <Clock className="w-5 h-5 text-green-300 mr-2"/>
                            <span className="font-medium">30-40 minut</span>
                        </div>
                        <div
                            className="flex items-center justify-center bg-white/10 backdrop-blur rounded-xl py-3 px-4 border border-white/20">
                            <CheckCircle className="w-5 h-5 text-green-300 mr-2"/>
                            <span className="font-medium">Bez závazků</span>
                        </div>
                    </div>

                    {/* Main CTA */}
                    <div className="space-y-6 pt-4">
                        <a
                            href="/rezervace"
                            className="inline-flex items-center justify-center px-12 lg:px-16 py-6 lg:py-8 text-xl lg:text-2xl font-bold text-gray-900 bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-200 rounded-2xl lg:rounded-3xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105"
                        >
                            Rezervovat konzultaci zdarma
                            <ArrowRight className="ml-3 lg:ml-4 h-6 w-6 lg:h-8 lg:w-8"/>
                        </a>

                        {/* Supporting text */}
                        <div className="space-y-2">
                            <p className="text-lg opacity-90">
                                ⚡ Rychlé online rezervace • 📞 Okamžité potvrzení
                            </p>
                            <p className="text-sm opacity-75 max-w-md mx-auto">
                                Připojte se k 150+ spokojeným klientům, kteří změnili svůj život
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
