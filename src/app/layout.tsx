import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { buildHomeSEO } from "@/lib/seo/seoEngine";
import AgeVerificationModal from "@/components/AgeVerificationModal";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = buildHomeSEO();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://mycityqueen.com/#website",
      "url": "https://mycityqueen.com/",
      "name": "MyCityQueen",
      "alternateName": ["MyCityQueen India", "MyCityQueen Classifieds"],
      "publisher": {
        "@id": "https://mycityqueen.com/#organization"
      },
      "inLanguage": "en-US"
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://mycityqueen.com/#organization",
      "name": "MyCityQueen",
      "legalName": "MyCityQueen Media Network",
      "url": "https://mycityqueen.com/",
      "logo": "https://mycityqueen.com/icon.png"
    }
  ];

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${plusJakartaSans.className} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className={`${plusJakartaSans.className} min-h-full flex flex-col font-sans`}>
        <AgeVerificationModal />
        {children}
      </body>
    </html>
  );
}
