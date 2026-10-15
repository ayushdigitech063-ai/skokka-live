// components/AutoSchema.tsx


import Head from "next/head";
import { useRouter } from "next/router";

const SITE = "https://mycityqueen.com";
const LOGO = `${SITE}/images/logo.png`;

type Props = {
  title?: string;
  description?: string;
  items?: { name: string; url: string }[];
  faqs?: { question: string; answer: string }[];
  service?: {
    name: string;
    description: string;
    city: string;
  };
  business?: {
    name: string;
    url: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
};

export default function AutoSchema({
  title,
  description,
  items = [],
  faqs = [],
  service,
  business
}: Props) {
  const router = useRouter();

  const path = router.asPath.split(/[?#]/)[0];
  const url = `${SITE}${path === "/" ? "/" : path.replace(/\/+$/, "")}`;

  const pageTitle = title || "My City Queen";
  const pageDescription = description || "";

  const graph: Record<string, any>[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: pageTitle,
      description: pageDescription,
      isPartOf: { "@id": `${SITE}/#website` },
      breadcrumb: { "@id": `${url}#breadcrumb` }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE}/`
        },
        ...(path !== "/"
          ? [
              {
                "@type": "ListItem",
                position: 2,
                name: pageTitle,
                item: url
              }
            ]
          : [])
      ]
    }
  ];

  if (items.length > 0) {
    graph.push({
      "@type": "ItemList",
      "@id": `${url}#itemlist`,
      name: pageTitle,
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url
      }))
    });
  }

  if (service) {
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: service.name,
      description: service.description,
      url,
      areaServed: {
        "@type": "City",
        name: service.city
      }
    });
  }

  if (business) {
    graph.push({
      "@type": "LocalBusiness",
      "@id": `${url}#localbusiness`,
      name: business.name,
      url: business.url,
      image: LOGO,
      address: {
        "@type": "PostalAddress",
        streetAddress: business.streetAddress,
        addressLocality: business.city,
        addressRegion: business.state,
        postalCode: business.postalCode,
        addressCountry: business.country
      }
    });
  }

  if (faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer
        }
      }))
    });
  }

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph
  }).replace(/</g, "\\u003c");

  return (
    <Head>
      <script
        key={`schema-${path}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
    </Head>
  );
}