/**
 * "Registered, Certified & Compliant" (home and About pages). Add a credential by adding an
 * entry here and dropping its image into public/images/credentials/. Until an image exists,
 * the tile shows a labelled placeholder slot of the same size, so nothing shifts when it lands.
 *
 * [CLIENT TO CONFIRM] Certificate images, registration numbers, the third credential and the
 * HIPAA assessing body (pm/CLIENT_INPUTS_NEEDED.md).
 */
export type Credential = {
  id: string;
  /** Short mark shown on the tile, e.g. "PSEB". */
  name: string;
  /** What the credential means, in one line. */
  meaning: string;
  /** Registration or certificate number. */
  number: string;
  /** Issuing or assessing body, when it isn't obvious from the name. */
  issuer?: string;
  /** Logo or thumbnail for the tile, under public/. */
  image: string;
  /** Full certificate for the lightbox, under public/. */
  certificate: string;
  /** Alt text for the full certificate image. */
  certificateAlt: string;
  /** Label for the placeholder slot while the image is missing. */
  placeholder: string;
};

const pending = "[CLIENT TO CONFIRM]";

export const credentials: Credential[] = [
  {
    id: "pseb",
    name: "PSEB",
    meaning: "Registered with Pakistan Software Export Board",
    number: pending,
    image: "/images/credentials/pseb-logo.png",
    certificate: "/images/credentials/pseb-certificate.jpg",
    certificateAlt:
      "GlobalMed Transcriptions Pvt. Ltd. registration certificate from the Pakistan Software Export Board",
    placeholder: "PSEB certificate",
  },
  {
    id: "secp",
    name: "SECP",
    meaning: "Registered with the Securities and Exchange Commission of Pakistan",
    number: pending,
    image: "/images/credentials/secp-logo.png",
    certificate: "/images/credentials/secp-certificate.jpg",
    certificateAlt:
      "GlobalMed Transcriptions Pvt. Ltd. certificate of incorporation from the Securities and Exchange Commission of Pakistan",
    placeholder: "SECP certificate",
  },
  {
    id: "third-credential",
    name: "[THIRD CREDENTIAL — name to be confirmed]",
    meaning: pending,
    number: pending,
    image: "/images/credentials/credential-3-logo.png",
    certificate: "/images/credentials/credential-3-certificate.jpg",
    certificateAlt: "GlobalMed Transcriptions certificate (credential to be confirmed)",
    placeholder: "Third credential certificate",
  },
  {
    id: "hipaa",
    name: "HIPAA",
    meaning: "HIPAA Compliant",
    number: pending,
    issuer: `Assessed by ${pending}`,
    image: "/images/credentials/hipaa-logo.png",
    certificate: "/images/credentials/hipaa-certificate.jpg",
    certificateAlt: "GlobalMed Transcriptions HIPAA compliance certificate",
    placeholder: "HIPAA certificate",
  },
];
