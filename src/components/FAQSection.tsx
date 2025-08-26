"use client";

import {HelpCircle, DollarSign, Dumbbell, UtensilsCrossed} from "lucide-react";

export default function FAQSection() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <div className="text-center space-y-12">
                    <div className="flex items-center justify-center mb-6">
                        <HelpCircle className="w-8 h-8 text-green-600 mr-3"/>
                        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                            FAQ
                        </h2>
                    </div>

                    <div className="space-y-6 max-w-3xl mx-auto">
                        {/* Question 1 */}
                        <div
                            className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-center mb-6">
                                <div
                                    className="w-12 h-12 bg-green-100 rounded-full hidden md:flex items-center justify-center mr-4 flex-shrink-0">
                                    <DollarSign className="w-6 h-6 text-green-600"/>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900">
                                    <strong>Kolik to stojí?</strong>
                                </h3>
                            </div>
                            <div className="text-center">
                                <p className="text-lg text-gray-700">
                                    Konzultace je{" "}
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                    zcela zdarma
                  </span>
                                    . Pokud se rozhodnete jít dál, ukážu vám možnost spolupráce v
                                    rámci{" "}
                                    <strong className="text-green-700">30denního programu</strong>.
                                </p>
                            </div>
                        </div>

                        {/* Question 2 */}
                        <div
                            className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-center mb-6">
                                <div
                                    className="w-12 h-12 bg-blue-100 rounded-full hidden md:flex items-center justify-center mr-4 flex-shrink-0">
                                    <Dumbbell className="w-6 h-6 text-blue-600"/>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900">
                                    Potřebuji cvičit?
                                </h3>
                            </div>
                            <div className="text-center">
                                <p className="text-lg text-gray-700">
                                    <strong className="text-blue-700">Ne</strong> – specializuji se
                                    na lidi, kteří{" "}
                                    <strong className="text-blue-700">nemají čas na posilovnu</strong>
                                    .
                                </p>
                            </div>
                        </div>

                        {/* Question 3 */}
                        <div
                            className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-center mb-6">
                                <div
                                    className="w-12 h-12 bg-orange-100 rounded-full hidden md:flex items-center justify-center mr-4 flex-shrink-0">
                                    <UtensilsCrossed className="w-6 h-6 text-orange-600"/>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900">
                                    <strong>Musím držet dietu?</strong>
                                </h3>
                            </div>
                            <div className="text-center space-y-3">
                                <p className="text-lg text-gray-700">
                                    <strong className="text-orange-700">Ne</strong> – dostanete
                                    doporučení, která zapadnou do vašeho{" "}
                                    <strong className="text-orange-700">běžného jídelníčku</strong>.
                                </p>
                                <p className="text-lg text-gray-700">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded font-semibold">
                    Žádné drastické diety a hladovky.
                  </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
