"use client";

import Link from "next/link";
import { useState } from "react";

import {
  AlertTriangle,
  ArrowRight,
  Construction,
  Lightbulb,
  MapPin,
  Menu,
  Trash2,
  X,
  LayoutDashboard,
  LogIn,
  LogOut,
  ShieldCheck,
  PlusCircle,
} from "lucide-react";

import type { CivicIssue, IssueCategory, IssueStatus } from "@/types/issue";

import { label } from "@/lib/issue";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

/* =========================================================
   CATEGORY ICON
========================================================= */

export const categoryIcon = (category: IssueCategory, size = 16) => {
  if (category === "pothole" || category === "obstruction") {
    return <Construction size={size} />;
  }

  if (category === "garbage") {
    return <Trash2 size={size} />;
  }

  if (category === "streetlight") {
    return <Lightbulb size={size} />;
  }

  return <AlertTriangle size={size} />;
};

/* =========================================================
   STATUS BADGE
========================================================= */

export function StatusBadge({ status }: { status: IssueStatus }) {
  const colors: Record<IssueStatus, string> = {
    REPORTED: "text-blue-700 bg-blue-50 border-blue-100",
    AI_ANALYZED: "text-violet-700 bg-violet-50 border-violet-100",
    VERIFIED: "text-cyan-700 bg-cyan-50 border-cyan-100",
    ASSIGNED: "text-amber-700 bg-amber-50 border-amber-100",
    IN_PROGRESS: "text-amber-800 bg-amber-100 border-amber-200",
    RESOLVED: "text-emerald-700 bg-emerald-50 border-emerald-100",
    RESOLUTION_VERIFIED: "text-emerald-700 bg-emerald-50 border-emerald-100",
    CLOSED: "text-slate-600 bg-slate-100 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-extrabold tracking-wide ${
        colors[status] ?? "border-slate-200 bg-slate-100 text-slate-600"
      }`}
    >
      {label(status)}
    </span>
  );
}

/* =========================================================
   SEVERITY BADGE
========================================================= */

export function SeverityBadge({ severity }: { severity: number }) {
  const text =
    severity >= 8
      ? "CRITICAL"
      : severity >= 6
        ? "HIGH"
        : severity >= 3
          ? "MEDIUM"
          : "LOW";

  const color =
    severity >= 8
      ? "text-red-700 bg-red-50"
      : severity >= 6
        ? "text-amber-700 bg-amber-50"
        : severity >= 3
          ? "text-blue-700 bg-blue-50"
          : "text-slate-600 bg-slate-100";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-extrabold ${color}`}
    >
      <AlertTriangle size={12} />
      {text} · {Number(severity).toFixed(1)}
    </span>
  );
}

/* =========================================================
   NAVBAR
========================================================= */

