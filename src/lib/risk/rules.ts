import type { Grade } from "@/lib/types";

export function scoreToGrade(score: number): Grade {
  if (score >= 70) {
    return "C";
  }

  if (score >= 40) {
    return "B";
  }

  return "A";
}

export function maxGrade(grades: Grade[]): Grade {
  if (grades.includes("C")) {
    return "C";
  }

  if (grades.includes("B")) {
    return "B";
  }

  return "A";
}