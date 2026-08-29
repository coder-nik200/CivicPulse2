"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  MapPin,
  ShieldCheck,
  Navigation,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f8fc]">
      {/* Map-style background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #dbe4ef 1px, transparent 1px),
              linear-gradient(to bottom, #dbe4ef 1px, transparent 1px)
            `,
            backgroundSize: "55px 55px",
          }}
        />

        {/* Roads */}
        <div className="absolute -left-20 top-[18%] h-20 w-[120%] rotate-[-8deg] border-y border-slate-300/50 bg-white/40" />
        <div className="absolute -left-20 top-[58%] h-16 w-[120%] rotate-[12deg] border-y border-slate-300/50 bg-white/40" />
        <div className="absolute left-[20%] top-[-20%] h-[150%] w-20 rotate-[18deg] border-x border-slate-300/40 bg-white/30" />

        {/* Map zones */}
        <div className="absolute left-[8%] top-[12%] h-44 w-44 rounded-full bg-blue-100/40 blur-2xl" />
        <div className="absolute bottom-[8%] right-[8%] h-56 w-56 rounded-full bg-emerald-100/40 blur-2xl" />

        {/* Map pins */}
        <div className="absolute left-[12%] top-[28%] hidden md:block">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <MapPin size={17} />
          </div>
        </div>

        <div className="absolute right-[14%] top-[20%] hidden md:block">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
            <CheckCircle2 size={15} />
          </div>
        </div>

        <div className="absolute bottom-[22%] left-[18%] hidden md:block">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">
            <Navigation size={14} />
          </div>
        </div>
      </div>

      {/* Top branding */}
      <header className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-14">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
            <MapPin size={21} strokeWidth={2.4} />
          </div>

          <div>
            <div className="text-xl font-extrabold tracking-tight text-slate-900">
              Civic<span className="text-blue-600">Fix</span>
            </div>
            <div className="hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:block">
              Civic Issue Management
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-2 text-xs font-medium text-slate-500 sm:flex">
          <ShieldCheck size={15} className="text-emerald-500" />
          Secure citizen portal
        </div>
      </header>

      {/* Main */}
      <div className="relative z-10 flex min-h-[calc(100vh-81px)] items-center justify-center px-4 pb-10 pt-4 sm:px-6">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.12)] lg:grid-cols-[1fr_0.82fr]">
          {/* Left information section */}
          <section className="relative hidden overflow-hidden bg-[#0f2747] p-10 text-white lg:flex lg:p-12">
            {/* Map overlay */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: `
                  linear-gradient(30deg, #fff 12%, transparent 12.5%, transparent 87%, #fff 87.5%, #fff),
                  linear-gradient(150deg, #fff 12%, transparent 12.5%, transparent 87%, #fff 87.5%, #fff),
                  linear-gradient(30deg, #fff 12%, transparent 12.5%, transparent 87%, #fff 87.5%, #fff),
                  linear-gradient(150deg, #fff 12%, transparent 12.5%, transparent 87%, #fff 87.5%, #fff)
                `,
                backgroundSize: "70px 120px",
                backgroundPosition: "0 0, 0 0, 35px 60px, 35px 60px",
              }}
            />

            {/* Decorative circle */}
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />

            <div className="relative z-10 flex w-full flex-col justify-between">
              <div>
                <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white/80">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  CITY • COMMUNITY • ACTION
                </div>

                <h1 className="max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight xl:text-5xl">
                  Report problems.
                  <br />
                  <span className="text-blue-300">Improve your city.</span>
                </h1>

                <p className="mt-6 max-w-lg text-sm leading-7 text-slate-300">
                  CivicFix connects citizens with civic services through
                  location-based issue reporting, live maps, and transparent
                  issue tracking.
                </p>

                {/* Map preview */}
                <div className="relative mt-10 h-40 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        linear-gradient(45deg, transparent 48%, #fff 49%, #fff 51%, transparent 52%),
                        linear-gradient(-45deg, transparent 48%, #fff 49%, #fff 51%, transparent 52%)
                      `,
                      backgroundSize: "65px 65px",
                    }}
                  />

                  {/* Route */}
                  <div className="absolute left-[12%] top-[62%] h-1 w-[70%] rotate-[-12deg] rounded-full bg-blue-300/70" />

                  {/* Issue points */}
                  <div className="absolute left-[20%] top-[52%] flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg">
                    <MapPin size={13} />
                  </div>

                  <div className="absolute left-[48%] top-[39%] flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-lg">
                    <MapPin size={13} />
                  </div>

                  <div className="absolute right-[18%] top-[28%] flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                    <CheckCircle2 size={13} />
                  </div>

                  <div className="absolute bottom-3 left-4 rounded-lg bg-white/10 px-3 py-1.5 text-[10px] font-medium text-white/70 backdrop-blur">
                    LIVE CIVIC MAP
                  </div>
                </div>
              </div>

              {/* Bottom points */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                <div>
                  <p className="text-xl font-bold">01</p>
                  <p className="mt-1 text-xs text-slate-400">Report an issue</p>
                </div>

                <div>
                  <p className="text-xl font-bold">02</p>
                  <p className="mt-1 text-xs text-slate-400">Locate on map</p>
                </div>

                <div>
                  <p className="text-xl font-bold">03</p>
                  <p className="mt-1 text-xs text-slate-400">Track progress</p>
                </div>
              </div>
            </div>
          </section>

          {/* Login */}
          <section className="px-6 py-9 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <div className="mx-auto max-w-md">
              {/* Mobile logo */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <MapPin size={20} />
                </div>

                <div>
                  <p className="font-extrabold text-slate-900">
                    Civic<span className="text-blue-600">Fix</span>
                  </p>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    Civic Issue Management
                  </p>
                </div>
              </div>

              {/* Heading */}
              <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <ShieldCheck size={23} />
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Sign in to manage your civic reports and activity.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember */}
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-emerald-700 hover:text-emerald-800"
                  />

                  <span className="text-xs text-slate-500">
                    Keep me signed in
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#123d34] text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition  hover:bg-[#0d3029] hover:shadow-xl hover:shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  CivicFix
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Signup */}
              <p className="text-center text-sm text-slate-500">
                New to CivicFix?{" "}
                <Link
                  href="/signup"
                  className="font-bold text-emerald-700 hover:text-emerald-800"
                >
                  Create a citizen account
                </Link>
              </p>

              {/* Trust */}
              <div className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
                <ShieldCheck size={15} className="text-emerald-500" />
                Secure authentication for CivicFix citizens
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom */}
      <footer className="relative z-10 pb-5 text-center text-[11px] text-slate-400">
        CivicFix • Making civic reporting simpler and more transparent
      </footer>
    </main>
  );
}
