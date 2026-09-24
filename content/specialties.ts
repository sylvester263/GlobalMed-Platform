import { specialtySchema, type Specialty } from "@/lib/content/schema";

// [CLIENT TO CONFIRM] Which specialties GlobalMed serves, and any client results per specialty.
// Codes are real and described in plain language; they are examples, not billing advice.

const raw: Specialty[] = [
  {
    slug: "cardiology",
    name: "Cardiology",
    metaTitle: "Cardiology Billing and Coding Services",
    metaDescription:
      "Cardiology billing and coding: diagnostic testing splits, prior authorizations and modifier 26/TC handled by coders who know cardiology.",
    headline: "Cardiology billing that gets testing, interpretation and prior auth right",
    intro:
      "Cardiology revenue depends on diagnostic testing. Split billing, prior authorizations and frequent payer edits make it one of the easiest specialties to under-collect.",
    challenges: [
      {
        title: "Professional and technical splits",
        body: "Echo, stress and nuclear studies must be billed globally or split with modifiers 26 and TC depending on who owns the equipment.",
      },
      {
        title: "Prior authorization",
        body: "Advanced imaging often needs authorization in advance. A missing number turns into a denial weeks later.",
      },
      {
        title: "Medical necessity",
        body: "Diagnosis codes must support the test under each payer's coverage policy, or the claim is denied.",
      },
    ],
    codes: [
      {
        code: "93000",
        description: "Routine ECG with at least 12 leads, with interpretation and report",
      },
      { code: "93306", description: "Complete transthoracic echocardiogram with Doppler" },
      { code: "78452", description: "Myocardial perfusion imaging (SPECT), multiple studies" },
      {
        code: "Modifier 26 / TC",
        description: "Professional component / technical component of a diagnostic service",
      },
    ],
    howWeHelp: [
      "Check authorization status before imaging is performed",
      "Apply 26/TC correctly for hospital-based and in-office testing",
      "Match diagnoses to each payer's coverage policy before submission",
      "Track underpaid testing claims against your contracted rates",
    ],
    faqs: [
      {
        question: "Do you handle hospital-based cardiologists?",
        answer:
          "Yes. We bill the professional component with modifier 26 for studies read in the hospital and global codes for in-office testing.",
      },
      {
        question: "Can you manage prior authorizations?",
        answer:
          "Yes. We can request and track authorizations for imaging and procedures as part of revenue cycle management. [CLIENT TO CONFIRM]",
      },
    ],
  },
  {
    slug: "orthopedics",
    name: "Orthopedics",
    metaTitle: "Orthopedic Billing and Coding Services",
    metaDescription:
      "Orthopedic billing and coding: global surgical periods, modifiers 25, 57 and 59, laterality and injections coded correctly.",
    headline: "Orthopedic billing that respects global periods and modifiers",
    intro:
      "Surgery, injections, DME and follow-up visits all interact in orthopedics. Global surgical periods and modifiers decide whether each service is paid.",
    challenges: [
      {
        title: "Global surgical periods",
        body: "Visits inside a 10- or 90-day global period are usually bundled; separately billable ones need the right modifier.",
      },
      {
        title: "Modifiers everywhere",
        body: "Modifier 57 for the decision for surgery, 25 for a separate E/M, 59 or XS for distinct procedures, RT/LT for laterality.",
      },
      {
        title: "Injections and supplies",
        body: "Joint injections and the drug supplied are billed separately, with correct units and HCPCS J-codes.",
      },
    ],
    codes: [
      {
        code: "20610",
        description:
          "Arthrocentesis, aspiration or injection of a major joint (such as knee or shoulder), without ultrasound guidance",
      },
      { code: "29881", description: "Knee arthroscopy with meniscectomy (medial or lateral)" },
      {
        code: "Modifier 57",
        description:
          "Decision for surgery made at an E/M visit the day before or day of a major procedure",
      },
      { code: "RT / LT", description: "Right side / left side" },
    ],
    howWeHelp: [
      "Track global periods so post-op visits aren't billed or missed incorrectly",
      "Apply 25, 57, 59/XS and laterality modifiers from the documentation",
      "Bill injection drugs with correct HCPCS codes and units",
      "Appeal bundling denials with operative notes",
    ],
    faqs: [
      {
        question: "Do you code from operative reports?",
        answer:
          "Yes. Our coders read the operative report to capture every billable procedure and apply the correct modifiers.",
      },
      {
        question: "Can you handle DME for our clinic?",
        answer: "We can bill DME supplied in your office. [CLIENT TO CONFIRM scope]",
      },
    ],
  },
  {
    slug: "family-medicine",
    name: "Family medicine",
    metaTitle: "Family Medicine Billing Services",
    metaDescription:
      "Family medicine billing: E/M levels, preventive visits, modifier 25 and G2211 coded correctly for high-volume primary care practices.",
    headline: "Primary care billing built for high volume and small margins",
    intro:
      "Family medicine sees many short visits with many payers. Small, repeated coding mistakes add up quickly across thousands of encounters.",
    challenges: [
      {
        title: "Preventive plus problem visits",
        body: "When a sick concern is addressed at a wellness visit, both can be billed, with modifier 25 on the problem E/M.",
      },
      {
        title: "E/M levels",
        body: "Choosing the level from medical decision making or time, consistently across providers.",
      },
      {
        title: "Payer variety",
        body: "Commercial, Medicare, Medicaid and managed-care plans each have their own rules.",
      },
    ],
    codes: [
      {
        code: "99213 / 99214",
        description: "Established-patient office visits at low and moderate complexity",
      },
      {
        code: "99395 / 99396",
        description: "Preventive visit, established patient, ages 18–39 / 40–64",
      },
      {
        code: "G2211",
        description: "Medicare add-on for the ongoing complexity of longitudinal primary care",
      },
      {
        code: "Modifier 25",
        description: "Significant, separately identifiable E/M on the same day as another service",
      },
    ],
    howWeHelp: [
      "Code E/M levels consistently from documentation",
      "Capture problem visits addressed at preventive appointments",
      "Apply Medicare-specific codes such as G2211 where eligible",
      "Keep eligibility clean across many plans",
    ],
    faqs: [
      {
        question: "Can a preventive and a problem visit be billed the same day?",
        answer:
          "Yes, when the problem needs significant, separately identifiable work. The problem visit is billed with modifier 25, and many patients will owe a copay for it.",
      },
      {
        question: "Do you bill chronic care management?",
        answer:
          "Yes, where your practice runs CCM and the documentation meets the time and consent requirements.",
      },
    ],
  },
  {
    slug: "internal-medicine",
    name: "Internal medicine",
    metaTitle: "Internal Medicine Billing Services",
    metaDescription:
      "Internal medicine billing: chronic care management, annual wellness visits and transitional care captured and coded correctly.",
    headline: "Capture the care-management revenue internal medicine already earns",
    intro:
      "Internists manage complex, chronic patients. Much of that work, from care management to post-discharge follow-up, is billable if it's documented and coded.",
    challenges: [
      {
        title: "Care-management codes",
        body: "Chronic care management and transitional care have time, consent and timing rules that must be met.",
      },
      {
        title: "Annual wellness visits",
        body: "Medicare AWVs are different from preventive physicals and are often billed incorrectly.",
      },
      {
        title: "Complex E/M",
        body: "High-complexity visits need documentation that supports the level billed.",
      },
    ],
    codes: [
      {
        code: "99490",
        description: "Chronic care management, first 20 minutes of clinical staff time in a month",
      },
      {
        code: "G0438 / G0439",
        description: "Medicare annual wellness visit, initial / subsequent",
      },
      {
        code: "99495 / 99496",
        description: "Transitional care management after discharge, moderate / high complexity",
      },
      { code: "99215", description: "Established-patient office visit, high complexity" },
    ],
    howWeHelp: [
      "Track CCM time and consent so monthly claims are supportable",
      "Bill AWVs, not preventive physicals, for Medicare patients",
      "Flag discharges so TCM contact and visit windows are met",
      "Support high-level E/M with documentation feedback",
    ],
    faqs: [
      {
        question: "What's the difference between an AWV and a physical?",
        answer:
          "A Medicare annual wellness visit (G0438/G0439) is a prevention plan without a physical exam requirement. Routine physicals aren't covered by traditional Medicare, so coding the right one matters.",
      },
      {
        question: "Can you help us start billing CCM?",
        answer:
          "Yes. We explain the documentation and consent requirements and bill it once your workflow is in place.",
      },
    ],
  },
  {
    slug: "behavioral-health",
    name: "Behavioral health",
    metaTitle: "Behavioral Health Billing Services",
    metaDescription:
      "Behavioral health billing: psychotherapy time codes, add-on codes, authorizations and payer carve-outs handled for therapists and psychiatrists.",
    headline: "Behavioral health billing that follows the time rules and the carve-outs",
    intro:
      "Therapy and psychiatry claims depend on session time, add-on codes and behavioral-health carve-outs that route claims to a different payer than the medical plan.",
    challenges: [
      {
        title: "Time-based codes",
        body: "Psychotherapy codes are chosen by documented session time, so notes must record it.",
      },
      {
        title: "Add-on codes",
        body: "Psychotherapy with an E/M visit uses add-on codes that are easy to miss or misuse.",
      },
      {
        title: "Authorizations and carve-outs",
        body: "Many plans route mental-health claims to a separate administrator with its own authorization rules.",
      },
    ],
    codes: [
      { code: "90791", description: "Psychiatric diagnostic evaluation" },
      {
        code: "90834 / 90837",
        description: "Psychotherapy, 45 minutes / 60 minutes with the patient",
      },
      { code: "90833", description: "Psychotherapy add-on, 30 minutes, with an E/M service" },
      { code: "99214 + 90833", description: "Psychiatrist medication visit with psychotherapy" },
    ],
    howWeHelp: [
      "Match psychotherapy codes to documented session time",
      "Capture add-on psychotherapy with psychiatric E/M visits",
      "Track authorizations and session limits per payer",
      "Send claims to the right behavioral-health administrator",
    ],
    faqs: [
      {
        question: "Do you bill for solo therapists?",
        answer:
          "Yes. We work with solo clinicians and group practices, including telehealth sessions.",
      },
      {
        question: "Can you bill telehealth sessions?",
        answer:
          "Yes, with the correct place of service and modifiers for each payer's telehealth policy.",
      },
    ],
  },
  {
    slug: "urgent-care",
    name: "Urgent care",
    metaTitle: "Urgent Care Billing and Coding",
    metaDescription:
      "Urgent care billing: fast turnaround on high visit volumes, E/M plus procedures, after-hours codes and payer-specific urgent care rules.",
    headline: "Urgent care billing that keeps up with the waiting room",
    intro:
      "Urgent care centers see high, unpredictable volume with procedures, labs and imaging on the same visit. Speed and consistency decide cash flow.",
    challenges: [
      {
        title: "Volume",
        body: "Hundreds of visits a day need coding and submission within a day or two.",
      },
      {
        title: "Visit plus procedures",
        body: "Laceration repairs, X-rays and point-of-care tests are billed alongside the E/M, sometimes with modifier 25.",
      },
      {
        title: "Payer-specific rules",
        body: "Some payers pay a global urgent-care rate with HCPCS codes instead of line items.",
      },
    ],
    codes: [
      {
        code: "99203 / 99213",
        description: "New / established patient office visit, low complexity",
      },
      {
        code: "S9083",
        description: "Global fee for an urgent care visit (used by some commercial payers)",
      },
      { code: "12001", description: "Simple repair of superficial wound, 2.5 cm or less" },
      { code: "Place of service 20", description: "Urgent care facility" },
    ],
    howWeHelp: [
      "Code and submit within 24–48 hours of the visit",
      "Apply each payer's urgent-care billing method",
      "Capture procedures, labs and imaging with the visit",
      "Report volume, payer mix and collections per site",
    ],
    faqs: [
      {
        question: "Can you handle multiple locations?",
        answer: "Yes. We report collections and denials per site so you can compare locations.",
      },
      {
        question: "Do you bill occupational medicine visits?",
        answer: "Yes, including employer-paid services. [CLIENT TO CONFIRM scope]",
      },
    ],
  },
];

export const specialties: Specialty[] = raw.map((s) => specialtySchema.parse(s));
