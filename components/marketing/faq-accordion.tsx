"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Faq } from "@/lib/content/schema";

/** The FAQ accordion (Base UI), as its own client module so it can hydrate on visibility. */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  return (
    <Accordion className="rounded-2xl border bg-card px-6">
      {faqs.map((faq) => (
        <AccordionItem key={faq.question} value={faq.question}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent className="text-base">{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
