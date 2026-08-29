"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { Issue } from "@/types";
import { severityMeta } from "@/lib/utils";
import { Card, CardHeader } from "@/components/common/ui";

const SEVERITY_HEX: Record<Issue["severity"], string> = {
  low: "#64748b",
  medium: "#d97706",
  high: "#d97706",
  critical: "#dc2626",
};

function makeIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<span style="
      display:block;width:16px;height:16px;border-radius:9999px;
      background:${color};border:2.5px solid white;
      box-shadow:0 1px 4px rgba(15,23,42,0.4);
    "></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export function LiveMapPreview({ issues }: { issues: Issue[] }) {
  const center: [number, number] = [28.8955, 76.6066];

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Live Issue Map"
        subtitle="Real-time citizen reports across the city"
        action={
          <Link href="/map" className="text-sm font-medium text-civic hover:text-civic-dark">
            Open full map
          </Link>
        }
      />
      <div className="h-80 w-full">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {issues.map((issue) => (
            <Marker
              key={issue.id}
              position={[issue.location.lat, issue.location.lng]}
              icon={makeIcon(SEVERITY_HEX[issue.severity])}
            >
              <Popup>
                <p className="text-xs font-semibold">{issue.title}</p>
                <p className="text-xs text-slate-500">{issue.location.address}</p>
                <p className="mt-1 text-xs font-medium">{severityMeta[issue.severity].label} severity</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </Card>
  );
}
