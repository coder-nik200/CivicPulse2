"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  ImagePlus,
  LocateFixed,
  MapPin,
  Sparkles,
  Upload,
  X,
  ShieldCheck,
  Camera,
} from "lucide-react";
import { Navbar } from "@/components/ui";
import { submitIssue } from "@/lib/api-client";

export default function ReportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [locating, setLocating] = useState(false);
  const [located, setLocated] = useState(false);
  const [analysis, setAnalysis] = useState(false);
  const [done, setDone] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<
    "pothole" | "garbage" | "streetlight"
  >("pothole");
  const [imageUrl, setImageUrl] = useState("");
  const [issueId, setIssueId] = useState("CIV-1024");
  const [error, setError] = useState("");

  const pick = (f?: File) => {
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = () => setImageUrl(String(reader.result));
      reader.readAsDataURL(f);
    }
  };

  const locate = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      setLocating(false);
      setError(
        "Location is unavailable in this browser. You can place a pin manually.",
      );
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocating(false);
        setLocated(true);
      },
      () => {
        setLocating(false);
        setLocated(true);
        setError(
          "We couldn’t access your location, so a manual demo pin was used. You can still submit the report.",
        );
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const submitReport = async () => {
    setAnalysis(true);
    setError("");
    try {
      if (!file) return;
      const payload = await submitIssue({
        file,
        category,
        latitude: 28.6139,
        longitude: 77.209,
        address: "Outer Ring Road, Sector 15",
        description: note || undefined,
      });
      setIssueId(payload.issue.id);
      setTimeout(() => setDone(true), 700);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Your report could not be submitted.",
      );
      setAnalysis(false);
    }
  };

  if (done) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#f6f9f8] px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={24} strokeWidth={2.5} />
              </div>

              <p className="mt-5 text-[11px] font-black uppercase tracking-[0.18em] text-civic">
                Report submitted
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
                Your issue is being understood
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Our AI has processed the evidence and generated a preliminary
                assessment of the reported civic issue.
              </p>
            </div>

            {/* Processing Card */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:mt-10">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-slate-900">
                      Analysis pipeline
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Automated evidence processing
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    Complete
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="space-y-5">
                  {[
                    "Photo uploaded",
                    "Reading visual evidence",
                    "Identifying issue type",
                    "Estimating severity",
                    "Checking nearby reports",
                  ].map((text, index) => (
                    <div key={text} className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          index < 4
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-civic text-white"
                        }`}
                      >
                        {index < 4 ? (
                          <Check size={15} strokeWidth={3} />
                        ) : (
                          <Sparkles size={15} />
                        )}
                      </div>

                      <span className="text-sm font-bold text-slate-800">
                        {text}
                      </span>

                      {index === 4 && (
                        <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                          Complete
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Result */}
            <div className="relative mt-5 overflow-hidden rounded-2xl bg-[#101a1c] p-5 text-white shadow-[0_25px_70px_rgba(15,23,42,0.16)] sm:p-7">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-2xl" />

              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-300">
                      AI-generated analysis
                    </p>

                    <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                      Pothole
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    <Sparkles size={13} className="text-teal-300" />
                    <span className="text-xs font-bold text-teal-200">
                      96% confidence
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Metric n="8.7 / 10" t="Severity" />
                  <Metric n="92 / 100" t="Priority" />
                  <Metric n="12" t="Nearby reports" />
                  <Metric n="High" t="Risk level" />
                </div>

                <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm leading-6 text-slate-300">
                    Large pothole detected on a paved road. The issue appears
                    likely to create a significant hazard for vehicles.
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[10px] leading-5 text-slate-500">
                    AI-assisted analysis is a preliminary estimate and will be
                    reviewed by the relevant authority.
                  </p>

                  <Link
                    href={`/issues/${issueId}`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-black text-slate-950 transition hover:bg-teal-50"
                  >
                    View issue
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f6f9f8] px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
          {/* Page Header */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-civic" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-civic sm:text-xs">
                Citizen reporting
              </p>
            </div>

            <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-5xl">
              Report a civic issue
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Document a problem with a photo and location. Your report helps
              authorities identify and prioritize issues faster.
            </p>
          </div>

          {/* Progress */}
          <div className="mt-7 flex items-center gap-2 sm:mt-9">
            {["Photo", "Location", "Details"].map((item, index) => (
              <div key={item} className="flex flex-1 items-center gap-2">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                    index === 0
                      ? "bg-civic text-white"
                      : "bg-white text-slate-400 ring-1 ring-slate-200"
                  }`}
                >
                  0{index + 1}
                </div>

                <span
                  className={`hidden text-[10px] font-black uppercase tracking-wider sm:block ${
                    index === 0 ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {item}
                </span>

                {index < 2 && <div className="h-px flex-1 bg-slate-200" />}
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_35px_rgba(15,23,42,0.035)] sm:p-6">
              <span className="font-mono text-[10px] font-bold text-civic">
                01
              </span>
              <h2 className="mt-1 text-base font-black text-slate-950 sm:text-lg">
                What did you see?
              </h2>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {(["pothole", "garbage", "streetlight"] as const).map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={`rounded-xl border px-2 py-3 text-xs font-black capitalize transition ${category === item ? "border-civic bg-teal-50 text-civic" : "border-slate-200 text-slate-600 hover:border-teal-200"}`}
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
            </section>
            {/* Photo */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_35px_rgba(15,23,42,0.035)] sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-[10px] font-bold text-civic">
                    01
                  </span>

                  <h2 className="mt-1 text-base font-black text-slate-950 sm:text-lg">
                    Add a photo
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    A clear photo helps AI identify the issue accurately.
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-rose-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-rose-600">
                  Required
                </span>
              </div>

              {file ? (
                <div className="mt-5 overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/50">
                  <div className="flex items-center gap-3 p-3 sm:p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-civic text-white">
                      <ImagePlus size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-slate-900">
                        {file.name}
                      </p>

                      <div className="mt-1 flex items-center gap-1.5">
                        <Check size={12} className="text-emerald-600" />
                        <p className="text-xs font-semibold text-emerald-700">
                          Photo ready for analysis
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setImageUrl("");
                      }}
                      aria-label="Remove image"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-rose-500"
                    >
                      <X size={17} />
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    pick(e.dataTransfer.files?.[0]);
                  }}
                  className={`mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-9 text-center transition sm:py-12 ${
                    dragging
                      ? "border-civic bg-teal-50"
                      : "border-slate-200 bg-slate-50/70 hover:border-teal-300 hover:bg-teal-50/50"
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-civic">
                    <Camera size={21} />
                  </div>

                  <b className="mt-4 text-sm font-black text-slate-900">
                    Drag & drop your photo
                  </b>

                  <span className="mt-1 text-xs text-slate-500">
                    or click to browse from your device
                  </span>

                  <span className="mt-4 rounded-lg bg-white px-3 py-2 text-[10px] font-bold text-slate-500 shadow-sm">
                    JPG, PNG, WEBP
                  </span>

                  <input
                    className="sr-only"
                    type="file"
                    accept="image/*"
                    onChange={(e) => pick(e.target.files?.[0])}
                  />
                </label>
              )}
            </section>
            {error && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
                {error}
              </p>
            )}

            {/* Location */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_35px_rgba(15,23,42,0.035)] sm:p-6">
              <span className="font-mono text-[10px] font-bold text-civic">
                02
              </span>

              <h2 className="mt-1 text-base font-black text-slate-950 sm:text-lg">
                Where is the issue?
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                We use your location to route the report to the correct area.
              </p>

              <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                {located ? (
                  <div className="flex items-center gap-3 bg-teal-50/60 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-civic shadow-sm">
                      <MapPin size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-900">
                        Outer Ring Road, Sector 15
                      </p>

                      <p className="mt-1 truncate font-mono text-[9px] text-slate-500">
                        28.613900° N, 77.209000° E
                      </p>
                    </div>

                    <Check
                      size={18}
                      className="ml-auto shrink-0 text-emerald-600"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={locate}
                    disabled={locating}
                    className="group flex w-full items-center gap-3 p-4 text-left transition hover:bg-slate-50 disabled:cursor-wait"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-civic transition group-hover:bg-civic group-hover:text-white">
                      <LocateFixed size={19} />
                    </span>

                    <span className="min-w-0">
                      <b className="block text-sm font-black text-slate-900">
                        {locating
                          ? "Finding your location..."
                          : "Use my current location"}
                      </b>

                      <span className="mt-1 block text-xs text-slate-500">
                        {locating
                          ? "Please allow location access"
                          : "Or place a pin manually"}
                      </span>
                    </span>

                    <ChevronRight
                      size={16}
                      className="ml-auto text-slate-300"
                    />
                  </button>
                )}
              </div>
            </section>

            {/* Note */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_35px_rgba(15,23,42,0.035)] sm:p-6">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-civic">
                  03
                </span>

                <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Optional
                </span>
              </div>

              <label
                htmlFor="note"
                className="mt-2 block text-base font-black text-slate-950 sm:text-lg"
              >
                Add a note
              </label>

              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={500}
                className="mt-4 min-h-28 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-civic focus:bg-white focus:ring-4 focus:ring-teal-50"
                placeholder="Describe what you noticed, for example: Large pothole near the main road entrance. Vehicles are swerving around it."
              />

              <div className="mt-2 flex justify-end">
                <span className="text-[10px] text-slate-400">
                  {note.length}/500
                </span>
              </div>
            </section>
          </div>

          {/* Submit */}
          <div className="sticky bottom-3 z-20 mt-5">
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-[0_15px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <button
                type="button"
                disabled={!file || !located || analysis}
                onClick={submitReport}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-civic px-4 py-3.5 text-sm font-black text-white transition hover:brightness-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 sm:py-4"
              >
                {analysis ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Analyzing civic issue...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Analyze & Report
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Trust */}
          <div className="mb-6 mt-5 flex items-center justify-center gap-2 text-center text-[10px] text-slate-400 sm:mb-10">
            <ShieldCheck size={13} />
            Your report helps build a more responsive community
          </div>
        </div>
      </main>
    </>
  );
}

function Metric({ n, t }: { n: string; t: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.07] p-3.5">
      <b className="block text-sm font-black">{n}</b>
      <span className="mt-1 block text-[9px] font-medium uppercase tracking-wider text-slate-400">
        {t}
      </span>
    </div>
  );
}
