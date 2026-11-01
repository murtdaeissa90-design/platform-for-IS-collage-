import { SEMESTERS } from "@/data/semesters";
import { SUBJECT_ALIASES } from "@/data/aliases";

export const slugify = (name) =>
  String(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// قائمة موحّدة بكل المواد من كل السمسترات
export const ALL_SUBJECTS = Object.entries(SEMESTERS).flatMap(([semKey, sem]) =>
  sem.subjects.map(([name, icon, folder]) => ({
    name,
    icon,
    folder,
    slug: slugify(name),
    semester: semKey,
    aliases: SUBJECT_ALIASES[name] || [],
  }))
);

export const findSubject = (slug) => ALL_SUBJECTS.find((s) => s.slug === slug) || null;
export const folderOf = (name) => (ALL_SUBJECTS.find((s) => s.name === name) || {}).folder || name;

export const MATERIAL_KEYS = ["Lectures", "Exams", "Questions"];
