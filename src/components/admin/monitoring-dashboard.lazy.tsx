"use client";

import dynamic from "next/dynamic";

import { SkeletonLines } from "@/components/ui/skeleton";

export const MonitoringDashboard = dynamic(
  () => import("./monitoring-dashboard").then((mod) => mod.MonitoringDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <SkeletonLines count={10} />
      </div>
    ),
  },
);
