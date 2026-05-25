import { Metadata } from "next";
import { type Locale } from "@/i18n/config";

const BASE_URL = "https://fsb-fire-protection.com";

interface PageMetadata {
  title: string;
  description: string;
  path?: string;
  image?: string;
  locale?: Locale;
}

export function generatePageMetadata({
  title,
  description,
  path = "",
  image = "/images/og-image.jpg",
  locale = "en",
}: PageMetadata): Metadata {
  const url = `${BASE_URL}/${locale}${path}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: locale === "de" ? "FSB Brandschutz" : "FSB Fire Protection",
      images: [
        {
          url: `${BASE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === "de" ? "de_DE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}${image}`],
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}/en${path}`,
        de: `${BASE_URL}/de${path}`,
      },
    },
  };
}

// JSON-LD Structured Data helpers
export function generateLocalBusinessSchema(locale: Locale = "en") {
  const isGerman = locale === "de";

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: isGerman ? "FSB Brandschutz" : "FSB Fire Protection",
    description: isGerman
      ? "Ueber 30 Jahre Erfahrung in Brandschutzplanung, -ausfuehrung und -ueberwachung."
      : "Over 30 years of experience in fire protection design, execution, and supervision.",
    url: `${BASE_URL}/${locale}`,
    telephone: "+385 1 4878 515",
    email: "info@fsb-fire-protection.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ivana Lucica 5",
      addressLocality: "Zagreb",
      postalCode: "10000",
      addressCountry: "HR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 45.8018,
      longitude: 15.9710,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "16:00",
      },
    ],
    priceRange: "$$",
    image: `${BASE_URL}/images/og-image.jpg`,
    sameAs: [],
  };
}

export function generateProductSchema(
  product: {
    title: string;
    description: string;
    image: string;
    manufacturer: string;
    slug: string;
    category: string;
  },
  locale: Locale = "en"
) {
  const isGerman = locale === "de";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: `${BASE_URL}${product.image}`,
    brand: {
      "@type": "Brand",
      name: product.manufacturer,
    },
    manufacturer: {
      "@type": "Organization",
      name: product.manufacturer,
    },
    url: `${BASE_URL}/${locale}/products/${product.category}/${product.slug}`,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "EUR",
      seller: {
        "@type": "Organization",
        name: isGerman ? "FSB Brandschutz" : "FSB Fire Protection",
      },
    },
  };
}

export function generateServiceSchema(
  service: {
    title: string;
    description: string;
    slug: string;
  },
  locale: Locale = "en"
) {
  const isGerman = locale === "de";

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: `${BASE_URL}/${locale}/services/${service.slug}`,
    provider: {
      "@type": "LocalBusiness",
      name: isGerman ? "FSB Brandschutz" : "FSB Fire Protection",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Ivana Lucica 5",
        addressLocality: "Zagreb",
        postalCode: "10000",
        addressCountry: "HR",
      },
    },
    areaServed: {
      "@type": "Country",
      name: isGerman ? "Kroatien" : "Croatia",
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}
