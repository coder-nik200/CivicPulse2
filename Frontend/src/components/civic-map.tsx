"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import {
  AlertTriangle,
  Crosshair,
  ExternalLink,
  Layers,
  MapPin,
  Minus,
  Navigation,
  Plus,
  Users,
} from "lucide-react";

import { CivicIssue, IssueCategory } from "@/types/issue";
import { label } from "@/lib/issue";
import { AreaSeverity, areaSeverityStyle } from "@/lib/area-severity";

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
  target?: {
    lat: number;
    lng: number;
    zoom?: number;
  };
  areas?: {
    lat: number;
    lng: number;
    count: number;
    address: string;
    severity: AreaSeverity;
  }[];
};

const colors: Record<IssueCategory, string> = {
  pothole: "#e5484d",
  garbage: "#f38b1f",
  streetlight: "#d99a00",
  waterlogging: "#287adf",
  obstruction: "#8a55d7",
};

/* =========================================================
   MARKER
   ========================================================= */

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
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    html: `
      <div
        style="
          width:44px;
          height:44px;
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:9999px;
          border:3px solid white;
          background:${colors[issue.category]};
          color:white;
          font-size:17px;
          font-weight:900;
          box-shadow:0 6px 18px rgba(15,23,42,.28);
          transform:${selected ? "scale(1.18)" : "scale(1)"};
          transition:transform .2s ease;
        "
      >
        ${symbol}
      </div>
    `,
  });
}

/* =========================================================
   CLUSTER
   ========================================================= */

function clusterIssues(issues: CivicIssue[], zoom: number) {
  const cell = zoom < 13 ? 0.025 : zoom < 15 ? 0.008 : 0.0025;

  const groups = new Map<string, CivicIssue[]>();

  for (const issue of issues) {
    const key = `${Math.floor(
      issue.lat / cell,
    )}:${Math.floor(issue.lng / cell)}`;

    groups.set(key, [...(groups.get(key) || []), issue]);
  }

  return [...groups.values()];
}

/* =========================================================
   MAP EVENTS
   ========================================================= */

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

/* =========================================================
   ZOOM LISTENER
   ========================================================= */

function ZoomListener({
  onZoom,
}: {
  onZoom: (zoom: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const handleZoom = () => {
      onZoom(map.getZoom());
    };

    // Set initial zoom once
    onZoom(map.getZoom());

    map.on("zoomend", handleZoom);

    return () => {
      map.off("zoomend", handleZoom);
    };
  }, [map, onZoom]);

  return null;
}

/* =========================================================
   FLY TO TARGET
   ========================================================= */

function FlyToTarget({ target }: Pick<Props, "target">) {
  const map = useMap();

  useEffect(() => {
    if (!target) return;

    map.flyTo([target.lat, target.lng], target.zoom ?? 15, {
      duration: 0.8,
    });
  }, [map, target]);

  return null;
}

/* =========================================================
   MAP CONTROLS
   ========================================================= */

