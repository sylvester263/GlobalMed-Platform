import { absoluteUrl } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

type JsonLdObject = Record<string, unknown>;

/** Renders schema.org JSON-LD. `<` is escaped so content can never close the script tag. */
export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const orgId = `${site.url}#organization`;

export function organizationJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": orgId,
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    email: site.contact.email,
    telephone: site.contact.phoneUs,
    description: site.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.contact.address.city,
      addressRegion: site.contact.address.region,
      addressCountry: site.contact.address.country,
    },
    areaServed: ["US", "PK"],
    department: {
      "@type": "EducationalOrganization",
      name: site.schoolName,
      url: absoluteUrl("/school"),
    },
  };
}

/** The school as an EducationalOrganization, with its CPC® and CPB® training (home page). */
export function educationalOrganizationJsonLd(input: {
  description: string;
  courses: { name: string; description: string; path: string }[];
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${site.url}#school`,
    name: site.schoolName,
    url: absoluteUrl("/"),
    description: input.description,
    parentOrganization: { "@id": orgId },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.contact.address.city,
      addressRegion: site.contact.address.region,
      addressCountry: site.contact.address.country,
    },
    hasOfferingCatalog: {
      "@type": "OfferCatalog",
      name: "CPC® and CPB® certification training",
      itemListElement: input.courses.map((course) => ({
        "@type": "Course",
        name: course.name,
        description: course.description,
        url: absoluteUrl(course.path),
        provider: { "@id": `${site.url}#school` },
      })),
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: { "@id": orgId },
    areaServed: { "@type": "Country", name: "United States" },
  };
}

export function courseJsonLd(input: {
  name: string;
  description: string;
  path: string;
  priceUsd: number;
  hours: number;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: { "@type": "EducationalOrganization", name: site.schoolName, sameAs: site.url },
    offers: {
      "@type": "Offer",
      category: "Paid",
      price: input.priceUsd,
      priceCurrency: "USD",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `PT${input.hours}H`,
    },
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  author: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    datePublished: input.publishedAt,
    author: { "@type": "Organization", name: input.author },
    publisher: { "@id": orgId },
  };
}