export function Navbar({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);

  const { user, logout } = useAuth();

  const closeMenu = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isAdmin = user?.role === "admin" || user?.role === "authority";

  const navText = dark
    ? "text-slate-300 hover:bg-white/10 hover:text-white"
    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-xl ${
        dark
          ? "border-white/10 bg-[#10201c]/95 text-white"
          : "border-slate-200/80 bg-white/95 text-slate-900"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* =====================================================
            LOGO
        ===================================================== */}

        <Link
          href="/"
          onClick={closeMenu}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span className="rem-4 grid place-items-center rounded-lg bg-white text-white">
            {/* <MapPin size={17} /> */}
            <Image src="/Logo.png" alt="Civic Fix" width={400} height={300} />
          </span>
          {/* CivicPulse */}
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}

        <div className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${navText}`}
          >
            Home
          </Link>

          <Link
            href="/map"
            className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${navText}`}
          >
            Civic Map
          </Link>

          <Link
            href="/report"
            className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${navText}`}
          >
            Report Issue
          </Link>

          {user && (
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${navText}`}
            >
              <LayoutDashboard size={15} />
              Dashboard
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${navText}`}
            >
              <ShieldCheck size={15} />
              Admin
            </Link>
          )}
        </div>

        {/* =====================================================
            DESKTOP RIGHT SIDE
        ===================================================== */}

        <div className="hidden items-center gap-2 md:flex">
          {!user ? (
            <>
              <Link
                href="/login"
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-bold transition ${
                  dark
                    ? "text-slate-200 hover:bg-white/10"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <LogIn size={16} />
                Login
              </Link>

              <Link
                href="/signup"
                className="flex items-center gap-2 rounded-lg bg-[#123d34] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-[#0d3029] hover:shadow-lg"
              >
                Sign Up
                <ArrowRight size={15} />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/report"
                className="flex items-center gap-2 rounded-lg bg-[#123d34] px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-[#0d3029] hover:shadow-lg"
              >
                <PlusCircle size={16} />
                Report Issue
              </Link>

              <Link
                href="/dashboard"
                className={`ml-1 flex items-center gap-2 rounded-xl px-2 py-1.5 transition ${
                  dark ? "hover:bg-white/10" : "hover:bg-slate-100"
                }`}
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-extrabold text-white shadow-sm">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>

                <div className="hidden max-w-[120px] text-left lg:block">
                  <p className="truncate text-xs font-extrabold">{user.name}</p>

                  <p
                    className={`truncate text-[10px] ${
                      dark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {user.role || "Citizen"}
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                title="Logout"
                aria-label="Logout"
                className={`grid h-9 w-9 place-items-center rounded-lg transition ${
                  dark
                    ? "text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                    : "text-slate-500 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                <LogOut size={17} />
              </button>
            </>
          )}
        </div>

        {/* =====================================================
            MOBILE MENU BUTTON
        ===================================================== */}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          className={`grid h-10 w-10 place-items-center rounded-xl transition md:hidden ${
            dark
              ? "text-slate-200 hover:bg-white/10"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {open && (
        <div
          className={`border-t px-4 pb-5 pt-3 shadow-xl md:hidden ${
            dark ? "border-white/10 bg-[#10201c]" : "border-slate-100 bg-white"
          }`}
        >
          <div className="mx-auto max-w-[1280px] space-y-1">
            <Link
              href="/"
              onClick={closeMenu}
              className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition ${navText}`}
            >
              <MapPin size={17} />
              Home
            </Link>

            <Link
              href="/map"
              onClick={closeMenu}
              className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition ${navText}`}
            >
              <MapPin size={17} />
              Civic Map
            </Link>

            <Link
              href="/report"
              onClick={closeMenu}
              className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition ${navText}`}
            >
              <PlusCircle size={17} />
              Report Issue
            </Link>

            {user && (
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition ${navText}`}
              >
                <LayoutDashboard size={17} />
                Dashboard
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                onClick={closeMenu}
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition ${navText}`}
              >
                <ShieldCheck size={17} />
                Admin Dashboard
              </Link>
            )}

            <Link
              href="/issues/CIV-1024"
              onClick={closeMenu}
              className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition ${navText}`}
            >
              <AlertTriangle size={17} />
              Issue Details
            </Link>

            <div
              className={`my-3 border-t ${
                dark ? "border-white/10" : "border-slate-200"
              }`}
            />

            {/* =================================================
                MOBILE AUTH
            ================================================= */}

            {!user ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${
                    dark
                      ? "border-white/10 text-white hover:bg-white/10"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <LogIn size={16} />
                  Login
                </Link>

                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#123d34] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0d3029]"
                >
                  Sign Up
                  <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  className={`flex items-center gap-3 rounded-2xl p-4 ${
                    dark ? "bg-white/5" : "bg-slate-50"
                  }`}
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 font-bold text-white">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold">
                      {user.name}
                    </p>

                    <p
                      className={`truncate text-xs ${
                        dark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {user.email}
                    </p>

                    <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      {user.role || "Citizen"}
                    </p>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                >
                  <LayoutDashboard size={17} />
                  Open Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

/* =========================================================
   ISSUE CARD
========================================================= */

export function IssueCard({
  issue,
  compact = false,
}: {
  issue: CivicIssue;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/issues/${issue.id}`}
      className="group block rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex gap-3">
        <img
          className="h-14 w-14 shrink-0 rounded-lg object-cover"
          src={issue.imageUrl}
          alt={`${label(issue.category)} evidence`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-extrabold">{label(issue.category)}</p>

            <SeverityBadge severity={issue.severity} />
          </div>

          <p className="mt-1 truncate text-[11px] font-medium text-slate-500">
            <MapPin className="mr-1 inline" size={12} />
            {issue.address}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <StatusBadge status={issue.status} />

            {!compact && (
              <span className="font-mono text-[10px] font-bold text-slate-500">
                P{issue.priority}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* =========================================================
   MAP CANVAS
========================================================= */

export function MapCanvas({
  issues,
  selected,
}: {
  issues: CivicIssue[];
  selected?: CivicIssue;
}) {
  return (
    <div
      className="relative h-full min-h-[420px] w-full overflow-hidden rounded-xl border border-slate-200 bg-[#e8f0ed]"
      aria-label="Interactive city issue map"
    >
      {/* Map background */}

      <div className="absolute inset-0 opacity-70">
        <div className="absolute left-[15%] top-0 h-full w-[7px] rotate-[18deg] bg-white shadow-sm" />
        <div className="absolute left-[45%] top-[-10%] h-[120%] w-[9px] rotate-[-22deg] bg-white shadow-sm" />
        <div className="absolute right-[22%] top-[-10%] h-[120%] w-[8px] rotate-[35deg] bg-white shadow-sm" />

        <div className="absolute left-0 top-[35%] h-[8px] w-full rotate-[4deg] bg-white shadow-sm" />
        <div className="absolute left-[-10%] top-[67%] h-[7px] w-[120%] rotate-[-8deg] bg-white shadow-sm" />

        <div className="absolute left-[25%] top-[20%] h-20 w-20 rounded-full bg-emerald-200/50" />
        <div className="absolute right-[15%] top-[45%] h-28 w-28 rounded-full bg-emerald-200/40" />
        <div className="absolute bottom-[12%] left-[45%] h-24 w-24 rounded-full bg-teal-200/40" />
      </div>

      {/* Map markers */}

      {issues.map((issue, index) => {
        const markerColor =
          issue.severity >= 8
            ? "bg-red-500"
            : issue.severity >= 6
              ? "bg-amber-500"
              : "bg-blue-500";

        return (
          <Link
            key={issue.id}
            href={`/issues/${issue.id}`}
            aria-label={`View ${issue.id}`}
            className={`absolute z-20 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-white text-white shadow-lg transition duration-200 hover:z-30 hover:scale-125 ${markerColor}`}
            style={{
              left: `${14 + ((index * 19) % 72)}%`,
              top: `${16 + ((index * 29) % 66)}%`,
            }}
          >
            {categoryIcon(issue.category, 15)}
          </Link>
        );
      })}

      {/* Selected issue */}

      {selected && (
        <div className="absolute bottom-5 left-5 z-30 w-[calc(100%-40px)] max-w-[290px] rounded-xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-extrabold">
                {label(selected.category)}
              </p>

              <p className="mt-1 font-mono text-[10px] text-slate-500">
                {selected.id}
              </p>
            </div>

            <StatusBadge status={selected.status} />
          </div>

          <p className="mt-3 text-xs text-slate-600">{selected.address}</p>

          <div className="mt-3 flex justify-between text-xs font-bold text-slate-700">
            <span>Severity {selected.severity}</span>

            <span>{selected.reportCount} reports</span>
          </div>

          <Link
            href={`/issues/${selected.id}`}
            className="mt-4 flex items-center gap-1 text-xs font-extrabold text-emerald-700"
          >
            View details
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Map controls */}

      <div className="absolute right-4 top-4 z-20 flex flex-col gap-2">
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg border border-white bg-white/95 text-lg font-bold text-slate-700 shadow-md"
          aria-label="Zoom in"
        >
          +
        </button>

        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg border border-white bg-white/95 text-lg font-bold text-slate-700 shadow-md"
          aria-label="Zoom out"
        >
          −
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   RE-EXPORT LABEL
========================================================= */

export { label };
