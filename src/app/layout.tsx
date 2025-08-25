import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
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
        <TabTitleChanger />
        {children}
      </body>
    </html>
  );
}
