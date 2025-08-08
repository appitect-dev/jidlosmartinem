import { Target, TrendingUp, CheckCircle, Star, Users } from 'lucide-react';

export default function Services() {
  const services = [
    {
      title: "Individuální jídelníček",
      price: "2 000 Kč",
      period: "jednorázově",
      description: "Sestavím vám jídelníček přesně na míru podle vašich potřeb, cílů a preferencí.",
      features: [
        "Kompletní analýza stravovacích návyků",
        "7denní detailní jídelníček s recepty",
        "Seznam nákupů a příprava",
        "Nutriční hodnoty všech jídel",
        "Doporučení pro suplementy"
      ],
      icon: Target,
      popular: false,
      color: "blue",
      results: "89% klientů dosáhne cíle do 30 dnů"
    },
    {
      title: "30denní transformace",
      price: "Individuální cena", 
      period: "na míru",
      description: "Komplexní program s průběžným vedením a úpravami podle vašeho pokroku.",
      features: [
        "4 osobní konzultace (online/osobně)",
        "Analýza krevních hodnot a biomarkerů",
        "Průběžné úpravy jídelníčku",
        "Podpora 7 dní v týdnu",
        "Měření pokroku a motivace",
        "Cvičební plán na míru"
      ],
      icon: TrendingUp,
      popular: true,
      color: "green",
      results: "Průměrně -8kg za měsíc"
    }
  ];

  return (
    <section id="sluzby" className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
            <Star className="h-4 w-4 mr-2" />
            Ověřené výsledky
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Vyberte si cestu ke zdraví
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Každý člověk je jedinečný. Proto nabízím služby přizpůsobené různým potřebám a životním situacím.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isPopular = service.popular;
            const colorClasses = service.color === 'green' 
              ? 'from-green-500 to-emerald-600' 
              : 'from-blue-500 to-indigo-600';
            
            return (
              <div 
                key={index}
                className={`relative bg-white rounded-2xl p-8 lg:p-10 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isPopular ? 'ring-2 ring-green-500 transform scale-105' : 'hover:scale-105'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 text-sm font-semibold rounded-full shadow-lg">
                    ⭐ Nejoblíbenější volba
                  </div>
                )}
                
                <div className="mb-8">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${colorClasses} mb-6`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-4xl lg:text-5xl font-bold text-gray-900">
                      {service.price}
                    </span>
                    <span className="text-lg text-gray-500 font-medium">
                      {service.period}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-lg leading-relaxed mb-4">
                    {service.description}
                  </p>
                  
                  {/* Results badge */}
                  <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {service.results}
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  <h4 className="font-semibold text-gray-900 text-lg">Co získáte:</h4>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  isPopular 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl' 
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}>
                  {service.popular ? 'Začít transformaci' : 'Objednat jídelníček'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust indicators */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <Users className="h-8 w-8 text-green-600 mx-auto" />
              <div className="text-3xl font-bold text-gray-900">500+</div>
              <div className="text-gray-600">Spokojených klientů</div>
            </div>
            <div className="space-y-2">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto" />
              <div className="text-3xl font-bold text-gray-900">95%</div>
              <div className="text-gray-600">Úspěšnost programů</div>
            </div>
            <div className="space-y-2">
              <Star className="h-8 w-8 text-yellow-500 mx-auto" />
              <div className="text-3xl font-bold text-gray-900">4.9/5</div>
              <div className="text-gray-600">Průměrné hodnocení</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
