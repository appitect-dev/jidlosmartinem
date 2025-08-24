"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <Image
                src="/favicon.svg"
                alt="Martin Cidlinský Logo"
                width={32}
                height={32}
                className="w-8 h-8 transition-transform group-hover:scale-110 duration-300"
              />
              <div className="absolute -inset-2 bg-green-100 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <div className="group-hover:translate-x-1 transition-transform duration-300">
              <div className="text-xl font-black text-gray-900 tracking-tight">Martin Cidlinský</div>
              <div className="text-sm font-semibold text-green-600 uppercase tracking-wide">Výživový poradce</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => scrollToSection("o-mne")}
              className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition-all duration-200 rounded-lg relative group"
            >
              O mně
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-600 group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-300"></span>
            </button>
            <Link
              href="/bmi"
              className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition-all duration-200 rounded-lg relative group"
            >
              BMI test
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-600 group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-300"></span>
            </Link>
            <button
              onClick={() => scrollToSection("konzultace")}
              className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition-all duration-200 rounded-lg relative group"
            >
              Konzultace
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-600 group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-300"></span>
            </button>

            {/* Enhanced CTA Button */}
            <div className="ml-6">
              <a
                href="/rezervace"
                className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
              >
                Chci rezervaci zdarma
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-3 text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors rounded-xl"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 border-t border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="space-y-2">
              <button
                onClick={() => scrollToSection("o-mne")}
                className="block w-full text-left py-3 px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition-all duration-200 rounded-lg"
              >
                O mně
              </button>
              <Link
                href="/bmi"
                className="block py-3 px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition-all duration-200 rounded-lg"
              >
                BMI test
              </Link>
              <button
                onClick={() => scrollToSection("konzultace")}
                className="block w-full text-left py-3 px-4 text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition-all duration-200 rounded-lg"
              >
                Konzultace
              </button>

              {/* Mobile CTA */}
              <div className="pt-4 mt-4 border-t border-gray-100">
                <a
                  href="/rezervace"
                  className="flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg group"
                >
                  Chci rezervaci zdarma
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
