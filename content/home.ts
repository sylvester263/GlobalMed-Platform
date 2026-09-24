// [CLIENT TO CONFIRM] Home page copy and the claim-journey figures (illustrative until confirmed).

export const hero = {
  eyebrow: "Medical billing · coding · transcription · education",
  headline: "Clean claims for your practice. Career-ready skills for your future.",
  intro:
    "GlobalMed runs billing, coding and documentation for US practices, and trains the next generation of billers and coders at the GlobalMed School of Billing and Coding.",
};

/** MG-3: the stages of a claim, drawn along the claim line (docs/15 §3). */
export const claimJourney = [
  {
    stage: "Patient visit",
    caption:
      "Your team sees the patient. Encounter details reach us through your existing secure system.",
    stat: "Eligibility checked before the visit",
  },
  {
    stage: "Coding",
    caption: "Certified coders assign ICD-10-CM, CPT and HCPCS codes from the documentation.",
    stat: "95%+ coding accuracy target",
  },
  {
    stage: "Claim submitted",
    caption:
      "Claims go out within 24–48 hours, and clearinghouse rejections are fixed the same day.",
    stat: "24–48h submission",
  },
  {
    stage: "Scrubbed",
    caption: "Every claim is checked against payer rules before and after submission.",
    stat: "98% clean-claim target",
  },
  {
    stage: "Paid",
    caption: "Payments are posted, denials worked, and you see it all in one monthly report.",
    stat: "Monthly results review",
  },
];

/** [CLIENT TO CONFIRM] Consent-approved testimonials. The section stays hidden while empty. */
export const testimonials: {
  quote: string;
  name: string;
  role: string;
  audience: "practice" | "student";
}[] = [];
