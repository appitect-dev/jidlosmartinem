"use client";

import { Award, Users, Clock, BookOpen, Heart, Shield } from "lucide-react";

export default function About() {
  const stats = [
    { icon: Users, number: "500+", label: "Spokojených klientů" },
    { icon: Clock, number: "10+", label: "Let zkušeností" },
    { icon: Award, number: "15+", label: "Certifikací" },
    { icon: Heart, number: "95%", label: "Úspěšnost" },
  ];

  const certifications = [
    "Certifikovaný nutriční poradce (ISNC)",
    "Specialista sportovní výživy",
    "Odborník na metabolismus",
    "Certifikát funkční medicíny",
  ];

  const approach = [
    {
      icon: BookOpen,
      title: "Vědecký přístup",
      description:
        "Každé doporučení je podložené nejnovějšími vědeckými poznatky a výzkumy.",
    },
    {
      icon: Heart,
      title: "Individuální péče",
      description:
        "Každý plán je vytvořen na míru podle vašich specifických potřeb a cílů.",
    },
    {
      icon: Shield,
      title: "Bezpečnost především",
      description:
        "Všechny postupy jsou bezpečné a zdraví prospěšné, bez extrémních diet.",
    },
  ];

  return (
    <section id="o-mne" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
          {/* Personal story */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <Award className="h-4 w-4 mr-2" />
                Certifikovaný expert
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Jsem Martin Cidlinský
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed">
                S výživou se zabývám již více než 8 let. Začal jsem studiem
                nutrice na vysoké škole a postupně jsem si osvojil praktické
                zkušenosti prací s více než 500 klienty.
              </p>

              <p className="text-lg text-gray-600 leading-relaxed">
                Moje filosofie je jednoduchá: zdravá výživa nemusí být
                komplikovaná. Věřím, že každý si zaslouží mít energii, cítit se
                dobře ve své kůži a užívat si jídlo. Proto vytvářím jídelníčky,
                které jsou nejen účinné, ale také chutné a praktické pro váš
                každodenní život.
              </p>
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">
                Kvalifikace & certifikace:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <Award className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800">
                      {cert}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Professional photo and trust elements */}
          <div className="relative">
            <div className="relative">
              {/* Main photo */}
              <div className="aspect-[4/5] bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-xl overflow-hidden">
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  {/* Professional headshot placeholder */}
                  <div className="w-48 h-48 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center mb-8 shadow-2xl">
                    <span className="text-white text-6xl font-bold">MC</span>
                  </div>

                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Martin Cidlinský
                    </h3>
                    <p className="text-green-700 font-semibold text-lg">
                      Nutriční poradce
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>10+ let praxe</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg border border-green-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">500+</div>
                  <div className="text-xs text-gray-600">Klientů</div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg border border-green-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <div className="text-xs text-gray-600">Úspěšnost</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-12 mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center space-y-3">
                  <div className="inline-flex p-4 bg-white rounded-xl shadow-md">
                    <Icon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Approach */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Můj přístup k výživě
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kombinuji vědecké poznatky s praktickými zkušenostmi pro dosažení
              trvalých výsledků
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {approach.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="inline-flex p-4 bg-green-100 rounded-xl mb-6">
                    <Icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
