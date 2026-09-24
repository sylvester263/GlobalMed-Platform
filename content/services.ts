import { serviceSchema, type Service } from "@/lib/content/schema";

// [CLIENT TO CONFIRM] All service copy, result figures (illustrative until confirmed) and
// the specialties each service lists. See pm/CLIENT_INPUTS_NEEDED.md.

const raw: Service[] = [
  {
    slug: "medical-billing",
    name: "Medical billing",
    metaTitle: "Medical Billing Services for US Practices",
    metaDescription:
      "Outsourced medical billing for US practices: charge entry, clean claim submission, payment posting and AR follow-up, with a monthly report you can read.",
    eyebrow: "Medical billing services",
    headline: "Get paid for every visit, without chasing claims yourself",
    intro:
      "GlobalMed takes over charge entry, claim submission, payment posting and follow-up, so your team can focus on patients while revenue arrives on time.",
    summary: "Charge entry, clean claims, payment posting and AR follow-up.",
    problems: [
      "Claims sit unworked because your front desk is also answering phones.",
      "Denials pile up and nobody has time to appeal them before the filing limit.",
      "You can't tell how much money is still owed to the practice, or by whom.",
    ],
    included: [
      {
        title: "Charge entry and claim scrubbing",
        body: "Every encounter is entered and checked against payer rules before it goes out, so fewer claims come back.",
      },
      {
        title: "Electronic submission",
        body: "Claims go out within 24–48 hours of receiving encounter details, with clearinghouse rejections fixed the same day.",
      },
      {
        title: "Payment posting",
        body: "ERAs and paper EOBs are posted line by line, so underpayments and patient balances are visible immediately.",
      },
      {
        title: "AR follow-up",
        body: "Unpaid claims are worked by age and value. Payers are called, not just re-billed.",
      },
      {
        title: "Denial management",
        body: "Denials are corrected and appealed, and the root cause is fed back so it stops recurring.",
      },
      {
        title: "Monthly reporting",
        body: "Collections, denial rate, days in AR and the top issues in one plain report, with a call to walk through it.",
      },
    ],
    process: [
      {
        title: "Free billing audit",
        body: "We review a sample of recent claims, denials and AR and show you where revenue is leaking.",
      },
      {
        title: "Onboarding",
        body: "We get secure access to your practice management system, load payer rules and agree turnaround times.",
      },
      {
        title: "Daily billing",
        body: "Charges, submissions, posting and follow-up run every business day, with a named account manager.",
      },
      {
        title: "Monthly review",
        body: "We report results against the baseline from your audit and agree next month's priorities.",
      },
    ],
    results: [
      { value: 98, suffix: "%", decimals: 0, label: "Clean-claim rate target" },
      { value: 30, suffix: " days", decimals: 0, label: "Target days in AR" },
      { value: 24, suffix: "–48h", decimals: 0, label: "Claim submission turnaround" },
    ],
    specialties: [
      "family-medicine",
      "internal-medicine",
      "cardiology",
      "orthopedics",
      "behavioral-health",
      "urgent-care",
    ],
    compliance:
      "Patient information is handled only inside your systems and GlobalMed's HIPAA-compliant environment, under a Business Associate Agreement. This website never collects patient data.",
    faqs: [
      {
        question: "How much do your billing services cost?",
        answer:
          "Most practices pay a percentage of collections, so our fee rises only when your revenue does. We quote after the free audit, once we understand your claim volume and payer mix. [CLIENT TO CONFIRM pricing model]",
      },
      {
        question: "Do we have to change our practice management system?",
        answer:
          "No. We work inside the system you already use and get secure access during onboarding. Your data stays in your system.",
      },
      {
        question: "Will we sign a Business Associate Agreement?",
        answer:
          "Yes. We sign a BAA before we access any patient information, as HIPAA requires for billing partners.",
      },
    ],
  },
  {
    slug: "medical-coding",
    name: "Medical coding",
    metaTitle: "Outsourced Medical Coding Services",
    metaDescription:
      "Certified coders assign ICD-10-CM, CPT and HCPCS codes to your encounters, checked against payer rules before claims go out.",
    eyebrow: "Medical coding services",
    headline: "Accurate codes the first time, so claims aren't denied for avoidable errors",
    intro:
      "Our certified coders review documentation and assign ICD-10-CM, CPT and HCPCS codes and modifiers that match what was done and what the payer will accept.",
    summary: "ICD-10-CM, CPT and HCPCS coding by certified coders.",
    problems: [
      "Undercoding leaves money on the table; overcoding invites audits.",
      "Modifier mistakes like 25 and 59 cause denials that take weeks to fix.",
      "Your coder is out and encounters stack up for days.",
    ],
    included: [
      {
        title: "Professional fee coding",
        body: "E/M levels, procedures and diagnoses coded from the provider's documentation.",
      },
      {
        title: "Modifier review",
        body: "Modifiers such as 25, 59, XS and laterality checked against the documentation and payer policy.",
      },
      {
        title: "Documentation feedback",
        body: "When notes don't support a code, we tell the provider specifically what's missing.",
      },
      {
        title: "Coding audits",
        body: "Periodic reviews of a sample of your encounters, with an accuracy score and trends.",
      },
    ],
    process: [
      {
        title: "Documentation access",
        body: "We receive encounters through your EHR or practice management system; nothing passes through this website.",
      },
      {
        title: "Coding",
        body: "Certified coders code each encounter within the agreed turnaround.",
      },
      {
        title: "Quality check",
        body: "A second coder reviews a sample every week to keep accuracy high.",
      },
      {
        title: "Feedback loop",
        body: "Recurring documentation gaps go back to your providers in a short monthly summary.",
      },
    ],
    results: [
      { value: 95, suffix: "%+", decimals: 0, label: "Coding accuracy target" },
      { value: 24, suffix: "h", decimals: 0, label: "Typical turnaround" },
      { value: 100, suffix: "%", decimals: 0, label: "Encounters coded by certified coders" },
    ],
    specialties: [
      "cardiology",
      "orthopedics",
      "family-medicine",
      "internal-medicine",
      "urgent-care",
    ],
    compliance:
      "Coding follows the ICD-10-CM Official Guidelines, AMA CPT rules and CMS National Correct Coding Initiative edits. Patient information stays in HIPAA-compliant systems under a BAA.",
    faqs: [
      {
        question: "Are your coders certified?",
        answer:
          "Yes. Our coders hold industry certifications such as CPC or CCS and complete continuing education every year. [CLIENT TO CONFIRM credentials]",
      },
      {
        question: "Can you code for a single specialty only?",
        answer:
          "Yes. Many clients start with one specialty or one provider and expand once they see the results.",
      },
      {
        question: "What happens when documentation doesn't support a code?",
        answer:
          "We code only what the note supports and send the provider a short query explaining what would be needed for a different code.",
      },
    ],
    motion: "code-chips",
  },
  {
    slug: "medical-transcription",
    name: "Medical transcription",
    metaTitle: "Medical Transcription Services",
    metaDescription:
      "Accurate medical transcription with fast turnaround, delivered through your existing secure system. Specialty-trained transcriptionists and QA review.",
    eyebrow: "Medical transcription",
    headline: "Accurate notes back fast, so providers can close charts the same day",
    intro:
      "Specialty-trained transcriptionists turn dictation into clean, formatted notes, reviewed for accuracy and delivered straight into your EHR workflow.",
    summary: "Accurate, fast-turnaround notes from dictation.",
    problems: [
      "Providers spend evenings finishing charts.",
      "Delayed notes delay billing, because claims wait for documentation.",
      "Speech recognition drafts still need someone to fix errors.",
    ],
    included: [
      {
        title: "Dictation transcription",
        body: "Clinic notes, H&Ps, consults, operative reports and discharge summaries in your templates.",
      },
      {
        title: "Speech-recognition editing",
        body: "We edit and correct drafts from your dictation software rather than typing from scratch.",
      },
      {
        title: "Quality assurance",
        body: "A second reviewer checks notes for accuracy, drug names and measurements.",
      },
      {
        title: "Secure delivery",
        body: "Notes return through your EHR or secure system; nothing is exchanged through this website.",
      },
    ],
    process: [
      {
        title: "Set-up",
        body: "We agree templates, turnaround and delivery method with your practice.",
      },
      {
        title: "Dictate",
        body: "Providers dictate as usual through your existing app or phone line.",
      },
      {
        title: "Transcribe and review",
        body: "A transcriptionist drafts the note and QA reviews it.",
      },
      {
        title: "Deliver",
        body: "Finished notes arrive in your system, ready for the provider's signature.",
      },
    ],
    results: [
      { value: 99, suffix: "%", decimals: 0, label: "Accuracy target" },
      { value: 24, suffix: "h", decimals: 0, label: "Standard turnaround" },
      { value: 4, suffix: "h", decimals: 0, label: "STAT turnaround available" },
    ],
    specialties: ["family-medicine", "internal-medicine", "cardiology", "orthopedics"],
    compliance:
      "Dictation and notes contain patient information, so they move only through HIPAA-compliant systems covered by a BAA — never through this website or its forms.",
    faqs: [
      {
        question: "What turnaround can you offer?",
        answer:
          "Standard turnaround is 24 hours and STAT notes are available within 4 hours. [CLIENT TO CONFIRM turnaround times]",
      },
      {
        question: "Do you work with our dictation app?",
        answer:
          "Usually, yes. We work with most dictation apps and EHR integrations. We confirm the exact workflow during set-up.",
      },
      {
        question: "How is accuracy measured?",
        answer:
          "QA reviewers score a sample of notes each week against the audio. Errors are tracked by type and shared in the monthly report.",
      },
    ],
    motion: "waveform",
  },
  {
    slug: "ai-clinical-documentation",
    name: "AI clinical documentation",
    metaTitle: "AI Clinical Documentation, Human-Reviewed",
    metaDescription:
      "AI drafts structured clinical notes from the visit and trained specialists review them, so providers spend less time charting.",
    eyebrow: "AI-powered clinical documentation",
    headline: "Less time charting, without trusting AI blindly",
    intro:
      "AI turns the visit conversation into a structured draft note. A trained documentation specialist reviews and corrects it before it reaches the provider for sign-off.",
    summary: "AI-drafted notes, reviewed by trained specialists.",
    problems: [
      "Providers spend hours a day on documentation after clinic.",
      "Pure AI notes can contain errors nobody has time to catch.",
      "Scribes are hard to hire and retain.",
    ],
    included: [
      {
        title: "Ambient drafting",
        body: "The visit is captured through your approved tool and AI produces a structured draft in your note format.",
      },
      {
        title: "Specialist review",
        body: "A trained documentation specialist checks the draft against the recording and fixes errors and omissions.",
      },
      {
        title: "Coding-ready notes",
        body: "Notes are structured so coders can find what they need, which supports accurate billing.",
      },
      {
        title: "Provider sign-off",
        body: "Nothing is final until the provider reviews and signs the note.",
      },
    ],
    process: [
      {
        title: "Pilot",
        body: "We start with one or two providers and agree note templates and review rules.",
      },
      {
        title: "Capture",
        body: "Visits are captured through the tool your compliance team approves.",
      },
      {
        title: "Draft and review",
        body: "AI drafts; a specialist reviews within the agreed turnaround.",
      },
      {
        title: "Sign and scale",
        body: "Providers sign, we measure time saved, then roll out further.",
      },
    ],
    results: [
      {
        value: 2,
        suffix: "h",
        decimals: 0,
        label: "Charting time saved per provider per day (target)",
      },
      { value: 100, suffix: "%", decimals: 0, label: "Notes reviewed by a person" },
      { value: 1, suffix: " day", decimals: 0, label: "Pilot set-up" },
    ],
    specialties: ["family-medicine", "internal-medicine", "behavioral-health", "urgent-care"],
    compliance:
      "Recordings and notes are patient information and are processed only in HIPAA-compliant environments with signed BAAs, including any AI vendor. This website's chatbot never receives patient data.",
    faqs: [
      {
        question: "Which AI system do you use?",
        answer:
          "We use enterprise AI tools covered by a Business Associate Agreement and approved by your compliance team. We don't use consumer AI apps for patient data. [CLIENT TO CONFIRM vendor]",
      },
      {
        question: "Does a person really review every note?",
        answer:
          "Yes. Every AI draft is reviewed by a trained documentation specialist before the provider sees it, and the provider signs the final note.",
      },
      {
        question: "Can we try it before committing?",
        answer:
          "Yes. Most practices start with a pilot for one or two providers so they can measure time saved.",
      },
    ],
    motion: "waveform",
  },
  {
    slug: "revenue-cycle-management",
    name: "Revenue cycle management",
    metaTitle: "Revenue Cycle Management Services",
    metaDescription:
      "End-to-end revenue cycle management for US practices: eligibility, coding, billing, denials and AR, run by one accountable team.",
    eyebrow: "Revenue cycle management",
    headline: "One team accountable for every step between the visit and the payment",
    intro:
      "From eligibility checks before the visit to the last dollar collected, GlobalMed runs the whole revenue cycle and reports on it every month.",
    summary: "The whole revenue cycle, one accountable team.",
    problems: [
      "Billing, coding and follow-up are split across people who don't talk to each other.",
      "Nobody owns the numbers, so problems surface only when cash drops.",
      "Eligibility issues turn into denials weeks later.",
    ],
    included: [
      {
        title: "Eligibility and benefits",
        body: "Coverage checked before the visit, so patients know what they owe and claims aren't denied for eligibility.",
      },
      {
        title: "Coding and charge capture",
        body: "Every billable service coded accurately and captured.",
      },
      { title: "Claims and payments", body: "Submission, posting and underpayment tracking." },
      { title: "Denials and AR", body: "Appeals, payer follow-up and root-cause fixes." },
      {
        title: "Patient statements",
        body: "Clear statements and a friendly phone line for billing questions. [CLIENT TO CONFIRM]",
      },
      {
        title: "Reporting",
        body: "Collections, denial rate, days in AR and net collection rate every month.",
      },
    ],
    process: [
      {
        title: "Audit and baseline",
        body: "Our free audit sets the baseline we will be measured against.",
      },
      {
        title: "Transition",
        body: "We take over step by step, so nothing falls through the gap between teams.",
      },
      { title: "Run", body: "Daily work across the cycle with a named account manager." },
      { title: "Improve", body: "Monthly reviews target the biggest remaining leaks." },
    ],
    results: [
      { value: 96, suffix: "%+", decimals: 0, label: "Net collection rate target" },
      { value: 30, suffix: " days", decimals: 0, label: "Target days in AR" },
      { value: 5, suffix: "%", decimals: 0, label: "Target denial rate ceiling" },
    ],
    specialties: [
      "family-medicine",
      "internal-medicine",
      "cardiology",
      "orthopedics",
      "behavioral-health",
      "urgent-care",
    ],
    compliance:
      "All work on patient accounts happens inside your systems and GlobalMed's HIPAA-compliant environment under a BAA.",
    faqs: [
      {
        question: "What's the difference between billing and full RCM?",
        answer:
          "Billing starts when the claim is created. Revenue cycle management also covers eligibility before the visit, coding, patient statements and reporting, so one team is accountable end to end.",
      },
      {
        question: "How do you measure success?",
        answer:
          "We agree targets from your audit baseline, usually net collection rate, days in AR and denial rate, and report against them every month.",
      },
      {
        question: "How long does the transition take?",
        answer:
          "Typically two to four weeks, depending on your system access and backlog. [CLIENT TO CONFIRM]",
      },
    ],
  },
  {
    slug: "denial-management",
    name: "Denial management",
    metaTitle: "Denial Management and Appeals Services",
    metaDescription:
      "Recover denied claims and stop the next ones. We correct, appeal and trace every denial to its root cause for US practices.",
    eyebrow: "Denial management",
    headline: "Recover denied claims, then stop the same denials coming back",
    intro:
      "We work your denials by value and deadline, appeal what can be recovered, and fix the upstream cause so the same denial doesn't happen next month.",
    summary: "Recover denied claims and prevent the next.",
    problems: [
      "Denied claims age past the appeal deadline.",
      "The same denial reasons repeat month after month.",
      "Nobody has time to write appeal letters.",
    ],
    included: [
      {
        title: "Denial triage",
        body: "Every denial categorised by reason code, value and appeal deadline.",
      },
      {
        title: "Corrections and appeals",
        body: "Corrected claims resubmitted and written appeals sent with supporting documentation.",
      },
      {
        title: "Root-cause fixes",
        body: "Front-desk, coding or payer-rule causes fixed where they start.",
      },
      {
        title: "Denial reporting",
        body: "Denial rate by payer and reason, recovered dollars and trends.",
      },
    ],
    process: [
      {
        title: "Backlog review",
        body: "We size your open denials and prioritise by value and deadline.",
      },
      { title: "Recover", body: "Corrections and appeals go out, oldest high-value first." },
      {
        title: "Prevent",
        body: "We change the rules, templates or workflows that caused the denials.",
      },
      { title: "Monitor", body: "Monthly denial report tracks recoveries and new-denial rate." },
    ],
    results: [
      {
        value: 4,
        suffix: "%",
        decimals: 0,
        label: "Denial rate after six months, down from 12% (illustrative)",
      },
      { value: 70, suffix: "%", decimals: 0, label: "Appeal success target" },
      { value: 7, suffix: " days", decimals: 0, label: "Target time to work a new denial" },
    ],
    specialties: ["cardiology", "orthopedics", "behavioral-health", "family-medicine"],
    compliance:
      "Appeals include clinical documentation, so they are prepared only inside HIPAA-compliant systems under a BAA.",
    faqs: [
      {
        question: "Can you work only our old denials?",
        answer:
          "Yes. Many practices start with a one-time backlog project, then decide whether to continue with ongoing denial management.",
      },
      {
        question: "Which denials can still be recovered?",
        answer:
          "Most denials can be corrected or appealed within the payer's filing or appeal limit, often 60 to 180 days. We prioritise those closest to their deadline.",
      },
      {
        question: "What are the most common denial reasons?",
        answer:
          "Eligibility, missing prior authorization, coding and modifier errors, duplicate claims and timely filing. Our blog post on claim denials explains how to prevent each one.",
      },
    ],
    motion: "denial-bars",
  },
];

export const services: Service[] = raw.map((s) => serviceSchema.parse(s));
