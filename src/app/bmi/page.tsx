"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  CheckCircle,
  Target,
  TrendingUp,
  Star,
  Award,
  Phone,
  Mail,
} from "lucide-react";
import Footer from "@/components/Footer";

export default function BMICalculator() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
    goal: "",
  });

  const [email, setEmail] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

  const [showResults, setShowResults] = useState(false);
  const [bmi, setBmi] = useState(0);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const weightInKg = parseFloat(formData.weight);
      const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
      setBmi(parseFloat(calculatedBMI.toFixed(1)));
      setShowResults(true);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setEmailSubmitted(true);
      console.log("Form data:", { ...formData, email });
    }
  };

  const handlePlanRequest = () => {
    setShowEmailForm(true);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5)
      return {
        category: "Podváha",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      };
    if (bmi < 25)
      return {
        category: "Normální váha",
        color: "text-green-600",
        bgColor: "bg-green-50",
      };
    if (bmi < 30)
      return {
        category: "Nadváha",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
      };
    return { category: "Obezita", color: "text-red-600", bgColor: "bg-red-50" };
  };

  const getBMIRecommendation = (bmi: number) => {
    if (bmi < 18.5)
      return "Doporučuji konzultaci ohledně zdravého přibírání na váze s důrazem na svalovou hmotu.";
    if (bmi < 25)
      return "Gratulujeme! Máte zdravou váhu. Zaměřme se na udržení a optimalizaci složení těla.";
    if (bmi < 30)
      return "Mírná nadváha. S personalizovaným jídelníčkem dosáhneme zdravé váhy bez drastických opatření.";
    return "Doporučuji komplexní program s postupným hubnutím a změnou životního stylu.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">MC</span>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">
                  Martin Cidlinský
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Nutriční poradce
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Domů
              </Link>
              <Link
                href="/#konzultace"
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Konzultace
              </Link>
              <Link
                href="/#o-mne"
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                O mně
              </Link>
              <a
                href="tel:+420777123456"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
              >
                <Phone className="h-4 w-4 mr-2" />
                777 123 456
              </a>
            </nav>

            <Link
              href="/"
              className="md:hidden text-green-600 hover:text-green-700"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-8">
            <Calculator className="h-4 w-4 mr-2" />
            Bezplatná analýza
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            BMI kalkulačka
            <span className="block text-green-600">
              s personalizovaným plánem
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Zjistěte svůj BMI a získejte individuální doporučení pro dosažení
            vašich zdravotních cílů
          </p>

          <div className="flex items-center justify-center space-x-6 text-sm text-green-700 mb-12">
            <div className="flex items-center space-x-1">
              <Award className="h-4 w-4" />
              <span>Certifikovaný poradce</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span>4.9/5 hodnocení</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4" />
              <span>100% zdarma</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {!emailSubmitted ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
                <div className="mb-8">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    Vyplňte základní údaje
                  </h2>
                  <p className="text-gray-600">
                    Všechny informace jsou důvěrné a slouží pouze pro výpočet
                    BMI a personalizované doporučení.
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  {/* Age and Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Věk
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-900"
                        placeholder="např. 35"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Pohlaví
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-900"
                        required
                      >
                        <option value="">Vyberte pohlaví</option>
                        <option value="male">Muž</option>
                        <option value="female">Žena</option>
                      </select>
                    </div>
                  </div>

                  {/* Height and Weight */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Výška (cm)
                      </label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-900"
                        placeholder="např. 175"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Váha (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-900"
                        placeholder="např. 70"
                        required
                      />
                    </div>
                  </div>

                  {/* Activity Level */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Úroveň aktivity
                    </label>
                    <select
                      name="activityLevel"
                      value={formData.activityLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-900"
                      required
                    >
                      <option value="">Vyberte úroveň aktivity</option>
                      <option value="sedentary">
                        Sedavé zaměstnání, minimální pohyb
                      </option>
                      <option value="lightly-active">
                        Lehká aktivita (1-3x týdně)
                      </option>
                      <option value="moderately-active">
                        Mírná aktivita (3-5x týdně)
                      </option>
                      <option value="very-active">
                        Vysoká aktivita (6-7x týdně)
                      </option>
                      <option value="extra-active">
                        Extrémně aktivní (2x denně, těžké tréninky)
                      </option>
                    </select>
                  </div>

                  {/* Goal */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Váš cíl
                    </label>
                    <select
                      name="goal"
                      value={formData.goal}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-900"
                      required
                    >
                      <option value="">Vyberte váš cíl</option>
                      <option value="lose-weight">Zhubnout</option>
                      <option value="maintain-weight">Udržet váhu</option>
                      <option value="gain-weight">Přibrat na váze</option>
                      <option value="build-muscle">Budovat svaly</option>
                      <option value="improve-health">Zlepšit zdraví</option>
                    </select>
                  </div>

                  {/* Calculate Button */}
                  <button
                    type="button"
                    onClick={calculateBMI}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Vypočítat BMI
                  </button>
                </form>
              </div>

              {/* Results/Info Panel */}
              <div className="space-y-8">
                {showResults ? (
                  <>
                    {/* BMI Results */}
                    <div className="bg-white rounded-3xl shadow-xl p-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Vaše výsledky
                      </h2>

                      <div className="text-center mb-8">
                        <div className="text-6xl font-bold text-green-600 mb-2">
                          {bmi}
                        </div>
                        <div className="text-lg text-gray-600">Vaše BMI</div>
                      </div>

                      <div
                        className={`p-6 rounded-2xl ${
                          getBMICategory(bmi).bgColor
                        } mb-6`}
                      >
                        <div
                          className={`text-xl font-bold ${
                            getBMICategory(bmi).color
                          } mb-2`}
                        >
                          {getBMICategory(bmi).category}
                        </div>
                        <p className="text-gray-700">
                          {getBMIRecommendation(bmi)}
                        </p>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div className="flex items-center space-x-3">
                          <Target className="h-5 w-5 text-green-600" />
                          <span className="text-gray-700">
                            Cíl: {formData.goal}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <span className="text-gray-700">
                            Aktivita: {formData.activityLevel}
                          </span>
                        </div>
                      </div>

                      {!showEmailForm ? (
                        <button
                          onClick={handlePlanRequest}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          Získat personalizovaný plán zdarma
                        </button>
                      ) : (
                        <form
                          onSubmit={handleEmailSubmit}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Email pro zaslání personalizovaného plánu
                            </label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-900"
                              placeholder="vas@email.cz"
                              required
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Váš email použijeme pouze pro zaslání
                              personalizovaného plánu.
                            </p>
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            Odeslat plán na email
                          </button>
                        </form>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Info Panel */}
                    <div className="bg-white rounded-3xl shadow-xl p-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Co získáte?
                      </h2>

                      <div className="space-y-4 mb-8">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Přesný výpočet BMI
                            </h3>
                            <p className="text-gray-600 text-sm">
                              Na základě vašich parametrů a úrovně aktivity
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Personalizované doporučení
                            </h3>
                            <p className="text-gray-600 text-sm">
                              Individuální rady podle vašeho cíle
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Bezplatná konzultace
                            </h3>
                            <p className="text-gray-600 text-sm">
                              20 minut s certifikovaným poradcem
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-2xl p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <Award className="h-6 w-6 text-green-600" />
                          <span className="font-bold text-green-800">
                            Martin Cidlinský
                          </span>
                        </div>
                        <p className="text-green-700 text-sm leading-relaxed">
                          Certifikovaný nutriční poradce s 8+ lety zkušeností.
                          Pomohl více než 500 klientům dosáhnout jejich
                          zdravotních cílů.
                        </p>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl shadow-xl p-8 text-white text-center">
                      <h3 className="text-xl font-bold mb-4">Máte otázky?</h3>
                      <p className="mb-6 opacity-90">
                        Kontaktujte mě ještě dnes
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                          href="tel:+420777123456"
                          className="flex items-center justify-center px-6 py-3 bg-white text-green-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                        >
                          <Phone className="h-5 w-5 mr-2" />
                          Zavolat
                        </a>
                        <a
                          href="mailto:info@jidlosmartinem.cz"
                          className="flex items-center justify-center px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-green-700 transition-all"
                        >
                          <Mail className="h-5 w-5 mr-2" />
                          Email
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Thank You Page */
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-3xl shadow-xl p-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Děkuji za váš zájem!
                </h2>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Vaše výsledky a personalizované doporučení jsem odeslal na
                  email <strong>{email}</strong>. Očekávejte je do 15 minut.
                </p>

                <div className="bg-green-50 rounded-2xl p-6 mb-8">
                  <h3 className="font-bold text-green-800 mb-4">
                    Co bude následovat:
                  </h3>
                  <div className="text-left space-y-2 text-green-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Obdržíte detailní analýzu BMI</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Personalizované doporučení pro váš cíl</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Pozvánku na bezplatnou konzultaci</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/"
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
                  >
                    Zpět na hlavní stránku
                  </Link>
                  <a
                    href="tel:+420777123456"
                    className="px-8 py-4 border-2 border-green-500 text-green-700 rounded-xl font-semibold hover:bg-green-50 transition-colors"
                  >
                    Zavolat nyní
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
