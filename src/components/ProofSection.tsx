"use client";

import {ArrowRight, Star, TrendingDown, Users} from "lucide-react";

export default function ProofSection() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <div className="text-center space-y-12">
                    <div className="flex items-center justify-center mb-6">
                        <Users className="w-8 h-8 text-green-600 mr-3"/>
                        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                            Proč já?
                        </h2>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-green-100 rounded-xl p-6 border border-green-200">
                            <p className="text-xl text-gray-800 flex items-center justify-center">
                                <span className="text-2xl mr-3">👉</span>
                                Můj přístup už pomohl&nbsp;<strong className="text-green-700">desítkám lidí</strong>,
                                kteří řešili přesně to, co vy.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-1 gap-6 max-w-3xl mx-auto">
                            <div
                                className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-400 hover:shadow-md transition-shadow">
                                <div className="flex items-start space-x-4">
                                    <div
                                        className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <TrendingDown className="w-6 h-6 text-green-600"/>
                                    </div>
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <h3 className="text-lg font-bold text-gray-900 mr-3">Lenka, 37 let</h3>
                                            <span
                                                className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">-6 kg</span>
                                        </div>
                                        <p className="text-gray-700">
                                            zhubla <strong className="text-green-700">6 kg za měsíc</strong>, přestože
                                            pracuje na plný úvazek a má dvě děti.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-400 hover:shadow-md transition-shadow">
                                <div className="flex items-start space-x-4">
                                    <div
                                        className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <TrendingDown className="w-6 h-6 text-green-600"/>
                                    </div>
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <h3 className="text-lg font-bold text-gray-900 mr-3">Petr, 42 let</h3>
                                            <span
                                                className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">-5 kg</span>
                                        </div>
                                        <p className="text-gray-700">
                                            shodil <strong className="text-green-700">5 kg za 30 dní</strong>, aniž by
                                            jedinkrát vkročil do posilovny.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-400 hover:shadow-md transition-shadow">
                                <div className="flex items-start space-x-4">
                                    <div
                                        className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Star className="w-6 h-6 text-green-600"/>
                                    </div>
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <h3 className="text-lg font-bold text-gray-900 mr-3">Monika, 29 let</h3>
                                            <span
                                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">Energie +</span>
                                        </div>
                                        <p className="text-gray-700">
                                            zbavila se <strong className="text-green-700">únavy</strong> a konečně
                                            zvládá jíst pravidelně bez stresu.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <a
                            href="/rezervace"
                            className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Chci také takové výsledky - rezervovat ZDARMA
                            <ArrowRight className="ml-3 h-6 w-6"/>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
