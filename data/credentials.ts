/**
 * "Registered, Certified & Compliant" (home and About pages). Add a credential by adding an
 * entry here and dropping its image into public/images/credentials/. Until an image exists,
 * the tile shows a labelled placeholder slot of the same size, so nothing shifts when it lands.
 *
 * PSEB and HIPAA training certificates supplied 2026-09-26; LCCI membership certificate 2026-09-30. [CLIENT TO CONFIRM] SECP certificate
 * and number, and the third credential (pm/CLIENT_INPUTS_NEEDED.md).
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
  /** Page orientation of the full certificate (lightbox frame). Defaults to portrait. */
  orientation?: "portrait" | "landscape";
  /** Optional PDF of the certificate, under public/. */
  pdf?: string;
  /** Validity period, when the certificate states one. */
  validity?: string;
  /** Last valid day (YYYY-MM-DD). Once it has passed, the tile is no longer shown. */
  validTill?: string;
  /** Label for the placeholder slot while the image is missing. */
  placeholder: string;
  /** Kept in the data but not shown on the site (e.g. waiting for the certificate). */
  hidden?: boolean;
};

const pending = "[CLIENT TO CONFIRM]";

export const credentials: Credential[] = [
  {
    id: "pseb",
    name: "PSEB",
    meaning: "Registered with Pakistan Software Export Board",
    number: "Z-25-8395/23",
    validity: "Valid Feb 2026 – Jan 2027",
    image: "/images/credentials/pseb-certificate-thumb.jpg",
    certificate: "/images/credentials/pseb-certificate.jpg",
    orientation: "landscape",
    pdf: "/images/credentials/pseb-certificate.pdf",
    certificateAlt:
      "Pakistan Software Export Board certificate of registration for GlobalMed Transcriptions (SMC-Pvt.) Limited, registration number Z-25-8395/23, valid February 2026 to January 2027",
    placeholder: "PSEB certificate",
  },
  {
    id: "lcci",
    name: "LCCI",
    meaning: "Member, The Lahore Chamber of Commerce & Industry",
    number: "Membership No. 94721 C",
    issuer: "Issued by The Lahore Chamber of Commerce & Industry",
    validity: "Member since 04/06/2018 · valid until 31 Mar 2027",
    validTill: "2027-03-31",
    image: "/images/credentials/lcci-certificate-thumb.jpg",
    certificate: "/images/credentials/lcci-certificate.jpg",
    orientation: "landscape",
    pdf: "/images/credentials/lcci-certificate.pdf",
    certificateAlt:
      "The Lahore Chamber of Commerce & Industry membership certificate for M/s GlobalMed Transcriptions (SMC-Pvt.) Ltd, membership number 94721 C, member since 04/06/2018, given on 11 April 2026, valid up to 31 March 2027",
    placeholder: "LCCI certificate",
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
    hidden: true, // Hidden until the certificate and number arrive (client, 2026-09-26).
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
    hidden: true, // Hidden until the credential is confirmed (client, 2026-09-26).
  },
  {
    id: "hipaa",
    name: "HIPAA",
    // The certificate supplied is a training-completion certificate (HIPAATraining.us), not a
    // third-party compliance assessment, so the tile says exactly that.
    meaning: "HIPAA Compliance Training Program completed",
    number: "HIPAA-0126590",
    issuer: "Issued by HIPAATraining.us",
    validity: "Valid Sep 2026 – Sep 2027",
    image: "/images/credentials/hipaa-training-certificate-thumb.jpg",
    certificate: "/images/credentials/hipaa-training-certificate.jpg",
    orientation: "landscape",
    pdf: "/images/credentials/hipaa-training-certificate.pdf",
    certificateAlt:
      "HIPAATraining.us certificate of completion of the HIPAA Compliance Training Program for Riaz Naveed, GlobalMed Transcriptions, certificate ID HIPAA-0126590, issued September 11, 2026, expiring September 11, 2027",
    placeholder: "HIPAA certificate",
  },
];

/** Credentials shown on the site: not hidden, and not past their last valid day. */
export function visibleCredentials(today = new Date().toISOString().slice(0, 10)): Credential[] {
  return credentials.filter(
    (credential) => !credential.hidden && !(credential.validTill && credential.validTill < today),
  );
}
