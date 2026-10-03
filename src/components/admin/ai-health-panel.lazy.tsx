"use client";

import dynamic from "next/dynamic";

import { SkeletonLines } from "@/components/ui/skeleton";

export const AiHealthPanel = dynamic(
  () => import("./ai-health-panel").then((mod) => mod.AiHealthPanel),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <SkeletonLines count={6} />
      </div>
    ),
  },
);
