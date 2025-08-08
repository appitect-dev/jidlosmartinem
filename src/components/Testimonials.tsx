'use client';

import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Jana Svobodová",
      age: 34,
      profession: "Marketing manažerka",
      image: "JS", // Placeholder for initials
      rating: 5,
      text: "Martin mi pomohl shodit 15 kg za 4 měsíce. Jeho jídelníčky byly chutné a praktické. Konečně mám energii po celý den a cítím se skvěle!",
      result: "-15 kg za 4 měsíce",
      beforeAfter: { before: 78, after: 63 }
    },
    {
      name: "Tomáš Novotný", 
      age: 41,
      profession: "IT specialista",
      image: "TN",
      rating: 5,
      text: "Trpěl jsem vysokým cholesterolem. Díky Martinovu programu se mi podařilo snížit hodnoty bez léků. Doporučuji všem!",
      result: "Snížení cholesterolu o 35%",
      beforeAfter: { before: "6.8 mmol/l", after: "4.4 mmol/l" }
    },
    {
      name: "Petra Krásná",
      age: 29,
      profession: "Fitness trenérka", 
      image: "PK",
      rating: 5,
      text: "I jako trenérka jsem se od Martina naučila spoustu nového o výživě. Jeho přístup je profesionální a skutečně funguje.",
      result: "Zlepšení výkonu o 25%",
      beforeAfter: { before: "Únava", after: "Energie" }
    },
    {
      name: "Pavel Horák",
      age: 38,
      profession: "Obchodní ředitel",
      image: "PH", 
      rating: 5,
      text: "Měl jsem problémy s trávením a nedostatkem energie. Martin sestavil jídelníček, který vyřešil oba problémy. Jsem velmi spokojený!",
      result: "100% zlepšení trávení",
      beforeAfter: { before: "Problémy", after: "Bez obtíží" }
    }
  ];

  const stats = {
    totalClients: 500,
    averageRating: 4.9,
    successRate: 95,
    averageWeightLoss: 8.5
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-6">
            <Star className="h-4 w-4 mr-2" />
            Ověřené recenze
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Co říkají moji klienti
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Jejich úspěchy mluví za vše. Přečtěte si skutečné příběhy lidí, kterým jsem pomohl změnit život.
          </p>
        </div>

        {/* Statistics bar */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">{stats.totalClients}+</div>
              <div className="text-gray-600 font-medium">Spokojených klientů</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <span className="text-4xl font-bold text-green-600">{stats.averageRating}</span>
                <Star className="h-6 w-6 text-yellow-400 fill-current ml-1" />
              </div>
              <div className="text-gray-600 font-medium">Průměrné hodnocení</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">{stats.successRate}%</div>
              <div className="text-gray-600 font-medium">Úspěšnost programů</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">-{stats.averageWeightLoss} kg</div>
              <div className="text-gray-600 font-medium">Průměrný úbytek</div>
            </div>
          </div>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 h-8 w-8 text-green-200" />
              
              {/* Header with photo and info */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {testimonial.image}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{testimonial.name}</h3>
                  <p className="text-gray-600">{testimonial.profession}, {testimonial.age} let</p>
                  <div className="flex items-center mt-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Testimonial text */}
              <blockquote className="text-gray-700 leading-relaxed mb-6 text-lg">
                &ldquo;{testimonial.text}&rdquo;
              </blockquote>

              {/* Results */}
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-700 mb-1">
                    {testimonial.result}
                  </div>
                  <div className="text-sm text-green-600">
                    {typeof testimonial.beforeAfter.before === 'number' 
                      ? `${testimonial.beforeAfter.before} kg → ${testimonial.beforeAfter.after} kg`
                      : `${testimonial.beforeAfter.before} → ${testimonial.beforeAfter.after}`
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA section */}
        <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Chcete být další úspěšný příběh?
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Připojte se k více než 500 spokojeným klientům a začněte svou transformaci již dnes.
          </p>
          <button 
            onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Začít svou transformaci
          </button>
        </div>
      </div>
    </section>
  );
}
