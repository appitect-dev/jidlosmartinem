import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import TabTitleChanger from "@/components/TabTitleChanger";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Zhubněte 5 kg za 30 dní - Martin Cidlinský | Výživový poradce",
  description:
    "Zhubněte 5 kg za 30 dní bez posilovny a počítání kalorií. Rezervujte si konzultaci zdarma s certifikovaným výživovým poradcem Martinem Cidlinským.",
  icons: {
    icon: "/apple-favicon.svg",
    shortcut: "/apple-favicon.svg",
    apple: "/apple-favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "t5x8g8y345");
          `}
        </Script>

        <TabTitleChanger />
        {children}
      </body>
    </html>
  );
}
