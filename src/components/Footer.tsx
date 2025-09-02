"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-50 text-gray-900 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <span className="text-3xl transition-transform group-hover:scale-110 duration-300">
                🍏
              </span>
              <div>
                <div className="text-xl font-bold text-gray-900">
                  Martin Cidlinský
                </div>
                <div className="text-sm font-medium text-green-600 uppercase tracking-wide">
                  Výživový poradce
                </div>
              </div>
            </Link>

            <p className="text-gray-600 leading-relaxed max-w-md">
              Certifikovaný výživový poradce specializující se na 30denní
              programy na míru pro lidi s minimem času. Zhubněte zdravě a
              udržitelně bez drastických diet.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="w-5 h-5 text-green-600" />
                <span>martin@vyzivovaporadna.cz</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="w-5 h-5 text-green-600" />
                <span>+420 777 123 456</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin className="w-5 h-5 text-green-600" />
                <span>Praha, Česká republika</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-gray-900">Navigace</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("o-mne")}
                  className="text-gray-600 hover:text-green-600 transition-colors font-medium"
                >
                  O mně
                </button>
              </li>
              <li>
                <Link
                  href="/bmi"
                  className="text-gray-600 hover:text-green-600 transition-colors font-medium"
                >
                  BMI kalkulačka
                </Link>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("konzultace")}
                  className="text-gray-600 hover:text-green-600 transition-colors font-medium"
                >
                  Konzultace
                </button>
              </li>
              <li>
                <Link
                  href="/rezervace"
                  className="text-gray-600 hover:text-green-600 transition-colors font-medium"
                >
                  Rezervace
                </Link>
              </li>
            </ul>
          </div>

          {/* CTA Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-gray-900">
              Začněte ještě dnes
            </h4>
            <p className="text-gray-600">
              Rezervujte si bezplatnou konzultaci a zjistěte, jak zhubnout 5 kg
              za 30 dní.
            </p>

            <a
              href="/rezervace"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Chci konzultaci zdarma
            </a>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 rounded-lg border border-green-200">
                <span className="text-xs font-bold text-green-700">
                  ✓ Certifikovaný
                </span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 rounded-lg border border-yellow-200">
                <span className="text-xs font-bold text-yellow-700">
                  ⭐ 150+ klientů
                </span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 rounded-lg border border-blue-200">
                <span className="text-xs font-bold text-blue-700">
                  4.9/5 hodnocení
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-sm">
              © 2025 Martin Cidlinský. Všechna práva vyhrazena.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/ochrana-osobnich-udaju"
                className="text-gray-500 hover:text-green-600 transition-colors"
              >
                Ochrana osobních údajů
              </Link>
              <Link
                href="/obchodni-podminky"
                className="text-gray-500 hover:text-green-600 transition-colors"
              >
                Obchodní podmínky
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
