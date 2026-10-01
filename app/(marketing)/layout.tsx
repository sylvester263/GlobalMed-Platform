import { HelpButton } from "@/components/marketing/help-button";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { TopBar } from "@/components/marketing/top-bar";
import { WhatsAppButton } from "@/components/marketing/whatsapp-button";
import { features } from "@/config/features";
import { JsonLd, organizationJsonLd } from "@/lib/seo/json-ld";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-ink px-4 py-3 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      {/* Scrolls away; the header below is sticky (2026-10-02). */}
      <TopBar />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter />
      {/* The floating WhatsApp button is replaced by the help button (client, 2026-09-27). */}
      {features.floatingWhatsApp ? (
        <WhatsAppButton placement="floating" variant="floating" />
      ) : (
        <HelpButton />
      )}
      <JsonLd data={organizationJsonLd()} />
    </div>
  );
}
