import { features } from "@/config/features";
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

function postalAddressJsonLd(): JsonLdObject {
  const { address } = site.contact;
  return {
    "@type": "PostalAddress",
    streetAddress: address.street,
    postOfficeBoxNumber: address.poBox,
    addressLocality: address.city,
    addressRegion: address.region,
    postalCode: address.postalCode,
    addressCountry: address.country,
  };
}

/** Organization + LocalBusiness: same NAP as the footer and contact page (lib/site.ts). */
export function organizationJsonLd(): JsonLdObject {
  const { contact } = site;
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "@id": orgId,
    name: site.name,
    legalName: "GlobalMed Transcriptions Pvt. Ltd.",
    alternateName: site.shortName,
    url: site.url,
    logo: absoluteUrl("/images/brand/globalmed-logo-stacked-on-white.png"),
    image: absoluteUrl("/images/brand/globalmed-logo-horizontal.png"),
    email: contact.email,
    telephone: contact.phone,
    foundingDate: "2007",
    founder: { "@type": "Person", name: "Riaz Naveed" },
    description: site.description,
    address: postalAddressJsonLd(),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: contact.phone,
        email: contact.email,
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          opens: "00:00",
          closes: "23:59",
        },
      },
      {
        "@type": "ContactPoint",
        contactType: "WhatsApp",
        telephone: contact.whatsappDisplay,
        url: `https://wa.me/${contact.whatsappNumber.replace(/\D/g, "")}`,
      },
    ],
    areaServed: ["US", "CA", "GB", "AU", "SA", "PK"],
    sameAs: site.social.filter((s) => s.href).map((s) => s.href),
    // Hidden at client request — GlobalMed education plans are future scope.
    ...(features.educationSchema
      ? {
          department: {
            "@type": "EducationalOrganization",
            name: site.schoolName,
            url: absoluteUrl("/education"),
          },
        }
      : {}),
  };
}

/**
 * The school as an EducationalOrganization, with its CPC® and CPB® training. Not rendered
 * while `features.educationSchema` is off: GlobalMed doesn't teach (client, 2026-09-26).
 */
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
    address: postalAddressJsonLd(),
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

/**
 * An AAPC course offered through GlobalMed (client, 2026-09-26): AAPC is the provider (it
 * teaches and certifies); GlobalMed is the seller that registers students in Pakistan.
 */
export function aapcCourseJsonLd(input: {
  name: string;
  description: string;
  path: string;
  priceUsd: number;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: { "@type": "Organization", name: "AAPC", sameAs: "https://www.aapc.com" },
    offers: {
      "@type": "Offer",
      category: "Paid",
      price: input.priceUsd,
      priceCurrency: "USD",
      url: absoluteUrl(input.path),
      seller: { "@id": orgId },
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      instructor: { "@type": "Organization", name: "AAPC" },
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
