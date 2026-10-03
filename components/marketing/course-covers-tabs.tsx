"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { withReg } from "@/components/ui/reg";

/** The dual course's "What it covers" as two tabs (CPC® coding, CPB® billing). */
export function CourseCoversTabs({ tabs }: { tabs: { label: string; panel: React.ReactNode }[] }) {
  const first = tabs[0]?.label;
  return (
    <Tabs defaultValue={first} className="gap-6">
      <TabsList className="h-auto flex-wrap">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.label} value={tab.label} className="min-h-11 px-4 text-sm">
            {withReg(tab.label)}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.label} value={tab.label}>
          {tab.panel}
        </TabsContent>
      ))}
    </Tabs>
  );
}
