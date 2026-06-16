import { createId } from "@/lib/utils";
import type { ChecklistItem } from "@/lib/types";

export function mergeChecklistItems(
  currentItems: ChecklistItem[],
  generatedItems: ChecklistItem[],
): ChecklistItem[] {
  const completedMap = new Map(currentItems.map((item) => [item.label, item.completed]));
  const mergedLabels = Array.from(
    new Set([...currentItems.map((item) => item.label), ...generatedItems.map((item) => item.label)]),
  );

  return mergedLabels.map((label) => ({
    id:
      currentItems.find((item) => item.label === label)?.id ??
      generatedItems.find((item) => item.label === label)?.id ??
      createId("check"),
    label,
    completed: completedMap.get(label) ?? false,
  }));
}