import { services } from "@/content/services";
import { courses, instructors, pathways } from "@/content/school";
import { specialties } from "@/content/specialties";

/**
 * Read access to structured content. Phase 4 swaps the course functions to the
 * Supabase `courses` tables without changing their callers.
 */

export function getServices() {
  return services;
}
export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getSpecialties() {
  return specialties;
}
export function getSpecialty(slug: string) {
  return specialties.find((s) => s.slug === slug);
}

export function getCourses() {
  return courses;
}
export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}
export function getFeaturedCourses() {
  return courses.filter((c) => c.featured);
}

export function getPathways() {
  return pathways;
}
export function getPathway(slug: string) {
  return pathways.find((p) => p.slug === slug);
}

export function getInstructor(id: string) {
  return instructors.find((i) => i.id === id);
}

export function courseLessonMinutes(course: (typeof courses)[number]): number {
  return course.curriculum.reduce(
    (sum, m) => sum + m.lessons.reduce((s, l) => s + l.minutes, 0),
    0,
  );
}
