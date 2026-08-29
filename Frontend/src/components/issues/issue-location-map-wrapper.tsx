"use client";

import dynamic from "next/dynamic";

const IssueLocationMap = dynamic(
  () => import("./issueLocationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse bg-slate-100" />
    ),
  }
);

export default function IssueLocationMapWrapper({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  return <IssueLocationMap lat={lat} lng={lng} />;
}