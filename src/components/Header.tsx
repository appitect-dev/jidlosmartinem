"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, Award, Star } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and credentials */}
          <div className="flex items-center space-x-4">
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

            {/* Trust indicators */}
            <div className="hidden lg:flex items-center space-x-4 ml-6">
              <div className="flex items-center space-x-1 px-3 py-1 bg-green-50 rounded-full">
                <Award className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Certifikovaný
                </span>
              </div>
              <div className="flex items-center space-x-1 px-3 py-1 bg-yellow-50 rounded-full">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-700">
                  4.9/5
                </span>
              </div>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("sluzby")}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Služby
            </button>
            <button
              onClick={() => scrollToSection("o-mne")}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              O mně
            </button>
            <Link
              href="/bmi"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              BMI test
            </Link>
            <button
              onClick={() => scrollToSection("kontakt")}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Kontakt
            </button>

            {/* CTA phone button */}
            <a
              href="tel:+420777123456"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              <Phone className="h-4 w-4 mr-2" />
              777 123 456
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-green-600 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
            <div className="space-y-4">
              {/* Trust indicators mobile */}
              <div className="flex items-center justify-center space-x-4 pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-1 px-3 py-1 bg-green-50 rounded-full">
                  <Award className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Certifikovaný
                  </span>
                </div>
                <div className="flex items-center space-x-1 px-3 py-1 bg-yellow-50 rounded-full">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-700">
                    4.9/5 hodnocení
                  </span>
                </div>
              </div>

              <button
                onClick={() => scrollToSection("sluzby")}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-colors"
              >
                Služby
              </button>
              <button
                onClick={() => scrollToSection("o-mne")}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-colors"
              >
                O mně
              </button>
              <Link
                href="/bmi"
                className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                BMI kalkulačka
              </Link>
              <button
                onClick={() => scrollToSection("kontakt")}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-colors"
              >
                Kontakt
              </button>

              {/* Mobile CTA */}
              <div className="px-4 pt-4">
                <a
                  href="tel:+420777123456"
                  className="flex items-center justify-center w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Zavolat: +420 777 123 456
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
