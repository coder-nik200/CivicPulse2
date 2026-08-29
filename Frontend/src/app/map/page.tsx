"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Filter, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { CivicIssue, IssueCategory } from "@/types/issue";
import { label } from "@/lib/issue";

const CivicMap = dynamic(() => import("@/components/civic-map"), {
  ssr: false,
  loading: () => <div className="map-loading">Loading interactive map…</div>,
});
type Bounds = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};
type Place = { display_name: string; lat: string; lon: string };

export default function MapPage() {
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [category, setCategory] = useState<"all" | IssueCategory>("all");
  const [priority, setPriority] = useState("all");
  const [selected, setSelected] = useState<CivicIssue>();
  const [bounds, setBounds] = useState<Bounds>();
  const [target, setTarget] = useState<{
    lat: number;
    lng: number;
    zoom?: number;
  }>();
  const [search, setSearch] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const loadIssues = useCallback(async (nextBounds?: Bounds) => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (nextBounds)
      Object.entries(nextBounds).forEach(([key, value]) =>
        params.set(key, String(value)),
      );
    try {
      const response = await fetch(`/api/issues?${params}`);
      if (!response.ok) throw new Error("Unable to load civic issues.");
      const payload = await response.json();
      setIssues(payload.issues || []);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to load civic issues.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    loadIssues(bounds);
  }, [bounds, loadIssues]);
  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      if (search.trim().length < 3) return setPlaces([]);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(search)}`,
        );
        setPlaces(await response.json());
      } catch {
        setPlaces([]);
      }
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const visible = useMemo(
    () =>
      issues.filter(
        (issue) =>
          (category === "all" || issue.category === category) &&
          (priority === "all" ||
            (priority === "critical"
              ? issue.severity >= 8
              : priority === "high"
                ? issue.severity >= 6 && issue.severity < 8
                : priority === "medium"
                  ? issue.severity >= 3 && issue.severity < 6
                  : issue.severity < 3)),
      ),
    [issues, category, priority],
  );
  const chooseIssue = (issue: CivicIssue) => {
    setSelected(issue);
    setTarget({ lat: issue.lat, lng: issue.lng, zoom: 16 });
  };
  const choosePlace = (place: Place) => {
    setSearch(place.display_name.split(",")[0]);
    setPlaces([]);
    setTarget({ lat: Number(place.lat), lng: Number(place.lon), zoom: 15 });
  };

  return (
    <main className="map-product">
      <header className="map-topbar">
        <Link href="/" className="map-brand">
          <span>
            <MapPin size={17} />
          </span>
          CivicFix
        </Link>
        <div className="map-search">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search location or area"
            aria-label="Search location"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setPlaces([]);
              }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
          {places.length > 0 && (
            <div className="place-results">
              {places.map((place) => (
                <button
                  key={`${place.lat}-${place.lon}`}
                  onClick={() => choosePlace(place)}
                >
                  <MapPin size={14} />
                  <span>{place.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <Link href="/report" className="map-report">
          + Report issue
        </Link>
      </header>
      <div className="map-workspace">
        <aside className={`map-sidebar ${filtersOpen ? "open" : ""}`}>
          <div className="sidebar-heading">
            <div>
              <p>Explore your city</p>
              <h1>Nearby issues</h1>
            </div>
            <button
              className="mobile-close"
              onClick={() => setFiltersOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
          <div className="map-filters">
            <p>
              <Filter size={14} /> Filter markers
            </p>
            <FilterButtons
              title="Category"
              values={[
                "all",
                "pothole",
                "garbage",
                "streetlight",
                "waterlogging",
                "obstruction",
              ]}
              active={category}
              onChange={(value) => setCategory(value as "all" | IssueCategory)}
            />
            <FilterButtons
              title="Priority"
              values={["all", "critical", "high", "medium", "low"]}
              active={priority}
              onChange={setPriority}
            />
          </div>
          <div className="nearby-list">
            <div className="nearby-head">
              <span>{visible.length} issues in this area</span>
              {loading && <i>Updating…</i>}
            </div>
            {error && <p className="map-error">{error}</p>}
            {!loading && visible.length === 0 && (
              <p className="map-empty">
                No issues match these filters. Move the map or clear a filter.
              </p>
            )}
            {visible.map((issue) => (
              <button
                key={issue.id}
                className={`nearby-item ${selected?.id === issue.id ? "selected" : ""}`}
                onClick={() => chooseIssue(issue)}
              >
                <span
                  className="issue-dot"
                  style={{ background: categoryColor(issue.category) }}
                />
                <span>
                  <b>{label(issue.category)}</b>
                  <small>{issue.address}</small>
                  <em>
                    Priority {issue.priority} · {issue.reportCount} reports
                  </em>
                </span>
              </button>
            ))}
          </div>
        </aside>
        <section className="map-stage">
          <button
            className="mobile-filter"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal size={17} /> Filters
          </button>
          <div className="map-status">
            <span className="live-dot" />
            Live civic map <b>{visible.length} markers</b>
          </div>
          <CivicMap
            issues={visible}
            selectedId={selected?.id}
            onSelect={chooseIssue}
            onBoundsChange={setBounds}
            target={target}
          />
          {selected && (
            <div className="selected-sheet">
              <button
                onClick={() => setSelected(undefined)}
                aria-label="Close issue preview"
              >
                <X size={16} />
              </button>
              <img src={selected.imageUrl} alt="" />
              <div>
                <p>{label(selected.category)}</p>
                <b>{selected.address}</b>
                <span>
                  Priority {selected.priority} · {selected.reportCount} reports
                </span>
                <Link href={`/issues/${selected.id}`}>View details</Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function FilterButtons({
  title,
  values,
  active,
  onChange,
}: {
  title: string;
  values: string[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="filter-group">
      <b>{title}</b>
      <div>
        {values.map((value) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={active === value ? "active" : ""}
          >
            {value === "all" ? "All" : label(value)}
          </button>
        ))}
      </div>
    </div>
  );
}
function categoryColor(category: IssueCategory) {
  return {
    pothole: "#e5484d",
    garbage: "#f38b1f",
    streetlight: "#d99a00",
    waterlogging: "#287adf",
    obstruction: "#8a55d7",
  }[category];
}
