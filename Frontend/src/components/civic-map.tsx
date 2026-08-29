"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { Crosshair, Layers, Minus, Plus } from "lucide-react";
import { CivicIssue, IssueCategory } from "@/types/issue";
import { label } from "@/lib/issue";

type Bounds = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};
type Props = {
  issues: CivicIssue[];
  selectedId?: string;
  onSelect: (issue: CivicIssue) => void;
  onBoundsChange: (bounds: Bounds) => void;
  target?: { lat: number; lng: number; zoom?: number };
};

const colors: Record<IssueCategory, string> = {
  pothole: "#e5484d",
  garbage: "#f38b1f",
  streetlight: "#d99a00",
  waterlogging: "#287adf",
  obstruction: "#8a55d7",
};

function markerIcon(issue: CivicIssue, selected: boolean) {
  const symbol =
    issue.category === "pothole"
      ? "●"
      : issue.category === "garbage"
        ? "◆"
        : issue.category === "streetlight"
          ? "✦"
          : issue.category === "waterlogging"
            ? "≈"
            : "▲";
  return L.divIcon({
    className: "",
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    html: `<span class="civic-marker${selected ? " is-selected" : ""}" style="--marker-color:${colors[issue.category]}">${symbol}</span>`,
  });
}

function clusterIssues(issues: CivicIssue[], zoom: number) {
  const cell = zoom < 13 ? 0.025 : zoom < 15 ? 0.008 : 0.0025;
  const groups = new Map<string, CivicIssue[]>();
  for (const issue of issues) {
    const key = `${Math.floor(issue.lat / cell)}:${Math.floor(issue.lng / cell)}`;
    groups.set(key, [...(groups.get(key) || []), issue]);
  }
  return [...groups.values()];
}

function MapEvents({
  onBoundsChange,
}: {
  onBoundsChange: Props["onBoundsChange"];
}) {
  const map = useMapEvents({
    moveend() {
      const b = map.getBounds();
      onBoundsChange({
        minLat: b.getSouth(),
        maxLat: b.getNorth(),
        minLng: b.getWest(),
        maxLng: b.getEast(),
      });
    },
  });
  useEffect(() => {
    map.fire("moveend");
  }, [map]);
  return null;
}

function ZoomListener({ onZoom }: { onZoom: (zoom: number) => void }) {
  const map = useMapEvents({ zoomend: () => onZoom(map.getZoom()) });
  useEffect(() => onZoom(map.getZoom()), [map, onZoom]);
  return null;
}

function FlyToTarget({ target }: Pick<Props, "target">) {
  const map = useMap();
  useEffect(() => {
    if (target)
      map.flyTo([target.lat, target.lng], target.zoom ?? 15, { duration: 0.8 });
  }, [map, target]);
  return null;
}

function Controls() {
  const map = useMap();
  const [locating, setLocating] = useState(false);
  const [terrain, setTerrain] = useState(false);
  const locate = () => {
    if (!navigator.geolocation)
      return window.alert("Location is not supported by this browser.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        map.flyTo([coords.latitude, coords.longitude], 16);
        L.circleMarker([coords.latitude, coords.longitude], {
          radius: 8,
          color: "#fff",
          weight: 3,
          fillColor: "#1677ff",
          fillOpacity: 1,
        }).addTo(map);
        setLocating(false);
      },
      () => {
        window.alert(
          "We could not access your location. Check your browser permission and try again.",
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };
  return (
    <>
      <div className="leaflet-top leaflet-right civic-map-controls">
        <button aria-label="Zoom in" onClick={() => map.zoomIn()}>
          <Plus size={18} />
        </button>
        <button aria-label="Zoom out" onClick={() => map.zoomOut()}>
          <Minus size={18} />
        </button>
        <button
          aria-label="Use my location"
          onClick={locate}
          className={locating ? "is-loading" : ""}
        >
          <Crosshair size={18} />
        </button>
        <button
          aria-label="Toggle map layer"
          onClick={() => setTerrain(!terrain)}
          className={terrain ? "is-active" : ""}
        >
          <Layers size={18} />
        </button>
      </div>
      {terrain && (
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        />
      )}
    </>
  );
}

export default function CivicMap({
  issues,
  selectedId,
  onSelect,
  onBoundsChange,
  target,
}: Props) {
  const [zoom, setZoom] = useState(13);
  const mapRef = useRef<L.Map | null>(null);
  const clusters = useMemo(() => clusterIssues(issues, zoom), [issues, zoom]);
  return (
    <MapContainer
      center={[28.6139, 77.209]}
      zoom={13}
      zoomControl={false}
      className="civic-leaflet-map"
      ref={mapRef}
      whenReady={() => setZoom(mapRef.current?.getZoom() ?? 13)}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onBoundsChange={onBoundsChange} />
      <ZoomListener onZoom={setZoom} />
      <FlyToTarget target={target} />
      <Controls />
      {clusters.map((group) => {
        const lat =
          group.reduce((total, issue) => total + issue.lat, 0) / group.length;
        const lng =
          group.reduce((total, issue) => total + issue.lng, 0) / group.length;
        if (group.length > 1)
          return (
            <Marker
              key={`${group[0].id}-${group.length}-${zoom}`}
              position={[lat, lng]}
              icon={L.divIcon({
                className: "",
                iconSize: [46, 46],
                iconAnchor: [23, 23],
                html: `<span class="civic-cluster">${group.length}</span>`,
              })}
              eventHandlers={{
                click: () =>
                  mapRef.current?.flyTo([lat, lng], Math.min(18, zoom + 2)),
              }}
            />
          );
        const issue = group[0];
        return (
          <Marker
            key={issue.id}
            position={[issue.lat, issue.lng]}
            icon={markerIcon(issue, issue.id === selectedId)}
            eventHandlers={{ click: () => onSelect(issue) }}
          >
            <Popup className="civic-popup" offset={[0, -12]}>
              <img src={issue.imageUrl} alt="" />
              <p className="civic-popup-kicker">{label(issue.category)}</p>
              <b>{issue.address}</b>
              <p>
                {issue.aiSummary ||
                  issue.description ||
                  "Civic issue reported by a resident."}
              </p>
              <div>
                <span>Priority {issue.priority}</span>
                <span>{issue.reportCount} reports</span>
              </div>
              <Link href={`/issues/${issue.id}`}>View details</Link>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
