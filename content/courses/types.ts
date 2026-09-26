/**
 * Long-form copy for the AAPC course pages (/education/cpc, /cpb, /cpc-cpb). Supplied by the
 * client on 2026-09-26; edit the text in content/courses/<slug>.ts. Facts shared with cards
 * (price, package, duration) live in data/courses.ts.
 *
 * [CLIENT TO CONFIRM] AAPC's approval to use its course descriptions on the GlobalMed site.
 */

/** A titled (or untitled) list of points. */
export type CourseGroup = { title?: string; items: string[] };

export type CoursePageContent = {
  /** "What is a …?" — or, for the dual course, an intro plus the two definitions side by side. */
  intro: {
    heading: string;
    paragraphs: string[];
    columns?: { heading: string; body: string }[];
  };
  why: { heading: string; groups: CourseGroup[] };
  /** Grouped cards, or tabs of grouped cards (dual course). */
  covers: {
    heading: string;
    groups?: CourseGroup[];
    tabs?: { label: string; groups: CourseGroup[] }[];
  };
  /** CPB® only: curriculum overview and training objectives. */
  curriculum?: {
    heading: string;
    paragraphs: string[];
    objectivesHeading: string;
    objectives: string[];
  };
  /** First line is always "Healthcare professionals and billers". */
  who: { heading: string; items: string[] };
  experience: { heading: string; paragraphs: string[] };
  maintaining: { heading: string; paragraphs: string[] };
  closing: { heading: string; paragraphs: string[] };
};
