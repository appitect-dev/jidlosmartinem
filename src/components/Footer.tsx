"use client";

import Link from "next/link";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link
              href="/"
              className="text-2xl font-light tracking-tight text-black mb-4 block"
            >
              Martin Cidlinský
            </Link>
            <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
              Certifikovaný nutriční poradce specializující se na
              personalizovanou výživu a dlouhodobě udržitelné změny životního
              stylu.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-gray-900 mb-6">Navigace</h4>
            <ul className="space-y-4 text-gray-600">
              <li>
                <button
                  onClick={() => scrollToSection("sluzby")}
                  className="hover:text-black transition-colors"
                >
                  Služby
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("o-mne")}
                  className="hover:text-black transition-colors"
                >
                  O mně
                </button>
              </li>
              <li>
                <Link
                  href="/bmi"
                  className="hover:text-black transition-colors"
                >
                  BMI kalkulačka
                </Link>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("kontakt")}
                  className="hover:text-black transition-colors"
                >
                  Kontakt
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium text-gray-900 mb-6">Kontakt</h4>
            <ul className="space-y-4 text-gray-600">
              <li>
                <a
                  href="tel:+420777123456"
                  className="hover:text-black transition-colors"
                >
                  +420 777 123 456
                </a>
              </li>
              <li>
                <a
                  href="mailto:martin@jidlosmartinem.cz"
                  className="hover:text-black transition-colors"
                >
                  martin@jidlosmartinem.cz
                </a>
              </li>
              <li>Praha, Česká republika</li>
              <li>Online konzultace</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 mt-16 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2024 Martin Cidlinský - Nutriční poradce. Všechna práva
            vyhrazena.
          </p>
        </div>
      </div>
    </footer>
  );
}
