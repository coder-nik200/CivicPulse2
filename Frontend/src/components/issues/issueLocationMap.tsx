"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, CircleMarker, ZoomControl } from "react-leaflet";

type Props = {
  lat: number;
  lng: number;
};

const issueIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width:36px;
      height:36px;
      border-radius:50%;
      background:#2563EB;
      display:flex;
      align-items:center;
      justify-content:center;
      border:3px solid white;
      box-shadow:0 6px 18px rgba(0,0,0,.25);
      color:white;
      font-size:18px;">
      🗑️
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

export default function IssueLocationMap({ lat, lng }: Props) {
  const nearby = [
    { lat: lat + 0.0014, lng: lng - 0.0016, color: "#3B82F6", r: 14 },
    { lat: lat - 0.0011, lng: lng + 0.0018, color: "#F59E0B", r: 14 },
    { lat: lat + 0.0018, lng: lng + 0.0013, color: "#EF4444", r: 16 },
    { lat: lat - 0.0018, lng: lng - 0.0008, color: "#F59E0B", r: 13 },
  ];

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      zoomControl={false}
      className="h-full w-full"
    >
      <ZoomControl position="topright" />

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Main issue marker */}
      <Marker position={[lat, lng]} icon={issueIcon} />

      {/* Decorative nearby markers like the mockup */}
      {nearby.map((item, index) => (
        <CircleMarker
          key={index}
          center={[item.lat, item.lng]}
          radius={item.r}
          pathOptions={{
            color: "white",
            weight: 3,
            fillColor: item.color,
            fillOpacity: 1,
          }}
        />
      ))}

      {/* Soft hotspot circles */}
      <CircleMarker
        center={[lat + 0.0024, lng - 0.002]}
        radius={32}
        pathOptions={{
          color: "transparent",
          fillColor: "#A7F3D0",
          fillOpacity: 0.28,
        }}
      />

      <CircleMarker
        center={[lat - 0.002, lng + 0.0022]}
        radius={40}
        pathOptions={{
          color: "transparent",
          fillColor: "#A7F3D0",
          fillOpacity: 0.22,
        }}
      />
    </MapContainer>
  );
}