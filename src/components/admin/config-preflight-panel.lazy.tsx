"use client";

import dynamic from "next/dynamic";

import { SkeletonLines } from "@/components/ui/skeleton";

export const ConfigPreflightPanel = dynamic(
  () =>
    import("./config-preflight-panel").then((mod) => mod.ConfigPreflightPanel),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <SkeletonLines count={4} />
      </div>
    ),
  },
);
