"use client";

import dynamic from "next/dynamic";

const LiveMapPreview = dynamic(
  () => import("./LiveMapPreview").then((m) => m.LiveMapPreview),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 animate-pulse rounded-xl bg-slate-100" />
    ),
  },
);

export default LiveMapPreview;
