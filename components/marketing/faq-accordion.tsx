"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { withReg } from "@/components/ui/reg";
import type { Faq } from "@/lib/content/schema";

/** The FAQ accordion (Base UI), as its own client module so it can hydrate on visibility. */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  return (
    <Accordion className="rounded-2xl border bg-card px-6">
      {faqs.map((faq) => (
        <AccordionItem key={faq.question} value={faq.question}>
          <AccordionTrigger>{withReg(faq.question)}</AccordionTrigger>
          <AccordionContent className="text-base">{withReg(faq.answer)}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