function Controls() {
  const map = useMap();

  const [locating, setLocating] = useState(false);

  const [terrain, setTerrain] = useState(false);

  const locate = () => {
    if (!navigator.geolocation) {
      window.alert("Location is not supported by this browser.");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const position: [number, number] = [coords.latitude, coords.longitude];

        map.flyTo(position, 16, {
          duration: 1,
        });

        L.circleMarker(position, {
          radius: 8,
          color: "#ffffff",
          weight: 3,
          fillColor: "#2563eb",
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
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  return (
    <>
      <div
        className="
          leaflet-top leaflet-right
          !top-4 !right-4
          flex flex-col gap-2
        "
      >
        <button
          type="button"
          aria-label="Zoom in"
          onClick={() => map.zoomIn()}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl border border-slate-200
            bg-white/95 text-slate-700
            shadow-lg shadow-slate-900/10
            backdrop-blur
            transition-all
            hover:-translate-y-0.5
            hover:bg-blue-600
            hover:text-white
            active:scale-95
            dark:border-slate-700
            dark:bg-slate-900/95
            dark:text-slate-200
          "
        >
          <Plus size={18} />
        </button>

        <button
          type="button"
          aria-label="Zoom out"
          onClick={() => map.zoomOut()}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl border border-slate-200
            bg-white/95 text-slate-700
            shadow-lg shadow-slate-900/10
            backdrop-blur
            transition-all
            hover:-translate-y-0.5
            hover:bg-blue-600
            hover:text-white
            active:scale-95
            dark:border-slate-700
            dark:bg-slate-900/95
            dark:text-slate-200
          "
        >
          <Minus size={18} />
        </button>

        <div className="mx-1 h-px bg-slate-300/70 dark:bg-slate-700" />

        <button
          type="button"
          aria-label="Use my location"
          onClick={locate}
          className={`
            flex h-10 w-10 items-center justify-center
            rounded-xl border border-slate-200
            bg-white/95
            shadow-lg shadow-slate-900/10
            backdrop-blur
            transition-all
            hover:-translate-y-0.5
            hover:bg-blue-600
            hover:text-white
            active:scale-95
            dark:border-slate-700
            dark:bg-slate-900/95
            dark:text-slate-200
            ${locating ? "animate-pulse text-blue-600" : "text-slate-700"}
          `}
        >
          <Crosshair size={18} />
        </button>

        <button
          type="button"
          aria-label="Toggle map layer"
          onClick={() => setTerrain(!terrain)}
          className={`
            flex h-10 w-10 items-center justify-center
            rounded-xl border
            shadow-lg shadow-slate-900/10
            backdrop-blur
            transition-all
            active:scale-95
            ${
              terrain
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 bg-white/95 text-slate-700 hover:bg-blue-600 hover:text-white dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200"
            }
          `}
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

/* =========================================================
   ISSUE POPUP
   ========================================================= */

function IssuePopup({ issue }: { issue: CivicIssue }) {
  const priority =
    typeof issue.priority === "string" ? issue.priority.toLowerCase() : "";
  const priorityClass =
    priority === "critical"
      ? "bg-red-100 text-red-700"
      : priority === "high"
        ? "bg-orange-100 text-orange-700"
        : priority === "medium"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-emerald-100 text-emerald-700";

  return (
    <div className="w-[300px] overflow-hidden rounded-2xl bg-white">
      {/* Image */}
      <div className="relative h-[155px] w-full overflow-hidden bg-slate-100">
        {issue.imageUrl ? (
          <img
            src={issue.imageUrl}
            alt={label(issue.category)}
            className="
              h-full w-full object-cover
              transition-transform duration-500
              hover:scale-105
            "
          />
        ) : (
          <div
            className="
              flex h-full w-full flex-col
              items-center justify-center
              gap-2 text-slate-400
            "
          >
            <MapPin size={30} />
            <span className="text-xs">No image available</span>
          </div>
        )}

        {/* Dark image gradient */}
        <div
          className="
            absolute inset-x-0 bottom-0 h-20
            bg-gradient-to-t from-black/60 to-transparent
          "
        />

        {/* Category */}
        <div
          className="
            absolute bottom-3 left-3
            flex items-center gap-2
            rounded-full
            bg-slate-950/70
            px-3 py-1.5
            text-[10px] font-bold
            text-white
            backdrop-blur-md
          "
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: colors[issue.category],
            }}
          />

          {label(issue.category)}
        </div>

        {/* Priority */}
        <div
          className={`
            absolute left-3 top-3
            flex items-center gap-1.5
            rounded-full px-2.5 py-1.5
            text-[10px] font-extrabold
            uppercase tracking-wide
            ${priorityClass}
          `}
        >
          <AlertTriangle size={11} />
          {issue.priority || "Normal"}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Label */}
        <p
          className="
            mb-1 text-[9px] font-extrabold
            uppercase tracking-[0.15em]
            text-blue-600
          "
        >
          Civic Issue
        </p>

        {/* Address */}
        <div className="flex items-start gap-2">
          <MapPin size={16} className="mt-0.5 shrink-0 text-blue-600" />

          <h3
            className="
              text-[15px] font-extrabold
              leading-5 text-slate-900
            "
          >
            {issue.address}
          </h3>
        </div>

        {/* Description */}
        <p
          className="
            mt-3 line-clamp-3
            text-xs leading-5
            text-slate-500
          "
        >
          {issue.aiSummary ||
            issue.description ||
            "Civic issue reported by a resident."}
        </p>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div
            className="
              flex items-center gap-2
              rounded-xl
              border border-slate-200
              bg-slate-50
              p-2.5
            "
          >
            <div
              className="
                flex h-7 w-7 shrink-0
                items-center justify-center
                rounded-lg bg-blue-50
                text-blue-600
              "
            >
              <Users size={14} />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-extrabold text-slate-900">
                {issue.reportCount ?? 1}
              </p>

              <p className="text-[9px] text-slate-400">Reports</p>
            </div>
          </div>

          <div
            className="
              flex items-center gap-2
              rounded-xl
              border border-slate-200
              bg-slate-50
              p-2.5
            "
          >
            <div
              className="
                flex h-7 w-7 shrink-0
                items-center justify-center
                rounded-lg bg-blue-50
                text-blue-600
              "
            >
              <Navigation size={14} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[11px] font-extrabold text-slate-900">
                {label(issue.category)}
              </p>

              <p className="text-[9px] text-slate-400">Category</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/issues/${issue.id}`}
          className="
            mt-3 flex w-full
            items-center justify-center
            gap-2 rounded-xl
            bg-blue-600
            px-4 py-2.5
            text-xs font-bold
            text-white
            shadow-lg shadow-blue-600/20
            transition-all duration-200
            hover:-translate-y-0.5
            hover:bg-blue-700
            hover:shadow-blue-600/30
          "
        >
          View issue details
          <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN MAP
   ========================================================= */

export default function CivicMap({
  issues,
  selectedId,
  onSelect,
  onBoundsChange,
  target,
  areas = [],
}: Props) {
  const [zoom, setZoom] = useState(13);

  const mapRef = useRef<L.Map | null>(null);

  const clusters = useMemo(() => clusterIssues(issues, zoom), [issues, zoom]);

  return (
    <div
      className="
        relative h-[680px] w-full
        overflow-hidden
        rounded-3xl
        border border-slate-200
        bg-slate-100
        shadow-2xl shadow-slate-900/10
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      {/* =================================================
          TOP MAP HEADER
          ================================================= */}

      <div
        className="
          absolute left-4 top-4 z-[1000]
          flex items-center justify-between
          gap-5
          rounded-2xl
          border border-white/80
          bg-white/95
          px-4 py-3
          shadow-xl shadow-slate-900/10
          backdrop-blur-xl
          dark:border-slate-700
          dark:bg-slate-900/95
        "
      >
        <div>
          <div
            className="
              flex items-center gap-2
              text-sm font-extrabold
              text-slate-900
              dark:text-white
            "
          >
            <div
              className="
                flex h-7 w-7
                items-center justify-center
                rounded-lg
                bg-blue-600
                text-white
              "
            >
              <MapPin size={15} />
            </div>
            Live Civic Map
          </div>

          <p
            className="
              mt-1 text-[10px]
              text-slate-500
              dark:text-slate-400
            "
          >
            {issues.length} reported issue
            {issues.length !== 1 ? "s" : ""} in this area
          </p>
        </div>

        <div
          className="
            flex items-center gap-1.5
            rounded-full
            bg-emerald-50
            px-2.5 py-1.5
            text-[10px] font-bold
            text-emerald-700
            dark:bg-emerald-950/40
            dark:text-emerald-400
          "
        >
          <span
            className="
              h-1.5 w-1.5
              animate-pulse
              rounded-full
              bg-emerald-500
            "
          />
          Live
        </div>
      </div>

      {/* =================================================
          MAP
          ================================================= */}

      <MapContainer
        center={[28.6139, 77.209]}
        zoom={13}
        zoomControl={false}
        className="h-full w-full"
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

        {/* =================================================
            AREA SEVERITY
            ================================================= */}

        {areas
          .filter((area) => area.count > 1)
          .map((area) => {
            const style = areaSeverityStyle[area.severity];

            return (
              <Circle
                key={`${area.lat}-${area.lng}`}
                center={[area.lat, area.lng]}
                radius={style.radius}
                pathOptions={{
                  color: style.color,
                  fillColor: style.color,
                  fillOpacity: 0.12,
                  weight: 1.5,
                }}
              >
                <Popup>
                  <div className="flex items-start gap-3 p-2">
                    <div
                      className="
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        rounded-xl
                        bg-orange-50
                        text-orange-600
                      "
                    >
                      <AlertTriangle size={17} />
                    </div>

                    <div>
                      <p className="text-xs font-extrabold text-slate-900">
                        {area.address}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        {area.count} issues · {area.severity} concentration
                      </p>
                    </div>
                  </div>
                </Popup>
              </Circle>
            );
          })}

        {/* =================================================
            ISSUE MARKERS
            ================================================= */}

        {clusters.map((group) => {
          const lat =
            group.reduce((total, issue) => total + issue.lat, 0) / group.length;

          const lng =
            group.reduce((total, issue) => total + issue.lng, 0) / group.length;

          {
            /* Cluster */
          }
          if (group.length > 1) {
            return (
              <Marker
                key={`${group[0].id}-${group.length}-${zoom}`}
                position={[lat, lng]}
                icon={L.divIcon({
                  className: "",
                  iconSize: [58, 58],
                  iconAnchor: [29, 29],
                  html: `
                    <div
                      style="
                        width:58px;
                        height:58px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        border-radius:9999px;
                        border:5px solid white;
                        background:#2563eb;
                        color:white;
                        font-size:17px;
                        font-weight:800;
                        box-shadow:
                          0 8px 25px rgba(37,99,235,.35),
                          0 0 0 6px rgba(37,99,235,.15);
                      "
                    >
                      ${group.length}
                    </div>
                  `,
                })}
                eventHandlers={{
                  click: () =>
                    mapRef.current?.flyTo([lat, lng], Math.min(18, zoom + 2), {
                      duration: 0.7,
                    }),
                }}
              />
            );
          }

          {
            /* Single issue */
          }
          const issue = group[0];

          return (
            <Marker
              key={issue.id}
              position={[issue.lat, issue.lng]}
              icon={markerIcon(issue, issue.id === selectedId)}
              eventHandlers={{
                click: () => onSelect(issue),
              }}
            >
              <Popup
                className="civic-popup"
                offset={[0, -15]}
                closeButton
                maxWidth={320}
                minWidth={300}
              >
                <IssuePopup issue={issue} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* =================================================
          MAP LEGEND
          ================================================= */}

      <div
        className="
          absolute bottom-4 left-4 z-[1000]
          flex max-w-[calc(100%-32px)]
          items-center gap-3
          overflow-x-auto
          rounded-xl
          border border-white/80
          bg-white/95
          px-3 py-2
          shadow-xl shadow-slate-900/10
          backdrop-blur-xl
          dark:border-slate-700
          dark:bg-slate-900/95
        "
      >
        {[
          ["Pothole", colors.pothole],
          ["Garbage", colors.garbage],
          ["Streetlight", colors.streetlight],
          ["Water", colors.waterlogging],
          ["Obstruction", colors.obstruction],
        ].map(([name, color]) => (
          <div
            key={name}
            className="
              flex shrink-0
              items-center gap-1.5
              text-[10px]
              font-semibold
              text-slate-600
              dark:text-slate-300
            "
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: color,
              }}
            />

            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
