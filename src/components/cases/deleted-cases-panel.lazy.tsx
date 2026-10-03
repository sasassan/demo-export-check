"use client";

import dynamic from "next/dynamic";

import { SkeletonLines } from "@/components/ui/skeleton";

export const DeletedCasesPanel = dynamic(
  () =>
    import("./deleted-cases-panel").then((mod) => mod.DeletedCasesPanel),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <SkeletonLines count={5} />
      </div>
    ),
  },
);
