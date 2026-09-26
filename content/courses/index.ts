import type { AapcCourseSlug } from "@/data/courses";

import { cpbContent } from "./cpb";
import { cpcContent } from "./cpc";
import { cpcCpbContent } from "./cpc-cpb";
import type { CoursePageContent } from "./types";

export type { CourseGroup, CoursePageContent } from "./types";

/** Long-form copy for each AAPC course page. */
export const coursePageContent: Record<AapcCourseSlug, CoursePageContent> = {
  cpc: cpcContent,
  cpb: cpbContent,
  "cpc-cpb": cpcCpbContent,
};
