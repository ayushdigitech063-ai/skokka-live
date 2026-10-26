import type { Metadata } from "next";
import "./globals.css";
import { buildHomeSEO } from "@/lib/seo/seoEngine";
import AgeVerificationModal from "@/components/AgeVerificationModal";

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
      className="h-full antialiased font-sans"
    >
      <head>
        <meta name="google-site-verification" content="C1tlMxhr7B8UdzzG26U-93WRsoUdNRbmJNqKWryRe7s" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Sora:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <AgeVerificationModal />
        {children}
      </body>
    </html>
  );
}
