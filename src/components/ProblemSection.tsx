"use client";

import {ArrowRight, AlertTriangle, Clock, Zap} from "lucide-react";

export default function ProblemSection() {
    const scrollToConsultation = () => {
        document.getElementById("konzultace")?.scrollIntoView({behavior: "smooth"});
    };

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <div className="text-center space-y-12">
                    <div className="flex items-center justify-center mb-6">
                        <AlertTriangle className="w-8 h-8 text-orange-500 mr-3 hidden md:block"/>
                        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                            Možná se v tom <span className="text-red-600">poznáváte</span>:
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-1 gap-6 max-w-3xl mx-auto">
                        <div
                            className="bg-white rounded-xl p-4 md:p-6 shadow-sm border-l-4 border-red-400 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-start space-x-4">
                                <div
                                    className="w-10 h-10 bg-red-100 rounded-full items-center justify-center flex-shrink-0 hidden md:flex">
                                    <Zap className="w-5 h-5 text-red-600"/>
                                </div>
                                <p className="text-lg text-gray-700 text-start">
                                    <strong className="text-red-700">Máte práci, rodinu, povinnosti</strong> a už
                                    nezbývá energie řešit složité diety.
                                </p>
                            </div>
                        </div>

                        <div
                            className="bg-white rounded-xl p-4 md:p-6 shadow-sm border-l-4 border-red-400 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-start space-x-4">
                                <div
                                    className="w-10 h-10 bg-red-100 rounded-full hidden  md:flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-5 h-5 text-red-600"/>
                                </div>
                                <p className="text-lg text-gray-700 text-start">
                                    <strong className="text-red-700">Nemáte čas</strong> trávit hodiny v posilovně.
                                </p>
                            </div>
                        </div>

                        <div
                            className="bg-white rounded-xl p-4 md:p-6 shadow-sm border-l-4 border-red-400 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-start space-x-4">
                                <div
                                    className="w-10 h-10 bg-red-100 rounded-full hidden md:flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-red-600"/>
                                </div>
                                <p className="text-lg text-gray-700 text-start">
                                    Už jste <strong className="text-red-700">vyzkoušeli počítání kalorií nebo populární
                                    diety</strong>, ale nikdy to dlouho nevydrželo.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 md:p-8 border border-green-200">
                        <div className="space-y-6">
                            <div className="flex items-center justify-center">
                                <span className="text-4xl mr-3 hidden md:blocks">💡</span>
                                <h3 className="text-2xl font-bold text-gray-900">Ale máme pro vás řešení!</h3>
                            </div>
                            <p className="text-xl text-gray-700">
                                <strong className="text-green-700">Pravda je, že zhubnout jde i
                                    jinak.</strong> Potřebujete jen strategii, která respektuje váš životní rytmus –
                                a <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">přesně na to se specializuji</span>.
                            </p>

                            <button
                                onClick={scrollToConsultation}
                                className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Zjistit jak to funguje
                                <ArrowRight className="ml-3 h-6 w-6"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
